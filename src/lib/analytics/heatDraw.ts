export type HeatPoint = { x: number; y: number };

/** Lightweight heatmap (same idea as simpleheat) — percent coords 0–100 mapped onto canvas. */
export function drawHeatmap(canvas: HTMLCanvasElement, points: HeatPoint[], radius = 28): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  if (points.length === 0 || width < 2 || height < 2) return;

  for (const p of points) {
    const x = (p.x / 100) * width;
    const y = (p.y / 100) * height;
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, 'rgba(189, 32, 211, 0.45)');
    g.addColorStop(0.4, 'rgba(26, 75, 255, 0.22)');
    g.addColorStop(1, 'rgba(26, 75, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
