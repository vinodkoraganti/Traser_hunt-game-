import React, { useState } from 'react';
import { LogicPuzzleData } from '../../game/types.ts';
import { validateLogicPuzzle } from '../../game/rules.ts';
import { sound } from '../../game/audio.ts';
import { Check, AlertCircle, RotateCcw, HelpCircle, Sparkles } from 'lucide-react';

interface LogicPuzzleViewProps {
  puzzle: LogicPuzzleData;
  onSolve: (usedHints: boolean) => void;
  isAlreadySolved: boolean;
  onUseHint: (hintId: string, penalty: number) => void;
  usedHintIds: string[];
}

export const LogicPuzzleView: React.FC<LogicPuzzleViewProps> = ({
  puzzle,
  onSolve,
  isAlreadySolved,
  onUseHint,
  usedHintIds,
}) => {
  // Map of slotId -> itemId
  const [placements, setPlacements] = useState<Record<string, string>>(() => {
    if (isAlreadySolved) {
      const solved: Record<string, string> = {};
      puzzle.slots.forEach(s => {
        solved[s.id] = s.correctItem;
      });
      return solved;
    }
    return {};
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(
    isAlreadySolved ? { type: 'success', message: 'Elemental Harmony established! The sanctuary gate is unsealed.' } : null
  );

  const availableHint = puzzle.hints.find(h => !usedHintIds.includes(h.id));
  const activeHints = puzzle.hints.filter(h => usedHintIds.includes(h.id));
  const usedAnyHint = activeHints.length > 0;

  // Determine which items are currently placed in which slot
  const placedItemIds = Object.values(placements);

  const handleSelectInventoryItem = (itemId: string) => {
    if (isAlreadySolved) return;
    sound.playClick();
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
    }
  };

  const handleSlotClick = (slotId: string) => {
    if (isAlreadySolved) return;
    sound.playClick();

    if (selectedItemId) {
      // Place selected item into this slot
      setPlacements(prev => {
        const next = { ...prev };
        // If this item was in another slot, clear it
        Object.keys(next).forEach(k => {
          if (next[k] === selectedItemId) delete next[k];
        });
        next[slotId] = selectedItemId;
        return next;
      });
      setSelectedItemId(null);
      setFeedback(null);
    } else if (placements[slotId]) {
      // Remove item from slot
      setPlacements(prev => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });
      setFeedback(null);
    }
  };

  const handleVerify = () => {
    if (isAlreadySolved) return;

    const result = validateLogicPuzzle(placements, puzzle);
    if (!result.isComplete) {
      sound.playError();
      setFeedback({
        type: 'info',
        message: 'All four elemental altars must hold a crest before the attunement begins.',
      });
      return;
    }

    if (result.isCorrect) {
      sound.playSolve();
      setFeedback({
        type: 'success',
        message: `Magnificent! The four elemental energies balance in perfect harmony! (+${puzzle.points} pts)`,
      });
      onSolve(usedAnyHint);
    } else {
      sound.playError();
      setFeedback({
        type: 'error',
        message: `${result.correctSlotsCount} of 4 altars resonating, but the energies clash. Review the ancient clues!`,
      });
    }
  };

  const handleReset = () => {
    if (isAlreadySolved) return;
    sound.playClick();
    setPlacements({});
    setSelectedItemId(null);
    setFeedback(null);
  };

  return (
    <div className="w-full bg-stone-900/90 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 text-stone-100">
      {/* Title */}
      <div className="border-b border-amber-700/30 pb-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
          Logic & Harmony Challenge
        </span>
        <h3 className="text-xl font-bold font-serif text-amber-200 mt-0.5">{puzzle.title}</h3>
        <p className="text-xs text-stone-400 italic mt-0.5">{puzzle.loreText}</p>
      </div>

      {/* Clues Parchment */}
      <div className="bg-[#241c14] border border-amber-700/50 rounded-xl p-4 shadow-inner">
        <span className="text-xs font-bold text-amber-300 font-serif uppercase tracking-wider">
          Ancient Tablet Inscriptions:
        </span>
        <ul className="mt-2 space-y-1 text-xs sm:text-sm text-amber-100/90 font-serif">
          {puzzle.clues.map((clue, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>{clue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4 Cardinal Altars Diagram */}
      <div className="relative py-4 flex flex-col items-center justify-center min-h-[220px]">
        {/* Compass Cross Lines */}
        <div className="absolute w-48 sm:w-60 h-0.5 bg-amber-700/30 top-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute h-48 sm:h-60 w-0.5 bg-amber-700/30 left-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Central Sun Disc */}
        <div className="w-16 h-16 rounded-full bg-amber-950/80 border-2 border-amber-500/50 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(250,204,21,0.25)] z-10 pointer-events-none">
          ☀️
        </div>

        {/* 4 Cardinal Altars */}
        {puzzle.slots.map(slot => {
          const placedId = placements[slot.id];
          const placedItem = puzzle.availableItems.find(i => i.id === placedId);

          // Position class based on slot.id
          let posClass = '';
          if (slot.id === 'north') posClass = 'top-0 left-1/2 -translate-x-1/2';
          if (slot.id === 'south') posClass = 'bottom-0 left-1/2 -translate-x-1/2';
          if (slot.id === 'west') posClass = 'left-2 sm:left-12 top-1/2 -translate-y-1/2';
          if (slot.id === 'east') posClass = 'right-2 sm:right-12 top-1/2 -translate-y-1/2';

          return (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot.id)}
              disabled={isAlreadySolved}
              aria-label={`${slot.label}: ${placedItem ? placedItem.name : 'Empty'}`}
              className={`absolute ${posClass} w-24 sm:w-28 p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all z-20 ${
                placedItem
                  ? 'bg-amber-950/90 border-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                  : 'bg-stone-950/80 border-amber-800/50 hover:border-amber-500 hover:bg-stone-900'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 truncate max-w-full">
                {slot.id}
              </span>
              <div className="w-10 h-10 rounded-lg bg-stone-900 border border-amber-700/40 flex items-center justify-center text-2xl">
                {placedItem ? placedItem.symbol : '—'}
              </div>
              <span className="text-[11px] font-medium text-stone-200 truncate max-w-full">
                {placedItem ? placedItem.name : 'Click to place'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Available Crests Tray */}
      <div className="bg-stone-950/80 border border-amber-900/40 rounded-xl p-3">
        <span className="text-xs font-semibold text-stone-300 block mb-2">
          Available Elemental Crests (Click to select, then click an altar):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {puzzle.availableItems.map(item => {
            const isPlaced = placedItemIds.includes(item.id);
            const isSelected = selectedItemId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectInventoryItem(item.id)}
                disabled={isAlreadySolved}
                aria-label={`Select ${item.name}`}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-yellow-200 ring-2 ring-amber-300 scale-105'
                    : isPlaced
                    ? 'opacity-40 bg-stone-900 border-stone-800 text-stone-400'
                    : 'bg-stone-900/90 hover:bg-stone-850 border-amber-700/50 text-stone-200'
                }`}
              >
                <span className="text-2xl">{item.symbol}</span>
                <span className="text-xs font-semibold truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
              : 'bg-amber-950/80 border border-amber-500/50 text-amber-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Actions */}
      {!isAlreadySolved ? (
        <div className="flex items-center gap-3">
          <button
            onClick={handleVerify}
            aria-label="Attune Altars"
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Attune Altars</span>
          </button>

          <button
            onClick={handleReset}
            aria-label="Clear Placements"
            className="bg-stone-950 hover:bg-stone-850 text-stone-300 border border-stone-700 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs sm:text-sm font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Elemental Harmony Achieved!</span>
        </div>
      )}

      {/* Hints */}
      {!isAlreadySolved && availableHint && (
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onUseHint(availableHint.id, availableHint.penalty)}
            aria-label="Request Alignment Clue"
            className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consult ancient astronomical tablets (-{availableHint.penalty} pts)</span>
          </button>
        </div>
      )}
    </div>
  );
};
