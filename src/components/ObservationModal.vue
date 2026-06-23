<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="open && obs" class="modal-overlay" @click.self="close"
        role="dialog" aria-modal="true">
        <div class="modal-panel">

          <!-- Success overlay -->
          <Transition name="success-pop">
            <div v-if="saveSuccess" class="success-overlay">
              <div class="success-inner">
                <div class="tick-circle">
                  <svg class="tick-svg" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                    <circle class="tick-ring" cx="26" cy="26" r="24"
                      stroke="currentColor" stroke-width="2.5" fill="none"/>
                    <path class="tick-check" d="M14 26l9 9 15-15"
                      stroke="currentColor" stroke-width="3"
                      stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  </svg>
                </div>
                <p class="success-title">Observation Updated</p>
                <p class="success-sub">Photo uploads may take some time to reflect.</p>
              </div>
            </div>
          </Transition>

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
              <!-- Delete button: commented out until re-enabled
              <button v-if="!editing && !confirmDelete" class="btn-delete" @click="confirmDelete = true"
                title="Delete observation">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 11v6M14 11v6" stroke="currentColor"
                    stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
              -->

              <button class="modal-close" @click="close" aria-label="Close">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor"
                    stroke-width="2.2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Delete confirmation bar: commented out until re-enabled
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
          -->

          <!-- Body -->
          <div class="modal-body">

            <!-- EDIT -->
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
                    <label class="field-label" for="e-subdept">Other Department</label>
                    <input id="e-subdept" type="text" class="field-input"
                      v-model="form.subDepartment" placeholder="e.g. BF-2 / Bay-A" />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-loc">Location</label>
                    <input id="e-loc" type="text" class="field-input"
                      v-model="form.location" placeholder="e.g. Cast House" />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-status">Compliance Status <span style="color:var(--red)">*</span></label>
                    <select id="e-status" class="field-input" v-model="form.complianceStatus" required>
                      <option value="">Select status</option>
                      <option v-for="o in COMPLIANCE_STATUSES" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-target">Target Date</label>
                    <input id="e-target" type="date" class="field-input" v-model="form.targetDate" />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-discussed">Discussed With</label>
                    <input id="e-discussed" type="text" class="field-input"
                      v-model="form.discussedWith" placeholder="e.g. Shift In-charge" />
                  </div>
                  <div class="form-field">
                    <label class="field-label" for="e-disp">Dispatcher Report</label>
                    <select id="e-disp" class="field-input" v-model="form.toBeIncludedInDispatcher" required>
                      <option v-for="o in DISPATCHER_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
                    </select>
                  </div>
                  <div class="form-field vf-full">
                    <label class="field-label" for="e-obs">Observation</label>
                    <textarea id="e-obs" class="field-input" rows="2"
                      v-model="form.observation" />
                  </div>
                  <div class="form-field vf-full">
                    <label class="field-label" for="e-rec">Recommendations</label>
                    <textarea id="e-rec" class="field-input" rows="2" v-model="form.recommendations" />
                  </div>
                </div>

                <div class="edit-photos" :class="{ 'edit-photos--single': form.complianceStatus !== 'COMPLIED' }">
                  <div class="edit-photo-group">
                    <p class="section-title">Add Inspection Photos</p>
                    <PhotoUpload ref="inspUploadRef" :max="3" @update:files="newInspPhotos = $event" />
                  </div>
                  <div v-if="form.complianceStatus === 'COMPLIED'" class="edit-photo-group">
                    <p class="section-title">Add Complied Photos</p>
                    <PhotoUpload ref="compUploadRef" :max="3" @update:files="newCompPhotos = $event" />
                  </div>
                </div>
              </form>
          </div>

          <!-- Footer -->
          <footer class="modal-footer">
            <div v-if="saveError" class="save-error">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ saveError }}
            </div>
            <div class="footer-actions">
              <button type="button" class="btn-ghost" @click="close">Cancel</button>
              <button type="submit" form="edit-form" class="btn-primary" :disabled="saving">
                <svg v-if="saving" class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor"
                    stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
                </svg>
                {{ saving ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
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
import { logger } from '../utils/logger.js'

const log = logger('ObservationModal')

const props = defineProps({ open: Boolean, obs: { type: Object, default: null } })
const emit  = defineEmits(['close', 'saved', 'deleted'])

const editing       = ref(false)
const saving        = ref(false)
const saveError     = ref('')
const saveSuccess   = ref(false)
const confirmDelete = ref(false)
const deleting      = ref(false)
const newInspPhotos = ref([])
const newCompPhotos = ref([])
const inspUploadRef = ref(null)
const compUploadRef = ref(null)

const form = reactive({
  inspectionDate: '', category: '', department: '', subDepartment: '',
  location: '', observation: '', complianceStatus: '', targetDate: '',
  toBeIncludedInDispatcher: 'NO', recommendations: '', discussedWith: '',
})

const cfg = computed(() => statusConfig(props.obs?.complianceStatus))

watch(() => props.obs, obs => { if (obs) populateForm(obs) })
watch(() => props.open, open => {
  if (open) { editing.value = true; saveError.value = ''; saveSuccess.value = false }
  else { confirmDelete.value = false; saveSuccess.value = false }
})

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
    discussedWith: obs.discussedWith ?? '',
  })
}

