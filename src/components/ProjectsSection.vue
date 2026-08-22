<template>
  <section class="section projects-section" :class="{ 'is-all': !limit }" ref="sectionRef">
    <div class="container">
      <div class="projects-head ps-reveal">
        <p class="ps-label">Selected work</p>
        <div class="projects-head-row">
          <h2 class="ps-h1 projects-title">
            {{ limit ? 'Every project begins as a conversation, not a plan.' : 'Built work and design studies across the city and beyond.' }}
          </h2>
          <router-link v-if="limit && showViewAll" to="/projects" class="cta projects-head-cta">All projects</router-link>
        </div>
      </div>

      <div class="project-filters" v-if="!limit">
        <button class="filter-btn" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">All</button>
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-btn"
          :class="{ active: activeFilter === cat }"
          @click="setFilter(cat)"
        >{{ cat }}</button>
      </div>

      <div class="project-grid">
        <router-link
          v-for="project in filteredProjects"
          :key="project.id"
          :to="`/project/${project.id}`"
          class="project-card fade-in"
        >
          <div class="card-media">
            <img :src="project.thumbnail" :alt="project.title" loading="lazy" />
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
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  limit: { type: Number, default: 6 },
  showViewAll: { type: Boolean, default: true },
})

const allProjects = ref([])
const activeFilter = ref('all')
const sectionRef = ref(null)
let observer = null

const categories = computed(() => [...new Set(allProjects.value.map(p => p.category))])

const filteredProjects = computed(() => {
  const list = activeFilter.value === 'all'
    ? allProjects.value
    : allProjects.value.filter(p => p.category === activeFilter.value)
  return props.limit ? list.slice(0, props.limit) : list
})

function setFilter(cat) {
  activeFilter.value = cat
  nextTick(animateCards)
}

function animateCards() {
  const cards = document.querySelectorAll('.projects-section .project-card')
  cards.forEach((el, i) => {
    el.classList.remove('visible')
    setTimeout(() => el.classList.add('visible'), i * 60)
  })
}

onMounted(async () => {
  try {
    const res = await fetch('/data/projects.json')
    allProjects.value = await res.json()
  } catch (e) {
    console.error('Failed to load projects:', e)
  }
  await nextTick()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.projects-section .project-card').forEach(el => el.classList.add('visible'))
    return
  }
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCards(); observer.disconnect() }
    })
  }, { threshold: 0.08 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
.projects-head { margin-bottom: 48px; }
.projects-head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 16px;
}
.projects-title { max-width: var(--measure-headline); }
.projects-head-cta { flex-shrink: 0; padding-bottom: 6px; }

/* --- Filters --- */
.project-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 40px;
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

/* --- Grid --- */
.project-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--gap-col);
  row-gap: var(--gap-row);
}
.projects-section.is-all .project-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  row-gap: 56px;

  @media (max-width: 991px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  /* Single column on phones. Kept at this selector's specificity so it wins over
     the 991px rule above (equal specificity, later source order) — a plain
     `.project-grid` rule would lose to `.projects-section.is-all .project-grid`. */
  @media (max-width: 640px) { grid-template-columns: 1fr; }
}
@media (max-width: 640px) { .project-grid { grid-template-columns: 1fr; } }

.project-card {
  display: block;
  color: inherit;
  opacity: 0;
  transform: translateY(var(--reveal-shift));
  transition: opacity var(--dur-slow) var(--ease), transform var(--dur-slow) var(--ease);
  &.visible { opacity: 1; transform: none; }
}
.card-media {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--ground-alt);
  img { width: 100%; height: 100%; object-fit: cover; transition: opacity var(--transition-hover), transform var(--dur-slow) var(--ease); }
}
.project-card:hover .card-media img { opacity: 0.9; transform: scale(1.03); }

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-top: 14px;
}
.card-title { display: block; font: var(--weight-medium) var(--t-lead)/1.25 var(--font-ui); }
.card-sub { display: block; font: var(--weight-regular) var(--t-small)/1.5 var(--font-ui); color: var(--ink-label); margin-top: 3px; }
.project-card:hover .card-cta { font-weight: 700; }
</style>
