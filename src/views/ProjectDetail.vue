<template>
  <main v-if="project">
    <!-- Project plate -->
    <section class="detail-hero" :class="heroClass">
      <img :src="project.images[0]" :alt="project.title" @load="onHeroLoad" />
      <span class="detail-scrim" aria-hidden="true"></span>
      <span class="detail-tri" aria-hidden="true"></span>
      <div class="container detail-hero-inner">
        <p class="ps-label detail-eyebrow">{{ project.location }}<template v-if="project.year"> · {{ project.year }}</template></p>
        <h1 class="ps-display detail-title">{{ project.title }}</h1>
      </div>
    </section>

    <!-- Meta strip -->
    <section class="section detail-meta-sec">
      <div class="container">
        <div class="detail-meta ps-reveal">
          <div v-if="project.category"><p class="ps-label meta-k">Type</p><p class="meta-v">{{ project.category }}</p></div>
          <div v-if="project.location"><p class="ps-label meta-k">Location</p><p class="meta-v">{{ project.location }}</p></div>
          <div v-if="project.client"><p class="ps-label meta-k">Client</p><p class="meta-v">{{ project.client }}</p></div>
          <div v-if="project.siteArea"><p class="ps-label meta-k">Site area</p><p class="meta-v">{{ project.siteArea }}</p></div>
          <div v-if="project.grossArea"><p class="ps-label meta-k">Gross area</p><p class="meta-v">{{ project.grossArea }}</p></div>
          <div v-if="project.architect"><p class="ps-label meta-k">Architect</p><p class="meta-v">{{ project.architect }}</p></div>
          <div v-if="project.completed || project.year"><p class="ps-label meta-k">Completed</p><p class="meta-v">{{ project.completed || project.year }}</p></div>
          <div><p class="ps-label meta-k">Stage</p><p class="meta-v">{{ project.status }}</p></div>
        </div>
      </div>
    </section>

    <!-- Story -->
    <section class="section detail-story-sec">
      <div class="container">
        <div class="split detail-story ps-reveal">
          <div><p class="ps-label">The story</p></div>
          <div>
            <p class="ps-lead detail-desc">{{ project.description }}</p>
            <p v-if="project.program" class="ps-body detail-program"><span class="prog-k">Program</span> {{ project.program }}</p>
            <ul v-if="project.keywords && project.keywords.length" class="detail-tags">
              <li v-for="k in project.keywords.slice(0, 12)" :key="k">{{ k }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="section detail-gallery-sec" v-if="project.images.length > 1">
      <div class="container">
        <p class="ps-label gallery-label ps-reveal">Gallery · {{ project.images.length - 1 }} images</p>
        <div class="gallery">
          <figure class="gallery-item ps-reveal" v-for="(img, i) in project.images.slice(1)" :key="i">
            <img :src="img" :alt="`${project.title} — ${i + 2}`" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <!-- Next project -->
    <section class="section detail-next" v-if="next">
      <div class="container detail-next-inner">
        <div>
          <p class="ps-label">Next project</p>
          <h2 class="ps-h1 next-title">{{ next.title }}</h2>
        </div>
        <div class="detail-next-links">
          <router-link :to="`/project/${next.id}`" class="cta">View {{ next.title }}</router-link>
          <router-link to="/projects" class="cta">All projects</router-link>
        </div>
      </div>
    </section>
  </main>

  <main v-else-if="!loading" class="section">
    <div class="container" style="text-align:center;">
      <h2 class="ps-h1">Project not found</h2>
      <p style="margin-top:24px;"><router-link to="/projects" class="btn-theme btn-theme--outline">Back to work</router-link></p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const projects = ref([])
const project = ref(null)
const loading = ref(true)
const heroClass = ref('')

// Adapt the hero plate to the hero image's orientation: landscape/wide images
// get a 16:9 band (fills without clipping a tall subject); portrait heroes keep
// the default tall plate.
function onHeroLoad(e) {
  const img = e.target
  heroClass.value = img.naturalHeight && img.naturalWidth / img.naturalHeight >= 1.4 ? 'is-wide' : 'is-tall'
}

const next = computed(() => {
  if (!project.value || !projects.value.length) return null
  const i = projects.value.findIndex(p => p.id === project.value.id)
  return projects.value[(i + 1) % projects.value.length]
})

async function load() {
  loading.value = true
  heroClass.value = ''
  try {
    if (!projects.value.length) {
      const res = await fetch('/data/projects.json')
      projects.value = await res.json()
    }
    project.value = projects.value.find(p => p.id === route.params.id) || null
  } catch (e) {
    console.error('Failed to load project:', e)
    project.value = null
  }
  loading.value = false
}

onMounted(load)
watch(() => route.params.id, load)
</script>

<style lang="scss" scoped>
/* --- Plate --- */
.detail-hero {
  position: relative;
  height: 76vh;
  min-height: 460px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: var(--stripe-dark);

  > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
}
/* Landscape/wide heroes: full-bleed width, height driven toward 16:9 (56.25vw)
   but capped at 86vh. Using an explicit height (not aspect-ratio + max-height)
   keeps the banner full width — no blank gap — and object-fit:cover absorbs the
   small top/bottom trim when the cap engages. */
.detail-hero.is-wide {
  width: 100%;
  height: min(56.25vw, 86vh);
  min-height: 0;
}
@media (max-width: 640px) {
  .detail-hero.is-wide { height: 68vh; }
}
.detail-scrim { position: absolute; inset: 0; background: var(--scrim); }
.detail-tri { position: absolute; top: 0; right: 0; width: 28vw; height: 28vw; background: var(--pink-studio); opacity: .16; clip-path: var(--tri-tr); }
.detail-hero-inner { position: relative; z-index: 2; width: 100%; padding-bottom: 48px; }
.detail-eyebrow { color: rgba(255,255,255,.78); }
.detail-title { color: #fff; margin-top: 10px; }

/* --- Meta strip --- */
.detail-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px 40px;
  padding-bottom: 44px;
  border-bottom: var(--border-soft);

  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
}
.meta-k { font-size: 11px; color: var(--ink); margin-bottom: 6px; }
.meta-v { font: var(--weight-regular) 15px/1.5 var(--font-ui); color: var(--ink-soft); }

/* --- Story --- */
.detail-story-sec { padding-top: 56px; }
.detail-desc { max-width: 60ch; color: var(--ink); }
.detail-program { margin-top: 22px; font-size: 15px; }
.prog-k { display: inline-block; font-weight: 700; color: var(--pink-crimson); margin-right: 6px; text-transform: uppercase; letter-spacing: var(--track-caps); font-size: 11px; }
.detail-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px; }
.detail-tags li {
  font: var(--weight-regular) 11px/1 var(--font-mono);
  color: var(--pink-crimson);
  background: var(--pink-petal);
  padding: 6px 10px;
}

/* --- Gallery --- */
.detail-gallery-sec { padding-top: 0; }
.gallery-label { display: block; margin-bottom: 22px; }
.gallery { columns: 2; column-gap: 26px; }
@media (max-width: 640px) { .gallery { columns: 1; } }
.gallery-item { margin: 0 0 26px; break-inside: avoid; }
.gallery-item img { width: 100%; height: auto; display: block; }

/* --- Next --- */
.detail-next { border-top: var(--border-soft); }
.detail-next-inner { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
.next-title { margin-top: 12px; }
.detail-next-links { display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }
</style>
