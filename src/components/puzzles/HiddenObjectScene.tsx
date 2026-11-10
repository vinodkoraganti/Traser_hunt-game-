import React, { useState } from 'react';
import { HiddenObjectPuzzleData } from '../../game/types.ts';
import { sound } from '../../game/audio.ts';
import { Sparkles, Check, HelpCircle, Eye, Search } from 'lucide-react';

interface HiddenObjectSceneProps {
  puzzle: HiddenObjectPuzzleData;
  onSolve: (usedHints: boolean) => void;
  isAlreadySolved: boolean;
  onUseHint: (hintId: string, penalty: number) => void;
  usedHintIds: string[];
}

export const HiddenObjectScene: React.FC<HiddenObjectSceneProps> = ({
  puzzle,
  onSolve,
  isAlreadySolved,
  onUseHint,
  usedHintIds,
}) => {
  const [foundObjectIds, setFoundObjectIds] = useState<string[]>(
    isAlreadySolved ? puzzle.itemsToFind.map(i => i.id) : []
  );
  const [activeSparkle, setActiveSparkle] = useState<{ x: number; y: number; text: string } | null>(null);
  const [hintHighlightedId, setHintHighlightedId] = useState<string | null>(null);

  const availableHint = puzzle.hints.find(h => !usedHintIds.includes(h.id));
  const usedAnyHint = puzzle.hints.some(h => usedHintIds.includes(h.id));

  const handleItemClick = (itemId: string, x: number, y: number, name: string) => {
    if (foundObjectIds.includes(itemId) || isAlreadySolved) return;

    sound.playCoin();
    const nextFound = [...foundObjectIds, itemId];
    setFoundObjectIds(nextFound);

    setActiveSparkle({ x, y, text: `Found ${name}!` });
    setTimeout(() => setActiveSparkle(null), 2500);

    if (nextFound.length === puzzle.itemsToFind.length) {
      setTimeout(() => {
        sound.playSolve();
        onSolve(usedAnyHint);
      }, 500);
    }
  };

  const handleRequestHint = () => {
    if (!availableHint) return;
    onUseHint(availableHint.id, availableHint.penalty);
    sound.playClick();

    // Highlight one remaining unfound item with a pulsing beacon
    const unfound = puzzle.itemsToFind.find(i => !foundObjectIds.includes(i.id));
    if (unfound) {
      setHintHighlightedId(unfound.id);
      setTimeout(() => setHintHighlightedId(null), 6000);
    }
  };

  const isCave = puzzle.sceneTheme === 'cave';

  return (
    <div className="w-full bg-stone-900/90 border border-amber-600/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 text-stone-100">
      {/* Title & Counter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-700/30 pb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
            Observation Challenge
          </span>
          <h3 className="text-xl font-bold font-serif text-amber-200 mt-0.5">{puzzle.title}</h3>
          <p className="text-xs text-stone-400 italic mt-0.5">{puzzle.instructions}</p>
        </div>

        <div className="flex items-center gap-2 bg-stone-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Search className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold text-amber-300">
            Relics Located: {foundObjectIds.length} / {puzzle.itemsToFind.length}
          </span>
        </div>
      </div>

      {/* Interactive Visual Exploration Canvas */}
      <div className="relative w-full h-[280px] sm:h-[360px] rounded-xl overflow-hidden border-2 border-amber-800/70 shadow-2xl bg-slate-950 select-none">
        {/* Background Visual Scene SVG */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="torchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </radialGradient>
          </defs>

          {isCave ? (
            /* Pirate Cave Scene */
            <>
              {/* Dark Cavern walls */}
              <rect width="100%" height="100%" fill="#0a0f1d" />
              <path d="M 0 0 L 150 120 L 350 40 L 600 130 L 900 30 L 1200 140 L 1200 0 Z" fill="#1e293b" />
              {/* Stalactites */}
              <polygon points="120,0 135,160 150,0" fill="#0f172a" />
              <polygon points="260,0 280,210 300,0" fill="#1e293b" />
              <polygon points="720,0 740,180 760,0" fill="#0f172a" />
              {/* Sunken Galleon Silhouette */}
              <path d="M 200 240 Q 400 200, 600 220 L 620 320 L 180 320 Z" fill="#2d1b10" stroke="#451a03" strokeWidth="2" />
              <rect x="380" y="80" width="16" height="180" fill="#1c120c" />
              <line x1="280" y1="120" x2="480" y2="120" stroke="#1c120c" strokeWidth="6" />
              {/* Lapping Sea Water Base */}
              <path d="M 0 280 Q 300 260, 600 275 T 1200 270 L 1200 400 L 0 400 Z" fill="#042f2e" opacity="0.85" />
            </>
          ) : (
            /* Lush Jungle Scene */
            <>
              <rect width="100%" height="100%" fill="#062e24" />
              {/* Overlapping tropical leaves and banyan branches */}
              <circle cx="85%" cy="20%" r="90" fill="#065f46" opacity="0.7" />
              <circle cx="15%" cy="30%" r="110" fill="#047857" opacity="0.6" />
              {/* Banyan Tree Trunk on Right */}
              <path d="M 720 0 Q 760 180, 740 380 L 860 380 Q 820 180, 800 0 Z" fill="#291e10" stroke="#1c140a" strokeWidth="3" />
              {/* Stone Pedestal in Center */}
              <polygon points="400,240 540,240 560,340 380,340" fill="#3f3f46" stroke="#52525b" strokeWidth="2" />
              <polygon points="420,220 520,220 540,240 400,240" fill="#52525b" />
              {/* Jungle Ground & Ferns */}
              <path d="M 0 270 Q 250 250, 500 265 T 1000 260 L 1000 400 L 0 400 Z" fill="#064e3b" />
              {/* Giant Fern Clumps on Left */}
              <path d="M 40 340 Q 120 220, 220 250 Q 140 280, 40 340 Z" fill="#059669" />
              <path d="M 60 350 Q 180 250, 260 300 Q 160 320, 60 350 Z" fill="#10b981" opacity="0.8" />
            </>
          )}

          <rect width="100%" height="100%" fill="url(#torchGlow)" pointerEvents="none" />
        </svg>

        {/* Clickable Hidden Object Targets */}
        {puzzle.itemsToFind.map(item => {
          const isFound = foundObjectIds.includes(item.id);
          const isHighlighted = hintHighlightedId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, item.xPercent, item.yPercent, item.name)}
              style={{
                left: `${item.xPercent}%`,
                top: `${item.yPercent}%`,
                width: `${item.radiusPercent * 2.5}%`,
                height: `${item.radiusPercent * 2.5}%`,
              }}
              title={isFound ? `${item.name} (Found)` : 'Investigate this area'}
              aria-label={item.name}
              role="button"
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-transform duration-200 ${
                isFound
                  ? 'opacity-80 scale-100 cursor-default'
                  : 'hover:scale-125 active:scale-95'
              }`}
            >
              {/* Hint Beacon Glow */}
              {isHighlighted && !isFound && (
                <div className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
              )}

              {/* The Visual Object Icon */}
              <div
                className={`relative text-2xl sm:text-3xl filter transition-all duration-300 ${
                  isFound
                    ? 'drop-shadow-[0_0_12px_rgba(52,211,153,0.9)] scale-110'
                    : 'opacity-70 hover:opacity-100 hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]'
                }`}
              >
                {item.svgIcon}
              </div>

              {/* Checkmark overlay once found */}
              {isFound && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow scale-90 animate-bounce">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
              )}
            </div>
          );
        })}

        {/* Floating Discovery Sparkle Banner */}
        {activeSparkle && (
          <div
            style={{ left: `${activeSparkle.x}%`, top: `${Math.max(10, activeSparkle.y - 12)}%` }}
            className="absolute -translate-x-1/2 -translate-y-full bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.8)] flex items-center gap-1.5 animate-bounce z-20 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{activeSparkle.text}</span>
          </div>
        )}
      </div>

      {/* Relics Checklist Tray */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
        {puzzle.itemsToFind.map(item => {
          const isFound = foundObjectIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                isFound
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                  : 'bg-stone-950/70 border-amber-900/40 text-stone-300'
              }`}
            >
              <span className="text-xl sm:text-2xl">{item.svgIcon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-amber-200">{item.name}</p>
                <p className="text-[10px] text-stone-400 truncate">
                  {isFound ? 'Discovered!' : item.hint}
                </p>
              </div>
              {isFound && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Hint Option */}
      {!isAlreadySolved && availableHint && (
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleRequestHint}
            aria-label="Request Relic Clue"
            className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1.5 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Reveal relic location hint (-{availableHint.penalty} pts)</span>
          </button>
          <span className="text-stone-500 text-[11px]">Click directly on objects to collect</span>
        </div>
      )}
    </div>
  );
};
