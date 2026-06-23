<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">New Inspection Observation</h1>
        <p class="page-sub">Record a safety finding and submit supporting photos.</p>
      </div>
    </div>

    <form @submit.prevent="submit" novalidate>
      <div class="glass-card form-card">

        <!-- Row 1: date · category · department -->
        <div class="grid-3">
          <div class="field">
            <label class="field-label" for="inspDate">Inspection Date <span class="req">*</span></label>
            <input id="inspDate" type="date" class="field-input"
              v-model="form.inspectionDate" required :max="today" />
            <span v-if="errors.inspectionDate" class="ferr">{{ errors.inspectionDate }}</span>
          </div>
          <div class="field">
            <label class="field-label" for="category">Category <span class="req">*</span></label>
            <select id="category" class="field-input" v-model="form.category" required>
              <option value="">Select category</option>
              <option v-for="o in CATEGORIES" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <span v-if="errors.category" class="ferr">{{ errors.category }}</span>
          </div>
          <div class="field">
            <label class="field-label" for="department">Department <span class="req">*</span></label>
            <select id="department" class="field-input" v-model="form.department" required>
              <option value="">Select department</option>
              <option v-for="o in DEPARTMENTS" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <span v-if="errors.department" class="ferr">{{ errors.department }}</span>
          </div>
        </div>

        <!-- Row 2: other department · location · target date -->
        <div class="grid-3">
          <div class="field">
            <label class="field-label" for="subDepartment">
              Other Department
              <span v-if="!isOtherDept" class="hint-soft">select Others above</span>
            </label>
            <input id="subDepartment" type="text" class="field-input"
              v-model="form.subDepartment"
              :disabled="!isOtherDept"
              :placeholder="isOtherDept ? 'Specify the department' : '—'" />
          </div>
          <div class="field">
            <label class="field-label" for="location">Location</label>
            <input id="location" type="text" class="field-input"
              v-model="form.location" placeholder="e.g. Cast House" />
          </div>
          <div class="field">
            <label class="field-label" for="targetDate">Target Date</label>
            <input id="targetDate" type="date" class="field-input"
              v-model="form.targetDate" :min="today" />
          </div>
        </div>

        <!-- Row 3: observation (full width) -->
        <div class="field">
          <label class="field-label" for="observation">Observation</label>
          <textarea id="observation" class="field-input obs-area"
            v-model="form.observation"
            placeholder="Describe the unsafe act / condition observed…" />
        </div>

        <!-- Row 4: compliance · dispatcher · discussed with -->
        <div class="grid-3">
          <div class="field">
            <label class="field-label" for="status">Compliance Status <span class="req">*</span></label>
            <select id="status" class="field-input" v-model="form.complianceStatus" required>
              <option value="">Select status</option>
              <option v-for="o in COMPLIANCE_STATUSES" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <span v-if="errors.complianceStatus" class="ferr">{{ errors.complianceStatus }}</span>
          </div>
          <div class="field">
            <label class="field-label" for="discussedWith">Discussed With</label>
            <input id="discussedWith" type="text" class="field-input"
              v-model="form.discussedWith" placeholder="e.g. Shift In-charge" />
          </div>
          <div class="field">
            <label class="field-label" for="dispatcher">Include in Dispatcher Report <span class="req">*</span></label>
            <select id="dispatcher" class="field-input" v-model="form.toBeIncludedInDispatcher" required>
              <option v-for="o in DISPATCHER_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
          </div>
        </div>

        <!-- Row 5: recommendations (full width) -->
        <div class="field">
          <label class="field-label" for="recommendations">Recommendations</label>
          <textarea id="recommendations" class="field-input rec-area"
            v-model="form.recommendations"
            placeholder="Corrective and preventive recommendations…" />
        </div>

        <!-- Divider -->
        <div class="section-divider">
          <span>Supporting Photos</span>
        </div>

        <!-- Row 6: photos -->
        <div class="grid-2">
          <div class="field">
            <label class="field-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="6" width="20" height="14" rx="2"
                  stroke="currentColor" stroke-width="1.8"/>
                <circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M8 6V5a2 2 0 012-2h4a2 2 0 012 2v1"
                  stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              Inspection Photos <span class="hint-soft">max 3</span>
            </label>
            <PhotoUpload ref="inspUploadRef" :max="3" @update:files="inspection_photos = $event" />
          </div>
          <div class="field">
            <label class="field-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="2" y="6" width="20" height="14" rx="2"
                  stroke="currentColor" stroke-width="1.8"/>
              </svg>
              Complied Photos
              <span v-if="!isComplied" class="hint-soft">status must be Complied</span>
              <span v-else class="hint-soft">max 3</span>
            </label>
            <PhotoUpload ref="compUploadRef" :max="3"
              :disabled="!isComplied"
              disabled-hint="Available when status is Complied"
              @update:files="complied_photos = $event" />
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <div class="action-btns">
            <button type="button" class="btn-ghost" @click="resetForm">Reset</button>
            <button type="submit" class="btn-primary" :disabled="submitting">
              <svg v-if="submitting" class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor"
                  stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
              </svg>
              {{ submitting ? 'Submitting…' : 'Submit Observation' }}
            </button>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import PhotoUpload from '../components/PhotoUpload.vue'
