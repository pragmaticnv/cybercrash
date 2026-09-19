/* =====================================================
   CYBERCRASH LEA — Dominant Geographic Hotspot Engine
   Full-Canvas Tactical Cyber Intelligence Map
   Spotlight: GOA (GA_Z05 - 97.9%) with progressive reveals
   ===================================================== */

import { HOTSPOT_DATA } from './data.js';

let activeLayers = {
  atmCluster: true,
  timeWindow: true,
  candidateZones: true,
};

let onHotspotSelectCallback = null;

export function setOnHotspotSelect(cb) {
  onHotspotSelectCallback = cb;
}

export function toggleLayer(layerKey) {
  if (activeLayers.hasOwnProperty(layerKey)) {
    activeLayers[layerKey] = !activeLayers[layerKey];
    renderHotspotCanvas();
  }
}

// Coordinate system: 1000 × 700 full canvas viewBox
const VW = 1000;
const VH = 700;

// High-precision India mainland outline scaled for 1000×700 canvas
const INDIA_MAIN_PATH = `
  M 500,28
  C 512,24 528,22 546,26 C 564,30 580,36 596,42
  C 614,48 628,46 644,52 C 662,58 674,70 682,82
  C 694,94 706,100 718,112 C 730,124 734,142 736,158
  C 740,176 730,192 722,204 C 712,216 698,226 688,238
  C 678,250 676,266 682,278 C 688,290 704,296 716,312
  C 730,330 736,352 736,374 C 736,396 728,418 718,436
  C 708,454 694,470 684,488 C 674,510 672,534 662,556
  C 652,578 638,596 620,614 C 602,632 580,648 562,666
  C 544,684 526,702 512,720 C 496,702 480,684 466,666
  C 448,648 430,630 414,612 C 396,592 382,570 368,548
  C 350,526 332,504 318,482 C 300,456 286,434 270,410
  C 250,384 238,360 226,336 C 214,312 200,288 190,264
  C 182,240 178,214 182,190 C 184,166 196,144 206,122
  C 214,102 218,80  214,58  C 212,36  200,18  196,-2
  C 216,6   236,16  256,22  C 278,28  296,22  316,14
  C 336,6   358,4   380,8   C 402,12  424,18  446,22
  C 468,26  484,28  500,28 Z
`;

const KASHMIR_PATH = `
  M 500,28 C 490,18 478,12 464,8 C 450,4 436,8 422,14
  C 408,20 396,30 390,42 C 384,52 386,64 394,70
  C 402,74 414,68 426,64 C 438,60 452,60 464,54
  C 476,48 488,36 500,28 Z
  M 500,28 C 510,18 522,12 536,8 C 550,4 564,12 576,18
  C 588,26 594,38 590,48 C 584,56 570,60 556,56
  C 542,52 526,44 512,34 C 506,30 502,28 500,28 Z
`;

const NORTHEAST_PATH = `
  M 736,158 C 754,148 774,142 792,146 C 810,150 824,162 830,180
  C 836,198 830,220 818,236 C 806,252 788,258 772,254
  C 758,250 744,242 736,226 C 730,214 730,190 736,174 Z
`;

// Regional Pin Coordinates
const GOA_COORD = { x: 372, y: 535 };
const ZONES_COORDS = {
  'GA_Z05': { x: 372, y: 535, label: 'GOA (GA_Z05)', score: '97.9%', isPrimary: true },
  'MH_Z12': { x: 388, y: 445, label: 'MAHARASHTRA (MH_Z12)', score: '91.4%' },
  'KA_Z08': { x: 446, y: 580, label: 'KARNATAKA (KA_Z08)', score: '87.6%' },
  'DL_Z03': { x: 452, y: 220, label: 'DELHI (DL_Z03)', score: '82.1%' },
  'TN_Z07': { x: 494, y: 625, label: 'TAMIL NADU (TN_Z07)', score: '78.9%' },
};

