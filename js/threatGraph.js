/* =====================================================
   CYBERCRASH — Threat Monitoring Mini Graph
   ===================================================== */

/**
 * Draws a continuously animating threat activity line graph
 * on the canvas element inside the monitoring panel.
 */
export function initThreatGraph(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // Set actual pixel dimensions
  canvas.width = canvas.offsetWidth || 148;
  canvas.height = 40;

  const W = canvas.width;
  const H = canvas.height;

  // Generate random-ish threat data
  let points = [];
  for (let i = 0; i < 80; i++) {
    points.push(generateThreatValue(i));
  }

  let offset = 0;

  function generateThreatValue(i) {
    // Simulate spikes + base activity
    const base = 18;
    const spike = Math.random() > 0.88 ? Math.random() * 20 : 0;
    return base + Math.sin(i * 0.4) * 6 + Math.random() * 4 + spike;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(2, 9, 18, 0.0)';
    ctx.fillRect(0, 0, W, H);

    // Push new data point
    points.shift();
    points.push(generateThreatValue(points.length));

    const step = W / (points.length - 1);

    // Area fill (gradient)
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(53, 169, 255, 0.25)');
    grad.addColorStop(1, 'rgba(53, 169, 255, 0.00)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    points.forEach((p, i) => {
      const x = i * step;
      const y = H - (p / 45) * H;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line stroke
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = i * step;
      const y = H - (p / 45) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = 'rgba(53, 169, 255, 0.80)';
    ctx.lineWidth = 1.2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Red spike highlight — find max point
    let maxVal = 0, maxIdx = 0;
    points.forEach((p, i) => { if (p > maxVal) { maxVal = p; maxIdx = i; } });
    const sx = maxIdx * step;
    const sy = H - (maxVal / 45) * H;
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FF2D2D';
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();
}
