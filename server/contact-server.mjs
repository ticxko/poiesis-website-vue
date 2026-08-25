// Poiesis contact form backend.
// Zero-dependency Node HTTP server. Listens on 127.0.0.1:PORT behind nginx.
// Accepts JSON POST { name, email, phone, message, website }
// Pipes a message to /usr/sbin/sendmail -t -i (local postfix).

import http from 'node:http';
import { spawn } from 'node:child_process';

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || '127.0.0.1';

// Sender is the dedicated enquiry mailbox on the kvm4 mail server (DKIM-signed
// for poiesis.id). Recipients / sender can be overridden via env for testing
// (e.g. a systemd drop-in setting CONTACT_RECIPIENTS=ticxko@gmail.com).
const FROM = process.env.CONTACT_FROM || 'Poiesis Enquiries <enquiry@poiesis.id>';
const ENVELOPE_FROM = process.env.CONTACT_ENVELOPE_FROM || 'enquiry@poiesis.id';
const RECIPIENTS = (
  process.env.CONTACT_RECIPIENTS ||
  'mayang.poiesis@gmail.com,ticxko@gmail.com,nice.permadi92@gmail.com'
).split(',').map((s) => s.trim()).filter(Boolean);

const MAX_BODY_BYTES = 20_000;

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

function sanitizeHeader(s) {
  // Collapse CR/LF/TAB to a space to prevent header injection.
  return String(s).replace(/[\r\n\t]+/g, ' ').trim();
}

function isValidEmail(s) {
  // Pragmatic validation: non-empty, has @, no whitespace, reasonable length.
  return typeof s === 'string'
    && s.length > 2 && s.length <= 200
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function buildMessage({ name, email, phone, message, remoteIp }) {
  const safeName  = sanitizeHeader(name);
  const safeEmail = sanitizeHeader(email);
  const subject   = `New contact message from ${safeName}`;
  const time      = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  const headers = [
    `From: ${FROM}`,
    `To: ${RECIPIENTS.join(', ')}`,
    `Reply-To: ${safeName} <${safeEmail}>`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: poiesis-contact',
  ].join('\r\n');

  const body = [
    'You have a new message from the poiesis.id contact form.',
    '',
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || '-'}`,
    `IP:      ${remoteIp || '-'}`,
    `Time:    ${time}`,
    '----------------------------------------',
    '',
    message,
    '',
  ].join('\r\n');

  return headers + '\r\n\r\n' + body;
}

function sendmail(rfc822) {
  return new Promise((resolve, reject) => {
    const child = spawn('/usr/sbin/sendmail', ['-t', '-i', '-f', ENVELOPE_FROM], {
      stdio: ['pipe', 'ignore', 'pipe'],
    });
    let stderr = '';
    child.stderr.on('data', (c) => { stderr += c.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`sendmail exit ${code}: ${stderr.trim()}`));
    });
    child.stdin.end(rfc822);
  });
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Payload too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    return json(res, 200, { ok: true });
  }
  if (req.method !== 'POST' || req.url !== '/api/contact') {
    return json(res, 404, { ok: false, error: 'Not found' });
  }

  try {
    const raw = await readBody(req);
    let data;
    try { data = JSON.parse(raw); } catch { return json(res, 400, { ok: false, error: 'Invalid JSON' }); }
    if (!data || typeof data !== 'object') return json(res, 400, { ok: false, error: 'Invalid payload' });

    // Honeypot — pretend success, drop silently.
    if (data.website) return json(res, 200, { ok: true });

    const name    = typeof data.name    === 'string' ? data.name.trim()    : '';
    const email   = typeof data.email   === 'string' ? data.email.trim()   : '';
    const phone   = typeof data.phone   === 'string' ? data.phone.trim()   : '';
    const message = typeof data.message === 'string' ? data.message.trim() : '';

    if (!name || name.length > 200)           return json(res, 400, { ok: false, error: 'Name is required' });
    if (!isValidEmail(email))                  return json(res, 400, { ok: false, error: 'Valid email is required' });
    if (!message || message.length > 10_000)   return json(res, 400, { ok: false, error: 'Message is required' });
    if (phone.length > 50)                     return json(res, 400, { ok: false, error: 'Phone too long' });

    const remoteIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || '-';
    const rfc822 = buildMessage({ name, email, phone, message, remoteIp });
    await sendmail(rfc822);
    return json(res, 200, { ok: true });
  } catch (err) {
    const status = err?.status || 500;
    console.error('[contact] error:', err?.message || err);
    return json(res, status, { ok: false, error: status === 500 ? 'Failed to send' : err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[contact] listening on ${HOST}:${PORT}`);
});
