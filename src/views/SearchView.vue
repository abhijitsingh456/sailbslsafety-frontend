<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">Inspection Observations</h1>
        <p class="page-sub">Search, filter, and manage all recorded observations.</p>
      </div>
      <RouterLink to="/inspection/create" class="btn-primary">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
        New Observation
      </RouterLink>
    </div>

    <!-- Filters -->
    <div class="glass-card filters-card">
      <button class="filters-toggle" @click="filtersOpen = !filtersOpen" type="button">
        <div class="toggle-left">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor"
              stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Filters</span>
          <span v-if="activeFilterCount" class="filter-badge">{{ activeFilterCount }}</span>
        </div>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          :style="{ transform: filtersOpen ? 'rotate(180deg)' : '', transition: 'transform 180ms' }">
          <path d="M6 9l6 6 6-6" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <Transition name="slide-down">
        <div v-if="filtersOpen" class="filters-body">
          <div class="filters-grid">

            <!-- Row 1 -->
            <div class="filter-field">
              <label class="field-label">Department</label>
              <MultiSelect v-model="filters.department" :options="DEPARTMENTS"
                placeholder="All departments" />
            </div>

            <div class="filter-field">
              <label class="field-label">Category</label>
              <MultiSelect v-model="filters.category" :options="CATEGORIES"
                placeholder="All categories" />
            </div>

            <div class="filter-field">
              <label class="field-label">Compliance Status</label>
              <MultiSelect v-model="filters.complianceStatus" :options="COMPLIANCE_STATUSES"
                placeholder="All statuses" />
            </div>

            <!-- Updated On: commented out until backend implements it
            <div class="filter-field">
              <label class="field-label">Updated On</label>
              <input type="date" class="field-input" v-model="filters.updatedOn" />
            </div>
            -->

            <!-- Row 2 -->
            <div class="filter-field">
              <label class="field-label">Inspection Date From</label>
              <input type="date" class="field-input" v-model="filters.inspectionStartDate" />
            </div>

            <div class="filter-field">
              <label class="field-label">Inspection Date To</label>
              <input type="date" class="field-input" v-model="filters.inspectionEndDate" />
            </div>

            <div class="filter-field">
              <label class="field-label">Target Date From</label>
              <input type="date" class="field-input" v-model="filters.targetStartDate" />
            </div>

            <div class="filter-field">
              <label class="field-label">Target Date To</label>
              <input type="date" class="field-input" v-model="filters.targetEndDate" />
            </div>

          </div>

          <div class="filter-actions">
            <button type="button" class="btn-ghost btn-sm" @click="clearFilters">Clear All</button>
            <button type="button" class="btn-primary btn-sm" @click="doSearch">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Search
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Export reports row -->
    <div class="export-row">
      <span class="export-label">Export</span>
      <div class="export-buttons">
        <button type="button" class="export-btn export-btn--word"
          :disabled="!!reportLoading" @click="onDownload('word', 'docx')"
          title="Download Word report">
          <svg v-if="reportLoading === 'word'" class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
              stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M14 2v6h6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M8 13l1.5 5L11 14l1.5 4L14 13" stroke="currentColor"
              stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Word</span>
        </button>

        <!-- PowerPoint with scope picker -->
        <div class="ppt-wrap" v-click-outside="() => pptPickerOpen = false">
          <button type="button" class="export-btn export-btn--ppt"
            :disabled="!!reportLoading" @click="pptPickerOpen = !pptPickerOpen"
            title="Download PowerPoint report">
            <svg v-if="reportLoading === 'powerpoint'" class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="13" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3 8h18" stroke="currentColor" stroke-width="1.6"/>
              <path d="M10 21h4M12 17v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              <path d="M8 13l3-2 2 1.5L17 9" stroke="currentColor" stroke-width="1.6"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>PowerPoint</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              :style="{ transform: pptPickerOpen ? 'rotate(180deg)' : '', transition: 'transform 150ms' }">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <Transition name="picker-drop">
            <div v-if="pptPickerOpen" class="ppt-picker">
              <button class="picker-option" @click="onDownload('powerpoint', 'pptx', 'dispatcher')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                For Dispatcher Meeting
                <span class="picker-hint">Only dispatcher-flagged</span>
              </button>
              <button class="picker-option" @click="onDownload('powerpoint', 'pptx', 'all')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                All Observations
                <span class="picker-hint">Every result in this search</span>
              </button>
            </div>
          </Transition>
        </div>

        <button type="button" class="export-btn export-btn--excel"
          :disabled="!!reportLoading" @click="onDownload('excel', 'xlsx')"
          title="Download Excel report">
          <svg v-if="reportLoading === 'excel'" class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
            <path d="M3 9h18M3 14h18M9 4v16M15 4v16" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span>Excel</span>
        </button>
      </div>
      <span v-if="reportError" class="export-error">{{ reportError }}</span>
    </div>

    <!-- Loading (initial) -->
    <div v-if="loading && !results.length" class="state-block">
      <div class="spinner" />
      <span>Loading observations…</span>
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && hasSearched && !results.length" class="state-block">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="8" stroke="var(--text-3)" stroke-width="1.4"/>
        <path d="M16.5 16.5L21 21" stroke="var(--text-3)" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
      <p class="state-title">No observations found</p>
      <p class="state-sub">Try adjusting the filters.</p>
    </div>

    <!-- Prompt -->
    <div v-else-if="!hasSearched && !loading" class="state-block">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-3)"
          stroke-width="1.4" stroke-linecap="round"/>
      </svg>
      <p class="state-title">Use filters above to search</p>
      <p class="state-sub">Or load all observations at once.</p>
      <button type="button" class="btn-primary btn-sm" style="margin-top:12px" @click="doSearch">
        Load All Observations
      </button>
    </div>

    <!-- Results -->
    <template v-else>
      <div class="results-header">
        <span class="results-count">
          Showing <strong>{{ results.length }}</strong>
          {{ totalElements > results.length ? ` of ${totalElements}` : '' }}
          observation(s)
        </span>
        <div v-if="loading" class="inline-spinner" />
      </div>

      <div class="results-scroll">
        <div class="results-list">
          <ObservationCard
            v-for="obs in results"
            :key="obs.observationId ?? obs.id"
            :obs="obs"
            @view="openModal"
          />
        </div>
      </div>

      <div v-if="hasMore" class="load-more-wrap">
        <button type="button" class="btn-ghost load-more-btn" :disabled="loading" @click="loadMore">
          <svg v-if="loading" class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor"
              stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
          </svg>
          {{ loading ? 'Loading…' : `Load More (${totalElements > results.length ? totalElements - results.length + ' remaining' : 'next page'})` }}
        </button>
      </div>
    </template>
  </div>

  <ObservationModal :open="modal.open" :obs="modal.obs"
    @close="modal.open = false" @saved="onSaved" @deleted="onDeleted" />

