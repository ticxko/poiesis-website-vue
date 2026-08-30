<template>
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="open"
        class="lb-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        @click.self="$emit('close')"
      >
        <button class="lb-close" type="button" aria-label="Close" @click="$emit('close')">&times;</button>

        <button
          v-if="images.length > 1"
          class="lb-nav lb-prev"
          type="button"
          aria-label="Previous image"
          @click.stop="prev"
        >&#8249;</button>

        <figure class="lb-frame" @click.stop>
          <picture>
            <source :srcset="fullWebp(active)" type="image/webp" />
            <img :src="active" :alt="alt" data-no-fade />
          </picture>
        </figure>

        <button
          v-if="images.length > 1"
          class="lb-nav lb-next"
          type="button"
          aria-label="Next image"
          @click.stop="next"
        >&#8250;</button>

        <p v-if="images.length > 1" class="lb-counter ps-label">{{ index + 1 }} / {{ images.length }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
  open: { type: Boolean, default: false },
  index: { type: Number, default: 0 },
  alt: { type: String, default: '' },
})
const emit = defineEmits(['close', 'update:index'])

const active = computed(() => props.images[props.index] || '')

// Append `.webp` to a full image path (01.jpg -> 01.jpg.webp), preserving any ?v= query.
// Mirrors the helper in ProjectsSection.vue so the lightbox serves the webp derivative.
function fullWebp(src) {
  if (!src) return src
  const [path, q] = src.split('?')
  const w = path.replace(/(\.(?:png|jpe?g))$/i, '$1.webp')
  return q ? `${w}?${q}` : w
}

function step(dir) {
  const n = props.images.length
  if (n < 2) return
  emit('update:index', (props.index + dir + n) % n)
}
const prev = () => step(-1)
const next = () => step(1)

function onKey(e) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

// Touch swipe for prev/next on mobile.
let touchX = null
function onTouchStart(e) { touchX = e.changedTouches[0].clientX }
function onTouchEnd(e) {
  if (touchX === null) return
  const dx = e.changedTouches[0].clientX - touchX
  if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
  touchX = null
}

function lock() {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
}
function unlock() {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
}

watch(() => props.open, (isOpen) => { isOpen ? lock() : unlock() })
onUnmounted(unlock)
</script>

<style lang="scss" scoped>
.lb-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vh 4vw;
  background: rgba(44, 44, 44, .88);
  backdrop-filter: blur(2px);
  cursor: zoom-out;
}

/* The elegant border: a white matte frame with a hairline rule and soft overlay shadow. */
.lb-frame {
  margin: 0;
  padding: 12px;
  max-width: 92vw;
  max-height: 90vh;
  background: var(--ground);
  border: var(--border-soft);
  box-shadow: var(--shadow-overlay);
  cursor: default;

  img {
    display: block;
    width: auto;
    max-width: 100%;
    max-height: calc(90vh - 24px);
    object-fit: contain;
  }
}

/* Controls sit on the dark backdrop, in the on-image tone. */
.lb-close,
.lb-nav {
  position: fixed;
  z-index: 2001;
  border: none;
  background: transparent;
  color: var(--on-image);
  cursor: pointer;
  line-height: 1;
  opacity: .78;
  transition: opacity var(--dur-fast, .18s) var(--ease);

  &:hover { opacity: 1; }
}
.lb-close {
  top: 20px;
  right: 24px;
  font-size: 34px;
  font-weight: 300;
}
.lb-nav {
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  font-weight: 300;
  padding: 0 8px;
}
.lb-prev { left: max(12px, 2vw); }
.lb-next { right: max(12px, 2vw); }

.lb-counter {
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2001;
  color: var(--on-image);
  font-family: var(--font-mono);
  opacity: .7;
}

@media (max-width: 640px) {
  .lb-nav { font-size: 36px; }
  .lb-close { top: 14px; right: 16px; }
}

/* Fade the backdrop, lift the frame slightly. */
.lb-enter-active,
.lb-leave-active { transition: opacity .28s var(--ease); }
.lb-enter-from,
.lb-leave-to { opacity: 0; }
.lb-enter-active .lb-frame { transition: transform .28s var(--ease); }
.lb-enter-from .lb-frame { transform: scale(.97); }

@media (prefers-reduced-motion: reduce) {
  .lb-enter-active,
  .lb-leave-active,
  .lb-enter-active .lb-frame { transition: none; }
  .lb-enter-from .lb-frame { transform: none; }
}
</style>
