<template>
  <section class="section browse" ref="sectionRef">
    <div class="container">
      <div class="browse-head ps-reveal">
        <p class="ps-label">Selected work</p>
        <h2 class="ps-h1 browse-title">Built work and design studies across the city and beyond.</h2>
      </div>

      <div class="project-filters">
        <button class="filter-btn" :class="{ active: activeTag === 'all' }" @click="setTag('all')">All</button>
        <button
          v-for="tag in TAGS"
          :key="tag"
          class="filter-btn"
          :class="{ active: activeTag === tag }"
          @click="setTag(tag)"
        >{{ tag }}</button>
      </div>

      <div class="browse-groups">
        <section v-for="group in visibleGroups" :key="group.tag" class="tag-group">
          <div class="group-head">
            <h3 class="group-label">{{ group.tag }}</h3>
            <span class="group-count">{{ group.projects.length }}</span>
          </div>

          <div class="browse-grid">
            <router-link
              v-for="project in group.projects"
              :key="group.tag + '-' + project.id"
              :to="`/project/${project.id}`"
              class="browse-card fade-in"
            >
              <div class="card-media">
                <picture>
                  <source :srcset="smThumbWebp(cardImage(project, group.tag))" type="image/webp" />
                  <img :src="smThumb(cardImage(project, group.tag))" :alt="project.title" loading="lazy" decoding="async" />
                </picture>
              </div>
              <div class="card-row">
                <div class="card-meta">
                  <span class="card-title">{{ project.title }}</span>
                  <span class="card-sub">{{ project.category }} · {{ project.year }}</span>
                </div>
                <span class="cta card-cta">Discover</span>
              </div>
            </router-link>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// The category taxonomy, in the display/section order used for chips and groups.
const TAGS = ['architecture', 'interior', 'exhibition', 'residential', 'industrial & utility', 'built', 'concept', 'high-rise']

const allProjects = ref([])
// Manual, human-curated sequence per category (data/category-order.json):
// { "<tag>": ["slug-a", "slug-b", ...] }. Edit it with the drag-and-drop tool
// at /curate.html. Any project missing from a tag's list falls to the end in
// file order, so the file never has to be exhaustive to be safe.
const categoryOrder = ref({})
const activeTag = ref('all')
const sectionRef = ref(null)
let observer = null

// In the "interior" group, show each project's dedicated interior shot
// (interiorThumbnail) rather than its default — usually exterior — thumbnail.
// Every other group keeps the standard thumbnail.
function cardImage(project, tag) {
  if (tag === 'interior' && project.interiorThumbnail) return project.interiorThumbnail
  return project.thumbnail
}

// Grid tiles use the lightweight ~800px thumbnail (plenty for a 4-up landscape card).
function smThumb(src) {
  if (!src) return src
  const [path, q] = src.split('?')
  const sm = path.replace(/\.(png|jpe?g)$/i, '-sm.jpg')
  return q ? `${sm}?${q}` : sm
}
function smThumbWebp(src) {
  if (!src) return src
  const [path, q] = src.split('?')
  const sm = path.replace(/\.(png|jpe?g)$/i, '-sm.jpg.webp')
  return q ? `${sm}?${q}` : sm
}

// One group per tag; a project appears in every group whose tag it carries.
// Each section's sequence is the curated order in category-order.json. Projects
// not listed for a tag sort to the end (in file order). If the file failed to
// load, architecture falls back to its legacy `archRank`; others keep file order.
const groups = computed(() =>
  TAGS.map(tag => {
    let projects = allProjects.value.filter(p => Array.isArray(p.tags) && p.tags.includes(tag))
    const seq = categoryOrder.value[tag]
    if (Array.isArray(seq) && seq.length) {
      const rank = id => { const i = seq.indexOf(id); return i === -1 ? Infinity : i }
      projects = projects
        .map((p, i) => [p, i])
        .sort((a, b) => (rank(a[0].id) - rank(b[0].id)) || (a[1] - b[1]))
        .map(pair => pair[0])
    } else if (tag === 'architecture') {
      projects = [...projects].sort((a, b) => (a.archRank ?? 999) - (b.archRank ?? 999))
    }
    return { tag, projects }
  }).filter(g => g.projects.length)
)

const visibleGroups = computed(() =>
  activeTag.value === 'all' ? groups.value : groups.value.filter(g => g.tag === activeTag.value)
)

function setTag(tag) {
  activeTag.value = tag
  nextTick(animateCards)
}

function animateCards() {
  const cards = document.querySelectorAll('.browse .browse-card')
  cards.forEach((el, i) => {
    el.classList.remove('visible')
    setTimeout(() => el.classList.add('visible'), Math.min(i, 12) * 45)
  })
}

onMounted(async () => {
  try {
    const [projRes, orderRes] = await Promise.all([
      fetch('/data/projects.json'),
      fetch('/data/category-order.json'),
    ])
    allProjects.value = await projRes.json()
    if (orderRes.ok) categoryOrder.value = await orderRes.json()
  } catch (e) {
    console.error('Failed to load projects:', e)
  }
  await nextTick()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.browse .browse-card').forEach(el => el.classList.add('visible'))
    return
  }
  // threshold 0 (not a fraction of the section): a fractional threshold can never be
  // reached when the section is taller than the viewport — which happens for the full
  // ALL list on phones — leaving every card stuck at opacity:0. Fire on first contact.
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCards(); observer.disconnect() }
    })
  }, { threshold: 0 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
.browse-head { margin-bottom: 40px; }
.browse-title { max-width: var(--measure-headline); margin-top: 16px; }

/* --- Filters (unchanged chrome from the old grid) --- */
.project-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 56px;
}
.filter-btn {
  background: none;
  border: var(--border-hairline);
  padding: 10px 20px;
  font: var(--weight-medium) 11px/1 var(--font-ui);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--ink-label);
  cursor: pointer;
  transition: all var(--transition-hover);

  &:hover, &.active {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--nat-cream);
  }
}

/* --- Tag groups --- */
.tag-group + .tag-group { margin-top: 72px; }
.group-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 18px;
  margin-bottom: 32px;
  border-bottom: var(--border-hairline);
}
.group-label {
  font: var(--weight-medium) 12px/1 var(--font-ui);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--ink);
}
.group-count {
  font: var(--weight-regular) 11px/1 var(--font-ui);
  letter-spacing: var(--track-caps);
  color: var(--ink-label);
}

/* --- Grid: 4-up landscape cards --- */
.browse-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: var(--gap-col);
  row-gap: 44px;

  @media (max-width: 1100px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 760px)  { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 460px)  { grid-template-columns: 1fr; }
}

.browse-card {
  display: block;
  color: inherit;
  opacity: 0;
  transform: translateY(var(--reveal-shift));
  transition: opacity var(--dur-slow) var(--ease), transform var(--dur-slow) var(--ease);
  &.visible { opacity: 1; transform: none; }
}
.card-media {
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--ground-alt);
  img { width: 100%; height: 100%; object-fit: cover; transition: opacity var(--transition-hover), transform var(--dur-slow) var(--ease); }
}
.browse-card:hover .card-media img { opacity: 0.9; transform: scale(1.03); }

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-top: 12px;
}
.card-title { display: block; font: var(--weight-medium) var(--t-lead)/1.25 var(--font-ui); }
.card-sub { display: block; font: var(--weight-regular) var(--t-small)/1.5 var(--font-ui); color: var(--ink-label); margin-top: 3px; }
.card-cta { flex-shrink: 0; white-space: nowrap; }
.browse-card:hover .card-cta { font-weight: 700; }
</style>
