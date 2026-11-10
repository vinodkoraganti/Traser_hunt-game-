import React from 'react';
import { GameState } from '../game/types.ts';
import { EXPLORER_AVATARS } from '../game/levelsData.ts';
import { Play, RotateCcw, User, Trophy, HelpCircle, Settings, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/audio.ts';

interface StartScreenProps {
  savedState: GameState | null;
  onStartNew: () => void;
  onContinue: () => void;
  onOpenProfile: () => void;
  onOpenHowToPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  savedState,
  onStartNew,
  onContinue,
  onOpenProfile,
  onOpenHowToPlay,
  onOpenLeaderboard,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
}) => {
  const currentAvatar = EXPLORER_AVATARS.find(a => a.id === savedState?.profile.avatar) || EXPLORER_AVATARS[0];
  const hasSave = savedState && (savedState.stats.score > 0 || savedState.currentLevelId > 1 || savedState.solvedPuzzleIds.length > 0);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-radial from-slate-900 via-slate-950 to-black text-slate-100 overflow-hidden select-none p-4 sm:p-8">
      {/* Dynamic Background Island Ambiance */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#047857" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#sunGlow)" />
          {/* Silhouetted Island Peaks & Palm Canopy */}
          <path
            d="M 0 750 Q 250 520, 500 680 T 1000 620 T 1500 700 T 2000 640 L 2000 1200 L 0 1200 Z"
            fill="#062e24"
            opacity="0.8"
          />
          <path
            d="M 0 820 Q 300 660, 700 780 T 1400 740 T 2000 780 L 2000 1200 L 0 1200 Z"
            fill="#021f18"
          />
          {/* Constellations / Sparkles */}
          <circle cx="15%" cy="22%" r="1.5" fill="#fef08a" opacity="0.8" />
          <circle cx="28%" cy="14%" r="2" fill="#fef08a" opacity="0.9" />
          <circle cx="72%" cy="18%" r="1.5" fill="#fef08a" opacity="0.7" />
          <circle cx="85%" cy="28%" r="2.5" fill="#fef08a" opacity="0.85" />
          <circle cx="50%" cy="12%" r="1.5" fill="#fef08a" opacity="0.6" />
        </svg>
      </div>

      {/* Floating Animated Golden Coins and Sparkles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-[20%] left-[12%] text-2xl animate-[bounce_4s_ease-in-out_infinite] opacity-60">
          🪙
        </span>
        <span className="absolute top-[45%] right-[14%] text-3xl animate-[bounce_5s_ease-in-out_infinite_1s] opacity-70">
          ✨
        </span>
        <span className="absolute bottom-[35%] left-[18%] text-2xl animate-[bounce_6s_ease-in-out_infinite_2s] opacity-60">
          🪙
        </span>
        <span className="absolute top-[30%] right-[25%] text-xl animate-[bounce_4.5s_ease-in-out_infinite_1.5s] opacity-50">
          ✨
        </span>
      </div>

      {/* Top Bar on Start Screen */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-amber-500/30 rounded-full px-3 py-1 text-xs text-amber-300">
          <span>{currentAvatar.icon}</span>
          <span className="font-semibold">{savedState?.profile.name || 'Adventurer'}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            aria-label="Explorer Profile"
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-amber-200 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs font-semibold shadow transition-all active:scale-95"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            className="bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-xl p-2 shadow transition-all active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Centerpiece: Bespoke SVG Title Lockup & 3D-styled Animated Golden Chest */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-3xl">
        {/* Animated 3D-styled Treasure Chest Centerpiece */}
        <div className="relative group cursor-pointer mb-2" onClick={sound.playCoin}>
          <div className="absolute -inset-6 bg-gradient-to-t from-amber-500/20 via-yellow-400/20 to-transparent rounded-full blur-2xl group-hover:from-amber-400/35 transition-all duration-500" />
          
          <svg className="w-36 h-36 sm:w-48 sm:h-48 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105" viewBox="0 0 200 180" fill="none">
            {/* Chest Base */}
            <path d="M25 80 L175 80 L160 160 L40 160 Z" fill="#451a03" stroke="#b45309" strokeWidth="4" />
            <path d="M35 90 L165 90 L152 150 L48 150 Z" fill="#78350f" />
            {/* Wood Planks */}
            <line x1="40" y1="110" x2="160" y2="110" stroke="#451a03" strokeWidth="2" />
            <line x1="44" y1="130" x2="156" y2="130" stroke="#451a03" strokeWidth="2" />
            {/* Iron bands */}
            <rect x="55" y="80" width="14" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="131" y="80" width="14" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            {/* Chest Lid (Curved Barrel) */}
            <path d="M20 80 Q100 25 180 80 Z" fill="#92400e" stroke="#d97706" strokeWidth="4" />
            <path d="M25 76 Q100 32 175 76 Z" fill="#b45309" />
            {/* Gold Lid Bandings */}
            <path d="M55 78 Q100 40 55 45" stroke="#f59e0b" strokeWidth="3" />
            <path d="M145 78 Q100 40 145 45" stroke="#f59e0b" strokeWidth="3" />
            {/* Golden Radiance Rays from Keyhole */}
            <circle cx="100" cy="85" r="14" fill="#fbbf24" opacity="0.9" filter="url(#glow)" />
            {/* Golden Skull Keyhole Emblem */}
            <rect x="90" y="75" width="20" height="26" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="100" cy="84" r="4" fill="#f59e0b" />
            <path d="M98 87 L102 87 L103 94 L97 94 Z" fill="#f59e0b" />
            {/* Golden Studs */}
            <circle cx="62" cy="95" r="2.5" fill="#fef08a" />
            <circle cx="62" cy="145" r="2.5" fill="#fef08a" />
            <circle cx="138" cy="95" r="2.5" fill="#fef08a" />
            <circle cx="138" cy="145" r="2.5" fill="#fef08a" />
          </svg>

          {/* Floating light particles around chest */}
          <span className="absolute -top-2 left-6 text-yellow-300 text-sm animate-ping">✦</span>
          <span className="absolute top-8 -right-3 text-amber-400 text-sm animate-pulse">✦</span>
        </div>

        {/* Bespoke Inline SVG Title Lockup */}
        <div className="w-full max-w-2xl px-2">
          <svg viewBox="0 0 800 110" className="w-full h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            <defs>
              <linearGradient id="goldTitleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="74"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="60"
              letterSpacing="5"
              fill="url(#goldTitleGrad)"
              stroke="url(#strokeGrad)"
              strokeWidth="2.5"
            >
              TREASURE QUEST
            </text>
          </svg>
        </div>

        {/* Subtitle with compass & gems */}
        <div className="flex items-center gap-2 mt-1 mb-6 text-amber-200/90 tracking-widest uppercase text-xs sm:text-sm font-semibold">
          <span className="h-px w-6 sm:w-12 bg-gradient-to-r from-transparent to-amber-400" />
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Lost Treasure Awaits!</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="h-px w-6 sm:w-12 bg-gradient-to-l from-transparent to-amber-400" />
        </div>

        {/* Action Buttons Hub */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          {hasSave ? (
            <>
              <button
                onClick={() => {
                  sound.playClick();
                  onContinue();
                }}
                aria-label="Continue Saved Adventure"
                className="w-full sm:flex-1 py-3 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 border border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Continue Quest (Lv.{savedState.currentLevelId})</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onStartNew();
                }}
                aria-label="Start New Adventure"
                className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-amber-200 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 shadow active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Game</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onStartNew();
              }}
              aria-label="Start Adventure"
              className="w-full py-3.5 px-8 rounded-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 border border-yellow-200 shadow-[0_0_25px_rgba(250,204,21,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base sm:text-lg tracking-wide"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START ADVENTURE</span>
            </button>
          )}
        </div>

        {/* Secondary Navigation Cluster */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-md mt-4">
          <button
            onClick={() => {
              sound.playClick();
              onOpenHowToPlay();
            }}
            aria-label="How to Play Instructions"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-medium transition-all shadow"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>How to Play</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            aria-label="View Leaderboard"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-medium transition-all shadow"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Hall of Fame</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            aria-label="Game Settings"
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-medium transition-all shadow"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Flat Control-Hint Line at Bottom */}
      <footer className="w-full text-center z-10 text-[11px] sm:text-xs text-slate-400 font-medium py-2">
        <span className="bg-slate-950/80 border border-amber-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow">
          <span className="text-amber-400 font-bold">CONTROLS:</span>
          <span>Click / Touch to Explore</span>
          <span className="text-slate-600">·</span>
          <span>Space / Enter Action</span>
          <span className="text-slate-600">·</span>
          <span>Esc Pause / Menu</span>
        </span>
      </footer>
    </div>
  );
};
