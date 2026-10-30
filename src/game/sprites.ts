/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Game Boy Advance Pixel Art Sprite & Environment Renderer
 * Inspired by The Legend of Zelda: The Minish Cap & Golden Sun
 */

import {
  Direction,
  TileType,
  WorldTheme,
  EnemyType,
  HeartFramer,
  EmeraldFramer,
  JewelChest,
  Enemy,
  MagicShot,
  LaserBeam,
  PlayerState,
  Particle
} from './types';

export class GBASpriteRenderer {
  // GBA 15-Bit Rich Color Palettes
  static readonly PALETTES = {
    // Player Lolo: Rich multi-shade blue sphere
    LOLO: {
      HIGHLIGHT: '#93c5fd',
      BODY_LIGHT: '#60a5fa',
      BODY_MAIN: '#2563eb',
      BODY_SHADOW: '#1d4ed8',
      BODY_DEEP: '#1e3a8a',
      OUTLINE: '#0f172a',
      EYE_WHITE: '#ffffff',
      EYE_IRIS: '#0284c7',
      EYE_PUPIL: '#0c4a6e',
      CHEEK: '#f472b6',
      BOOT_LIGHT: '#d97706',
      BOOT_MAIN: '#92400e',
      BOOT_DARK: '#451a03',
      BUCKLE: '#fef08a',
      SHADOW: 'rgba(15, 23, 42, 0.4)'
    },

    // World 1: Royal Castle (Minish Cap Hyrule Castle style)
    CASTLE: {
      FLOOR_1: '#cbd5e1',
      FLOOR_2: '#94a3b8',
      FLOOR_LINE: '#64748b',
      WALL_TOP: '#f8fafc',
      WALL_MAIN: '#64748b',
      WALL_SHADOW: '#334155',
      WALL_DEEP: '#1e293b',
      BANNER_RED: '#dc2626',
      BANNER_GOLD: '#f59e0b',
      WATER: '#0284c7',
      WATER_LIGHT: '#38bdf8',
      WATER_DEEP: '#0369a1'
    },

    // World 2: Enchanted Gardens (Minish Cap Forest / Field style)
    GARDENS: {
      FLOOR_1: '#4ade80',
      FLOOR_2: '#22c55e',
      FLOOR_LINE: '#15803d',
      FLOWER_WHITE: '#ffffff',
      FLOWER_RED: '#ef4444',
      WALL_TOP: '#86efac',
      WALL_MAIN: '#15803d',
      WALL_SHADOW: '#14532d',
      WALL_DEEP: '#052e16',
      TREE_LIGHT: '#86efac',
      TREE_MAIN: '#22c55e',
      TREE_SHADOW: '#166534',
      TREE_TRUNK: '#78350f',
      WATER: '#06b6d4',
      WATER_LIGHT: '#67e8f9',
      WATER_DEEP: '#0e7490'
    },

    // World 3: Crystal Cavern (Golden Sun Dungeon / Cave style)
    CRYSTAL_CAVERN: {
      FLOOR_1: '#334155',
      FLOOR_2: '#1e293b',
      FLOOR_LINE: '#0f172a',
      WALL_TOP: '#64748b',
      WALL_MAIN: '#334155',
      WALL_SHADOW: '#1e293b',
      WALL_DEEP: '#020617',
      CRYSTAL_LIGHT: '#67e8f9',
      CRYSTAL_MAIN: '#06b6d4',
      CRYSTAL_SHADOW: '#0891b2',
      WATER: '#0f766e',
      WATER_LIGHT: '#2dd4bf',
      WATER_DEEP: '#115e59'
    },

    // World 4: Sun Temple (Golden Sun Desert / Sandstone style)
    SUN_TEMPLE: {
      FLOOR_1: '#fde047',
      FLOOR_2: '#eab308',
      FLOOR_LINE: '#ca8a04',
      WALL_TOP: '#fef08a',
      WALL_MAIN: '#d97706',
      WALL_SHADOW: '#92400e',
      WALL_DEEP: '#451a03',
      LAVA_LIGHT: '#fef08a',
      LAVA_MAIN: '#f97316',
      LAVA_DEEP: '#c2410c',
      WATER: '#0284c7',
      WATER_LIGHT: '#38bdf8',
      WATER_DEEP: '#0369a1'
    },

    // World 5: Shadow Tower (King Egger's Royal Obsidian Tower)
    SHADOW_TOWER: {
      FLOOR_1: '#3b0764',
      FLOOR_2: '#1e1b4b',
      FLOOR_LINE: '#0f172a',
      CARPET_MAIN: '#991b1b',
      CARPET_BORDER: '#f59e0b',
      WALL_TOP: '#a855f7',
      WALL_MAIN: '#581c87',
      WALL_SHADOW: '#2e1065',
      WALL_DEEP: '#1e1b4b',
      TORCH_FIRE: '#ec4899',
      WATER: '#4338ca',
      WATER_LIGHT: '#818cf8',
      WATER_DEEP: '#312e81'
    }
  };

