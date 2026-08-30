// Lightweight, dependency-free document-head manager.
//
// Updates <title>, meta description, canonical, and Open Graph / Twitter tags on
// client-side route changes. This helps JS-rendering crawlers (Googlebot) and gives
// each page a correct browser-tab title. Non-JS social scrapers (WhatsApp, Facebook,
// LinkedIn) read the static tags in index.html instead — see the note there. Wired from
// the router (static routes) and ProjectDetail.vue (after the project loads).

const SITE = {
  name: 'Poiesis Studio',
  url: 'https://poiesis.id',
  defaultTitle: 'Poiesis Studio — Architecture & Interior Design',
  defaultDescription:
    'Poiesis Studio is a Jakarta-based Architecture & Interior Design consultancy. Design Through Stories.',
  defaultImage: 'https://poiesis.id/images/projects/bangka-1210/02.jpg',
}

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function absolute(src) {
  if (!src) return SITE.defaultImage
  return src.startsWith('http') ? src : SITE.url + src
}

// Map a full image to its ~800px `-sm.jpg` sibling for social previews. Social scrapers
// (WhatsApp, Facebook, …) download the og:image before showing the thumbnail, so pointing
// them at the small sibling (~80KB vs ~875KB) makes the preview appear far faster. The
// on-page hero and the JSON-LD image stay full-resolution — this only swaps the social tag.
function socialVariant(src) {
  if (!src) return src
  const [path, q] = src.split('?')
  const sm = path.replace(/\.(png|jpe?g)$/i, '-sm.jpg')
  return q ? `${sm}?${q}` : sm
}

// Trim a long body to a clean meta-length blurb (~200 chars, no mid-word cut).
export function metaBlurb(text, max = 200) {
  if (!text) return SITE.defaultDescription
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, clean.lastIndexOf(' ', max - 1)).trim() + '…'
}

export function setMeta({ title, description, path = '', image, type = 'website' } = {}) {
  const fullTitle = title ? `${title} — ${SITE.name}` : SITE.defaultTitle
  const desc = description || SITE.defaultDescription
  const url = SITE.url + path
  const social = socialVariant(absolute(image)) // lightweight -sm image for fast previews

  document.title = fullTitle
  upsertMeta('name', 'description', desc)
  upsertLink('canonical', url)

  upsertMeta('property', 'og:site_name', SITE.name)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', desc)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', social)

  upsertMeta('property', 'og:image:alt', title || SITE.name)

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', fullTitle)
  upsertMeta('name', 'twitter:description', desc)
  upsertMeta('name', 'twitter:image', social)
}

// Upsert a keyed <script type="application/ld+json"> block in <head>. Pass `data=null`
// to remove it (used when leaving a route that had page-specific structured data). The
// site-wide ProfessionalService block lives statically in index.html and is untouched.
export function setJsonLd(key, data) {
  const id = `ld-${key}`
  let el = document.getElementById(id)
  if (!data) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

// Structured data for a single project page: a CreativeWork (the project itself, authored
// by the studio) plus a BreadcrumbList (Home › Projects › <title>). Helps Google show the
// project as a distinct work and render breadcrumb trails in results.
export function setProjectJsonLd(p) {
  if (!p) {
    setJsonLd('project', null)
    setJsonLd('breadcrumb', null)
    return
  }
  const url = `${SITE.url}/project/${p.id}`
  const img = absolute(p.thumbnail || (p.images && p.images[0]))
  setJsonLd('project', {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: metaBlurb(p.description || `${p.title} — ${p.category || 'a project'} by Poiesis Studio.`),
    url,
    image: img,
    ...(p.category ? { genre: p.category } : {}),
    ...(p.year ? { dateCreated: String(p.year) } : {}),
    ...(p.location ? { locationCreated: { '@type': 'Place', name: p.location } } : {}),
    creator: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
  })
  setJsonLd('breadcrumb', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: SITE.url + '/projects' },
      { '@type': 'ListItem', position: 3, name: p.title, item: url },
    ],
  })
}
