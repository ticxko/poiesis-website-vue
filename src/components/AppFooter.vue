<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <router-link to="/" class="footer-logo">
            <img src="/images/brand/poiesis-logo.png" alt="Poiesis" class="footer-logo-icon" />
            <span class="footer-logo-text"><strong>POIESIS</strong> STUDIO</span>
          </router-link>
          <p class="footer-tagline">
            A Jakarta-based Architecture & Interior Design consultancy
            focused on narrative-driven placemaking. Design Through Stories.
          </p>
          <div class="footer-social">
            <a href="https://instagram.com/poiesis.id" target="_blank" rel="noopener" aria-label="Instagram">
              <i class="pi pi-instagram"></i>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Office</h4>
          <p>TransPark Bintaro Apartment<br>Unit 3618, Jln. Prof. Dr. Satrio No.5<br>Bintaro, Jakarta, Indonesia</p>
          <p class="footer-contact-label">Have a project in mind?</p>
          <a href="mailto:mayang.poiesis@gmail.com">mayang.poiesis@gmail.com</a>
          <p class="footer-hours">Mon – Fri: 09:00 – 18:00</p>
          <a href="tel:+6281218321775">+62 812 1832 1775</a>
        </div>

        <div class="footer-col">
          <h4>Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/projects">Projects</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Services</h4>
          <ul>
            <li>Architecture</li>
            <li>Interior Design</li>
            <li>Master Planning</li>
            <li>Landscape</li>
            <li>Furniture</li>
            <li>Renovation</li>
            <li>Construction Management</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Poiesis Studio. PT. Pencipta Organik Imaji. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.site-footer {
  background-color: $color-darker;
  color: rgba(255, 255, 255, 0.7);
  padding: 80px 0 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1.2fr 0.8fr 1fr;
  gap: 40px;
  padding-bottom: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.footer-logo-icon {
  height: 32px;
  width: auto;
  filter: brightness(0) invert(1);
}

.footer-logo-text {
  font-size: 16px;
  letter-spacing: 2px;
  color: $color-white;

  strong {
    font-weight: 700;
  }
}

.footer-tagline {
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 24px;
}

.footer-social {
  display: flex;
  gap: 16px;

  a {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.7);
    transition: all $transition-base;

    &:hover {
      background-color: $color-accent;
      border-color: $color-accent;
      color: $color-white;
    }
  }
}

.footer-col {
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: $color-white;
    margin-bottom: 24px;
  }

  p, a {
    font-size: 15px;
    line-height: 1.8;
    display: block;
  }

  a:hover {
    color: $color-accent;
  }

  ul li {
    font-size: 15px;
    line-height: 2.2;

    a:hover {
      color: $color-accent;
    }
  }
}

.footer-contact-label {
  font-size: 13px;
  color: $color-accent;
  margin-top: 20px;
  margin-bottom: 4px;
}

.footer-hours {
  margin-top: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}

.footer-bottom {
  padding: 24px 0;
  text-align: center;

  p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
  }
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
