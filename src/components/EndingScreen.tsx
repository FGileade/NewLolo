/**
 * NEW LOLO - Grand Ending & Victory Screen
 * Plays upon beating Floor 10 Room 5 (Room 50)
 */

import React, { useEffect } from 'react';
import { Trophy, Heart, Sparkles, Home } from 'lucide-react';
import { sound } from '../game/sound';

interface EndingScreenProps {
  score: number;
  onGoHome: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ score, onGoHome }) => {
  useEffect(() => {
    sound.playStageClear();
  }, []);

  return (
    <div className="relative w-full max-w-lg min-h-[580px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-amber-950 via-indigo-950 to-slate-950 border-4 border-amber-400 rounded-2xl shadow-2xl text-slate-100 overflow-hidden font-pixel text-center">
      {/* Golden Celebration Sparkles */}
      <div className="flex items-center gap-2 text-amber-400 text-xs mt-2 animate-pulse">
        <Sparkles size={16} />
        <span>VITÓRIA SUPREMA!</span>
        <Sparkles size={16} />
      </div>

      {/* Hero Characters Reunited */}
      <div className="flex flex-col items-center gap-4 my-4">
        <div className="flex items-center justify-center gap-6 my-2">
          {/* Joyful Lolo */}
          <div className="relative w-16 h-16 rounded-full bg-blue-600 border-4 border-blue-400 shadow-xl flex items-center justify-center animate-bounce">
            <div className="flex gap-2">
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-2 bg-black rounded-full" />
              </div>
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-2 bg-black rounded-full" />
              </div>
            </div>
            {/* Raised celebration hands */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full" />
          </div>

          {/* Sparkling Big Heart */}
          <Heart size={36} className="text-red-500 fill-red-500 animate-pulse" />

          {/* Princess Lala */}
          <div className="relative w-16 h-16 rounded-full bg-pink-500 border-4 border-pink-300 shadow-xl flex items-center justify-center animate-bounce [animation-delay:0.2s]">
            <div className="absolute -top-3 w-5 h-4 bg-amber-400 border border-amber-300 rounded-t-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-2 bg-black rounded-full" />
              </div>
              <div className="w-3 h-4 bg-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-2 bg-black rounded-full" />
              </div>
            </div>
            {/* Raised celebration hands */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-pink-300 rounded-full" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-300 rounded-full" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow">
          A PRINCESA ESTÁ SALVA!
        </h1>

        <p className="text-[10px] text-amber-200/90 max-w-xs leading-relaxed">
          Com bravura e inteligência lendárias, Lolo superou os 10 andares e todas as 50 salas do Rei Egger, trazendo a paz de volta ao Reino de Eden!
        </p>

        {/* Final Statistics Box */}
        <div className="w-full max-w-xs p-4 bg-slate-900/90 border-2 border-amber-500/60 rounded-xl flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>SALAS RESOLVIDAS:</span>
            <span className="text-emerald-400 font-bold">50 / 50</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>PONTUAÇÃO FINAL:</span>
            <span className="text-amber-300 font-bold tabular-nums">
              {score.toString().padStart(6, '0')}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>CLASSIFICAÇÃO:</span>
            <span className="text-cyan-300 font-bold">MESTRE DO PUZZLE ★★★</span>
          </div>
        </div>
      </div>

      {/* Return to Title */}
      <button
        onClick={onGoHome}
        className="w-full max-w-xs py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-lg active:scale-95 transition-transform"
      >
        <Home size={16} />
        <span>MENU PRINCIPAL</span>
      </button>
    </div>
  );
};
