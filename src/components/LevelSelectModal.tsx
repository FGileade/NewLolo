/**
 * ADVENTURES OF LOLO - GBA EDITION
 * World & Room Select Modal (5 Worlds x 10 Rooms = 50 Rooms)
 */

import React, { useState } from 'react';
import { X, Lock, Play, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { LEVELS } from '../game/levels';

interface LevelSelectModalProps {
  unlockedLevel: number;
  onSelectLevel: (levelIndex: number) => void;
  onClose: () => void;
}

const WORLDS_INFO = [
  { id: 1, name: 'O Castelo Esmeralda', desc: 'Fortaleza real e jardins de entrada' },
  { id: 2, name: 'Os Jardins Encantados', desc: 'Bosques mágicos, folhagens e rios' },
  { id: 3, name: 'As Cavernas de Cristal', desc: 'Grutas com gemas bioluminescentes' },
  { id: 4, name: 'O Templo Solar Antigo', desc: 'Relíquias de areia e canais de magma' },
  { id: 5, name: 'A Torre Sombria do Rei Egger', desc: 'O santuário do vilão e resgate final' }
];

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevel,
  onSelectLevel,
  onClose
}) => {
  const [selectedWorld, setSelectedWorld] = useState<number>(() => {
    return Math.floor((unlockedLevel - 1) / 10) + 1;
  });

  const roomsInWorld = LEVELS.filter(lvl => lvl.world === selectedWorld);
  const currentWorldInfo = WORLDS_INFO[selectedWorld - 1] || WORLDS_INFO[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn font-pixel">
      <div className="relative w-full max-w-lg bg-slate-900 border-4 border-amber-500/70 rounded-2xl p-5 text-slate-100 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-amber-300 text-xs font-bold">SELEÇÃO DE MUNDOS</span>
            <span className="text-[10px] text-slate-400">({unlockedLevel}/50 ABERTAS)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* World Carousel (1 to 5) */}
        <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <button
            disabled={selectedWorld <= 1}
            onClick={() => setSelectedWorld(prev => Math.max(1, prev - 1))}
            className="p-2 disabled:opacity-30 hover:bg-slate-800 rounded text-amber-400 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold text-amber-300">
              MUNDO {selectedWorld}: {currentWorldInfo.name}
            </span>
            <span className="text-[9px] text-slate-400 mt-0.5">
              {currentWorldInfo.desc}
            </span>
          </div>

          <button
            disabled={selectedWorld >= 5}
            onClick={() => setSelectedWorld(prev => Math.min(5, prev + 1))}
            className="p-2 disabled:opacity-30 hover:bg-slate-800 rounded text-amber-400 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* 10 Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-1">
          {roomsInWorld.map((room) => {
            const isUnlocked = room.id <= unlockedLevel;

            return (
              <button
                key={room.id}
                disabled={!isUnlocked}
                onClick={() => onSelectLevel(room.id - 1)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-900 border-amber-500/40 hover:border-amber-400 hover:scale-[1.01]'
                    : 'bg-slate-950/60 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {room.world}-{room.roomNumber}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-100 truncate max-w-[120px]">
                      {room.name}
                    </span>
                    <span className="text-[8px] text-slate-400 truncate max-w-[120px]">
                      Sala {room.id}
                    </span>
                  </div>
                </div>

                {isUnlocked ? (
                  <Play size={12} className="text-emerald-400" fill="currentColor" />
                ) : (
                  <Lock size={12} className="text-slate-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 transition-colors"
        >
          VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
};
