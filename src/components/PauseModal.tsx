/**
 * NEW LOLO - Pause Modal
 */

import React from 'react';
import { Play, RotateCcw, Compass, Home, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/sound';

interface PauseModalProps {
  onResume: () => void;
  onResetRoom: () => void;
  onOpenLevelSelect: () => void;
  onGoHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onResetRoom,
  onOpenLevelSelect,
  onGoHome
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getIsMuted());

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-pixel">
      <div className="relative w-full max-w-xs bg-slate-900 border-4 border-amber-900/90 rounded-2xl p-6 text-slate-100 shadow-2xl flex flex-col items-center gap-4 text-center">
        <h2 className="text-xl font-bold text-amber-400">JOGO PAUSADO</h2>

        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            onClick={onResume}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow transition-transform active:scale-95"
          >
            <Play size={16} fill="white" />
            <span>CONTINUAR</span>
          </button>

          <button
            onClick={() => {
              onResetRoom();
              onResume();
            }}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs text-red-300 transition-colors"
          >
            <RotateCcw size={14} />
            <span>REINICIAR SALA</span>
          </button>

          <button
            onClick={() => {
              onResume();
              onOpenLevelSelect();
            }}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs text-amber-300 transition-colors"
          >
            <Compass size={14} />
            <span>SELEÇÃO DE SALAS</span>
          </button>

          <button
            onClick={toggleSound}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-300 transition-colors"
          >
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
            <span>SOM: {isMuted ? 'DESLIGADO' : 'LIGADO'}</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400 transition-colors"
          >
            <Home size={14} />
            <span>TELA INICIAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