function close() {
  editing.value = false
  saveError.value = ''
  confirmDelete.value = false
  populateForm(props.obs)
  inspUploadRef.value?.reset(); compUploadRef.value?.reset()
  emit('close')
}

async function save() {
  if (!form.complianceStatus) {
    saveError.value = 'Compliance Status is required.'
    log.warn('save blocked — compliance status empty')
    return
  }
  saving.value = true; saveError.value = ''; saveSuccess.value = false
  const id  = props.obs.observationId ?? props.obs.id
  const url = `/api/v1/inspection/${id}`
  log.info('saving observation', {
    observationId: id, complianceStatus: form.complianceStatus,
    department: form.department, category: form.category, inspectionDate: form.inspectionDate,
    newInspPhotos: newInspPhotos.value.length, newCompPhotos: newCompPhotos.value.length,
  })
  const t0 = Date.now()
  try {
    const { data, status } = await updateInspection(id, { ...form }, newInspPhotos.value, newCompPhotos.value)
    log.http('PUT', url, status, Date.now() - t0, { observationId: data?.observationId ?? data?.id })
    inspUploadRef.value?.reset(); compUploadRef.value?.reset()
    emit('saved', data)
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
      emit('close')
    }, 2200)
  } catch (e) {
    const status = e?.response?.status ?? 0
    const msg    = e?.response?.data?.message ?? 'Update failed. Please try again.'
    log.http('PUT', url, status, Date.now() - t0, { message: msg })
    saveError.value = msg
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  deleting.value = true
  const id  = props.obs.observationId ?? props.obs.id
  const url = `/api/v1/inspection/${id}`
  log.info('deleting observation', { observationId: id })
  const t0 = Date.now()
  try {
    const { status } = await deleteInspection(id)
    log.http('DELETE', url, status, Date.now() - t0)
    emit('deleted', id)
    emit('close')
  } catch (e) {
    const status = e?.response?.status ?? 0
    const msg    = e?.response?.data?.message ?? 'Delete failed.'
    log.http('DELETE', url, status, Date.now() - t0, { message: msg })
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
  position: relative;
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
.modal-body { flex: 1; overflow-y: auto; padding: 14px 18px; }

/* Success overlay */
.success-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border-radius: var(--r);
}
.success-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 24px;
  text-align: center;
}
.tick-circle {
  width: 96px;
  height: 96px;
  color: var(--green);
}
.tick-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.tick-ring {
  stroke-dasharray: 157;
  stroke-dashoffset: 157;
  animation: ring-draw 0.5s ease forwards;
}
.tick-check {
  stroke-dasharray: 36;
  stroke-dashoffset: 36;
  animation: check-draw 0.4s ease 0.45s forwards;
}
@keyframes ring-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes check-draw {
  to { stroke-dashoffset: 0; }
}
.success-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}
.success-sub {
  margin: 0;
  font-size: 13px;
  color: var(--text-3);
}

.success-pop-enter-active { transition: opacity 180ms ease; }
.success-pop-leave-active { transition: opacity 220ms ease; }
.success-pop-enter-from, .success-pop-leave-to { opacity: 0; }

/* Edit form */
.form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px 14px; margin-bottom: 14px; }
.form-field { display: flex; flex-direction: column; gap: 3px; }
.edit-photos {
  display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  border-top: 1px solid var(--border); padding-top: 12px;
}
.edit-photos--single { grid-template-columns: 1fr; }
.edit-photo-group { display: flex; flex-direction: column; gap: 6px; }


/* Footer */
.modal-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px; border-top: 1px solid var(--border); gap: 12px; flex-shrink: 0;
  background: var(--surface-2);
}
.footer-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.save-error { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--red); flex: 1; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 160ms; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .modal-panel, .modal-fade-leave-active .modal-panel {
  transition: transform 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
}
.modal-fade-enter-from .modal-panel { transform: scale(0.97) translateY(10px); }

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 540px) {
  .view-grid, .form-grid, .edit-photos { grid-template-columns: 1fr; }
  .vf-full { grid-column: 1; }
}
</style>
