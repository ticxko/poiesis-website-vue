<template>
  <main>
    <!-- Plate -->
    <section class="page-plate">
      <img src="/images/projects/j-i-velodrome/01.jpg?v=1" alt="" />
      <span class="plate-scrim" aria-hidden="true"></span>
      <div class="container plate-inner">
        <p class="ps-label plate-eyebrow">Design Through Stories</p>
        <h1 class="ps-display plate-title">The studio</h1>
      </div>
    </section>

    <!-- Intro -->
    <section class="section">
      <div class="container">
        <div class="split about-intro ps-reveal">
          <div>
            <p class="ps-label">Our story</p>
            <h2 class="ps-h1 about-intro-head">We design through stories.</h2>
          </div>
          <figure class="about-intro-media">
            <img src="/images/studio/vision-01.jpg?v=1" alt="The Poiesis Studio team" loading="lazy" />
          </figure>
          <div>
            <p class="ps-body">
              Poiesis Studio is a Jakarta-based Architecture &amp; Interior Design consultancy
              founded by Ar. Amita Ratih Purnamasari (Mayang) as Principal and Jessica Sarana
              as Partner. Our methodology is focused on the process of a narrative approach.
            </p>
            <p class="ps-body">
              Before any spatial program or aesthetic form is drawn, a foundational story
              must be established — read through a phenomenological understanding of how a
              person lives, and where they have come from.
            </p>
            <p class="ps-body">
              The result is architecture &amp; interior design with a profound connection to
              its context, its function, and most importantly to the people it serves.
            </p>
          </div>
        </div>
      </div>
    </section>

    <CompanySection />

    <!-- Design process -->
    <section class="section section--white">
      <div class="container">
        <div class="process-head ps-reveal">
          <p class="ps-label">How we work</p>
          <h2 class="ps-h1 process-title">A considered process — from the first conversation to the final coat.</h2>
        </div>
        <div class="process-grid">
          <article class="process-item ps-reveal" v-for="(s, i) in steps" :key="s.title">
            <span class="process-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="process-item-title">{{ s.title }}</h3>
            <p class="process-item-desc">{{ s.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="section">
      <div class="container">
        <div class="services-head ps-reveal">
          <p class="ps-label">What we do</p>
          <h2 class="ps-h1">Five disciplines, one practice.</h2>
        </div>
        <div class="services-list">
          <article class="service-item ps-reveal" v-for="s in services" :key="s.name">
            <div class="service-media">
              <img v-if="s.image" :src="s.image" :alt="s.name" loading="lazy" />
              <span v-else class="service-media-ph">21 : 9</span>
            </div>
            <h3 class="service-name">{{ s.name }}</h3>
            <p class="service-desc">{{ s.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <TeamSection />
    <CtaSection />
  </main>
</template>

<script setup>
import CompanySection from '../components/CompanySection.vue'
import TeamSection from '../components/TeamSection.vue'
import CtaSection from '../components/CtaSection.vue'

const steps = [
  { title: 'Discovery', desc: 'We begin by listening — to how you live, what you value, and the story the space must hold.' },
  { title: 'Concept', desc: 'That story becomes form: massing, light, flow, and the material language of the project.' },
  { title: 'Permit & Approvals', desc: 'Regulatory drawings prepared and lodged, so the build is properly sanctioned and sound.' },
  { title: 'Construction Documentation', desc: 'Precise technical drawings that let every detail be built exactly as it was drawn.' },
  { title: 'Specification & Budget', desc: 'Considered materials and finishes, set against a clear, transparent cost estimate.' },
  { title: 'Tender & Appointment', desc: 'Selecting and appointing the right hands to bring the work into being.' },
]
// `image` is the 21:9 discipline photo — left empty for now so a labelled placeholder
// renders; drop a path in each to go live with the real image.
const services = [
  { name: 'Architecture', image: '/images/studio/discipline-architecture.jpg?v=1', desc: 'Ground-up buildings shaped around a story — from private homes to community-scale places.' },
  { name: 'Interior Design', image: '/images/studio/discipline-interior.jpg?v=1', desc: 'Interiors composed in light, material and proportion, tuned to the way you truly live.' },
  { name: 'Furniture', image: '/images/studio/discipline-furniture.jpg?v=1', desc: 'Bespoke pieces designed for the space and made in honest, tactile materials.' },
  { name: 'Master Planning', image: '/images/studio/discipline-masterplanning.jpg?v=1', desc: 'The larger frame — how buildings, landscape and people come together across a whole site.' },
  { name: 'High Rise', image: '/images/studio/discipline-highrise.jpg?v=1', desc: 'Towers and vertical communities — high-density living and mixed-use blocks shaped for light, air and shared ground.' },
]
</script>

<style lang="scss" scoped>
.page-plate {
  position: relative;
  height: 56vh;
  min-height: 380px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: var(--stripe-dark);
  > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
}
.plate-scrim { position: absolute; inset: 0; background: var(--scrim); }
.plate-inner { position: relative; z-index: 2; width: 100%; padding-bottom: 44px; }
.plate-eyebrow { color: rgba(255,255,255,.78); }
.plate-title { color: #fff; margin-top: 10px; }

/* Three columns: heading · team photo · narrative. Overrides the 2-col `.split`. */
.about-intro {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--gap-col);
  align-items: start;
}
.about-intro-head { margin-top: 14px; max-width: 16ch; }
.about-intro .ps-body + .ps-body { margin-top: 1em; }
.about-intro-media { margin: 0; }
.about-intro-media img { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; display: block; }

@media (max-width: 900px) {
  .about-intro { grid-template-columns: 1fr; gap: 34px; }
  .about-intro-head { max-width: none; }
}

/* Process — numbered items in two columns, Cormorant numeral as the quiet jewel */
.process-head { margin-bottom: 56px; }
.process-title { margin-top: 14px; max-width: 24ch; }
.process-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--gap-col);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}
.process-item {
  padding: 32px 4px 34px 0;
  border-top: var(--border-hairline);
}
.process-num {
  display: block;
  font: var(--weight-light) 34px/1 var(--font-editorial);
  font-style: italic;
  color: var(--ink-label);
  margin-bottom: 16px;
}
.process-item-title { font: var(--weight-medium) var(--t-lead)/1.3 var(--font-ui); }
.process-item-desc { margin-top: 10px; color: var(--ink-soft); font-size: 15px; line-height: 1.62; max-width: 44ch; }

/* Services — five disciplines as cards: 21:9 image, name (serif jewel), short desc */
.services-head { margin-bottom: 48px; }
.services-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 56px var(--gap-col);
  @media (max-width: 900px) { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 44px var(--gap-col); }
  @media (max-width: 560px) { grid-template-columns: 1fr; gap: 40px; }
}
.service-item { margin: 0; }
.service-media {
  aspect-ratio: 21 / 9;
  overflow: hidden;
  background: var(--ground-alt);
  border: var(--border-hairline);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform var(--dur-slow) var(--ease); }
}
.service-item:hover .service-media img { transform: scale(1.03); }
.service-media-ph {
  font: var(--weight-regular) 11px/1 var(--font-mono);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  color: var(--ink-label);
}
.service-name { font: var(--weight-light) clamp(24px, 2.4vw, 32px)/1.08 var(--font-editorial); letter-spacing: .005em; }
.service-desc { color: var(--ink-soft); font-size: 15.5px; line-height: 1.6; margin-top: 10px; max-width: 46ch; }
</style>
