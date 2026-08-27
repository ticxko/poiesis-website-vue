// Enquiry answers, per-step validation, option lists, and the submit-payload builder.
// Kept separate from the orchestrator view so the step content and the review summary share one source
// of truth (labels, enums). Copy is Bahasa Indonesia.

import { reactive } from 'vue'

// --- Option lists (value = stable key sent to the server; label = shown to the user) ---
export const SCOPE_OPTIONS = [
  { value: 'arsitektur', label: 'Arsitektur' },
  { value: 'interior', label: 'Interior' },
  { value: 'keduanya', label: 'Arsitektur & Interior' },
]
export const WORK_OPTIONS = [
  { value: 'bangun-baru', label: 'Bangun baru' },
  { value: 'renovasi-total', label: 'Renovasi total' },
  { value: 'renovasi-minor', label: 'Renovasi minor' },
  { value: 'penambahan', label: 'Penambahan ruang' },
  { value: 'fit-out', label: 'Fit-out interior' },
]
export const FLOOR_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4+', label: '4+' },
  { value: 'unsure', label: 'Belum tahu' },
]
export const BUDGET_OPTIONS = [
  { value: '<500', label: 'Di bawah Rp500 juta' },
  { value: '500-1000', label: 'Rp500 juta – Rp1 miliar' },
  { value: '1000-2500', label: 'Rp1 – 2,5 miliar' },
  { value: '2500-5000', label: 'Rp2,5 – 5 miliar' },
  { value: '>5000', label: 'Di atas Rp5 miliar' },
  { value: 'unknown', label: 'Belum tahu' },
]
export const START_OPTIONS = [
  { value: '0-3', label: 'Dalam 3 bulan' },
  { value: '3-6', label: '3–6 bulan' },
  { value: '6-12', label: '6–12 bulan' },
  { value: '>12', label: 'Lebih dari setahun' },
  { value: 'unsure', label: 'Belum tahu / masih menjajaki' },
]
export const ROOM_OPTIONS = [
  'Kamar tidur utama', 'Kamar tidur anak', 'Kamar tamu', 'Dapur bersih', 'Dapur kotor',
  'Ruang keluarga', 'Ruang makan', 'Ruang kerja / studi', 'Musala', 'Kamar ART',
  'Garasi', 'Taman', 'Kolam renang', 'Ruang cuci / jemur', 'Gudang', 'Ruang usaha',
]

export function labelOf(options, value) { return options.find((o) => o.value === value)?.label || '' }

function emailValid(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e || '').trim()) }
function waValid(w) { const d = String(w || '').replace(/\D/g, ''); return d.length >= 8 && d.length <= 16 }

export function useEnquiryForm() {
  const answers = reactive({
    // Step 1 — Kontak
    nama: '', preferredChannel: 'whatsapp', whatsapp: '', email: '',
    // Step 2 — Tentang proyek
    scope: '', workType: '', landWidth: '', landLength: '', location: '', floors: '',
    // Step 3 — Penghuni & ruang
    occupants: '', rooms: [],
    // Step 4 — Rumah yang dibayangkan
    styleText: '', inspirationLinks: [''], budget: '', startTime: '',
    // Step 5 — Tinjau
    notes: '',
    // honeypot (never persisted, never shown)
    website: '',
  })
  const errors = reactive({})

  function clearErrors() { for (const k of Object.keys(errors)) delete errors[k] }

  // Only Step 1 gates progress. Everything else is optional (PDF: "belum ada jawaban… tidak mengapa").
  function validateStep(i) {
    clearErrors()
    if (i === 0) {
      if (!answers.nama.trim()) errors.nama = 'Mohon isi nama Anda.'
      const hasWa = waValid(answers.whatsapp), hasEmail = emailValid(answers.email)
      if (answers.email.trim() && !hasEmail) errors.email = 'Alamat email belum valid.'
      if (!hasWa && !hasEmail) errors.contact = 'Isi minimal satu kontak — WhatsApp atau email.'
      return !errors.nama && !errors.email && !errors.contact
    }
    return true
  }

  function areaM2() {
    const w = parseFloat(String(answers.landWidth).replace(',', '.'))
    const l = parseFloat(String(answers.landLength).replace(',', '.'))
    return Number.isFinite(w) && Number.isFinite(l) ? Math.round(w * l * 100) / 100 : null
  }

  function buildPayload(draftId, doneImages) {
    const w = parseFloat(String(answers.landWidth).replace(',', '.'))
    const l = parseFloat(String(answers.landLength).replace(',', '.'))
    return {
      draftId,
      meta: { locale: 'id-ID', source: 'enquiry-wizard' },
      contact: {
        nama: answers.nama.trim(),
        preferredChannel: answers.preferredChannel,
        whatsapp: answers.whatsapp.trim(),
        email: answers.email.trim(),
      },
      project: {
        scope: answers.scope,
        workType: answers.workType,
        land: { widthM: Number.isFinite(w) ? w : null, lengthM: Number.isFinite(l) ? l : null, areaM2: areaM2() },
        location: answers.location.trim(),
        floors: answers.floors,
      },
      vision: {
        occupants: answers.occupants.trim(),
        rooms: [...answers.rooms],
        styleText: answers.styleText.trim(),
        inspirationLinks: answers.inspirationLinks.map((s) => s.trim()).filter(Boolean),
        images: doneImages.map((i) => ({ fileId: i.fileId, name: i.name, width: i.width, height: i.height, bytes: i.bytes })),
      },
      budget: { range: answers.budget, startTime: answers.startTime },
      notes: answers.notes.trim(),
      website: answers.website,
    }
  }

  return { answers, errors, validateStep, clearErrors, buildPayload, areaM2 }
}
