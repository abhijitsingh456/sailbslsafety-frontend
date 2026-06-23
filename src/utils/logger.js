/**
 * Structured logger — industry-standard frontend logging.
 *
 * Dev  : pretty console output with colours and readable timestamps.
 * Prod : one JSON object per line so Vercel / any log aggregator can
 *        parse, filter, and alert on structured fields.
 *
 * Usage:
 *   import { logger } from '@/utils/logger'
 *   const log = logger('SearchView')
 *
 *   log.info('search', { page: 0, filters })
 *   log.http('GET', '/api/v1/inspection/', 200, 142, { returned: 25, total: 720 })
 *   log.error('search failed', { status: 500, message: 'Internal Server Error' })
 */

const IS_DEV  = import.meta.env.DEV
const IS_TEST = import.meta.env.MODE === 'test'

// In prod emit INFO and above; in dev emit everything.
const LEVEL_RANK = { debug: 0, info: 1, warn: 2, error: 3 }
const MIN_RANK   = IS_DEV || IS_TEST ? 0 : 1   // suppress debug in prod

// ── colour palette for dev pretty-print ──────────────────────────────────────
const CLR = {
  reset:  '\x1b[0m',
  dim:    '\x1b[2m',
  debug:  '\x1b[36m',   // cyan
  info:   '\x1b[32m',   // green
  warn:   '\x1b[33m',   // yellow
  error:  '\x1b[31m',   // red
  http:   '\x1b[35m',   // magenta
  comp:   '\x1b[34m',   // blue  (component name)
}

function isoNow() { return new Date().toISOString() }

// ── core emit ────────────────────────────────────────────────────────────────
function emit(level, component, message, data) {
  if (LEVEL_RANK[level] < MIN_RANK) return

  if (IS_DEV) {
    // Pretty developer output
    const ts     = isoNow()
    const colour = CLR[level] ?? CLR.info
    const prefix = `${CLR.dim}${ts}${CLR.reset} ${colour}${level.toUpperCase().padEnd(5)}${CLR.reset} ${CLR.comp}[${component}]${CLR.reset}`
    const fn     = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    data !== undefined ? fn(prefix, message, data) : fn(prefix, message)
  } else {
    // Structured JSON — one line, machine-readable
    const entry = {
      timestamp: isoNow(),
      level,
      component,
      message,
      ...(data !== undefined ? { data } : {}),
    }
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    fn(JSON.stringify(entry))
  }
}

// ── HTTP-specific helper ─────────────────────────────────────────────────────
// log.http('POST', '/api/v1/inspection/', 201, 340, { observationId: '…' })
function emitHttp(component, method, url, status, durationMs, data) {
  const ok     = status >= 200 && status < 300
  const level  = ok ? 'info' : status >= 500 ? 'error' : 'warn'
  const message = `${method} ${url} → ${status} (${durationMs}ms)`

  if (IS_DEV) {
    const colour = ok ? CLR.http : CLR[level]
    const ts     = isoNow()
    const prefix = `${CLR.dim}${ts}${CLR.reset} ${colour}HTTP ${CLR.reset}${CLR.comp}[${component}]${CLR.reset}`
    const fn     = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    data !== undefined ? fn(prefix, message, data) : fn(prefix, message)
  } else {
    const entry = {
      timestamp: isoNow(),
      level,
      component,
      message,
      http: { method, url, status, durationMs },
      ...(data !== undefined ? { data } : {}),
    }
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
    fn(JSON.stringify(entry))
  }
}

// ── Public factory ───────────────────────────────────────────────────────────
export function logger(component) {
  return {
    debug: (msg, data)                             => emit('debug', component, msg, data),
    info:  (msg, data)                             => emit('info',  component, msg, data),
    warn:  (msg, data)                             => emit('warn',  component, msg, data),
    error: (msg, data)                             => emit('error', component, msg, data),
    /** log.http(method, url, status, durationMs, extraData?) */
    http:  (method, url, status, durationMs, data) => emitHttp(component, method, url, status, durationMs, data),
  }
}
