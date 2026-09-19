import React, { useEffect, useRef } from 'react';

/**
 * CYBERCRASH INTELLIGENCE GRID
 * A subtle, engineered cyber network visualization running in the background.
 * Uses faint nodes, gentle pulse lines, technical coordinate grid marks, and tiny data labels.
 * Designed with very low opacity (< 0.15) to ensure it never interferes with text readability.
 */
export const CyberIntelligenceGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Static cyber grid points
    const numNodes = Math.min(32, Math.floor((width * height) / 45000));
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      pulseOffset: number;
      label: string;
    }> = [];

    const labels = [
      'NODE_01:NCRP_IN',
      'NODE_02:CFCFRMS',
      'NODE_03:MULE_GRAPH',
      'NODE_04:ATM_GEO',
      'NODE_05:XGB_RISK',
      'NODE_06:LEVI_CORR',
      'NODE_07:BANK_LINK',
      'NODE_08:VPN_SIG',
    ];

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() > 0.8 ? 2.5 : 1.5,
        pulseOffset: Math.random() * Math.PI * 2,
        label: labels[i % labels.length],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle coordinate grid lines
      const gridSize = 140;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.022)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw subtle grid intersections/crosshairs
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      for (let x = gridSize; x < width; x += gridSize * 2) {
        for (let y = gridSize; y < height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x + 4, y);
          ctx.moveTo(x, y - 4);
          ctx.lineTo(x, y + 4);
          ctx.stroke();
        }
      }

      // 3. Update & render intelligence nodes and connecting edges
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw connections to neighboring nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.07;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Tiny data pulse traveling across line
            if (dist < 180 && (i + j) % 3 === 0) {
              const progress = (Math.sin(time * 1.5 + (i * 1.3)) + 1) / 2;
              const px = node.x + dx * progress;
              const py = node.y + dy * progress;
              ctx.fillStyle = progress > 0.6 ? 'rgba(225, 29, 42, 0.28)' : 'rgba(56, 189, 248, 0.28)';
              ctx.beginPath();
              ctx.arc(px, py, 1.4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Draw node
        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + node.pulseOffset);
        const isRedAccent = i % 4 === 0;

        ctx.fillStyle = isRedAccent
          ? `rgba(225, 29, 42, ${0.15 + pulse * 0.2})`
          : `rgba(56, 189, 248, ${0.12 + pulse * 0.2})`;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + pulse * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Technical micro-label near selective primary nodes
        if (i % 3 === 0) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.16)';
          ctx.font = '8.5px "JetBrains Mono", monospace';
          ctx.fillText(node.label, node.x + 8, node.y + 3);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Navy/Black Background */}
      <div className="absolute inset-0 bg-[#03070D]" />

      {/* Cyber Network Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />

      {/* Subtle Radial Glows for high-tech atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-sky-950/15 rounded-full blur-[140px] -translate-y-1/2" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-red-950/10 rounded-full blur-[150px]" />

      {/* Subtle scanline / technical gradient mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,#03070D_100%)]" />
    </div>
  );
};
