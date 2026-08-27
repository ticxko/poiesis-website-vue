// GA4 pageview tracking for the SPA.
//
// The gtag loader + config live in index.html with `send_page_view: false`, so automatic
// pageviews are suppressed and we emit one explicit page_view per route change here (with the
// resolved path + the final document title). No-ops safely when gtag is absent — dev server,
// ad/tracker blockers, or before the async gtag script has loaded (queued via dataLayer).

export function trackPageview({ path, title } = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: window.location.href,
    page_path: path || window.location.pathname,
  })
}

// Fire a custom GA4 event (e.g. enquiry_submitted). No-ops safely when gtag is absent.
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
