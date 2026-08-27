<template>
  <section class="cta-band" id="contact-cta">
    <div class="cta-bg" aria-hidden="true">
      <img src="/images/projects/bangka-1210/04.jpg?v=1" alt="" />
      <span class="cta-scrim"></span>
    </div>
    <div class="container cta-content ps-reveal">
      <p class="ps-label cta-label">Contact</p>
      <h2 class="ps-h2 cta-head">A project?<br>Let's begin with the story.</h2>
      <p class="cta-sub">Before we sketch a single line, we want to hear yours. We reply within two working days.</p>
      <router-link to="/enquiry" class="btn cta-btn" @click="trackEvent('cta_click', { location: 'cta-band' })">Start an enquiry</router-link>
    </div>
  </section>
</template>

<script setup>
import { trackEvent } from '../utils/analytics'
</script>

<style lang="scss" scoped>
.cta-band {
  position: relative;
  padding: 120px 0;
  overflow: hidden;
  text-align: center;

  @media (max-width: 768px) { padding: 80px 0; }
}
.cta-bg { position: absolute; inset: 0; z-index: 0; }
.cta-bg img { width: 100%; height: 100%; object-fit: cover; }
.cta-scrim { position: absolute; inset: 0; background: var(--scrim-flat); }

.cta-content { position: relative; z-index: 2; }
.cta-label { color: rgba(255, 255, 255, 0.78); }
.cta-head { color: #fff; margin-top: 14px; }
.cta-sub {
  font: var(--weight-regular) var(--t-lead)/1.7 var(--font-ui);
  color: rgba(255, 255, 255, 0.72);
  max-width: 46ch;
  margin: 22px auto 34px;
}
.cta-btn { background: #fff; color: var(--ink); border-color: #fff; }
.cta-btn:hover { background: var(--accent-solid); border-color: var(--accent-solid); color: #fff; }
</style>
