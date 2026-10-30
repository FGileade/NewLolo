/**
 * ADVENTURES OF LOLO - GBA EDITION
 * Virtual Game Boy Advance Handheld Controls
 * Styled after the classic Indigo GBA with responsive, non-occluding layout
 * Features debounced touch/click handling to guarantee single-tile stepping without skipping
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { Direction } from '../game/types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Wand2, RotateCcw, Undo2 } from 'lucide-react';

interface MobileControlsProps {
  onMove: (dir: Direction) => void;
  onShoot: () => void;
  onReset: () => void;
  onUndo: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onShoot,
  onReset,
  onUndo
}) => {
  // Track last touch timestamp to ignore simulated mouse click events
  const lastTouchTimeRef = useRef<number>(0);
  const activeRepeatTimerRef = useRef<number | null>(null);
  const activeIntervalTimerRef = useRef<number | null>(null);

  // Clear any holding timers
  const stopRepeat = useCallback(() => {
    if (activeRepeatTimerRef.current !== null) {
      clearTimeout(activeRepeatTimerRef.current);
      activeRepeatTimerRef.current = null;
    }
    if (activeIntervalTimerRef.current !== null) {
      clearInterval(activeIntervalTimerRef.current);
      activeIntervalTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopRepeat();
  }, [stopRepeat]);

  // Handle directional press (supports both single tap and hold-to-step)
  const handleDirectionPress = useCallback((dir: Direction, isTouch: boolean) => {
    stopRepeat();
    if (isTouch) {
      lastTouchTimeRef.current = Date.now();
    } else {
      // If a touch occurred recently (< 450ms), ignore simulated mouse click!
      if (Date.now() - lastTouchTimeRef.current < 450) {
        return;
      }
    }

    // Step 1 tile immediately
    onMove(dir);

    // If held down, auto-repeat with steady cadence after initial delay
    activeRepeatTimerRef.current = window.setTimeout(() => {
      activeIntervalTimerRef.current = window.setInterval(() => {
        onMove(dir);
      }, 160);
    }, 280);
  }, [onMove, stopRepeat]);

  // Handle Action button press (A, B, Undo, Reset)
  const handleActionPress = useCallback((action: () => void, isTouch: boolean) => {
    if (isTouch) {
      lastTouchTimeRef.current = Date.now();
    } else {
      if (Date.now() - lastTouchTimeRef.current < 450) {
        return;
      }
    }
    action();
  }, []);

  return (
    <div className="w-full max-w-[468px] mt-2 select-none touch-none pb-2 font-pixel">
      {/* Handheld GBA Shell Frame */}
      <div className="flex items-center justify-between gap-3 px-3 py-3 bg-gradient-to-b from-indigo-950/90 via-slate-900/95 to-indigo-950/90 border-2 border-indigo-700/60 rounded-3xl shadow-2xl backdrop-blur-sm">
        {/* GBA Matte Black D-Pad */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          {/* Circular thumb well */}
          <div className="absolute w-28 h-28 rounded-full bg-slate-950/80 border border-indigo-900/50 shadow-inner" />

          {/* D-Pad Center Pivot */}
          <div className="absolute w-11 h-11 bg-slate-900 border border-slate-700/80 rounded-sm" />

          {/* UP Button */}
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('UP', true); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseDown={(e) => { e.preventDefault(); handleDirectionPress('UP', false); }}
            onMouseUp={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseLeave={() => stopRepeat()}
            aria-label="Cima"
            className="absolute top-1 w-11 h-12 bg-gradient-to-b from-slate-700 to-slate-800 active:from-amber-600 active:to-amber-700 border-2 border-slate-600 active:border-amber-400 rounded-t-md flex items-center justify-center text-slate-200 shadow-md transition-all active:scale-95"
          >
            <ChevronUp size={22} />
          </button>

          {/* DOWN Button */}
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('DOWN', true); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseDown={(e) => { e.preventDefault(); handleDirectionPress('DOWN', false); }}
            onMouseUp={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseLeave={() => stopRepeat()}
            aria-label="Baixo"
            className="absolute bottom-1 w-11 h-12 bg-gradient-to-t from-slate-700 to-slate-800 active:from-amber-600 active:to-amber-700 border-2 border-slate-600 active:border-amber-400 rounded-b-md flex items-center justify-center text-slate-200 shadow-md transition-all active:scale-95"
          >
            <ChevronDown size={22} />
          </button>

          {/* LEFT Button */}
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('LEFT', true); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseDown={(e) => { e.preventDefault(); handleDirectionPress('LEFT', false); }}
            onMouseUp={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseLeave={() => stopRepeat()}
            aria-label="Esquerda"
            className="absolute left-1 w-12 h-11 bg-gradient-to-r from-slate-700 to-slate-800 active:from-amber-600 active:to-amber-700 border-2 border-slate-600 active:border-amber-400 rounded-l-md flex items-center justify-center text-slate-200 shadow-md transition-all active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>

          {/* RIGHT Button */}
          <button
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('RIGHT', true); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseDown={(e) => { e.preventDefault(); handleDirectionPress('RIGHT', false); }}
            onMouseUp={(e) => { e.preventDefault(); stopRepeat(); }}
            onMouseLeave={() => stopRepeat()}
            aria-label="Direita"
            className="absolute right-1 w-12 h-11 bg-gradient-to-l from-slate-700 to-slate-800 active:from-amber-600 active:to-amber-700 border-2 border-slate-600 active:border-amber-400 rounded-r-md flex items-center justify-center text-slate-200 shadow-md transition-all active:scale-95"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Center Select & Start pill buttons */}
        <div className="flex flex-col items-center gap-2">
          <button
            onTouchStart={(e) => { e.preventDefault(); handleActionPress(onUndo, true); }}
            onClick={(e) => { e.preventDefault(); handleActionPress(onUndo, false); }}
            title="Desfazer (U)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 rounded-full text-amber-300 shadow active:scale-95 transition-transform"
          >
            <Undo2 size={12} />
            <span className="text-[8px]">DESFAZER</span>
          </button>

          <button
            onTouchStart={(e) => { e.preventDefault(); handleActionPress(onReset, true); }}
            onClick={(e) => { e.preventDefault(); handleActionPress(onReset, false); }}
            title="Reiniciar (X/R)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 rounded-full text-red-400 shadow active:scale-95 transition-transform"
          >
            <RotateCcw size={12} />
            <span className="text-[8px]">RESET</span>
          </button>
        </div>

        {/* GBA Action Buttons: B & A angled layout */}
        <div className="flex items-center gap-3 pr-2 -rotate-12">
          {/* B Button */}
          <div className="flex flex-col items-center gap-1 mt-4">
            <button
              onTouchStart={(e) => { e.preventDefault(); handleActionPress(onReset, true); }}
              onClick={(e) => { e.preventDefault(); handleActionPress(onReset, false); }}
              aria-label="Botão B"
              className="w-13 h-13 rounded-full bg-gradient-to-b from-red-500 to-red-700 active:from-red-600 active:to-red-800 border-2 border-red-300 shadow-lg flex items-center justify-center text-white font-bold text-xs active:scale-95 transition-transform"
            >
              B
            </button>
            <span className="text-[8px] text-slate-400 rotate-12">RESET</span>
          </div>

          {/* A Button (Magic) */}
          <div className="flex flex-col items-center gap-1 mb-4">
            <button
              onTouchStart={(e) => { e.preventDefault(); handleActionPress(onShoot, true); }}
              onClick={(e) => { e.preventDefault(); handleActionPress(onShoot, false); }}
              aria-label="Botão A (Magia)"
              className="w-14 h-14 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 active:from-cyan-500 active:to-blue-700 border-2 border-cyan-200 shadow-lg shadow-cyan-900/50 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <Wand2 size={20} />
            </button>
            <span className="text-[8px] text-cyan-300 font-bold rotate-12">MAGIA (A)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
