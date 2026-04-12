<template>
  <main>
    <section class="page-banner">
      <div class="banner-bg">
        <img src="/images/01-foresty-garden/foresty-garden-001.png" alt="Projects" />
        <div class="banner-overlay"></div>
      </div>
      <div class="container banner-content">
        <h1>Our Projects</h1>
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <span>/</span>
          <span>Projects</span>
        </div>
      </div>
    </section>

    <ProjectsSection :limit="0" :showViewAll="false" />
  </main>
</template>

<script setup>
import ProjectsSection from '../components/ProjectsSection.vue'
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
    font-size: 52px;
    font-weight: 700;
    color: $color-white;
    margin-bottom: 16px;
    @media (max-width: 768px) { font-size: 36px; }
  }
}

.breadcrumb {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  gap: 12px;
  a { color: rgba(255, 255, 255, 0.6); &:hover { color: $color-accent; } }
}
</style>
