import React, { useState } from 'react';
import { LevelTrap } from '../game/types.ts';
import { sound } from '../game/audio.ts';
import { ShieldAlert, Check, AlertTriangle, ArrowRight } from 'lucide-react';

interface TrapModalProps {
  trap: LevelTrap;
  onResolve: (isSafe: boolean) => void;
}

export const TrapModal: React.FC<TrapModalProps> = ({ trap, onResolve }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [result, setResult] = useState<{ isSafe: boolean; feedback: string } | null>(null);

  const handleChoose = (idx: number) => {
    if (result) return;
    const option = trap.challenge.options[idx];
    setSelectedIdx(idx);

    if (option.isSafe) {
      sound.playSolve();
      setResult({ isSafe: true, feedback: option.feedback });
    } else {
      sound.playTrap();
      setResult({ isSafe: false, feedback: option.feedback });
    }
  };

  const handleContinue = () => {
    if (result) {
      onResolve(result.isSafe);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-rose-600/70 rounded-3xl p-6 shadow-[0_0_50px_rgba(225,29,72,0.4)] flex flex-col gap-4 text-stone-100">
        {/* Trap Warning Header */}
        <div className="flex items-center gap-3 border-b border-rose-900/60 pb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">
              Hazard Warning: Trap Triggered!
            </span>
            <h3 className="text-xl font-bold font-serif text-amber-200">{trap.name}</h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 italic">{trap.description}</p>

        {/* Challenge Box */}
        <div className="bg-[#211616] border border-rose-800/50 rounded-xl p-4 shadow-inner">
          <p className="font-serif text-sm text-amber-100 leading-relaxed">
            {trap.challenge.question}
          </p>
        </div>

        {/* Options */}
        {!result ? (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-stone-300">Choose your action carefully:</span>
            {trap.challenge.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleChoose(i)}
                aria-label={opt.text}
                className="w-full text-left p-3 rounded-xl border bg-stone-950/90 hover:bg-stone-850 hover:border-amber-500 border-stone-700 text-xs sm:text-sm font-medium transition-all active:scale-[0.98] flex items-center justify-between"
              >
                <span>{opt.text}</span>
                <span className="text-amber-400 opacity-60">→</span>
              </button>
            ))}
          </div>
        ) : (
          <div
            className={`p-4 rounded-xl border flex flex-col gap-2 ${
              result.isSafe
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/80 border-rose-500 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {result.isSafe ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Trap Safely Disarmed! (+100 Bonus Pts)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>Trap Tripped! You narrowly scrambled through!</span>
                </>
              )}
            </div>
            <p className="text-xs text-stone-300">{result.feedback}</p>
          </div>
        )}

        {result && (
          <button
            onClick={handleContinue}
            aria-label="Proceed forward"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-stone-950 font-bold py-3 px-6 rounded-xl text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>Proceed Into The Grotto</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
