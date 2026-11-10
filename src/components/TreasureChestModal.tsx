import React, { useState } from 'react';
import { InventoryItem, LevelDefinition } from '../game/types.ts';
import { sound } from '../game/audio.ts';
import { Sparkles, ArrowRight, Coins, Award } from 'lucide-react';

interface TreasureChestModalProps {
  level: LevelDefinition;
  onClaimAndProceed: (items: InventoryItem[], coins: number, points: number) => void;
}

export const TreasureChestModal: React.FC<TreasureChestModalProps> = ({
  level,
  onClaimAndProceed,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenChest = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    sound.playUnlock();

    setTimeout(() => {
      sound.playChestOpen();
      sound.playCoin();
      setIsOpen(true);
      setIsOpening(false);
    }, 700);
  };

  const handleClaim = () => {
    sound.playClick();
    onClaimAndProceed(
      level.chestReward.items,
      level.chestReward.coins,
      level.chestReward.completionPoints
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(250,204,21,0.4)] flex flex-col items-center text-center text-stone-100">
        {/* Glow Halo */}
        <div className="absolute top-1/4 -translate-y-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Level {level.id} Completed!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-200">
          The Vault of {level.title} Opens!
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-md mt-1">
          Your keen intellect has conquered the ancient safeguards. Claim your rewards!
        </p>

        {/* Interactive Chest Graphic */}
        <div
          onClick={handleOpenChest}
          className={`relative my-6 cursor-pointer group transition-transform duration-300 ${
            !isOpen ? 'hover:scale-105 active:scale-95' : 'scale-105'
          }`}
        >
          {/* Animated Chest SVG */}
          <svg className="w-44 h-44 sm:w-56 sm:h-56 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]" viewBox="0 0 200 180" fill="none">
            {/* Chest base */}
            <path d="M25 80 L175 80 L160 160 L40 160 Z" fill="#451a03" stroke="#b45309" strokeWidth="4" />
            <path d="M35 90 L165 90 L152 150 L48 150 Z" fill="#78350f" />
            {/* Iron Bands */}
            <rect x="55" y="80" width="14" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="131" y="80" width="14" height="80" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />

            {/* Glowing Interior If Open */}
            {isOpen && (
              <>
                <ellipse cx="100" cy="80" rx="60" ry="20" fill="#fbbf24" opacity="0.9" filter="blur(4px)" />
                {/* Floating gold coin sparkles */}
                <circle cx="85" cy="65" r="5" fill="#fef08a" />
                <circle cx="115" cy="70" r="4.5" fill="#fef08a" />
                <circle cx="100" cy="55" r="6" fill="#fef08a" />
              </>
            )}

            {/* Chest Lid - Closed or Raised Open */}
            {!isOpen ? (
              <g className={isOpening ? 'animate-bounce' : ''}>
                <path d="M20 80 Q100 25 180 80 Z" fill="#92400e" stroke="#d97706" strokeWidth="4" />
                <path d="M25 76 Q100 32 175 76 Z" fill="#b45309" />
                {/* Keyhole */}
                <rect x="90" y="75" width="20" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="100" cy="83" r="3.5" fill="#f59e0b" />
                <path d="M98 86 L102 86 L103 93 L97 93 Z" fill="#f59e0b" />
              </g>
            ) : (
              /* Lid swung up in 3D perspective */
              <g>
                <path d="M20 40 Q100 -10 180 40 L175 75 Q100 25 25 75 Z" fill="#78350f" stroke="#d97706" strokeWidth="3" />
                <path d="M25 42 Q100 -5 175 42 L170 70 Q100 28 30 70 Z" fill="#92400e" />
              </g>
            )}
          </svg>

          {!isOpen && (
            <div className="absolute inset-x-0 -bottom-2 flex items-center justify-center">
              <span className="bg-amber-500 text-stone-950 font-black text-xs px-4 py-1.5 rounded-full shadow-lg animate-pulse uppercase tracking-wider">
                Click to Open Chest
              </span>
            </div>
          )}
        </div>

        {/* Rewards Display After Opening */}
        {isOpen && (
          <div className="w-full flex flex-col gap-4 animate-fadeIn">
            {/* Points & Coins readouts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-900/90 border border-amber-500/40 p-3 rounded-2xl flex items-center justify-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <span className="text-[10px] uppercase text-stone-400 block font-bold">Coins Found</span>
                  <span className="font-mono text-base font-extrabold text-amber-300">
                    +{level.chestReward.coins}
                  </span>
                </div>
              </div>

              <div className="bg-stone-900/90 border border-amber-500/40 p-3 rounded-2xl flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <span className="text-[10px] uppercase text-stone-400 block font-bold">Level Bonus</span>
                  <span className="font-mono text-base font-extrabold text-yellow-300">
                    +{level.chestReward.completionPoints} PTS
                  </span>
                </div>
              </div>
            </div>

            {/* Collected Artifacts Cards */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                New Relics Added to Satchel:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {level.chestReward.items.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#241c14] border border-amber-600/50 rounded-xl p-3 flex items-center gap-3 text-left shadow"
                  >
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-amber-200 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-300 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleClaim}
              aria-label="Claim Rewards and Advance"
              className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black py-3.5 px-6 rounded-2xl text-base shadow-[0_0_25px_rgba(250,204,21,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{level.id === 5 ? 'Behold The Final Treasure!' : 'Claim & Chart Next Course'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
