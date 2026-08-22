# Poiesis site — minimalist reskin (branch `poiesis-minimalist-reskin`)

The live Vue app has been reskinned to the minimalist Poiesis theme and repopulated
from the **authoritative** portfolio (`Poiesis-Portfolio-Extracted`, 28 projects) with
descriptions from `extracted-images` where they existed. No new dependencies except
`puppeteer-core` (dev-only, for screenshot QA).

## What changed
- **Design tokens** — `src/assets/scss/main.scss` + `_variables.scss` now hold the minimalist
  system (DM Sans + Cormorant Garamond, cream/charcoal/crimson palette, triangle supergraphic).
  `index.html` font preload updated.
- **All components/views reskinned** — header, footer, hero, studio, services, values,
  projects grid, founder quote, team, contact CTA, project detail, projects/about/contact pages.
- **Data** — `public/data/projects.json` rebuilt to the **28 authoritative projects**
  (11 Built B01–B11 + 17 Design C01–C17). Schema unchanged (id/title/category/year/location/
  client/siteArea/grossArea/architect/thumbnail/images/description/keywords), plus
  `code`, `status`, `completed`, `program`, `descriptionSource`, and internal `reviewNote`/`draft`.
- **Images** — 294 authoritative project images copied to `public/images/projects/<slug>/NN.ext`
  (hero = `01`), team + company profile to `public/images/studio/`. The old `public/images/NN-*`
  folders were removed (fully replaced). `public/images/hero/` (curated heroes) and `brand/` kept.
- Contact backend (`server/contact-server.mjs`, `/api/contact`) is **unchanged** — it runs
  separately in production; the form UI is reskinned only.

## Run it
```
npm run dev       # http://localhost:5173
# or the QA build already served: http://localhost:4180
```

## ⚑ NEEDS YOUR REVIEW

### 1. Drafted descriptions (18 of 28)
The 10 built projects with existing copy kept it (`descriptionSource: "extracted-images"`).
The other 18 had **no source description**, so I drafted them from the project images
(`descriptionSource: "drafted-from-images"`, `draft: true`). Please review/replace the prose
in `public/data/projects.json`. The 8 fully-described built projects are final:
foresty-garden, edge, spanish-villa, halaman, cempaka, grey, 485, dgp
(accessibility & m-factory-reuse use their short extracted blurbs).

### 2. Metadata flags found while drafting (verify against your records)
- **C01 X-Hall Imeri** — every plaque in the images reads *Faculty of Medicine, Universitas
  Indonesia (FKUI), Jakarta, 24 Nov 2025*. The manifest location **"Sanur, Bali" is almost
  certainly wrong** for this project. (It's a "Pillar of Honor" donor wall — interior install.)
- **C11 Padway Co-Living** — the building is signed **"Kebon Living"** in the renders (matches
  the Kebon Sirih location). "Padway" may be an operator/working name — confirm the public title.
- **C13 Basketball Hall** — location given as *Pondok Labu, Central Jakarta*; Pondok Labu is
  generally **South Jakarta**. Confirm.
- **C14 Thamres Rejuve** — amenity rejuvenation of a Tanah Abang tower; "Thamres" may be
  *Thamrin Residence*. Confirm the building/name.
- **C02 Morgen Booth** — an exhibition booth ("The Dark Side of the Moon") for an electrical-
  fittings/lighting brand; Kemang is likely the client/studio base, not the fair venue.
- **C10 Sleman** — photoreal render (house number "10" visible); confirm built vs. design study.
- Several C-series are renders/concepts rather than built photos (expected for "Design projects").

### 3. Team photos ↔ names (confirm order)
`src/components/TeamSection.vue` maps portraits to the studio-provided names **in list order**:
`team-01→Mayang Ratih (Principal)`, `02→Jessica Sarana (Partner)`, `03→Irawan Listanto`,
`04→Mikael Christian Lolonlun`, `05→M. Adillah`. I could not verify which face is whom —
please confirm/reorder. (`team-01` is a person standing beside an artwork, so it crops a little
tight; `team-06` is the group photo, available if you'd prefer it somewhere.)

### 4. Studio stats
The Studio section shows factual counts (**11 built / 17 design / IAI certified**) — swap if
you'd rather show founding year, total built m², etc.
