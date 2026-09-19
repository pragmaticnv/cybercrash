/* =====================================================
   CYBERCRASH — Background Particle System
   ===================================================== */

/**
 * Spawns subtle floating particles in the background
 * to give the page a live, atmospheric feel.
 */
export function initParticles(containerId, count = 35) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const particleLayer = document.createElement('div');
  particleLayer.className = 'particle-layer';
  particleLayer.style.cssText = `
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 2;
  `;
  container.appendChild(particleLayer);

  for (let i = 0; i < count; i++) {
    spawnParticle(particleLayer);
  }
}

function spawnParticle(container) {
  const p = document.createElement('div');

  const size   = Math.random() * 2 + 1;          // 1–3px
  const left   = Math.random() * 100;             // % across
  const bottom = Math.random() * 60;              // % up from bottom
  const dur    = Math.random() * 8 + 6;           // 6–14s
  const delay  = Math.random() * 10;              // stagger

  // Colour: mostly blue, occasional red
  const isRed = Math.random() < 0.12;
  const color = isRed
    ? `rgba(255, 45, 45, ${Math.random() * 0.4 + 0.2})`
    : `rgba(53, 169, 255, ${Math.random() * 0.4 + 0.15})`;

  p.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${color};
    left: ${left}%;
    bottom: ${bottom}%;
    box-shadow: 0 0 ${size * 3}px ${color};
    animation: particleDrift ${dur}s ease-in-out ${delay}s infinite;
  `;

  container.appendChild(p);

  // Recycle after one cycle
  p.addEventListener('animationiteration', () => {
    p.style.left   = `${Math.random() * 100}%`;
    p.style.bottom = `${Math.random() * 60}%`;
  });
}
