/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Game Boy Advance Status Header & HUD
 * Inspired by The Legend of Zelda: The Minish Cap & Golden Sun
 */

import React, { useState } from 'react';
import { RoomDefinition, PlayerState, HeartFramer } from '../game/types';
import { sound } from '../game/sound';
import { Volume2, VolumeX, RotateCcw, Undo2, HelpCircle, Pause, Sparkles } from 'lucide-react';

interface NESHudProps {
  currentLevel: RoomDefinition;
  player: PlayerState;
  hearts: HeartFramer[];
  onResetRoom: () => void;
  onUndo: () => void;
  onPause: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
}

export const NESHud: React.FC<NESHudProps> = ({
  currentLevel,
  player,
  hearts,
  onResetRoom,
  onUndo,
  onPause,
  crtEnabled,
  onToggleCrt
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  const remainingHearts = hearts.filter(h => !h.collected).length;

  const toggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="w-full max-w-[468px] flex flex-col gap-2 font-pixel text-xs text-amber-100">
      {/* Top Banner: World Name & Room */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-amber-500/50 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[10px] font-bold">
            M{currentLevel.world}-{currentLevel.roomNumber}
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-100 truncate max-w-[150px] sm:max-w-[180px]">
              {currentLevel.name}
            </span>
            <span className="text-[9px] text-amber-400/80 truncate max-w-[150px]">
              {currentLevel.worldName}
            </span>
          </div>
        </div>

        {/* Score Readout */}
        <div className="flex items-center gap-1.5 tabular-nums">
          <span className="text-slate-400 text-[9px]">PTS</span>
          <span className="text-emerald-400 font-bold text-xs">{player.score.toString().padStart(6, '0')}</span>
        </div>
      </div>

      {/* Main Status Row: Lives, Hearts Remaining, Magic Power */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 bg-slate-900/90 border-2 border-indigo-900/60 rounded-xl shadow-md">
        {/* Lives (Cute GBA Lolo Icon) */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 border-2 border-blue-300 flex items-center justify-center text-[10px] text-white font-bold shadow-md">
            L
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-400">VIDAS</span>
            <span className="text-xs font-bold text-amber-300 tabular-nums">×{player.lives}</span>
          </div>
        </div>

        {/* Hearts Remaining */}
        <div className="flex items-center justify-center gap-2 border-x border-slate-800 px-2">
          <div className="w-4 h-4 text-red-500 flex items-center justify-center animate-pulse text-sm">
            ♥
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-400">RESTAM</span>
            <span className="text-xs font-bold text-red-400 tabular-nums">{remainingHearts}</span>
          </div>
        </div>

        {/* Magic Power (PW) */}
        <div className="flex items-center justify-end gap-2">
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-slate-400">MAGIA</span>
            <div className="flex items-center gap-1 justify-end">
              <span className="text-xs font-bold text-cyan-300 tabular-nums">{player.shots}</span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(player.shots, 4) }).map((_, i) => (
                  <div key={i} className="w-2 h-3 bg-gradient-to-b from-cyan-300 to-cyan-500 border border-cyan-100 rounded-sm shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="flex items-center justify-between gap-1 text-[10px]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            title="Desfazer movimento (U)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-amber-400/50 rounded-lg text-slate-200 transition-colors"
          >
            <Undo2 size={13} className="text-amber-400" />
            <span className="text-[9px]">DESFAZER</span>
          </button>

          <button
            onClick={onResetRoom}
            title="Reiniciar sala (R ou X)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-red-400/50 rounded-lg text-slate-200 transition-colors"
          >
            <RotateCcw size={13} className="text-red-400" />
            <span className="text-[9px]">REINICIAR</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowHint(!showHint)}
            title="Dica do quebra-cabeça"
            className={`p-1.5 rounded-lg border transition-colors ${showHint ? 'bg-amber-900/60 border-amber-500 text-amber-300' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'}`}
          >
            <HelpCircle size={14} />
          </button>

          <button
            onClick={toggleMute}
            title="Mudo / Som (M)"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
          </button>

          <button
            onClick={onPause}
            title="Pausar jogo (Esc)"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
          >
            <Pause size={14} />
          </button>
        </div>
      </div>

      {/* Puzzle Hint Banner */}
      {showHint && (
        <div className="p-3 bg-amber-950/90 border border-amber-500/80 rounded-xl text-[10px] text-amber-100 leading-relaxed shadow-lg animate-fadeIn">
          <span className="font-bold text-amber-400 mr-1.5">💡 DICA:</span>
          {currentLevel.hint}
        </div>
      )}
    </div>
  );
};
