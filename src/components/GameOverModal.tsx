/**
 * NEW LOLO - Game Over Modal
 */

import React from 'react';
import { RotateCcw, Home } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  onContinue: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  onContinue,
  onGoHome
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn font-pixel">
      <div className="relative w-full max-w-xs bg-slate-900 border-4 border-red-900/90 rounded-2xl p-6 text-slate-100 shadow-2xl flex flex-col items-center gap-4 text-center">
        {/* Sad Lolo */}
        <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center shadow-inner">
          <div className="flex gap-2">
            <span className="text-white text-xs font-bold">×</span>
            <span className="text-white text-xs font-bold">×</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-red-500 tracking-wider">GAME OVER</h2>
        <p className="text-[10px] text-slate-400">Suas vidas se esgotaram no castelo!</p>

        <div className="text-xs text-amber-300 tabular-nums">
          PONTOS: {score.toString().padStart(6, '0')}
        </div>

        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            onClick={onContinue}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-lg active:scale-95 transition-transform"
          >
            <RotateCcw size={16} />
            <span>CONTINUAR (5 VIDAS)</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400 transition-colors"
          >
            <Home size={14} />
            <span>TELA INICIAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
