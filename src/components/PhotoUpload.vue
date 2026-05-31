<template>
  <div class="photo-upload">
    <div
      class="drop-zone"
      :class="{ 'dz--active': dragging, 'dz--full': files.length >= max }"
      @dragenter.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @dragover.prevent
      @drop.prevent="onDrop"
      @click="files.length < max && $refs.input.click()"
    >
      <input
        ref="input"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        class="hidden-input"
        @change="onFileChange"
      />

      <template v-if="files.length < max">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          class="drop-icon">
          <rect x="3" y="3" width="18" height="18" rx="3"
            stroke="currentColor" stroke-width="1.5"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="drop-text">{{ dragging ? 'Drop here' : 'Click or drag' }}</span>
        <span class="drop-count">{{ files.length }}/{{ max }}</span>
      </template>
      <template v-else>
        <span class="drop-full">Max {{ max }} added</span>
      </template>
    </div>

    <div v-if="files.length" class="previews">
      <div v-for="(f, i) in files" :key="i" class="preview-item">
        <img :src="f.preview" :alt="`Photo ${i + 1}`" class="preview-img" />
        <button type="button" class="remove-btn" @click="remove(i)" :aria-label="`Remove photo ${i+1}`">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ max: { type: Number, default: 3 } })
const emit  = defineEmits(['update:files'])

const dragging = ref(false)
const files    = ref([])

function addFiles(rawFiles) {
  const toAdd = Array.from(rawFiles).slice(0, props.max - files.value.length)
  toAdd.forEach(f => files.value.push({ file: f, preview: URL.createObjectURL(f) }))
  emit('update:files', files.value.map(f => f.file))
}

function onFileChange(e) { addFiles(e.target.files); e.target.value = '' }
function onDrop(e)       { dragging.value = false; addFiles(e.dataTransfer.files) }

function remove(i) {
  URL.revokeObjectURL(files.value[i].preview)
  files.value.splice(i, 1)
  emit('update:files', files.value.map(f => f.file))
}

function reset() {
  files.value.forEach(f => URL.revokeObjectURL(f.preview))
  files.value = []
  emit('update:files', [])
}

defineExpose({ reset })
</script>

<style scoped>
.photo-upload { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.hidden-input { display: none; }

.drop-zone {
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1.5px dashed var(--border-hover);
  border-radius: var(--r-sm);
  padding: 8px 14px;
  cursor: pointer;
  background: var(--surface-2);
  color: var(--text-3);
  font-size: 12.5px;
  transition: border-color 140ms, background 140ms, color 140ms;
  min-width: 160px;
  height: 38px;
}
.drop-zone:hover:not(.dz--full) {
  border-color: var(--accent);
  background: var(--blue-dim);
  color: var(--accent);
}
.dz--active {
  border-color: var(--accent);
  background: #dbeafe;
  color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.dz--full { cursor: default; opacity: 0.55; }

.drop-icon { flex-shrink: 0; }
.drop-text { flex: 1; font-weight: 500; }
.drop-count { font-size: 11px; opacity: 0.7; }
.drop-full { font-size: 12px; }

.previews { display: flex; gap: 8px; flex-wrap: wrap; }

.preview-item {
  position: relative;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}

.preview-img {
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: var(--r-xs);
  border: 1.5px solid var(--border);
  display: block;
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--border-hover);
  background: var(--surface-3);
  color: var(--text-2);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 140ms, color 140ms, border-color 140ms;
  padding: 0;
}
.remove-btn:hover {
  background: var(--red-dim);
  color: var(--red);
  border-color: var(--red-border);
}
</style>
