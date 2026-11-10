import React from 'react';
import { LeaderboardEntry } from '../../game/types.ts';
import { EXPLORER_AVATARS } from '../../game/levelsData.ts';
import { sound } from '../../game/audio.ts';
import { X, Trophy, Medal, Info, Clock, Coins } from 'lucide-react';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  currentPlayerName?: string;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  currentPlayerName,
  onClose,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-stone-900 border-2 border-amber-600/70 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh] text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-700/50">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-200 uppercase tracking-wider">
              Local Hall of Fame
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close Leaderboard"
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local device storage notice (explicit requirement from prompt) */}
        <div className="px-6 py-2.5 bg-amber-950/30 border-b border-amber-700/20 flex items-center gap-2 text-[11px] text-amber-300/90">
          <Info className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Local Browser Leaderboard:</strong> Scores are tracked and saved locally in your browser storage.
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Explorer</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                  <th className="py-2.5 px-3 text-center">Sector</th>
                  <th className="py-2.5 px-3 text-right">Coins</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {entries.map((entry, idx) => {
                  const avatar = EXPLORER_AVATARS.find(a => a.id === entry.avatar) || EXPLORER_AVATARS[0];
                  const isCurrent = currentPlayerName && entry.playerName.toLowerCase() === currentPlayerName.toLowerCase();

                  return (
                    <tr
                      key={entry.id || idx}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-amber-950/50 text-amber-100 font-semibold'
                          : 'hover:bg-stone-850/50 text-stone-300'
                      }`}
                    >
                      {/* Rank badge */}
                      <td className="py-3 px-3 font-mono font-bold">
                        {idx === 0 ? (
                          <span className="inline-flex items-center gap-1 text-amber-400">
                            <Medal className="w-4 h-4" /> #1
                          </span>
                        ) : idx === 1 ? (
                          <span className="text-slate-300">#2</span>
                        ) : idx === 2 ? (
                          <span className="text-amber-600">#3</span>
                        ) : (
                          <span className="text-stone-500">#{idx + 1}</span>
                        )}
                      </td>

                      {/* Explorer info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{avatar.icon}</span>
                          <div>
                            <span className="font-bold text-amber-200 block truncate max-w-[120px] sm:max-w-none">
                              {entry.playerName}
                            </span>
                            <span className="text-[10px] text-stone-400 capitalize">
                              {entry.mode} Mode
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-3 text-right font-mono font-black text-amber-400 tabular-nums">
                        {entry.score}
                      </td>

                      {/* Level */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="bg-stone-800/80 px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400">
                          Lv.{entry.levelReached}
                        </span>
                      </td>

                      {/* Coins */}
                      <td className="py-3 px-3 text-right font-mono text-yellow-300 tabular-nums">
                        🪙 {entry.coins}
                      </td>

                      {/* Time */}
                      <td className="py-3 px-3 text-right font-mono text-stone-400 tabular-nums">
                        {formatTime(entry.timeTakenSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
