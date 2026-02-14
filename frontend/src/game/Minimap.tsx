import { useRef, useEffect } from 'react';
import { useGameStore, ZONE_CENTERS, ZONE_META } from '../stores/gameStore';

const SIZE = 160;
const PAD = 10;
const DRAW = SIZE - PAD * 2; // 140px drawing area

// World bounds (derived from zone positions)
const WORLD_X_MIN = -55;
const WORLD_X_MAX = 55;
const WORLD_Z_MIN = -80;
const WORLD_Z_MAX = 55;
const WORLD_W = WORLD_X_MAX - WORLD_X_MIN; // 110
const WORLD_H = WORLD_Z_MAX - WORLD_Z_MIN; // 135

function mapX(worldX: number) {
  return PAD + ((worldX - WORLD_X_MIN) / WORLD_W) * DRAW;
}
function mapY(worldZ: number) {
  return PAD + ((worldZ - WORLD_Z_MIN) / WORLD_H) * DRAW;
}

const ZONE_ENTRIES = Object.entries(ZONE_CENTERS);

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerPosition = useGameStore((s) => s.playerPosition);
  const cameraYaw = useGameStore((s) => s.cameraYaw);
  const currentZone = useGameStore((s) => s.currentZone);

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
    ctx.roundRect(0, 0, SIZE, SIZE, 12);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(160, 160, 165, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(0, 0, SIZE, SIZE, 12);
    ctx.stroke();

    // Zone dots
    const now = Date.now();
    for (const [zoneId, center] of ZONE_ENTRIES) {
      const cx = mapX(center[0]);
      const cy = mapY(center[2]);
      const meta = ZONE_META[zoneId];
      const isActive = currentZone === zoneId;

      // Active zone pulse
      if (isActive) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 300);
        ctx.beginPath();
        ctx.arc(cx, cy, 8 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + pulse * 0.1})`;
        ctx.fill();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = meta?.color ?? '#888';
      ctx.fill();

      // Emoji label
      if (meta?.emoji) {
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(meta.emoji, cx, cy - 7);
      }
    }

    // Player dot
    const px = mapX(playerPosition[0]);
    const py = mapY(playerPosition[2]);

    // Glow
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.fill();

    // Dot
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FACC15';
    ctx.fill();

    // Camera direction chevron
    // cameraYaw: 0 = looking along -Z (north on minimap = up)
    // Canvas: up = -Y. So angle on canvas = cameraYaw (clockwise from north)
    const angle = cameraYaw;
    const chevronDist = 8;
    const chevronSize = 4;
    const tipX = px + Math.sin(angle) * chevronDist;
    const tipY = py - Math.cos(angle) * chevronDist;
    const leftX = px + Math.sin(angle + 2.5) * chevronSize;
    const leftY = py - Math.cos(angle + 2.5) * chevronSize;
    const rightX = px + Math.sin(angle - 2.5) * chevronSize;
    const rightY = py - Math.cos(angle - 2.5) * chevronSize;

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.fillStyle = '#FACC15';
    ctx.fill();
  }, [playerPosition, cameraYaw, currentZone]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: SIZE, height: SIZE }}
      className="absolute bottom-14 left-2 z-30 pointer-events-none rounded-xl"
    />
  );
}
