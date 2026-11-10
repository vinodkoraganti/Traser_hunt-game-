import React, { useEffect } from 'react';
import { GameState } from '../game/types.ts';
import { calculateRank } from '../game/rules.ts';
import { sound } from '../game/audio.ts';
import { Trophy, Crown, Sparkles, RotateCcw, Home, Coins, Puzzle, Clock, Award } from 'lucide-react';

interface VictoryScreenProps {
  state: GameState;
  onRestart: () => void;
  onHome: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  state,
  onRestart,
  onHome,
}) => {
  useEffect(() => {
    sound.playVictory();
  }, []);

  const rank = calculateRank(state.stats.score);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="relative min-h-screen w-full bg-radial from-amber-950 via-slate-950 to-black text-stone-100 flex flex-col items-center justify-center p-4 sm:p-8 select-none overflow-x-hidden">
      {/* Golden Radiance & Particle Fireworks in SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-60 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50%" cy="30%" r="40%" fill="#fbbf24" opacity="0.15" filter="blur(60px)" />
          {/* Beams of Light */}
          <line x1="50%" y1="30%" x2="10%" y2="0" stroke="#fef08a" strokeWidth="2" opacity="0.4" />
          <line x1="50%" y1="30%" x2="30%" y2="0" stroke="#fef08a" strokeWidth="1.5" opacity="0.3" />
          <line x1="50%" y1="30%" x2="70%" y2="0" stroke="#fef08a" strokeWidth="2" opacity="0.4" />
          <line x1="50%" y1="30%" x2="90%" y2="0" stroke="#fef08a" strokeWidth="1.5" opacity="0.3" />
        </svg>

        {/* Floating Sparks */}
        <span className="absolute top-[15%] left-[20%] text-2xl animate-ping">✨</span>
        <span className="absolute top-[25%] right-[22%] text-3xl animate-bounce">🪙</span>
        <span className="absolute top-[40%] left-[10%] text-xl animate-pulse">👑</span>
        <span className="absolute bottom-[20%] right-[15%] text-2xl animate-ping">✨</span>
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-stone-900/95 border-2 border-amber-500 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(250,204,21,0.5)] flex flex-col items-center text-center">
        {/* Legendary Chest Centerpiece */}
        <div className="relative my-2">
          <div className="absolute -inset-8 bg-amber-400/25 rounded-full blur-2xl animate-pulse" />
          <span className="text-7xl sm:text-8xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            🏆
          </span>
          <span className="absolute -top-3 -right-2 text-3xl animate-bounce">👑</span>
        </div>

        {/* Victory Headline */}
        <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-mono uppercase tracking-widest mt-2">
          <Sparkles className="w-4 h-4" />
          <span>The Lost Treasure Claimed</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 mt-1">
          VICTORY ACHIEVED!
        </h1>

        <p className="text-xs sm:text-sm text-amber-200/90 max-w-lg mt-2 font-serif italic">
          "Hail to explorer <span className="font-bold text-amber-300">{state.profile.name}</span>! The ancient secrets of Isla Perdida have finally revealed their greatest treasure."
        </p>

        {/* Explorer Rank Plaque */}
        <div className="w-full bg-[#241a10] border-2 border-amber-500/60 rounded-2xl p-4 my-6 shadow-inner flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{rank.badge}</span>
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-bold">
                Honorary Explorer Rank
              </span>
              <h3 className="text-lg font-bold font-serif text-amber-200">{rank.title}</h3>
              <p className="text-xs text-stone-300 italic">{rank.description}</p>
            </div>
          </div>
        </div>

        {/* Grand Adventure Stats Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-6">
          <div className="bg-stone-950/80 border border-amber-600/40 p-3 rounded-xl flex flex-col items-center">
            <Trophy className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] uppercase text-stone-400 font-bold">Final Score</span>
            <span className="font-mono text-xl font-black text-amber-300 tabular-nums">
              {state.stats.score}
            </span>
          </div>

          <div className="bg-stone-950/80 border border-amber-600/40 p-3 rounded-xl flex flex-col items-center">
            <Coins className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] uppercase text-stone-400 font-bold">Total Coins</span>
            <span className="font-mono text-xl font-black text-yellow-300 tabular-nums">
              {state.stats.coinsCollected}
            </span>
          </div>

          <div className="bg-stone-950/80 border border-amber-600/40 p-3 rounded-xl flex flex-col items-center">
            <Puzzle className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] uppercase text-stone-400 font-bold">Puzzles Solved</span>
            <span className="font-mono text-xl font-black text-emerald-300 tabular-nums">
              {state.stats.puzzlesSolved} / 10
            </span>
          </div>

          <div className="bg-stone-950/80 border border-amber-600/40 p-3 rounded-xl flex flex-col items-center">
            <Clock className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-[10px] uppercase text-stone-400 font-bold">Time Taken</span>
            <span className="font-mono text-base font-black text-cyan-300 tabular-nums mt-1">
              {formatTime(state.stats.timeElapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Unlocked Achievements Count */}
        <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/30 px-4 py-2 rounded-xl text-xs text-amber-200 mb-6">
          <Award className="w-4 h-4 text-amber-400" />
          <span>
            Achievements Unlocked:{' '}
            <strong className="text-amber-300">{state.unlockedAchievements.length} / 8</strong>
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            aria-label="Restart Adventure"
            className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            aria-label="Return to Main Menu"
            className="w-full sm:w-auto py-3 px-6 rounded-xl font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 border border-stone-600 shadow active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Title</span>
          </button>
        </div>
      </div>
    </div>
  );
};