export function renderHotspotCanvas(containerId = 'investigation-canvas') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const W = container.clientWidth || 1200;
  const H = container.clientHeight || 700;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.inset = '0';
  svg.style.overflow = 'visible';

  svg.innerHTML = `
    <defs>
      <!-- Glow Filters -->
      <filter id="hotspotRedGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="blur1"/>
        <feGaussianBlur stdDeviation="3" result="blur2"/>
        <feMerge>
          <feMergeNode in="blur1"/>
          <feMergeNode in="blur2"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="mapLineGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <radialGradient id="goaThreatGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(255,45,45,0.45)"/>
        <stop offset="60%" stop-color="rgba(255,45,45,0.12)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="gridSweepGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(53,169,255,0.02)"/>
        <stop offset="50%" stop-color="rgba(53,169,255,0.08)"/>
        <stop offset="100%" stop-color="rgba(53,169,255,0.02)"/>
      </linearGradient>
    </defs>
  `;

  // Tactical HUD Canvas Coordinates and Scale Markings
  const hudG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  hudG.innerHTML = `
    <text x="40" y="44" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600" fill="rgba(255,45,45,0.85)" letter-spacing="3">
      TACTICAL GEOGRAPHIC INTELLIGENCE // NATIONAL HOTSPOT RADAR
    </text>
    <text x="40" y="64" font-family="'Space Grotesk', monospace" font-size="9" fill="rgba(142,165,184,0.4)" letter-spacing="1.5">
      TARGET: GOA &middot; ZONE: GA_Z05 &middot; MODEL CONFIDENCE: 97.9% &middot; WINDOW: 6 – 9 PM
    </text>
    <line x1="40" y1="76" x2="480" y2="76" stroke="rgba(255,45,45,0.25)" stroke-width="1"/>

    <!-- Latitude / Longitude Tactical Grid -->
    <line x1="150" y1="50" x2="150" y2="660" stroke="rgba(53,169,255,0.04)" stroke-width="0.5" stroke-dasharray="4 8"/>
    <line x1="372" y1="50" x2="372" y2="660" stroke="rgba(255,45,45,0.08)" stroke-width="0.5" stroke-dasharray="4 6"/>
    <line x1="700" y1="50" x2="700" y2="660" stroke="rgba(53,169,255,0.04)" stroke-width="0.5" stroke-dasharray="4 8"/>
    <line x1="50" y1="535" x2="950" y2="535" stroke="rgba(255,45,45,0.08)" stroke-width="0.5" stroke-dasharray="4 6"/>
  `;
  svg.appendChild(hudG);

  // Dominant India Map Outlines (Centerpiece)
  const mapG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  mapG.setAttribute('class', 'dominant-india-map');

  // Fill
  mapG.innerHTML = `
    <path d="${INDIA_MAIN_PATH}" fill="rgba(7, 24, 46, 0.45)" stroke="none"/>
    <path d="${KASHMIR_PATH}" fill="rgba(7, 24, 46, 0.45)" stroke="none"/>
    <path d="${NORTHEAST_PATH}" fill="rgba(7, 24, 46, 0.45)" stroke="none"/>

    <!-- Outer glowing cyber vector strokes -->
    <path d="${INDIA_MAIN_PATH}" fill="none" stroke="rgba(53,169,255,0.4)" stroke-width="1.6" filter="url(#mapLineGlow)"/>
    <path d="${KASHMIR_PATH}" fill="none" stroke="rgba(53,169,255,0.3)" stroke-width="1.2"/>
    <path d="${NORTHEAST_PATH}" fill="none" stroke="rgba(53,169,255,0.3)" stroke-width="1.2"/>

    <!-- Subtle geo label -->
    <text x="470" y="380" font-family="'Space Grotesk', sans-serif" font-size="18" font-weight="800"
      letter-spacing="12" fill="rgba(53,169,255,0.07)" text-anchor="middle">
      INDIA
    </text>
  `;
  svg.appendChild(mapG);

  // Candidate Zones & Inter-zone Arcs (if active)
  if (activeLayers.candidateZones) {
    const zonesG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Object.entries(ZONES_COORDS).forEach(([zoneId, zData]) => {
      if (zoneId === 'GA_Z05') return; // Handled specially

      // Arc from candidate zone to Goa
      const dx = GOA_COORD.x - zData.x;
      const dy = GOA_COORD.y - zData.y;
      const dist = Math.hypot(dx, dy);
      const mx = (GOA_COORD.x + zData.x) / 2 + 25;
      const my = (GOA_COORD.y + zData.y) / 2 - 20;

      const arcD = `M ${zData.x},${zData.y} Q ${mx},${my} ${GOA_COORD.x},${GOA_COORD.y}`;

      zonesG.innerHTML += `
        <!-- Flow line to Goa -->
        <path d="${arcD}" fill="none" stroke="rgba(53,169,255,0.22)" stroke-width="1" stroke-dasharray="3 5"/>
        <path d="${arcD}" fill="none" stroke="rgba(53,169,255,0.65)" stroke-width="2" stroke-linecap="round"
          stroke-dasharray="10 ${dist}" style="animation: moneyParticle 3.5s linear infinite"/>

        <!-- Candidate Node -->
        <circle cx="${zData.x}" cy="${zData.y}" r="6" fill="rgba(5,18,38,0.9)" stroke="#35A9FF" stroke-width="1.4"/>
        <text x="${zData.x + 12}" y="${zData.y + 4}" font-family="'Space Grotesk', monospace" font-size="9"
          font-weight="600" fill="#8EA5B8" letter-spacing="1">
          ${zData.label} &middot; <tspan fill="#35A9FF">${zData.score}</tspan>
        </text>
      `;
    });
    svg.appendChild(zonesG);
  }

  // PRIMARY SPOTLIGHT: GOA (GA_Z05)
  const goaG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  goaG.setAttribute('class', 'goa-spotlight-group');
  goaG.style.cursor = 'pointer';

  goaG.innerHTML = `
    <!-- Massive ambient threat glow -->
    <circle cx="${GOA_COORD.x}" cy="${GOA_COORD.y}" r="90" fill="url(#goaThreatGlow)"/>

    <!-- Pulsing sonar threat rings -->
    <circle cx="${GOA_COORD.x}" cy="${GOA_COORD.y}" r="35" fill="none" stroke="rgba(255,45,45,0.7)"
      stroke-width="1.5" style="animation: mapNodeRing 2.2s ease-out infinite"/>
    <circle cx="${GOA_COORD.x}" cy="${GOA_COORD.y}" r="65" fill="none" stroke="rgba(255,45,45,0.4)"
      stroke-width="1.2" style="animation: mapNodeRing 2.2s ease-out infinite 0.7s"/>
    <circle cx="${GOA_COORD.x}" cy="${GOA_COORD.y}" r="95" fill="none" stroke="rgba(255,45,45,0.2)"
      stroke-width="0.8" style="animation: mapNodeRing 2.2s ease-out infinite 1.4s"/>

    <!-- Reticle Crosshairs -->
    <line x1="${GOA_COORD.x - 24}" y1="${GOA_COORD.y}" x2="${GOA_COORD.x + 24}" y2="${GOA_COORD.y}" stroke="#FF2D2D" stroke-width="1.2"/>
    <line x1="${GOA_COORD.x}" y1="${GOA_COORD.y - 24}" x2="${GOA_COORD.x}" y2="${GOA_COORD.y + 24}" stroke="#FF2D2D" stroke-width="1.2"/>

    <!-- Core Center Node -->
    <circle cx="${GOA_COORD.x}" cy="${GOA_COORD.y}" r="12" fill="#FF2D2D" filter="url(#hotspotRedGlow)"/>
    <circle cx="${GOA_COORD.x}" cy="${GOA_COORD.y}" r="6" fill="#FFFFFF"/>

    <!-- Dominant Projected Callout (HUD on map) -->
    <g transform="translate(${GOA_COORD.x + 40}, ${GOA_COORD.y - 45})">
      <!-- Callout lead line -->
      <polyline points="-35,45 0,0 240,0" fill="none" stroke="rgba(255,45,45,0.6)" stroke-width="1.2"/>

      <!-- Backdrop box -->
      <rect x="0" y="-32" width="240" height="74" rx="6" fill="rgba(4,14,28,0.92)"
        stroke="rgba(255,45,45,0.45)" stroke-width="1.2" filter="drop-shadow(0 6px 20px rgba(0,0,0,0.8))"/>

      <!-- Accent Top Pip -->
      <rect x="0" y="-32" width="4" height="74" fill="#FF2D2D" rx="2"/>

      <!-- Readouts -->
      <text x="14" y="-14" font-family="'Space Grotesk', sans-serif" font-size="12" font-weight="800"
        fill="#FFFFFF" letter-spacing="2">
        GOA &middot; GA_Z05
      </text>
      <text x="14" y="4" font-family="'Space Grotesk', monospace" font-size="10" font-weight="600"
        fill="#FF2D2D" letter-spacing="1">
        CONFIDENCE: 97.9% [CRITICAL]
      </text>
      <text x="14" y="24" font-family="'Space Grotesk', sans-serif" font-size="9" font-weight="500"
        fill="#8EA5B8" letter-spacing="0.5">
        PRIMARY PREDICTED CASHOUT ZONE
      </text>
    </g>
  `;

  goaG.addEventListener('click', () => {
    if (onHotspotSelectCallback) {
      onHotspotSelectCallback({
        id: 'GA_Z05',
        label: 'GOA SECTOR 05',
        score: '97.9%',
        window: '6 – 9 PM',
        status: 'HIGH PROBABILITY CASHOUT'
      });
    }
  });

  svg.appendChild(goaG);

  // ATM Cluster Progressive Reveal (if active)
  if (activeLayers.atmCluster) {
    const atmG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    atmG.setAttribute('class', 'atm-cluster-group');

    const atms = [
      { id: 'ATM_GOA_01', x: GOA_COORD.x - 30, y: GOA_COORD.y - 45, name: 'ATM_GOA_01 (Calangute Beach)', amount: '₹40,000 WITHDRAWN' },
      { id: 'ATM_GOA_05', x: GOA_COORD.x - 10, y: GOA_COORD.y + 40, name: 'ATM_GOA_05 (Panaji Market)', amount: '₹20,000 PENDING' },
      { id: 'ATM_GOA_09', x: GOA_COORD.x - 45, y: GOA_COORD.y + 10, name: 'ATM_GOA_09 (Candolim Rd)', amount: 'PATROL SURVEILLANCE' },
    ];

    atms.forEach(atm => {
      atmG.innerHTML += `
        <g style="cursor:pointer;" class="atm-pin" data-atm-id="${atm.id}">
          <circle cx="${atm.x}" cy="${atm.y}" r="8" fill="rgba(5,18,38,0.95)" stroke="#FF5555" stroke-width="1.5"/>
          <circle cx="${atm.x}" cy="${atm.y}" r="3" fill="#FF2D2D"/>
          <text x="${atm.x - 10}" y="${atm.y - 12}" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700"
            fill="#FFAA33" letter-spacing="0.5" text-anchor="end">
            ${atm.name}
          </text>
          <text x="${atm.x - 10}" y="${atm.y - 2}" font-family="'Space Grotesk', sans-serif" font-size="7.5" font-weight="600"
            fill="#FF2D2D" text-anchor="end">
            ${atm.amount}
          </text>
        </g>
      `;
    });

    svg.appendChild(atmG);
  }

  // Temporal Window HUD (if active)
  if (activeLayers.timeWindow) {
    const timeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    timeG.setAttribute('transform', `translate(${GOA_COORD.x + 40}, ${GOA_COORD.y + 55})`);
    timeG.innerHTML = `
      <rect x="0" y="0" width="240" height="52" rx="6" fill="rgba(4,14,28,0.92)"
        stroke="rgba(53,169,255,0.3)" stroke-width="1"/>
      <text x="14" y="18" font-family="'Space Grotesk', monospace" font-size="9" font-weight="700"
        fill="#35A9FF" letter-spacing="2">
        WITHDRAWAL WINDOW // PROJECTION
      </text>
      <text x="14" y="38" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="800"
        fill="#FF2D2D" letter-spacing="2">
        6 – 9 PM <tspan font-size="10" fill="#8EA5B8" font-weight="500">(97.9% PROBABILITY)</tspan>
      </text>
    `;
    svg.appendChild(timeG);
  }

  container.appendChild(svg);

  // Minimal floating tactical layer controls on the investigation canvas (bottom-center)
  renderHotspotControls(container);
}

