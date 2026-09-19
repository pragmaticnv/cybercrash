/* =====================================================
   CYBERCRASH LEA — Digital Forensic Investigation Controller
   Coordinates 4 workspace modes: TRACE, NETWORK, HOTSPOT, HISTORY
   Manages contextual inspector drawer & case switcher
   ===================================================== */

import { ACTIVE_CASE, MOCK_CASES, NODE_TELEMETRY } from './data.js';
import { renderTraceCanvas, setOnNodeSelect as setTraceNodeSelect } from './money-trail.js';
import { renderHotspotCanvas, setOnHotspotSelect as setHotspotSelect } from './map.js';
import { renderNetworkCanvas, renderHistoryCanvas, setOnItemSelect as setNetworkItemSelect } from './network-history.js';

let currentMode = 'trace'; // 'trace' | 'network' | 'hotspot' | 'history'
let currentCase = ACTIVE_CASE;

/* ── Initialize Workstation ─────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initModeController();
  initContextualDrawer();
  initCaseSwitcher();
  initExportAction();
  initBackToLogin();

  // Register selection callbacks from all engines to feed the contextual drawer
  setTraceNodeSelect(showContextualDrawer);
  setHotspotSelect(showContextualDrawer);
  setNetworkItemSelect(showContextualDrawer);

  // Initial render in default TRACE mode
  switchMode('trace');

  // Responsive re-render on resize
  window.addEventListener('resize', debounce(() => {
    switchMode(currentMode, false);
  }, 150));
});

/* ── Mode Switching Logic ───────────────────────────── */
export function switchMode(mode, updateUI = true) {
  currentMode = mode;

  if (updateUI) {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  const canvas = document.getElementById('investigation-canvas');
  if (!canvas) return;

  // Add subtle mode transition
  canvas.style.opacity = '0.4';
  canvas.style.transform = 'scale(0.99)';
  canvas.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

  setTimeout(() => {
    switch (mode) {
      case 'trace':
        renderTraceCanvas('investigation-canvas');
        break;
      case 'network':
        renderNetworkCanvas('investigation-canvas');
        break;
      case 'hotspot':
        renderHotspotCanvas('investigation-canvas');
        break;
      case 'history':
        renderHistoryCanvas('investigation-canvas');
        break;
      default:
        renderTraceCanvas('investigation-canvas');
    }
    canvas.style.opacity = '1';
    canvas.style.transform = 'scale(1)';
  }, 100);
}

function initModeController() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode && mode !== currentMode) {
        switchMode(mode);
      }
    });
  });
}

/* ── Contextual Forensic Inspector Drawer ───────────── */
function initContextualDrawer() {
  const drawer = document.getElementById('contextual-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  // Action buttons inside drawer
  document.getElementById('action-freeze-btn')?.addEventListener('click', () => {
    alert('NOTICE DISPATCHED:\n\nUrgent freeze instruction dispatched under Section 91 CrPC to Nodal Officer.\nTracking ID: CC-FRZ-2025-9921');
  });

  document.getElementById('action-notice-btn')?.addEventListener('click', () => {
    alert('STATUTORY NOTICE:\n\nLegal production notice generated for bank records, KYC artifacts, and ATM CCTV footage.');
  });
}

export function showContextualDrawer(telemetry) {
  const drawer = document.getElementById('contextual-drawer');
  if (!drawer || !telemetry) return;

  // Populate drawer fields
  document.getElementById('drawer-node-id').textContent = telemetry.id || 'NODE TELEMETRY';
  document.getElementById('drawer-node-title').textContent = telemetry.label || telemetry.role || 'Forensic Entity';
  document.getElementById('drawer-node-tag').textContent = telemetry.flag || telemetry.status || 'INTELLIGENCE OBJECT';

  const bodyEl = document.getElementById('drawer-body-content');
  if (bodyEl) {
    let rowsHTML = '';

    if (telemetry.holder) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Account Holder</span><span class="val highlight">${telemetry.holder}</span></div>`;
    }
    if (telemetry.bank) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Bank / IFSC</span><span class="val">${telemetry.bank} &middot; ${telemetry.ifsc || 'N/A'}</span></div>`;
    }
    if (telemetry.branch) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Branch</span><span class="val">${telemetry.branch}</span></div>`;
    }
    if (telemetry.amount) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Transferred Amount</span><span class="val red">${telemetry.amount}</span></div>`;
    }
    if (telemetry.kycStatus) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">KYC Risk Flag</span><span class="val red">${telemetry.kycStatus}</span></div>`;
    }
    if (telemetry.turnover) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Account Turnover</span><span class="val">${telemetry.turnover}</span></div>`;
    }
    if (telemetry.velocity) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Outbound Velocity</span><span class="val highlight">${telemetry.velocity}</span></div>`;
    }
    if (telemetry.location) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Location</span><span class="val">${telemetry.location}</span></div>`;
    }
    if (telemetry.cctv) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Surveillance</span><span class="val red">${telemetry.cctv}</span></div>`;
    }
    if (telemetry.similarity) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Pattern Similarity</span><span class="val red">${telemetry.similarity}</span></div>`;
    }
    if (telemetry.sharedPattern) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Shared MO</span><span class="val">${telemetry.sharedPattern}</span></div>`;
    }
    if (telemetry.description) {
      rowsHTML += `<div class="drawer-data-row"><span class="lbl">Infrastructure Details</span><span class="val">${telemetry.description}</span></div>`;
    }

    bodyEl.innerHTML = rowsHTML;
  }

  drawer.classList.add('open');
}

