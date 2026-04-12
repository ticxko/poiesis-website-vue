<template>
  <section class="section company-section">
    <div class="container">
      <!-- Quote Banner -->
      <div class="company-quote">
        <img src="/images/brand/poiesis-logo.png" alt="Poiesis" class="company-quote-logo" />
        <div class="quote-mark">&ldquo;</div>
        <h3 class="quote-text">
          It's important to make a real,<br>positive impact to our lives
        </h3>
      </div>

      <!-- About Company -->
      <div class="company-about">
        <div class="company-about-image">
          <img src="/images/04-halaman/halaman-008.jpg" alt="Poiesis Studio courtyard" />
        </div>
        <div class="company-about-left">
          <h2 class="company-big-title">About<br>Company</h2>
          <p class="company-legal">PT. Pencipta Organik Imaji</p>
        </div>
        <div class="company-about-content">
          <div class="company-about-col">
            <h4>Company Overview</h4>
            <Divider class="company-divider" />
            <p>
              Poiesis Studio design methodology is focused on a narrative-driven approach,
              where the story of our clients and their context becomes the soul of the project.
            </p>
          </div>
          <div class="company-about-col">
            <h4>Key Achievements</h4>
            <Divider class="company-divider" />
            <p>
              We are known for our warm and modern aesthetic, often blending clean lines
              with natural materials like wood and rattan to create homes that feel both
              stylish and soulful.
            </p>
            <p>
              We love unique spatial challenges, like designing a two-story house to feel
              as open and connected as a single-story home. But our work is about more
              than looks, we are passionate about building sustainably, bringing communities
              together, and being resourceful with materials.
            </p>
            <p>
              For us, it is important to listen carefully and work together to create
              designs that make a real, positive impact on our lives.
            </p>
          </div>
        </div>
      </div>

      <!-- Vision -->
      <div class="company-vision">
        <div class="company-vision-header">
          <img src="/images/brand/poiesis-logo.png" alt="Poiesis" class="vision-logo" />
          <div>
            <span class="section-subtitle">Our Vision</span>
            <h2 class="section-title">Poiesis Studio<br>Vision</h2>
          </div>
        </div>
        <p class="vision-text">
          Our vision at Poiesis Studio is to become a leading architectural & interior
          design practice by pioneering the art of narrative-driven placemaking. We aim
          to create soulful, sustainable, and interconnected environments that are more
          than just structures, they are living ecosystems designed to elevate the human
          experience.
        </p>
        <p class="vision-text">
          This vision applies to every project we touch, from the intimate scale of a
          private home to the dynamic of a full urban community, ensuring each space we
          design has a unique identity and a lasting positive impact.
        </p>
        <div class="vision-gallery">
          <img src="/images/02-edge/edge-001.jpg" alt="Edge House" />
          <img src="/images/00-company-intro/company-intro-003.jpg" alt="Material detail" />
          <img src="/images/05-cempaka/cempaka-004.jpg" alt="Cempaka House" />
          <img src="/images/04-halaman/halaman-001.jpg" alt="Halaman House" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Divider from 'primevue/divider'
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.company-section {
  background-color: $color-gray-light;
}

/* Quote Banner */
.company-quote {
  text-align: center;
  padding-bottom: 80px;

  .company-quote-logo {
    height: 36px;
    width: auto;
    margin-bottom: 32px;
    opacity: 0.3;
  }

  .quote-mark {
    font-size: 72px;
    font-weight: 700;
    color: $color-accent;
    line-height: 0.6;
    margin-bottom: 16px;
  }

  .quote-text {
    font-size: 32px;
    font-weight: 600;
    line-height: 1.4;
    color: $color-dark;
    font-style: italic;

    @media (max-width: 768px) {
      font-size: 22px;
    }
  }
}

/* About Company */
.company-about {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  grid-template-rows: auto auto;
  gap: 40px 60px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.company-about-image {
  grid-column: 1 / -1;
  grid-row: 2;

  img {
    width: 100%;
    aspect-ratio: 16 / 7;
    object-fit: cover;
  }

  @media (max-width: 992px) {
    grid-row: auto;
  }
}

.company-about-left {
  .company-big-title {
    font-size: 64px;
    font-weight: 700;
    line-height: 1.1;
    color: $color-dark;
    margin-bottom: 12px;

    @media (max-width: 768px) {
      font-size: 40px;
    }
  }

  .company-legal {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: $color-gray;
  }
}

.company-about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.company-about-col {
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: $color-dark;
    display: flex;
    align-items: center;
    gap: 10px;

    &::before {
      content: '';
      width: 20px;
      height: 20px;
      background-color: $color-accent;
      border-radius: 4px;
      flex-shrink: 0;
    }
  }

  .company-divider {
    margin: 12px 0 16px;
    :deep(&::before) {
      border-color: rgba(0, 0, 0, 0.12) !important;
    }
  }

  p {
    font-size: 15px;
    line-height: 1.8;
    color: $color-gray;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* Vision */
.company-vision {
  margin-top: 100px;

  @media (max-width: 768px) {
    margin-top: 60px;
  }
}

.company-vision-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;

  .vision-logo {
    height: 36px;
    width: auto;
    margin-top: 4px;
    opacity: 0.3;
  }
}

.vision-text {
  font-size: 16px;
  line-height: 1.8;
  color: $color-gray;
  margin-bottom: 20px;
  max-width: 800px;
}

.vision-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 40px;

  img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
