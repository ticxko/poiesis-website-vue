// Soft fade-in for images as they finish loading, so photos resolve gently
// instead of popping in the instant their bytes arrive.
//
// Design notes:
// - Only images that have NOT loaded yet are hidden, so cached/instant images
//   never flash (they were never the problem).
// - The reveal uses a CSS *animation* (see .img-fade--in in main.scss), not a
//   transition, so it can't clobber component transitions on `transform`
//   (e.g. the hero's Ken Burns scale).
// - Skips SVGs (logos/icons), the header/footer chrome, and [data-no-fade].
// - Respects prefers-reduced-motion by doing nothing (images just appear).

function shouldSkip(img) {
  if (img.dataset.fade) return true // already handled
  if (img.hasAttribute('data-no-fade')) return true
  if (img.closest('header, footer')) return true
  const src = img.currentSrc || img.getAttribute('src') || ''
  if (/\.svg(\?|#|$)/i.test(src)) return true
  return false
}

function prep(img) {
  if (shouldSkip(img)) return
  img.dataset.fade = '1'
  // Already decoded (cache/back-forward) → leave as-is, no hide, no flash.
  if (img.complete && img.naturalWidth > 0) return
  img.classList.add('img-fade')
  const reveal = () => {
    img.classList.remove('img-fade')
    img.classList.add('img-fade--in')
  }
  img.addEventListener('load', reveal, { once: true })
  img.addEventListener('error', reveal, { once: true }) // never leave a broken img invisible
}

export function initImageFade() {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  document.querySelectorAll('img').forEach(prep)

  // Catch images added later by route changes / v-for rendering.
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue
        if (node.tagName === 'IMG') prep(node)
        else if (node.querySelectorAll) node.querySelectorAll('img').forEach(prep)
      }
    }
  })
  mo.observe(document.body, { childList: true, subtree: true })
}
