<template>
  <section class="section testimonials-section">
    <div class="container">
      <div class="testimonials-layout">
        <div class="testimonials-left">
          <span class="section-subtitle">Testimonial</span>
          <h2 class="section-title">What Our<br>Philosophy Means</h2>
        </div>

        <div class="testimonials-right">
          <div class="quote-card" :class="{ active: activeIndex === index }" v-for="(quote, index) in quotes" :key="index">
            <div class="quote-icon">"</div>
            <blockquote>{{ quote.text }}</blockquote>
            <div class="quote-author">
              <div class="author-info">
                <h4>{{ quote.author }}</h4>
                <p>{{ quote.role }}</p>
              </div>
            </div>
          </div>

          <div class="quote-nav">
            <button
              v-for="(_, index) in quotes"
              :key="index"
              class="quote-dot"
              :class="{ active: activeIndex === index }"
              @click="activeIndex = index"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const quotes = [
  {
    text: 'At Poiesis Studio, we believe that spaces should have a soul. They aren\'t just built from materials, but from personal stories and dreams of the people who live in them.',
    author: 'Ar. Amita Ratih Purnamasari, S.Ars, IAI.',
    role: 'Principal, Poiesis Studio'
  },
  {
    text: 'Our design methodology is focused on the process of narrative approach. We pose that before any spatial program or aesthetic form is designed, a foundational story must be established.',
    author: 'Poiesis Studio',
    role: 'Design Philosophy'
  },
]

const activeIndex = ref(0)
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % quotes.length
  }, 6000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.testimonials-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: center;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.quote-card {
  display: none;

  &.active {
    display: block;
  }
}

.quote-icon {
  font-size: 80px;
  font-weight: 700;
  color: $color-accent;
  line-height: 0.8;
  margin-bottom: 16px;
}

blockquote {
  font-size: 20px;
  line-height: 1.7;
  color: $color-dark;
  font-weight: 400;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 17px;
  }
}

.quote-author {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-info {
  h4 {
    font-size: 16px;
    font-weight: 600;
  }

  p {
    font-size: 14px;
    color: $color-gray;
  }
}

.quote-nav {
  display: flex;
  gap: 8px;
  margin-top: 32px;
}

.quote-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid $color-border;
  background: transparent;
  cursor: pointer;
  transition: all $transition-base;

  &.active {
    background-color: $color-dark;
    border-color: $color-dark;
  }
}
</style>
