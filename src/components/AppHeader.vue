<template>
  <header class="site-header" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <img src="/images/brand/poiesis-logo.png" alt="Poiesis Studio" class="logo-img" />
      </router-link>

      <nav class="main-nav" :class="{ open: menuOpen }">
        <ul class="nav-links">
          <li><router-link to="/" @click="closeMenu">Home</router-link></li>
          <li><router-link to="/about" @click="closeMenu">About</router-link></li>
          <li><router-link to="/projects" @click="closeMenu">Projects</router-link></li>
          <li><router-link to="/contact" @click="closeMenu">Contact</router-link></li>
        </ul>
        <div class="nav-footer-mobile">
          <p>mayang.poiesis@gmail.com</p>
          <p>+62 812 1832 1775</p>
        </div>
      </nav>

      <div class="header-right">
        <a href="mailto:mayang.poiesis@gmail.com" class="header-email">mayang.poiesis@gmail.com</a>
        <router-link to="/contact" class="btn-theme btn-theme--sm">Contact Us</router-link>
        <button class="menu-toggle" :class="{ open: menuOpen }" @click="toggleMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: $header-height;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  transition: all $transition-base;

  &.scrolled {
    background-color: $color-white;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  }
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1001;
  transition: color $transition-base;
}

.logo-img {
  height: 36px;
  width: auto;
}

.main-nav {
  .nav-links {
    display: flex;
    gap: 40px;

    a {
      font-size: 15px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.8);
      position: relative;
      padding: 4px 0;
      transition: color $transition-base;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: $color-accent;
        transition: width $transition-slow;
      }

      &:hover,
      &.router-link-exact-active {
        color: $color-white;

        &::after {
          width: 100%;
        }
      }

      .scrolled & {
        color: $color-gray;

        &:hover,
        &.router-link-exact-active {
          color: $color-dark;
        }
      }
    }
  }

  .nav-footer-mobile {
    display: none;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  z-index: 1001;
}

.header-email {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  transition: color $transition-base;

  .scrolled & {
    color: $color-gray;
  }

  &:hover {
    color: $color-accent;
  }
}

.btn-theme--sm {
  padding: 12px 24px;
  font-size: 12px;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;

  span {
    display: block;
    width: 28px;
    height: 2px;
    background-color: $color-white;
    transition: all $transition-base;

    .scrolled & {
      background-color: $color-dark;
    }

    .menu-open & {
      background-color: $color-white;
    }
  }

  &.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 6px);
  }
  &.open span:nth-child(2) {
    opacity: 0;
  }
  &.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -6px);
  }
}

@media (max-width: 992px) {
  .header-email {
    display: none;
  }

  .btn-theme--sm {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 320px;
    height: 100vh;
    background-color: $color-darker;
    padding: 120px 40px 40px;
    transition: right $transition-slow;
    z-index: 1000;

    &.open {
      right: 0;
    }

    .nav-links {
      flex-direction: column;
      gap: 0;

      a {
        color: rgba(255, 255, 255, 0.7);
        font-size: 20px;
        padding: 16px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        &:hover,
        &.router-link-exact-active {
          color: $color-white;
        }

        &::after {
          display: none;
        }
      }
    }

    .nav-footer-mobile {
      display: block;
      margin-top: 40px;
      p {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