import { createInspection } from '../services/api.js'
import { CATEGORIES, DEPARTMENTS, COMPLIANCE_STATUSES, DISPATCHER_OPTIONS } from '../constants/options.js'
import { useToast } from '../composables/useToasts.js'
import { logger } from '../utils/logger.js'

const log = logger('CreateView')

const toast = useToast()
const today = new Date().toISOString().split('T')[0]

const inspUploadRef    = ref(null)
const compUploadRef    = ref(null)
const inspection_photos = ref([])
const complied_photos   = ref([])
const submitting       = ref(false)
const errors           = reactive({})

const form = reactive({
  inspectionDate: today,
  category: '', department: '', subDepartment: '', location: '',
  observation: '', complianceStatus: '', targetDate: '',
  toBeIncludedInDispatcher: 'YES', recommendations: '', discussedWith: '',
})

/* ── Conditional field gating ── */
const isOtherDept = computed(() => form.department === 'OTHERS')
const isComplied  = computed(() => form.complianceStatus === 'COMPLIED')

// When user switches *away* from "Others", clear whatever they typed.
watch(isOtherDept, (now) => {
  if (!now) form.subDepartment = ''
})

// When user switches *away* from "COMPLIED", wipe complied photos + previews.
watch(isComplied, (now) => {
  if (!now) {
    complied_photos.value = []
    compUploadRef.value?.reset()
  }
})

function validate() {
  const e = {}
  if (!form.inspectionDate)            e.inspectionDate            = 'Required'
  if (!form.category)                  e.category                  = 'Required'
  if (!form.department)                e.department                = 'Required'
  if (!form.complianceStatus)          e.complianceStatus          = 'Required'
  if (!form.toBeIncludedInDispatcher)  e.toBeIncludedInDispatcher  = 'Required'
  Object.assign(errors, e)
  Object.keys(errors).forEach(k => { if (!e[k]) delete errors[k] })
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) {
    toast.error('Please fill in all required fields.')
    return
  }
  submitting.value = true
  const flashId = toast.loading('Submitting observation…')
  log.info('submitting observation', {
    department: form.department, category: form.category,
    inspectionDate: form.inspectionDate, complianceStatus: form.complianceStatus,
    inspectionPhotos: inspection_photos.value.length, compliedPhotos: complied_photos.value.length,
  })
  const t0 = Date.now()
  try {
    const res = await createInspection({ ...form }, inspection_photos.value, complied_photos.value)
    log.http('POST', '/api/v1/inspection/', res.status, Date.now() - t0, {
      observationId: res.data?.observationId ?? res.data?.id,
    })
    toast.resolve(flashId, 'success', 'Observation submitted successfully.')
    partialReset()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    const status = e?.response?.status ?? 0
    const msg    = e?.response?.data?.message ?? 'Submission failed. Please try again.'
    log.http('POST', '/api/v1/inspection/', status, Date.now() - t0, { message: msg })
    toast.resolve(flashId, 'error', msg)
  } finally {
    submitting.value = false
  }
}

// After submit — keep Inspection Date, Category, Department, Location, Discussed With
function partialReset() {
  Object.assign(form, {
    subDepartment: '', observation: '', complianceStatus: '',
    targetDate: '', toBeIncludedInDispatcher: 'YES', recommendations: '',
  })
  Object.keys(errors).forEach(k => delete errors[k])
  inspUploadRef.value?.reset()
  compUploadRef.value?.reset()
}

// Reset button — full wipe
function resetForm() {
  Object.assign(form, {
    inspectionDate: today, category: '', department: '', subDepartment: '',
    location: '', observation: '', complianceStatus: '', targetDate: '',
    toBeIncludedInDispatcher: 'YES', recommendations: '', discussedWith: '',
  })
  Object.keys(errors).forEach(k => delete errors[k])
  inspUploadRef.value?.reset()
  compUploadRef.value?.reset()
}
</script>

<style scoped>
.page-head { margin-bottom: 16px; }

/* Form card */
.form-card {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Grids */
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.field { display: flex; flex-direction: column; gap: 5px; }

.obs-area  { min-height: 66px; resize: none; }
.rec-area  { min-height: 54px; resize: none; }

.req { color: var(--red); margin-left: 1px; }
.hint-soft { font-size: 10px; font-weight: 500; color: var(--text-3); margin-left: 4px; text-transform: none; letter-spacing: 0; }
.ferr { font-size: 11.5px; color: var(--red); }

/* Section divider */
.section-divider {
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-3);
}
.section-divider::before,
.section-divider::after {
  content: ''; flex: 1; height: 1.5px; background: var(--border);
}

/* Actions */
.form-actions {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 12px; flex-wrap: wrap; padding-top: 4px;
  border-top: 1.5px solid var(--border); margin-top: 2px;
}
.action-btns { display: flex; align-items: center; gap: 8px; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

@media (max-width: 680px) {
  .grid-3, .grid-2 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 440px) {
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .form-card { padding: 14px; }
}
</style>
