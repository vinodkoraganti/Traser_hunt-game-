import React, { useState } from 'react';
import { TreasureCodePuzzleData } from '../../game/types.ts';
import { validateCodeAnswer } from '../../game/rules.ts';
import { sound } from '../../game/audio.ts';
import { ChevronUp, ChevronDown, KeyRound, Check, AlertCircle, HelpCircle, Lock } from 'lucide-react';

interface TreasureCodeViewProps {
  puzzle: TreasureCodePuzzleData;
  onSolve: (usedHints: boolean) => void;
  isAlreadySolved: boolean;
  onUseHint: (hintId: string, penalty: number) => void;
  usedHintIds: string[];
}

export const TreasureCodeView: React.FC<TreasureCodeViewProps> = ({
  puzzle,
  onSolve,
  isAlreadySolved,
  onUseHint,
  usedHintIds,
}) => {
  const [digits, setDigits] = useState<number[]>(() => {
    if (isAlreadySolved) {
      return puzzle.correctCode.split('').map(c => parseInt(c, 10));
    }
    return Array(puzzle.codeLength).fill(0);
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    isAlreadySolved ? { type: 'success', message: 'Combination Accepted! The heavy tumblers have released.' } : null
  );

  const availableHint = puzzle.hints.find(h => !usedHintIds.includes(h.id));
  const activeHints = puzzle.hints.filter(h => usedHintIds.includes(h.id));
  const usedAnyHint = activeHints.length > 0;

  const handleAdjustDigit = (index: number, delta: number) => {
    if (isAlreadySolved) return;
    sound.playClick();
    setDigits(prev => {
      const next = [...prev];
      const [min, max] = puzzle.digitsRange;
      let val = next[index] + delta;
      if (val > max) val = min;
      if (val < min) val = max;
      next[index] = val;
      return next;
    });
    setFeedback(null);
  };

  const handleTryCombination = () => {
    if (isAlreadySolved) return;
    const userCode = digits.join('');
    const isCorrect = validateCodeAnswer(userCode, puzzle.correctCode);

    if (isCorrect) {
      sound.playUnlock();
      setFeedback({
        type: 'success',
        message: `*CLACK-CLICK!* Tumblers aligned! Combination [${userCode}] unlocks the seal! (+${puzzle.points} pts)`,
      });
      onSolve(usedAnyHint);
    } else {
      sound.playError();
      setFeedback({
        type: 'error',
        message: `The iron tumblers resist! [${userCode}] is not the true combination. Check the clues!`,
      });
    }
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 text-stone-100">
      {/* Title */}
      <div className="border-b border-amber-700/30 pb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
          Combination Mechanism
        </span>
        <h3 className="text-xl font-bold font-serif text-amber-200 mt-0.5">{puzzle.title}</h3>
        <p className="text-xs text-stone-400 italic mt-0.5">{puzzle.loreText}</p>
      </div>

      {/* Clues Inscription */}
      <div className="bg-[#211a13] border border-amber-800/60 rounded-xl p-4 shadow-inner">
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold font-serif text-amber-300 uppercase tracking-wider">
            Inscribed Cipher Clues:
          </span>
        </div>
        <ul className="space-y-1.5 text-xs sm:text-sm text-amber-100 font-serif">
          {puzzle.riddleClues.map((clue, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>{clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3D-styled Brass Tumbler Wheels */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 py-4">
        {digits.map((digit, index) => (
          <div key={index} className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => handleAdjustDigit(index, 1)}
              disabled={isAlreadySolved}
              aria-label={`Increment dial ${index + 1}`}
              className="bg-amber-950/80 hover:bg-amber-800 text-amber-300 p-1.5 rounded-lg border border-amber-600/40 active:scale-95 transition-transform disabled:opacity-40"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {/* Dial Barrel */}
            <div className="w-16 sm:w-20 h-20 sm:h-24 bg-gradient-to-b from-stone-950 via-stone-850 to-stone-950 border-2 border-amber-500/70 rounded-2xl flex items-center justify-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_4px_8px_rgba(0,0,0,0.6)] relative overflow-hidden">
              {/* Barrel highlight reflection line */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-amber-400/10 pointer-events-none border-y border-amber-500/20" />
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-200 tabular-nums">
                {digit}
              </span>
            </div>

            <button
              onClick={() => handleAdjustDigit(index, -1)}
              disabled={isAlreadySolved}
              aria-label={`Decrement dial ${index + 1}`}
              className="bg-amber-950/80 hover:bg-amber-800 text-amber-300 p-1.5 rounded-lg border border-amber-600/40 active:scale-95 transition-transform disabled:opacity-40"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`flex items-start gap-2 p-3 rounded-xl text-xs sm:text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Active Hints */}
      {activeHints.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
          <span className="font-bold text-amber-400">Revealed Hint: </span>
          {activeHints.map(h => h.text).join(' ')}
        </div>
      )}

      {/* Action Button */}
      {!isAlreadySolved ? (
        <button
          onClick={handleTryCombination}
          aria-label="Test Combination"
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold py-3 px-6 rounded-xl text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>Release Latch & Test Combination</span>
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs sm:text-sm font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Vault Lock Unlocked!</span>
        </div>
      )}

      {/* Hint Option */}
      {!isAlreadySolved && availableHint && (
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onUseHint(availableHint.id, availableHint.penalty)}
            aria-label="Request Cipher Hint"
            className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consult Captain's Log Hint (-{availableHint.penalty} pts)</span>
          </button>
          <span className="text-stone-500 text-[11px]">Use arrows to rotate tumblers</span>
        </div>
      )}
    </div>
  );
};
