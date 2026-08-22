<template>
  <main>
    <!-- Plate -->
    <section class="page-plate">
      <img src="/images/studio/company-05.jpg" alt="" />
      <span class="plate-scrim" aria-hidden="true"></span>
      <span class="plate-tri" aria-hidden="true"></span>
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
          <article class="service-item ps-reveal" v-for="(s, i) in services" :key="s.name">
            <div class="service-lead">
              <span class="service-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="service-name">{{ s.name }}</h3>
            </div>
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
const services = [
  { name: 'Architecture', desc: 'Ground-up buildings shaped around a story — from private homes to community-scale places.' },
  { name: 'Interior Design', desc: 'Interiors composed in light, material and proportion, tuned to the way you truly live.' },
  { name: 'Master Planning', desc: 'The larger frame — how buildings, landscape and people come together across a whole site.' },
  { name: 'Landscape', desc: 'Gardens and outdoor rooms that let the architecture breathe and meet the natural world.' },
  { name: 'Furniture', desc: 'Bespoke pieces designed for the space and made in honest, tactile materials.' },
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
.plate-tri { position: absolute; top: 0; right: 0; width: 26vw; height: 26vw; background: var(--pink-studio); opacity: .16; clip-path: var(--tri-tr); }
.plate-inner { position: relative; z-index: 2; width: 100%; padding-bottom: 44px; }
.plate-eyebrow { color: rgba(255,255,255,.78); }
.plate-title { color: #fff; margin-top: 10px; }

.about-intro-head { margin-top: 14px; max-width: 16ch; }
.about-intro .ps-body + .ps-body { margin-top: 1em; }

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

/* Services — five disciplines as an editorial list, names in the serif jewel */
.services-head { margin-bottom: 48px; }
.service-item {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 20px 48px;
  padding: 36px 0;
  border-top: var(--border-hairline);
  align-items: baseline;
  transition: padding-left var(--transition-hover);
  &:last-child { border-bottom: var(--border-hairline); }
  &:hover { padding-left: 12px; }
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 12px; }
}
.service-lead { display: flex; align-items: baseline; gap: 18px; }
.service-num { font: var(--weight-regular) 12px/1 var(--font-mono); color: var(--ink-label); }
.service-name { font: var(--weight-light) clamp(26px, 3vw, 38px)/1.05 var(--font-editorial); letter-spacing: .005em; }
.service-desc { color: var(--ink-soft); font-size: 16px; line-height: 1.65; max-width: 52ch; }
</style>
