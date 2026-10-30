/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Game Boy Advance Title Screen
 * Inspired by The Legend of Zelda: The Minish Cap & Golden Sun
 */

import React from 'react';
import { Play, RotateCcw, Compass, BookOpen, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../game/sound';

interface TitleScreenProps {
  unlockedLevel: number;
  highScore: number;
  onStartGame: () => void;
  onContinue: () => void;
  onOpenLevelSelect: () => void;
  onOpenStory: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  unlockedLevel,
  highScore,
  onStartGame,
  onContinue,
  onOpenLevelSelect,
  onOpenStory
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const unlockedWorld = Math.floor((unlockedLevel - 1) / 10) + 1;
  const unlockedRoom = ((unlockedLevel - 1) % 10) + 1;

  return (
    <div className="relative w-full max-w-lg min-h-[590px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 border-4 border-amber-500/60 rounded-3xl shadow-2xl text-slate-100 overflow-hidden font-pixel">
      {/* Golden Sun / Minish Cap style sunbeam backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

      {/* Top Bar: High Score & Sound */}
      <div className="w-full flex items-center justify-between text-[10px] text-amber-300 z-10">
        <div className="flex items-center gap-1.5 tabular-nums">
          <Sparkles size={13} className="text-amber-400" />
          <span>RECORDE:</span>
          <span className="text-emerald-400 font-bold">{highScore.toString().padStart(6, '0')}</span>
        </div>

        <button
          onClick={toggleSound}
          title="Alternar Áudio"
          className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 transition-colors"
        >
          {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
        </button>
      </div>

      {/* Hero Characters & Title Lockup */}
      <div className="flex flex-col items-center gap-2 my-2 z-10 text-center">
        {/* Animated GBA Lolo & Princess Lala */}
        <div className="flex items-center justify-center gap-8 my-2">
          {/* Lolo (3D shaded GBA hero) */}
          <div className="relative w-18 h-18 rounded-full bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 border-4 border-blue-300 shadow-xl shadow-blue-900/50 flex items-center justify-center animate-bounce">
            <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-blue-200/80" />
            <div className="flex gap-2.5">
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.8 h-2.5 bg-slate-900 rounded-full" />
              </div>
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.8 h-2.5 bg-slate-900 rounded-full" />
              </div>
            </div>
            {/* Boots */}
            <div className="absolute -bottom-2 flex gap-4">
              <div className="w-4 h-3 bg-amber-800 border border-amber-600 rounded-md" />
              <div className="w-4 h-3 bg-amber-800 border border-amber-600 rounded-md" />
            </div>
          </div>

          <div className="flex flex-col items-center animate-pulse">
            <span className="text-red-500 text-3xl">♥</span>
            <span className="text-[8px] text-amber-300">EDEN</span>
          </div>

          {/* Princess Lala */}
          <div className="relative w-18 h-18 rounded-full bg-gradient-to-b from-pink-400 via-pink-500 to-pink-700 border-4 border-pink-300 shadow-xl shadow-pink-900/50 flex items-center justify-center animate-bounce [animation-delay:0.2s]">
            {/* Crown */}
            <div className="absolute -top-3.5 w-6 h-4 bg-amber-400 border border-amber-200 rounded-t-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-pink-200/80" />
            <div className="flex gap-2.5">
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.8 h-2.5 bg-slate-900 rounded-full" />
              </div>
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.8 h-2.5 bg-slate-900 rounded-full" />
              </div>
            </div>
            <div className="absolute -bottom-2 flex gap-4">
              <div className="w-4 h-3 bg-amber-800 border border-amber-600 rounded-md" />
              <div className="w-4 h-3 bg-amber-800 border border-amber-600 rounded-md" />
            </div>
          </div>
        </div>

        {/* Title Lockup */}
        <div className="relative mt-1">
          <span className="text-[9px] text-cyan-300 font-bold tracking-widest uppercase">
            GAME BOY ADVANCE EDITION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] tracking-tight">
            ADVENTURES OF LOLO
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-[9px] text-amber-400 mt-1">
            <span>5 MUNDOS</span>
            <span>·</span>
            <span>50 SALAS</span>
            <span>·</span>
            <span>GRÁFICOS 15-BIT</span>
          </div>
        </div>

        {/* World Preview Badge Carousel */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm mt-1 text-[8px]">
          <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-700 text-slate-300 rounded">1. Castelo</span>
          <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-700 text-emerald-400 rounded">2. Jardins</span>
          <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-700 text-cyan-400 rounded">3. Cristais</span>
          <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-700 text-amber-400 rounded">4. Sol</span>
          <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-700 text-purple-400 rounded">5. Torre</span>
        </div>
      </div>

      {/* Main Menu Actions */}
      <div className="w-full flex flex-col gap-2.5 z-10 max-w-xs my-2">
        {/* Start Game */}
        <button
          onClick={onStartGame}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 active:from-emerald-800 active:to-green-800 border-2 border-emerald-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-xl shadow-emerald-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play size={16} fill="white" />
          <span>NOVO JOGO</span>
        </button>

        {/* Continue */}
        {unlockedLevel > 1 && (
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 active:from-blue-800 active:to-indigo-800 border-2 border-blue-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-xl shadow-blue-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw size={16} />
            <span>CONTINUAR (M{unlockedWorld}-{unlockedRoom})</span>
          </button>
        )}

        {/* Level Select */}
        <button
          onClick={onOpenLevelSelect}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 rounded-xl flex items-center justify-center gap-2 text-[11px] text-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Compass size={14} className="text-amber-400" />
          <span>SELEÇÃO DE MUNDOS ({unlockedLevel}/50)</span>
        </button>

        {/* Story & GBA Guide */}
        <button
          onClick={onOpenStory}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/60 rounded-xl flex items-center justify-center gap-2 text-[11px] text-slate-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <BookOpen size={14} className="text-cyan-400" />
          <span>HISTÓRIA & MANUAL GBA</span>
        </button>
      </div>

      {/* Control Hints Footer */}
      <div className="w-full border-t border-slate-800/80 pt-3 text-center text-[9px] text-slate-500 z-10 leading-normal">
        <div>CONTROLES GBA: SETAS/WASD · Z MAGIA · X RESET · U DESFAZER</div>
        <div className="text-slate-600 mt-0.5">COMPATÍVEL COM COMPUTADOR, TABLETS E CELULARES</div>
      </div>
    </div>
  );
};
