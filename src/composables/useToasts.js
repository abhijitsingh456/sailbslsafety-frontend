import { reactive } from 'vue'

let nextId = 1
export const toasts = reactive([])

const DEFAULTS = {
  loading: 0,        // sticky until resolved
  success: 2800,
  error:   4500,
  info:    2800,
}

function push({ type = 'info', message, duration }) {
  const id = nextId++
  const ttl = duration ?? DEFAULTS[type] ?? 2800
  const toast = { id, type, message }
  toasts.push(toast)
  if (ttl > 0) {
    toast._timer = setTimeout(() => remove(id), ttl)
  }
  return id
}

export function remove(id) {
  const i = toasts.findIndex(t => t.id === id)
  if (i === -1) return
  clearTimeout(toasts[i]._timer)
  toasts.splice(i, 1)
}

/** Replace a loading toast with a final success/error one. */
function resolve(id, type, message, duration) {
  remove(id)
  return push({ type, message, duration })
}

export function useToast() {
  return {
    loading: (msg)               => push({ type: 'loading', message: msg }),
    success: (msg, duration)     => push({ type: 'success', message: msg, duration }),
    error:   (msg, duration)     => push({ type: 'error',   message: msg, duration }),
    info:    (msg, duration)     => push({ type: 'info',    message: msg, duration }),
    resolve,
    dismiss: remove,
  }
}
