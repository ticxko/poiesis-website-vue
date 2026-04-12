<template>
  <main>
    <!-- Page Banner -->
    <section class="page-banner" v-if="project">
      <div class="banner-bg">
        <img :src="project.images[0]" :alt="project.title" />
        <div class="banner-overlay"></div>
      </div>
      <div class="container banner-content">
        <h1>{{ project.title }}</h1>
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <span>/</span>
          <router-link to="/projects">Projects</router-link>
          <span>/</span>
          <span>{{ project.title }}</span>
        </div>
      </div>
    </section>

    <!-- Project Content -->
    <section class="section" v-if="project">
      <div class="container">
        <div class="detail-grid">
          <div class="detail-main">
            <div class="detail-hero">
              <img :src="project.images[0]" :alt="project.title" />
            </div>
            <h2 class="detail-title">About This Project</h2>
            <p class="detail-desc">{{ project.description }}</p>

            <div class="detail-gallery" v-if="project.images.length > 1">
              <h3>Gallery</h3>
              <div class="gallery-grid">
                <div
                  class="gallery-item"
                  v-for="(img, i) in project.images.slice(1)"
                  :key="i"
                >
                  <img :src="img" :alt="`${project.title} - ${i + 1}`" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <aside class="detail-sidebar">
            <h3>Project Info</h3>
            <div class="sidebar-items">
              <div class="sidebar-item" v-if="project.category">
                <span class="sidebar-label">Type</span>
                <span class="sidebar-value">{{ project.category }}</span>
              </div>
              <div class="sidebar-item" v-if="project.location">
                <span class="sidebar-label">Location</span>
                <span class="sidebar-value">{{ project.location }}</span>
              </div>
              <div class="sidebar-item" v-if="project.client">
                <span class="sidebar-label">Client</span>
                <span class="sidebar-value">{{ project.client }}</span>
              </div>
              <div class="sidebar-item" v-if="project.siteArea">
                <span class="sidebar-label">Site Area</span>
                <span class="sidebar-value">{{ project.siteArea }}</span>
              </div>
              <div class="sidebar-item" v-if="project.grossArea">
                <span class="sidebar-label">Gross Area</span>
                <span class="sidebar-value">{{ project.grossArea }}</span>
              </div>
              <div class="sidebar-item" v-if="project.architect">
                <span class="sidebar-label">Architect</span>
                <span class="sidebar-value">{{ project.architect }}</span>
              </div>
              <div class="sidebar-item" v-if="project.year">
                <span class="sidebar-label">Completed</span>
                <span class="sidebar-value">{{ project.year }}</span>
              </div>
            </div>

            <router-link to="/contact" class="btn-theme sidebar-cta">
              Start a Project <i class="pi pi-arrow-right"></i>
            </router-link>
          </aside>
        </div>
      </div>
    </section>

    <!-- Loading / Not Found -->
    <section class="section" v-if="!project && !loading">
      <div class="container" style="text-align: center;">
        <h2>Project not found</h2>
        <router-link to="/projects" class="btn-theme btn-theme--outline" style="margin-top: 24px;">
          Back to Projects
        </router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const project = ref(null)
const loading = ref(true)

async function loadProject() {
  loading.value = true
  try {
    const res = await fetch('/data/projects.json')
    const projects = await res.json()
    project.value = projects.find(p => p.id === route.params.id) || null
  } catch (e) {
    console.error('Failed to load project:', e)
    project.value = null
  }
  loading.value = false
}

onMounted(loadProject)
watch(() => route.params.id, loadProject)
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.page-banner {
  position: relative;
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.banner-bg {
  position: absolute;
  inset: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(23, 23, 23, 0.7);
}

.banner-content {
  position: relative;
  z-index: 2;

  h1 {
    font-size: 48px;
    font-weight: 700;
    color: $color-white;
    margin-bottom: 16px;
    @media (max-width: 768px) { font-size: 30px; }
  }
}

.breadcrumb {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  a { color: rgba(255, 255, 255, 0.6); &:hover { color: $color-accent; } }
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 60px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.detail-hero {
  margin-bottom: 40px;

  img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
}

.detail-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
}

.detail-desc {
  font-size: 16px;
  line-height: 1.8;
  color: $color-gray;
  margin-bottom: 48px;
}

.detail-gallery {
  h3 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 24px;
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.gallery-item {
  overflow: hidden;

  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.03);
    }
  }
}

.detail-sidebar {
  background-color: $color-gray-light;
  padding: 40px;
  position: sticky;
  top: 120px;

  @media (max-width: 992px) {
    position: static;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid $color-dark;
  }
}

.sidebar-items {
  margin-bottom: 32px;
}

.sidebar-item {
  padding: 12px 0;
  border-bottom: 1px solid $color-border;
}

.sidebar-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: $color-gray;
  margin-bottom: 4px;
}

.sidebar-value {
  font-size: 15px;
  font-weight: 500;
}

.sidebar-cta {
  width: 100%;
  justify-content: center;
}
</style>
