import React from 'react';
import { INITIAL_ACHIEVEMENTS } from '../../game/achievementsData.ts';
import { sound } from '../../game/audio.ts';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsModalProps {
  unlockedAchievementIds: string[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedAchievementIds,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/70 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh] text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-700/50">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-200 uppercase tracking-wider">
              Expedition Achievements ({unlockedAchievementIds.length} / {INITIAL_ACHIEVEMENTS.length})
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close Achievements"
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of achievements */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5">
          {INITIAL_ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedAchievementIds.includes(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_15px_rgba(250,204,21,0.15)] text-stone-100'
                    : 'bg-stone-950/60 border-stone-850 opacity-55 text-stone-400'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-900/60 border-amber-400 text-amber-300'
                      : 'bg-stone-900 border-stone-750 text-stone-500'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-amber-200 truncate">{ach.title}</h3>
                    {isUnlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">{ach.description}</p>
                  <p className="text-[10px] font-mono text-amber-500/90 mt-1">
                    Requirement: {ach.conditionDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
