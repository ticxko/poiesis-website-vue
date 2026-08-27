// Generate public/sitemap.xml from the static routes + every project in projects.json.
// Run: `node scripts/gen-sitemap.mjs` (do this whenever projects.json changes, or wire
// it into the build/deploy step).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://poiesis.id'

const projects = JSON.parse(readFileSync(join(ROOT, 'public/data/projects.json'), 'utf8'))
const today = new Date().toISOString().slice(0, 10)

const staticUrls = [
  { loc: '/', priority: '1.0' },
  { loc: '/projects', priority: '0.9' },
  { loc: '/about', priority: '0.8' },
  { loc: '/enquiry', priority: '0.7' },
  { loc: '/contact', priority: '0.7' },
]

// NOTE: this lists every project currently in projects.json (including drafts, which the
// /projects browse also exposes). Filter here (e.g. `.filter(p => !p.draft)`) once the
// public project set is decided.
const projectUrls = projects.map((p) => ({ loc: `/project/${p.id}`, priority: '0.6' }))

const rows = [...staticUrls, ...projectUrls]
  .map(
    (u) =>
      `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml written: ${rows.split('<url>').length - 1} urls`)
