<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open && obs" class="modal-overlay" @click.self="close"
        role="dialog" aria-modal="true">
        <div class="modal-panel">

          <!-- Header -->
          <header class="modal-header">
            <div class="modal-header-left">
              <span class="obs-id">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3"
                    stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8 12h8M8 8h8M8 16h5" stroke="currentColor"
                    stroke-width="1.6" stroke-linecap="round"/>
                </svg>
                {{ obs.observationId ?? obs.id }}
              </span>
              <span class="status-badge"
                :style="{ color: cfg.color, background: cfg.dimBg, borderColor: cfg.border }">
                {{ cfg.label }}
              </span>
            </div>
            <div class="modal-header-right">
              <button v-if="!editing && !confirmDelete" class="btn-ghost btn-sm" @click="startEdit">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                Edit
              </button>

              <!-- Delete button -->
              <button v-if="!editing && !confirmDelete" class="btn-delete" @click="confirmDelete = true"
                title="Delete observation">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 11v6M14 11v6" stroke="currentColor"
                    stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>

              <button class="modal-close" @click="close" aria-label="Close">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor"
                    stroke-width="2.2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Delete confirmation bar -->
          <Transition name="confirm-slide">
            <div v-if="confirmDelete" class="confirm-bar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <span>Permanently delete this observation?</span>
              <div class="confirm-actions">
                <button class="btn-ghost btn-sm" @click="confirmDelete = false">Cancel</button>
                <button class="btn-delete-confirm" @click="doDelete" :disabled="deleting">
                  <svg v-if="deleting" class="spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor"
                      stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
                  </svg>
                  {{ deleting ? 'Deleting…' : 'Yes, Delete' }}
                </button>
              </div>
            </div>
          </Transition>

          <!-- Body -->
          <div class="modal-body">

            <!-- VIEW -->
            <template v-if="!editing">
              <div class="view-grid">
                <div class="view-field">
                  <span class="view-label">Inspection Date</span>
                  <span class="view-val">{{ fmtDate(obs.inspectionDate) }}</span>
                </div>
                <div class="view-field">
                  <span class="view-label">Category</span>
                  <span class="view-val">{{ obs.category }}</span>
                </div>
                <div class="view-field">
                  <span class="view-label">Department</span>
                  <span class="view-val">{{ getLabel(DEPARTMENTS, obs.department) }}</span>
                </div>
                <div class="view-field">
                  <span class="view-label">Sub-Department</span>
                  <span class="view-val">{{ obs.subDepartment || '—' }}</span>
                </div>
                <div class="view-field">
                  <span class="view-label">Location</span>
                  <span class="view-val">{{ obs.location || '—' }}</span>
                </div>
                <div class="view-field vf-full">
                  <span class="view-label">Observation</span>
                  <span class="view-val">{{ obs.observation }}</span>
                </div>
                <div class="view-field">
                  <span class="view-label">Compliance Status</span>
                  <span class="view-val" :style="{ color: cfg.color, fontWeight: 600 }">{{ cfg.label }}</span>
                </div>
                <div class="view-field">
                  <span class="view-label">Target Date</span>
                  <span class="view-val" :class="{ 'val-overdue': isOverdue }">
                    {{ fmtDate(obs.targetDate) }}
                    <span v-if="isOverdue" class="overdue-tag">Overdue</span>
                  </span>
                </div>
                <div class="view-field">
                  <span class="view-label">Dispatcher Report</span>
                  <span class="view-val">{{ obs.toBeIncludedInDispatcher === 'YES' ? 'Yes' : 'No' }}</span>
                </div>
                <div class="view-field vf-full">
                  <span class="view-label">Recommendations</span>
                  <span class="view-val">{{ obs.recommendations || '—' }}</span>
                </div>
              </div>

              <!-- Photos -->
              <div class="photos-section">
                <div class="photo-group-row">
                  <h4 class="photo-group-title blue">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="20" height="14" rx="2"
                        stroke="currentColor" stroke-width="1.8"/>
                      <circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.8"/>
                      <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1"
                        stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                    </svg>
                    Inspection Photos
                  </h4>
                  <div v-if="inspPhotos.length" class="photo-links-row">
                    <a v-for="(url, i) in inspPhotos" :key="i"
                      :href="url" target="_blank" rel="noopener noreferrer"
                      class="photo-thumb-link" :title="`Inspection photo ${i + 1}`">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="6" width="20" height="14" rx="2"
                          stroke="currentColor" stroke-width="1.8"/>
                        <circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.8"/>
                        <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1"
                          stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                      <span>Photo {{ i + 1 }}</span>
                    </a>
                  </div>
                  <span v-else class="no-photos-text">No photos</span>
                </div>

                <div class="photo-group-row">
                  <h4 class="photo-group-title green">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="20" height="14" rx="2"
                        stroke="currentColor" stroke-width="1.8"/>
                      <path d="M8 13l2.5 2.5L16 10" stroke="currentColor" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Complied Photos
                  </h4>
                  <div v-if="compPhotos.length" class="photo-links-row">
                    <a v-for="(url, i) in compPhotos" :key="i"
                      :href="url" target="_blank" rel="noopener noreferrer"
                      class="photo-thumb-link photo-thumb-link--comp" :title="`Complied photo ${i + 1}`">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="6" width="20" height="14" rx="2"
                          stroke="currentColor" stroke-width="1.8"/>
                        <path d="M8 13l2.5 2.5L16 10" stroke="currentColor" stroke-width="1.8"
                          stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>Photo {{ i + 1 }}</span>
                    </a>
                  </div>
                  <span v-else class="no-photos-text">No photos</span>
                </div>
              </div>
            </template>

            <!-- EDIT -->
            <template v-else>
              <form @submit.prevent="save" id="edit-form" class="edit-form">
                <div class="form-grid">
                  <div class="form-field">
                    <label class="field-label" for="e-date">Inspection Date</label>
                    <input id="e-date" type="date" class="field-input" v-model="form.inspectionDate" required />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-cat">Category</label>
                    <select id="e-cat" class="field-input" v-model="form.category" required>
                      <option value="">Select category</option>
                      <option v-for="o in CATEGORIES" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-dept">Department</label>
                    <select id="e-dept" class="field-input" v-model="form.department" required>
                      <option value="">Select department</option>
                      <option v-for="o in DEPARTMENTS" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-subdept">Sub-Department</label>
                    <input id="e-subdept" type="text" class="field-input"
                      v-model="form.subDepartment" placeholder="e.g. BF-2 / Bay-A" />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-loc">Location</label>
                    <input id="e-loc" type="text" class="field-input"
                      v-model="form.location" placeholder="e.g. Cast House" />
                  </div>
                  <div class="form-field vf-full">
                    <label class="field-label" for="e-obs">Observation</label>
                    <textarea id="e-obs" class="field-input" rows="3"
                      v-model="form.observation" />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-status">Compliance Status</label>
                    <select id="e-status" class="field-input" v-model="form.complianceStatus">
                      <option value="">Select status</option>
                      <option v-for="o in COMPLIANCE_STATUSES" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-target">Target Date</label>
                    <input id="e-target" type="date" class="field-input" v-model="form.targetDate" />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-disp">Dispatcher Report</label>
                    <select id="e-disp" class="field-input" v-model="form.toBeIncludedInDispatcher" required>
                      <option v-for="o in DISPATCHER_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                  </div>
                  <div class="form-field vf-full">
                    <label class="field-label" for="e-rec">Recommendations</label>
                    <textarea id="e-rec" class="field-input" rows="2" v-model="form.recommendations" />
                  </div>
                </div>

                <div class="edit-photos">
                  <div class="edit-photo-group">
                    <p class="section-title">Add Inspection Photos</p>
                    <PhotoUpload ref="inspUploadRef" :max="3" @update:files="newInspPhotos = $event" />
                  </div>
                  <div class="edit-photo-group">
                    <p class="section-title">Add Complied Photos</p>
                    <PhotoUpload ref="compUploadRef" :max="3" @update:files="newCompPhotos = $event" />
                  </div>
                </div>
              </form>
            </template>
          </div>

          <!-- Footer -->
          <footer class="modal-footer">
            <template v-if="editing">
              <div v-if="saveError" class="save-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ saveError }}
              </div>
              <div class="footer-actions">
                <button type="button" class="btn-ghost" @click="cancelEdit">Cancel</button>
                <button type="submit" form="edit-form" class="btn-primary" :disabled="saving">
                  <svg v-if="saving" class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor"
                      stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
                  </svg>
                  {{ saving ? 'Saving…' : 'Save Changes' }}
                </button>
              </div>
            </template>
            <template v-else>
              <span v-if="obs.updatedAt" class="updated-at">
                Updated {{ fmtDateTime(obs.updatedAt) }}
              </span>
              <button class="btn-ghost btn-sm" @click="close">Close</button>
            </template>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import PhotoUpload from './PhotoUpload.vue'
