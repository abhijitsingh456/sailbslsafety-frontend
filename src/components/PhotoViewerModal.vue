<template>
  <Teleport to="body">
    <Transition name="viewer-fade">
      <div v-if="open" class="viewer-overlay" @click.self="$emit('close')" role="dialog"
        aria-modal="true" aria-label="Photo viewer">
        <div class="viewer-shell">

          <header class="viewer-header">
            <span class="viewer-counter">{{ index + 1 }} / {{ photos.length }}</span>
            <span class="viewer-label">{{ label }}</span>
            <button class="viewer-close" @click="$emit('close')" aria-label="Close">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor"
                  stroke-width="2.2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>

          <div class="viewer-body">
            <button v-if="photos.length > 1" class="nav-arrow" @click="prev"
              :disabled="index === 0" aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor"
                  stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="img-wrap">
              <Transition name="photo-slide" mode="out-in">
                <img :key="photos[index]" :src="resolvePhotoUrl(photos[index])"
                  :alt="`Photo ${index + 1}`" class="viewer-img" />
              </Transition>
            </div>
            <button v-if="photos.length > 1" class="nav-arrow" @click="next"
              :disabled="index === photos.length - 1" aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor"
                  stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <div v-if="photos.length > 1" class="viewer-dots">
            <button v-for="(_, i) in photos" :key="i" class="dot"
              :class="{ 'dot--active': i === index }"
              @click="index = i" :aria-label="`Photo ${i + 1}`" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { resolvePhotoUrl } from '../services/api.js'

const props = defineProps({
  open:    { type: Boolean, default: false },
  photos:  { type: Array,   default: () => [] },
  label:   { type: String,  default: 'Photos' },
  startAt: { type: Number,  default: 0 },
})
defineEmits(['close'])

const index = ref(0)
watch(() => props.open, v => { if (v) index.value = props.startAt })

function prev() { if (index.value > 0) index.value-- }
function next() { if (index.value < props.photos.length - 1) index.value++ }
</script>

<style scoped>
.viewer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 20, 0.88);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.viewer-shell {
  background: var(--surface);
  border: 1px solid var(--border-hover);
  border-radius: var(--r);
  box-shadow: var(--shadow);
  width: min(760px, 100%);
  max-height: 90dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1.5px solid var(--border);
  gap: 10px;
}
.viewer-counter { font-size: 12px; color: var(--text-3); font-weight: 600; }
.viewer-label { flex: 1; font-size: 13px; font-weight: 600; color: var(--text-2); }
.viewer-close {
  width: 28px; height: 28px;
  border-radius: var(--r-xs);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  cursor: pointer;
  display: grid; place-items: center;
  transition: background 140ms, border-color 140ms, color 140ms;
}
.viewer-close:hover {
  background: var(--red-dim);
  border-color: var(--red-border);
  color: var(--red);
}

.viewer-body {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 20px 14px; gap: 10px; min-height: 0; overflow: hidden;
}
.img-wrap { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 0; }
.viewer-img {
  max-width: 100%; max-height: 60dvh;
  object-fit: contain;
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
}

.nav-arrow {
  flex-shrink: 0; width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface); color: var(--text-2);
  cursor: pointer; display: grid; place-items: center;
  transition: background 140ms, border-color 140ms;
}
.nav-arrow:hover:not(:disabled) { border-color: var(--border-hover); background: var(--surface-2); }
.nav-arrow:disabled { opacity: 0.3; cursor: default; }

.viewer-dots { display: flex; justify-content: center; gap: 6px; padding: 10px 16px 14px; }
.dot {
  width: 7px; height: 7px; border-radius: 50%; border: none;
  background: var(--border-hover); cursor: pointer; padding: 0;
  transition: background 140ms, transform 140ms;
}
.dot--active { background: var(--accent); transform: scale(1.3); }

.viewer-fade-enter-active, .viewer-fade-leave-active { transition: opacity 160ms; }
.viewer-fade-enter-from, .viewer-fade-leave-to { opacity: 0; }
.photo-slide-enter-active, .photo-slide-leave-active { transition: opacity 120ms; }
.photo-slide-enter-from, .photo-slide-leave-to { opacity: 0; }
</style>
