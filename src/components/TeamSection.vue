<template>
  <section class="section section--cream" id="team">
    <div class="container">
      <div class="team-head ps-reveal">
        <p class="ps-label">People</p>
        <h2 class="ps-h1 team-title">A small studio — both principals on site, weekly.</h2>
      </div>

      <div class="team-grid">
        <figure class="team-card ps-reveal" v-for="m in team" :key="m.name">
          <div class="team-photo"><img :src="m.photo" :alt="m.name" loading="lazy" /></div>
          <figcaption>
            <h3 class="team-name">{{ m.name }}</h3>
            <p class="ps-label team-role">{{ m.role }}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
// NOTE: names/roles are studio-provided. Portrait mapping confirmed by the
// studio — Mayang = team-02, Jessica = team-01 (the deck order was reversed).
const team = [
  { name: 'Mayang Ratih', role: 'Principal', photo: '/images/studio/team-02.jpg' },
  { name: 'Jessica Sarana', role: 'Partner', photo: '/images/studio/team-01.jpg' },
  { name: 'Irawan Listanto', role: 'Senior Architect', photo: '/images/studio/team-03.png' },
  { name: 'Mikael Christian Lolonlun', role: 'Architect & Interior Designer', photo: '/images/studio/team-04.jpg' },
  { name: 'Nicholas Kuncoro Adi', role: 'Junior Architect', photo: '/images/studio/team-05.jpg' },
]
</script>

<style lang="scss" scoped>
.team-head { margin-bottom: 52px; }
.team-title { margin-top: 14px; max-width: 20ch; }

.team-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 991px) { grid-template-columns: repeat(3, 1fr); gap: 28px; }
  @media (max-width: 560px) { grid-template-columns: repeat(2, 1fr); }
}
.team-card { margin: 0; }
.team-photo {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--nat-warm-sand);
  img { width: 100%; height: 100%; object-fit: cover; object-position: center 22%; transition: transform var(--dur-slow) var(--ease); }
}
.team-card:hover .team-photo img { transform: scale(1.04); }
.team-name { font: var(--weight-medium) var(--t-body)/1.3 var(--font-ui); margin-top: 14px; }
.team-role { font-size: 11px; margin-top: 4px; }
</style>
