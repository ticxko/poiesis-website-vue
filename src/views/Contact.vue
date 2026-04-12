<template>
  <main>
    <!-- Page Banner -->
    <section class="page-banner">
      <div class="banner-bg">
        <img src="/images/hero/contact-banner.png" alt="Contact" />
        <div class="banner-overlay"></div>
      </div>
      <div class="container banner-content">
        <h1>Contact Us</h1>
        <div class="breadcrumb">
          <router-link to="/">Home</router-link>
          <span>/</span>
          <span>Contact</span>
        </div>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <div class="contact-info">
            <span class="section-subtitle">Get In Touch</span>
            <h2 class="section-title">Let's Talk About<br>Your Project</h2>
            <p class="contact-intro">
              Before we sketch a single line, we want to hear your story. We believe that to
              design a space that is truly yours, we must first understand the life you live.
            </p>

            <div class="contact-items">
              <div class="contact-item">
                <div class="contact-icon">
                  <i class="pi pi-phone"></i>
                </div>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:+6281218321775">+62 812 1832 1775</a>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <i class="pi pi-envelope"></i>
                </div>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:mayang.poiesis@gmail.com">mayang.poiesis@gmail.com</a>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <i class="pi pi-map-marker"></i>
                </div>
                <div>
                  <h4>Address</h4>
                  <p>TransPark Bintaro Apartment Unit 3618<br>
                  Jln. Prof. Dr. Satrio No.5, Bintaro<br>
                  Jakarta, Indonesia</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <i class="pi pi-instagram"></i>
                </div>
                <div>
                  <h4>Follow</h4>
                  <a href="https://instagram.com/poiesis.id" target="_blank" rel="noopener">@poiesis.id</a>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-form-wrap">
            <h3>Send Us a Message</h3>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input id="name" type="text" placeholder="Your name" required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" placeholder="Your email" required />
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input id="phone" type="tel" placeholder="Your phone number" />
              </div>
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" rows="5" placeholder="Tell us about your project" required></textarea>
              </div>
              <button type="submit" class="btn-theme">
                Send Message <i class="pi pi-send"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
function handleSubmit() {
  alert('Thank you for your message! We will get back to you soon.')
}
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
  img { width: 100%; height: 100%; object-fit: cover; }
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
    @media (max-width: 768px) { font-size: 36px; }
  }
}

.breadcrumb {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  gap: 12px;
  a { color: rgba(255, 255, 255, 0.6); &:hover { color: $color-accent; } }
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

.contact-intro {
  font-size: 16px;
  line-height: 1.8;
  color: $color-gray;
  margin-top: 20px;
  margin-bottom: 40px;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.contact-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;

  h4 {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  p, a {
    font-size: 15px;
    line-height: 1.7;
    color: $color-gray;
  }

  a:hover {
    color: $color-accent;
  }
}

.contact-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: $color-gray-light;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 20px;
    color: $color-dark;
  }
}

.contact-form-wrap {
  background-color: $color-gray-light;
  padding: 48px;

  @media (max-width: 576px) {
    padding: 32px 24px;
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 32px;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: $color-gray-dark;
    margin-bottom: 8px;
  }

  input, textarea {
    width: 100%;
    padding: 14px 16px;
    font-family: $font-primary;
    font-size: 15px;
    border: 1px solid $color-border;
    background: $color-white;
    color: $color-dark;
    transition: border-color $transition-base;

    &:focus {
      outline: none;
      border-color: $color-dark;
    }

    &::placeholder {
      color: #bbb;
    }
  }

  textarea {
    resize: vertical;
  }
}
</style>
