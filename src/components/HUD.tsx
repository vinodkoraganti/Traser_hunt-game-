import React from 'react';
import { GameState } from '../game/types.ts';
import { EXPLORER_AVATARS, GAME_LEVELS } from '../game/levelsData.ts';
import { calculateCompletionPercentage } from '../game/rules.ts';
import { Volume2, VolumeX, Backpack, Map as MapIcon, Pause, Clock } from 'lucide-react';
import { sound } from '../game/audio.ts';

interface HUDProps {
  state: GameState;
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenPause: () => void;
  onToggleSound: () => void;
  timeRemaining?: number | null;
}

export const HUD: React.FC<HUDProps> = ({
  state,
  onOpenMap,
  onOpenInventory,
  onOpenPause,
  onToggleSound,
  timeRemaining,
}) => {
  const currentLevel = GAME_LEVELS.find(l => l.id === state.currentLevelId) || GAME_LEVELS[0];
  const avatar = EXPLORER_AVATARS.find(a => a.id === state.profile.avatar) || EXPLORER_AVATARS[0];
  const completion = calculateCompletionPercentage(
    state.solvedPuzzleIds.length,
    10,
    state.collectedInventory.length,
    9
  );

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none p-2 sm:p-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left cluster: Profile & Level status */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-lg shadow-black/40">
          <div className="text-2xl sm:text-3xl filter drop-shadow">{avatar.icon}</div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-amber-300 tracking-wide uppercase truncate max-w-[100px] sm:max-w-[140px]">
              {state.profile.name}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Lv.{currentLevel.id}: {currentLevel.title}</span>
            </div>
          </div>
        </div>

        {/* Center: Quest Progress Bar & Timer */}
        <div className="pointer-events-auto hidden md:flex flex-col items-center gap-1 bg-slate-900/85 border border-amber-500/30 rounded-xl px-4 py-1.5 shadow-lg">
          <div className="flex items-center justify-between w-48 text-[11px] font-medium text-slate-300">
            <span>ISLAND PROGRESS</span>
            <span className="font-mono text-amber-400">{completion}%</span>
          </div>
          <div className="w-48 h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-500/20">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)]"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Right cluster: Coins, Score & Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Optional Timer indicator */}
          {state.settings.timedMode && timeRemaining !== undefined && timeRemaining !== null && (
            <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-mono text-xs font-bold shadow-md ${
              timeRemaining < 60 
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-bounce' 
                : 'bg-slate-900/90 border-amber-500/40 text-amber-300'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          )}

          {/* Coins Readout */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-amber-400 font-bold text-xs sm:text-sm shadow-md">
            <span className="text-base sm:text-lg animate-[spin_6s_linear_infinite]">🪙</span>
            <span className="font-mono tabular-nums">{state.stats.coinsCollected}</span>
          </div>

          {/* Score Readout */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-amber-500/40 rounded-xl px-2.5 py-1.5 text-yellow-300 font-bold text-xs shadow-md">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">PTS:</span>
            <span className="font-mono tabular-nums text-amber-300">{state.stats.score}</span>
          </div>

          {/* Map Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            aria-label="Open Island Map"
            title="Open Island Map"
            className="flex items-center gap-1 bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-500/50 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-md active:scale-95 transition-transform"
          >
            <MapIcon className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Map</span>
          </button>

          {/* Inventory Satchel Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenInventory();
            }}
            aria-label="Open Satchel Inventory"
            title="Open Satchel Inventory"
            className="relative flex items-center gap-1 bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/50 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-md active:scale-95 transition-transform"
          >
            <Backpack className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Satchel</span>
            {state.collectedInventory.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-900 shadow">
                {state.collectedInventory.length}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={state.settings.soundEnabled ? 'Mute Game Sound' : 'Unmute Game Sound'}
            title={state.settings.soundEnabled ? 'Sound On' : 'Sound Off'}
            className="bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-500/40 rounded-xl p-2 shadow-md active:scale-95 transition-transform"
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Pause / Menu Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPause();
            }}
            aria-label="Pause Game Menu"
            title="Menu & Settings"
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-amber-500/40 rounded-xl p-2 shadow-md active:scale-95 transition-transform"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
