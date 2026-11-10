import React, { useState } from 'react';
import { GameSettings } from '../../game/types.ts';
import { sound } from '../../game/audio.ts';
import { X, Settings, Volume2, VolumeX, Clock, AlertTriangle, RotateCcw, Check } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    sound.setSoundEnabled(next);
    if (next) sound.playClick();
    onUpdateSettings({ ...settings, soundEnabled: next });
  };

  const toggleTimedMode = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, timedMode: !settings.timedMode });
  };

  const handleDifficultyChange = (diff: 'easy' | 'normal' | 'hard') => {
    sound.playClick();
    onUpdateSettings({ ...settings, difficulty: diff });
  };

  const handleConfirmReset = () => {
    sound.playClick();
    onResetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-600/70 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-700/50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-200 uppercase tracking-wider">
              Game Settings
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close Settings"
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Sound Audio Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950/80 border border-stone-800 rounded-2xl">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-stone-500" />
              )}
              <div>
                <span className="font-bold text-amber-200 block">Synthesized Audio Effects</span>
                <span className="text-[11px] text-stone-400">
                  Interactive clicks, coin chimes, and puzzle fanfares
                </span>
              </div>
            </div>
            <button
              onClick={toggleSound}
              aria-label="Toggle Sound"
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Timed Challenge Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-stone-950/80 border border-stone-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-amber-200 block">Expedition Timer Mode</span>
                <span className="text-[11px] text-stone-400">
                  {settings.timedMode
                    ? '10-minute countdown challenge with speed bonuses'
                    : 'Relaxed mode without time constraints'}
                </span>
              </div>
            </div>
            <button
              onClick={toggleTimedMode}
              aria-label="Toggle Timed Mode"
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.timedMode ? 'bg-amber-500' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  settings.timedMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Difficulty Setting */}
          <div className="flex flex-col gap-2 p-3.5 bg-stone-950/80 border border-stone-800 rounded-2xl">
            <span className="font-bold text-amber-200 text-xs">Pacing & Challenge Level:</span>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'normal', 'hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`py-2 px-3 rounded-xl border font-bold capitalize text-xs transition-all ${
                    settings.difficulty === diff
                      ? 'bg-amber-500 text-stone-950 border-yellow-200 shadow'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Game Progress Section */}
          <div className="pt-2 border-t border-stone-800">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-4 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-900/60 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Saved Adventure Progress</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-600/70 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Are you sure? All scores, levels, and inventory will be wiped!</span>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-stone-300 hover:bg-stone-800 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-stone-950 font-bold text-xs"
                  >
                    Confirm Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
