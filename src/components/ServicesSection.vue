<template>
  <section class="section section--gray services-section" ref="sectionRef">
    <div class="container">
      <div class="services-header">
        <div>
          <span class="section-subtitle">What We Do</span>
          <h2 class="section-title">Our Services</h2>
        </div>
        <p class="section-desc">
          We offer comprehensive architectural and interior design services,
          from initial concept through to construction management.
        </p>
      </div>

      <div class="services-grid">
        <div
          class="service-card fade-in"
          v-for="(service, index) in services"
          :key="service.title"
          :ref="el => { if (el) cardRefs[index] = el }"
        >
          <span class="service-num">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="service-icon">
            <i :class="service.icon"></i>
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-desc">{{ service.desc }}</p>
        </div>
      </div>

      <div class="services-features">
        <div class="feature-item" v-for="feature in features" :key="feature.title">
          <span class="feature-icon">*</span>
          <div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const services = [
  { title: 'Architecture', icon: 'pi pi-building', desc: 'Complete architectural design from concept to construction documentation for residential and commercial projects.' },
  { title: 'Interior Design', icon: 'pi pi-home', desc: 'Thoughtful interior spaces that reflect your story, personality, and lifestyle through materials and spatial planning.' },
  { title: 'Master Planning', icon: 'pi pi-map', desc: 'Strategic site planning that considers context, environment, and community to create cohesive developments.' },
  { title: 'Landscape', icon: 'pi pi-sun', desc: 'Outdoor spaces designed to complement architecture and create a seamless connection between built and natural environments.' },
  { title: 'Renovation', icon: 'pi pi-wrench', desc: 'Transforming existing spaces with sensitivity to their history while meeting contemporary needs and standards.' },
  { title: 'Construction Management', icon: 'pi pi-cog', desc: 'End-to-end project oversight ensuring quality craftsmanship, timeline adherence, and budget management.' },
]

const features = [
  { title: 'Story-Led Design', desc: 'Every project begins with a narrative' },
  { title: 'Sustainable Connection', desc: 'Bringing people together with nature' },
  { title: 'Experienced Team', desc: 'Dedicated architects and designers' },
  { title: 'Craft & Making', desc: 'Honest materials, beautiful details' },
  { title: 'Client Focused', desc: 'Your vision is our priority' },
  { title: 'Quality Craftsmanship', desc: 'Thoughtfully built environments' },
]

const sectionRef = ref(null)
const cardRefs = ref([])
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cardRefs.value.forEach((el, i) => {
            if (el) setTimeout(() => el.classList.add('visible'), i * 100)
          })
          observer.disconnect()
        }
      })
    },
    { threshold: 0.15 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.services-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 60px;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 80px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.service-card {
  background: $color-white;
  padding: 40px 30px;
  border-left: 3px solid $color-border;
  transition: all $transition-base;
  position: relative;

  &:hover {
    border-left-color: $color-accent;
    box-shadow: $shadow-card;
    transform: translateY(-4px);
  }
}

.service-num {
  font-size: 48px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.06);
  position: absolute;
  top: 16px;
  right: 20px;
  line-height: 1;
}

.service-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $color-gray-light;
  border-radius: 50%;
  margin-bottom: 20px;

  i {
    font-size: 22px;
    color: $color-dark;
  }
}

.service-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.service-desc {
  font-size: 14px;
  color: $color-gray;
  line-height: 1.7;
}

.services-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.feature-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;

  .feature-icon {
    font-size: 24px;
    color: $color-accent;
    font-weight: 700;
    line-height: 1;
    flex-shrink: 0;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  p {
    font-size: 14px;
    color: $color-gray;
  }
}
</style>
