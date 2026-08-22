<template>
  <main>
    <section class="page-plate">
      <img src="/images/hero/spanish.jpg" alt="" />
      <span class="plate-scrim" aria-hidden="true"></span>
      <span class="plate-tri" aria-hidden="true"></span>
      <div class="container plate-inner">
        <p class="ps-label plate-eyebrow">Selected work · 28 projects</p>
        <h1 class="ps-display plate-title">Work</h1>
      </div>
    </section>

    <ProjectsSection :limit="0" :showViewAll="false" />
  </main>
</template>

<script setup>
import ProjectsSection from '../components/ProjectsSection.vue'
</script>

<style lang="scss" scoped>
.page-plate {
  position: relative;
  height: 56vh;
  min-height: 380px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: var(--stripe-dark);

  > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
}
.plate-scrim { position: absolute; inset: 0; background: var(--scrim); }
.plate-tri { position: absolute; top: 0; right: 0; width: 26vw; height: 26vw; background: var(--pink-studio); opacity: .16; clip-path: var(--tri-tr); }
.plate-inner { position: relative; z-index: 2; width: 100%; padding-bottom: 44px; }
.plate-eyebrow { color: rgba(255,255,255,.78); }
.plate-title { color: #fff; margin-top: 10px; }
</style>
