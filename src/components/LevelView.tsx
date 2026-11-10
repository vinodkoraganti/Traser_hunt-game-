import React, { useState } from 'react';
import { GameState, LevelDefinition, PuzzleData } from '../game/types.ts';
import { RiddlePuzzleView } from './puzzles/RiddlePuzzleView.tsx';
import { HiddenObjectScene } from './puzzles/HiddenObjectScene.tsx';
import { LogicPuzzleView } from './puzzles/LogicPuzzleView.tsx';
import { TreasureCodeView } from './puzzles/TreasureCodeView.tsx';
import { SequencePuzzleView } from './puzzles/SequencePuzzleView.tsx';
import { NumberPuzzleView } from './puzzles/NumberPuzzleView.tsx';
import { TrapModal } from './TrapModal.tsx';
import { sound } from '../game/audio.ts';
import { CheckCircle2, Lock, Sparkles, BookOpen, ShieldAlert, ArrowRight } from 'lucide-react';

interface LevelViewProps {
  level: LevelDefinition;
  state: GameState;
  onSolvePuzzle: (puzzleId: string, usedHints: boolean) => void;
  onUseHint: (hintId: string, penalty: number) => void;
  onResolveTrap: (isSafe: boolean) => void;
  onTriggerChest: () => void;
  onOpenMap: () => void;
}

