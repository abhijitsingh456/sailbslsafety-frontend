<template>
  <div class="ms" ref="root" :class="{ 'ms--open': open }">
    <button type="button" class="ms-trigger field-input"
      @click="open = !open" :aria-expanded="open">
      <span class="ms-label" :class="{ 'ms-label--placeholder': !modelValue.length }">
        <template v-if="modelValue.length">
          <span class="ms-tag" v-for="v in modelValue.slice(0, 2)" :key="v">
            {{ getLabel(options, v) }}
          </span>
          <span v-if="modelValue.length > 2" class="ms-more">+{{ modelValue.length - 2 }}</span>
        </template>
        <template v-else>{{ placeholder }}</template>
      </span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        :style="{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 150ms' }"
        aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <Transition name="ms-drop">
      <div v-if="open" class="ms-dropdown">
        <div class="ms-search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input ref="searchInput" type="text" v-model="search"
            :placeholder="`Search…`" class="ms-search-input" />
        </div>
        <div class="ms-options">
          <label v-for="opt in filtered" :key="opt.value" class="ms-option"
            :class="{ 'ms-option--checked': isChecked(opt.value) }">
            <input type="checkbox" :value="opt.value" :checked="isChecked(opt.value)"
              @change="toggle(opt.value)" class="ms-checkbox" />
            <span class="ms-check-box" aria-hidden="true">
              <svg v-if="isChecked(opt.value)" width="9" height="9" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="ms-opt-label">{{ opt.label }}</span>
          </label>
          <div v-if="!filtered.length" class="ms-empty">No matches</div>
        </div>
        <div v-if="modelValue.length" class="ms-footer">
          <button type="button" class="ms-clear" @click.stop="$emit('update:modelValue', [])">
            Clear selection
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { getLabel } from '../constants/options.js'

const props = defineProps({
  modelValue:  { type: Array,  default: () => [] },
  options:     { type: Array,  required: true },
  placeholder: { type: String, default: 'Select…' },
})
const emit = defineEmits(['update:modelValue'])

const open        = ref(false)
const search      = ref('')
const root        = ref(null)
const searchInput = ref(null)

const filtered = computed(() => {
  if (!search.value) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter(o => o.label.toLowerCase().includes(q))
})

function isChecked(v) { return props.modelValue.includes(v) }
function toggle(v) {
  const c = [...props.modelValue]
  const i = c.indexOf(v)
  if (i === -1) c.push(v); else c.splice(i, 1)
  emit('update:modelValue', c)
}

watch(open, v => { if (v) nextTick(() => searchInput.value?.focus()); else search.value = '' })

function onOutside(e) { if (root.value && !root.value.contains(e.target)) open.value = false }
onMounted(() => document.addEventListener('mousedown', onOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutside))
</script>

<style scoped>
.ms { position: relative; }

.ms-trigger {
  display: flex; align-items: center; justify-content: space-between; gap: 6px;
  width: 100%; cursor: pointer; text-align: left; min-height: 38px;
  padding-top: 6px; padding-bottom: 6px;
}
.ms--open .ms-trigger {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.ms-label { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; flex: 1; min-width: 0; }
.ms-label--placeholder { color: var(--text-3); }

.ms-tag {
  display: inline-flex; align-items: center; padding: 2px 7px;
  border-radius: 99px; background: var(--blue-dim);
  border: 1px solid var(--blue-border); color: var(--blue);
  font-size: 11px; font-weight: 600; white-space: nowrap;
}
.ms-more { font-size: 11px; color: var(--text-3); }

.ms-dropdown {
  position: absolute; top: calc(100% + 5px); left: 0; right: 0; z-index: 200;
  background: var(--surface-2); border: 1.5px solid var(--border-hover);
  border-radius: var(--r-sm); box-shadow: var(--shadow-sm); overflow: hidden;
}

.ms-search {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 11px; border-bottom: 1.5px solid var(--border); color: var(--text-3);
}
.ms-search-input {
  flex: 1; border: none; background: transparent;
  color: var(--text); font-size: 13px; outline: none;
}
.ms-search-input::placeholder { color: var(--text-3); }

.ms-options { max-height: 200px; overflow-y: auto; padding: 3px 0; }

.ms-option {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 11px; cursor: pointer; font-size: 13px; color: var(--text-2);
  transition: background 110ms;
}
.ms-option:hover { background: var(--surface-2); }
.ms-option--checked { color: var(--text); background: var(--blue-dim); }

.ms-checkbox { display: none; }
.ms-check-box {
  width: 15px; height: 15px; border-radius: 4px;
  border: 1.5px solid var(--border-hover); background: var(--surface-2);
  display: grid; place-items: center; flex-shrink: 0;
  transition: border-color 110ms, background 110ms; color: var(--accent);
}
.ms-option--checked .ms-check-box { border-color: var(--accent); background: var(--blue-dim); }
.ms-opt-label { flex: 1; }

.ms-empty { padding: 9px 11px; font-size: 12.5px; color: var(--text-3); text-align: center; }

.ms-footer {
  padding: 5px 11px; border-top: 1.5px solid var(--border);
  display: flex; justify-content: flex-end;
}
.ms-clear {
  background: transparent; border: none; color: var(--red);
  font-size: 11.5px; cursor: pointer; padding: 2px 0;
}
.ms-clear:hover { text-decoration: underline; }

.ms-drop-enter-active, .ms-drop-leave-active { transition: opacity 130ms, transform 130ms; }
.ms-drop-enter-from, .ms-drop-leave-to { opacity: 0; transform: translateY(-5px); }
</style>
