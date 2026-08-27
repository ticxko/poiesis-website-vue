<template>
  <div class="uploader">
    <ul class="thumbs" role="list">
      <li v-for="im in images" :key="im.id" class="thumb" :class="'is-' + im.status">
        <img v-if="im.previewUrl || im.thumb" :src="im.previewUrl || im.thumb" alt="" data-no-fade />
        <span v-else class="thumb-ph" aria-hidden="true"></span>

        <span v-if="im.status === 'processing' || im.status === 'uploading'" class="thumb-veil">
          <span class="spinner" aria-hidden="true"></span>
        </span>

        <button
          v-if="im.status === 'error'"
          type="button"
          class="thumb-veil thumb-retry"
          :title="im.error"
          @click="$emit('retry', im)"
        >Coba lagi</button>

        <button type="button" class="thumb-x" aria-label="Hapus foto" @click="$emit('remove', im)">×</button>
      </li>

      <li v-if="images.length < max" class="thumb thumb-add">
        <label>
          <input type="file" accept="image/*" multiple class="sr-only" @change="onPick" />
          <span class="thumb-add-inner"><span class="thumb-add-plus" aria-hidden="true">+</span>Tambah foto</span>
        </label>
      </li>
    </ul>
    <p class="uploader-hint">Maksimal {{ max }} foto · JPG, PNG, atau WebP · otomatis diperkecil sebelum dikirim.</p>
  </div>
</template>

<script setup>
defineProps({
  images: { type: Array, default: () => [] },
  max: { type: Number, default: 8 },
})
const emit = defineEmits(['add', 'remove', 'retry'])

function onPick(e) {
  const files = e.target.files
  if (files && files.length) emit('add', files)
  e.target.value = '' // allow re-picking the same file
}
</script>

<style lang="scss" scoped>
.thumbs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 10px;
}

.thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--ground-alt);
  border: 1px solid var(--rule);
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
}
.thumb-ph { position: absolute; inset: 0; background: var(--supergraphic-stripe); }

.thumb-veil {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(44, 44, 44, 0.5);
  color: #fff;
  border: 0;
  cursor: default;
}
.thumb-retry {
  cursor: pointer;
  font: var(--weight-medium) 12px/1.2 var(--font-ui);
  text-transform: uppercase;
  letter-spacing: var(--track-caps);
  background: rgba(44, 44, 44, 0.62);
}
.is-error { border-color: var(--pink-dark-rose); }

.spinner {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 1.6s; } }

.thumb-x {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: rgba(44, 44, 44, 0.72);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  z-index: 2;
}

.thumb-add label { display: block; width: 100%; height: 100%; cursor: pointer; }
.thumb-add-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  font: var(--weight-medium) 11px/1.3 var(--font-ui);
  text-transform: uppercase;
  letter-spacing: var(--track-caps);
  color: var(--ink-label);
  border: 1px dashed var(--rule-strong);
  transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.thumb-add-plus { font-size: 22px; letter-spacing: 0; }
.thumb-add label:hover .thumb-add-inner { border-color: var(--ink); color: var(--ink); }

.uploader-hint { margin-top: 10px; font: var(--weight-regular) 12.5px/1.5 var(--font-ui); color: var(--ink-label); }
</style>
