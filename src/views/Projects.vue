<template>
  <main>
    <section class="page-plate">
      <img src="/images/hero/jatijajar.jpg" alt="" />
      <span class="plate-scrim" aria-hidden="true"></span>
      <span class="plate-tri" aria-hidden="true"></span>
      <div class="container plate-inner">
        <p class="ps-label plate-eyebrow">Selected work<template v-if="count"> · {{ count }} projects</template></p>
        <h1 class="ps-display plate-title">Work</h1>
      </div>
    </section>

    <ProjectsBrowse />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProjectsBrowse from '../components/ProjectsBrowse.vue'

// Live project count for the eyebrow — never goes stale as projects.json changes.
const count = ref(0)
onMounted(async () => {
  try {
    const res = await fetch('/data/projects.json')
    const data = await res.json()
    count.value = Array.isArray(data) ? data.length : 0
  } catch {
    /* leave 0 → the eyebrow just reads "Selected work" */
  }
})
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
