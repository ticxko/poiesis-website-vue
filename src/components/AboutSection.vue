<template>
  <section class="section about-section" ref="sectionRef">
    <div class="container">
      <div class="about-grid">
        <div class="about-image fade-in" ref="imageRef">
          <img src="/images/03-spanish-villa/spanish-villa-003.jpg" alt="Poiesis Studio project" />
          <div class="about-image-accent"></div>
        </div>
        <div class="about-content">
          <span class="section-subtitle fade-in" ref="sub">Introductory Note</span>
          <h2 class="section-title fade-in" ref="titleRef">Design Through<br>Stories</h2>
          <p class="about-text fade-in" ref="textRef">
            Poiesis Studio is a Jakarta-based Architecture & Interior Design consultancy
            founded by Mayang Ratih as Principal and Jessica Sarana as Partner. Our design
            methodology is focused on the process of narrative approach. We pose that
            before any spatial program or aesthetic form is designed, a foundational story
            must be established.
          </p>
          <p class="about-text fade-in" ref="text2Ref">
            This design approach is applied through a phenomenological understanding of
            the user's experience and background. The result is architecture & interior
            design that has profound connection to its context, function and most
            importantly to the people it serves.
          </p>
          <p class="about-text fade-in" ref="text3Ref">
            Poiesis Studio is dedicated to the thoughtful act of making, facilitating
            a good conversation and exploration in every aspect of design.
          </p>
          <div class="about-quote fade-in" ref="quoteRef">
            <blockquote>
              "At Poiesis Studio, we believe that spaces should have a soul. They aren't
              just built from materials, but from personal stories and dreams of the people
              who live in them."
            </blockquote>
            <cite>— Ar. Amita Ratih Purnamasari, S.Ars, IAI., Principal</cite>
          </div>
          <router-link to="/about" class="btn-theme fade-in" ref="btnRef">
            Learn More <i class="pi pi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const sectionRef = ref(null)
const imageRef = ref(null)
const sub = ref(null)
const titleRef = ref(null)
const textRef = ref(null)
const text2Ref = ref(null)
const text3Ref = ref(null)
const quoteRef = ref(null)
const btnRef = ref(null)

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const els = [imageRef.value, sub.value, titleRef.value, textRef.value, text2Ref.value, text3Ref.value, quoteRef.value, btnRef.value?.$el || btnRef.value]
          els.forEach((el, i) => {
            if (el) setTimeout(() => el.classList.add('visible'), i * 120)
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

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.about-image {
  position: relative;
  position: sticky;
  top: 120px;

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

  @media (max-width: 992px) {
    position: relative;
    top: auto;
  }
}

.about-text {
  font-size: 16px;
  color: $color-gray;
  line-height: 1.8;
  margin-bottom: 20px;
}

.about-quote {
  border-left: 3px solid $color-accent;
  padding-left: 24px;
  margin: 32px 0;

  blockquote {
    font-size: 15px;
    font-style: italic;
    line-height: 1.8;
    color: $color-dark;
    margin-bottom: 12px;
  }

  cite {
    font-size: 13px;
    color: $color-gray;
    font-style: normal;
  }
}
</style>
