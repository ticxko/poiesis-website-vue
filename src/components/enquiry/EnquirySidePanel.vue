<template>
  <aside class="side">
    <span class="side-scrim" aria-hidden="true"></span>

    <div class="side-top">
      <p class="ps-label side-eyebrow">Enquiry</p>
      <p class="side-head">Mari mulai<br />dari cerita Anda.</p>
      <p v-if="reassurance" class="side-reassure" aria-live="polite">{{ reassurance }}</p>
    </div>

    <div class="side-bottom">
      <span class="side-strong">Poiesis Studio</span>
      <span>PT Pencipta Organik Imaji<br />Calamus C7-35, Citra Garden Bintaro<br />Tangerang Selatan 15413</span>
      <a href="https://wa.me/6281218321775" target="_blank" rel="noopener">WhatsApp · +62 812 1832 1775</a>
      <a href="https://instagram.com/poiesis.id" target="_blank" rel="noopener">@poiesis.id</a>
      <span>Senin – Jumat · 09.00–18.00 WIB</span>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  reassurance: { type: String, default: '' },
})
</script>

<style lang="scss" scoped>
.side {
  position: relative;
  overflow: hidden;
  background: var(--stripe-dark);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
}
.side-scrim { position: absolute; inset: 0; background: var(--scrim-flat); }

.side-top { position: relative; padding: 40px 38px 24px; }
.side-eyebrow { color: rgba(255, 255, 255, 0.78); }
.side-head {
  font: var(--weight-light) var(--t-h2)/1.15 var(--font-editorial);
  color: #fff;
  margin-top: 14px;
  letter-spacing: 0.01em;
}
.side-reassure {
  margin-top: 20px;
  font: var(--weight-regular) 14.5px/1.65 var(--font-ui);
  color: rgba(255, 255, 255, 0.82);
  max-width: 34ch;
  min-height: 3em;
  transition: opacity var(--dur) var(--ease);
}

.side-bottom {
  position: relative;
  padding: 30px 38px 38px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font: var(--weight-regular) 13.5px/1.6 var(--font-ui);
  color: var(--nat-cream);
}
.side-bottom a { color: var(--nat-cream); }
.side-bottom a:hover { color: var(--pink-soft); }
.side-strong { font-weight: var(--weight-medium); letter-spacing: var(--track-caps); text-transform: uppercase; font-size: 12px; }

/* On mobile the panel becomes a compact intro header; the contact block is dropped
   (it also lives in the site footer) to keep the form front-and-centre. */
@media (max-width: 900px) {
  .side { min-height: 0; }
  .side-top { padding: 30px 26px 26px; }
  .side-head { font-size: 26px; }
  .side-reassure { min-height: 0; }
  .side-bottom { display: none; }
}
</style>
