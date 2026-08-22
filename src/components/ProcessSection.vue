<template>
  <section class="section section--white" id="values">
    <div class="container">
      <div class="values-head ps-reveal">
        <p class="ps-label">How we work</p>
        <h2 class="ps-h1 values-title">Three commitments, held in every project.</h2>
      </div>
      <div class="pillars">
        <div class="pillar ps-reveal" v-for="v in values" :key="v.title">
          <span class="tri" aria-hidden="true"></span>
          <h3 class="pillar-title">{{ v.title }}</h3>
          <p class="ps-body pillar-desc">{{ v.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const values = [
  { title: 'Story-Led Design', desc: 'We lead our design with story. By listening carefully, we write a unique narrative that gives each project its soul — and every spatial decision afterwards traces back to it.' },
  { title: 'Sustainable Connection', desc: 'Our commitment to story shapes sustainable environments that make a positive impact. We design open, flexible spaces that bring people together — with each other, and with nature.' },
  { title: 'Craft & Making', desc: 'We take a hands-on, resourceful approach to materials. We find beauty in honest materials and details, standing next to the maker to ensure every space is thoughtfully built.' },
]
</script>

<style lang="scss" scoped>
.values-head { margin-bottom: 52px; }
.values-title { margin-top: 14px; max-width: var(--measure-headline); }

.pillars {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap-col);

  @media (max-width: 991px) { grid-template-columns: 1fr; gap: 40px; }
}
.pillar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 22px;
  border-top: var(--border-hairline);
}
.pillar-title { font: var(--weight-bold) 13px/1.3 var(--font-ui); letter-spacing: var(--track-caps); text-transform: uppercase; }
.pillar-desc { font-size: 15px; }
</style>
