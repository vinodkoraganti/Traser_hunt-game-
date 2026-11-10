import React from 'react';
import { GameState } from '../game/types.ts';
import { GAME_LEVELS } from '../game/levelsData.ts';
import { Lock, CheckCircle2, Star, Compass, ArrowRight, X } from 'lucide-react';
import { sound } from '../game/audio.ts';

interface AdventureMapProps {
  state: GameState;
  onSelectLevel: (levelId: number) => void;
  onClose?: () => void;
  isOverlay?: boolean;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  state,
  onSelectLevel,
  onClose,
  isOverlay = false,
}) => {
  const [selectedPinId, setSelectedPinId] = React.useState<number>(state.currentLevelId);
  const selectedLevel = GAME_LEVELS.find(l => l.id === selectedPinId) || GAME_LEVELS[0];
  const isUnlocked = selectedPinId <= state.unlockedLevelId;
  const isCompleted = selectedPinId < state.unlockedLevelId;

  // Visual layout coordinates for the 5 levels across the island map
  const levelCoords: Record<number, { x: number; y: number; icon: string }> = {
    1: { x: 18, y: 72, icon: '🌴' }, // Jungle Entrance
    2: { x: 38, y: 35, icon: '🏛️' }, // Ancient Temple
    3: { x: 62, y: 68, icon: '⚓' }, // Pirate Cave
    4: { x: 80, y: 38, icon: '🏜️' }, // Forgotten Desert
    5: { x: 50, y: 18, icon: '👑' }, // The Lost Island Sanctuary
  };

  return (
    <div className={`w-full ${isOverlay ? 'fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6' : 'min-h-screen pt-20 pb-8 px-3 sm:px-6 flex flex-col items-center justify-center bg-slate-950'}`}>
      <div className="relative w-full max-w-5xl bg-[#1c1917] border-2 border-amber-600/60 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col">
        {/* Map Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-r from-stone-900 via-amber-950/60 to-stone-900 border-b border-amber-700/40">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400 animate-[spin_12s_linear_infinite]" />
            <h2 className="font-serif font-bold text-amber-300 text-base sm:text-lg tracking-wider uppercase">
              Chart of Isla Perdida
            </h2>
          </div>
          {onClose && (
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Close Map"
              className="text-amber-400 hover:text-amber-200 p-1 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Interactive Map Canvas Container */}
        <div className="relative w-full h-[340px] sm:h-[460px] bg-[#17120e] overflow-hidden select-none">
          {/* Nautical Grid Lines & Island SVG Illustration */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="nauticalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#78350f" strokeWidth="0.5" strokeOpacity="0.25" />
              </pattern>
              <radialGradient id="oceanShallows" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#0f172a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#020617" stopOpacity="1" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#oceanShallows)" />
            <rect width="100%" height="100%" fill="url(#nauticalGrid)" />

            {/* Island Landmass Contour (Mysterious Skull/Dragon Shape) */}
            <path
              d="M 120 320 C 100 240, 180 180, 240 140 C 320 80, 480 70, 580 90 C 720 120, 840 220, 820 320 C 800 400, 680 440, 520 430 C 380 420, 260 460, 180 410 Z"
              fill="#292524"
              stroke="#b45309"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              className="opacity-90"
            />
            {/* Mountain Ridges on Island */}
            <path d="M 320 220 L 360 170 L 400 230 L 450 180 L 510 240" fill="none" stroke="#78350f" strokeWidth="2" opacity="0.6" />
            <path d="M 460 300 L 500 250 L 540 310" fill="none" stroke="#78350f" strokeWidth="2" opacity="0.6" />

            {/* Dotted Expedition Trail Connecting Level Nodes */}
            <path
              d="M 180 360 Q 280 270, 380 175 T 620 340 T 800 190 T 500 90"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              className="opacity-75"
            />

            {/* Compass Rose in Corner */}
            <g transform="translate(85, 75) scale(0.65)" opacity="0.5">
              <circle cx="0" cy="0" r="45" fill="none" stroke="#b45309" strokeWidth="1.5" />
              <polygon points="0,-40 8,-10 0,0 -8,-10" fill="#f59e0b" />
              <polygon points="0,40 8,10 0,0 -8,10" fill="#78350f" />
              <polygon points="40,0 10,8 0,0 10,-8" fill="#78350f" />
              <polygon points="-40,0 -10,8 0,0 -10,-8" fill="#78350f" />
              <text x="-4" y="-44" fill="#fbbf24" fontSize="12" fontWeight="bold">N</text>
            </g>
          </svg>

          {/* Interactive Map Pins */}
          {GAME_LEVELS.map(level => {
            const coord = levelCoords[level.id];
            const unlocked = level.id <= state.unlockedLevelId;
            const completed = level.id < state.unlockedLevelId;
            const isCurrent = level.id === state.currentLevelId;
            const isSelected = level.id === selectedPinId;

            return (
              <button
                key={level.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedPinId(level.id);
                }}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                aria-label={`Level ${level.id}: ${level.title} - ${unlocked ? (completed ? 'Completed' : 'Unlocked') : 'Locked'}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 focus:outline-none`}
              >
                {/* Pin Aura */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-transform duration-200 ${
                    isSelected
                      ? 'scale-110 border-amber-300 ring-4 ring-amber-400/40 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                      : 'hover:scale-105'
                  } ${
                    completed
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                      : unlocked
                      ? 'bg-amber-950/90 border-amber-400 text-amber-300'
                      : 'bg-stone-900/90 border-stone-600 text-stone-500 opacity-60'
                  }`}
                >
                  <span className="text-xl sm:text-2xl">{coord.icon}</span>

                  {/* Status Badges */}
                  {completed ? (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : !unlocked ? (
                    <span className="absolute -top-1 -right-1 bg-stone-700 text-stone-300 rounded-full p-1 shadow">
                      <Lock className="w-3 h-3" />
                    </span>
                  ) : isCurrent ? (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded-full shadow animate-pulse">
                      NOW
                    </span>
                  ) : null}
                </div>

                {/* Level Tag Label */}
                <span
                  className={`mt-1 block text-center font-bold text-[11px] sm:text-xs rounded-md px-1.5 py-0.5 whitespace-nowrap shadow ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 ring-1 ring-amber-200'
                      : 'bg-stone-900/80 text-amber-200/90 border border-amber-700/30'
                  }`}
                >
                  Lv.{level.id} {level.title.replace(/^The\s+/, '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Level Details & Travel Action Footer */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-stone-950 via-stone-900 to-[#1c1917] border-t border-amber-700/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Location {selectedLevel.id} of 5
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  <span>Area Cleared</span>
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-amber-100">
              {selectedLevel.title}: <span className="text-amber-400 font-normal">{selectedLevel.subtitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2">
              {selectedLevel.loreStory}
            </p>
          </div>

          <div className="w-full md:w-auto flex items-center justify-end gap-3">
            {isUnlocked ? (
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectLevel(selectedPinId);
                  if (onClose) onClose();
                }}
                aria-label={`Enter Level ${selectedLevel.id}: ${selectedLevel.title}`}
                className="w-full md:w-auto py-2.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>{state.currentLevelId === selectedPinId ? 'Resume Exploration' : 'Travel to Location'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-stone-400 text-xs font-medium bg-stone-800/80 border border-stone-700 px-4 py-2.5 rounded-xl">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>Complete Level {selectedLevel.id - 1} to Unlock</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
