import React, { useState } from 'react';
import { InventoryItem } from '../game/types.ts';
import { sound } from '../game/audio.ts';
import { X, Backpack, Sparkles, Map, Key, Gem, Scroll } from 'lucide-react';

interface InventoryDrawerProps {
  inventory: InventoryItem[];
  coins: number;
  onClose: () => void;
}

export const InventoryDrawer: React.FC<InventoryDrawerProps> = ({
  inventory,
  coins,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(inventory[0] || null);

  const mapPieces = inventory.filter(i => i.category === 'map_piece');
  const keys = inventory.filter(i => i.category === 'key');
  const gemsAndRelics = inventory.filter(i => i.category === 'gem' || i.category === 'artifact');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#1c1815] border-2 border-amber-600/70 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-700/50">
          <div className="flex items-center gap-2.5">
            <Backpack className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg sm:text-xl text-amber-200 tracking-wider uppercase">
              Explorer’s Field Satchel
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-stone-950/80 border border-amber-500/40 rounded-xl px-3 py-1 font-mono font-bold text-amber-400 text-sm">
              <span>🪙</span>
              <span>{coins} Coins</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Close Satchel"
              className="text-amber-400 hover:text-amber-200 p-1 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Satchel Contents Grid + Lore Inspector */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
          {/* Left: Assembled Ancient Map Section & Category Trays */}
          <div className="flex-1 flex flex-col gap-5">
            {/* The 4-Piece Assembling Map */}
            <div className="bg-[#15110d] border border-amber-800/60 rounded-2xl p-4 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold font-serif text-amber-300 uppercase tracking-wider">
                  <Map className="w-4 h-4 text-amber-400" />
                  <span>The Grand Island Chart ({mapPieces.length} / 4 Fragments)</span>
                </div>
                {mapPieces.length === 4 && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Map Complete!
                  </span>
                )}
              </div>

              {/* 2x2 Grid of Map Pieces that combine */}
              <div className="grid grid-cols-2 gap-1.5 w-full max-w-[280px] mx-auto p-1.5 bg-[#2a1e14] border-2 border-dashed border-amber-700/50 rounded-xl">
                {[1, 2, 3, 4].map(quadrant => {
                  const piece = mapPieces.find(p => p.id === `map_piece_${quadrant}`);
                  return (
                    <div
                      key={quadrant}
                      onClick={() => {
                        if (piece) {
                          sound.playClick();
                          setSelectedItem(piece);
                        }
                      }}
                      className={`h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center transition-all ${
                        piece
                          ? 'bg-[#3b2a1a] border border-amber-500/70 cursor-pointer hover:bg-[#4a3520] shadow'
                          : 'bg-stone-950/60 border border-stone-800 text-stone-600'
                      }`}
                    >
                      {piece ? (
                        <>
                          <span className="text-2xl">📜</span>
                          <span className="text-[10px] font-bold text-amber-200 mt-1">
                            Fragment {quadrant}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] italic">Fragment {quadrant} Missing</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keys & Seals */}
            <div className="bg-[#15110d] border border-amber-800/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold font-serif text-amber-300 uppercase tracking-wider mb-2.5">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Ancient Keys & Sockets ({keys.length})</span>
              </div>
              {keys.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {keys.map(keyItem => (
                    <button
                      key={keyItem.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedItem(keyItem);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        selectedItem?.id === keyItem.id
                          ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-stone-900/80 hover:bg-stone-850 border-amber-800/40'
                      }`}
                    >
                      <span className="text-2xl">{keyItem.icon}</span>
                      <span className="text-xs font-bold text-amber-200 truncate">{keyItem.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">No ancient keys discovered yet.</p>
              )}
            </div>

            {/* Gems & Artifacts */}
            <div className="bg-[#15110d] border border-amber-800/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold font-serif text-amber-300 uppercase tracking-wider mb-2.5">
                <Gem className="w-4 h-4 text-amber-400" />
                <span>Gems & Relics ({gemsAndRelics.length})</span>
              </div>
              {gemsAndRelics.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {gemsAndRelics.map(artifact => (
                    <button
                      key={artifact.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedItem(artifact);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        selectedItem?.id === artifact.id
                          ? 'bg-amber-950/90 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-stone-900/80 hover:bg-stone-850 border-amber-800/40'
                      }`}
                    >
                      <span className="text-2xl">{artifact.icon}</span>
                      <span className="text-xs font-bold text-amber-200 truncate">{artifact.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">No special artifacts collected yet.</p>
              )}
            </div>
          </div>

          {/* Right: Item Lore & Inspection Pane */}
          <div className="w-full md:w-80 bg-[#16120e] border border-amber-700/50 rounded-2xl p-5 flex flex-col items-center text-center">
            {selectedItem ? (
              <div className="w-full flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-stone-900 border-2 border-amber-500/60 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                  {selectedItem.icon}
                </div>
                <div className="border-b border-amber-700/40 pb-2 w-full">
                  <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                    Recovered at Level {selectedItem.obtainedAtLevel}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-amber-200 mt-0.5">
                    {selectedItem.name}
                  </h3>
                </div>
                <div className="text-left w-full space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Description:
                    </span>
                    <p className="text-xs text-stone-200 mt-0.5">{selectedItem.description}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      Ancient Lore:
                    </span>
                    <p className="text-xs font-serif italic text-amber-100/90 mt-0.5 bg-stone-950/60 p-3 rounded-xl border border-amber-900/40">
                      "{selectedItem.lore}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-auto text-stone-500 text-xs italic">
                Select any item from your satchel to examine its ancient inscriptions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