</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import ObservationCard from '../components/ObservationCard.vue'
import ObservationModal from '../components/ObservationModal.vue'
import MultiSelect from './MultiSelect.vue'
import * as XLSX from 'xlsx'
import { searchInspections, downloadReport } from '../services/api.js'
import { CATEGORIES, DEPARTMENTS, COMPLIANCE_STATUSES } from '../constants/options.js'
import { useToast } from '../composables/useToasts.js'

const toast = useToast()

// Custom directive to close PPT picker on outside click
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) { document.removeEventListener('click', el._clickOutside) },
}

const PAGE_SIZE = 25

const filtersOpen = ref(true)
const hasSearched = ref(false)
const loading     = ref(false)

const filters = reactive({
  department: [], category: [], complianceStatus: [],
  inspectionStartDate: '', inspectionEndDate: '',
  targetStartDate: '', targetEndDate: '',
  // updatedOn: '', // commented out until backend implements it
})

const activeFilterCount = computed(() => {
  let n = 0
  if (filters.department.length)       n++
  if (filters.category.length)         n++
  if (filters.complianceStatus.length) n++
  if (filters.inspectionStartDate || filters.inspectionEndDate) n++
  if (filters.targetStartDate || filters.targetEndDate)         n++
  return n
})

function clearFilters() {
  Object.assign(filters, {
    department: [], category: [], complianceStatus: [],
    inspectionStartDate: '', inspectionEndDate: '',
    targetStartDate: '', targetEndDate: '',
  })
}

