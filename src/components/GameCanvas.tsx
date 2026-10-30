/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Game Canvas Component
 * Renders 11x11 playfield + GBA environmental effects at crisp 60fps
 */

import React, { useRef, useEffect } from 'react';
import {
  TileType,
  PlayerState,
  HeartFramer,
  EmeraldFramer,
  JewelChest,
  Enemy,
  MagicShot,
  LaserBeam,
  RoomDefinition,
  Particle
} from '../game/types';
import { GBASpriteRenderer } from '../game/sprites';

interface GameCanvasProps {
  currentLevel: RoomDefinition;
  grid: TileType[][];
  player: PlayerState;
  hearts: HeartFramer[];
  emeralds: EmeraldFramer[];
  chest: JewelChest;
  enemies: Enemy[];
  magicShot: MagicShot | null;
  laserBeam: LaserBeam | null;
  crtEnabled: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentLevel,
  grid,
  player,
  hearts,
  emeralds,
  chest,
  enemies,
  magicShot,
  laserBeam,
  crtEnabled
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Grid: 11x11 inside + 1 border wall tile around perimeter
    // 13x13 tiles at 36px = 468px (scalable to any viewport)
    const TILES_COUNT = 13;
    const TILE_SIZE = 36;
    const LOGICAL_WIDTH = TILES_COUNT * TILE_SIZE;
    const LOGICAL_HEIGHT = TILES_COUNT * TILE_SIZE;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = LOGICAL_WIDTH * dpr;
    canvas.height = LOGICAL_HEIGHT * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    // Clear background
    ctx.fillStyle = '#050814';
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    const time = performance.now() / 1000;
    const theme = currentLevel.theme || 'CASTLE';

    // 1. Draw Outer Castle Perimeter Walls
    for (let c = 0; c < TILES_COUNT; c++) {
      for (let r = 0; r < TILES_COUNT; r++) {
        const isBorder = c === 0 || c === TILES_COUNT - 1 || r === 0 || r === TILES_COUNT - 1;
        if (isBorder) {
          if (r === 0 && c === 6) {
            GBASpriteRenderer.drawExitDoor(ctx, c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, chest.isCollected, theme);
          } else {
            GBASpriteRenderer.drawWall(ctx, c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, theme, true);
          }
        }
      }
    }

    // Playfield offset inside perimeter (1 tile margin)
    ctx.save();
    ctx.translate(TILE_SIZE, TILE_SIZE);

    // 2. Draw Floor & Terrain Tiles
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 11; c++) {
        const tile = grid[r]?.[c] || 'EMPTY';
        const px = c * TILE_SIZE;
        const py = r * TILE_SIZE;

        if (tile === 'WALL') {
          GBASpriteRenderer.drawWall(ctx, px, py, TILE_SIZE, theme, false);
        } else if (tile === 'TREE') {
          GBASpriteRenderer.drawTree(ctx, px, py, TILE_SIZE, theme);
        } else if (tile === 'ROCK') {
          GBASpriteRenderer.drawRock(ctx, px, py, TILE_SIZE, theme);
        } else if (tile === 'WATER' || tile === 'LAVA') {
          GBASpriteRenderer.drawWater(ctx, px, py, TILE_SIZE, time, theme);
        } else if (tile === 'BRIDGE_H') {
          GBASpriteRenderer.drawBridge(ctx, px, py, TILE_SIZE, false, theme);
        } else if (tile === 'BRIDGE_V') {
          GBASpriteRenderer.drawBridge(ctx, px, py, TILE_SIZE, true, theme);
        } else if (tile === 'ARROW_UP') {
          GBASpriteRenderer.drawArrow(ctx, px, py, TILE_SIZE, 'UP', theme);
        } else if (tile === 'ARROW_DOWN') {
          GBASpriteRenderer.drawArrow(ctx, px, py, TILE_SIZE, 'DOWN', theme);
        } else if (tile === 'ARROW_LEFT') {
          GBASpriteRenderer.drawArrow(ctx, px, py, TILE_SIZE, 'LEFT', theme);
        } else if (tile === 'ARROW_RIGHT') {
          GBASpriteRenderer.drawArrow(ctx, px, py, TILE_SIZE, 'RIGHT', theme);
        } else {
          GBASpriteRenderer.drawFloor(ctx, px, py, TILE_SIZE, c, r, theme);
        }
      }
    }

    // 3. Draw Heart Framers
    hearts.forEach(h => {
      GBASpriteRenderer.drawHeartFramer(ctx, h, TILE_SIZE, time);
    });

    // 4. Draw Jewel Chest
    GBASpriteRenderer.drawChest(ctx, chest, TILE_SIZE, time);

    // 5. Draw Emerald Framers
    emeralds.forEach(e => {
      GBASpriteRenderer.drawEmeraldFramer(ctx, e, TILE_SIZE);
    });

    // 6. Draw Enemies
    enemies.forEach(en => {
      GBASpriteRenderer.drawEnemy(ctx, en, TILE_SIZE, time);
    });

    // 7. Draw Player (Lolo GBA Edition)
    GBASpriteRenderer.drawLolo(ctx, player, TILE_SIZE, time);

    // 8. Draw Magic Shots
    if (magicShot && magicShot.active) {
      GBASpriteRenderer.drawMagicShot(ctx, magicShot, TILE_SIZE, time);
    }

    // 9. Draw Laser Beams / Fireball Beams
    if (laserBeam && laserBeam.active) {
      GBASpriteRenderer.drawLaser(ctx, laserBeam, TILE_SIZE);
    }

    // 10. Ambient Environmental Particles (Minish Cap / Golden Sun style)
    if (particlesRef.current.length < 16 && Math.random() < 0.2) {
      const pColor =
        theme === 'GARDENS'
          ? '#86efac'
          : theme === 'CRYSTAL_CAVERN'
          ? '#67e8f9'
          : theme === 'SUN_TEMPLE'
          ? '#fef08a'
          : theme === 'SHADOW_TOWER'
          ? '#c084fc'
          : '#fef08a';

      particlesRef.current.push({
        id: `p_${Math.random()}`,
        x: Math.random() * (11 * TILE_SIZE),
        y: Math.random() * (11 * TILE_SIZE),
        vx: (Math.random() - 0.5) * 8,
        vy: -4 - Math.random() * 8,
        color: pColor,
        size: 1.5 + Math.random() * 2,
        alpha: 0.6,
        life: 0,
        maxLife: 2 + Math.random() * 2
      });
    }

    // Update & draw particles
    particlesRef.current = particlesRef.current.filter(p => {
      p.life += 0.03;
      p.x += p.vx * 0.03;
      p.y += p.vy * 0.03;
      const progress = p.life / p.maxLife;
      if (progress >= 1) return false;

      ctx.save();
      ctx.globalAlpha = Math.sin(progress * Math.PI) * p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return true;
    });

    ctx.restore(); // restore playfield translation
    ctx.restore(); // restore scale & root
  }, [currentLevel, grid, player, hearts, emeralds, chest, enemies, magicShot, laserBeam]);

  return (
    <div className={`relative inline-block rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-500/40 bg-slate-950 ${crtEnabled ? 'crt-screen' : ''}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: 'min(92vw, 468px)',
          height: 'min(92vw, 468px)',
          display: 'block'
        }}
        className="pixelated bg-slate-950"
      />
    </div>
  );
};
