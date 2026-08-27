// Client-side image handling for the enquiry wizard.
//
// Each picked image is downscaled in-browser (≤1600px longest edge, JPEG q0.82) BEFORE upload — so even a
// 12MP phone photo becomes a few hundred KB — then uploaded independently (resilient on flaky mobile
// networks) as raw bytes to POST /api/enquiry/upload. A tiny (~160px) data-URL thumbnail is also produced
// so the preview can survive a page reload via the persisted draft (full-res object URLs cannot).
//
// Blobs/Files are kept in a NON-reactive Map (keyed by item id) so Vue never proxies binary data.

import { ref } from 'vue'

const MAX_FILES = 8
const MAX_EDGE = 1600
const QUALITY = 0.82
const THUMB_EDGE = 160
const CONCURRENCY = 2

function uid() {
  try { return crypto.randomUUID() } catch { return Date.now() + '-' + Math.random().toString(16).slice(2) }
}

async function decode(source) {
  // createImageBitmap respects EXIF orientation and is fastest; fall back to <img> for old browsers.
  try {
    if (typeof createImageBitmap === 'function') return await createImageBitmap(source, { imageOrientation: 'from-image' })
  } catch { /* fall through */ }
  return await new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(source)
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')) }
    img.src = url
  })
}

function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') { try { return new OffscreenCanvas(w, h) } catch { /* fall through */ } }
  const c = document.createElement('canvas'); c.width = w; c.height = h; return c
}

function toBlob(canvas, type, quality) {
  if (canvas.convertToBlob) return canvas.convertToBlob({ type, quality })
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), type, quality))
}

async function resizeTo(source, edge, quality) {
  const bmp = await decode(source)
  const w = bmp.width, h = bmp.height
  const s = Math.min(1, edge / Math.max(w, h))
  const tw = Math.max(1, Math.round(w * s)), th = Math.max(1, Math.round(h * s))
  const canvas = makeCanvas(tw, th)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, 0, 0, tw, th)
  if (bmp.close) bmp.close()
  const blob = await toBlob(canvas, 'image/jpeg', quality)
  return { blob, width: tw, height: th }
}

async function makeThumb(blob) {
  try {
    const bmp = await decode(blob)
    const w = bmp.width, h = bmp.height, s = Math.min(1, THUMB_EDGE / Math.max(w, h))
    const tw = Math.max(1, Math.round(w * s)), th = Math.max(1, Math.round(h * s))
    const c = document.createElement('canvas'); c.width = tw; c.height = th
    c.getContext('2d').drawImage(bmp, 0, 0, tw, th)
    if (bmp.close) bmp.close()
    return c.toDataURL('image/jpeg', 0.5)
  } catch { return '' }
}

export function useImageUpload(draftId, { onChange } = {}) {
  const images = ref([])          // reactive metadata only
  const blobs = new Map()         // id -> Blob (non-reactive)
  const queue = []
  let active = 0
  const notify = () => { if (onChange) onChange() }

  function addFiles(fileList) {
    for (const file of Array.from(fileList || [])) {
      if (images.value.length >= MAX_FILES) break
      if (!file.type || !file.type.startsWith('image/')) continue
      const item = { id: uid(), name: file.name || 'foto.jpg', status: 'processing', fileId: '', previewUrl: '', thumb: '', error: '', bytes: 0, width: 0, height: 0 }
      blobs.set(item.id, file)
      images.value.push(item)
      queue.push(item.id)
    }
    notify()
    pump()
  }

  function pump() {
    while (active < CONCURRENCY) {
      const id = queue.shift()
      if (!id) break
      active++
      processAndUpload(id).finally(() => { active--; pump() })
    }
  }

  function find(id) { return images.value.find((i) => i.id === id) }

  async function processAndUpload(id) {
    const item = find(id)
    if (!item) return
    try {
      const source = blobs.get(id)
      const { blob, width, height } = await resizeTo(source, MAX_EDGE, QUALITY)
      item.width = width; item.height = height; item.bytes = blob.size
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      item.previewUrl = URL.createObjectURL(blob)
      item.thumb = await makeThumb(blob)
      blobs.set(id, blob)          // replace original with the smaller resized blob
      item.status = 'uploading'
      notify()
      await doUpload(id)
    } catch (err) {
      item.status = 'error'
      item.error = err?.message === 'decode' ? 'Format tidak didukung — coba JPG/PNG' : 'Gagal memproses foto'
      notify()
    }
  }

  async function doUpload(id) {
    const item = find(id)
    const blob = blobs.get(id)
    if (!item || !blob) return
    try {
      const res = await fetch('/api/enquiry/upload', {
        method: 'POST',
        headers: { 'Content-Type': blob.type || 'image/jpeg', 'X-Draft-Id': draftId, 'X-Filename': encodeURIComponent(item.name) },
        body: blob,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'gagal')
      item.fileId = data.fileId
      item.status = 'done'
      notify()
    } catch {
      item.status = 'error'
      item.error = 'Gagal mengunggah — ketuk untuk coba lagi'
      notify()
    }
  }

  function retry(item) {
    if (item.status !== 'error') return
    if (item.fileId) { item.status = 'done'; notify(); return }
    if (blobs.has(item.id)) { item.status = 'uploading'; notify(); doUpload(item.id) }
    else remove(item)
  }

  function remove(item) {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    blobs.delete(item.id)
    images.value = images.value.filter((i) => i.id !== item.id)
    notify()
  }

  function doneImages() { return images.value.filter((i) => i.status === 'done' && i.fileId) }

  // Persist only completed uploads (fileId + tiny thumbnail); the server holds the real file.
  function serialize() {
    return doneImages().map((i) => ({ id: i.id, name: i.name, fileId: i.fileId, thumb: i.thumb, bytes: i.bytes, width: i.width, height: i.height }))
  }

  function hydrate(saved) {
    if (!Array.isArray(saved)) return
    images.value = saved.filter((s) => s && s.fileId).map((s) => ({
      id: s.id || uid(), name: s.name || 'foto.jpg', status: 'done', fileId: s.fileId,
      previewUrl: '', thumb: s.thumb || '', error: '', bytes: s.bytes || 0, width: s.width || 0, height: s.height || 0,
    }))
  }

  function cleanup() {
    for (const i of images.value) if (i.previewUrl) URL.revokeObjectURL(i.previewUrl)
    blobs.clear()
  }

  return { images, addFiles, retry, remove, doneImages, serialize, hydrate, cleanup, MAX_FILES }
}
