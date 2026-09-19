/* =====================================================
   CYBERCRASH LEA — Progressive Money Trail Engine
   Interactive Full-Canvas Digital Forensic Trace
   VICTIM → ACC_013041 → ACC_008564 → ACC_001276 → ACC_006877 → ATMs
   ===================================================== */

import { TRACE_STEPS, NODE_TELEMETRY } from './data.js';

let currentHopLimit = 1; // Start with VICTIM → ACC_013041
let onNodeSelectCallback = null;

export function setOnNodeSelect(cb) {
  onNodeSelectCallback = cb;
}

export function getCurrentHopLimit() {
  return currentHopLimit;
}

export function advanceHop() {
  if (currentHopLimit < TRACE_STEPS.length) {
    currentHopLimit++;
    renderTraceCanvas();
    return true;
  }
  return false;
}

export function resetHops() {
  currentHopLimit = 1;
  renderTraceCanvas();
}

export function expandAllHops() {
  currentHopLimit = TRACE_STEPS.length;
  renderTraceCanvas();
}

export function renderTraceCanvas(containerId = 'investigation-canvas') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const W = container.clientWidth || 1200;
  const H = container.clientHeight || 700;

  // Node layout calculation across full width
  // We have up to 7 nodes across the timeline:
  // 0: VICTIM
  // 1: ACC_013041 (Primary Mule)
  // 2: ACC_008564 (Layer 2)
  // 3: ACC_001276 (Layer 3 Split)
  // 4: ACC_006877 (Layer 4 Cashout Mule)
  // 5a: ATM_GOA_01
  // 5b: ATM_GOA_05

  const centerY = H * 0.48;

  // Compute horizontal spacing based on canvas width
  const totalStages = 6;
  const stageSpacing = Math.min(220, (W - 200) / totalStages);
  const startX = Math.max(90, (W - stageSpacing * totalStages) / 2);

  const nodePositions = {
    'VICTIM':     { x: startX, y: centerY, label: 'VICTIM', sub: '₹1,00,250', type: 'victim' },
    'ACC_013041': { x: startX + stageSpacing * 1.05, y: centerY, label: 'ACC_013041', sub: 'PRIMARY MULE', type: 'primary' },
    'ACC_008564': { x: startX + stageSpacing * 2.1, y: centerY - 15, label: 'ACC_008564', sub: 'LAYER 2 HOP', type: 'mule' },
    'ACC_001276': { x: startX + stageSpacing * 3.15, y: centerY + 25, label: 'ACC_001276', sub: 'SPLIT MULE', type: 'mule' },
    'ACC_006877': { x: startX + stageSpacing * 4.2, y: centerY, label: 'ACC_006877', sub: 'CASHOUT MULE', type: 'mule' },
    'ATM_GOA_01': { x: startX + stageSpacing * 5.3, y: centerY - 70, label: 'ATM_GOA_01', sub: 'CALANGUTE (₹40K)', type: 'atm' },
    'ATM_GOA_05': { x: startX + stageSpacing * 5.3, y: centerY + 70, label: 'ATM_GOA_05', sub: 'PANAJI (₹20K)', type: 'atm' }
  };

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.inset = '0';
  svg.style.overflow = 'visible';

  // Filters & Defs
  svg.innerHTML = `
    <defs>
      <linearGradient id="flowGradBlue" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#35A9FF" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#FF2D2D" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="flowGradRed" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FF2D2D" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#FF5555" stop-opacity="0.9"/>
      </linearGradient>
      <filter id="traceGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2"/>
        <feMerge>
          <feMergeNode in="blur1"/>
          <feMergeNode in="blur2"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;

  // Draw HUD Canvas grid coordinate markings
  const hudG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  hudG.setAttribute('class', 'canvas-hud-grid');
  hudG.innerHTML = `
    <!-- Ambient Target Coordinates -->
    <text x="36" y="44" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600" fill="rgba(53,169,255,0.4)" letter-spacing="3">
      FORENSIC TRACE ENGINE // LIVE TRANSACTION FLOW
    </text>
    <text x="36" y="64" font-family="'Space Grotesk', monospace" font-size="9" fill="rgba(142,165,184,0.4)" letter-spacing="1.5">
      TARGET: CASE_007001 &middot; AMOUNT: ₹1,00,250 &middot; REVEALED HOPS: ${currentHopLimit} / ${TRACE_STEPS.length}
    </text>
    <line x1="36" y1="76" x2="${Math.min(W - 36, 450)}" y2="76" stroke="rgba(53,169,255,0.15)" stroke-width="1"/>
  `;
  svg.appendChild(hudG);

  // Active steps to render based on currentHopLimit
  const activeSteps = TRACE_STEPS.slice(0, currentHopLimit);
  const activeNodeIds = new Set(['VICTIM']);
  activeSteps.forEach(s => {
    activeNodeIds.add(s.sourceId);
    activeNodeIds.add(s.targetId);
  });

  // Edge Group
  const edgesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  activeSteps.forEach((step, idx) => {
    const src = nodePositions[step.sourceId];
    const tgt = nodePositions[step.targetId];
    if (!src || !tgt) return;

    const isRed = idx > 0;
    const strokeCol = isRed ? 'rgba(255, 45, 45, 0.45)' : 'rgba(53, 169, 255, 0.45)';
    const particleCol = isRed ? '#FF2D2D' : '#35A9FF';

    // Curvature calculation
    const dx = tgt.x - src.x;
    const dy = tgt.y - src.y;
    const dist = Math.hypot(dx, dy);
    const mx = (src.x + tgt.x) / 2;
    const my = (src.y + tgt.y) / 2 + (idx % 2 === 0 ? -15 : 15);

    const pathD = `M ${src.x},${src.y} Q ${mx},${my} ${tgt.x},${tgt.y}`;

    // Base line
    const baseLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    baseLine.setAttribute('d', pathD);
    baseLine.setAttribute('fill', 'none');
    baseLine.setAttribute('stroke', strokeCol);
    baseLine.setAttribute('stroke-width', '1.8');
    baseLine.setAttribute('stroke-dasharray', '4 5');
    edgesG.appendChild(baseLine);

    // Animated particle line
    const animLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    animLine.setAttribute('d', pathD);
    animLine.setAttribute('fill', 'none');
    animLine.setAttribute('stroke', particleCol);
    animLine.setAttribute('stroke-width', '3');
    animLine.setAttribute('stroke-linecap', 'round');
    animLine.setAttribute('stroke-dasharray', `12 ${dist + 60}`);
    animLine.setAttribute('filter', 'url(#traceGlow)');
    animLine.style.animation = `moneyParticle ${2.2 + idx * 0.3}s linear ${idx * 0.25}s infinite`;
    edgesG.appendChild(animLine);

    // Midpoint Flow Badge
    const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    badgeG.setAttribute('transform', `translate(${mx}, ${my})`);
    badgeG.innerHTML = `
      <rect x="-42" y="-11" width="84" height="22" rx="4" fill="rgba(3,10,22,0.92)"
        stroke="${strokeCol}" stroke-width="1" filter="drop-shadow(0 0 6px rgba(0,0,0,0.6))"/>
      <text x="0" y="3" text-anchor="middle" font-family="'Space Grotesk', monospace"
        font-size="9" font-weight="700" fill="${particleCol}" letter-spacing="0.5">
        ${step.amount}
      </text>
    `;
    edgesG.appendChild(badgeG);
  });
  svg.appendChild(edgesG);

  // Nodes Group
  const nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  Object.entries(nodePositions).forEach(([id, pos]) => {
    const isRevealed = activeNodeIds.has(id);
    const isNextToReveal = !isRevealed && (
      (id === 'ACC_008564' && currentHopLimit === 1) ||
      (id === 'ACC_001276' && currentHopLimit === 2) ||
      (id === 'ACC_006877' && currentHopLimit === 3) ||
      (id.startsWith('ATM') && currentHopLimit >= 4)
    );

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `trace-node-group ${isRevealed ? 'active' : isNextToReveal ? 'next-expand' : 'dormant'}`);
    g.setAttribute('data-node-id', id);
    g.style.cursor = isRevealed || isNextToReveal ? 'pointer' : 'default';

    let r = 28;
    let mainColor = '#35A9FF';
    let ringColor = 'rgba(53,169,255,0.4)';
    let nodeBg = 'rgba(5, 18, 38, 0.95)';

    if (pos.type === 'primary') {
      r = 34;
      mainColor = '#FF2D2D';
      ringColor = 'rgba(255, 45, 45, 0.6)';
    } else if (pos.type === 'victim') {
      r = 28;
      mainColor = '#35A9FF';
      ringColor = 'rgba(53, 169, 255, 0.5)';
    } else if (pos.type === 'mule') {
      r = 26;
      mainColor = '#FFAA33';
      ringColor = 'rgba(255, 170, 51, 0.5)';
    } else if (pos.type === 'atm') {
      r = 24;
      mainColor = '#FF2D2D';
      ringColor = 'rgba(255, 45, 45, 0.7)';
    }

    if (!isRevealed && isNextToReveal) {
      // Pulsing invitation to expand
      g.innerHTML = `
        <circle cx="${pos.x}" cy="${pos.y}" r="${r + 14}" fill="none" stroke="${mainColor}"
          stroke-width="1" stroke-dasharray="3 4" opacity="0.6" style="animation: mapNodeRing 2s ease-out infinite"/>
        <circle cx="${pos.x}" cy="${pos.y}" r="${r}" fill="rgba(8,20,36,0.6)" stroke="${mainColor}"
          stroke-width="1.2" stroke-dasharray="4 3" opacity="0.7"/>
        <text x="${pos.x}" y="${pos.y + 4}" text-anchor="middle" font-family="'Space Grotesk', monospace"
          font-size="10" font-weight="700" fill="${mainColor}" opacity="0.8">+</text>
        <text x="${pos.x}" y="${pos.y + r + 18}" text-anchor="middle" font-family="'Space Grotesk', sans-serif"
          font-size="9" font-weight="600" fill="${mainColor}" opacity="0.7" letter-spacing="1">EXPAND</text>
      `;
    } else if (isRevealed) {
      // Fully revealed interactive forensic node
      g.innerHTML = `
        <!-- Outer sonar ring -->
        <circle cx="${pos.x}" cy="${pos.y}" r="${r + 12}" fill="none" stroke="${ringColor}"
          stroke-width="0.8" opacity="0.4" style="animation: mapNodeRing 3s ease-out infinite"/>
        <!-- Main node body -->
        <circle cx="${pos.x}" cy="${pos.y}" r="${r}" fill="${nodeBg}" stroke="${mainColor}"
          stroke-width="${pos.type === 'primary' ? 2.5 : 1.8}" filter="url(#laserGlow)"/>
        <!-- Inner core -->
        <circle cx="${pos.x}" cy="${pos.y}" r="${r - 8}" fill="${mainColor}" opacity="0.15"/>

        <!-- Center Icon or Label -->
        <text x="${pos.x}" y="${pos.y + 4}" text-anchor="middle" font-family="'Space Grotesk', monospace"
          font-size="${pos.type === 'primary' ? 9 : 8}" font-weight="700" fill="${mainColor}" letter-spacing="0.5">
          ${pos.type === 'victim' ? 'VICTIM' : pos.type === 'atm' ? 'ATM' : pos.label.replace('ACC_', '')}
        </text>

        <!-- Node Header & Subtext -->
        <text x="${pos.x}" y="${pos.y + r + 16}" text-anchor="middle" font-family="'Space Grotesk', sans-serif"
          font-size="11" font-weight="700" fill="#F3F7FA" letter-spacing="0.5">
          ${pos.label}
        </text>
        <text x="${pos.x}" y="${pos.y + r + 28}" text-anchor="middle" font-family="'Space Grotesk', sans-serif"
          font-size="9" font-weight="500" fill="${pos.type === 'primary' ? '#FF5555' : 'rgba(142,165,184,0.7)'}" letter-spacing="1">
          ${pos.sub}
        </text>
      `;
    } else {
      // Dormant unrevealed node (very subtle outline)
      g.innerHTML = `
        <circle cx="${pos.x}" cy="${pos.y}" r="${r - 4}" fill="rgba(6,16,28,0.2)"
          stroke="rgba(53,169,255,0.12)" stroke-width="1" stroke-dasharray="2 3"/>
      `;
    }

    // Node click handlers
    if (isRevealed || isNextToReveal) {
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isNextToReveal) {
          advanceHop();
        } else if (isRevealed) {
          if (onNodeSelectCallback) {
            const telemetry = NODE_TELEMETRY[id] || { id, label: pos.label, role: pos.sub };
            onNodeSelectCallback(telemetry);
          }
        }
      });
    }

    nodesG.appendChild(g);
  });

  svg.appendChild(nodesG);
  container.appendChild(svg);

  // Minimal floating tactical controls on the investigation canvas (bottom-center)
  renderTraceControls(container);
}

function renderTraceControls(container) {
  let controls = document.getElementById('trace-canvas-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'trace-canvas-controls';
    controls.className = 'canvas-hud-controls';
    container.appendChild(controls);
  }

  const isFull = currentHopLimit >= TRACE_STEPS.length;

  controls.innerHTML = `
    <div class="hud-control-group">
      <button class="hud-btn" id="btn-trace-step" title="Progressively reveal next hop">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span>${isFull ? 'ALL HOPS REVEALED' : 'REVEAL NEXT HOP'}</span>
      </button>
      <button class="hud-btn" id="btn-trace-expand-all" title="Unfold full multi-layered syndicate trace">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
        <span>EXPAND ALL</span>
      </button>
      <button class="hud-btn" id="btn-trace-reset" title="Reset to initial state">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 4v6h6M23 20v-6h-6"/>
          <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
        </svg>
        <span>RESET</span>
      </button>
    </div>
    <div class="hud-telemetry-pill">
      <span class="hud-dot ${isFull ? 'red' : 'blue'}"></span>
      <span>${isFull ? 'FULL SYNDICATE NETWORK UNLOCKED' : `PROGRESSIVE TRACE: HOP ${currentHopLimit} / ${TRACE_STEPS.length}`}</span>
    </div>
  `;

  document.getElementById('btn-trace-step')?.addEventListener('click', () => {
    advanceHop();
  });

  document.getElementById('btn-trace-expand-all')?.addEventListener('click', () => {
    expandAllHops();
  });

  document.getElementById('btn-trace-reset')?.addEventListener('click', () => {
    resetHops();
  });
}
