<template>
  <section class="section projects-section" ref="sectionRef">
    <div class="container">
      <div class="section-header">
        <span class="section-subtitle">Portfolio</span>
        <h2 class="section-title">Recent Projects</h2>
      </div>

      <div class="project-filters">
        <button
          class="filter-btn"
          :class="{ active: activeFilter === 'all' }"
          @click="setFilter('all')"
        >Show All</button>
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
          :ref="el => { if (el) cardEls.push(el.$el || el) }"
        >
          <div class="card-image">
            <img :src="project.thumbnail" :alt="project.title" loading="lazy" />
          </div>
          <div class="card-overlay">
            <div class="card-info">
              <span class="card-category">{{ project.category }}</span>
              <h3 class="card-title">{{ project.title }}</h3>
              <span class="card-year">{{ project.year }}</span>
            </div>
            <span class="card-arrow">
              <i class="pi pi-arrow-up-right"></i>
            </span>
          </div>
        </router-link>
      </div>

      <div class="projects-cta" v-if="showViewAll">
        <router-link to="/projects" class="btn-theme btn-theme--outline">
          View All Projects <i class="pi pi-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  limit: { type: Number, default: 6 },
  showViewAll: { type: Boolean, default: true }
})

const allProjects = ref([])
const activeFilter = ref('all')
const categories = ['Architecture', 'Architecture & Interior', 'Interior Design']
const sectionRef = ref(null)
const cardEls = ref([])
let observer = null

const filteredProjects = computed(() => {
  const list = activeFilter.value === 'all'
    ? allProjects.value
    : allProjects.value.filter(p => p.category === activeFilter.value)
  return props.limit ? list.slice(0, props.limit) : list
})

function setFilter(cat) {
  activeFilter.value = cat
  nextTick(() => animateCards())
}

function animateCards() {
  cardEls.value = []
  nextTick(() => {
    const cards = document.querySelectorAll('.project-card')
    cards.forEach((el, i) => {
      el.classList.remove('visible')
      setTimeout(() => el.classList.add('visible'), i * 80)
    })
  })
}

onMounted(async () => {
  try {
    const res = await fetch('/data/projects.json')
    allProjects.value = await res.json()
  } catch (e) {
    console.error('Failed to load projects:', e)
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCards()
          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.project-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.filter-btn {
  background: none;
  border: 1px solid $color-border;
  padding: 10px 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: $color-gray;
  cursor: pointer;
  border-radius: 50px;
  transition: all $transition-base;

  &:hover,
  &.active {
    background-color: $color-dark;
    color: $color-white;
    border-color: $color-dark;
  }
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.project-card {
  position: relative;
  overflow: hidden;
  display: block;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .card-image {
    aspect-ratio: 1 / 1;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover .card-image img {
    transform: scale(1.05);
  }
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(23, 23, 23, 0.87);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  opacity: 0;
  transition: opacity $transition-base;

  .project-card:hover & {
    opacity: 1;
  }
}

.card-info {
  transform: translateY(20px);
  transition: transform $transition-slow;

  .project-card:hover & {
    transform: translateY(0);
  }
}

.card-category {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: $color-accent;
  display: block;
  margin-bottom: 8px;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: $color-white;
  margin-bottom: 4px;
}

.card-year {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.card-arrow {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-white;
  opacity: 0;
  transform: translateY(10px);
  transition: all $transition-slow;

  .project-card:hover & {
    opacity: 1;
    transform: translateY(0);
  }
}

.projects-cta {
  text-align: center;
  margin-top: 60px;
}
</style>
