import React, { useState } from 'react';
import { ExplorerAvatar, PlayerProfile } from '../../game/types.ts';
import { EXPLORER_AVATARS } from '../../game/levelsData.ts';
import { sound } from '../../game/audio.ts';
import { X, Check, User } from 'lucide-react';

interface PlayerProfileModalProps {
  currentProfile: PlayerProfile;
  onSaveProfile: (profile: PlayerProfile) => void;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  currentProfile,
  onSaveProfile,
  onClose,
}) => {
  const [name, setName] = useState(currentProfile.name);
  const [avatar, setAvatar] = useState<ExplorerAvatar>(currentProfile.avatar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    onSaveProfile({
      name: name.trim() || 'Explorer Jack',
      avatar,
      createdAt: currentProfile.createdAt,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-600/70 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-4 text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/40 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-200 uppercase tracking-wider">
              Explorer Identity
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close Profile Dialog"
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <label className="text-xs font-semibold text-amber-300 block mb-1">
              Explorer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={24}
              required
              className="w-full bg-stone-950 border border-amber-700/60 rounded-xl px-4 py-2.5 text-sm text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Enter your explorer moniker..."
            />
          </div>

          {/* Avatar Archetypes Selector */}
          <div>
            <label className="text-xs font-semibold text-amber-300 block mb-1.5">
              Select Explorer Archetype
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EXPLORER_AVATARS.map(av => {
                const isSelected = avatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setAvatar(av.id);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                      isSelected
                        ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                        : 'bg-stone-950/80 hover:bg-stone-850 border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{av.icon}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <span className="text-xs font-bold text-amber-200 mt-1 truncate">{av.name}</span>
                    <span className="text-[10px] text-stone-400 truncate">{av.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-label="Save Explorer Profile"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-stone-950 font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Explorer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