  // Helper to draw soft drop shadow beneath entities
  static drawShadow(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
    ctx.save();
    ctx.fillStyle = 'rgba(10, 15, 30, 0.32)';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- TILE & ENVIRONMENT RENDERING ---

  static drawFloor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, col: number, row: number, theme: WorldTheme) {
    const pal = this.PALETTES[theme] || this.PALETTES.CASTLE;
    const isEven = (col + row) % 2 === 0;

    // Base floor tile
    ctx.fillStyle = isEven ? pal.FLOOR_1 : pal.FLOOR_2;
    ctx.fillRect(x, y, size, size);

    // Subtle GBA tile border bevel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(x, y, size, 1.5);
    ctx.fillRect(x, y, 1.5, size);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(x, y + size - 1.5, size, 1.5);
    ctx.fillRect(x + size - 1.5, y, 1.5, size);

    // World-specific tile detailing
    const u = size / 16;
    if (theme === 'GARDENS') {
      // Grass tufts and tiny wildflowers
      if ((col * 7 + row * 13) % 5 === 0) {
        ctx.fillStyle = pal.FLOOR_LINE;
        ctx.fillRect(x + u * 4, y + u * 4, u * 1.5, u * 3);
        ctx.fillRect(x + u * 5.5, y + u * 3, u * 1.5, u * 4);
      }
      if ((col * 3 + row * 11) % 7 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + u * 11, y + u * 10, u * 2, u * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + u * 11.5, y + u * 10.5, u, u);
      }
    } else if (theme === 'CASTLE') {
      // Elegant marble speckles
      if (isEven) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x + u * 3, y + u * 3, u * 2, u);
        ctx.fillRect(x + u * 10, y + u * 11, u * 2, u);
      }
    } else if (theme === 'CRYSTAL_CAVERN') {
      // Subterranean glowing mica flecks
      if ((col + row * 2) % 4 === 0) {
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(x + u * 6, y + u * 6, u, u);
      }
    } else if (theme === 'SUN_TEMPLE') {
      // Ancient sand ripples
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(x + u * 2, y + u * 5, u * 6, u * 1.5);
      ctx.fillRect(x + u * 8, y + u * 11, u * 6, u * 1.5);
    } else if (theme === 'SHADOW_TOWER') {
      // Royal runner center or gold filigree
      if (col === 5) {
        ctx.fillStyle = this.PALETTES.SHADOW_TOWER.CARPET_MAIN;
        ctx.fillRect(x + u * 1, y, u * 14, size);
        ctx.fillStyle = this.PALETTES.SHADOW_TOWER.CARPET_BORDER;
        ctx.fillRect(x + u * 1, y, u * 1.5, size);
        ctx.fillRect(x + u * 13.5, y, u * 1.5, size);
      }
    }
  }

  static drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: WorldTheme, isPerimeter: boolean = false) {
    const pal = this.PALETTES[theme] || this.PALETTES.CASTLE;
    const u = size / 16;

    // Wall 3D volumetric face
    ctx.fillStyle = pal.WALL_MAIN;
    ctx.fillRect(x, y, size, size);

    // Carved masonry stone blocks with highlights and deep shadows
    ctx.fillStyle = pal.WALL_TOP;
    ctx.fillRect(x, y, size, u * 3); // top cap
    ctx.fillStyle = pal.WALL_SHADOW;
    ctx.fillRect(x, y + u * 3, size, u * 1.5);

    // Brick mortar lines
    ctx.fillStyle = pal.WALL_DEEP;
    ctx.fillRect(x, y + u * 9, size, u * 1.5);
    ctx.fillRect(x, y + size - u * 1.5, size, u * 1.5);

    ctx.fillRect(x + u * 8, y + u * 4.5, u * 1.5, u * 4.5);
    ctx.fillRect(x + u * 4, y + u * 10.5, u * 1.5, u * 4.5);
    ctx.fillRect(x + u * 12, y + u * 10.5, u * 1.5, u * 4.5);

    // Wall top crenel / bevel highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillRect(x, y, size, u * 1.2);
    ctx.fillRect(x + u * 1, y + u * 4.5, u * 6, u);
    ctx.fillRect(x + u * 9.5, y + u * 4.5, u * 5.5, u);

    // Soft drop shadow cast by wall onto floor below
    if (!isPerimeter) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(x, y + size - u * 2, size, u * 2);
    }
  }

  static drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: WorldTheme) {
    const pal = this.PALETTES[theme] || this.PALETTES.GARDENS;
    const u = size / 16;

    // Ground underneath
    this.drawFloor(ctx, x, y, size, 0, 0, theme);

    if (theme === 'CRYSTAL_CAVERN') {
      // Luminous crystal spire cluster
      this.drawShadow(ctx, x + size / 2, y + u * 13, u * 6, u * 3);

      ctx.fillStyle = this.PALETTES.CRYSTAL_CAVERN.CRYSTAL_SHADOW;
      ctx.beginPath();
      ctx.moveTo(x + u * 8, y + u * 2);
      ctx.lineTo(x + u * 13, y + u * 13);
      ctx.lineTo(x + u * 3, y + u * 13);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = this.PALETTES.CRYSTAL_CAVERN.CRYSTAL_MAIN;
      ctx.beginPath();
      ctx.moveTo(x + u * 8, y + u * 2);
      ctx.lineTo(x + u * 10, y + u * 13);
      ctx.lineTo(x + u * 4, y + u * 13);
      ctx.closePath();
      ctx.fill();

      // Gleam
      ctx.fillStyle = this.PALETTES.CRYSTAL_CAVERN.CRYSTAL_LIGHT;
      ctx.beginPath();
      ctx.moveTo(x + u * 8, y + u * 2);
      ctx.lineTo(x + u * 7, y + u * 13);
      ctx.lineTo(x + u * 5, y + u * 13);
      ctx.closePath();
      ctx.fill();
    } else {
      // Minish Cap style lush rounded leafy bush/tree
      this.drawShadow(ctx, x + size / 2, y + u * 13.5, u * 6, u * 2.5);

      // Deep shadow canopy
      ctx.fillStyle = this.PALETTES.GARDENS.WALL_DEEP;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 + u * 0.5, u * 6.8, 0, Math.PI * 2);
      ctx.fill();

      // Main vibrant green canopy
      ctx.fillStyle = this.PALETTES.GARDENS.TREE_MAIN;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 - u * 0.5, u * 6.2, 0, Math.PI * 2);
      ctx.fill();

      // Highlight leaf clumps (Zelda style)
      ctx.fillStyle = this.PALETTES.GARDENS.TREE_LIGHT;
      ctx.beginPath();
      ctx.arc(x + u * 6, y + u * 6, u * 3.5, 0, Math.PI * 2);
      ctx.arc(x + u * 10.5, y + u * 7.5, u * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Specular sunlight specks
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + u * 5, y + u * 5, u * 1.5, u * 1.5);
      ctx.fillRect(x + u * 10, y + u * 7, u * 1.2, u * 1.2);
    }
  }

  static drawRock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, theme: WorldTheme) {
    const u = size / 16;
    this.drawFloor(ctx, x, y, size, 0, 0, theme);
    this.drawShadow(ctx, x + size / 2, y + u * 13, u * 6, u * 2.5);

    // Weathered boulder
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(x + size / 2, y + size / 2 + u * 0.5, u * 6, u * 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(x + size / 2 - u * 0.5, y + size / 2 - u * 0.8, u * 5.2, u * 4.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top sunlight highlight
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(x + u * 6, y + u * 5.5, u * 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Crack line
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = u * 0.8;
    ctx.beginPath();
    ctx.moveTo(x + u * 8, y + u * 4);
    ctx.lineTo(x + u * 9, y + u * 8);
    ctx.lineTo(x + u * 11, y + u * 10);
    ctx.stroke();
  }

  static drawWater(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number, theme: WorldTheme) {
    const pal = this.PALETTES[theme] || this.PALETTES.CASTLE;
    const u = size / 16;

    if (theme === 'SUN_TEMPLE') {
      // Glowing Molten Lava Canal with bubbles
      ctx.fillStyle = this.PALETTES.SUN_TEMPLE.LAVA_DEEP;
      ctx.fillRect(x, y, size, size);

      ctx.fillStyle = this.PALETTES.SUN_TEMPLE.LAVA_MAIN;
      const wave = Math.sin(time * 3 + x * 0.1) * (u * 2);
      ctx.fillRect(x, y + u * 2 + wave, size, u * 8);

      ctx.fillStyle = this.PALETTES.SUN_TEMPLE.LAVA_LIGHT;
      ctx.fillRect(x + u * 2, y + u * 5 + wave * 0.5, u * 5, u * 2);
      ctx.fillRect(x + u * 9, y + u * 9 - wave * 0.5, u * 4, u * 1.5);
      return;
    }

    // Minish Cap crystalline water with wave ripples
    ctx.fillStyle = pal.WATER_DEEP;
    ctx.fillRect(x, y, size, size);

    ctx.fillStyle = pal.WATER;
    ctx.fillRect(x, y + u * 2, size, u * 12);

    // Sunlight caustics
    const waveOffset = Math.sin(time * 3 + (x + y) * 0.05) * (u * 2);
    ctx.fillStyle = pal.WATER_LIGHT;
    ctx.fillRect(x + (u * 3 + waveOffset) % size, y + u * 4, u * 5, u * 1.2);
    ctx.fillRect(x + (u * 8 - waveOffset) % size, y + u * 9, u * 6, u * 1.2);

    // Shore foam lines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x, y, size, u * 1.2);
    ctx.fillRect(x, y + size - u * 1.2, size, u * 1.2);
  }

  static drawBridge(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isVertical: boolean, theme: WorldTheme) {
    const u = size / 16;
    this.drawWater(ctx, x, y, size, 0, theme);

    if (isVertical) {
      // Heavy timber vertical bridge
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + u * 2, y, u * 12, size);

      ctx.fillStyle = '#92400e';
      ctx.fillRect(x + u * 2.5, y, u * 11, size);

      // Horizontal wood planks
      for (let i = 0; i < 16; i += 4) {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x + u * 3, y + u * i + u * 0.5, u * 10, u * 2.5);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + u * 3.5, y + u * i + u * 1.5, u * 0.8, u * 0.8); // iron rivet
        ctx.fillRect(x + u * 11.7, y + u * i + u * 1.5, u * 0.8, u * 0.8);
      }
    } else {
      // Horizontal wood bridge
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x, y + u * 2, size, u * 12);

      ctx.fillStyle = '#92400e';
      ctx.fillRect(x, y + u * 2.5, size, u * 11);

      // Vertical wood planks
      for (let i = 0; i < 16; i += 4) {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x + u * i + u * 0.5, y + u * 3, u * 2.5, u * 10);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + u * i + u * 1.5, y + u * 3.5, u * 0.8, u * 0.8);
        ctx.fillRect(x + u * i + u * 1.5, y + u * 11.7, u * 0.8, u * 0.8);
      }
    }
  }

  static drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, dir: Direction, theme: WorldTheme) {
    const u = size / 16;
    this.drawFloor(ctx, x, y, size, 0, 0, theme);

    // Carved stone pressure plate
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + u * 2, y + u * 2, u * 12, u * 12);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + u * 2.5, y + u * 2.5, u * 11, u * 11);

    // Glowing golden runic arrow
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    if (dir === 'UP') ctx.rotate(0);
    else if (dir === 'RIGHT') ctx.rotate(Math.PI / 2);
    else if (dir === 'DOWN') ctx.rotate(Math.PI);
    else if (dir === 'LEFT') ctx.rotate(-Math.PI / 2);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, -u * 4.5);
    ctx.lineTo(u * 4, u * 1);
    ctx.lineTo(u * 1.8, u * 1);
    ctx.lineTo(u * 1.8, u * 4.5);
    ctx.lineTo(-u * 1.8, u * 4.5);
    ctx.lineTo(-u * 1.8, u * 1);
    ctx.lineTo(-u * 4, u * 1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, -u * 3);
    ctx.lineTo(u * 2, u * 0.5);
    ctx.lineTo(u * 0.8, u * 0.5);
    ctx.lineTo(u * 0.8, u * 3.5);
    ctx.lineTo(-u * 0.8, u * 3.5);
    ctx.lineTo(-u * 0.8, u * 0.5);
    ctx.lineTo(-u * 2, u * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  static drawExitDoor(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, isOpen: boolean, theme: WorldTheme) {
    const u = size / 16;
    const pal = this.PALETTES[theme] || this.PALETTES.CASTLE;

    // Stone Archway
    ctx.fillStyle = pal.WALL_DEEP;
    ctx.fillRect(x, y, size, size);

    if (!isOpen) {
      // Closed double iron-bound oak doors
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + u * 2, y + u * 2, u * 12, u * 14);

      // Iron strapping
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + u * 2, y + u * 4, u * 12, u * 1.8);
      ctx.fillRect(x + u * 2, y + u * 11, u * 12, u * 1.8);

      // Door seam
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(x + u * 7.5, y + u * 2, u, u * 14);

      // Ornate brass padlock
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x + u * 8, y + u * 8, u * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + u * 7.5, y + u * 8, u, u * 1.5);
    } else {
      // Grand illuminated staircase passage!
      ctx.fillStyle = '#020617';
      ctx.fillRect(x + u * 2, y + u * 2, u * 12, u * 14);

      // Ascending illuminated stone steps
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + u * 3, y + u * 12, u * 10, u * 2.5);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x + u * 4, y + u * 9, u * 8, u * 2.2);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + u * 5, y + u * 6, u * 6, u * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x + u * 6, y + u * 3.5, u * 4, u * 1.8);

      // Divine upward light glow
      const grad = ctx.createLinearGradient(x, y + size, x, y);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0)');
      grad.addColorStop(1, 'rgba(254, 240, 138, 0.6)');
      ctx.fillStyle = grad;
      ctx.fillRect(x + u * 2, y + u * 2, u * 12, u * 14);
    }
  }

  // --- ENTITIES & OBJECTS ---

  static drawHeartFramer(ctx: CanvasRenderingContext2D, heart: HeartFramer, size: number, time: number) {
    if (heart.collected) return;
    const x = heart.x * size;
    const y = heart.y * size;
    const u = size / 16;

    this.drawShadow(ctx, x + size / 2, y + u * 13.5, u * 5, u * 2);

    // Ornate Golden Reliquary Pedestal
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x + u * 2, y + u * 2, u * 12, u * 12);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + u * 2.8, y + u * 2.8, u * 10.4, u * 10.4);

    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + u * 4, y + u * 4, u * 8, u * 8);

    // Volumetric pulsing ruby heart inside
    const pulse = 1 + Math.sin(time * 6) * 0.12;
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.scale(pulse, pulse);

    // Ruby Heart Facets
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(-u * 2, -u * 1, u * 2.4, Math.PI, 0);
    ctx.arc(u * 2, -u * 1, u * 2.4, Math.PI, 0);
    ctx.lineTo(0, u * 3.8);
    ctx.closePath();
    ctx.fill();

    // Heart specular highlight
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(-u * 2, -u * 1.5, u * 1.5, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-u * 2.5, -u * 2, u * 1.2, u * 1.2);

    ctx.restore();
  }

  static drawEmeraldFramer(ctx: CanvasRenderingContext2D, block: EmeraldFramer, size: number) {
    const x = block.x * size;
    const y = block.y * size;
    const u = size / 16;

    this.drawShadow(ctx, x + size / 2, y + u * 14, u * 6.5, u * 2.8);

    // Heavy Stone Pedestal Block with molding
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + u * 1, y + u * 1, u * 14, u * 14);

    ctx.fillStyle = '#334155';
    ctx.fillRect(x + u * 1.5, y + u * 1.5, u * 13, u * 13);

    // Corner brass braces
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + u * 1.5, y + u * 1.5, u * 3, u * 3);
    ctx.fillRect(x + u * 11.5, y + u * 1.5, u * 3, u * 3);
    ctx.fillRect(x + u * 1.5, y + u * 11.5, u * 3, u * 3);
    ctx.fillRect(x + u * 11.5, y + u * 11.5, u * 3, u * 3);

    // Recessed dark velvet bed
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(x + u * 4, y + u * 4, u * 8, u * 8);

    // Multifaceted glowing emerald crystal
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.moveTo(x + u * 8, y + u * 4.5);
    ctx.lineTo(x + u * 11.5, y + u * 8);
    ctx.lineTo(x + u * 8, y + u * 11.5);
    ctx.lineTo(x + u * 4.5, y + u * 8);
    ctx.closePath();
    ctx.fill();

    // Top emerald facet
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(x + u * 8, y + u * 4.5);
    ctx.lineTo(x + u * 10, y + u * 8);
    ctx.lineTo(x + u * 6, y + u * 8);
    ctx.closePath();
    ctx.fill();

    // Specular star glint
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + u * 6.5, y + u * 6, u * 1.5, u * 1.5);
  }

  static drawChest(ctx: CanvasRenderingContext2D, chest: JewelChest, size: number, time: number) {
    const x = chest.x * size;
    const y = chest.y * size;
    const u = size / 16;

    this.drawShadow(ctx, x + size / 2, y + u * 13.5, u * 6, u * 2.5);

    if (!chest.isOpen) {
      // Closed Ornate GBA Treasure Chest
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + u * 2, y + u * 3.5, u * 12, u * 10.5);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + u * 2.5, y + u * 4, u * 11, u * 9.5);

      // Gold Filigree & Metal Banding
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x + u * 2, y + u * 3.5, u * 12, u * 2);
      ctx.fillRect(x + u * 2, y + u * 11.5, u * 12, u * 2);
      ctx.fillRect(x + u * 2, y + u * 7, u * 12, u * 1.8);
      ctx.fillRect(x + u * 4, y + u * 3.5, u * 2, u * 10.5);
      ctx.fillRect(x + u * 10, y + u * 3.5, u * 2, u * 10.5);

      // Brass Lock Plate
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x + u * 7, y + u * 7.5, u * 2, u * 3);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + u * 7.5, y + u * 8.5, u, u * 1.5);
    } else if (!chest.isCollected) {
      // Open Chest with Golden Light Shaft & Floating Sky Jewel!
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + u * 2, y + u * 6.5, u * 12, u * 7.5);

      // Open lid angled back
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x + u * 1.5, y + u * 1, u * 13, u * 4.5);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x + u * 1.5, y + u * 1, u * 13, u * 1.5);

      // Chest velvet interior
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(x + u * 3, y + u * 6.5, u * 10, u * 4);

      // Floating Sky Jewel
      const floatY = Math.sin(time * 5) * (u * 2);
      ctx.save();
      ctx.translate(x + size / 2, y + u * 7 + floatY);

      // Diamond Jewel
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, -u * 4);
      ctx.lineTo(u * 3.5, 0);
      ctx.lineTo(0, u * 4);
      ctx.lineTo(-u * 3.5, 0);
      ctx.closePath();
      ctx.fill();

      // Top facet
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.moveTo(0, -u * 4);
      ctx.lineTo(u * 2, 0);
      ctx.lineTo(-u * 2, 0);
      ctx.closePath();
      ctx.fill();

      // Gleam sparkle
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-u * 1, -u * 2, u * 1.8, u * 1.8);

      ctx.restore();
    } else {
      // Empty collected chest
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + u * 2, y + u * 6.5, u * 12, u * 7.5);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x + u * 1.5, y + u * 1, u * 13, u * 4.5);
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(x + u * 3, y + u * 6.5, u * 10, u * 4);
    }
  }

  // --- LOLO HERO SPRITE (GBA EDITION) ---

  static drawLolo(ctx: CanvasRenderingContext2D, player: PlayerState, size: number, time: number) {
    const x = player.x * size;
    const y = player.y * size;
    const u = size / 16;
    const pal = this.PALETTES.LOLO;

    // Contact drop shadow on ground
    this.drawShadow(ctx, x + size / 2, y + u * 14.5, u * 6, u * 2.6);

    if (player.isDead) {
      // Defeated / dizzy Lolo
      ctx.fillStyle = pal.BODY_DEEP;
      ctx.beginPath();
      ctx.ellipse(x + size / 2, y + size / 2 + u * 2, u * 6, u * 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Anime spiral eyes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = u * 1.2;
      ctx.beginPath();
      ctx.arc(x + u * 5.5, y + u * 8, u * 1.5, 0, Math.PI * 1.8);
      ctx.arc(x + u * 10.5, y + u * 8, u * 1.5, 0, Math.PI * 1.8);
      ctx.stroke();
      return;
    }

    // Walking animation cycle
    const isMoving = player.isMoving;
    const stepBob = isMoving ? Math.sin(time * 16) : 0;
    const idleBreathe = !isMoving ? Math.sin(time * 4) * (u * 0.4) : 0;

    const leftFootY = y + u * 13 + (stepBob > 0 ? -u * 1.8 : 0);
    const rightFootY = y + u * 13 + (stepBob < 0 ? -u * 1.8 : 0);

    // Leather adventurer boots with buckles
    ctx.fillStyle = pal.BOOT_DARK;
    ctx.fillRect(x + u * 3, leftFootY + u * 1.5, u * 4, u * 1.5);
    ctx.fillRect(x + u * 9, rightFootY + u * 1.5, u * 4, u * 1.5);

    ctx.fillStyle = pal.BOOT_MAIN;
    ctx.fillRect(x + u * 3, leftFootY, u * 3.8, u * 2.2);
    ctx.fillRect(x + u * 9.2, rightFootY, u * 3.8, u * 2.2);

    ctx.fillStyle = pal.BUCKLE;
    ctx.fillRect(x + u * 4.2, leftFootY + u * 0.5, u * 1.5, u);
    ctx.fillRect(x + u * 10.4, rightFootY + u * 0.5, u * 1.5, u);

    // Spherical 3D shaded body
    const bodyY = y + size / 2 - u * 0.5 + idleBreathe;

    // Body shadow
    ctx.fillStyle = pal.BODY_DEEP;
    ctx.beginPath();
    ctx.arc(x + size / 2, bodyY, u * 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Body midtone
    ctx.fillStyle = pal.BODY_MAIN;
    ctx.beginPath();
    ctx.arc(x + size / 2 - u * 0.5, bodyY - u * 0.5, u * 6.1, 0, Math.PI * 2);
    ctx.fill();

    // Body soft light
    ctx.fillStyle = pal.BODY_LIGHT;
    ctx.beginPath();
    ctx.arc(x + size / 2 - u * 1.5, bodyY - u * 1.5, u * 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight gleam (Zelda Minish Cap character shine)
    ctx.fillStyle = pal.HIGHLIGHT;
    ctx.beginPath();
    ctx.arc(x + size / 2 - u * 2.5, bodyY - u * 2.8, u * 2, 0, Math.PI * 2);
    ctx.fill();

    // Rosy anime cheeks
    ctx.fillStyle = pal.CHEEK;
    ctx.beginPath();
    ctx.ellipse(x + u * 3.5, bodyY + u * 2.5, u * 1.5, u * 0.8, 0, 0, Math.PI * 2);
    ctx.ellipse(x + u * 12.5, bodyY + u * 2.5, u * 1.5, u * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Expressive Eyes with dynamic blink cycle
    const isBlinking = Math.floor(time * 3) % 11 === 0;

    let eyeShiftX = 0;
    let eyeShiftY = 0;
    if (player.dir === 'LEFT') eyeShiftX = -u * 2;
    else if (player.dir === 'RIGHT') eyeShiftX = u * 2;
    else if (player.dir === 'DOWN') eyeShiftY = u * 1;
    else if (player.dir === 'UP') eyeShiftY = -u * 2;

    if (player.dir !== 'UP') {
      if (isBlinking) {
        // Cute happy closed eye lines
        ctx.strokeStyle = pal.OUTLINE;
        ctx.lineWidth = u * 1.2;
        ctx.beginPath();
        ctx.arc(x + u * 5.5 + eyeShiftX, bodyY + eyeShiftY, u * 1.8, 0, Math.PI);
        ctx.arc(x + u * 10.5 + eyeShiftX, bodyY + eyeShiftY, u * 1.8, 0, Math.PI);
        ctx.stroke();
      } else {
        // Large expressive eyes with iris and catchlight
        ctx.fillStyle = pal.EYE_WHITE;
        ctx.fillRect(x + u * 4 + eyeShiftX, bodyY - u * 2 + eyeShiftY, u * 3.4, u * 4.8);
        ctx.fillRect(x + u * 8.6 + eyeShiftX, bodyY - u * 2 + eyeShiftY, u * 3.4, u * 4.8);

        // Sapphire Iris
        ctx.fillStyle = pal.EYE_IRIS;
        const pupilShiftX = player.dir === 'LEFT' ? -u * 0.8 : player.dir === 'RIGHT' ? u * 0.8 : 0;
        ctx.fillRect(x + u * 4.8 + eyeShiftX + pupilShiftX, bodyY - u * 1 + eyeShiftY, u * 2.2, u * 3.4);
        ctx.fillRect(x + u * 9.4 + eyeShiftX + pupilShiftX, bodyY - u * 1 + eyeShiftY, u * 2.2, u * 3.4);

        // Pupil
        ctx.fillStyle = pal.EYE_PUPIL;
        ctx.fillRect(x + u * 5.2 + eyeShiftX + pupilShiftX, bodyY + eyeShiftY, u * 1.4, u * 2.2);
        ctx.fillRect(x + u * 9.8 + eyeShiftX + pupilShiftX, bodyY + eyeShiftY, u * 1.4, u * 2.2);

        // Double white catchlights
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + u * 4.8 + eyeShiftX + pupilShiftX, bodyY - u * 1.2 + eyeShiftY, u * 1.2, u * 1.2);
        ctx.fillRect(x + u * 9.4 + eyeShiftX + pupilShiftX, bodyY - u * 1.2 + eyeShiftY, u * 1.2, u * 1.2);
        ctx.fillRect(x + u * 6 + eyeShiftX + pupilShiftX, bodyY + u * 1 + eyeShiftY, u * 0.6, u * 0.6);
        ctx.fillRect(x + u * 10.6 + eyeShiftX + pupilShiftX, bodyY + u * 1 + eyeShiftY, u * 0.6, u * 0.6);
      }
    } else {
      // Facing up: back of head with cute antenna tuft
      ctx.fillStyle = pal.BODY_LIGHT;
      ctx.beginPath();
      ctx.arc(x + size / 2, bodyY - u * 5.5, u * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Victory celebration arms up
    if (player.isVictory) {
      ctx.fillStyle = pal.BODY_LIGHT;
      ctx.beginPath();
      ctx.arc(x + u * 1.5, bodyY - u * 3, u * 2.2, 0, Math.PI * 2);
      ctx.arc(x + u * 14.5, bodyY - u * 3, u * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- ENEMIES (GBA EDITION) ---

  static drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, size: number, time: number) {
    if (enemy.isFlownAway) return;
    const x = enemy.x * size;
    const y = enemy.y * size;
    const u = size / 16;

    this.drawShadow(ctx, x + size / 2, y + u * 14, u * 5.5, u * 2.4);

    // EGG FORM (when shot by magic)
    if (enemy.isEgg) {
      const wobble = enemy.eggWobble ? Math.sin(time * 25) * (u * 2) : 0;
      const eggX = x + wobble;

      if (enemy.isInWater) {
        // Floating Egg Raft with water wake ripples
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(eggX + size / 2, y + u * 13, u * 7.5, u * 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3D Egg shape with highlights
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(eggX + size / 2, y + size / 2, u * 5.8, u * 7.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(eggX + size / 2 - u * 0.8, y + size / 2 - u * 0.8, u * 5, u * 6.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Egg specular sheen
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(eggX + size / 2 - u * 2, y + size / 2 - u * 2.5, u * 2, u * 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Speckles / crack fissures
      ctx.fillStyle = '#d97706';
      ctx.fillRect(eggX + u * 6, y + u * 7, u * 1.2, u * 1.2);
      ctx.fillRect(eggX + u * 9.5, y + u * 10, u * 1.2, u * 1.2);
      return;
    }

    switch (enemy.type) {
      case 'SNAKEY': {
        // Coiled emerald serpent with shaded scales and flicking tongue
        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + u * 11, u * 6.5, u * 3.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + u * 8, u * 5.8, u * 6.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cream belly plates
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + u * 5.5, y + u * 8, u * 5, u * 5.5);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x + u * 5.5, y + u * 9.5, u * 5, u * 1.2);
        ctx.fillRect(x + u * 5.5, y + u * 11.5, u * 5, u * 1.2);

        // Big cute eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + u * 4.2, y + u * 4.5, u * 2.8, u * 3.5);
        ctx.fillRect(x + u * 9, y + u * 4.5, u * 2.8, u * 3.5);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + u * 5.5, y + u * 5.5, u * 1.5, u * 2.2);
        ctx.fillRect(x + u * 10.2, y + u * 5.5, u * 1.5, u * 2.2);

        // Flickering tongue
        if (Math.floor(time * 5) % 2 === 0) {
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(x + u * 7.5, y + u * 8.5, u, u * 2.5);
        }
        break;
      }

      case 'GOLG': {
        // Detailed stone dragon gargoyle
        const isAwake = enemy.isAwake;
        ctx.fillStyle = '#047857';
        ctx.fillRect(x + u * 2, y + u * 3, u * 12, u * 11);

        // Curved dragon horns
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x + u * 1.5, y + u * 0.5, u * 2.5, u * 3.5);
        ctx.fillRect(x + u * 12, y + u * 0.5, u * 2.5, u * 3.5);

        // Belly
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + u * 4.5, y + u * 8, u * 7, u * 5.5);

        if (!isAwake) {
          // Closed eyes (sleeping)
          ctx.fillStyle = '#064e3b';
          ctx.fillRect(x + u * 3.5, y + u * 6, u * 3.5, u * 1.5);
          ctx.fillRect(x + u * 9, y + u * 6, u * 3.5, u * 1.5);

          // Snoring "Zzz"
          const zFloat = (time * 2) % 3;
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(u * 5.5)}px 'Press Start 2P', monospace`;
          ctx.fillText('Z', x + u * 11, y + u * 1.5 - zFloat * u * 2);
        } else {
          // Glowing red/orange dragon fire eyes
          ctx.fillStyle = '#f97316';
          ctx.fillRect(x + u * 3.5, y + u * 5, u * 3.5, u * 3.5);
          ctx.fillRect(x + u * 9, y + u * 5, u * 3.5, u * 3.5);

          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x + u * 4.5, y + u * 6, u * 1.5, u * 1.5);
          ctx.fillRect(x + u * 10, y + u * 6, u * 1.5, u * 1.5);
        }
        break;
      }

      case 'MEDUSA': {
        // Carved Gorgon statue with glowing ruby eyes
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + u * 2, y + u * 3, u * 12, u * 11);

        // Serpent crown hair
        ctx.fillStyle = '#334155';
        ctx.fillRect(x + u * 1, y + u * 1, u * 14, u * 3.5);
        ctx.fillRect(x + u * 0.5, y + u * 3.5, u * 2, u * 5);
        ctx.fillRect(x + u * 13.5, y + u * 3.5, u * 2, u * 5);

        // Incandescent ruby red eyes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(x + u * 4, y + u * 6, u * 3, u * 2.2);
        ctx.fillRect(x + u * 9, y + u * 6, u * 3, u * 2.2);

        ctx.fillStyle = '#fee2e2';
        ctx.fillRect(x + u * 5, y + u * 6.5, u * 1.2, u * 1.2);
        ctx.fillRect(x + u * 10, y + u * 6.5, u * 1.2, u * 1.2);
        break;
      }

      case 'DON_MEDUSA': {
        // Menacing floating purple/gold spiked medusa
        const bob = Math.sin(time * 6) * (u * 1.5);
        ctx.fillStyle = '#6b21a8';
        ctx.fillRect(x + u * 2, y + u * 2 + bob, u * 12, u * 12);

        // Gold spikes
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + u * 7, y + bob - u * 1.5, u * 2, u * 3);
        ctx.fillRect(x + u * 7, y + u * 14.5 + bob, u * 2, u * 3);
        ctx.fillRect(x - u * 1.5, y + u * 7 + bob, u * 3, u * 2);
        ctx.fillRect(x + u * 14.5, y + u * 7 + bob, u * 3, u * 2);

        // Glowing crimson center eye
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2 + bob, u * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + size / 2 - u, y + size / 2 - u + bob, u * 2, u * 2);
        break;
      }

      case 'SKULL': {
        // Polished bone skull
        const isAwake = enemy.isAwake;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(x + u * 3, y + u * 2, u * 10, u * 10.5);
        ctx.fillRect(x + u * 4.5, y + u * 11, u * 7, u * 3);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + u * 4.5, y + u * 5, u * 2.8, u * 3.5);
        ctx.fillRect(x + u * 8.7, y + u * 5, u * 2.8, u * 3.5);
        ctx.fillRect(x + u * 7, y + u * 8.5, u * 2, u * 1.8);

        if (isAwake) {
          // Blue spectral flame eyes
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(x + u * 5.2, y + u * 6, u * 1.5, u * 1.5);
          ctx.fillRect(x + u * 9.4, y + u * 6, u * 1.5, u * 1.5);
        }
        break;
      }

      case 'ALMA': {
        // Crimson armored armadillo
        ctx.fillStyle = '#dc2626';
        if (enemy.isRolling) {
          // Spinning ball with motion trail
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, u * 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x + size / 2 - u * 2.5, y + size / 2 - u * 2.5, u * 5, u * 5);
        } else {
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2 - u, u * 6.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fed7aa';
          ctx.fillRect(x + u * 4, y + u * 8, u * 8, u * 5.5);

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + u * 5, y + u * 5, u * 1.8, u * 2);
          ctx.fillRect(x + u * 9.2, y + u * 5, u * 1.8, u * 2);
        }
        break;
      }

      case 'ROCKY': {
        // Heavy ancient golem
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x + u * 2, y + u * 2, u * 12, u * 12);

        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + u * 3, y + u * 3, u * 10, u * 10);

        // Glowing runic eyes
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + u * 4.5, y + u * 5.5, u * 2.5, u * 2);
        ctx.fillRect(x + u * 9, y + u * 5.5, u * 2.5, u * 2);
        break;
      }
    }
  }

  // --- PROJECTILES & LASER BEAMS ---

  static drawMagicShot(ctx: CanvasRenderingContext2D, shot: MagicShot, size: number, time: number) {
    if (!shot.active) return;
    const x = shot.x * size;
    const y = shot.y * size;
    const u = size / 16;

    // Glowing cyan/white magical projectile with energy halo
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, u * 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, u * 3.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, u * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  static drawLaser(ctx: CanvasRenderingContext2D, laser: LaserBeam, size: number) {
    if (!laser.active) return;
    const u = size / 16;

    const startX = laser.startX * size + size / 2;
    const startY = laser.startY * size + size / 2;
    const endX = laser.endX * size + size / 2;
    const endY = laser.endY * size + size / 2;

    ctx.save();
    if (laser.sourceType === 'GOLG') {
      // Fireball beam
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = u * 6;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = u * 2.8;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else {
      // Medusa electric lethal beam
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
      ctx.lineWidth = u * 7;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = u * 3.5;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = u * 1.8;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.restore();
  }
}
