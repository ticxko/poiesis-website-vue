// Poiesis enquiry + contact backend.
//
// Node HTTP server, listens on 127.0.0.1:PORT behind nginx. Endpoints:
//   POST /api/enquiry         — structured enquiry (JSON) -> SQLite + JSONL + email + Drive archival
//   POST /api/enquiry/upload  — one image, sent as the RAW request body (no multipart), stored under
//                               UPLOAD_ROOT/<draftId>/<fileId>.<ext>; referenced by the final enquiry
//   POST /api/contact         — legacy simple contact form { name,email,phone,message }, mapped into the
//                               same pipeline so old links / cached JS keep working
//   GET  /healthz
//
// A lead is never lost: each submission is written to an append-only JSONL mirror AND a SQLite row AND
// emailed to the studio — independently. Success is returned to the client as soon as the lead is
// persisted (JSONL or DB), even if the email send later fails, so the client never double-submits.
//
// Archival: an async sweep (setInterval) copies each enquiry — a human-readable enquiry.md, an
// enquiry.json, and the uploaded photos — into its own Google Drive folder via rclone. Decoupled from
// the request path and retried on failure. The destination folder is already shared with the studio, so
// each new subfolder inherits that access.

import http from 'node:http';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_HTML_PATH = path.join(SCRIPT_DIR, 'admin.html');

// Backstop: a lead-capture service must never die on a stray async error (e.g. a socket EPIPE from a
// child process). Log loudly and keep serving; systemd still restarts on a hard exit.
process.on('uncaughtException', (err) => console.error('[uncaught]', err?.stack || err));
process.on('unhandledRejection', (reason) => console.error('[unhandledRejection]', reason?.stack || reason));

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '127.0.0.1';

// Sender is the dedicated enquiry mailbox on the kvm4 mail server (DKIM-signed for poiesis.id).
const FROM          = process.env.CONTACT_FROM          || 'Poiesis Enquiries <enquiry@poiesis.id>';
const ENVELOPE_FROM = process.env.CONTACT_ENVELOPE_FROM || 'enquiry@poiesis.id';
const RECIPIENTS = (
  process.env.CONTACT_RECIPIENTS ||
  'mayang.poiesis@gmail.com,ticxko@gmail.com,nice.permadi92@gmail.com'
).split(',').map((s) => s.trim()).filter(Boolean);

const DATA_DIR    = process.env.DATA_DIR    || '/var/lib/poiesis-enquiries';
const DB_PATH     = process.env.DB_PATH     || path.join(DATA_DIR, 'enquiries.db');
const JSONL_PATH  = process.env.JSONL_PATH  || path.join(DATA_DIR, 'enquiries.jsonl');
const UPLOAD_ROOT = process.env.UPLOAD_ROOT || path.join(DATA_DIR, 'uploads');

// Google Drive archival (rclone). DRIVE_DEST is an rclone remote path; each enquiry becomes a subfolder.
const DRIVE_ENABLED = String(process.env.DRIVE_ENABLED ?? 'true') === 'true';
const RCLONE_BIN    = process.env.RCLONE_BIN    || 'rclone';
const RCLONE_CONFIG = process.env.RCLONE_CONFIG || path.join(DATA_DIR, 'rclone.conf');
const DRIVE_DEST    = process.env.DRIVE_DEST    || 'gdrive:11 POIESIS/2-CLIENT-ENQUIRY';
const ARCHIVE_TZ    = process.env.ENQUIRY_TZ    || 'Asia/Jakarta';
const SENDMAIL_BIN  = process.env.SENDMAIL_BIN  || '/usr/sbin/sendmail';

const JSON_MAX_BYTES         = 256 * 1024;
const UPLOAD_MAX_BYTES       = 8 * 1024 * 1024;
const DRAFT_MAX_FILES        = 8;
const DRAFT_MAX_BYTES        = 40 * 1024 * 1024;
const EMAIL_ATTACH_MAX_TOTAL = 10 * 1024 * 1024;
const ARCHIVE_MAX_ATTEMPTS   = 5;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Human labels (Bahasa Indonesia) for the enum-valued fields.
const SCOPE_LABELS  = { arsitektur: 'Arsitektur', interior: 'Interior', keduanya: 'Arsitektur & Interior' };
const WORK_LABELS   = { 'bangun-baru': 'Bangun Baru', 'renovasi-total': 'Renovasi Total', 'renovasi-minor': 'Renovasi Minor', penambahan: 'Penambahan Ruang', 'fit-out': 'Fit-out Interior' };
const BUDGET_LABELS = { '<500': 'Di bawah Rp500 juta', '500-1000': 'Rp500 juta – Rp1 miliar', '1000-2500': 'Rp1 – 2,5 miliar', '2500-5000': 'Rp2,5 – 5 miliar', '>5000': 'Di atas Rp5 miliar', unknown: 'Belum tahu' };
const START_LABELS  = { '0-3': 'Dalam 3 bulan', '3-6': '3–6 bulan', '6-12': '6–12 bulan', '>12': 'Lebih dari setahun', unsure: 'Belum tahu / masih menjajaki' };
const FLOOR_LABELS  = { '1': '1 lantai', '2': '2 lantai', '3': '3 lantai', '4+': '4 lantai atau lebih', unsure: 'Belum tahu' };
const CHANNEL_LABELS = { whatsapp: 'WhatsApp', email: 'Email' };

