export const CATEGORIES = [
  { value: 'FIRE_SAFETY',        label: 'Fire & Explosion Safety' },
  { value: 'ELECTRICAL',         label: 'Electrical Safety' },
  { value: 'MECHANICAL',         label: 'Mechanical Safety' },
  { value: 'WORKING_AT_HEIGHT',  label: 'Working at Height' },
  { value: 'CONFINED_SPACE',     label: 'Confined Space' },
  { value: 'HOUSEKEEPING',       label: 'Housekeeping' },
  { value: 'PPE',                label: 'Personal Protective Equipment' },
  { value: 'MATERIAL_HANDLING',  label: 'Material Handling' },
  { value: 'CHEMICAL_HAZARDS',   label: 'Chemical Hazards' },
  { value: 'ENVIRONMENTAL',      label: 'Environmental' },
  { value: 'CONTRACTOR_SAFETY',  label: 'Contractor Safety' },
  { value: 'TRAFFIC_VEHICLE',    label: 'Traffic & Vehicle Movement' },
]

export const DEPARTMENTS = [
  { value: 'BF',     label: 'Blast Furnace (BF)' },
  { value: 'SMS',    label: 'Steel Melting Shop (SMS)' },
  { value: 'HSM',    label: 'Hot Strip Mill (HSM)' },
  { value: 'CRM',    label: 'Cold Rolling Mill (CRM)' },
  { value: 'COB',    label: 'Coke Oven Battery (COB)' },
  { value: 'SP',     label: 'Sinter Plant (SP)' },
  { value: 'LDP',    label: 'Lime & Dolomite Plant (LDP)' },
  { value: 'OP',     label: 'Oxygen Plant (OP)' },
  { value: 'PBS',    label: 'Power & Blowing Station (PBS)' },
  { value: 'RMP',    label: 'Refractory Materials Plant (RMP)' },
  { value: 'CMD',    label: 'Central Maintenance Dept (CMD)' },
  { value: 'RMH',    label: 'Raw Material Handling (RMH)' },
  { value: 'BPP',    label: 'By-Products Plant (BPP)' },
  { value: 'WMD',    label: 'Water Management Dept (WMD)' },
  { value: 'SAFETY', label: 'Safety Department' },
  { value: 'HR',     label: 'HR & Administration' },
  { value: 'CIVIL',  label: 'Civil & Infrastructure' },
]

export const COMPLIANCE_STATUSES = [
  { value: 'Complied',           label: 'Complied' },
  { value: 'Not Complied',       label: 'Not Complied' },
  { value: 'Partially Complied', label: 'Partially Complied' },
  { value: 'In Progress',        label: 'In Progress' },
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
    'Complied':           { label: 'Complied',          color: 'var(--green)', dimBg: 'var(--green-dim)', border: 'var(--green-border)' },
    'Not Complied':       { label: 'Not Complied',       color: 'var(--red)',   dimBg: 'var(--red-dim)',   border: 'var(--red-border)'   },
    'Partially Complied': { label: 'Partially Complied', color: 'var(--amber)', dimBg: 'var(--amber-dim)', border: 'var(--amber-border)' },
    'In Progress':        { label: 'In Progress',        color: 'var(--blue)',  dimBg: 'var(--blue-dim)',  border: 'var(--blue-border)'  },
  }
  return map[status] ?? { label: status, color: 'var(--text-3)', dimBg: 'rgba(120,155,210,0.08)', border: 'rgba(120,155,210,0.2)' }
}
