<template>
  <article
    class="obs-card"
    :style="{ '--status-color': cfg.color }"
    role="button"
    tabindex="0"
    @click="$emit('view', obs)"
    @keydown.enter="$emit('view', obs)"
  >
    <div class="status-rail" :title="cfg.label" />

    <div class="card-body">

      <!-- Row 1: chips -->
      <div class="row-chips">
        <span class="chip chip-cat">{{ obs.category }}</span>
        <span class="chip chip-status"
          :style="{ color: cfg.color, background: cfg.dimBg, borderColor: cfg.border }">
          {{ cfg.label }}
        </span>
        <span v-if="obs.toBeIncludedInDispatcher === 'YES'" class="chip chip-disp">Dispatcher</span>
      </div>

      <!-- Row 2: date · dept · location (prominent) -->
      <div class="row-meta">
        <span class="meta-prom">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/>
            <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          {{ fmtDate(obs.inspectionDate) }}
        </span>
        <span class="meta-sep">·</span>
        <span class="meta-prom">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 21h18M4 21V8l8-5 8 5v13M9 21v-6h6v6"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ deptLabel }}
        </span>
        <template v-if="obs.location">
          <span class="meta-sep">·</span>
          <span class="meta-prom meta-loc">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s-7-6.8-7-12a7 7 0 0114 0c0 5.2-7 12-7 12z"
                stroke="currentColor" stroke-width="1.8"/>
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>
            </svg>
            {{ obs.location }}
          </span>
        </template>
      </div>

      <!-- Row 3: observation text -->
      <p class="obs-text">{{ obs.observation }}</p>

      <!-- Row 4: photos + action -->
      <div class="row-bottom" @click.stop>

        <div class="photos-area">
          <!-- Inspection photos -->
          <div class="photo-group">
            <span class="photo-group-label">Inspection Photos:</span>
            <template v-if="inspPhotos.length">
              <a
                v-for="(url, i) in inspPhotos"
                :key="i"
                :href="url"
                target="_blank"
                rel="noopener noreferrer"
                class="photo-link photo-link--insp"
                :title="`Inspection photo ${i + 1}`"
                @click.stop
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </a>
            </template>
            <span v-else class="no-photos">No photos</span>
          </div>

          <span class="group-sep" aria-hidden="true" />

          <!-- Complied photos -->
          <div class="photo-group">
            <span class="photo-group-label">Complied Photos:</span>
            <template v-if="compPhotos.length">
              <a
                v-for="(url, i) in compPhotos"
                :key="i"
                :href="url"
                target="_blank"
                rel="noopener noreferrer"
                class="photo-link photo-link--comp"
                :title="`Complied photo ${i + 1}`"
                @click.stop
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8 13l2.5 2.5L16 10" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </template>
            <span v-else class="no-photos">No photos</span>
          </div>
        </div>

        <button class="view-btn" @click.stop="$emit('view', obs)">
          View / Edit
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { statusConfig, getLabel, DEPARTMENTS } from '../constants/options.js'

const props = defineProps({ obs: { type: Object, required: true } })
defineEmits(['view'])

const cfg       = computed(() => statusConfig(props.obs.complianceStatus))
const deptLabel = computed(() => getLabel(DEPARTMENTS, props.obs.department))
const inspPhotos = computed(() => props.obs.observationPhotoUrl ?? [])
const compPhotos = computed(() => props.obs.compliedPhotoUrl ?? [])

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.obs-card {
  display: flex;
  height: 178px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: border-color 140ms, box-shadow 140ms, transform 110ms, background 140ms;
}
.obs-card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
  background: var(--surface-2);
}
.obs-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.status-rail {
  width: 4px;
  flex-shrink: 0;
  background: var(--status-color);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 11px 14px;
  gap: 7px;
  min-width: 0;
}

/* Row 1 — chips */
.row-chips {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: nowrap;
  min-width: 0;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  border: 1px solid transparent;
  flex-shrink: 0;
}
.chip-cat {
  background: var(--blue-dim);
  border-color: var(--blue-border);
  color: var(--blue);
}
.chip-disp {
  background: var(--amber-dim);
  border-color: var(--amber-border);
  color: var(--amber);
}

/* Row 2 — prominent meta */
.row-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.meta-prom {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  flex-shrink: 0;
}
.meta-loc {
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meta-sep {
  color: var(--text-3);
  font-size: 13px;
  flex-shrink: 0;
}

/* Row 3 — observation */
.obs-text {
  margin: 0;
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

/* Row 4 — photos + action */
.row-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.photos-area {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.photo-group {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.photo-group-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-3);
  white-space: nowrap;
  letter-spacing: 0.03em;
}

.photo-link {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: var(--r-xs);
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 130ms, border-color 130ms, transform 110ms;
}
.photo-link--insp {
  color: var(--blue);
  background: var(--blue-dim);
  border-color: var(--blue-border);
}
.photo-link--insp:hover {
  background: rgba(10,77,74,0.18);
  border-color: var(--blue);
  transform: scale(1.12);
}
.photo-link--comp {
  color: var(--green);
  background: var(--green-dim);
  border-color: var(--green-border);
}
.photo-link--comp:hover {
  background: rgba(31,93,61,0.18);
  border-color: var(--green);
  transform: scale(1.12);
}

.no-photos {
  font-size: 11px;
  color: var(--text-3);
  font-style: italic;
}

.group-sep {
  width: 1px;
  height: 18px;
  background: var(--border);
  flex-shrink: 0;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: var(--r-xs);
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text-2);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 140ms, border-color 140ms, color 140ms;
}
.view-btn:hover {
  background: var(--accent);
  border-color: #1a1410;
  color: #fffdf8;
}
</style>