// ---------------------------------------------------------------------------
// Bootstrap: dirs + database
// ---------------------------------------------------------------------------
for (const d of [DATA_DIR, UPLOAD_ROOT]) {
  try { fs.mkdirSync(d, { recursive: true }); } catch (e) { console.error('[boot] mkdir', d, e?.message); }
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');
db.exec(`
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  seq INTEGER,
  created_at TEXT NOT NULL,
  name TEXT,
  preferred_channel TEXT,
  email TEXT,
  whatsapp TEXT,
  scope TEXT,
  work_type TEXT,
  land_width_m REAL,
  land_length_m REAL,
  land_area_m2 REAL,
  location TEXT,
  floors TEXT,
  occupants TEXT,
  rooms TEXT,
  style_text TEXT,
  inspiration_links TEXT,
  budget_range TEXT,
  start_timeline TEXT,
  notes TEXT,
  images TEXT,
  draft_id TEXT,
  ip TEXT,
  user_agent TEXT,
  locale TEXT,
  source TEXT,
  raw TEXT,
  archived_at TEXT,
  archive_folder TEXT,
  archive_attempts INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_enq_created  ON enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enq_archived ON enquiries(archived_at);
`);

const insertStmt = db.prepare(`
INSERT INTO enquiries (
  id, seq, created_at, name, preferred_channel, email, whatsapp, scope, work_type,
  land_width_m, land_length_m, land_area_m2, location, floors, occupants, rooms,
  style_text, inspiration_links, budget_range, start_timeline, notes, images, draft_id,
  ip, user_agent, locale, source, raw, archived_at, archive_folder, archive_attempts
) VALUES (
  @id, @seq, @created_at, @name, @preferred_channel, @email, @whatsapp, @scope, @work_type,
  @land_width_m, @land_length_m, @land_area_m2, @location, @floors, @occupants, @rooms,
  @style_text, @inspiration_links, @budget_range, @start_timeline, @notes, @images, @draft_id,
  @ip, @user_agent, @locale, @source, @raw, NULL, NULL, 0
)`);
const nextSeqStmt      = db.prepare('SELECT COALESCE(MAX(seq), 0) + 1 AS n FROM enquiries');
const selectUnarchived = db.prepare('SELECT * FROM enquiries WHERE archived_at IS NULL AND archive_attempts < ? ORDER BY seq ASC LIMIT 1');
const markArchived     = db.prepare('UPDATE enquiries SET archived_at = @archived_at, archive_folder = @folder WHERE id = @id');
const bumpAttempts     = db.prepare('UPDATE enquiries SET archive_attempts = archive_attempts + 1 WHERE id = @id');
const draftClaimed     = db.prepare('SELECT 1 FROM enquiries WHERE draft_id = ? LIMIT 1');
const selectAllEnquiries = db.prepare('SELECT * FROM enquiries ORDER BY seq DESC');

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

// Collapse CR/LF/TAB to a space to prevent header injection.
function sanitizeHeader(s) { return String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim(); }

function isValidEmail(s) {
  return typeof s === 'string' && s.length > 2 && s.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function clampStr(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : (v == null ? '' : String(v).trim().slice(0, max)); }
function num(v) { const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(n) && n >= 0 && n < 1e7 ? n : null; }
function pick(v, allowed) { const s = clampStr(v, 40); return allowed.includes(s) ? s : ''; }
function escapeHtml(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// Filesystem-safe folder segment for the Drive folder name.
function sanitizeSegment(s) {
  return String(s ?? '').replace(/[\/\\:*?"<>|]+/g, ' ').replace(/[\x00-\x1f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
}
function sanitizeFilename(s) {
  const base = String(s ?? '').replace(/[\/\\:*?"<>|\x00-\x1f]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 120);
  return base || '';
}

function ymdInTz(date, tz) {
  try {
    const p = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    const g = (t) => p.find((x) => x.type === t)?.value || '';
    return `${g('year')}${g('month')}${g('day')}`;
  } catch { return date.toISOString().slice(0, 10).replace(/-/g, ''); }
}

function waLink(wa) {
  let d = String(wa ?? '').replace(/[^\d]/g, '');
  if (!d) return '';
  if (d.startsWith('0')) d = '62' + d.slice(1);
  else if (d.startsWith('8')) d = '62' + d;
  return 'https://wa.me/' + d;
}

// Read the raw request body into a Buffer, capped at maxBytes.
function readBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > maxBytes) { reject(Object.assign(new Error('Payload too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// Rate limiting (per-IP token bucket, in-memory)
// ---------------------------------------------------------------------------
const RL_CAP = 40;                              // burst
const RL_REFILL_PER_MS = 40 / (10 * 60 * 1000); // ~40 requests / 10 min sustained
const rl = new Map();
function rateOk(ip) {
  const now = Date.now();
  let e = rl.get(ip);
  if (!e) { e = { tokens: RL_CAP, ts: now }; rl.set(ip, e); }
  e.tokens = Math.min(RL_CAP, e.tokens + (now - e.ts) * RL_REFILL_PER_MS);
  e.ts = now;
  if (e.tokens < 1) return false;
  e.tokens -= 1;
  return true;
}
setInterval(() => { const now = Date.now(); for (const [ip, e] of rl) if (now - e.ts > 3_600_000) rl.delete(ip); }, 3_600_000).unref();

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------
function draftDir(draftId) { return path.join(UPLOAD_ROOT, draftId); }

function draftStats(draftId) {
  let count = 0, bytes = 0;
  try {
    for (const f of fs.readdirSync(draftDir(draftId))) {
      const st = fs.statSync(path.join(draftDir(draftId), f));
      if (st.isFile()) { count++; bytes += st.size; }
    }
  } catch { /* dir may not exist yet */ }
  return { count, bytes };
}

function sniffImage(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: 'image/jpeg', ext: 'jpg' };
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) return { mime: 'image/png', ext: 'png' };
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return { mime: 'image/webp', ext: 'webp' };
  return null;
}

async function handleUpload(req, res) {
  try {
    const draftId = sanitizeHeader(req.headers['x-draft-id'] || '');
    if (!UUID_RE.test(draftId)) return json(res, 400, { ok: false, error: 'Draft tidak valid' });

    const declared = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_MIME.has(declared)) return json(res, 415, { ok: false, error: 'Format tidak didukung (gunakan JPG, PNG, atau WebP)' });

    const { count, bytes } = draftStats(draftId);
    if (count >= DRAFT_MAX_FILES) return json(res, 413, { ok: false, error: 'Terlalu banyak foto' });

    const buf = await readBody(req, UPLOAD_MAX_BYTES);
    if (!buf.length) return json(res, 400, { ok: false, error: 'Berkas kosong' });
    if (bytes + buf.length > DRAFT_MAX_BYTES) return json(res, 413, { ok: false, error: 'Ukuran total foto terlalu besar' });

    const sniff = sniffImage(buf);
    if (!sniff) return json(res, 415, { ok: false, error: 'Berkas bukan gambar yang valid' });

    const fileId = randomUUID();
    fs.mkdirSync(draftDir(draftId), { recursive: true });
    fs.writeFileSync(path.join(draftDir(draftId), `${fileId}.${sniff.ext}`), buf);
    return json(res, 200, { ok: true, fileId });
  } catch (err) {
    const status = err?.status || 500;
    console.error('[upload] error:', err?.message || err);
    return json(res, status, { ok: false, error: status === 500 ? 'Gagal mengunggah' : err.message });
  }
}

// Resolve the on-disk files an enquiry references (by fileId within its draft dir).
function resolveFiles(draftId, images) {
  if (!draftId || !UUID_RE.test(draftId) || !Array.isArray(images)) return [];
  const dir = draftDir(draftId);
  let dirFiles = [];
  try { dirFiles = fs.readdirSync(dir); } catch { return []; }
  const out = [];
  for (const im of images.slice(0, DRAFT_MAX_FILES)) {
    const fid = String(im?.fileId || '');
    if (!UUID_RE.test(fid)) continue;
    const match = dirFiles.find((f) => f.startsWith(fid + '.'));
    if (!match) continue;
    const full = path.join(dir, match);
    let size = 0;
    try { size = fs.statSync(full).size; } catch { continue; }
    const ext = path.extname(match).slice(1).toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    out.push({ fileId: fid, name: sanitizeFilename(im?.name) || match, path: full, size, mime, ext });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Payload mapping
// ---------------------------------------------------------------------------
function mapEnquiry(d) {
  const c = d.contact || {}, p = d.project || {}, v = d.vision || {}, b = d.budget || {}, land = p.land || {};
  const width = num(land.widthM), length = num(land.lengthM);
  const area = num(land.areaM2) ?? (width != null && length != null ? Math.round(width * length * 100) / 100 : null);
  return {
    name: clampStr(c.nama, 120),
    preferred_channel: pick(c.preferredChannel, ['whatsapp', 'email']),
    email: clampStr(c.email, 200).toLowerCase(),
    whatsapp: clampStr(c.whatsapp, 40),
    scope: pick(p.scope, ['arsitektur', 'interior', 'keduanya']),
    work_type: pick(p.workType, ['bangun-baru', 'renovasi-total', 'renovasi-minor', 'penambahan', 'fit-out']),
    land_width_m: width, land_length_m: length, land_area_m2: area,
    location: clampStr(p.location, 200),
    floors: clampStr(p.floors, 12),
    occupants: clampStr(v.occupants, 2000),
    rooms: Array.isArray(v.rooms) ? v.rooms.map((x) => clampStr(x, 80)).filter(Boolean).slice(0, 40) : [],
    style_text: clampStr(v.styleText, 4000),
    inspiration_links: Array.isArray(v.inspirationLinks) ? v.inspirationLinks.map((x) => clampStr(x, 500)).filter(Boolean).slice(0, 10) : [],
    budget_range: clampStr(b.range, 40),
    start_timeline: clampStr(b.startTime, 40),
    notes: clampStr(d.notes, 4000),
    images: Array.isArray(v.images) ? v.images : [],
    draft_id: UUID_RE.test(String(d.draftId || '')) ? d.draftId : '',
    locale: clampStr(d.meta?.locale, 20) || 'id-ID',
    source: clampStr(d.meta?.source, 40) || 'enquiry-wizard',
    raw: d,
  };
}

function mapLegacy(d) {
  return {
    name: clampStr(d.name, 120), preferred_channel: '', email: clampStr(d.email, 200).toLowerCase(),
    whatsapp: clampStr(d.phone, 40), scope: '', work_type: '',
    land_width_m: null, land_length_m: null, land_area_m2: null, location: '', floors: '',
    occupants: '', rooms: [], style_text: '', inspiration_links: [], budget_range: '', start_timeline: '',
    notes: clampStr(d.message, 10000), images: [], draft_id: '', locale: 'id-ID', source: 'contact-legacy', raw: d,
  };
}

function toDbRow(r) {
  return {
    id: r.id, seq: r.seq, created_at: r.created_at,
    name: r.name || '', preferred_channel: r.preferred_channel || '', email: r.email || '', whatsapp: r.whatsapp || '',
    scope: r.scope || '', work_type: r.work_type || '',
    land_width_m: r.land_width_m ?? null, land_length_m: r.land_length_m ?? null, land_area_m2: r.land_area_m2 ?? null,
    location: r.location || '', floors: r.floors || '',
    occupants: r.occupants || '', rooms: JSON.stringify(r.rooms || []),
    style_text: r.style_text || '', inspiration_links: JSON.stringify(r.inspiration_links || []),
    budget_range: r.budget_range || '', start_timeline: r.start_timeline || '', notes: r.notes || '',
    images: JSON.stringify(r.images || []), draft_id: r.draft_id || '',
    ip: r.ip || '', user_agent: r.user_agent || '', locale: r.locale || '', source: r.source || '',
    raw: JSON.stringify(r.raw || {}),
  };
}

// ---------------------------------------------------------------------------
// Rendering: shared field list -> text / markdown / html
// ---------------------------------------------------------------------------
function labelledFields(r, files) {
  const land = r.land_width_m != null && r.land_length_m != null
    ? `${r.land_width_m} × ${r.land_length_m} m${r.land_area_m2 ? ` (≈ ${r.land_area_m2} m²)` : ''}`
    : (r.land_width_m != null || r.land_length_m != null ? `${r.land_width_m ?? '?'} × ${r.land_length_m ?? '?'} m` : '');
  return [
    ['Nama', r.name],
    ['Kontak pilihan', CHANNEL_LABELS[r.preferred_channel] || ''],
    ['WhatsApp', r.whatsapp],
    ['Email', r.email],
    ['Lingkup', SCOPE_LABELS[r.scope] || r.scope],
    ['Jenis pekerjaan', WORK_LABELS[r.work_type] || r.work_type],
    ['Ukuran lahan', land],
    ['Lokasi', r.location],
    ['Jumlah lantai', FLOOR_LABELS[r.floors] || r.floors],
    ['Penghuni / pengguna', r.occupants],
    ['Ruang yang dibutuhkan', (r.rooms || []).join(', ')],
    ['Gaya yang diharapkan', r.style_text],
    ['Tautan inspirasi', (r.inspiration_links || []).join('\n')],
    ['Foto terlampir', files.length ? `${files.length} foto` : ''],
    ['Perkiraan anggaran', BUDGET_LABELS[r.budget_range] || r.budget_range],
    ['Rencana mulai', START_LABELS[r.start_timeline] || r.start_timeline],
    ['Catatan tambahan', r.notes],
  ].filter(([, v]) => v != null && String(v).trim() !== '');
}

function buildText(r, files) {
  const lines = [
    `Enquiry baru #${r.seq} — ${r.name}`,
    `Waktu: ${r.created_at}`,
    '----------------------------------------',
    '',
  ];
  for (const [k, v] of labelledFields(r, files)) lines.push(`${k}: ${v}`);
  const wa = waLink(r.whatsapp);
  lines.push('', '----------------------------------------');
  if (wa) lines.push(`Balas via WhatsApp: ${wa}`);
  if (r.email) lines.push(`Balas via email: mailto:${r.email}`);
  return lines.join('\n') + '\n';
}

function buildMarkdown(r, files) {
  const wa = waLink(r.whatsapp);
  const out = [
    `# Enquiry #${r.seq} — ${r.name}`,
    '',
    `*Diterima: ${r.created_at}*`,
    '',
    '| Pertanyaan | Jawaban |',
    '| --- | --- |',
  ];
  for (const [k, v] of labelledFields(r, files)) out.push(`| ${k} | ${String(v).replace(/\n/g, '<br>').replace(/\|/g, '\\|')} |`);
  out.push('');
  if (wa) out.push(`- **WhatsApp:** ${wa}`);
  if (r.email) out.push(`- **Email:** ${r.email}`);
  if (files.length) { out.push('', '## Foto', ''); files.forEach((f, i) => out.push(`- foto-${i + 1}.${f.ext} (${f.name})`)); }
  return out.join('\n') + '\n';
}

function buildHtml(r, files) {
  // Bulletproof email table: explicit cellpadding/cellspacing/border ATTRIBUTES (Gmail injects default
  // spacing otherwise, which breaks border-collapse and drops separator lines), a FIXED-width label
  // column so every value starts at the same x, valign="top" on every cell, and a font stack repeated
  // per cell. Keeps the whole thing left-aligned and consistent across clients.
  const wa = waLink(r.whatsapp);
  const FONT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";
  const RULE = 'border-bottom:1px solid #E5E5E1;';
  const LABEL_W = 168;

  const rows = labelledFields(r, files).map(([k, v]) =>
    '<tr>'
    + `<td valign="top" width="${LABEL_W}" style="width:${LABEL_W}px;${FONT}padding:11px 18px 11px 0;color:#6E6E70;font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;line-height:1.5;${RULE}">${escapeHtml(k)}</td>`
    + `<td valign="top" style="${FONT}padding:11px 0;color:#2C2C2C;font-size:15px;line-height:1.55;${RULE}">${escapeHtml(v).replace(/\n/g, '<br>')}</td>`
    + '</tr>'
  ).join('');

  const btn = (href, label, filled) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;${filled ? 'background:#2C2C2C;color:#ffffff;' : 'border:1px solid #2C2C2C;color:#2C2C2C;'}text-decoration:none;padding:12px 22px;${FONT}font-size:12px;letter-spacing:.06em;text-transform:uppercase;margin:0 8px 8px 0;">${label}</a>`;
  const actions = (wa ? btn(wa, 'Balas via WhatsApp', true) : '') + (r.email ? btn('mailto:' + sanitizeHeader(r.email), 'Balas via Email', false) : '');

  return `<!doctype html><html lang="id"><body style="margin:0;padding:24px 12px;background:#F3F3F2;${FONT}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:100%;background:#ffffff;border:1px solid #E5E5E1;border-collapse:collapse;">
      <tr><td style="padding:26px 28px 18px;border-bottom:2px solid #2C2C2C;">
        <div style="${FONT}font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8B1A2B;">Poiesis Studio &middot; Enquiry Baru</div>
        <div style="${FONT}font-size:23px;color:#2C2C2C;margin-top:6px;">#${r.seq} &mdash; ${escapeHtml(r.name)}</div>
        <div style="${FONT}font-size:13px;color:#6E6E70;margin-top:5px;">${escapeHtml(r.created_at)}</div>
      </td></tr>
      <tr><td style="padding:4px 28px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">${rows}</table>
      </td></tr>
      <tr><td style="padding:20px 28px 6px;">${actions}</td></tr>
      ${files.length ? `<tr><td style="padding:0 28px 24px;${FONT}font-size:13px;color:#6E6E70;">${files.length} foto terlampir pada email ini.</td></tr>` : ''}
    </table>
    <div style="${FONT}font-size:11px;color:#9E9E94;text-align:center;margin-top:14px;">Terkirim otomatis dari formulir enquiry poiesis.id &middot; disimpan &amp; diarsipkan ke Google Drive.</div>
  </td></tr></table>
</body></html>`;
}

// ---------------------------------------------------------------------------
// Email (multipart/mixed = multipart/alternative + image attachments), via sendmail
// ---------------------------------------------------------------------------
function encodeHeaderWord(s) {
  const v = sanitizeHeader(s);
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(v)) return v;
  return `=?UTF-8?B?${Buffer.from(v, 'utf8').toString('base64')}?=`;
}

function b64lines(buf) { return buf.toString('base64').replace(/(.{76})/g, '$1\r\n'); }

function buildEmail(r, files) {
  // Choose attachments within the total cap.
  const attach = [];
  let total = 0;
  files.forEach((f, i) => {
    if (total + f.size > EMAIL_ATTACH_MAX_TOTAL) return;
    try { const data = fs.readFileSync(f.path); attach.push({ ...f, data, outName: `foto-${i + 1}.${f.ext}` }); total += f.size; } catch { /* skip unreadable */ }
  });
  const omitted = files.length - attach.length;

  const scopeL = SCOPE_LABELS[r.scope] || r.scope || '';
  const subject = `Enquiry baru #${r.seq} — ${r.name}${scopeL ? ' · ' + scopeL : ''}${r.location ? ' · ' + r.location : ''}`;

  const mix = 'mix_' + randomUUID().replace(/-/g, '');
  const alt = 'alt_' + randomUUID().replace(/-/g, '');

  const headers = [
    `From: ${FROM}`,
    `To: ${RECIPIENTS.join(', ')}`,
    r.email ? `Reply-To: ${encodeHeaderWord(r.name)} <${sanitizeHeader(r.email)}>` : '',
    `Subject: ${encodeHeaderWord(subject)}`,
    `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${mix}"`,
    'X-Mailer: poiesis-enquiry',
  ].filter(Boolean).join('\r\n');

  let htmlPlusOmit = buildHtml(r, files);
  if (omitted > 0) htmlPlusOmit = htmlPlusOmit.replace('</body>', `<div style="max-width:640px;margin:6px auto 0;font-size:11px;color:#9E9E94;text-align:center;">${omitted} foto lain tersimpan di server &amp; Google Drive (tidak dilampirkan agar email tidak terlalu besar).</div></body>`);

  const parts = [];
  parts.push(`--${mix}`);
  parts.push(`Content-Type: multipart/alternative; boundary="${alt}"`, '');
  // Base64-encode both alternative parts (wrapped at 76 cols). The HTML is a single very long line;
  // with 8bit encoding, an MTA enforcing the RFC 5321 998-char line limit would wrap it MID-TAG and
  // corrupt the markup (broken borders / raw <td> leaking as text in Gmail). Base64 is transport-safe.
  parts.push(`--${alt}`);
  parts.push('Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64lines(Buffer.from(buildText(r, files), 'utf8')));
  parts.push(`--${alt}`);
  parts.push('Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64lines(Buffer.from(htmlPlusOmit, 'utf8')));
  parts.push(`--${alt}--`, '');
  for (const a of attach) {
    parts.push(`--${mix}`);
    parts.push(`Content-Type: ${a.mime}; name="${a.outName}"`);
    parts.push('Content-Transfer-Encoding: base64');
    parts.push(`Content-Disposition: attachment; filename="${a.outName}"`, '');
    parts.push(b64lines(a.data), '');
  }
  parts.push(`--${mix}--`, '');

  return headers + '\r\n\r\n' + parts.join('\r\n');
}

function sendmail(rfc822) {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(SENDMAIL_BIN, ['-t', '-i', '-f', ENVELOPE_FROM], { stdio: ['pipe', 'ignore', 'pipe'] });
    } catch (e) { return reject(e); }
    let stderr = '';
    let settled = false;
    const settle = (fn, arg) => { if (!settled) { settled = true; fn(arg); } };
    child.stderr.on('data', (c) => { stderr += c.toString(); });
    child.on('error', (e) => settle(reject, e));
    // If sendmail closes stdin early (misconfigured MTA), writing the body raises EPIPE — must be
    // handled or Node throws an unhandled 'error' and the whole service dies. The 'close' below settles.
    child.stdin.on('error', (e) => { console.error('[sendmail] stdin error (non-fatal):', e?.code || e?.message); });
    child.on('close', (code) => (code === 0 ? settle(resolve) : settle(reject, new Error(`sendmail exit ${code}: ${stderr.trim()}`))));
    try { child.stdin.end(rfc822); } catch { /* handled by stdin 'error' + 'close' */ }
  });
}

async function buildAndSend(r, files) {
  const rfc822 = buildEmail(r, files);
  await sendmail(rfc822);
}

// ---------------------------------------------------------------------------
// Google Drive archival (rclone), async + retried
// ---------------------------------------------------------------------------
function folderNameFor(r) {
  const namePart = sanitizeSegment(r.name) || 'Tanpa Nama';
  const typePart = WORK_LABELS[r.work_type] || SCOPE_LABELS[r.scope] || 'Enquiry';
  const ymd = ymdInTz(new Date(r.created_at || Date.now()), ARCHIVE_TZ);
  return `${r.seq}-${namePart}-${typePart}-${ymd}`;
}

function rcloneCopy(srcDir, destFolder) {
  return new Promise((resolve, reject) => {
    const args = ['copy', srcDir, `${DRIVE_DEST}/${destFolder}`, '--config', RCLONE_CONFIG, '--transfers', '2', '--no-traverse', '--drive-chunk-size', '32M'];
    const child = spawn(RCLONE_BIN, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (c) => { err += c.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`rclone exit ${code}: ${err.slice(0, 500)}`));
    });
  });
}

// Reconstruct a normalized record object from a DB row (values are stored as JSON strings for arrays).
function rowToRec(row) {
  const parse = (s, d) => { try { return JSON.parse(s); } catch { return d; } };
  return { ...row, rooms: parse(row.rooms, []), inspiration_links: parse(row.inspiration_links, []), images: parse(row.images, []), raw: parse(row.raw, {}) };
}

let archiving = false;
async function archiveOne(row) {
  const rec = rowToRec(row);
  const folder = folderNameFor(rec);
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'poiesis-arch-'));
  try {
    const files = resolveFiles(rec.draft_id, rec.images);
    fs.writeFileSync(path.join(staging, 'enquiry.md'), buildMarkdown(rec, files));
    files.forEach((f, i) => { try { fs.copyFileSync(f.path, path.join(staging, `foto-${i + 1}.${f.ext}`)); } catch { /* skip */ } });

    await rcloneCopy(staging, folder);
    markArchived.run({ id: rec.id, archived_at: new Date().toISOString(), folder });
    console.log(`[archive] #${rec.seq} -> Drive/${folder}`);
  } catch (err) {
    bumpAttempts.run({ id: rec.id });
    console.error(`[archive] #${rec.seq} failed:`, err?.message || err);
  } finally {
    try { fs.rmSync(staging, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

async function archiveSweep() {
  if (!DRIVE_ENABLED || archiving) return;
  archiving = true;
  try {
    const row = selectUnarchived.get(ARCHIVE_MAX_ATTEMPTS);
    if (row) await archiveOne(row);
  } catch (err) {
    console.error('[archive] sweep error:', err?.message || err);
  } finally {
    archiving = false;
  }
}

// ---------------------------------------------------------------------------
// Orphan sweep: drop unclaimed upload dirs (no enquiry row) older than 24h
// ---------------------------------------------------------------------------
function orphanSweep() {
  const cutoff = Date.now() - 24 * 3_600_000;
  let dirs = [];
  try { dirs = fs.readdirSync(UPLOAD_ROOT); } catch { return; }
  for (const d of dirs) {
    const p = path.join(UPLOAD_ROOT, d);
    try {
      const st = fs.statSync(p);
      if (!st.isDirectory() || st.mtimeMs > cutoff) continue;
      if (draftClaimed.get(d)) continue; // claimed by a real enquiry — keep
      fs.rmSync(p, { recursive: true, force: true });
      console.log('[orphan] removed unclaimed upload dir', d);
    } catch { /* ignore */ }
  }
}

// ---------------------------------------------------------------------------
// Admin dashboard — served ONLY behind nginx HTTP Basic Auth on /admin.
// The backend binds 127.0.0.1, so /admin is unreachable except through the
// authenticated nginx location. Exposes the enquiry data + stored photos.
// ---------------------------------------------------------------------------
function adminData() {
  const parse = (s, d) => { try { return JSON.parse(s); } catch { return d; } };
  const enquiries = selectAllEnquiries.all().map((r) => ({
    seq: r.seq, id: r.id, created_at: r.created_at,
    name: r.name, preferred_channel: r.preferred_channel, email: r.email, whatsapp: r.whatsapp,
    scope: r.scope, work_type: r.work_type,
    land_width_m: r.land_width_m, land_length_m: r.land_length_m, land_area_m2: r.land_area_m2,
    location: r.location, floors: r.floors, occupants: r.occupants,
    rooms: parse(r.rooms, []), style_text: r.style_text, inspiration_links: parse(r.inspiration_links, []),
    budget_range: r.budget_range, start_timeline: r.start_timeline, notes: r.notes,
    images: parse(r.images, []), draft_id: r.draft_id, source: r.source,
    archived_at: r.archived_at, archive_folder: r.archive_folder,
  }));
  return { ok: true, count: enquiries.length, generated_at: new Date().toISOString(), enquiries };
}

function handleAdminPage(res) {
  let html;
  try { html = fs.readFileSync(ADMIN_HTML_PATH, 'utf8'); }
  catch (e) { console.error('[admin] page read fail:', e?.message); return json(res, 500, { ok: false, error: 'dashboard unavailable' }); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' });
  res.end(html);
}

function handleAdminPhoto(req, res) {
  const qs = new URLSearchParams(req.url.split('?')[1] || '');
  const draft = qs.get('draft') || '', file = qs.get('file') || '';
  if (!UUID_RE.test(draft) || !UUID_RE.test(file)) return json(res, 400, { ok: false, error: 'bad id' });
  let match = null;
  try { for (const f of fs.readdirSync(draftDir(draft))) if (f.startsWith(file + '.')) { match = f; break; } } catch { /* no dir */ }
  if (!match) return json(res, 404, { ok: false, error: 'not found' });
  try {
    const data = fs.readFileSync(path.join(draftDir(draft), match));
    const ext = path.extname(match).slice(1).toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Content-Length': data.length });
    res.end(data);
  } catch { return json(res, 404, { ok: false, error: 'not found' }); }
}

// ---------------------------------------------------------------------------
// Enquiry submit
// ---------------------------------------------------------------------------
async function handleEnquiry(req, res, ip, legacy) {
  try {
    const raw = await readBody(req, JSON_MAX_BYTES);
    let data;
    try { data = JSON.parse(raw.toString('utf8')); } catch { return json(res, 400, { ok: false, error: 'Invalid JSON' }); }
    if (!data || typeof data !== 'object') return json(res, 400, { ok: false, error: 'Invalid payload' });

    // Honeypot — pretend success, drop silently.
    if (data.website) return json(res, 200, { ok: true });

    const rec = legacy ? mapLegacy(data) : mapEnquiry(data);

    if (!rec.name) return json(res, 400, { ok: false, error: 'Nama wajib diisi' });
    if (!rec.email && !rec.whatsapp) return json(res, 400, { ok: false, error: 'Isi minimal satu kontak (WhatsApp atau email)' });
    if (rec.email && !isValidEmail(rec.email)) return json(res, 400, { ok: false, error: 'Email tidak valid' });

    rec.id = randomUUID();
    rec.created_at = new Date().toISOString();
    rec.ip = ip;
    rec.user_agent = sanitizeHeader(req.headers['user-agent'] || '').slice(0, 400);

    const files = resolveFiles(rec.draft_id, rec.images);
    rec.images = files.map((f) => ({ fileId: f.fileId, name: f.name, bytes: f.size }));

    let seq = 0;
    try { seq = nextSeqStmt.get().n; } catch (e) { console.error('[seq] fail', e?.message); }
    rec.seq = seq;

    // Persist — JSONL first (cheapest & most durable), then SQLite. A lead survives if EITHER succeeds.
    let persisted = false;
    try { fs.appendFileSync(JSONL_PATH, JSON.stringify(rec) + '\n'); persisted = true; } catch (e) { console.error('[jsonl] fail:', e?.message); }
    try { insertStmt.run(toDbRow(rec)); persisted = true; } catch (e) { console.error('[db] fail:', e?.message); }

    if (!persisted) return json(res, 500, { ok: false, error: 'Gagal menyimpan enquiry' });

    // Email is best-effort: the lead is already saved, so never make the client retry on a mail hiccup.
    buildAndSend(rec, files).catch((e) => console.error('[mail] fail:', e?.message || e));
    // Nudge the archival sweep (also runs on a timer).
    setTimeout(() => archiveSweep().catch(() => {}), 500);

    return json(res, 200, { ok: true });
  } catch (err) {
    const status = err?.status || 500;
    console.error('[enquiry] error:', err?.message || err);
    return json(res, status, { ok: false, error: status === 500 ? 'Gagal mengirim' : err.message });
  }
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || '-';
  const url = (req.url || '').split('?')[0];

  if (req.method === 'GET' && url === '/healthz') return json(res, 200, { ok: true });

  // Admin dashboard (nginx enforces Basic Auth on the /admin location).
  if (req.method === 'GET' && (url === '/admin' || url === '/admin/')) return handleAdminPage(res);
  if (req.method === 'GET' && url === '/admin/data') return json(res, 200, adminData());
  if (req.method === 'GET' && url === '/admin/photo') return handleAdminPhoto(req, res);

  if (req.method === 'POST' && url === '/api/enquiry/upload') {
    if (!rateOk(ip)) return json(res, 429, { ok: false, error: 'Terlalu banyak permintaan, coba lagi sebentar' });
    return handleUpload(req, res);
  }
  if (req.method === 'POST' && (url === '/api/enquiry' || url === '/api/contact')) {
    if (!rateOk(ip)) return json(res, 429, { ok: false, error: 'Terlalu banyak permintaan, coba lagi sebentar' });
    return handleEnquiry(req, res, ip, url === '/api/contact');
  }
  return json(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[enquiry] listening on ${HOST}:${PORT} · db=${DB_PATH} · drive=${DRIVE_ENABLED ? DRIVE_DEST : 'off'}`);
});

// Background sweeps.
setInterval(() => archiveSweep().catch(() => {}), 60_000).unref();
setTimeout(() => archiveSweep().catch(() => {}), 5_000).unref();
setInterval(orphanSweep, 24 * 3_600_000).unref();
setTimeout(orphanSweep, 30_000).unref();
