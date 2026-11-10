import React, { useState } from 'react';
import { RiddlePuzzleData } from '../../game/types.ts';
import { validateRiddleAnswer } from '../../game/rules.ts';
import { sound } from '../../game/audio.ts';
import { HelpCircle, Check, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface RiddlePuzzleViewProps {
  puzzle: RiddlePuzzleData;
  onSolve: (usedHints: boolean) => void;
  isAlreadySolved: boolean;
  onUseHint: (hintId: string, penalty: number) => void;
  usedHintIds: string[];
}

export const RiddlePuzzleView: React.FC<RiddlePuzzleViewProps> = ({
  puzzle,
  onSolve,
  isAlreadySolved,
  onUseHint,
  usedHintIds,
}) => {
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    isAlreadySolved ? { type: 'success', message: 'You have solved this ancient riddle!' } : null
  );
  const [showHintConfirm, setShowHintConfirm] = useState(false);

  const availableHint = puzzle.hints.find(h => !usedHintIds.includes(h.id));
  const activeHints = puzzle.hints.filter(h => usedHintIds.includes(h.id));
  const usedAnyHint = activeHints.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isAlreadySolved) return;

    const isCorrect = validateRiddleAnswer(answerInput, puzzle.acceptedAnswers);
    if (isCorrect) {
      sound.playSolve();
      setFeedback({
        type: 'success',
        message: `Brilliant! "${answerInput.trim()}" is correct! (${puzzle.points} pts ${usedAnyHint ? '' : '+ 50 bonus pts'})`,
      });
      onSolve(usedAnyHint);
    } else {
      sound.playError();
      setFeedback({
        type: 'error',
        message: 'The stone mechanism remains motionless. That is not the true answer. Try again!',
      });
    }
  };

  const handleRequestHint = () => {
    if (!availableHint) return;
    onUseHint(availableHint.id, availableHint.penalty);
    setShowHintConfirm(false);
    sound.playClick();
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 text-stone-100">
      {/* Lore & Instruction */}
      <div className="border-b border-amber-700/30 pb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
          Ancient Inscription Challenge
        </span>
        <h3 className="text-xl font-bold font-serif text-amber-200 mt-0.5">{puzzle.title}</h3>
        <p className="text-xs text-stone-400 italic mt-1">{puzzle.loreText}</p>
      </div>

      {/* Parchment Riddle Stone */}
      <div className="bg-[#241e17] border-2 border-amber-800/60 rounded-xl p-5 shadow-inner relative overflow-hidden">
        <div className="absolute top-2 right-2 text-3xl opacity-20 select-none">📜</div>
        <p className="font-serif text-base sm:text-lg text-amber-100 text-center leading-relaxed italic">
          "{puzzle.riddle}"
        </p>
      </div>

      {/* Active Hints Display */}
      {activeHints.length > 0 && (
        <div className="flex flex-col gap-1.5 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Decoded Clue:</span>
          </div>
          {activeHints.map(h => (
            <p key={h.id} className="text-xs text-amber-200/90 pl-5">
              • {h.text}
            </p>
          ))}
        </div>
      )}

      {/* Input Form */}
      {!isAlreadySolved ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={answerInput}
            onChange={e => setAnswerInput(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-1 bg-stone-950 border border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            autoFocus
          />
          <button
            type="submit"
            aria-label="Submit Answer"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Speak Answer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs sm:text-sm font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Puzzle Complete! The path forward is unlocked.</span>
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

      {/* Hint Controls */}
      {!isAlreadySolved && availableHint && (
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
          {!showHintConfirm ? (
            <button
              type="button"
              onClick={() => setShowHintConfirm(true)}
              aria-label="Request Hint"
              className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 hover:underline"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need a hint? (-{availableHint.penalty} pts)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-lg border border-amber-600/30">
              <span className="text-amber-300">Reveal clue for -{availableHint.penalty} pts?</span>
              <button
                type="button"
                onClick={handleRequestHint}
                aria-label="Confirm Hint"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-2 py-1 rounded text-[11px]"
              >
                Yes, Reveal
              </button>
              <button
                type="button"
                onClick={() => setShowHintConfirm(false)}
                aria-label="Cancel Hint"
                className="text-stone-400 hover:text-stone-200 text-[11px]"
              >
                Cancel
              </button>
            </div>
          )}
          <span className="text-stone-500 text-[11px]">No hints used = +{puzzle.bonusNoHint} bonus pts</span>
        </div>
      )}
    </div>
  );
};
