<template>
  <fieldset class="seg" :class="{ 'seg--compact': compact }">
    <legend class="sr-only">{{ legend }}</legend>
    <label
      v-for="o in options"
      :key="o.value"
      class="seg-card"
      :class="{ 'is-sel': modelValue === o.value }"
    >
      <input
        type="radio"
        class="sr-only"
        :name="name"
        :value="o.value"
        :checked="modelValue === o.value"
        @change="$emit('update:modelValue', o.value)"
      />
      <span class="seg-label">{{ o.label }}</span>
      <span v-if="o.hint" class="seg-hint">{{ o.hint }}</span>
      <span class="seg-tick" aria-hidden="true"></span>
    </label>
  </fieldset>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true },   // [{ value, label, hint? }]
  name: { type: String, required: true },
  legend: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.seg {
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;

  &--compact { grid-template-columns: repeat(auto-fit, minmax(92px, 1fr)); }
}

.seg-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-height: 60px;
  padding: 15px 44px 15px 18px;
  background: var(--neutral-white);
  border: 1px solid var(--rule);
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease), color var(--dur) var(--ease);

  &:hover { border-color: var(--ink); }

  .seg--compact & { padding: 14px 16px; align-items: center; text-align: center; min-height: 52px; }
}

.seg-label { font: var(--weight-medium) 15px/1.35 var(--font-ui); color: var(--ink); }
.seg-hint { font: var(--weight-regular) 12.5px/1.4 var(--font-ui); color: var(--ink-label); }

/* Tick badge, top-right */
.seg-tick {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 1px solid var(--rule);
  border-radius: 50%;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);

  .seg--compact & { display: none; }

  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 7px;
    width: 5px;
    height: 9px;
    border: solid transparent;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    transition: border-color var(--dur) var(--ease);
  }
}

/* Selected — charcoal fill */
.seg-card.is-sel {
  background: var(--neutral-charcoal);
  border-color: var(--neutral-charcoal);
  .seg-label { color: #fff; }
  .seg-hint { color: rgba(255, 255, 255, 0.72); }
  .seg-tick { background: #fff; border-color: #fff; }
  .seg-tick::after { border-color: var(--neutral-charcoal); }
}

/* Keyboard focus ring on the visible card (input is sr-only) */
.seg-card:focus-within { outline: 2px solid var(--accent); outline-offset: 3px; }
</style>