import { updateInspection, deleteInspection } from '../services/api.js'
import {
  statusConfig, getLabel,
  CATEGORIES, DEPARTMENTS, COMPLIANCE_STATUSES, DISPATCHER_OPTIONS,
} from '../constants/options.js'

const props = defineProps({ open: Boolean, obs: { type: Object, default: null } })
const emit  = defineEmits(['close', 'saved', 'deleted'])

const editing       = ref(false)
const saving        = ref(false)
const saveError     = ref('')
const confirmDelete = ref(false)
const deleting      = ref(false)
const newInspPhotos = ref([])
const newCompPhotos = ref([])
const inspUploadRef = ref(null)
const compUploadRef = ref(null)

const form = reactive({
  inspectionDate: '', category: '', department: '', subDepartment: '',
  location: '', observation: '', complianceStatus: '', targetDate: '',
  toBeIncludedInDispatcher: 'NO', recommendations: '',
})

const cfg = computed(() => statusConfig(props.obs?.complianceStatus))

const inspPhotos = computed(() => props.obs?.observationPhotoUrl ?? [])
const compPhotos = computed(() => props.obs?.compliedPhotoUrl ?? [])

const isOverdue = computed(() => {
  if (!props.obs?.targetDate) return false
  const s = props.obs.complianceStatus
  if (s === 'COMPLIED' || s === 'GOOD POINT') return false
  return new Date(props.obs.targetDate) < new Date()
})

