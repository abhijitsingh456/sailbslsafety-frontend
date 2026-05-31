<template>
  <div id="shell">
    <header class="navbar">
      <div class="brand">
        <div class="brand-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="#fffdf8" stroke="#1a1410" stroke-width="1.8"
              stroke-linejoin="round"/>
            <path d="M9 12l2 2 4-4" stroke="#c63d10" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="brand-copy">
          <span class="brand-eyebrow">Bokaro Steel Plant · SAIL</span>
          <span class="brand-name">Safety <em>Inspection</em></span>
        </div>
      </div>

      <nav class="nav-links" role="navigation">
        <RouterLink to="/create" class="nav-btn nav-btn--primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
          New Observation
        </RouterLink>
        <RouterLink to="/search" class="nav-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Search &amp; View
        </RouterLink>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="site-footer">
      <span class="foot-mono">SED·BSL·SAIL</span>
      <span class="sep">/</span>
      <span>Safety Engineering Department — Internal Portal</span>
      <span class="foot-spacer" />
      <span class="foot-mono foot-vol">VOL · I</span>
    </footer>
  </div>
</template>

<script setup></script>

<style scoped>
#shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 26px;
  height: 64px;
  background: #fffdf8;
  border-bottom: 3px solid #1a1410;
  box-shadow: 0 2px 0 var(--accent), 0 3px 0 #1a1410;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 0;
  background: var(--surface-2);
  border: 1.5px solid #1a1410;
  box-shadow: 2px 2px 0 #1a1410;
  display: grid;
  place-items: center;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-eyebrow {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 600;
}

.brand-name {
  font-family: var(--serif);
  font-size: 19px;
  font-weight: 700;
  font-variation-settings: "opsz" 144;
  letter-spacing: -0.025em;
  color: var(--text);
  line-height: 1;
}
.brand-name em {
  font-style: italic;
  font-weight: 500;
  color: var(--accent);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--r-sm);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1.5px solid var(--border-strong);
  background: var(--surface-2);
  color: var(--text-2);
  transition: transform 110ms, box-shadow 110ms, background 140ms, border-color 140ms, color 140ms;
  box-shadow: 2px 2px 0 rgba(26, 20, 16, 0.18);
}
.nav-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 rgba(26, 20, 16, 0.25);
  border-color: #1a1410;
  color: var(--text);
}

.nav-btn--primary {
  background: transparent;
  color: var(--accent);
  border-color: var(--accent);
  box-shadow: 2px 2px 0 rgba(198, 61, 16, 0.35);
}
.nav-btn--primary:hover {
  background: rgba(198, 61, 16, 0.08);
  color: var(--accent-hover);
  border-color: var(--accent);
  box-shadow: 3px 3px 0 rgba(198, 61, 16, 0.45);
}

/* ── ACTIVE STATE — identical for both, unmistakable ── */
.nav-btn.router-link-active {
  background: #1a1410;
  color: #fffdf8;
  border-color: #1a1410;
  box-shadow: 3px 3px 0 var(--accent);
  transform: translate(-1px, -1px);
}
.nav-btn.router-link-active::after {
  content: '';
  position: absolute;
  left: 10px; right: 10px;
  bottom: -7px;
  height: 3px;
  background: var(--accent);
  border-radius: 1px;
}
.nav-btn.router-link-active:hover {
  background: #1a1410;
  color: #fffdf8;
  box-shadow: 3px 3px 0 var(--accent);
}

.main-content { flex: 1; }

.site-footer {
  padding: 14px 26px;
  border-top: 1.5px solid var(--border-strong);
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--text-2);
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface-2);
}
.foot-mono {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--accent);
}
.foot-vol { color: var(--text-3); }
.sep { opacity: 0.4; }
.foot-spacer { flex: 1; }

@media (max-width: 600px) {
  .navbar { padding: 0 14px; height: 58px; }
  .brand-eyebrow { display: none; }
  .nav-btn { padding: 7px 10px; font-size: 11px; }
  .foot-vol { display: none; }
}
</style>
