<template>
  <section class="cta-section">
    <div class="cta-bg">
      <img src="/images/05-cempaka/cempaka-001.jpg" alt="Start your project" />
      <div class="cta-overlay"></div>
    </div>
    <div class="container cta-content">
      <span class="section-subtitle">Start a Project</span>
      <h2>Have a Vision?<br>Let's Build It Together.</h2>
      <p>Before we sketch a single line, we want to hear your story.</p>
      <router-link to="/contact" class="btn-theme btn-theme--white">
        Get In Touch <i class="pi pi-arrow-right"></i>
      </router-link>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.cta-section {
  position: relative;
  padding: $section-padding 0;
  text-align: center;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: $section-padding-sm 0;
  }
}

.cta-bg {
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: rgba(23, 23, 23, 0.82);
}

.cta-content {
  position: relative;
  z-index: 2;

  .section-subtitle {
    color: $color-accent;
  }

  h2 {
    font-size: 48px;
    font-weight: 700;
    color: $color-white;
    margin-bottom: 20px;
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
      font-size: 30px;
    }
  }

  p {
    font-size: 17px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 40px;
  }
}
</style>
