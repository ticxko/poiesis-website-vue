<template>
  <section class="hero">
    <!-- Slideshow backgrounds -->
    <div class="hero-slideshow">
      <div
        class="hero-slide"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: currentSlide === index, prev: prevSlide === index }"
      >
        <img :src="slide.image" :alt="slide.alt" />
      </div>
      <div class="hero-overlay"></div>
    </div>

    <!-- Content -->
    <div class="container hero-content">
      <p class="hero-subtitle fade-up" ref="subtitle">Architecture & Interior Design</p>
      <h1 class="hero-title fade-up" ref="title">
        We Create Spaces<br>
        That Tell <span class="text-accent">Stories</span>
      </h1>
      <p class="hero-desc fade-up" ref="desc">
        A Jakarta-based architecture and interior design consultancy focused on
        narrative-driven placemaking. We believe that before any spatial program is designed,
        a foundational story must be established.
      </p>
      <div class="hero-actions fade-up" ref="actions">
        <router-link to="/projects" class="btn-theme btn-theme--white">View Projects</router-link>
        <router-link to="/contact" class="btn-theme btn-theme--outline hero-btn-outline">Get In Touch</router-link>
      </div>
    </div>

    <!-- Slide indicators -->
    <div class="hero-indicators">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="indicator"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      >
        <span class="indicator-fill"></span>
      </button>
    </div>

    <!-- Slide counter -->
    <div class="hero-counter">
      <span class="counter-current">{{ String(currentSlide + 1).padStart(2, '0') }}</span>
      <span class="counter-sep">/</span>
      <span class="counter-total">{{ String(slides.length).padStart(2, '0') }}</span>
    </div>

    <div class="hero-scroll">
      <span>Scroll</span>
      <div class="scroll-line"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { image: '/images/hero/wanggamet.jpg', alt: 'Wanggamet Kitchen — Poiesis Studio' },
  { image: '/images/hero/edge.jpg', alt: 'Edge House — Poiesis Studio' },
  { image: '/images/hero/mampang.jpeg', alt: 'Mampang — Poiesis Studio' },
  { image: '/images/hero/cempaka.jpg', alt: 'Rumah Cempaka — Poiesis Studio' },
  { image: '/images/hero/intro.jpg', alt: 'Poiesis Studio' },
  { image: '/images/hero/spanish.jpg', alt: 'Spanish Villa — Poiesis Studio' },
]

const currentSlide = ref(0)
const prevSlide = ref(-1)
let slideInterval = null

const subtitle = ref(null)
const title = ref(null)
const desc = ref(null)
const actions = ref(null)

function goToSlide(index) {
  if (index === currentSlide.value) return
  prevSlide.value = currentSlide.value
  currentSlide.value = index
  resetInterval()
}

function nextSlide() {
  prevSlide.value = currentSlide.value
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function resetInterval() {
  clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000)
}

onMounted(() => {
  // Animate text in
  const els = [subtitle.value, title.value, desc.value, actions.value]
  els.forEach((el, i) => {
    if (el) setTimeout(() => el.classList.add('visible'), 300 + i * 200)
  })

  // Start slideshow
  slideInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => clearInterval(slideInterval))
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.hero {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

/* --- Slideshow --- */
.hero-slideshow {
  position: absolute;
  inset: 0;
}

.hero-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s ease;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1);
    transition: transform 6s ease;
  }

  &.active {
    opacity: 1;
    z-index: 1;

    img {
      transform: scale(1.05);
    }
  }

  &.prev {
    opacity: 0;
    z-index: 0;
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(23, 23, 23, 0.55) 0%,
    rgba(23, 23, 23, 0.7) 100%
  );
}

/* --- Content --- */
.hero-content {
  position: relative;
  z-index: 3;
  max-width: 800px;
}

.hero-subtitle {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: $color-accent;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 62px;
  font-weight: 700;
  color: $color-white;
  line-height: 1.1;
  letter-spacing: -1px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
}

.hero-desc {
  font-size: 17px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 560px;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-btn-outline {
  color: $color-white;
  border-color: rgba(255, 255, 255, 0.4);

  &:hover {
    background-color: $color-white;
    color: $color-dark;
    border-color: $color-white;
  }
}

/* --- Slide Indicators --- */
.hero-indicators {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 4;
}

.indicator {
  width: 40px;
  height: 3px;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background $transition-base;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .indicator-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    background: $color-white;
  }

  &.active .indicator-fill {
    animation: indicatorProgress 5s linear forwards;
  }
}

@keyframes indicatorProgress {
  from { width: 0; }
  to { width: 100%; }
}

/* --- Slide Counter --- */
.hero-counter {
  position: absolute;
  right: 40px;
  bottom: 40px;
  z-index: 4;
  display: flex;
  align-items: baseline;
  gap: 4px;

  @media (max-width: 768px) {
    display: none;
  }
}

.counter-current {
  font-size: 28px;
  font-weight: 700;
  color: $color-white;
}

.counter-sep {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 2px;
}

.counter-total {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.4);
}

/* --- Scroll --- */
.hero-scroll {
  position: absolute;
  bottom: 40px;
  left: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 4;

  @media (max-width: 768px) {
    display: none;
  }

  span {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.5);
  }

  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
    animation: scrollPulse 2s infinite;
  }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* --- Fade animations --- */
.fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
