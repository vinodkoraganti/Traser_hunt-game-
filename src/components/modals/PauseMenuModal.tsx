import React from 'react';
import { sound } from '../../game/audio.ts';
import { Play, Map, Backpack, Award, HelpCircle, Settings, Home, X } from 'lucide-react';

interface PauseMenuModalProps {
  onResume: () => void;
  onOpenMap: () => void;
  onOpenInventory: () => void;
  onOpenAchievements: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onExitToTitle: () => void;
}

export const PauseMenuModal: React.FC<PauseMenuModalProps> = ({
  onResume,
  onOpenMap,
  onOpenInventory,
  onOpenAchievements,
  onOpenHowToPlay,
  onOpenSettings,
  onExitToTitle,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-sm bg-stone-900 border-2 border-amber-600/70 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col gap-3 text-stone-100 text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/40 pb-3">
          <h2 className="font-serif font-black text-xl text-amber-200 uppercase tracking-widest mx-auto">
            EXPEDITION PAUSED
          </h2>
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            aria-label="Resume Expedition"
            className="absolute top-5 right-5 text-stone-400 hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons List */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            aria-label="Resume Game"
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-stone-950 font-bold py-3 px-4 rounded-xl text-sm shadow transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Expedition</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            aria-label="View Map"
            className="w-full bg-stone-950/80 hover:bg-stone-850 border border-amber-700/40 text-stone-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Map className="w-4 h-4 text-amber-400" />
            <span>Chart / Island Map</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenInventory();
            }}
            aria-label="View Satchel"
            className="w-full bg-stone-950/80 hover:bg-stone-850 border border-amber-700/40 text-stone-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Backpack className="w-4 h-4 text-emerald-400" />
            <span>Explorer's Satchel</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenAchievements();
            }}
            aria-label="View Achievements"
            className="w-full bg-stone-950/80 hover:bg-stone-850 border border-amber-700/40 text-stone-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Award className="w-4 h-4 text-yellow-400" />
            <span>Achievements</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenHowToPlay();
            }}
            aria-label="How to Play"
            className="w-full bg-stone-950/80 hover:bg-stone-850 border border-amber-700/40 text-stone-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>How to Play</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            aria-label="Settings"
            className="w-full bg-stone-950/80 hover:bg-stone-850 border border-amber-700/40 text-stone-200 font-semibold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Settings className="w-4 h-4 text-stone-400" />
            <span>Settings & Audio</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExitToTitle();
            }}
            aria-label="Save and Exit to Title"
            className="w-full bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all mt-2"
          >
            <Home className="w-4 h-4" />
            <span>Save & Exit to Title</span>
          </button>
        </div>
      </div>
    </div>
  );
};