export const LevelView: React.FC<LevelViewProps> = ({
  level,
  state,
  onSolvePuzzle,
  onUseHint,
  onResolveTrap,
  onTriggerChest,
  onOpenMap,
}) => {
  // Selected active puzzle inside this level
  const [activePuzzleId, setActivePuzzleId] = useState<string>(level.puzzles[0]?.id || '');
  const [showTrapModal, setShowTrapModal] = useState<boolean>(false);

  const activePuzzle = level.puzzles.find(p => p.id === activePuzzleId) || level.puzzles[0];
  const allPuzzlesSolved = level.puzzles.every(p => state.solvedPuzzleIds.includes(p.id));
  const hasTrap = !!level.trap;
  const isTrapDisarmed = state.stats.trapsDisarmed >= 1;

  // Background visual styling per level
  const themeBgGradients: Record<number, string> = {
    1: 'from-emerald-950/80 via-stone-950 to-black', // Jungle
    2: 'from-amber-950/80 via-stone-950 to-black',   // Temple
    3: 'from-sky-950/80 via-slate-950 to-black',     // Cave
    4: 'from-yellow-950/80 via-stone-950 to-black',  // Desert
    5: 'from-purple-950/80 via-slate-950 to-black',  // Lost Island
  };

  const bgGradient = themeBgGradients[level.id] || themeBgGradients[1];

  const renderActivePuzzle = (puzzle: PuzzleData) => {
    const isSolved = state.solvedPuzzleIds.includes(puzzle.id);

    switch (puzzle.type) {
      case 'riddle':
        return (
          <RiddlePuzzleView
            puzzle={puzzle}
            isAlreadySolved={isSolved}
            onSolve={usedHints => onSolvePuzzle(puzzle.id, usedHints)}
            onUseHint={onUseHint}
            usedHintIds={state.usedHintIds}
          />
        );
      case 'hidden_object':
        return (
          <HiddenObjectScene
            puzzle={puzzle}
            isAlreadySolved={isSolved}
            onSolve={usedHints => onSolvePuzzle(puzzle.id, usedHints)}
            onUseHint={onUseHint}
            usedHintIds={state.usedHintIds}
          />
        );
      case 'logic':
        return (
          <LogicPuzzleView
            puzzle={puzzle}
            isAlreadySolved={isSolved}
            onSolve={usedHints => onSolvePuzzle(puzzle.id, usedHints)}
            onUseHint={onUseHint}
            usedHintIds={state.usedHintIds}
          />
        );
      case 'treasure_code':
        return (
          <TreasureCodeView
            puzzle={puzzle}
            isAlreadySolved={isSolved}
            onSolve={usedHints => onSolvePuzzle(puzzle.id, usedHints)}
            onUseHint={onUseHint}
            usedHintIds={state.usedHintIds}
          />
        );
      case 'sequence':
        return (
          <SequencePuzzleView
            puzzle={puzzle}
            isAlreadySolved={isSolved}
            onSolve={usedHints => onSolvePuzzle(puzzle.id, usedHints)}
            onUseHint={onUseHint}
            usedHintIds={state.usedHintIds}
          />
        );
      case 'number':
        return (
          <NumberPuzzleView
            puzzle={puzzle}
            isAlreadySolved={isSolved}
            onSolve={usedHints => onSolvePuzzle(puzzle.id, usedHints)}
            onUseHint={onUseHint}
            usedHintIds={state.usedHintIds}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${bgGradient} text-stone-100 pt-24 sm:pt-28 pb-12 px-3 sm:px-6 select-none flex flex-col items-center`}>
      <div className="w-full max-w-4xl flex flex-col gap-5">
        {/* Level Banner & Narrative Header */}
        <div className="relative bg-stone-900/90 border border-amber-600/40 rounded-3xl p-5 sm:p-6 shadow-xl overflow-hidden">
          {/* Subtle thematic ambient icon */}
          <div className="absolute top-2 right-4 text-7xl sm:text-8xl opacity-10 pointer-events-none select-none">
            {level.id === 1 ? '🌴' : level.id === 2 ? '🏛️' : level.id === 3 ? '⚓' : level.id === 4 ? '🏜️' : '👑'}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-700/30 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Sector {level.id} of 5 · {level.locationName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-200 mt-0.5">
                {level.title}
              </h1>
              <p className="text-xs sm:text-sm text-amber-300/80 font-medium">{level.subtitle}</p>
            </div>

            {/* Level Completion Status Badge */}
            <div className="self-start sm:self-auto">
              {allPuzzlesSolved ? (
                <button
                  onClick={onTriggerChest}
                  aria-label="Open Completed Level Chest"
                  className="bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-black px-4 py-2 rounded-xl text-xs shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center gap-1.5 animate-bounce"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Sector Vault Chest!</span>
                </button>
              ) : (
                <div className="bg-stone-950/80 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-amber-300">
                  {state.solvedPuzzleIds.filter(id => level.puzzles.some(p => p.id === id)).length} / {level.puzzles.length} Objectives Solved
                </div>
              )}
            </div>
          </div>

          {/* Lore Story Paragraph */}
          <div className="mt-3 flex items-start gap-2 text-stone-300 text-xs sm:text-sm leading-relaxed font-serif italic">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>"{level.loreStory}"</p>
          </div>
        </div>

        {/* Level 3 Optional Hazard/Trap Card */}
        {hasTrap && (
          <div className="bg-rose-950/40 border border-rose-700/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-500 flex items-center justify-center text-rose-300 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-200">{level.trap!.name}</h4>
                <p className="text-xs text-rose-300/80">
                  {isTrapDisarmed
                    ? 'Trap successfully bypassed and disarmed.'
                    : 'A deadly pirate tripwire spans the grotto floor!'}
                </p>
              </div>
            </div>

            {!isTrapDisarmed && (
              <button
                onClick={() => {
                  sound.playClick();
                  setShowTrapModal(true);
                }}
                aria-label="Inspect Pirate Trap"
                className="bg-rose-600 hover:bg-rose-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs shadow active:scale-95 transition-all self-start sm:self-auto"
              >
                Inspect & Disarm Trap
              </button>
            )}
          </div>
        )}

        {/* Puzzle Selector Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-amber-800/40 pb-1 overflow-x-auto">
          {level.puzzles.map((p, idx) => {
            const isSolved = state.solvedPuzzleIds.includes(p.id);
            const isActive = activePuzzleId === p.id;

            return (
              <button
                key={p.id}
                onClick={() => {
                  sound.playClick();
                  setActivePuzzleId(p.id);
                }}
                aria-label={`Select Puzzle ${idx + 1}: ${p.title}`}
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 border border-yellow-200 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                    : 'bg-stone-900/70 hover:bg-stone-850 text-stone-300 border border-stone-800'
                }`}
              >
                {isSolved ? (
                  <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-emerald-400'}`} />
                ) : (
                  <span className={`w-4 h-4 rounded-full border text-[10px] flex items-center justify-center font-mono ${isActive ? 'border-stone-950' : 'border-amber-500/60 text-amber-400'}`}>
                    {idx + 1}
                  </span>
                )}
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Puzzle Workspace */}
        <div className="w-full">
          {renderActivePuzzle(activePuzzle)}
        </div>

        {/* Trap Modal Encounter */}
        {showTrapModal && level.trap && (
          <TrapModal
            trap={level.trap}
            onResolve={isSafe => {
              setShowTrapModal(false);
              onResolveTrap(isSafe);
            }}
          />
        )}
      </div>
    </div>
  );
};
