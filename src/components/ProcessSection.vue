<template>
  <section class="section section--dark process-section" ref="sectionRef">
    <div class="container">
      <div class="process-layout">
        <div class="process-left">
          <span class="section-subtitle">How We Work</span>
          <h2 class="section-title">Our Process</h2>

          <div class="process-steps">
            <div
              class="step-item fade-in"
              v-for="(step, index) in steps"
              :key="step.title"
              :ref="el => { if (el) stepRefs[index] = el }"
            >
              <span class="step-num">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="step-content">
                <h3>{{ step.title }}</h3>
                <p>{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="process-right">
          <div class="process-image">
            <img src="/images/02-edge/edge-001.jpg" alt="Our Process" />
          </div>
          <div class="process-awards">
            <h4>Recognition</h4>
            <div class="award-item" v-for="award in awards" :key="award.title">
              <span class="award-year">{{ award.year }}</span>
              <span class="award-title">{{ award.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const steps = [
  { title: 'Story Discovery', desc: 'We listen to your story — understanding your lifestyle, aspirations, and the narrative you want your space to tell.' },
  { title: 'Design Concept', desc: 'Translating your story into spatial concepts through sketches, mood boards, and 3D visualizations.' },
  { title: 'Design Development', desc: 'Refining every detail — materials, lighting, furniture — ensuring the design is both beautiful and buildable.' },
  { title: 'Construction', desc: 'Overseeing the build process with hands-on management to ensure quality craftsmanship at every stage.' },
  { title: 'Final Handover', desc: 'A thorough walkthrough and handover, ensuring every element meets our shared vision.' },
]

const awards = [
  { year: 'Est.', title: 'Jakarta-based Practice' },
  { year: '24+', title: 'Completed Projects' },
  { year: '5', title: 'Dedicated Team Members' },
]

const sectionRef = ref(null)
const stepRefs = ref([])
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stepRefs.value.forEach((el, i) => {
            if (el) setTimeout(() => el.classList.add('visible'), i * 150)
          })
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

.process-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.process-steps {
  margin-top: 48px;
}

.step-item {
  display: flex;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.step-num {
  font-size: 36px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.1);
  line-height: 1;
  flex-shrink: 0;
  min-width: 50px;
}

.step-content {
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: $color-white;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.7;
  }
}

.process-image {
  margin-bottom: 40px;

  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }
}

.process-awards {
  h4 {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: $color-accent;
    margin-bottom: 24px;
  }
}

.award-item {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  align-items: baseline;

  &:last-child {
    border-bottom: none;
  }
}

.award-year {
  font-size: 28px;
  font-weight: 700;
  color: $color-white;
  min-width: 60px;
}

.award-title {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
