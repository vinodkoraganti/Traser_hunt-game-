import React, { useState } from 'react';
import { NumberPuzzleData } from '../../game/types.ts';
import { validateNumberAnswer } from '../../game/rules.ts';
import { sound } from '../../game/audio.ts';
import { Check, AlertCircle, HelpCircle, Sun, Plus, Equal, Sparkles } from 'lucide-react';

interface NumberPuzzleViewProps {
  puzzle: NumberPuzzleData;
  onSolve: (usedHints: boolean) => void;
  isAlreadySolved: boolean;
  onUseHint: (hintId: string, penalty: number) => void;
  usedHintIds: string[];
}

export const NumberPuzzleView: React.FC<NumberPuzzleViewProps> = ({
  puzzle,
  onSolve,
  isAlreadySolved,
  onUseHint,
  usedHintIds,
}) => {
  const [currentVal, setCurrentVal] = useState<number>(isAlreadySolved ? puzzle.targetNumber : 5);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    isAlreadySolved
      ? { type: 'success', message: 'Sacred Solar Balance Achieved! (14 + 18 + 10 = 42)' }
      : null
  );

  const availableHint = puzzle.hints.find(h => !usedHintIds.includes(h.id));
  const activeHints = puzzle.hints.filter(h => usedHintIds.includes(h.id));
  const usedAnyHint = activeHints.length > 0;

  const currentTotal = 14 + 18 + currentVal;

  const handleAdjust = (delta: number) => {
    if (isAlreadySolved) return;
    sound.playClick();
    setCurrentVal(prev => Math.min(25, Math.max(0, prev + delta)));
    setFeedback(null);
  };

  const handleVerify = () => {
    if (isAlreadySolved) return;

    const isCorrect = validateNumberAnswer(currentVal, puzzle.targetNumber);
    if (isCorrect) {
      sound.playSolve();
      setFeedback({
        type: 'success',
        message: `Solar Harmony Awakened! 14 + 18 + ${currentVal} = 42! The sun crystal focuses its beam. (+${puzzle.points} pts)`,
      });
      onSolve(usedAnyHint);
    } else {
      sound.playError();
      setFeedback({
        type: 'error',
        message: `Sum equals ${currentTotal}, but the sacred target is 42. Rotate the dial!`,
      });
    }
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 text-stone-100">
      {/* Title */}
      <div className="border-b border-amber-700/30 pb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
          Mathematical Challenge
        </span>
        <h3 className="text-xl font-bold font-serif text-amber-200 mt-0.5">{puzzle.title}</h3>
        <p className="text-xs text-stone-400 italic mt-0.5">{puzzle.loreText}</p>
      </div>

      {/* Sundial Equation Matrix Visual */}
      <div className="bg-[#1f1a14] border-2 border-amber-700/50 rounded-xl p-5 shadow-inner flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
          <Sun className="w-4 h-4 text-amber-400 animate-spin" />
          <span>The Three Solar Crystal Rings:</span>
        </div>

        {/* Live Equation Display */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-lg sm:text-2xl font-mono font-bold">
          {/* Dial 1 */}
          <div className="bg-stone-950 border border-amber-700/50 rounded-xl px-3 py-2 text-amber-300 shadow">
            14
          </div>
          <Plus className="w-4 h-4 text-amber-500" />
          {/* Dial 2 */}
          <div className="bg-stone-950 border border-amber-700/50 rounded-xl px-3 py-2 text-amber-300 shadow">
            18
          </div>
          <Plus className="w-4 h-4 text-amber-500" />
          {/* Dial 3 (Active) */}
          <div className="bg-amber-950/80 border-2 border-amber-400 rounded-xl px-4 py-2 text-yellow-200 ring-2 ring-amber-400/30 shadow-[0_0_12px_rgba(250,204,21,0.4)]">
            {currentVal}
          </div>
          <Equal className="w-4 h-4 text-amber-500" />
          {/* Target */}
          <div
            className={`rounded-xl px-3 py-2 border shadow transition-colors ${
              currentTotal === 42
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                : 'bg-stone-950 border-stone-700 text-stone-400'
            }`}
          >
            {currentTotal}{' '}
            <span className="text-xs font-normal text-amber-400/80">(Target: 42)</span>
          </div>
        </div>

        {/* Interactive Dial Controls */}
        {!isAlreadySolved && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => handleAdjust(-5)}
              aria-label="Subtract 5"
              className="bg-stone-950 hover:bg-stone-850 border border-amber-700/50 text-amber-300 px-3 py-1.5 rounded-lg font-mono text-xs font-bold"
            >
              -5
            </button>
            <button
              onClick={() => handleAdjust(-1)}
              aria-label="Subtract 1"
              className="bg-stone-950 hover:bg-stone-850 border border-amber-700/50 text-amber-300 px-3 py-1.5 rounded-lg font-mono text-xs font-bold"
            >
              -1
            </button>

            <span className="font-mono text-xl font-extrabold text-amber-300 w-12 text-center">
              {currentVal}
            </span>

            <button
              onClick={() => handleAdjust(1)}
              aria-label="Add 1"
              className="bg-stone-950 hover:bg-stone-850 border border-amber-700/50 text-amber-300 px-3 py-1.5 rounded-lg font-mono text-xs font-bold"
            >
              +1
            </button>
            <button
              onClick={() => handleAdjust(5)}
              aria-label="Add 5"
              className="bg-stone-950 hover:bg-stone-850 border border-amber-700/50 text-amber-300 px-3 py-1.5 rounded-lg font-mono text-xs font-bold"
            >
              +5
            </button>
          </div>
        )}
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

      {/* Action Button */}
      {!isAlreadySolved ? (
        <button
          onClick={handleVerify}
          aria-label="Align Solar Rings"
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold py-3 px-6 rounded-xl text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Align Solar Crystal Ring</span>
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs sm:text-sm font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Solar Equation Balanced!</span>
        </div>
      )}

      {/* Hints */}
      {!isAlreadySolved && availableHint && (
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onUseHint(availableHint.id, availableHint.penalty)}
            aria-label="Request Math Hint"
            className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consult solar sundial calculation clue (-{availableHint.penalty} pts)</span>
          </button>
        </div>
      )}
    </div>
  );
};
