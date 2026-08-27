// Session persistence for the enquiry wizard.
//
// Keeps the whole in-progress form in localStorage under a single versioned key, so a user who navigates
// away, switches apps, locks the phone, or reloads returns to exactly where they left off — until the
// enquiry is successfully submitted (then it's cleared). The stable draftId is peeked eagerly at
// construction so the image uploader can be created with the SAME id the stored uploads belong to.

const KEY = 'poiesis:enquiry:draft'
const VERSION = 1
const MAX_AGE_MS = 30 * 24 * 3600 * 1000

function uid() {
  try { return crypto.randomUUID() } catch { return Date.now() + '-' + Math.random().toString(16).slice(2) }
}

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const b = JSON.parse(raw)
    if (!b || b.v !== VERSION) return null
    if (b.savedAt && Date.now() - b.savedAt > MAX_AGE_MS) { localStorage.removeItem(KEY); return null }
    return b
  } catch { return null }
}

export function useEnquiryDraft() {
  const existing = readRaw()
  const draftId = (existing && existing.draftId) || uid()

  // The parsed prior draft (answers/stepIndex/images) for the orchestrator to apply, or null.
  function restore() { return existing }

  function save(snapshot) {
    const base = { v: VERSION, draftId, savedAt: Date.now() }
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...base, ...snapshot }))
    } catch {
      // Quota / Safari private mode: drop the (heaviest) image thumbnails and keep the answers.
      try { localStorage.setItem(KEY, JSON.stringify({ ...base, ...snapshot, images: [] })) } catch { /* give up silently */ }
    }
  }

  function clear() { try { localStorage.removeItem(KEY) } catch { /* ignore */ } }

  return { draftId, restore, save, clear }
}
