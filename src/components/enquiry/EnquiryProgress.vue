<template>
  <div class="progress">
    <div class="progress-track" aria-hidden="true">
      <span class="progress-fill" :style="{ width: pct + '%' }"></span>
    </div>
    <ol class="progress-steps" aria-label="Langkah enquiry">
      <li
        v-for="(s, i) in steps"
        :key="i"
        class="progress-step"
        :class="{ 'is-done': i < current, 'is-current': i === current }"
        :aria-current="i === current ? 'step' : undefined"
      >
        <span class="progress-num">{{ i + 1 }}</span>
        <span class="progress-name">{{ s }}</span>
      </li>
    </ol>
    <p class="sr-only" aria-live="polite">Langkah {{ current + 1 }} dari {{ steps.length }}: {{ steps[current] }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: { type: Array, required: true },
  current: { type: Number, required: true },
})
const pct = computed(() => (props.steps.length <= 1 ? 100 : (props.current / (props.steps.length - 1)) * 100))
</script>

<style lang="scss" scoped>
.progress { margin-bottom: 34px; }

.progress-track {
  height: 2px;
  background: var(--rule);
  position: relative;
  overflow: hidden;
}
.progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--neutral-charcoal);
  transition: width var(--dur-slow) var(--ease);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
}
.progress-step {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--ink-label);
}
.progress-num {
  flex: none;
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border: 1px solid var(--rule);
  border-radius: 50%;
  font: var(--weight-medium) 11px/1 var(--font-ui);
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.progress-name {
  font: var(--weight-medium) 11.5px/1.2 var(--font-ui);
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.progress-step.is-current { color: var(--ink); }
.progress-step.is-current .progress-num { background: var(--neutral-charcoal); border-color: var(--neutral-charcoal); color: #fff; }
.progress-step.is-done .progress-num { border-color: var(--ink); color: var(--ink); }

/* On mobile, keep only the numbers + the current step's name to avoid crowding. */
@media (max-width: 640px) {
  .progress-steps { justify-content: flex-start; gap: 10px; }
  .progress-name { display: none; }
  .progress-step.is-current .progress-name { display: inline; }
}
</style>
