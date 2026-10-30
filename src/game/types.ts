/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Types & Interfaces
 */

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type WorldTheme = 'CASTLE' | 'GARDENS' | 'CRYSTAL_CAVERN' | 'SUN_TEMPLE' | 'SHADOW_TOWER';

export type TileType =
  | 'EMPTY'         // Walkable floor (themed per world)
  | 'WALL'          // Outer / inner carved stone wall
  | 'TREE'          // Themed foliage / pillars / crystal formations
  | 'ROCK'          // Themed carved boulders / monoliths
  | 'WATER'         // Water canal / moat (can be rafted with egg)
  | 'LAVA'          // Molten magma canal
  | 'BRIDGE_H'      // Horizontal bridge
  | 'BRIDGE_V'      // Vertical bridge
  | 'ARROW_UP'      // One-way passage Up
  | 'ARROW_DOWN'    // One-way passage Down
  | 'ARROW_LEFT'    // One-way passage Left
  | 'ARROW_RIGHT';  // One-way passage Right

export type EnemyType =
  | 'SNAKEY'      // Sedentary serpent, transforms to pushable egg
  | 'GOLG'        // Sleeping stone dragon, wakes to shoot fire
  | 'SKULL'       // Sleeping skull, wakes to chase Lolo
  | 'ALMA'        // Red armored armadillo, patrols and rolls rapidly
  | 'MEDUSA'      // Gorgon statue, deadly line-of-sight laser
  | 'DON_MEDUSA'  // Floating moving medusa with perpendicular blades
  | 'ROCKY';      // Heavy golem, pursues to corner player

export interface Position {
  x: number;
  y: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface HeartFramer {
  id: string;
  x: number;
  y: number;
  shotsGranted: number;
  collected: boolean;
}

export interface EmeraldFramer {
  id: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
}

export interface JewelChest {
  x: number;
  y: number;
  isOpen: boolean;
  isCollected: boolean;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  startX: number;
  startY: number;
  dir: Direction;
  patrolMin?: number;
  patrolMax?: number;
  patrolAxis?: 'X' | 'Y';
  patrolSpeed?: number;
  isEgg: boolean;
  eggTimer?: number;
  eggWobble?: boolean;
  isFlownAway?: boolean;
  respawnTimer?: number;
  isInWater?: boolean;
  waterTimer?: number;
  isAwake?: boolean;
  isRolling?: boolean;
  rollTarget?: Position;
  lastMoveTime?: number;
}

export interface MagicShot {
  x: number;
  y: number;
  dir: Direction;
  active: boolean;
}

export interface LaserBeam {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  sourceType: 'MEDUSA' | 'DON_MEDUSA' | 'GOLG';
  active: boolean;
  timer: number;
}

export interface RoomDefinition {
  id: number;            // 1 to 50
  world: number;         // 1 to 5
  roomNumber: number;    // 1 to 10
  worldName: string;
  name: string;
  subtitle: string;
  hint: string;
  theme: WorldTheme;
  grid: TileType[][];    // 11 rows x 11 columns
  exitDoor: { x: number; y: number };
  chest: { x: number; y: number };
  hearts: { x: number; y: number; shots: number }[];
  emeralds: { x: number; y: number }[];
  enemies: {
    type: EnemyType;
    x: number;
    y: number;
    dir?: Direction;
    patrolMin?: number;
    patrolMax?: number;
    patrolAxis?: 'X' | 'Y';
    patrolSpeed?: number;
  }[];
  playerStart: { x: number; y: number; dir?: Direction };
}

export interface PlayerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  dir: Direction;
  isMoving: boolean;
  moveProgress: number;
  shots: number;
  lives: number;
  score: number;
  isDead: boolean;
  isVictory: boolean;
  deathReason?: string;
  animationFrame: number;
}

export interface HistorySnapshot {
  player: { x: number; y: number; dir: Direction; shots: number };
  hearts: { id: string; collected: boolean }[];
  emeralds: { id: string; x: number; y: number }[];
  enemies: {
    id: string;
    x: number;
    y: number;
    dir: Direction;
    isEgg: boolean;
    eggTimer?: number;
    isInWater?: boolean;
    isFlownAway?: boolean;
    respawnTimer?: number;
  }[];
  chest: { isOpen: boolean; isCollected: boolean };
}

export type GameScreen = 'TITLE' | 'PLAYING' | 'PAUSED' | 'STORY' | 'LEVEL_SELECT' | 'GAME_OVER' | 'ALL_CLEAR';
