import React, { useState } from 'react';
import { SequencePuzzleData } from '../../game/types.ts';
import { validateSequenceAnswer } from '../../game/rules.ts';
import { sound } from '../../game/audio.ts';
import { Check, AlertCircle, HelpCircle, Compass, Sparkles } from 'lucide-react';

interface SequencePuzzleViewProps {
  puzzle: SequencePuzzleData;
  onSolve: (usedHints: boolean) => void;
  isAlreadySolved: boolean;
  onUseHint: (hintId: string, penalty: number) => void;
  usedHintIds: string[];
}

export const SequencePuzzleView: React.FC<SequencePuzzleViewProps> = ({
  puzzle,
  onSolve,
  isAlreadySolved,
  onUseHint,
  usedHintIds,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | number | null>(
    isAlreadySolved ? puzzle.correctAnswer : null
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    isAlreadySolved
      ? { type: 'success', message: `Alignment Verified! ${puzzle.explanation}` }
      : null
  );

  const availableHint = puzzle.hints.find(h => !usedHintIds.includes(h.id));
  const activeHints = puzzle.hints.filter(h => usedHintIds.includes(h.id));
  const usedAnyHint = activeHints.length > 0;

  const handleSelectOption = (opt: string | number) => {
    if (isAlreadySolved) return;
    sound.playClick();
    setSelectedOption(opt);
    setFeedback(null);
  };

  const handleVerify = () => {
    if (selectedOption === null || isAlreadySolved) return;

    const isCorrect = validateSequenceAnswer(selectedOption, puzzle.correctAnswer);
    if (isCorrect) {
      sound.playSolve();
      setFeedback({
        type: 'success',
        message: `Constellations Aligned! Value ${selectedOption} is correct. ${puzzle.explanation} (+${puzzle.points} pts)`,
      });
      onSolve(usedAnyHint);
    } else {
      sound.playError();
      setFeedback({
        type: 'error',
        message: `The armillary ring locks in discord with ${selectedOption}. Analyze the step ratios!`,
      });
    }
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 text-stone-100">
      {/* Title */}
      <div className="border-b border-amber-700/30 pb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
          Astronomical Sequence
        </span>
        <h3 className="text-xl font-bold font-serif text-amber-200 mt-0.5">{puzzle.title}</h3>
        <p className="text-xs text-stone-400 italic mt-0.5">{puzzle.loreText}</p>
      </div>

      {/* Visual Star Chart Sequence Display */}
      <div className="bg-[#1f1912] border-2 border-amber-700/50 rounded-xl p-5 shadow-inner flex flex-col items-center gap-3">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400/80">
          Ascending Celestial Spheres:
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 my-2">
          {puzzle.sequence.map((item, index) => {
            const isMissing = index === puzzle.missingIndex;
            return (
              <React.Fragment key={index}>
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-mono text-base sm:text-xl font-bold shadow-lg transition-transform ${
                    isMissing
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-4 ring-amber-400/20 animate-pulse'
                      : 'bg-stone-950/90 border-amber-600/60 text-amber-100'
                  }`}
                >
                  {isMissing ? (selectedOption !== null ? selectedOption : '?') : item}
                </div>
                {index < puzzle.sequence.length - 1 && (
                  <span className="text-amber-500/60 font-bold text-lg sm:text-2xl">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Options Grid */}
      {!isAlreadySolved && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-stone-300">
            Select the next coordinate in the solar sequence:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {puzzle.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                aria-label={`Option ${opt}`}
                className={`py-3 px-4 rounded-xl border font-mono text-base sm:text-lg font-bold transition-all ${
                  selectedOption === opt
                    ? 'bg-amber-500 text-stone-950 border-yellow-200 ring-2 ring-amber-300 scale-105 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                    : 'bg-stone-950/80 hover:bg-stone-850 border-amber-700/50 text-amber-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

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
          disabled={selectedOption === null}
          aria-label="Confirm Celestial Alignment"
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold py-3 px-6 rounded-xl text-sm shadow transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lock Celestial Sphere</span>
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs sm:text-sm font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Celestial Sequence Complete!</span>
        </div>
      )}

      {/* Hints */}
      {!isAlreadySolved && availableHint && (
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onUseHint(availableHint.id, availableHint.penalty)}
            aria-label="Request Sequence Clue"
            className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Examine constellation delta (-{availableHint.penalty} pts)</span>
          </button>
          <span className="text-stone-500 text-[11px]">Notice the pattern between successive terms</span>
        </div>
      )}
    </div>
  );
};
