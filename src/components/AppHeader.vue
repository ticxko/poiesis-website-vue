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
          <li><router-link to="/contact" class="nav-enquire" @click="closeMenu">Enquire</router-link></li>
        </ul>
        <div class="nav-footer-mobile">
          <p>+62 812 1832 1775</p>
          <p>@poiesis.id</p>
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
        margin-top: 24px;
        justify-content: center;
        border: 1px solid var(--accent-solid);
      }
    }

    .nav-footer-mobile {
      display: block;
      margin-top: auto;
      p { font: var(--weight-regular) 13px/1.8 var(--font-ui); color: var(--ink-label); }
    }
  }
}
</style>
