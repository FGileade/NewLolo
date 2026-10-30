/**
 * NEW LOLO - Retro NES Puzzle Adventure
 * Inspired by classic Adventures of Lolo (1987)
 */

import React, { useState } from 'react';
import { useGameEngine } from './game/useGameEngine';
import { GameCanvas } from './components/GameCanvas';
import { NESHud } from './components/NESHud';
import { MobileControls } from './components/MobileControls';
import { TitleScreen } from './components/TitleScreen';
import { LevelSelectModal } from './components/LevelSelectModal';
import { StoryModal } from './components/StoryModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { EndingScreen } from './components/EndingScreen';

export default function App() {
  const {
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
  } = useGameEngine();

  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showStory, setShowStory] = useState(false);

  // Level selection handler
  const handleSelectLevel = (levelIndex: number) => {
    setShowLevelSelect(false);
    startGame(levelIndex);
  };

  return (
    <main className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-x-hidden">
      {/* TITLE SCREEN */}
      {screen === 'TITLE' && (
        <TitleScreen
          unlockedLevel={unlockedLevel}
          highScore={highScore}
          onStartGame={() => startGame(0)}
          onContinue={continueGame}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onOpenStory={() => setShowStory(true)}
        />
      )}

      {/* ACTIVE PLAYING VIEW */}
      {(screen === 'PLAYING' || screen === 'PAUSED') && (
        <div className="w-full max-w-lg flex flex-col items-center justify-center gap-2">
          {/* NES HUD Status Header */}
          <NESHud
            currentLevel={currentLevel}
            player={player}
            hearts={hearts}
            onResetRoom={resetRoom}
            onUndo={undo}
            onPause={() => setScreen('PAUSED')}
            crtEnabled={crtEnabled}
            onToggleCrt={() => setCrtEnabled(prev => !prev)}
          />

          {/* Dedicated Playfield Canvas */}
          <div className="relative flex items-center justify-center">
            <GameCanvas
              currentLevel={currentLevel}
              grid={grid}
              player={player}
              hearts={hearts}
              emeralds={emeralds}
              chest={chest}
              enemies={enemies}
              magicShot={magicShot}
              laserBeam={laserBeam}
              crtEnabled={crtEnabled}
            />

            {/* Victory / Death Overlay Badges */}
            {player.isDead && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] rounded-xl font-pixel animate-pulse">
                <span className="text-red-500 text-lg font-bold">DERROTADO!</span>
                <span className="text-[10px] text-slate-200 mt-1 max-w-[200px] text-center">
                  {player.deathReason || 'Tente novamente!'}
                </span>
              </div>
            )}

            {player.isVictory && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-950/60 backdrop-blur-[2px] rounded-xl font-pixel animate-fadeIn">
                <span className="text-amber-300 text-xl font-bold animate-bounce">SALA CONCLUÍDA!</span>
                <span className="text-xs text-emerald-400 mt-1 font-bold">+500 PONTOS</span>
              </div>
            )}
          </div>

          {/* Virtual NES Controller - strictly outside and below canvas */}
          <MobileControls
            onMove={movePlayer}
            onShoot={shootMagic}
            onReset={resetRoom}
            onUndo={undo}
          />
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {screen === 'GAME_OVER' && (
        <GameOverModal
          score={player.score}
          onContinue={continueGame}
          onGoHome={() => setScreen('TITLE')}
        />
      )}

      {/* ALL CLEAR / ENDING SCREEN */}
      {screen === 'ALL_CLEAR' && (
        <EndingScreen
          score={player.score}
          onGoHome={() => setScreen('TITLE')}
        />
      )}

      {/* MODALS */}
      {screen === 'PAUSED' && (
        <PauseModal
          onResume={() => setScreen('PLAYING')}
          onResetRoom={resetRoom}
          onOpenLevelSelect={() => setShowLevelSelect(true)}
          onGoHome={() => setScreen('TITLE')}
        />
      )}

      {showLevelSelect && (
        <LevelSelectModal
          unlockedLevel={unlockedLevel}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelSelect(false)}
        />
      )}

      {showStory && (
        <StoryModal onClose={() => setShowStory(false)} />
      )}
    </main>
  );
}
