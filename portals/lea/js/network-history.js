/* =====================================================
   CYBERCRASH LEA — Network & History Canvas Engines
   Full-Canvas Forensic Visualizations
   ===================================================== */

import { NETWORK_TOPOLOGY, HISTORICAL_CASES, NODE_TELEMETRY } from './data.js';

let onSelectCallback = null;

export function setOnItemSelect(cb) {
  onSelectCallback = cb;
}

/* =====================================================
   MODE 2: RADIAL ORBITAL NETWORK GRAPH
   ACC_013041 at glowing center, accounts and cases radiating
   ===================================================== */
export function renderNetworkCanvas(containerId = 'investigation-canvas') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const W = container.clientWidth || 1200;
  const H = container.clientHeight || 700;
  const cx = W / 2;
  const cy = H / 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.inset = '0';
  svg.style.overflow = 'visible';

  svg.innerHTML = `
    <defs>
      <filter id="netCoreGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur1"/>
        <feGaussianBlur stdDeviation="2" result="blur2"/>
        <feMerge>
          <feMergeNode in="blur1"/>
          <feMergeNode in="blur2"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="nodeGlowBlue" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  `;

  // HUD Canvas Coordinate Info
  const hudG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  hudG.innerHTML = `
    <text x="40" y="44" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600" fill="rgba(53,169,255,0.7)" letter-spacing="3">
      RADIAL FORENSIC NETWORK // SYNDICATE TOPOLOGY
    </text>
    <text x="40" y="64" font-family="'Space Grotesk', monospace" font-size="9" fill="rgba(142,165,184,0.4)" letter-spacing="1.5">
      CORE: ACC_013041 &middot; ORBIT 1: MULES (7) &middot; ORBIT 2: HISTORICAL CASES (4) &middot; ORBIT 3: INFRASTRUCTURE (3)
    </text>
    <line x1="40" y1="76" x2="480" y2="76" stroke="rgba(53,169,255,0.15)" stroke-width="1"/>
  `;
  svg.appendChild(hudG);

  // Concentric Orbital Ring Guidelines
  const r1 = Math.min(170, Math.min(W, H) * 0.24);
  const r2 = Math.min(290, Math.min(W, H) * 0.39);
  const r3 = Math.min(390, Math.min(W, H) * 0.48);

  const ringsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  ringsG.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="rgba(53,169,255,0.12)" stroke-width="1" stroke-dasharray="4 6"/>
    <circle cx="${cx}" cy="${cy}" r="${r2}" fill="none" stroke="rgba(255,45,45,0.10)" stroke-width="1" stroke-dasharray="3 7"/>
    <circle cx="${cx}" cy="${cy}" r="${r3}" fill="none" stroke="rgba(53,169,255,0.06)" stroke-width="1" stroke-dasharray="2 10"/>
  `;
  svg.appendChild(ringsG);

  // Orbit 1: Mules (Concentric around core)
  const mules = NETWORK_TOPOLOGY.orbit1_mules;
  const mulePositions = mules.map((m, i) => {
    const angle = (i / mules.length) * 2 * Math.PI - Math.PI / 2;
    return {
      ...m,
      x: cx + r1 * Math.cos(angle),
      y: cy + r1 * Math.sin(angle),
      type: 'mule'
    };
  });

  // Orbit 2: Historical Cases
  const cases = NETWORK_TOPOLOGY.orbit2_cases;
  const casePositions = cases.map((c, i) => {
    const angle = (i / cases.length) * 2 * Math.PI - Math.PI / 4;
    return {
      ...c,
      x: cx + r2 * Math.cos(angle),
      y: cy + r2 * Math.sin(angle),
      type: 'case'
    };
  });

  // Orbit 3: Technical Infra
  const infra = NETWORK_TOPOLOGY.orbit3_infra;
  const infraPositions = infra.map((inf, i) => {
    const angle = (i / infra.length) * 2 * Math.PI + Math.PI / 6;
    return {
      ...inf,
      x: cx + r3 * Math.cos(angle),
      y: cy + r3 * Math.sin(angle),
      type: 'infra'
    };
  });

  // Edges to center
  const edgesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  mulePositions.forEach((m, idx) => {
    const len = Math.hypot(m.x - cx, m.y - cy);
    edgesG.innerHTML += `
      <line x1="${cx}" y1="${cy}" x2="${m.x}" y2="${m.y}" stroke="rgba(255,45,45,0.3)" stroke-width="1.2"/>
      <line x1="${cx}" y1="${cy}" x2="${m.x}" y2="${m.y}" stroke="#FF5555" stroke-width="2.5" stroke-linecap="round"
        stroke-dasharray="8 ${len}" style="animation: moneyParticle ${2.5 + idx * 0.2}s linear infinite"/>
    `;
  });

  // Edges from mules to cases
  casePositions.forEach((c, idx) => {
    const targetMule = mulePositions[idx % mulePositions.length];
    const len = Math.hypot(c.x - targetMule.x, c.y - targetMule.y);
    edgesG.innerHTML += `
      <line x1="${targetMule.x}" y1="${targetMule.y}" x2="${c.x}" y2="${c.y}" stroke="rgba(53,169,255,0.25)" stroke-width="1" stroke-dasharray="3 4"/>
      <line x1="${targetMule.x}" y1="${targetMule.y}" x2="${c.x}" y2="${c.y}" stroke="#35A9FF" stroke-width="2" stroke-linecap="round"
        stroke-dasharray="6 ${len}" style="animation: moneyParticle ${3.2 + idx * 0.3}s linear infinite"/>
    `;
  });

  // Edges to infrastructure
  infraPositions.forEach((inf, idx) => {
    const targetCase = casePositions[idx % casePositions.length];
    edgesG.innerHTML += `
      <line x1="${targetCase.x}" y1="${targetCase.y}" x2="${inf.x}" y2="${inf.y}" stroke="rgba(255,170,51,0.2)" stroke-width="1" stroke-dasharray="2 4"/>
    `;
  });

  svg.appendChild(edgesG);

  // Render Nodes
  const nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Center Node: ACC_013041
  const centerG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  centerG.style.cursor = 'pointer';
  centerG.innerHTML = `
    <circle cx="${cx}" cy="${cy}" r="48" fill="none" stroke="rgba(255,45,45,0.4)" stroke-width="1" style="animation: mapNodeRing 2.5s ease-out infinite"/>
    <circle cx="${cx}" cy="${cy}" r="38" fill="rgba(5,18,38,0.95)" stroke="#FF2D2D" stroke-width="2.5" filter="url(#netCoreGlow)"/>
    <circle cx="${cx}" cy="${cy}" r="30" fill="rgba(255,45,45,0.15)"/>
    <text x="${cx}" y="${cy + 5}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">
      ACC_013041
    </text>
    <text x="${cx}" y="${cy + 56}" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="700" fill="#FF5555" text-anchor="middle" letter-spacing="1">
      PRIMARY MULE CORE
    </text>
  `;
  centerG.addEventListener('click', () => {
    if (onSelectCallback) onSelectCallback(NODE_TELEMETRY['ACC_013041']);
  });
  nodesG.appendChild(centerG);

  // Orbit 1: Mule Nodes
  mulePositions.forEach(m => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = 'pointer';
    g.innerHTML = `
      <circle cx="${m.x}" cy="${m.y}" r="22" fill="rgba(4,14,28,0.95)" stroke="#FFAA33" stroke-width="1.8" filter="url(#nodeGlowBlue)"/>
      <text x="${m.x}" y="${m.y + 4}" font-family="'Space Grotesk', monospace" font-size="7.5" font-weight="700" fill="#FFAA33" text-anchor="middle">
        ${m.label.replace('ACC_', '')}
      </text>
      <text x="${m.x}" y="${m.y + 34}" font-family="'Space Grotesk', sans-serif" font-size="9" font-weight="600" fill="#F3F7FA" text-anchor="middle">
        ${m.label}
      </text>
      <text x="${m.x}" y="${m.y + 45}" font-family="'Space Grotesk', sans-serif" font-size="7.5" fill="#8EA5B8" text-anchor="middle">
        ${m.amount}
      </text>
    `;
    g.addEventListener('click', () => {
      const tel = NODE_TELEMETRY[m.id] || { id: m.id, label: m.label, role: m.role, bank: m.bank, amount: m.amount };
      if (onSelectCallback) onSelectCallback(tel);
    });
    nodesG.appendChild(g);
  });

  // Orbit 2: Case Nodes
  casePositions.forEach(c => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = 'pointer';
    g.innerHTML = `
      <rect x="${c.x - 45}" y="${c.y - 16}" width="90" height="32" rx="6" fill="rgba(3,10,22,0.92)" stroke="rgba(53,169,255,0.4)" stroke-width="1.2"/>
      <text x="${c.x}" y="${c.y}" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="700" fill="#35A9FF" text-anchor="middle">
        ${c.id}
      </text>
      <text x="${c.x}" y="${c.y + 11}" font-family="'Space Grotesk', sans-serif" font-size="7" fill="rgba(142,165,184,0.7)" text-anchor="middle">
        ${c.type} &middot; ${c.similarity}
      </text>
    `;
    g.addEventListener('click', () => {
      if (onSelectCallback) onSelectCallback({ id: c.id, label: `${c.id} (Linked Case)`, role: c.type, similarity: c.similarity, state: c.state });
    });
    nodesG.appendChild(g);
  });

  // Orbit 3: Infra Nodes
  infraPositions.forEach(inf => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.style.cursor = 'pointer';
    g.innerHTML = `
      <circle cx="${inf.x}" cy="${inf.y}" r="14" fill="rgba(4,12,24,0.9)" stroke="rgba(255,45,45,0.5)" stroke-width="1" stroke-dasharray="3 2"/>
      <circle cx="${inf.x}" cy="${inf.y}" r="4" fill="#FF5555"/>
      <text x="${inf.x}" y="${inf.y + 24}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="600" fill="#8EA5B8" text-anchor="middle">
        ${inf.label}
      </text>
    `;
    g.addEventListener('click', () => {
      if (onSelectCallback) onSelectCallback({ id: inf.id, label: inf.label, role: 'Syndicate Infrastructure', description: inf.desc });
    });
    nodesG.appendChild(g);
  });

  svg.appendChild(nodesG);
  container.appendChild(svg);

  // Minimal floating tactical controls on the network canvas
  renderNetworkControls(container);
}

function renderNetworkControls(container) {
  let controls = document.getElementById('network-canvas-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'network-canvas-controls';
    controls.className = 'canvas-hud-controls';
    container.appendChild(controls);
  }

  controls.innerHTML = `
    <div class="hud-telemetry-pill">
      <span class="hud-dot blue"></span>
      <span>ORBITAL TOPOLOGY // 14 NODES LINKED ACROSS 3 FORENSIC LAYERS</span>
    </div>
  `;
}

/* =====================================================
   MODE 4: TEMPORAL INVESTIGATION TIMELINE-NETWORK HYBRID
   Connected historical cases across time
   ===================================================== */
export function renderHistoryCanvas(containerId = 'investigation-canvas') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const W = container.clientWidth || 1200;
  const H = container.clientHeight || 700;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.inset = '0';
  svg.style.overflow = 'visible';

  // HUD Title
  const hudG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  hudG.innerHTML = `
    <text x="40" y="44" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600" fill="rgba(53,169,255,0.7)" letter-spacing="3">
      TEMPORAL FORENSIC TIMELINE // CROSS-CASE SYNDICATE TRACE
    </text>
    <text x="40" y="64" font-family="'Space Grotesk', monospace" font-size="9" fill="rgba(142,165,184,0.4)" letter-spacing="1.5">
      TARGET: CASE_007001 &middot; 5 LINKED HISTORICAL INVESTIGATIONS &middot; RECURRING SIGNATURES IDENTIFIED
    </text>
    <line x1="40" y1="76" x2="480" y2="76" stroke="rgba(53,169,255,0.15)" stroke-width="1"/>
  `;
  svg.appendChild(hudG);

  // Chronological Timeline Axis
  const axisY = H * 0.52;
  const startX = 120;
  const endX = W - 120;
  const totalSlots = HISTORICAL_CASES.length + 1; // +1 for Active Case
  const slotWidth = (endX - startX) / totalSlots;

  const axisG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  axisG.innerHTML = `
    <!-- Main horizontal timeline bar -->
    <line x1="${startX - 40}" y1="${axisY}" x2="${endX + 40}" y2="${axisY}" stroke="rgba(53,169,255,0.2)" stroke-width="2"/>
    <line x1="${startX - 40}" y1="${axisY}" x2="${endX + 40}" y2="${axisY}" stroke="#35A9FF" stroke-width="3" stroke-linecap="round"
      stroke-dasharray="16 ${W}" style="animation: moneyParticle 4s linear infinite"/>
  `;
  svg.appendChild(axisG);

  // Plot Historical Cases chronologically + Active Case at current time
  const nodesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  HISTORICAL_CASES.forEach((c, idx) => {
    const x = startX + idx * slotWidth;
    const isAbove = idx % 2 === 0;
    const cardY = isAbove ? axisY - 140 : axisY + 40;

    // Synaptic thread connecting case to timeline
    nodesG.innerHTML += `
      <!-- Synaptic thread -->
      <line x1="${x}" y1="${axisY}" x2="${x}" y2="${isAbove ? cardY + 90 : cardY}" stroke="rgba(53,169,255,0.3)" stroke-width="1.2" stroke-dasharray="3 3"/>

      <!-- Timeline Node Pip -->
      <circle cx="${x}" cy="${axisY}" r="7" fill="rgba(5,18,38,0.95)" stroke="#35A9FF" stroke-width="2"/>
      <circle cx="${x}" cy="${axisY}" r="3" fill="#35A9FF"/>
      <text x="${x}" y="${axisY + (isAbove ? 20 : -14)}" font-family="'Space Grotesk', monospace" font-size="8.5" font-weight="600" fill="rgba(142,165,184,0.6)" text-anchor="middle">
        ${c.date}
      </text>

      <!-- Case Card on Timeline -->
      <g style="cursor:pointer;" class="hist-card-group" data-hist-id="${c.caseId}">
        <rect x="${x - 85}" y="${cardY}" width="170" height="92" rx="8" fill="rgba(4,14,28,0.92)"
          stroke="${c.similarity > 97 ? 'rgba(255,45,45,0.5)' : 'rgba(53,169,255,0.35)'}" stroke-width="1.2"
          filter="drop-shadow(0 4px 16px rgba(0,0,0,0.7))"/>

        <!-- Match Banner -->
        <text x="${x - 72}" y="${cardY + 20}" font-family="'Space Grotesk', monospace" font-size="10" font-weight="800" fill="#F3F7FA">
          ${c.caseId}
        </text>
        <rect x="${x + 25}" y="${cardY + 8}" width="48" height="16" rx="3" fill="${c.similarity > 97 ? 'rgba(255,45,45,0.2)' : 'rgba(53,169,255,0.15)'}"/>
        <text x="${x + 49}" y="${cardY + 20}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" fill="${c.similarity > 97 ? '#FF5555' : '#35A9FF'}" text-anchor="middle">
          ${c.similarity}%
        </text>

        <!-- Details -->
        <text x="${x - 72}" y="${cardY + 38}" font-family="'Space Grotesk', sans-serif" font-size="8.5" font-weight="600" fill="#35A9FF">
          ${c.amount} &middot; ${c.state}
        </text>
        <text x="${x - 72}" y="${cardY + 54}" font-family="'Space Grotesk', sans-serif" font-size="7.5" fill="#8EA5B8">
          ${c.title.length > 28 ? c.title.slice(0, 26) + '…' : c.title}
        </text>
        <text x="${x - 72}" y="${cardY + 70}" font-family="'Space Grotesk', monospace" font-size="7" font-weight="600" fill="${c.similarity > 97 ? '#FFAA33' : '#35A9FF'}">
          ${c.status}
        </text>
      </g>
    `;
  });

  // Current Active Case (CASE_007001) highlighted as the active anchor
  const activeX = startX + HISTORICAL_CASES.length * slotWidth;
  const activeCardY = axisY - 160;

  nodesG.innerHTML += `
    <!-- Active Case connecting thread -->
    <line x1="${activeX}" y1="${axisY}" x2="${activeX}" y2="${activeCardY + 110}" stroke="rgba(255,45,45,0.7)" stroke-width="2"/>

    <!-- Glowing Active Timeline Pip -->
    <circle cx="${activeX}" cy="${axisY}" r="12" fill="none" stroke="rgba(255,45,45,0.6)" stroke-width="1.5" style="animation: mapNodeRing 2s ease-out infinite"/>
    <circle cx="${activeX}" cy="${axisY}" r="8" fill="rgba(5,18,38,0.95)" stroke="#FF2D2D" stroke-width="2.5"/>
    <circle cx="${activeX}" cy="${axisY}" r="3" fill="#FF2D2D"/>
    <text x="${activeX}" y="${axisY + 24}" font-family="'Space Grotesk', monospace" font-size="9" font-weight="800" fill="#FF5555" text-anchor="middle">
      NOW &middot; 12 SEP 2025
    </text>

    <!-- Active Case Anchor Box -->
    <g style="cursor:pointer;" class="hist-card-group active" data-hist-id="CASE_007001">
      <rect x="${activeX - 95}" y="${activeCardY}" width="190" height="110" rx="8" fill="rgba(6,18,36,0.95)"
        stroke="#FF2D2D" stroke-width="2" filter="drop-shadow(0 0 20px rgba(255,45,45,0.3))"/>
      <rect x="${activeX - 95}" y="${activeCardY}" width="4" height="110" rx="2" fill="#FF2D2D"/>

      <text x="${activeX - 80}" y="${activeCardY + 24}" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="800" fill="#F3F7FA">
        CASE_007001
      </text>
      <rect x="${activeX + 22}" y="${activeCardY + 10}" width="60" height="18" rx="3" fill="rgba(255,45,45,0.2)"/>
      <text x="${activeX + 52}" y="${activeCardY + 23}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" fill="#FF5555" text-anchor="middle">
        ACTIVE OBJ
      </text>

      <text x="${activeX - 80}" y="${activeCardY + 46}" font-family="'Space Grotesk', sans-serif" font-size="10" font-weight="600" fill="#35A9FF">
        ₹1,00,250 &middot; Goa (GA)
      </text>
      <text x="${activeX - 80}" y="${activeCardY + 64}" font-family="'Space Grotesk', monospace" font-size="8.5" fill="#8EA5B8">
        Primary Mule: ACC_013041
      </text>
      <text x="${activeX - 80}" y="${activeCardY + 82}" font-family="'Space Grotesk', monospace" font-size="8" fill="#FFAA33">
        Syndicate: Golden Triangle Module
      </text>
      <text x="${activeX - 80}" y="${activeCardY + 98}" font-family="'Space Grotesk', sans-serif" font-size="7.5" font-weight="600" fill="#22C55E">
        UNDER ACTIVE INVESTIGATION
      </text>
    </g>
  `;

  svg.appendChild(nodesG);
  container.appendChild(svg);

  // Wire click events on historical case cards
  container.querySelectorAll('.hist-card-group').forEach(card => {
    card.addEventListener('click', () => {
      const caseId = card.getAttribute('data-hist-id');
      const caseData = HISTORICAL_CASES.find(c => c.caseId === caseId);
      if (caseData && onSelectCallback) {
        onSelectCallback({
          id: caseData.caseId,
          label: caseData.title,
          role: 'Historical Matched Case',
          similarity: `${caseData.similarity}% Match`,
          amount: caseData.amount,
          date: caseData.date,
          state: caseData.state,
          sharedPattern: caseData.sharedLink,
          status: caseData.status
        });
      }
    });
  });

  // Minimal floating tactical controls on the history canvas
  renderHistoryControls(container);
}

function renderHistoryControls(container) {
  let controls = document.getElementById('history-canvas-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'history-canvas-controls';
    controls.className = 'canvas-hud-controls';
    container.appendChild(controls);
  }

  controls.innerHTML = `
    <div class="hud-telemetry-pill">
      <span class="hud-dot red"></span>
      <span>PATTERN MATCH: 5 LINKED CASES REVEAL IDENTICAL AXIS/HDFC MULE EXTRACTION MO</span>
    </div>
  `;
}