watch(() => props.obs, obs => { if (obs) populateForm(obs) })
watch(() => props.open, open => { if (!open) { confirmDelete.value = false } })

function populateForm(obs) {
  Object.assign(form, {
    inspectionDate: obs.inspectionDate ?? '',
    category: obs.category ?? '',
    department: obs.department ?? '',
    subDepartment: obs.subDepartment ?? '',
    location: obs.location ?? '',
    observation: obs.observation ?? '',
    complianceStatus: obs.complianceStatus ?? '',
    targetDate: obs.targetDate ?? '',
    toBeIncludedInDispatcher: obs.toBeIncludedInDispatcher ?? 'NO',
    recommendations: obs.recommendations ?? '',
  })
}

function startEdit() { editing.value = true; saveError.value = '' }

function cancelEdit() {
  editing.value = false; saveError.value = ''
  populateForm(props.obs)
  inspUploadRef.value?.reset(); compUploadRef.value?.reset()
}

function close() {
  if (editing.value) cancelEdit()
  confirmDelete.value = false
  emit('close')
}

async function save() {
  saving.value = true; saveError.value = ''
  try {
    const id = props.obs.observationId ?? props.obs.id
    const { data } = await updateInspection(id, { ...form }, newInspPhotos.value, newCompPhotos.value)
    editing.value = false
    inspUploadRef.value?.reset(); compUploadRef.value?.reset()
    emit('saved', data)
  } catch (e) {
    saveError.value = e?.response?.data?.message ?? 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  deleting.value = true
  try {
    const id = props.obs.observationId ?? props.obs.id
    await deleteInspection(id)
    emit('deleted', id)
    emit('close')
  } catch (e) {
    confirmDelete.value = false
  } finally {
    deleting.value = false
  }
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtDateTime(d) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(26, 20, 16, 0.55);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: var(--surface);
  border: 1px solid var(--border-hover);
  border-radius: var(--r);
  box-shadow: var(--shadow);
  width: min(740px, 100%);
  max-height: 90dvh;
  display: flex; flex-direction: column; overflow: hidden;
}

/* Header */
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 18px; border-bottom: 1px solid var(--border); gap: 12px; flex-shrink: 0;
  background: var(--surface-2);
}
.modal-header-left { display: flex; align-items: center; gap: 10px; }
.obs-id {
  display: flex; align-items: center; gap: 5px;
  font-size: 11.5px; font-weight: 600; color: var(--text-3);
  font-family: monospace; letter-spacing: 0.03em;
}
.status-badge {
  font-size: 11px; font-weight: 600;
  padding: 3px 9px; border-radius: 99px; border: 1px solid transparent;
}
.modal-header-right { display: flex; align-items: center; gap: 7px; }
.btn-sm { padding: 6px 12px; font-size: 12px; }