const results       = ref([])
const page          = ref(0)
const totalElements = ref(0)
const hasMore       = ref(false)   // true when backend signals more pages exist

function buildParams(p = 0) {
  const params = { page: p, size: PAGE_SIZE }
  if (filters.department.length)       params.department          = filters.department
  if (filters.category.length)         params.category            = filters.category
  if (filters.complianceStatus.length) params.complianceStatus    = filters.complianceStatus
  if (filters.inspectionStartDate)     params.inspectionStartDate = filters.inspectionStartDate
  if (filters.inspectionEndDate)       params.inspectionEndDate   = filters.inspectionEndDate
  if (filters.targetStartDate)         params.targetStartDate     = filters.targetStartDate
  if (filters.targetEndDate)           params.targetEndDate       = filters.targetEndDate
  return params
}

function parsePage(data) {
  const content = data.content ?? []
  // Determine if more pages exist using any signal the backend provides:
  // data.last === false  (Spring Page)
  // data.totalPages > currentPage + 1
  // data.totalElements > loaded so far (after appending)
  // Fallback: a full page means there might be more
  let more = false
  if (typeof data.last === 'boolean') {
    more = !data.last
  } else if (Number.isFinite(data.totalPages) && Number.isFinite(data.number)) {
    more = data.number < data.totalPages - 1
  } else if (Number.isFinite(data.totalElements)) {
    more = results.value.length + content.length < data.totalElements
  } else {
    more = content.length === PAGE_SIZE
  }
  return { content, more }
}

