<template>
  <section class="section section--white services-section" id="services">
    <div class="container">
      <div class="services-head ps-reveal">
        <p class="ps-label">What we do</p>
        <h2 class="ps-h1 services-title">Eight disciplines, one continuous conversation.</h2>
      </div>

      <div class="services-grid">
        <div class="service ps-reveal" v-for="(s, i) in services" :key="s.title">
          <span class="service-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="service-title">{{ s.title }}</h3>
          <p class="service-desc ps-body">{{ s.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  { title: 'Architecture', desc: 'Complete architectural design, from concept and narrative to construction documentation.' },
  { title: 'Interior Design', desc: 'Interiors that carry the story through material, light and spatial planning.' },
  { title: 'Master Planning', desc: 'Site and community planning that reads context, environment and connection.' },
  { title: 'Landscape', desc: 'Gardens and outdoor rooms that tie the built and the natural together.' },
  { title: 'Furniture', desc: 'Bespoke, buildable pieces detailed for the hand and the room they belong to.' },
  { title: 'Permit Document', desc: 'IMB and regulatory drawing sets prepared to see a project through approval.' },
  { title: 'Renovation', desc: 'Adaptive, resourceful reworking of existing spaces for how life is lived now.' },
  { title: 'Construction Management', desc: 'On-site oversight of craft, timeline and budget, from excavation to handover.' },
]
</script>

<style lang="scss" scoped>
.services-head { margin-bottom: 56px; }
.services-title { margin-top: 14px; max-width: var(--measure-headline); }

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 40px var(--gap-col);

  @media (max-width: 991px) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 36px 28px; }
  @media (max-width: 520px) { grid-template-columns: 1fr; }
}

.service {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 22px;
  border-top: var(--border-hairline);
}
.service-num { font: var(--weight-regular) 12px/1 var(--font-mono); color: var(--pink-crimson); }
.service-title { font: var(--weight-medium) var(--t-lead)/1.25 var(--font-ui); text-transform: none; letter-spacing: 0; }
.service-desc { font-size: 14.5px; }
</style>