.btn-delete {
  width: 30px; height: 30px; border-radius: var(--r-xs);
  border: 1px solid var(--red-border); background: var(--red-dim); color: var(--red);
  cursor: pointer; display: grid; place-items: center;
  transition: background 140ms, border-color 140ms;
}
.btn-delete:hover { background: rgba(239,83,80,0.22); border-color: var(--red); }

.modal-close {
  width: 30px; height: 30px; border-radius: var(--r-xs);
  border: 1px solid var(--border); background: transparent; color: var(--text-2);
  cursor: pointer; display: grid; place-items: center;
  transition: background 140ms, border-color 140ms, color 140ms;
}
.modal-close:hover { background: var(--red-dim); border-color: var(--red-border); color: var(--red); }

/* Delete confirmation bar */
.confirm-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 18px;
  background: var(--red-dim); border-bottom: 1px solid var(--red-border);
  color: var(--red); font-size: 13px; font-weight: 500;
  flex-shrink: 0;
}
.confirm-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.btn-delete-confirm {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: var(--r-xs); border: none;
  background: var(--red); color: #fff; font-size: 12.5px; font-weight: 600;
  cursor: pointer; transition: filter 140ms;
}
.btn-delete-confirm:hover:not(:disabled) { filter: brightness(1.1); }
.btn-delete-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

.confirm-slide-enter-active, .confirm-slide-leave-active { transition: opacity 150ms, transform 150ms; }
.confirm-slide-enter-from, .confirm-slide-leave-to { opacity: 0; transform: translateY(-6px); }

/* Body */
.modal-body { flex: 1; overflow-y: auto; padding: 20px 18px; }

/* View grid */
.view-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; margin-bottom: 20px; }
.view-field { display: flex; flex-direction: column; gap: 3px; }
.vf-full { grid-column: 1 / -1; }
.view-label {
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-3);
}
.view-val { font-size: 13.5px; color: var(--text); line-height: 1.5; }
.val-overdue { color: var(--red); }
.overdue-tag {
  display: inline-block; margin-left: 6px; font-size: 10px; font-weight: 700;
  padding: 1px 6px; border-radius: 99px;
  background: var(--red-dim); border: 1px solid var(--red-border); color: var(--red);
}

/* Photo sections */
.photos-section {
  border-top: 1px solid var(--border); padding-top: 16px;
  display: flex; flex-direction: column; gap: 14px;
}
.photo-group-row { display: flex; flex-direction: column; gap: 8px; }
.photo-group-title {
  display: flex; align-items: center; gap: 6px; margin: 0;
  font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
}
.photo-group-title.blue { color: var(--blue); }
.photo-group-title.green { color: var(--green); }

.photo-links-row { display: flex; gap: 8px; flex-wrap: wrap; }

.photo-thumb-link {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 12px; border-radius: var(--r-sm);
  border: 1px solid var(--blue-border); background: var(--blue-dim);
  color: var(--blue); font-size: 12px; font-weight: 500;
  text-decoration: none;
  transition: background 130ms, border-color 130ms, transform 110ms;
}
.photo-thumb-link:hover { background: rgba(10,77,74,0.18); border-color: var(--blue); transform: translateY(-1px); }
.photo-thumb-link--comp {
  border-color: var(--green-border); background: var(--green-dim); color: var(--green);
}
.photo-thumb-link--comp:hover { background: rgba(31,93,61,0.18); border-color: var(--green); }

.no-photos-text { font-size: 12.5px; color: var(--text-3); font-style: italic; }

/* Edit form */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.form-field { display: flex; flex-direction: column; }
.edit-photos {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  border-top: 1px solid var(--border); padding-top: 16px;
}
.edit-photo-group { display: flex; flex-direction: column; gap: 8px; }

/* Footer */
.modal-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px; border-top: 1px solid var(--border); gap: 12px; flex-shrink: 0;
  background: var(--surface-2);
}
.footer-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.updated-at { flex: 1; font-size: 11.5px; color: var(--text-3); }
.save-error { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--red); }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 160ms; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-panel, .modal-fade-leave-active .modal-panel {
  transition: transform 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
}
.modal-fade-enter-from .modal-panel { transform: scale(0.97) translateY(10px); }

@media (max-width: 540px) {
  .view-grid, .form-grid, .edit-photos { grid-template-columns: 1fr; }
  .vf-full { grid-column: 1; }
}
</style>
