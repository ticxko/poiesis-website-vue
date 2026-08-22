<template>
  <div id="poiesis-app">
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
let io = null
let fallback = null

function revealAll() {
  document.querySelectorAll('.ps-reveal:not(.is-in)').forEach(el => el.classList.add('is-in'))
}
function scan() {
  if (!io) return
  document.querySelectorAll('.ps-reveal:not(.is-in)').forEach(el => io.observe(el))
  // Safety net: never let content stay hidden if the observer misses something.
  clearTimeout(fallback)
  fallback = setTimeout(revealAll, 1600)
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) { revealAll(); return }
  io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  scan()
})

watch(() => route.fullPath, () => nextTick(() => setTimeout(scan, 60)))
onUnmounted(() => { io?.disconnect(); clearTimeout(fallback) })
</script>
