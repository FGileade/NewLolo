/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Story & Player Manual Modal
 */

import React from 'react';
import { X, Sparkles, Wand2, Shield, Heart } from 'lucide-react';

interface StoryModalProps {
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn font-pixel">
      <div className="relative w-full max-w-lg bg-slate-900 border-4 border-amber-500/70 rounded-2xl p-6 text-slate-100 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={16} />
            <span className="text-amber-300 text-xs font-bold">MANUAL GBA: O RESGATE DA PRINCESA LALA</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Story Intro */}
        <div className="p-3 bg-indigo-950/60 border border-indigo-700/60 rounded-xl flex flex-col gap-2 text-[10px] text-slate-300 leading-relaxed">
          <span className="font-bold text-amber-300">⚔️ A LORDE DO REINO DE EDEN</span>
          <p>
            O maléfico Rei Egger aprisionou a Princesa Lala no topo de sua Torre Sombria. Para alcançá-la, Lolo deve atravessar 5 grandiosos Mundos: O Castelo Esmeralda, Os Jardins Encantados, As Cavernas de Cristal, O Templo Solar Antigo e a Torre do Rei Egger, solucionando 50 quebra-cabeças repletos de perigos e inimigos astutos!
          </p>
        </div>

        {/* Gameplay Mechanics */}
        <div className="flex flex-col gap-2 text-[10px]">
          <span className="font-bold text-emerald-400">📜 MECÂNICAS FUNDAMENTAIS:</span>

          <div className="grid grid-cols-1 gap-2 text-slate-300">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
              <span className="text-amber-300 font-bold">1. Corações & Joia do Baú</span>
              <p className="text-[9px] text-slate-400">
                Colete todos os corações da sala para destravar o Baú do Tesouro. Ao pegar a Joia dos Céus, todos os monstros entram em transe e a passagem do castelo é aberta!
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
              <span className="text-cyan-300 font-bold">2. Magia e Balsas Flutuantes</span>
              <p className="text-[9px] text-slate-400">
                Dispare com o botão <span className="text-white font-bold">A / Z</span> para transformar inimigos em ovos temporários. Empurre o ovo em rios para formar uma balsa! Um segundo tiro expulsa o ovo da tela temporariamente.
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1">
              <span className="text-emerald-300 font-bold">3. Pedestais de Esmeralda</span>
              <p className="text-[9px] text-slate-400">
                Empurre os blocos de esmeralda para bloquear os raios fulminantes das Medusas e proteger suas rotas de fuga.
              </p>
            </div>
          </div>
        </div>

        {/* Enemy Bestiary */}
        <div className="flex flex-col gap-2 text-[10px]">
          <span className="font-bold text-red-400">👾 BESTIÁRIO DOS 5 MUNDOS:</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] text-slate-300">
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-green-400 font-bold">🐍 SNAKEY:</span> Dócil e imóvel; perfeito para ser transformado em balsa aquática.
            </div>

            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-purple-400 font-bold">👁️ MEDUSA:</span> Dispara feixe de energia fulminante se avistar Lolo desprotegido.
            </div>

            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-amber-400 font-bold">🐉 GOLG:</span> Dragão adormecido que acorda com fúria ao coletar o último coração!
            </div>

            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-200 font-bold">💀 SKULL:</span> Crânio que acorda com chamas espectrais e persegue Lolo no labirinto.
            </div>

            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-red-400 font-bold">🦔 ALMA:</span> Tatu de carapaça vermelha que rola em velocidade sônica ao alinhar.
            </div>

            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-yellow-400 font-bold">🟣 DON MEDUSA:</span> Patrulha corredores com lâminas e raios perpendiculares.
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 mt-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 rounded-xl text-xs font-bold text-white transition-colors"
        >
          INICIAR AVENTURA GBA
        </button>
      </div>
    </div>
  );
};
