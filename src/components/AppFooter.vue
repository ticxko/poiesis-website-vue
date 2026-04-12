<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <router-link to="/" class="footer-logo">
            <img src="/images/brand/poiesis-logo.png" alt="Poiesis Studio" class="footer-logo-icon" />
          </router-link>
          <p class="footer-tagline">
            A Jakarta-based Architecture & Interior Design consultancy
            focused on narrative-driven placemaking. Design Through Stories.
          </p>
          <div class="footer-instagram">
            <a href="https://instagram.com/poiesis.id" target="_blank" rel="noopener" class="instagram-link">
              <i class="pi pi-instagram instagram-icon"></i>
              <span class="instagram-handle">@poiesis.id</span>
              <svg class="verified-badge" viewBox="0 0 22 22" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.396 11c0-.87-.473-1.67-1.23-2.09.18-.84.08-1.72-.29-2.49-.56-.94-1.51-1.58-2.57-1.72-.34-.78-.93-1.42-1.68-1.82-.77-.41-1.65-.51-2.49-.29C11.71 1.82 10.91 1.35 10.04 1.35s-1.67.47-2.09 1.23c-.84-.18-1.72-.08-2.49.29-.94.56-1.58 1.51-1.72 2.57-.78.34-1.42.93-1.82 1.68-.41.77-.51 1.65-.29 2.49C.87 10.08.4 10.88.4 11.75s.47 1.67 1.23 2.09c-.18.84-.08 1.72.29 2.49.56.94 1.51 1.58 2.57 1.72.34.78.93 1.42 1.68 1.82.77.41 1.65.51 2.49.29.42.76 1.22 1.23 2.09 1.23s1.67-.47 2.09-1.23c.84.18 1.72.08 2.49-.29.94-.56 1.58-1.51 1.72-2.57.78-.34 1.42-.93 1.82-1.68.41-.77.51-1.65.29-2.49.76-.42 1.23-1.22 1.23-2.09z" fill="#1D9BF0"/>
                <path d="M9.64 14.83l-3.57-3.57 1.41-1.41 2.16 2.16 4.6-4.6 1.41 1.41-6.01 6.01z" fill="#fff"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Office</h4>
          <Divider class="footer-heading-divider" />
          <p>Calamus C7-35 Citra Garden Bintaro<br>Ciputat, Banten, Tangerang Selatan 15413</p>
          <p class="footer-contact-label">Have a project in mind?</p>
          <p class="footer-hours">Mon – Fri: 09:00 – 18:00</p>
          <a href="tel:+6281218321775">+62 812 1832 1775</a>
        </div>

        <div class="footer-col">
          <h4>Links</h4>
          <Divider class="footer-heading-divider" />
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/projects">Projects</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Services</h4>
          <Divider class="footer-heading-divider" />
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

<script setup>
import Divider from 'primevue/divider'
</script>

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
  display: inline-block;
  margin-bottom: 20px;
}

.footer-logo-icon {
  height: 32px;
  width: auto;
  filter: brightness(0) invert(1);
}

.footer-heading-divider {
  margin: 0 0 16px 0;

  :deep(&::before) {
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
}

.footer-tagline {
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: 24px;
}

.footer-instagram {
  .instagram-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: opacity $transition-base;

    &:hover {
      opacity: 0.8;
    }
  }

  .instagram-icon {
    font-size: 20px;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .instagram-handle {
    font-size: 14px;
    font-weight: 500;
    color: $color-white;
  }

  .verified-badge {
    flex-shrink: 0;
  }
}

.footer-col {
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: $color-white;
    margin-bottom: 12px;
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
