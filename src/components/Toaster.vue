<template>
  <Teleport to="body">
    <TransitionGroup tag="div" name="toast" class="toaster" role="status" aria-live="polite">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="['toast', `toast--${t.type}`]"
        :style="{ '--rail': railColor(t.type) }"
      >
        <span class="toast-rail" aria-hidden="true" />

        <span class="toast-icon" aria-hidden="true">
          <!-- loading: spinner -->
          <svg v-if="t.type === 'loading'" class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor"
              stroke-width="2.5" stroke-dasharray="40" stroke-dashoffset="30"/>
          </svg>
          <!-- success: check in circle -->
          <svg v-else-if="t.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
            <path d="M8 12.5l3 3 5-6" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- error: alert triangle -->
          <svg v-else-if="t.type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l10 18H2L12 3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M12 10v5M12 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <!-- info: i circle -->
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
            <path d="M12 11v6M12 7v.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>

        <span class="toast-msg">{{ t.message }}</span>

        <button v-if="t.type !== 'loading'" class="toast-x"
          @click="remove(t.id)" aria-label="Dismiss">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor"
              stroke-width="2.4" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup>
import { toasts, remove } from '../composables/useToasts.js'

function railColor(type) {
  return {
    loading: 'var(--accent)',
    success: 'var(--green)',
    error:   'var(--red)',
    info:    'var(--blue)',
  }[type] ?? 'var(--accent)'
}
</script>

<style>
/* unscoped so Teleport-to-body picks them up */
.toaster {
  position: fixed;
  top: 78px;          /* navbar 64 + 14 breathing room */
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  pointer-events: none;
  max-width: min(380px, calc(100vw - 40px));
}

.toast {
  pointer-events: auto;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px 11px 18px;
  background: var(--surface);
  border: 1.5px solid #1a1410;
  border-radius: var(--r-sm);
  box-shadow: -4px 4px 0 var(--rail), -4px 4px 0 1.5px #1a1410;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: 0.005em;
  overflow: hidden;
}

.toast-rail {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 5px;
  background: var(--rail);
}

.toast-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--rail);
}

.toast-msg {
  flex: 1;
  line-height: 1.35;
  word-break: break-word;
}

.toast-x {
  flex-shrink: 0;
  width: 22px; height: 22px;
  display: grid; place-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--r-xs);
  color: var(--text-3);
  cursor: pointer;
  transition: background 120ms, color 120ms, border-color 120ms;
}
.toast-x:hover {
  background: var(--surface-2);
  color: var(--text);
  border-color: var(--border-strong);
}

/* Per-type subtle wash */
.toast--success { background: linear-gradient(to right, var(--green-dim), var(--surface) 35%); }
.toast--error   { background: linear-gradient(to right, var(--red-dim),   var(--surface) 35%); }
.toast--info    { background: linear-gradient(to right, var(--blue-dim),  var(--surface) 35%); }
.toast--loading { background: linear-gradient(to right, rgba(198,61,16,0.08), var(--surface) 35%); }

/* Slide in from left, fade out */
.toast-enter-active {
  transition: transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1), opacity 180ms;
}
.toast-leave-active {
  transition: transform 180ms, opacity 160ms;
  position: absolute;       /* take out of flow so others slide up */
}
.toast-enter-from { transform: translateX(110%); opacity: 0; }
.toast-leave-to   { transform: translateX(30px); opacity: 0; }
.toast-move       { transition: transform 220ms cubic-bezier(0.2, 0.9, 0.3, 1); }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

@media (max-width: 600px) {
  .toaster { top: 70px; right: 12px; left: 12px; max-width: none; align-items: stretch; }
}
</style>