/* ── Contextual Case Switcher Dropdown ──────────────── */
function initCaseSwitcher() {
  const trigger = document.getElementById('case-selector-trigger');
  const dropdown = document.getElementById('case-selector-dropdown');

  if (trigger && dropdown) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && e.target !== trigger) {
        dropdown.classList.remove('visible');
      }
    });

    // Populate dropdown cases
    const list = document.getElementById('case-selector-list');
    if (list) {
      list.innerHTML = MOCK_CASES.map(c => `
        <div class="case-dropdown-item ${c.id === currentCase.id ? 'active' : ''}" data-case-id="${c.id}">
          <div class="cd-header">
            <span class="cd-id">${c.id}</span>
            <span class="cd-amount">${c.amount}</span>
          </div>
          <div class="cd-sub">${c.type} &middot; ${c.state}</div>
        </div>
      `).join('');

      list.querySelectorAll('.case-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const cid = item.dataset.caseId;
          const found = MOCK_CASES.find(c => c.id === cid);
          if (found) {
            currentCase = found;
            updateCaseHeader(found);
            dropdown.classList.remove('visible');
            switchMode(currentMode, false);
          }
        });
      });
    }
  }
}

function updateCaseHeader(c) {
  const idEl = document.getElementById('active-case-id');
  const metaEl = document.getElementById('active-case-meta');
  if (idEl) idEl.textContent = c.id;
  if (metaEl) {
    metaEl.innerHTML = `
      <span>${c.type}</span>
      <span class="sep">&middot;</span>
      <span>${c.state}</span>
      <span class="sep">&middot;</span>
      <span class="red">${c.amount}</span>
      <span class="sep">&middot;</span>
      <span>Primary Mule: <strong class="mono">${c.primaryMule}</strong></span>
    `;
  }
}

/* ── Actions & Navigation ───────────────────────────── */
function initExportAction() {
  document.getElementById('btn-export-dossier')?.addEventListener('click', () => {
    alert(`CYBERCRASH FORENSIC DOSSIER\n\nCase: ${currentCase.id}\nFraud Type: ${currentCase.type}\nPrimary Mule: ${currentCase.primaryMule}\nPredicted Hotspot: ${currentCase.predictedZone} (${currentCase.riskPercent || '97.9%'})\n\nDossier exported to: CYBERCRASH_${currentCase.id}_EVIDENCE.pdf`);
  });
}

function initBackToLogin() {
  document.getElementById('btn-terminal-back')?.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

/* ── Utilities ──────────────────────────────────────── */
function initClock() {
  const clockEl = document.getElementById('live-hud-clock');
  function tick() {
    if (!clockEl) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} IST`;
  }
  tick();
  setInterval(tick, 1000);
}

function debounce(fn, ms) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}
