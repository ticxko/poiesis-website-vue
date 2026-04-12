<template>
  <section class="section about-section" ref="sectionRef">
    <div class="container">
      <div class="about-grid">
        <div class="about-image fade-in" ref="imageRef">
          <img src="/images/03-spanish-villa/spanish-villa-001.jpg" alt="Poiesis Studio project" />
          <div class="about-image-accent"></div>
        </div>
        <div class="about-content">
          <span class="section-subtitle fade-in" ref="sub">About Us</span>
          <h2 class="section-title fade-in" ref="titleRef">Passionate About<br>Architecture</h2>
          <p class="about-text fade-in" ref="textRef">
            Founded by Mayang Ratih as Principal and Jessica Sarana as Partner,
            Poiesis Studio is a Jakarta-based consultancy focused on the process
            of narrative approach. We believe that before any spatial program or
            aesthetic form is designed, a foundational story must be established.
          </p>
          <div class="about-bars fade-in" ref="barsRef">
            <div class="bar-item" v-for="bar in bars" :key="bar.label">
              <div class="bar-header">
                <span class="bar-label">{{ bar.label }}</span>
                <span class="bar-value">{{ bar.value }}%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: animated ? bar.value + '%' : '0%' }"></div>
              </div>
            </div>
          </div>
          <router-link to="/about" class="btn-theme" ref="btnRef">
            Learn More <i class="pi pi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const bars = [
  { label: 'Architecture', value: 90 },
  { label: 'Interior Design', value: 85 },
  { label: 'Renovation', value: 75 },
]

const sectionRef = ref(null)
const imageRef = ref(null)
const sub = ref(null)
const titleRef = ref(null)
const textRef = ref(null)
const barsRef = ref(null)
const animated = ref(false)

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const els = [imageRef.value, sub.value, titleRef.value, textRef.value, barsRef.value]
          els.forEach((el, i) => {
            if (el) setTimeout(() => el.classList.add('visible'), i * 150)
          })
          setTimeout(() => { animated.value = true }, 600)
          observer.disconnect()
        }
      })
    },
    { threshold: 0.2 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.about-image {
  position: relative;

  img {
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
  }

  .about-image-accent {
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 40%;
    height: 40%;
    border: 3px solid $color-accent;
    z-index: -1;
  }
}

.about-text {
  font-size: 16px;
  color: $color-gray;
  line-height: 1.8;
  margin-bottom: 32px;
}

.about-bars {
  margin-bottom: 40px;
}

.bar-item {
  margin-bottom: 20px;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.bar-label {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bar-value {
  font-size: 14px;
  font-weight: 600;
  color: $color-accent;
}

.bar-track {
  width: 100%;
  height: 4px;
  background-color: $color-border;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background-color: $color-dark;
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
