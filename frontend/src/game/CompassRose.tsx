import { useRef, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

const SIZE = 48;
const CENTER = SIZE / 2;
const RADIUS = 18;

export function CompassRose() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraYaw = useGameStore((s) => s.cameraYaw);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = 'rgba(55, 55, 60, 0.75)';
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(160, 160, 165, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.stroke();

    // Cardinal directions — rotate opposite to camera yaw
    const directions: [string, number, string][] = [
      ['N', 0, '#EF4444'],
      ['E', Math.PI / 2, '#d1d5db'],
      ['S', Math.PI, '#d1d5db'],
      ['W', (3 * Math.PI) / 2, '#d1d5db'],
    ];

    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const [label, baseAngle, color] of directions) {
      const angle = baseAngle - cameraYaw;
      const x = CENTER + Math.sin(angle) * RADIUS;
      const y = CENTER - Math.cos(angle) * RADIUS;
      ctx.fillStyle = color;
      ctx.fillText(label, x, y);
    }
  }, [cameraYaw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: SIZE, height: SIZE }}
      className="absolute bottom-[72px] left-[170px] z-30 pointer-events-none"
    />
  );
}
