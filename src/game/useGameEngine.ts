/**
 * NEW LOLO - Complete Game Engine Hook
 * Implements full 60fps simulation, collisions, enemy AI, puzzles & undo
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Direction,
  TileType,
  RoomDefinition,
  PlayerState,
  HeartFramer,
  EmeraldFramer,
  JewelChest,
  Enemy,
  MagicShot,
  LaserBeam,
  HistorySnapshot,
  GameScreen
} from './types';
import { LEVELS } from './levels';
import { sound } from './sound';

const STORAGE_KEY = 'NEW_LOLO_PROGRESS_V1';

export function useGameEngine() {
  // Screen State
  const [screen, setScreen] = useState<GameScreen>('TITLE');
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [highScore, setHighScore] = useState<number>(0);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

  // Active Room Definition
  const currentLevel = LEVELS[currentLevelIndex] || LEVELS[0];

  // Game Playfield State
  const [grid, setGrid] = useState<TileType[][]>(() => currentLevel.grid.map(row => [...row]));
  const [player, setPlayer] = useState<PlayerState>({
    x: currentLevel.playerStart.x,
    y: currentLevel.playerStart.y,
    targetX: currentLevel.playerStart.x,
    targetY: currentLevel.playerStart.y,
    dir: currentLevel.playerStart.dir || 'UP',
    isMoving: false,
    moveProgress: 0,
    shots: 0,
    lives: 5,
    score: 0,
    isDead: false,
    isVictory: false,
    animationFrame: 0
  });

  const [hearts, setHearts] = useState<HeartFramer[]>([]);
  const [emeralds, setEmeralds] = useState<EmeraldFramer[]>([]);
  const [chest, setChest] = useState<JewelChest>({ x: 5, y: 5, isOpen: false, isCollected: false });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [magicShot, setMagicShot] = useState<MagicShot | null>(null);
  const [laserBeam, setLaserBeam] = useState<LaserBeam | null>(null);

  // Undo History Stack
  const historyRef = useRef<HistorySnapshot[]>([]);

  // Simulation Refs for 60fps loop
  const playerRef = useRef(player);
  playerRef.current = player;

  const heartsRef = useRef(hearts);
  heartsRef.current = hearts;

  const emeraldsRef = useRef(emeralds);
  emeraldsRef.current = emeralds;

  const chestRef = useRef(chest);
  chestRef.current = chest;

  const enemiesRef = useRef(enemies);
  enemiesRef.current = enemies;

  const magicShotRef = useRef(magicShot);
  magicShotRef.current = magicShot;

  const gridRef = useRef(grid);
  gridRef.current = grid;

  const screenRef = useRef(screen);
  screenRef.current = screen;

  const currentLevelRef = useRef(currentLevel);
  currentLevelRef.current = currentLevel;

  const lastPlayerMoveTimeRef = useRef<number>(0);

  // Load Saved Progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.unlockedLevel) setUnlockedLevel(Math.min(50, Math.max(1, data.unlockedLevel)));
        if (data.highScore) setHighScore(data.highScore);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save Progress
  const saveProgress = useCallback((newUnlocked: number, newScore: number) => {
    try {
      setUnlockedLevel(prev => {
        const updated = Math.max(prev, newUnlocked);
        setHighScore(hs => {
          const maxHs = Math.max(hs, newScore);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlockedLevel: updated, highScore: maxHs }));
          return maxHs;
        });
        return updated;
      });
    } catch {
      // ignore
    }
  }, []);

  // Save snapshot for Undo
  const pushHistorySnapshot = useCallback(() => {
    const snap: HistorySnapshot = {
      player: {
        x: playerRef.current.x,
        y: playerRef.current.y,
        dir: playerRef.current.dir,
        shots: playerRef.current.shots
      },
      hearts: heartsRef.current.map(h => ({ id: h.id, collected: h.collected })),
      emeralds: emeraldsRef.current.map(e => ({ id: e.id, x: e.x, y: e.y })),
      enemies: enemiesRef.current.map(en => ({
        id: en.id,
        x: en.x,
        y: en.y,
        dir: en.dir,
        isEgg: en.isEgg,
        eggTimer: en.eggTimer,
        isInWater: en.isInWater,
        isFlownAway: en.isFlownAway,
        respawnTimer: en.respawnTimer
      })),
      chest: {
        isOpen: chestRef.current.isOpen,
        isCollected: chestRef.current.isCollected
      }
    };
    historyRef.current.push(snap);
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    }
  }, []);

  // Initialize Room
  const initRoom = useCallback((lvlIndex: number, retainLivesAndScore = true) => {
    const lvl = LEVELS[lvlIndex] || LEVELS[0];
    setCurrentLevelIndex(lvlIndex);
    historyRef.current = [];

    setGrid(lvl.grid.map(row => [...row]));

    setHearts(
      lvl.hearts.map((h, i) => ({
        id: `heart_${i}`,
        x: h.x,
        y: h.y,
        shotsGranted: h.shots,
        collected: false
      }))
    );

    setEmeralds(
      lvl.emeralds.map((e, i) => ({
        id: `emerald_${i}`,
        x: e.x,
        y: e.y
      }))
    );

    setChest({
      x: lvl.chest.x,
      y: lvl.chest.y,
      isOpen: false,
      isCollected: false
    });

    setEnemies(
      lvl.enemies.map((en, i) => ({
        id: `enemy_${i}`,
        type: en.type,
        x: en.x,
        y: en.y,
        startX: en.x,
        startY: en.y,
        dir: en.dir || 'DOWN',
        patrolMin: en.patrolMin,
        patrolMax: en.patrolMax,
        patrolAxis: en.patrolAxis,
        isEgg: false,
        isAwake: false,
        isInWater: false,
        isFlownAway: false
      }))
    );

    setMagicShot(null);
    setLaserBeam(null);

    setPlayer(prev => ({
      x: lvl.playerStart.x,
      y: lvl.playerStart.y,
      targetX: lvl.playerStart.x,
      targetY: lvl.playerStart.y,
      dir: lvl.playerStart.dir || 'UP',
      isMoving: false,
      moveProgress: 0,
      shots: 0,
      lives: retainLivesAndScore ? prev.lives : 5,
      score: retainLivesAndScore ? prev.score : 0,
      isDead: false,
      isVictory: false,
      animationFrame: 0
    }));
  }, []);

  // Reset current room (suicide / retry puzzle)
  const resetRoom = useCallback(() => {
    sound.playDeath();
    initRoom(currentLevelIndex, true);
  }, [currentLevelIndex, initRoom]);

  // Undo last push/move
  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const snap = historyRef.current.pop()!;

    setPlayer(prev => ({
      ...prev,
      x: snap.player.x,
      y: snap.player.y,
      targetX: snap.player.x,
      targetY: snap.player.y,
      dir: snap.player.dir,
      shots: snap.player.shots,
      isMoving: false,
      moveProgress: 0
    }));

    setHearts(prev =>
      prev.map(h => {
        const found = snap.hearts.find(sh => sh.id === h.id);
        return found ? { ...h, collected: found.collected } : h;
      })
    );

    setEmeralds(prev =>
      prev.map(e => {
        const found = snap.emeralds.find(se => se.id === e.id);
        return found ? { ...e, x: found.x, y: found.y } : e;
      })
    );

    setEnemies(prev =>
      prev.map(en => {
        const found = snap.enemies.find(se => se.id === en.id);
        return found
          ? {
              ...en,
              x: found.x,
              y: found.y,
              dir: found.dir,
              isEgg: found.isEgg,
              eggTimer: found.eggTimer,
              isInWater: found.isInWater,
              isFlownAway: found.isFlownAway,
              respawnTimer: found.respawnTimer
            }
          : en;
      })
    );

    setChest({
      x: chestRef.current.x,
      y: chestRef.current.y,
      isOpen: snap.chest.isOpen,
      isCollected: snap.chest.isCollected
    });

    sound.playSelect();
  }, []);

  // Start new game
  const startGame = useCallback((startFromLevel: number = 0) => {
    sound.enableAudio();
    const lvl = LEVELS[startFromLevel] || LEVELS[0];
    sound.startBgm(lvl.theme);
    initRoom(startFromLevel, false);
    setScreen('PLAYING');
  }, [initRoom]);

  // Continue from highest unlocked level
  const continueGame = useCallback(() => {
    sound.enableAudio();
    const lvlIdx = Math.min(unlockedLevel - 1, LEVELS.length - 1);
    const lvl = LEVELS[lvlIdx] || LEVELS[0];
    sound.startBgm(lvl.theme);
    initRoom(lvlIdx, true);
    setScreen('PLAYING');
  }, [unlockedLevel, initRoom]);

  // Player Death trigger
  const triggerPlayerDeath = useCallback((reason: string) => {
    if (playerRef.current.isDead) return;
    sound.playDeath();
    setPlayer(prev => ({
      ...prev,
      isDead: true,
      deathReason: reason
    }));

    setTimeout(() => {
      setPlayer(prev => {
        const remainingLives = prev.lives - 1;
        if (remainingLives <= 0) {
          setScreen('GAME_OVER');
          return { ...prev, lives: 0 };
        } else {
          // Restart room with 1 less life
          initRoom(currentLevelRef.current.id - 1, true);
          return { ...prev, lives: remainingLives, isDead: false };
        }
      });
    }, 1200);
  }, [initRoom]);

  // Check Line of Sight between two coordinates
  const isLineOfSightClear = useCallback((x1: number, y1: number, x2: number, y2: number): boolean => {
    if (x1 !== x2 && y1 !== y2) return false;

    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);

    let cx = x1 + dx;
    let cy = y1 + dy;

    while (cx !== x2 || cy !== y2) {
      // Wall / Tree / Rock block line of sight
      if (cx < 0 || cx > 10 || cy < 0 || cy > 10) return false;
      const tile = gridRef.current[cy]?.[cx];
      if (tile === 'WALL' || tile === 'TREE' || tile === 'ROCK') return false;

      // Emerald blocks block line of sight
      if (emeraldsRef.current.some(e => e.x === cx && e.y === cy)) return false;

      // Eggs block line of sight
      if (enemiesRef.current.some(en => en.isEgg && !en.isFlownAway && en.x === cx && en.y === cy)) return false;

      cx += dx;
      cy += dy;
    }

    return true;
  }, []);

  // Shoot Magic
  const shootMagic = useCallback(() => {
    if (screenRef.current !== 'PLAYING') return;
    const p = playerRef.current;
    if (p.shots <= 0 || p.isDead || p.isVictory || magicShotRef.current?.active) return;

    sound.playShoot();
    setPlayer(prev => ({ ...prev, shots: prev.shots - 1 }));

    setMagicShot({
      x: p.x,
      y: p.y,
      dir: p.dir,
      active: true
    });
  }, []);

  // Move Player Intent
  const movePlayer = useCallback((dir: Direction) => {
    if (screenRef.current !== 'PLAYING') return;
    const now = performance.now();
    if (now - lastPlayerMoveTimeRef.current < 120) return;
    lastPlayerMoveTimeRef.current = now;

    const p = playerRef.current;
    if (p.isMoving || p.isDead || p.isVictory) return;

    let dx = 0;
    let dy = 0;
    if (dir === 'UP') dy = -1;
    else if (dir === 'DOWN') dy = 1;
    else if (dir === 'LEFT') dx = -1;
    else if (dir === 'RIGHT') dx = 1;

    const curX = p.x;
    const curY = p.y;
    const nextX = curX + dx;
    const nextY = curY + dy;

    // Turn facing direction immediately
    if (p.dir !== dir) {
      setPlayer(prev => ({ ...prev, dir }));
    }

    // Check One-Way Arrow Tile Restrictions
    const curTile = gridRef.current[curY]?.[curX];
    if (curTile === 'ARROW_UP' && dir !== 'UP') return;
    if (curTile === 'ARROW_DOWN' && dir !== 'DOWN') return;
    if (curTile === 'ARROW_LEFT' && dir !== 'LEFT') return;
    if (curTile === 'ARROW_RIGHT' && dir !== 'RIGHT') return;

    // Check bounds or exit door
    if (nextY === -1 && nextX === 5) {
      // Trying to enter exit door!
      if (chestRef.current.isCollected) {
        // LEVEL VICTORY!
        sound.playStageClear();
        setPlayer(prev => ({ ...prev, isVictory: true }));

        const nextLvlIndex = currentLevelRef.current.id; // next level id
        saveProgress(nextLvlIndex + 1, p.score + 500);

        setTimeout(() => {
          if (nextLvlIndex >= LEVELS.length) {
            setScreen('ALL_CLEAR');
          } else {
            initRoom(nextLvlIndex, true);
          }
        }, 1200);
        return;
      } else {
        return; // Door is locked
      }
    }

    if (nextX < 0 || nextX > 10 || nextY < 0 || nextY > 10) return;

    const nextTile = gridRef.current[nextY][nextX];

    // Solid terrain
    if (nextTile === 'WALL' || nextTile === 'TREE' || nextTile === 'ROCK' || nextTile === 'LAVA') {
      return;
    }

    // Closed Chest
    if (chestRef.current.x === nextX && chestRef.current.y === nextY && !chestRef.current.isOpen) {
      return;
    }

    // Check for Emerald Framer at target tile
    const emeraldIndex = emeraldsRef.current.findIndex(e => e.x === nextX && e.y === nextY);
    if (emeraldIndex !== -1) {
      const blockTargetX = nextX + dx;
      const blockTargetY = nextY + dy;

      if (blockTargetX < 0 || blockTargetX > 10 || blockTargetY < 0 || blockTargetY > 10) return;

      const blockTargetTile = gridRef.current[blockTargetY][blockTargetX];
      if (
        blockTargetTile === 'WALL' ||
        blockTargetTile === 'TREE' ||
        blockTargetTile === 'ROCK' ||
        blockTargetTile === 'WATER' ||
        blockTargetTile === 'LAVA'
      ) {
        return;
      }

      // Check if block target is occupied by another block, chest, or enemy
      if (emeraldsRef.current.some(e => e.x === blockTargetX && e.y === blockTargetY)) return;
      if (chestRef.current.x === blockTargetX && chestRef.current.y === blockTargetY) return;
      if (enemiesRef.current.some(en => !en.isFlownAway && en.x === blockTargetX && en.y === blockTargetY)) return;

      // Valid push! Save snapshot
      pushHistorySnapshot();
      sound.playPush();

      setEmeralds(prev => {
        const copy = [...prev];
        copy[emeraldIndex] = { ...copy[emeraldIndex], x: blockTargetX, y: blockTargetY };
        return copy;
      });

      // Move player into the vacated tile
      setPlayer(prev => ({
        ...prev,
        x: nextX,
        y: nextY,
        targetX: nextX,
        targetY: nextY,
        dir
      }));
      return;
    }

    // Check for Enemy at target tile
    const enemyIndex = enemiesRef.current.findIndex(en => !en.isFlownAway && en.x === nextX && en.y === nextY);
    if (enemyIndex !== -1) {
      const en = enemiesRef.current[enemyIndex];

      if (en.isEgg) {
        const eggTargetX = nextX + dx;
        const eggTargetY = nextY + dy;

        if (eggTargetX < 0 || eggTargetX > 10 || eggTargetY < 0 || eggTargetY > 10) return;

        const eggTargetTile = gridRef.current[eggTargetY][eggTargetX];

        if (eggTargetTile === 'WATER') {
          // Push egg into water to become a raft!
          pushHistorySnapshot();
          sound.playEggSplash();

          setEnemies(prev => {
            const copy = [...prev];
            copy[enemyIndex] = {
              ...copy[enemyIndex],
              x: eggTargetX,
              y: eggTargetY,
              isInWater: true,
              waterTimer: 30
            };
            return copy;
          });

          setPlayer(prev => ({
            ...prev,
            x: nextX,
            y: nextY,
            targetX: nextX,
            targetY: nextY,
            dir
          }));
          return;
        } else if (
          eggTargetTile === 'EMPTY' ||
          eggTargetTile === 'BRIDGE_H' ||
          eggTargetTile === 'BRIDGE_V' ||
          eggTargetTile === 'ARROW_UP' ||
          eggTargetTile === 'ARROW_DOWN' ||
          eggTargetTile === 'ARROW_LEFT' ||
          eggTargetTile === 'ARROW_RIGHT'
        ) {
          // Push egg on land
          if (emeraldsRef.current.some(e => e.x === eggTargetX && e.y === eggTargetY)) return;
          if (chestRef.current.x === eggTargetX && chestRef.current.y === eggTargetY) return;
          if (enemiesRef.current.some(other => !other.isFlownAway && other.x === eggTargetX && other.y === eggTargetY)) return;

          pushHistorySnapshot();
          sound.playPush();

          setEnemies(prev => {
            const copy = [...prev];
            copy[enemyIndex] = { ...copy[enemyIndex], x: eggTargetX, y: eggTargetY };
            return copy;
          });

          setPlayer(prev => ({
            ...prev,
            x: nextX,
            y: nextY,
            targetX: nextX,
            targetY: nextY,
            dir
          }));
          return;
        } else {
          return; // Blocked by wall, rock, etc.
        }
      } else {
        // Touching non-egg enemy
        if (en.type === 'SNAKEY' || (!en.isAwake && (en.type === 'GOLG' || en.type === 'SKULL'))) {
          // Harmless solid enemy
          return;
        } else {
          // Fatal contact with awake enemy!
          triggerPlayerDeath(`Tocado por ${en.type}!`);
          return;
        }
      }
    }

    // Check Water (fatal unless egg raft is there)
    if (nextTile === 'WATER') {
      const hasEggRaft = enemiesRef.current.some(en => en.isInWater && en.x === nextX && en.y === nextY);
      if (!hasEggRaft) {
        return; // Can't walk on water
      }
    }

    // Step into tile!
    pushHistorySnapshot();
    sound.playStep();

    setPlayer(prev => ({
      ...prev,
      x: nextX,
      y: nextY,
      targetX: nextX,
      targetY: nextY,
      dir
    }));

    // Check Open Jewel Chest Collection
    if (chestRef.current.isOpen && !chestRef.current.isCollected && chestRef.current.x === nextX && chestRef.current.y === nextY) {
      sound.playChestOpen();
      sound.playDoorOpen();
      setChest(prev => ({ ...prev, isCollected: true }));
      setPlayer(prev => ({ ...prev, score: prev.score + 1000 }));
    }

    // Check Heart Collection
    const heartIdx = heartsRef.current.findIndex(h => !h.collected && h.x === nextX && h.y === nextY);
    if (heartIdx !== -1) {
      const h = heartsRef.current[heartIdx];
      sound.playHeart();

      setHearts(prev => {
        const copy = [...prev];
        copy[heartIdx] = { ...copy[heartIdx], collected: true };

        const allCollected = copy.every(heart => heart.collected);
        if (allCollected) {
          // Open Chest & Wake Golgs/Skulls!
          sound.playChestOpen();
          setChest(c => ({ ...c, isOpen: true }));
          setEnemies(ens =>
            ens.map(enemy => ({
              ...enemy,
              isAwake: true
            }))
          );
        }
        return copy;
      });

      setPlayer(prev => ({
        ...prev,
        score: prev.score + 100,
        shots: prev.shots + h.shotsGranted
      }));
    }
  }, [pushHistorySnapshot, triggerPlayerDeath, saveProgress, initRoom]);

  // Main 60fps Simulation Loop (Enemy AI, Projectiles, Line of Sight)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      if (screenRef.current === 'PLAYING') {
        const p = playerRef.current;

        // 1. Magic Projectile Update
        if (magicShotRef.current && magicShotRef.current.active) {
          const shot = magicShotRef.current;
          let sx = shot.x;
          let sy = shot.y;

          if (shot.dir === 'UP') sy -= 12 * dt;
          else if (shot.dir === 'DOWN') sy += 12 * dt;
          else if (shot.dir === 'LEFT') sx -= 12 * dt;
          else if (shot.dir === 'RIGHT') sx += 12 * dt;

          // Check tile collision
          const tileX = Math.round(sx);
          const tileY = Math.round(sy);

          let hit = false;

          if (tileX < 0 || tileX > 10 || tileY < 0 || tileY > 10) {
            hit = true;
          } else {
            const tile = gridRef.current[tileY]?.[tileX];
            if (tile === 'WALL' || tile === 'ROCK' || tile === 'TREE') {
              hit = true;
            }
          }

          // Check hit against Emerald Framer
          if (emeraldsRef.current.some(e => Math.abs(e.x - sx) < 0.6 && Math.abs(e.y - sy) < 0.6)) {
            hit = true;
          }

          // Check hit against Enemy
          const enemyHitIndex = enemiesRef.current.findIndex(
            en => !en.isFlownAway && Math.abs(en.x - sx) < 0.6 && Math.abs(en.y - sy) < 0.6
          );

          if (enemyHitIndex !== -1) {
            hit = true;
            const enemy = enemiesRef.current[enemyHitIndex];

            if (!enemy.isEgg) {
              // 1st Shot: Turn into Egg!
              sound.playEggHit();
              setEnemies(prev => {
                const copy = [...prev];
                copy[enemyHitIndex] = {
                  ...copy[enemyHitIndex],
                  isEgg: true,
                  eggTimer: 15,
                  eggWobble: false
                };
                return copy;
              });
            } else {
              // 2nd Shot: Blast Egg offscreen!
              sound.playEggLaunch();
              setEnemies(prev => {
                const copy = [...prev];
                copy[enemyHitIndex] = {
                  ...copy[enemyHitIndex],
                  isFlownAway: true,
                  respawnTimer: 12
                };
                return copy;
              });
            }
          }

          if (hit) {
            setMagicShot(null);
          } else {
            setMagicShot({ ...shot, x: sx, y: sy });
          }
        }

        // 2. Enemy Timers & AI Update
        setEnemies(prev =>
          prev.map(en => {
            let updated = { ...en };

            // Egg timer countdown
            if (updated.isEgg && !updated.isInWater && !updated.isFlownAway) {
              const timer = (updated.eggTimer || 15) - dt;
              if (timer <= 0) {
                // Hatch back!
                sound.playEggHit();
                updated.isEgg = false;
                updated.eggWobble = false;
              } else {
                updated.eggTimer = timer;
                updated.eggWobble = timer < 3.5;
              }
            }

            // Flown away respawn timer
            if (updated.isFlownAway) {
              const rTimer = (updated.respawnTimer || 12) - dt;
              if (rTimer <= 0) {
                // Respawn at original starting point
                updated.isFlownAway = false;
                updated.isEgg = false;
                updated.x = updated.startX;
                updated.y = updated.startY;
              } else {
                updated.respawnTimer = rTimer;
              }
            }

            // DON_MEDUSA Patrol Movement
            if (updated.type === 'DON_MEDUSA' && !updated.isEgg && !updated.isFlownAway) {
              const min = updated.patrolMin ?? 1;
              const max = updated.patrolMax ?? 9;
              const speed = 1.6;

              if (updated.dir === 'RIGHT') {
                updated.x += speed * dt;
                if (updated.x >= max) {
                  updated.x = max;
                  updated.dir = 'LEFT';
                }
              } else {
                updated.x -= speed * dt;
                if (updated.x <= min) {
                  updated.x = min;
                  updated.dir = 'RIGHT';
                }
              }
            }

            // ALMA Patrol / Roll AI
            if (updated.type === 'ALMA' && !updated.isEgg && !updated.isFlownAway) {
              const min = updated.patrolMin ?? 1;
              const max = updated.patrolMax ?? 9;
              const speed = updated.isRolling ? 3.5 : 1.2;

              if (updated.dir === 'RIGHT') {
                updated.x += speed * dt;
                if (updated.x >= max) {
                  updated.x = max;
                  updated.dir = 'LEFT';
                }
              } else {
                updated.x -= speed * dt;
                if (updated.x <= min) {
                  updated.x = min;
                  updated.dir = 'RIGHT';
                }
              }

              // Alma rolling check if aligned with player
              if (Math.round(updated.y) === p.y) {
                if (isLineOfSightClear(Math.round(updated.x), Math.round(updated.y), p.x, p.y)) {
                  updated.isRolling = true;
                  updated.dir = p.x > updated.x ? 'RIGHT' : 'LEFT';
                }
              }
            }

            // SKULL Chase AI (when awake)
            if (updated.type === 'SKULL' && updated.isAwake && !updated.isEgg && !updated.isFlownAway) {
              const now = currentTime;
              if (!updated.lastMoveTime || now - updated.lastMoveTime > 450) {
                updated.lastMoveTime = now;
                const diffX = p.x - updated.x;
                const diffY = p.y - updated.y;

                let nextX = updated.x;
                let nextY = updated.y;

                if (Math.abs(diffX) > Math.abs(diffY)) {
                  nextX += Math.sign(diffX);
                } else {
                  nextY += Math.sign(diffY);
                }

                const tile = gridRef.current[nextY]?.[nextX];
                const isBlocked =
                  tile === 'WALL' ||
                  tile === 'TREE' ||
                  tile === 'ROCK' ||
                  tile === 'WATER' ||
                  emeraldsRef.current.some(e => e.x === nextX && e.y === nextY);

                if (!isBlocked) {
                  updated.x = nextX;
                  updated.y = nextY;
                }
              }
            }

            return updated;
          })
        );

        // 3. Line of Sight Lethal Hazards Check (Medusa, Don Medusa, Golg)
        if (!p.isDead && !p.isVictory) {
          enemiesRef.current.forEach(en => {
            if (en.isEgg || en.isFlownAway) return;

            // MEDUSA: Stationary instant kill in all 4 cardinal directions
            if (en.type === 'MEDUSA') {
              if (en.x === p.x || en.y === p.y) {
                if (isLineOfSightClear(en.x, en.y, p.x, p.y)) {
                  sound.playLaser();
                  setLaserBeam({
                    startX: en.x,
                    startY: en.y,
                    endX: p.x,
                    endY: p.y,
                    sourceType: 'MEDUSA',
                    active: true,
                    timer: 0.3
                  });
                  triggerPlayerDeath('Atingido pelo raio fatal da Medusa!');
                }
              }
            }

            // DON MEDUSA: Patrols and fires perpendicular / cardinal laser
            if (en.type === 'DON_MEDUSA') {
              const rx = Math.round(en.x);
              const ry = Math.round(en.y);
              if (rx === p.x || ry === p.y) {
                if (isLineOfSightClear(rx, ry, p.x, p.y)) {
                  sound.playLaser();
                  setLaserBeam({
                    startX: en.x,
                    startY: en.y,
                    endX: p.x,
                    endY: p.y,
                    sourceType: 'DON_MEDUSA',
                    active: true,
                    timer: 0.3
                  });
                  triggerPlayerDeath('Atingido pela Don Medusa!');
                }
              }
            }

            // GOLG: Once awake, fires fireballs in line of sight
            if (en.type === 'GOLG' && en.isAwake) {
              if (en.x === p.x || en.y === p.y) {
                if (isLineOfSightClear(en.x, en.y, p.x, p.y)) {
                  sound.playLaser();
                  setLaserBeam({
                    startX: en.x,
                    startY: en.y,
                    endX: p.x,
                    endY: p.y,
                    sourceType: 'GOLG',
                    active: true,
                    timer: 0.3
                  });
                  triggerPlayerDeath('Incinerado pelo dragão Golg!');
                }
              }
            }

            // SKULL, ALMA, ROCKY: Touch player check
            if ((en.type === 'SKULL' && en.isAwake) || (en.type === 'ALMA' && en.isRolling)) {
              if (Math.abs(en.x - p.x) < 0.6 && Math.abs(en.y - p.y) < 0.6) {
                triggerPlayerDeath(`Capturado pelo ${en.type}!`);
              }
            }
          });
        }

        // Fade laser beam
        if (laserBeam?.active) {
          setLaserBeam(prev => {
            if (!prev) return null;
            const t = prev.timer - dt;
            return t <= 0 ? null : { ...prev, timer: t };
          });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isLineOfSightClear, triggerPlayerDeath, laserBeam]);

  // Keyboard Event Handlers (Arrow keys, WASD, Z, X, R, U, P, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if modifying input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const code = e.code;
      const key = e.key.toUpperCase();

      if (screenRef.current === 'TITLE') {
        if (code === 'Space' || code === 'Enter' || key === 'Z') {
          e.preventDefault();
          startGame(0);
        }
        return;
      }

      if (screenRef.current === 'GAME_OVER') {
        if (code === 'Space' || code === 'Enter' || key === 'Z') {
          e.preventDefault();
          continueGame();
        }
        return;
      }

      if (screenRef.current === 'ALL_CLEAR') {
        if (code === 'Space' || code === 'Enter' || key === 'Z') {
          e.preventDefault();
          setScreen('TITLE');
        }
        return;
      }

      if (code === 'Escape' || key === 'P') {
        e.preventDefault();
        setScreen(prev => (prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev));
        return;
      }

      if (screenRef.current !== 'PLAYING') return;

      // Directions
      if (code === 'ArrowUp' || key === 'W') {
        e.preventDefault();
        movePlayer('UP');
      } else if (code === 'ArrowDown' || key === 'S') {
        e.preventDefault();
        movePlayer('DOWN');
      } else if (code === 'ArrowLeft' || key === 'A') {
        e.preventDefault();
        movePlayer('LEFT');
      } else if (code === 'ArrowRight' || key === 'D') {
        e.preventDefault();
        movePlayer('RIGHT');
      } else if (code === 'KeyZ' || code === 'Space') {
        e.preventDefault();
        shootMagic();
      } else if (code === 'KeyX' || code === 'KeyR') {
        // Reset room
        e.preventDefault();
        resetRoom();
      } else if (code === 'KeyU') {
        // Undo move
        e.preventDefault();
        undo();
      } else if (code === 'KeyM') {
        // Sound mute toggle
        e.preventDefault();
        sound.toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, shootMagic, resetRoom, undo, startGame, continueGame]);

  return {
    screen,
    setScreen,
    currentLevel,
    currentLevelIndex,
    unlockedLevel,
    highScore,
    crtEnabled,
    setCrtEnabled,
    grid,
    player,
    hearts,
    emeralds,
    chest,
    enemies,
    magicShot,
    laserBeam,
    movePlayer,
    shootMagic,
    resetRoom,
    undo,
    startGame,
    continueGame,
    initRoom
  };
}