function renderHotspotControls(container) {
  let controls = document.getElementById('hotspot-canvas-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'hotspot-canvas-controls';
    controls.className = 'canvas-hud-controls';
    container.appendChild(controls);
  }

  controls.innerHTML = `
    <div class="hud-control-group">
      <button class="hud-btn ${activeLayers.timeWindow ? 'active' : ''}" id="btn-toggle-time">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>6–9 PM WINDOW</span>
      </button>
      <button class="hud-btn ${activeLayers.atmCluster ? 'active' : ''}" id="btn-toggle-atm">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="10" x2="12" y2="10"/>
        </svg>
        <span>ATM CLUSTER</span>
      </button>
      <button class="hud-btn ${activeLayers.candidateZones ? 'active' : ''}" id="btn-toggle-zones">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
        </svg>
        <span>CANDIDATE ZONES</span>
      </button>
    </div>
    <div class="hud-telemetry-pill">
      <span class="hud-dot red"></span>
      <span>SECTOR: GOA (GA_Z05) &middot; SCORE: 97.9%</span>
    </div>
  `;

  document.getElementById('btn-toggle-time')?.addEventListener('click', () => {
    toggleLayer('timeWindow');
  });

  document.getElementById('btn-toggle-atm')?.addEventListener('click', () => {
    toggleLayer('atmCluster');
  });

  document.getElementById('btn-toggle-zones')?.addEventListener('click', () => {
    toggleLayer('candidateZones');
  });
}
