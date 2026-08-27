<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-brand">
          <router-link to="/" class="footer-logo" aria-label="Poiesis Studio, home">
            <img src="/images/brand/poiesis-mark-color.svg" alt="" class="footer-mark" />
            <span class="footer-wordmark">Poiesis Studio</span>
          </router-link>
          <p class="footer-tagline">
            A Jakarta-based Architecture &amp; Interior Design consultancy focused on
            narrative-driven placemaking. Design Through Stories.
          </p>
          <a href="https://instagram.com/poiesis.id" target="_blank" rel="noopener" class="instagram-link">
            <i class="pi pi-instagram instagram-icon"></i>
            <span class="instagram-handle">@poiesis.id</span>
          </a>

          <div class="footer-cert">
            <picture>
              <source srcset="/images/brand/iai-logo.png.webp?v=1" type="image/webp" />
              <img src="/images/brand/iai-logo.png?v=1" alt="Ikatan Arsitek Indonesia" class="footer-cert-logo" loading="lazy" />
            </picture>
            <div class="footer-cert-text">
              <span class="footer-cert-title">IAI Certified</span>
              <span>STRA 2.01.0.0004763</span>
            </div>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="ps-label">Studio</h4>
          <p>Calamus C7-35, Citra Garden Bintaro<br>Ciputat, Tangerang Selatan 15413<br>Banten, Indonesia</p>
          <p class="footer-hours">Mon – Fri · 09.00 – 18.00 WIB</p>
          <a class="footer-contact" href="tel:+6281218321775"><i class="pi pi-phone" aria-hidden="true"></i><span>+62 812 1832 1775</span></a>
          <router-link class="footer-contact" to="/enquiry" @click="trackEvent('cta_click', { location: 'footer' })"><i class="pi pi-envelope" aria-hidden="true"></i><span>Start an enquiry</span></router-link>
        </div>

        <div class="footer-col">
          <h4 class="ps-label">Navigate</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/projects">Work</router-link></li>
            <li><router-link to="/about">Studio</router-link></li>
            <li><router-link to="/enquiry">Enquire</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="ps-label">Services</h4>
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
        <span>&copy; {{ year }} Poiesis Studio · PT. Pencipta Organik Imaji</span>
        <span>Design Through Stories</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { trackEvent } from '../utils/analytics'
const year = ref(2026)
</script>

<style lang="scss" scoped>
.site-footer {
  background: var(--ground-alt);
  color: var(--ink);
  border-top: 1px solid var(--rule-soft);
  padding: 80px 0 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1.2fr 0.8fr 1fr;
  gap: 48px var(--gap-col);
  padding-bottom: 56px;
  border-bottom: 1px solid var(--rule-soft);
}

/* `.footer-brand` prefix raises specificity above `.footer-col a { display:block }`
   so the mark + wordmark sit on one row (not stacked). */
.footer-brand .footer-logo { display: inline-flex; align-items: center; gap: 11px; margin-bottom: 24px; }
.footer-mark { width: 26px; height: auto; }
.footer-wordmark {
  font: var(--weight-medium) 13px/1 var(--font-ui);
  letter-spacing: var(--track-wordmark);
  text-transform: uppercase;
  color: var(--ink);
}

.footer-tagline {
  font: var(--weight-regular) 15px/1.7 var(--font-ui);
  color: var(--ink-soft);
  max-width: 42ch;
  margin-bottom: 22px;
}

.footer-brand .instagram-link {
  display: inline-flex;
  align-items: center;      /* vertically centre icon against the handle */
  gap: 12px;                /* breathing space between icon and @poiesis.id */
  transition: opacity var(--transition-hover);
  &:hover { opacity: 0.75; }
}
.instagram-icon {
  font-size: 18px;
  line-height: 1;           /* keep the glyph box tight so centring is true */
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.instagram-handle { font: var(--weight-medium) 14px/1 var(--font-ui); color: var(--ink); }

/* IAI certification credential */
.footer-cert {
  display: flex;
  align-items: flex-end;   /* STRA (last text line) sits level with the logo's bottom */
  gap: 16px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid var(--rule-soft);
}
.footer-cert-logo { width: 116px; height: auto; display: block; }
.footer-cert-text { display: flex; flex-direction: column; gap: 4px; text-align: left; }
.footer-cert-title {
  font: var(--weight-medium) var(--t-label)/1 var(--font-ui);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--pink-crimson);
}
.footer-cert-text span:not(.footer-cert-title) {
  font: var(--weight-regular) 13px/1.5 var(--font-ui);
  color: var(--ink-soft);
}

.footer-col {
  h4 { color: var(--pink-crimson); margin-bottom: 18px; }

  p, a { font: var(--weight-regular) 14.5px/1.75 var(--font-ui); color: var(--ink-soft); display: block; }
  a { transition: color var(--transition-hover); }
  a:hover { color: var(--pink-crimson); }

  ul li { font: var(--weight-regular) 14.5px/1; margin-bottom: 12px; color: var(--ink-soft); }
  ul li a { display: inline; }
}

.footer-hours { margin-top: 16px; color: var(--ink-label) !important; }
/* Contact rows: icon + text, vertically centred. `.footer-col a.footer-contact`
   (0,2,1) beats `.footer-col a { display:block }` so the flex row survives. */
.footer-col a.footer-contact {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 9px;
  margin-top: 10px;
  font-weight: 500;
  color: var(--ink);
}
.footer-col a.footer-contact .pi { font-size: 14px; line-height: 1; color: var(--ink-label); }
.footer-col a.footer-contact:hover { color: var(--pink-crimson); }
.footer-col a.footer-contact:hover .pi { color: var(--pink-crimson); }

.footer-bottom {
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  span {
    font: var(--weight-medium) var(--t-label)/1 var(--font-ui);
    letter-spacing: var(--track-caps);
    text-transform: uppercase;
    color: var(--ink-label);
  }
}

@media (max-width: 991px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
}
@media (max-width: 576px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
