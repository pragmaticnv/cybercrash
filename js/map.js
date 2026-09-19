/* =====================================================
   CYBERCRASH — India Threat Map (SVG + Animation)
   High-fidelity India outline for cyber intelligence visualization
   ===================================================== */

const MAP_VIEWBOX_W = 500;
const MAP_VIEWBOX_H = 600;

// High-fidelity India outline path — geographic silhouette
// Coordinate system: 0,0 top-left, viewbox 500×600
// Covers mainland India + Kashmir + NE states
const INDIA_MAIN = `
  M 243,18
  C 248,16 255,14 265,15 C 275,16 282,20 290,22
  C 300,24 312,22 320,26 C 330,30 336,38 342,44
  C 350,50 358,52 364,58 C 370,64 372,74 374,82
  C 376,90 372,98 368,104 C 364,110 356,114 352,120
  C 348,126 348,134 352,140 C 356,146 364,150 370,158
  C 378,166 382,176 384,186 C 386,196 384,208 380,218
  C 376,228 368,236 366,246 C 364,256 368,266 366,276
  C 364,288 356,298 350,310 C 344,322 338,334 330,346
  C 322,358 312,368 304,380 C 296,392 290,406 282,418
  C 274,430 264,442 256,454 C 250,464 244,474 240,482
  C 236,490 232,498 228,506 C 224,514 220,520 218,524
  C 216,520 212,514 208,506
  C 204,498 200,490 196,482
  C 190,470 184,458 178,446
  C 170,432 160,420 152,408
  C 144,396 138,382 130,370
  C 122,358 112,348 106,336
  C 100,324 96,312 90,300
  C 84,288 76,278 72,266
  C 68,254 68,242 70,230
  C 72,218 78,208 82,198
  C 86,188 88,178 86,168
  C 84,158 78,150 76,140
  C 74,130 76,120 80,110
  C 84,100 92,92 98,84
  C 104,76 108,66 114,58
  C 120,50 130,44 140,40
  C 150,36 160,34 170,30
  C 180,26 190,22 200,20
  C 210,18 220,18 230,18
  C 236,18 240,18 243,18 Z
`;

// Kashmir & northern extension
const KASHMIR = `
  M 243,18
  C 238,14 232,10 224,8 C 216,6 208,8 200,12
  C 192,16 186,22 182,28 C 178,34 178,42 182,48
  C 186,52 192,54 198,52 C 204,50 208,44 214,42
  C 218,40 224,42 228,40 C 234,38 238,32 243,28 C 244,24 244,20 243,18 Z
  M 243,18
  C 248,14 256,10 265,8 C 274,6 282,10 290,14
  C 298,18 303,24 302,30 C 300,36 292,38 286,36
  C 280,34 275,28 268,26 C 260,24 252,24 248,22
  C 245,20 244,18 243,18 Z
`;

// Northeast states (Assam, Meghalaya, Nagaland etc.)
const NORTHEAST = `
  M 374,82
  C 382,78 392,74 402,76 C 412,78 420,86 424,96
  C 428,106 426,118 420,126 C 414,134 404,138 396,136
  C 388,134 382,128 378,120 C 374,112 372,102 374,92
  C 374,88 374,84 374,82 Z
`;

// Sri Lanka (tiny island)
const SRILANKA = `
  M 235,560 C 240,552 248,546 252,554 C 256,562 250,572 242,572 C 236,570 233,566 235,560 Z
`;

// Andaman & Nicobar chain (dots)
const ANDAMAN = [
  { cx: 430, cy: 460, r: 3.5 },
  { cx: 428, cy: 480, r: 2.8 },
  { cx: 426, cy: 498, r: 2.2 },
  { cx: 424, cy: 514, r: 1.8 },
];

// Lakshadweep (dots far left)
const LAKSHADWEEP = [
  { cx: 68, cy: 390, r: 2 },
  { cx: 72, cy: 406, r: 1.5 },
];

// Major threat nodes: [cx, cy, city, animClass, delay]
const THREAT_NODES = [
  { cx: 220, cy: 102, city: 'New Delhi',  anim: 'node-pulse-1', delay: '0.0s'  },
  { cx: 330, cy: 196, city: 'Kolkata',    anim: 'node-pulse-2', delay: '0.5s'  },
  { cx: 162, cy: 210, city: 'Ahmedabad',  anim: 'node-pulse-3', delay: '1.0s'  },
  { cx: 175, cy: 288, city: 'Mumbai',     anim: 'node-pulse-4', delay: '1.4s'  },
  { cx: 252, cy: 336, city: 'Hyderabad',  anim: 'node-pulse-5', delay: '0.7s'  },
  { cx: 300, cy: 400, city: 'Chennai',    anim: 'node-pulse-6', delay: '1.9s'  },
  { cx: 172, cy: 155, city: 'Jaipur',     anim: 'node-pulse-7', delay: '0.3s'  },
  { cx: 268, cy: 252, city: 'Nagpur',     anim: 'node-pulse-8', delay: '1.2s'  },
  { cx: 232, cy: 420, city: 'Bengaluru',  anim: 'node-pulse-9', delay: '2.1s'  },
  { cx: 296, cy: 148, city: 'Patna',      anim: 'node-pulse-1', delay: '0.9s'  },
];

// Connection arcs between threat cities
const ARCS = [
  [0, 1],  // Delhi → Kolkata
  [0, 4],  // Delhi → Hyderabad
  [2, 3],  // Ahmedabad → Mumbai
  [4, 5],  // Hyderabad → Chennai
  [3, 8],  // Mumbai → Bengaluru
  [1, 7],  // Kolkata → Nagpur
  [0, 3],  // Delhi → Mumbai
  [5, 8],  // Chennai → Bengaluru
  [6, 9],  // Jaipur → Patna
];

