import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  // Serialize arrays as repeated keys: ?department=BF&department=CRM
  // (Spring's @RequestParam List<String> expects this, not the default
  //  bracketed form `department[]=BF&department[]=CRM`.)
  paramsSerializer: { indexes: null },
})

/**
 * Build the multipart body matching the backend controller signature:
 *   @RequestPart("observation")       InspectionObservationRequest req
 *   @RequestPart("inspection_photos")  List<MultipartFile> inspection_photos
 *   @RequestPart("complied_photos")    List<MultipartFile> complied_photos
 */
function observationFormData(fields, inspectionPhotos = [], compliedPhotos = []) {
  const fd = new FormData()
  fd.append(
    'observation',
    new Blob([JSON.stringify(fields)], { type: 'application/json' })
  )
  inspectionPhotos.forEach(f => fd.append('inspection_photos', f))
  compliedPhotos.forEach(f   => fd.append('complied_photos',   f))
  return fd
}

export function createInspection(fields, inspectionPhotos, compliedPhotos) {
  return http.post(
    '/api/v1/inspection/',
    observationFormData(fields, inspectionPhotos, compliedPhotos)
  )
}

export function searchInspections(params) {
  return http.get('/api/v1/inspection/', { params })
}

export function updateInspection(id, fields, inspectionPhotos, compliedPhotos) {
  return http.put(
    `/api/v1/inspection/${id}`,
    observationFormData(fields, inspectionPhotos, compliedPhotos)
  )
}

export function deleteInspection(id) {
  return http.delete(`/api/v1/inspection/${id}`)
}

/**
 * Download a generated report in the given format.
 * format: 'word' | 'powerpoint' | 'excel'
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
