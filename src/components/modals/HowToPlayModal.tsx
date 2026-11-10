import React from 'react';
import { sound } from '../../game/audio.ts';
import { X, HelpCircle, Compass, Puzzle, Award, Backpack, ShieldCheck } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-600/70 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh] text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-700/50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-200 uppercase tracking-wider">
              Explorer’s Field Manual
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close Manual"
            className="text-stone-400 hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Section 1 */}
          <div className="bg-[#1b1510] border border-amber-800/40 rounded-2xl p-4 flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-300 font-serif text-sm">
                1. Explore 5 Island Sectors
              </h3>
              <p className="text-stone-300 mt-0.5 leading-relaxed">
                Journey from the <strong className="text-emerald-400">Jungle Entrance</strong> through the <strong className="text-amber-400">Ancient Sun Temple</strong>, <strong className="text-cyan-400">Pirate Cave</strong>, and <strong className="text-yellow-400">Forgotten Desert</strong> to reach the final <strong className="text-purple-400">Heart of the Lost Island</strong>.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-[#1b1510] border border-amber-800/40 rounded-2xl p-4 flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-300 font-serif text-sm">
                2. Solve Diverse Puzzles
              </h3>
              <p className="text-stone-300 mt-0.5 leading-relaxed">
                Test your wits with ancient stone riddles, interactively locate camouflaged artifacts in scenes, align elemental crests on cardinal altars, rotate brass tumblers to crack pirate lock combinations, and deduce celestial sequences.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-[#1b1510] border border-amber-800/40 rounded-2xl p-4 flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
              <Backpack className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-300 font-serif text-sm">
                3. Gather Map Fragments & Ancient Keys
              </h3>
              <p className="text-stone-300 mt-0.5 leading-relaxed">
                Each completed sector rewards you with gold coins and key artifacts stored in your Satchel. Piece together all 4 torn parchment fragments to reveal the legendary vault chamber!
              </p>
            </div>
          </div>

          {/* Section 4: Scoring */}
          <div className="bg-[#1b1510] border border-amber-800/40 rounded-2xl p-4 flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-300 font-serif text-sm">
                4. Scoring & Rewards
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-stone-300">
                <div className="bg-stone-950/70 p-2 rounded-lg border border-stone-800">
                  <span className="text-emerald-400 font-bold">+100 to +250 PTS:</span> Solved Puzzle
                </div>
                <div className="bg-stone-950/70 p-2 rounded-lg border border-stone-800">
                  <span className="text-yellow-400 font-bold">+250 to +500 PTS:</span> Cleared Sector Chest
                </div>
                <div className="bg-stone-950/70 p-2 rounded-lg border border-stone-800">
                  <span className="text-amber-300 font-bold">+50 PTS:</span> Intuition (No Hints Used)
                </div>
                <div className="bg-stone-950/70 p-2 rounded-lg border border-stone-800">
                  <span className="text-rose-400 font-bold">-20 PTS:</span> Clue Request Penalty
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="I Understand"
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow active:scale-95 transition-all"
          >
            I am Ready to Explore!
          </button>
        </div>
      </div>
    </div>
  );
};
