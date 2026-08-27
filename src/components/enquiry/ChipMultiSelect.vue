<template>
  <fieldset class="chips">
    <legend class="sr-only">{{ legend }}</legend>

    <label
      v-for="o in allChips"
      :key="o"
      class="chip"
      :class="{ 'is-sel': modelValue.includes(o) }"
    >
      <input type="checkbox" class="sr-only" :checked="modelValue.includes(o)" @change="toggle(o)" />
      <span>{{ o }}</span>
    </label>

    <form class="chip-add" @submit.prevent="addCustom">
      <input
        v-model="draft"
        type="text"
        class="chip-add-input"
        :placeholder="addPlaceholder"
        aria-label="Tambah ruang lain"
        maxlength="60"
      />
      <button type="submit" class="chip-add-btn" aria-label="Tambah ruang" :disabled="!draft.trim()">+</button>
    </form>
  </fieldset>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },     // preset labels
  legend: { type: String, default: '' },
  addPlaceholder: { type: String, default: 'Tambah lainnya…' },
})
const emit = defineEmits(['update:modelValue'])

const draft = ref('')

// Preset options plus any custom values already chosen (so they render as selected chips too).
const allChips = computed(() => {
  const extras = props.modelValue.filter((v) => !props.options.includes(v))
  return [...props.options, ...extras]
})

function toggle(value) {
  const set = new Set(props.modelValue)
  set.has(value) ? set.delete(value) : set.add(value)
  emit('update:modelValue', [...set])
}

function addCustom() {
  const v = draft.value.trim()
  if (!v) return
  if (!props.modelValue.includes(v)) emit('update:modelValue', [...props.modelValue, v])
  draft.value = ''
}
</script>

<style lang="scss" scoped>
.chips {
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 9px 16px;
  background: var(--neutral-white);
  border: 1px solid var(--rule);
  border-radius: 999px;
  cursor: pointer;
  font: var(--weight-regular) 14px/1 var(--font-ui);
  color: var(--ink);
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease), color var(--dur) var(--ease);

  &:hover { border-color: var(--ink); }
  &:focus-within { outline: 2px solid var(--accent); outline-offset: 3px; }

  &.is-sel {
    background: var(--neutral-charcoal);
    border-color: var(--neutral-charcoal);
    color: #fff;
    font-weight: var(--weight-medium);
  }
}

.chip-add {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  border: 1px dashed var(--rule-strong);
  border-radius: 999px;
  padding: 0 6px 0 14px;
}
.chip-add-input {
  border: 0;
  background: transparent;
  font: var(--weight-regular) 14px/1 var(--font-ui);
  color: var(--ink);
  width: 150px;
  padding: 10px 4px;
  &:focus { outline: none; }
}
.chip-add-btn {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: var(--neutral-charcoal);
  color: #fff;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: opacity var(--dur) var(--ease);
  &:disabled { opacity: 0.35; cursor: default; }
}
</style>
