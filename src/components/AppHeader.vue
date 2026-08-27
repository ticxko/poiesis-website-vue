<template>
  <header class="site-header" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="navbar">
      <router-link to="/" class="brand" @click="closeMenu" aria-label="Poiesis Studio, home">
        <img src="/images/brand/poiesis-mark-color.svg" alt="" class="brand-mark" />
        <span class="brand-rule" aria-hidden="true"></span>
        <span class="brand-text">
          <span class="brand-name">Poiesis Studio</span>
          <span class="brand-desc">Architecture &amp; Interior Design</span>
        </span>
      </router-link>

      <nav class="main-nav" :class="{ open: menuOpen }" aria-label="Main">
        <ul class="nav-links">
          <li><router-link to="/" @click="closeMenu">Home</router-link></li>
          <li><router-link to="/projects" @click="closeMenu">Work</router-link></li>
          <li><router-link to="/about" @click="closeMenu">Studio</router-link></li>
          <li><router-link to="/enquiry" class="nav-enquire" @click="enquireClick">Enquire</router-link></li>
        </ul>
        <div class="nav-footer-mobile">
          <a class="nav-social" href="https://wa.me/6281218321775" target="_blank" rel="noopener" @click="closeMenu" aria-label="WhatsApp +62 812 1832 1775">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>+62 812 1832 1775</span>
          </a>
          <a class="nav-social" href="https://instagram.com/poiesis.id" target="_blank" rel="noopener" @click="closeMenu" aria-label="Instagram @poiesis.id">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><defs><linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#feda75"/><stop offset="25%" stop-color="#fa7e1e"/><stop offset="50%" stop-color="#d62976"/><stop offset="75%" stop-color="#962fbf"/><stop offset="100%" stop-color="#4f5bd5"/></linearGradient></defs><rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#igGrad)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1.2" fill="#fff"/></svg>
            <span>@poiesis.id</span>
          </a>
        </div>
      </nav>

      <button class="menu-toggle" :class="{ open: menuOpen }" @click="toggleMenu" aria-label="Toggle menu" aria-expanded="menuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { trackEvent } from '../utils/analytics'

const isScrolled = ref(false)
const menuOpen = ref(false)

function handleScroll() { isScrolled.value = window.scrollY > 8 }
function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}
function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}
function enquireClick() { trackEvent('cta_click', { location: 'header' }); closeMenu() }

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style lang="scss" scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--ground);
  border-bottom: 1px solid transparent;
  transition: border-color var(--transition-hover), box-shadow var(--transition-hover);

  &.scrolled {
    border-bottom-color: var(--rule-soft);
    box-shadow: 0 1px 20px rgba(44, 44, 44, 0.04);
  }
}

.navbar {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 26px var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* --- Brand lockup --- */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  z-index: 1001;
}
.brand-mark { width: 30px; height: auto; }
.brand-rule { width: 1px; height: 24px; background: var(--rule); margin: 0 6px; }
.brand-name {
  display: block;
  font: var(--weight-medium) 13px/1.2 var(--font-ui);
  letter-spacing: var(--track-wordmark);
  text-transform: uppercase;
}
.brand-desc {
  display: block;
  font: var(--weight-regular) 11px/1.28 var(--font-ui);
  color: var(--ink-label);
  margin-top: 3px;
}

/* --- Nav --- */
.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}
.nav-links a {
  font: var(--weight-medium) 11.5px/1 var(--font-ui);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--ink);
  transition: font-weight var(--transition-hover), color var(--transition-hover);

  &:hover { font-weight: 700; }
  &.router-link-exact-active:not(.nav-enquire) {
    color: var(--pink-crimson);
    border-bottom: 1px solid var(--accent);
    padding-bottom: 3px;
  }
}
.nav-enquire {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 13px 22px;
  background: var(--neutral-white);   /* plain white box */
  color: var(--ink);                  /* dark, legible label */
  border: 1px solid var(--ink);       /* thin black line */
  transition: background var(--transition-hover), color var(--transition-hover);
}
/* Higher specificity than `.nav-links a:hover` so the box fills solid black on hover
   with a light label — weight unchanged to avoid a width jump. */
.nav-links a.nav-enquire:hover { background: var(--ink); color: var(--nat-cream); }
.nav-links a.nav-enquire.router-link-exact-active { color: var(--ink); }
.nav-footer-mobile { display: none; }

/* --- Mobile toggle --- */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;

  span { display: block; width: 26px; height: 2px; background: var(--ink); transition: all var(--transition-hover); }
  &.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 6px); }
  &.open span:nth-child(2) { opacity: 0; }
  &.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -6px); }
}

@media (max-width: 991px) {
  .brand-desc { display: none; }
  .menu-toggle { display: flex; }

  .main-nav {
    position: fixed;
    inset: 0 -100% 0 auto;
    width: min(80vw, 340px);
    height: 100vh;
    background: var(--ground-raised);
    padding: 110px 40px 40px;
    transition: right var(--dur-slow) var(--ease);
    z-index: 1000;
    display: flex;
    flex-direction: column;

    &.open { right: 0; }

    .nav-links {
      flex-direction: column;
      align-items: flex-start;
      gap: 0;

      li { width: 100%; }
      a {
        display: block;
        width: 100%;
        font-size: 15px;
        padding: 18px 0;
        border-bottom: var(--border-soft);
        &:hover { font-weight: 700; }
      }
      .nav-enquire {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 24px;
        padding: 16px 22px;
        border: 1px solid var(--accent-solid);
      }
    }

    .nav-footer-mobile {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: auto;
      .nav-social {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font: var(--weight-regular) 14px/1.4 var(--font-ui);
        color: var(--ink-label);
        transition: color var(--transition-hover);
        &:hover { color: var(--ink); }
        svg { flex: none; width: 18px; height: 18px; display: block; }
      }
    }
  }
}
</style>
