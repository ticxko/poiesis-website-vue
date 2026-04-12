<template>
  <section class="section section--gray team-section" ref="sectionRef">
    <div class="container">
      <div class="section-header">
        <span class="section-subtitle">People</span>
        <h2 class="section-title">Meet Our Team</h2>
      </div>

      <div class="team-grid">
        <div
          class="team-card fade-in"
          v-for="(member, index) in team"
          :key="member.name"
          :ref="el => { if (el) cardRefs[index] = el }"
        >
          <span class="team-num">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="team-image">
            <div class="team-placeholder">
              <i class="pi pi-user"></i>
            </div>
          </div>
          <div class="team-overlay">
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const team = [
  { name: 'Mayang Ratih', role: 'Principal' },
  { name: 'Jessica Sarana', role: 'Partner' },
  { name: 'Irawan Listanto', role: 'Senior Architect' },
  { name: 'Mikael Christian Lolonlun', role: 'Architect & Interior Designer' },
  { name: 'M. Adillah', role: 'Junior Architect' },
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
            if (el) setTimeout(() => el.classList.add('visible'), i * 120)
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

.team-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.team-card {
  position: relative;
  overflow: hidden;
  cursor: default;
}

.team-num {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  z-index: 3;
  opacity: 0;
  transition: opacity $transition-base;

  .team-card:hover & {
    opacity: 1;
  }
}

.team-image {
  aspect-ratio: 3 / 4;
  overflow: hidden;

  .team-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, $color-dark, lighten($color-dark, 15%));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s ease;

    i {
      font-size: 48px;
      color: rgba(255, 255, 255, 0.15);
    }
  }

  .team-card:hover .team-placeholder {
    transform: scale(1.1);
  }
}

.team-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  opacity: 0;
  transition: opacity $transition-base;

  .team-card:hover & {
    opacity: 1;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: $color-white;
    margin-bottom: 4px;
    transform: translateY(10px);
    transition: transform 0.4s ease;

    .team-card:hover & {
      transform: translateY(0);
    }
  }

  p {
    font-size: 14px;
    color: $color-accent;
    transform: translateY(10px);
    transition: transform 0.5s ease;

    .team-card:hover & {
      transform: translateY(0);
    }
  }
}
</style>
