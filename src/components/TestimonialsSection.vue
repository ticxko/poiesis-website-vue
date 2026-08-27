<template>
  <section class="section section--petal belief-section">
    <div class="container">
      <div class="split ps-reveal belief-split">
        <div class="belief-body">
          <p class="ps-label belief-label">Our belief</p>
          <blockquote class="ps-quote">
            &ldquo;At Poiesis Studio, we believe that spaces should have a soul. They aren't
            just built from materials, but from personal stories and dreams of the people
            who live in them.&rdquo;
          </blockquote>
          <div class="belief-cite">
            <b>Ar. Amita Ratih Purnamasari, S.Ars, IAI</b>
            <span class="ps-label belief-role">Principal · Poiesis Studio</span>
          </div>
        </div>
        <div class="belief-media">
          <img src="/images/projects/bangka-1210/02.jpg?v=1" alt="Bangka 1210 — Poiesis Studio" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.belief-split { align-items: center; }
.belief-label { color: var(--pink-crimson); margin-bottom: 26px; }
.ps-quote { max-width: 26ch; }
.belief-cite { margin-top: 28px; display: flex; flex-direction: column; gap: 4px; }
.belief-cite b { font: var(--weight-medium) var(--t-body)/1.4 var(--font-ui); }
.belief-role { font-size: 11.5px; }
/* Landscape frame matching Bangka 1210 / 02 (2000×1100) so the shot isn't cropped. */
.belief-media img { width: 100%; aspect-ratio: 2000 / 1100; object-fit: cover; }

@media (max-width: 991px) {
  .belief-media { order: -1; }
}
</style>
