<template>
  <section class="hero">
    <div class="hero-slideshow" aria-hidden="true">
      <div
        class="hero-slide"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: currentSlide === index }"
      >
        <img :src="slide.image" :alt="slide.alt" />
      </div>
      <span class="hero-tri"></span>
      <span class="hero-scrim"></span>
    </div>

    <div class="container hero-content">
      <div class="hero-lead">
        <p class="ps-label hero-eyebrow fade-up" ref="eyebrow">Jakarta, Indonesia</p>
        <h1 class="ps-display hero-title fade-up" ref="title">Spaces with soul.</h1>
        <p class="hero-origin fade-up" ref="origin">
          <span class="greek" lang="grc">ποίησις</span>
          <span class="gloss">the art of bringing a story into being</span>
        </p>
      </div>
      <div class="hero-meta fade-up" ref="meta">
        <p class="ps-label">Narrative-driven placemaking</p>
        <p class="ps-label hero-meta-dim">Est. PT. Pencipta Organik Imaji</p>
      </div>
    </div>

    <div class="hero-indicators">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="indicator"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ><span class="indicator-fill"></span></button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { image: '/images/hero/edge.jpg', alt: 'Edge House — Poiesis Studio' },
  { image: '/images/hero/spanish.jpg', alt: 'Spanish Villa — Poiesis Studio' },
  { image: '/images/hero/cempaka.jpg', alt: 'Rumah Cempaka — Poiesis Studio' },
  { image: '/images/hero/mampang.jpeg', alt: '485 — Poiesis Studio' },
  { image: '/images/hero/wanggamet.jpg', alt: 'Wanggamet — Poiesis Studio' },
]

const currentSlide = ref(0)
let slideInterval = null

const eyebrow = ref(null)
const title = ref(null)
const origin = ref(null)
const meta = ref(null)

function goToSlide(index) {
  if (index === currentSlide.value) return
  currentSlide.value = index
  resetInterval()
}
function nextSlide() { currentSlide.value = (currentSlide.value + 1) % slides.length }
function resetInterval() { clearInterval(slideInterval); slideInterval = setInterval(nextSlide, 6000) }

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ;[eyebrow.value, title.value, origin.value, meta.value].forEach((el, i) => {
    if (el) setTimeout(() => el.classList.add('visible'), reduce ? 0 : 200 + i * 160)
  })
  if (!reduce) slideInterval = setInterval(nextSlide, 6000)
})
onUnmounted(() => clearInterval(slideInterval))
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: var(--stripe-dark);
}

.hero-slideshow { position: absolute; inset: 0; z-index: 0; }
.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.4s var(--ease);

  img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.02); transition: transform 7s ease; }
  &.active { opacity: 1; img { transform: scale(1.09); } }
}
.hero-tri {
  position: absolute;
  top: 0; right: 0;
  width: 34vw; height: 34vw;
  background: var(--pink-studio);
  opacity: 0.16;
  clip-path: var(--tri-tr);
  z-index: 2;
}
.hero-scrim { position: absolute; inset: 0; z-index: 2; background: var(--scrim); }

.hero-content {
  position: relative;
  z-index: 3;
  width: 100%;
  padding-bottom: 52px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}
.hero-eyebrow { color: rgba(255, 255, 255, 0.78); }
.hero-title { color: #fff; margin-top: 10px; }

/* ποίησις — the brand's intellectual signature, in the editorial serif */
.hero-origin {
  margin-top: 20px;
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  font-family: var(--font-editorial);
}
.hero-origin .greek {
  font-style: italic;
  font-weight: var(--weight-regular);
  font-size: clamp(24px, 3.4vw, 40px);
  line-height: 1;
  letter-spacing: .01em;
  color: #fff;
}
.hero-origin .gloss {
  position: relative;
  padding-left: 20px;
  font-style: italic;
  font-size: clamp(15px, 1.7vw, 20px);
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.74);
}
.hero-origin .gloss::before {
  content: "";
  position: absolute; left: 0; top: 0.7em;
  width: 12px; height: 1px;
  background: var(--pink-soft);
}

.hero-meta { text-align: right; }
.hero-meta .ps-label { color: rgba(255, 255, 255, 0.78); }
.hero-meta-dim { color: rgba(255, 255, 255, 0.5) !important; margin-top: 4px; }

.fade-up {
  opacity: 0;
  transform: translateY(var(--reveal-shift));
  transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
  &.visible { opacity: 1; transform: none; }
}

.hero-indicators {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 4;
}
.indicator {
  width: 34px; height: 2px;
  background: rgba(255, 255, 255, 0.28);
  border: none; padding: 0; cursor: pointer;
  position: relative; overflow: hidden;
  transition: background var(--transition-hover);
  &:hover { background: rgba(255, 255, 255, 0.5); }
  .indicator-fill { position: absolute; inset: 0 auto 0 0; width: 0; background: #fff; }
  &.active .indicator-fill { animation: indicatorProgress 6s linear forwards; }
}
@keyframes indicatorProgress { from { width: 0; } to { width: 100%; } }
@media (prefers-reduced-motion: reduce) {
  .indicator.active .indicator-fill { animation: none; width: 100%; }
}

@media (max-width: 640px) {
  .hero-meta { text-align: left; }
}
</style>
