export const CATEGORIES = [
  { value: 'GENERAL INSPECTION',               label: 'General Inspection' },
  { value: 'SAFETY MONITORING',                label: 'Safety Monitoring' },
  { value: 'AUDIO VISUAL INSPECTION',          label: 'Audio Visual Inspection' },
  { value: 'CENTRAL CABLE GALLERY INSPECTION', label: 'Central Cable Gallery Inspection' },
  { value: 'CONVEYOR GALLERY INSPECTION',      label: 'Conveyor Gallery Inspection' },
  { value: 'EOT CRANE INSPECTION',             label: 'EOT Crane Inspection' },
  { value: 'ILLUMINATION INSPECTION',          label: 'Illumination Inspection' },
  { value: 'NIGHT INSPECTION',                 label: 'Night Inspection' },
  { value: 'RAIL ROAD CROSSING INSPECTION',    label: 'Rail Road Crossing Inspection' },
  { value: 'SAFETY WALK',                      label: 'Safety Walk' },
  { value: 'DLSIC',                            label: 'DLSIC' },
  { value: 'SAC',                              label: 'SAC' },
  { value: 'LOCOMOTIVE INSPECTION',            label: 'Locomotive Inspection' },
]

export const DEPARTMENTS = [
  { value: 'BF',              label: 'BF' },
  { value: 'CED',             label: 'CED' },
  { value: 'CME',             label: 'CME' },
  { value: 'CMM',             label: 'CMM' },
  { value: 'CO&CC',           label: 'CO&CC' },
  { value: 'CRM-1&2',         label: 'CRM-1&2' },
  { value: 'CRM-3',           label: 'CRM-3' },
  { value: 'DNW',             label: 'DNW' },
  { value: 'EMD',             label: 'EMD' },
  { value: 'GU',              label: 'GU' },
  { value: 'HRCF',            label: 'HRCF' },
  { value: 'HSM',             label: 'HSM' },
  { value: 'I&A',             label: 'I&A' },
  { value: 'MRD',             label: 'MRD' },
  { value: 'RCL',             label: 'RCL' },
  { value: 'RED',             label: 'RED' },
  { value: 'RGBS',            label: 'RGBS' },
  { value: 'RMHP',            label: 'RMHP' },
  { value: 'RMP',             label: 'RMP' },
  { value: 'SHOPS & FOUNDRY', label: 'Shops & Foundry' },
  { value: 'SMS NEW',         label: 'SMS New' },
  { value: 'SMS-2 & CCS',     label: 'SMS-2 & CCS' },
  { value: 'SP',              label: 'SP' },
  { value: 'TBS',             label: 'TBS' },
  { value: 'TRAFFIC',         label: 'Traffic' },
  { value: 'WMD',             label: 'WMD' },
  { value: 'PROJECTS',        label: 'Projects' },
  { value: 'OTHERS',          label: 'Others' },
]

export const COMPLIANCE_STATUSES = [
  { value: 'COMPLIED',        label: 'Complied' },
  { value: 'NOT COMPLIED',    label: 'Not Complied' },
  { value: 'GOOD POINT',      label: 'Good Point' },
  { value: 'NOT APPLICABLE',  label: 'Not Applicable' },
]

export const DISPATCHER_OPTIONS = [
  { value: 'YES', label: 'Yes — Include in Dispatcher' },
  { value: 'NO',  label: 'No' },
]

export function getLabel(options, value) {
  return options.find(o => o.value === value)?.label ?? value
}

export function statusConfig(status) {
  const map = {
    'COMPLIED':       { label: 'Complied',       color: 'var(--green)',  dimBg: 'var(--green-dim)',  border: 'var(--green-border)'  },
    'NOT COMPLIED':   { label: 'Not Complied',   color: 'var(--red)',    dimBg: 'var(--red-dim)',    border: 'var(--red-border)'    },
    'GOOD POINT':     { label: 'Good Point',     color: 'var(--blue)',   dimBg: 'var(--blue-dim)',   border: 'var(--blue-border)'   },
    'NOT APPLICABLE': { label: 'Not Applicable', color: 'var(--text-3)', dimBg: 'rgba(120,120,140,0.08)', border: 'rgba(120,120,140,0.25)' },
  }
  return map[status] ?? { label: status, color: 'var(--text-3)', dimBg: 'rgba(120,120,140,0.08)', border: 'rgba(120,120,140,0.2)' }
}
