<template>
  <main>
    <!-- Page Banner -->
    <section class="page-banner">
      <div class="banner-bg">
        <img src="/images/00-company-intro/company-intro-016.jpg" alt="About Poiesis Studio" />
        <div class="banner-overlay"></div>
      </div>
      <div class="container banner-content">
        <h1>About Us</h1>
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <span>/</span>
          <span>About</span>
        </div>
      </div>
    </section>

    <!-- About Intro -->
    <section class="section">
      <div class="container">
        <div class="about-intro-grid">
          <div class="about-intro-left">
            <span class="section-subtitle">Our Story</span>
            <h2 class="section-title">Design Through<br>Stories</h2>
          </div>
          <div class="about-intro-right">
            <p>
              Poiesis Studio is a Jakarta-based Architecture & Interior Design consultancy
              founded by Mayang Ratih as Principal and Jessica Sarana as Partner. Our design
              methodology is focused on the process of narrative approach.
            </p>
            <p>
              We pose that before any spatial program or aesthetic form is designed, a
              foundational story must be established. This design approach is applied through
              a phenomenological understanding of the user's experience and background.
            </p>
            <p>
              The result is an architecture & interior design that has profound connection
              to its context, function and most importantly to the people it serves.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quote -->
    <section class="section section--gray">
      <div class="container">
        <div class="about-quote-block">
          <div class="quote-mark">"</div>
          <blockquote>
            At Poiesis Studio, we believe that spaces should have a soul. They aren't just
            built from materials, but from personal stories and dreams of the people who
            live in them.
          </blockquote>
          <cite>— Ar. Amita Ratih Purnamasari, S.Ars, IAI., Principal</cite>
        </div>
      </div>
    </section>

    <!-- Vision -->
    <section class="section">
      <div class="container">
        <div class="about-intro-grid">
          <div class="about-intro-left">
            <span class="section-subtitle">Our Vision</span>
            <h2 class="section-title">Narrative-Driven<br>Placemaking</h2>
          </div>
          <div class="about-intro-right">
            <p>
              Our vision is to become a leading architectural & interior design practice by
              pioneering the art of narrative-driven placemaking. We aim to create soulful,
              sustainable, and interconnected environments that are more than just structures —
              they are living ecosystems designed to elevate the human experience.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section section--dark">
      <div class="container">
        <div class="section-header" style="text-align: center;">
          <span class="section-subtitle">Our Values</span>
          <h2 class="section-title">What Drives Us</h2>
        </div>
        <div class="values-grid">
          <div class="value-card" v-for="value in values" :key="value.title">
            <span class="value-icon">*</span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <span class="section-subtitle">What We Do</span>
          <h2 class="section-title">Our Services</h2>
        </div>
        <div class="services-list-grid">
          <div class="service-list-item" v-for="(service, i) in services" :key="service">
            <span class="service-list-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="service-list-name">{{ service }}</span>
            <span class="service-list-line"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <TeamSection />

    <!-- CTA -->
    <CtaSection />
  </main>
</template>

<script setup>
import TeamSection from '../components/TeamSection.vue'
import CtaSection from '../components/CtaSection.vue'

const values = [
  { title: 'Story-Led Design', desc: 'We lead our design with story. We believe that by listening carefully, we can write a unique narrative that gives each project its soul.' },
  { title: 'Sustainable Connection', desc: 'We are passionate to design open and flexible spaces that bring people together with each other and with nature.' },
  { title: 'Craft & Making', desc: 'We take a hands-on, resourceful approach to materials. We find beauty in honest materials and details to ensure every space is beautifully built.' },
]

const services = [
  'Architecture', 'Interior Design', 'Master Planning',
  'Landscape', 'Furniture', 'Renovation', 'Construction Management'
]
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.page-banner {
  position: relative;
  height: 50vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.banner-bg {
  position: absolute;
  inset: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: rgba(23, 23, 23, 0.7);
}

.banner-content {
  position: relative;
  z-index: 2;

  h1 {
    font-size: 52px;
    font-weight: 700;
    color: $color-white;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      font-size: 36px;
    }
  }
}

.breadcrumb {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  gap: 12px;

  a {
    color: rgba(255, 255, 255, 0.6);
    &:hover { color: $color-accent; }
  }
}

.about-intro-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

.about-intro-right {
  p {
    font-size: 16px;
    line-height: 1.8;
    color: $color-gray;
    margin-bottom: 20px;
  }
}

.about-quote-block {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  .quote-mark {
    font-size: 80px;
    font-weight: 700;
    color: $color-accent;
    line-height: 0.5;
    margin-bottom: 20px;
  }

  blockquote {
    font-size: 22px;
    line-height: 1.7;
    color: $color-dark;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  cite {
    font-size: 14px;
    color: $color-gray;
    font-style: normal;
  }
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.value-card {
  text-align: center;
  padding: 40px 30px;

  .value-icon {
    font-size: 32px;
    color: $color-accent;
    font-weight: 700;
    display: block;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: $color-white;
    margin-bottom: 12px;
  }

  p {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.7;
  }
}

.services-list-grid {
  max-width: 800px;
}

.service-list-item {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid $color-border;
  transition: padding-left $transition-base;

  &:hover {
    padding-left: 12px;
  }
}

.service-list-num {
  font-size: 14px;
  font-weight: 600;
  color: $color-accent;
  flex-shrink: 0;
}

.service-list-name {
  font-size: 22px;
  font-weight: 500;
}

.service-list-line {
  flex: 1;
  height: 1px;
  background-color: $color-border;
}
</style>
