<template>
  <section class="section section--cream company-section">
    <div class="container">
      <!-- About company -->
      <div class="company-about ps-reveal">
        <div class="company-about-head">
          <h2 class="ps-h1">About the company</h2>
          <p class="ps-label company-legal">PT. Pencipta Organik Imaji</p>
        </div>
        <div class="company-about-cols">
          <div>
            <h4 class="ps-h3 col-h">Company overview</h4>
            <p class="ps-body">
              Our design methodology is focused on a narrative-driven approach, where the
              story of our clients and their context becomes the soul of the project.
            </p>
          </div>
          <div>
            <h4 class="ps-h3 col-h">Key achievements</h4>
            <p class="ps-body">
              We are known for a warm, modern aesthetic, blending clean lines with natural
              materials like wood and rattan to make homes that feel both stylish and soulful.
            </p>
            <p class="ps-body">
              We love unique spatial challenges — like designing a two-storey house to feel
              as open and connected as a single-storey home. But our work is about more than
              looks: we build sustainably, bring communities together, and stay resourceful
              with materials.
            </p>
          </div>
        </div>
        <div class="company-about-image media">
          <img src="/images/projects/jatijajar-retreat/08.jpg?v=1" alt="Jatijajar Retreat — Poiesis Studio" loading="lazy" />
        </div>
      </div>

      <!-- Vision -->
      <div class="company-vision ps-reveal">
        <p class="ps-label vision-label">Our vision</p>
        <h2 class="ps-h1 vision-title">Narrative-driven placemaking.</h2>
        <p class="ps-body vision-text">
          Our vision is to become a leading architectural &amp; interior design practice by
          pioneering the art of narrative-driven placemaking — creating soulful, sustainable
          and interconnected environments that are more than structures. They are living
          ecosystems designed to elevate the human experience.
        </p>
        <p class="ps-body vision-text">
          This applies to every project we touch, from the intimate scale of a private home
          to the dynamic of a full urban community, ensuring each space has a unique identity
          and a lasting positive impact.
        </p>
        <div class="vision-gallery">
          <img src="/images/studio/vision-03.jpg?v=1" alt="The Icy Garden — concept design for Foom" loading="lazy" />
          <img src="/images/studio/vision-04.jpg?v=1" alt="Material palette detail" loading="lazy" />
          <img src="/images/studio/vision-02.jpg?v=1" alt="Residential design study" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.company-about { padding-top: 8px; }
.company-about-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.company-legal { color: var(--ink-label); }
.company-about-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px var(--gap-col);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}
.col-h { font-size: 13px; margin-bottom: 14px; }
.company-about-cols .ps-body + .ps-body { margin-top: 1em; }
.company-about-image { margin-top: 44px; background: none; }
.company-about-image img { width: 100%; aspect-ratio: 16 / 7; object-fit: cover; }

.company-vision { margin-top: 96px; }
.vision-title { margin-top: 14px; }
.vision-text { max-width: 68ch; margin-top: 20px; }
.vision-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 52px;
  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    display: block;
    background: #fff;
    border: var(--border-hairline);
    box-shadow: 0 1px 2px rgba(20, 20, 20, 0.04), 0 12px 28px rgba(20, 20, 20, 0.06);
    transition: transform 0.5s var(--ease, ease), box-shadow 0.5s var(--ease, ease);
  }
  img:hover {
    transform: translateY(-4px);
    box-shadow: 0 2px 4px rgba(20, 20, 20, 0.05), 0 20px 40px rgba(20, 20, 20, 0.10);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}
</style>