async function doSearch() {
  loading.value = true; hasSearched.value = true; page.value = 0
  results.value = []; hasMore.value = false
  const flashId = toast.loading('Searching observations…')
  try {
    const { data } = await searchInspections(buildParams(0))
    const { content, more } = parsePage(data)
    results.value    = content
    hasMore.value    = more
    totalElements.value = Number.isFinite(data.totalElements) ? data.totalElements : content.length
    if (content.length === 0) {
      toast.resolve(flashId, 'info', 'No matching observations.')
    } else {
      const total    = totalElements.value
      const moreNote = total > content.length ? ` of ${total}` : ''
      toast.resolve(flashId, 'success',
        `Found ${content.length}${moreNote} observation${total === 1 ? '' : 's'}.`)
    }
  } catch (e) {
    results.value = []; totalElements.value = 0; hasMore.value = false
    const msg = e?.response?.data?.message ?? 'Search failed. Please try again.'
    toast.resolve(flashId, 'error', msg)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  loading.value = true
  const nextPage = page.value + 1
  const flashId = toast.loading('Loading more…')
  try {
    const { data } = await searchInspections(buildParams(nextPage))
    const { content, more } = parsePage(data)
    results.value.push(...content)
    page.value  = nextPage
    hasMore.value = more
    if (Number.isFinite(data.totalElements)) totalElements.value = data.totalElements
    toast.resolve(flashId, 'success', `Loaded ${content.length} more.`)
  } catch (e) {
    const msg = e?.response?.data?.message ?? 'Failed to load more.'
    toast.resolve(flashId, 'error', msg)
  } finally {
    loading.value = false
  }
}

/* ── Report download ── */
const reportLoading = ref('')   // '' | 'word' | 'powerpoint' | 'excel'
const reportError   = ref('')
const pptPickerOpen = ref(false)

const REPORT_MIME = {
  word:       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  powerpoint: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  excel:      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const REPORT_LABEL = { word: 'Word', powerpoint: 'PowerPoint', excel: 'Excel' }

const PYTHONANYWHERE_ENDPOINTS = {
  word:       'https://sailbslsafety2.pythonanywhere.com/generate-report',
  powerpoint: 'https://sailbslsafety2.pythonanywhere.com/generate-ppt',
}

// scope: 'all' | 'dispatcher' (only used for powerpoint)
async function onDownload(format, ext, scope = 'all') {
  pptPickerOpen.value = false
  if (!results.value.length) {
    toast.show('warning', 'No observations loaded — run a search first.')
    return
  }
  reportLoading.value = format
  reportError.value = ''
  const scopeLabel = scope === 'dispatcher' ? ' (Dispatcher)' : ''
  const flashId = toast.loading(`Preparing ${REPORT_LABEL[format]}${scopeLabel} report…`)
  try {
    let blob
    if (PYTHONANYWHERE_ENDPOINTS[format]) {
      const payload = scope === 'dispatcher'
        ? results.value.filter(o => o.toBeIncludedInDispatcher === 'YES')
        : results.value
      if (payload.length === 0) {
        toast.resolve(flashId, 'info', 'No dispatcher-flagged observations in this search.')
        return
      }
      const res = await fetch(PYTHONANYWHERE_ENDPOINTS[format], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: payload }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }
      blob = await res.blob()
    } else if (format === 'excel') {
      const rows = results.value.map(o => ({
        'Observation ID':        o.observationId ?? o.id ?? '',
        'Inspection Date':       o.inspectionDate ?? '',
        'Department':            o.department ?? '',
        'Sub-Department':        o.subDepartment ?? '',
        'Location':              o.location ?? '',
        'Category':              o.category ?? '',
        'Observation':           o.observation ?? '',
        'Recommendations':       o.recommendations ?? '',
        'Compliance Status':     o.complianceStatus ?? '',
        'Target Date':           o.targetDate ?? '',
        'Include in Dispatcher': o.toBeIncludedInDispatcher ?? '',
        'Updated At':            o.updatedAt ?? '',
      }))
      const ws = XLSX.utils.json_to_sheet(rows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Observations')
      const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
      blob = new Blob([buf], { type: REPORT_MIME['excel'] })
    } else {
      const { data } = await downloadReport(format, buildParams(0))
      blob = new Blob([data], { type: REPORT_MIME[format] })
    }
    const url = URL.createObjectURL(blob)
    const a   = document.createElement('a')
    const ts  = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `bsl-inspection-report-${ts}${scope === 'dispatcher' ? '-dispatcher' : ''}.${ext}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast.resolve(flashId, 'success', `${REPORT_LABEL[format]}${scopeLabel} report downloaded.`)
  } catch (e) {
    const msg = e?.message ?? e?.response?.data?.message ?? 'Report download failed.'
    reportError.value = msg
    toast.resolve(flashId, 'error', msg)
  } finally {
    reportLoading.value = ''
  }
}

const modal = reactive({ open: false, obs: null })
function openModal(obs) { modal.obs = obs; modal.open = true }
function onSaved(updated) {
  const id = updated.observationId ?? updated.id
  const idx = results.value.findIndex(r => (r.observationId ?? r.id) === id)
  if (idx !== -1) results.value[idx] = updated
  modal.obs = updated
}

function onDeleted(id) {
  results.value = results.value.filter(r => (r.observationId ?? r.id) !== id)
  totalElements.value = Math.max(0, totalElements.value - 1)
  modal.open = false
}
</script>

<style scoped>
.page-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 18px; gap: 12px; flex-wrap: wrap;
}

/* Filters */
.filters-card { margin-bottom: 18px; }

.filters-toggle {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 13px 18px; background: transparent;
  border: none; cursor: pointer; color: var(--text);
  font-size: 13.5px; font-weight: 600;
}
.toggle-left { display: flex; align-items: center; gap: 8px; }
.filter-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 19px; height: 19px; padding: 0 5px; border-radius: 99px;
  background: var(--accent); color: #fff; font-size: 10.5px; font-weight: 700;
}

.filters-body { padding: 0 18px 16px; border-top: 1.5px solid var(--border); }

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding-top: 14px;
}

.filter-field { display: flex; flex-direction: column; gap: 5px; }

.filter-actions {
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
  margin-top: 14px; padding-top: 12px; border-top: 1.5px solid var(--border);
}
.btn-sm { padding: 7px 15px; font-size: 12.5px; }

.slide-down-enter-active, .slide-down-leave-active { transition: opacity 160ms, transform 160ms; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-6px); }

/* States */
.state-block {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 56px 20px; text-align: center;
}
.state-title { margin: 0; font-size: 15px; font-weight: 600; color: var(--text-2); }
.state-sub   { margin: 0; font-size: 13px; color: var(--text-3); }

.spinner {
  width: 30px; height: 30px; border-radius: 50%;
  border: 2.5px solid var(--border); border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}
.inline-spinner {
  width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid var(--border); border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}

/* Results */
.results-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
}
.results-count { font-size: 13px; color: var(--text-3); }
.results-count strong { color: var(--text-2); }

/* ── Scrollable results box ── */
.results-scroll {
  background: var(--surface);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--r);
  box-shadow: var(--shadow);
  padding: 12px;
  max-height: 78vh;
  overflow-y: auto;
  position: relative;
}
.results-scroll::before {
  content: '';
  position: absolute;
  top: 8px; right: 8px;
  width: 10px; height: 10px;
  border-top: 1.5px solid var(--accent);
  border-right: 1.5px solid var(--accent);
  pointer-events: none;
  opacity: 0.55;
  z-index: 1;
}
.results-list { display: flex; flex-direction: column; gap: 9px; }

.load-more-wrap { display: flex; justify-content: center; margin-top: 18px; }
.load-more-btn { min-width: 240px; justify-content: center; gap: 7px; }

/* ── Export row ── */
.export-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.export-label {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.export-label::before {
  content: '';
  width: 14px;
  height: 1.5px;
  background: var(--accent);
}
.export-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.export-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: var(--r-sm);
  border: 1.5px solid #1a1410;
  background: var(--surface);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  color: var(--text);
  box-shadow: 2px 2px 0 #1a1410;
  transition: transform 110ms, box-shadow 110ms, background 140ms, color 140ms;
}
.export-btn:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 #1a1410;
  color: #fffdf8;
}
.export-btn:active:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #1a1410;
}
.export-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.export-btn--word:hover:not(:disabled)  { background: #185abd; }
.export-btn--ppt:hover:not(:disabled)   { background: #c43e1c; }
.export-btn--excel:hover:not(:disabled) { background: #107c41; }
.export-btn--word  svg:not(.spin) { color: #185abd; }
.export-btn--ppt   svg:not(.spin) { color: #c43e1c; }
.export-btn--excel svg:not(.spin) { color: #107c41; }
.export-btn:hover svg { color: #fffdf8; }

/* PPT scope picker */
.ppt-wrap { position: relative; }

.ppt-picker {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 200;
  background: var(--surface);
  border: 1.5px solid var(--border-strong);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow);
  min-width: 220px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.picker-option {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  transition: background 130ms;
  flex-wrap: wrap;
}
.picker-option:hover { background: var(--surface-2); }
.picker-option + .picker-option { border-top: 1px solid var(--border); }
.picker-hint {
  display: block;
  width: 100%;
  padding-left: 22px;
  font-size: 11px;
  font-weight: 400;
  color: var(--text-3);
  margin-top: -4px;
}

.picker-drop-enter-active, .picker-drop-leave-active { transition: opacity 130ms, transform 130ms; }
.picker-drop-enter-from, .picker-drop-leave-to { opacity: 0; transform: translateY(-4px); }

.export-error {
  font-size: 12px;
  color: var(--red);
  margin-left: auto;
  font-weight: 600;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

@media (max-width: 840px) { .filters-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 620px) { .filters-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 420px) { .filters-grid { grid-template-columns: 1fr; } }
</style>