function makeCubicArc(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - dist * 0.38;
  return `M ${x1},${y1} Q ${mx},${my} ${x2},${y2}`;
}

// Estimate rough arc length for dasharray
function arcLength(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy) * 1.5; // approximate
}

export function buildThreatMap() {
  const container = document.getElementById('india-map-container');
  if (!container) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'india-threat-map');
  svg.setAttribute('viewBox', `0 0 ${MAP_VIEWBOX_W} ${MAP_VIEWBOX_H}`);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('overflow', 'visible');

  svg.innerHTML = `
    <defs>
      <filter id="nodeGlow" x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="outlineGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="indiaFill" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="rgba(20,55,100,0.28)"/>
        <stop offset="100%" stop-color="rgba(5,15,35,0.08)"/>
      </radialGradient>
      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,45,45,0.8)"/>
        <stop offset="100%" stop-color="rgba(255,100,100,0.2)"/>
      </linearGradient>
    </defs>

    <!-- Subtle lat/lon grid -->
    <line x1="80" y1="200" x2="440" y2="200" stroke="rgba(53,169,255,0.04)" stroke-width="0.6" stroke-dasharray="5 10"/>
    <line x1="80" y1="300" x2="440" y2="300" stroke="rgba(53,169,255,0.04)" stroke-width="0.6" stroke-dasharray="5 10"/>
    <line x1="80" y1="400" x2="440" y2="400" stroke="rgba(53,169,255,0.04)" stroke-width="0.6" stroke-dasharray="5 10"/>
    <line x1="200" y1="10" x2="200" y2="580" stroke="rgba(53,169,255,0.04)" stroke-width="0.6" stroke-dasharray="5 10"/>
    <line x1="300" y1="10" x2="300" y2="580" stroke="rgba(53,169,255,0.04)" stroke-width="0.6" stroke-dasharray="5 10"/>
    <line x1="150" y1="10" x2="150" y2="580" stroke="rgba(53,169,255,0.03)" stroke-width="0.5" stroke-dasharray="5 10"/>
    <line x1="350" y1="10" x2="350" y2="580" stroke="rgba(53,169,255,0.03)" stroke-width="0.5" stroke-dasharray="5 10"/>

    <!-- India fill (subtle) -->
    <path d="${INDIA_MAIN}" fill="url(#indiaFill)" stroke="none"/>
    <path d="${KASHMIR}" fill="url(#indiaFill)" stroke="none"/>
    <path d="${NORTHEAST}" fill="url(#indiaFill)" stroke="none"/>
    <path d="${SRILANKA}" fill="rgba(15,45,90,0.18)" stroke="rgba(53,169,255,0.18)" stroke-width="0.8"/>

    <!-- India outline (glowing blue) -->
    <path d="${INDIA_MAIN}" class="india-outline" filter="url(#outlineGlow)"/>
    <path d="${KASHMIR}" class="india-outline" stroke-opacity="0.65" stroke-width="1"/>
    <path d="${NORTHEAST}" class="india-outline" stroke-opacity="0.55" stroke-width="1"/>

    <!-- Andaman dots -->
    ${ANDAMAN.map(d => `
      <circle cx="${d.cx}" cy="${d.cy}" r="${d.r}"
        fill="rgba(15,45,90,0.2)" stroke="rgba(53,169,255,0.35)" stroke-width="0.8"/>
    `).join('')}

    <!-- Lakshadweep dots -->
    ${LAKSHADWEEP.map(d => `
      <circle cx="${d.cx}" cy="${d.cy}" r="${d.r}"
        fill="rgba(15,45,90,0.2)" stroke="rgba(53,169,255,0.25)" stroke-width="0.6"/>
    `).join('')}

    <!-- Geographic label -->
    <text class="india-label" x="228" y="295" text-anchor="middle">INDIA</text>

    <!-- Arc connections (background static) -->
    ${ARCS.map(([i, j]) => {
      const a = THREAT_NODES[i], b = THREAT_NODES[j];
      const d = makeCubicArc(a.cx, a.cy, b.cx, b.cy);
      return `<path class="threat-arc" d="${d}" filter="url(#lineGlow)"/>`;
    }).join('')}

    <!-- Arc particles (animated) -->
    ${ARCS.map(([i, j], idx) => {
      const a = THREAT_NODES[i], b = THREAT_NODES[j];
      const d = makeCubicArc(a.cx, a.cy, b.cx, b.cy);
      const len = arcLength(a.cx, a.cy, b.cx, b.cy);
      const animClass = `arc-p${(idx % 7) + 1}`;
      return `<path class="arc-particle ${animClass}" d="${d}" stroke-dasharray="10 ${len}"/>`;
    }).join('')}

    <!-- Threat nodes -->
    ${THREAT_NODES.map((n) => `
      <g class="threat-node-group">
        <circle cx="${n.cx}" cy="${n.cy}" r="10" class="threat-node-ring"
          style="animation-delay: ${n.delay}"/>
        <circle cx="${n.cx}" cy="${n.cy}" r="10" class="threat-node-ring-2"
          style="animation-delay: calc(${n.delay} + 0.8s)"/>
        <circle cx="${n.cx}" cy="${n.cy}" r="4.5"
          class="threat-node-core ${n.anim}"
          filter="url(#nodeGlow)"
          style="animation-delay: ${n.delay}"/>
      </g>
    `).join('')}
  `;

  container.appendChild(svg);
}
