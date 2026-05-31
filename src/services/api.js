import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

function observationFormData(fields, inspectionPhotos = [], compliedPhotos = []) {
  const fd = new FormData()
  fd.append('observation', new Blob([JSON.stringify(fields)], { type: 'application/json' }))
  inspectionPhotos.forEach(f => fd.append('inspection_photos', f))
  compliedPhotos.forEach(f => fd.append('complied_photos', f))
  return fd
}

export function createInspection(fields, inspectionPhotos, compliedPhotos) {
  return http.post('/inspection-observations', observationFormData(fields, inspectionPhotos, compliedPhotos))
}

export function searchInspections(params) {
  return http.get('/api/v1/inspection/', { params })
}

export function updateInspection(id, fields, inspectionPhotos, compliedPhotos) {
  return http.put(`/inspection-observations/${id}`, observationFormData(fields, inspectionPhotos, compliedPhotos))
}

export function deleteInspection(id) {
  return http.delete(`/inspection-observations/${id}`)
}

/**
 * Download a generated report in the given format.
 * format: 'word' | 'powerpoint' | 'excel'
 * The same filter params used by searchInspections are forwarded so the
 * backend scopes the report to the current selection.
 */
export function downloadReport(format, params) {
  return http.get(`/api/v1/inspection/reports/${format}`, {
    params,
    responseType: 'blob',
  })
}

export function resolvePhotoUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
  return `${base}${path}`
}
