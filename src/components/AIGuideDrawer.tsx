import React, { useState } from 'react';
import { GameState } from '../game/types.ts';
import { GAME_LEVELS } from '../game/levelsData.ts';
import { sound } from '../game/audio.ts';
import { Sparkles, BookOpen, MessageSquare, Send, X, Compass } from 'lucide-react';

interface AIGuideDrawerProps {
  state: GameState;
  isOpen: boolean;
  onClose: () => void;
}

interface GuideMessage {
  id: string;
  sender: 'guide' | 'explorer';
  text: string;
}

export const AIGuideDrawer: React.FC<AIGuideDrawerProps> = ({ state, isOpen, onClose }) => {
  const currentLevel = GAME_LEVELS.find(l => l.id === state.currentLevelId) || GAME_LEVELS[0];

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<GuideMessage[]>([
    {
      id: 'init',
      sender: 'guide',
      text: `Greetings, ${state.profile.name}! I am your Expedition Journal & AI Guide. You are currently in Sector ${currentLevel.id}: ${currentLevel.title}. How may I illuminate your path?`,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    sound.playClick();
    const query = inputQuery.trim();
    const newMsg: GuideMessage = {
      id: `usr-${Date.now()}`,
      sender: 'explorer',
      text: query,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputQuery('');

    // Contextual expert AI explorer advice based on sector & questions
    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('hint') || lower.includes('help') || lower.includes('stuck')) {
        if (currentLevel.id === 1) {
          reply = 'In the Jungle Entrance, search the tall ferns on the left and banyan branches on the right for hidden relics. For the guardian riddle: think of an essential explorer tool drawn on parchment with rivers, but no real water!';
        } else if (currentLevel.id === 2) {
          reply = 'In the Sun Temple, align the elemental altars by cardinal compass points. Fire awakens with the rising sun in the East; water cools in the West; earth is the bedrock South; air chills the high northern peaks!';
        } else if (currentLevel.id === 3) {
          reply = 'In the Pirate Grotto, inspect the captain’s log carefully: 3 sails, 7 serpents, 4 anchors. If you encounter the tripwire, remember the buccaneer code: always trust the Sea (Anchor lever)!';
        } else if (currentLevel.id === 4) {
          reply = 'In the Ash Desert, watch how the sequence doubles each step and adds 1 (3 -> 7 -> 15 -> 31 -> 63). For the sundial equation, remember 14 + 18 is 32, so dial 3 must equal 10 to sum to 42.';
        } else {
          reply = 'At the Vault of Montezuma, unscramble W-I-S-D-O-M, and insert your 3 keys in the order you found them (1-2-3)!';
        }
      } else if (lower.includes('chest') || lower.includes('treasure') || lower.includes('reward')) {
        reply = 'Each sector hides an ancient vault chest unlocked once all objectives are solved. Claiming it yields golden coins, exploration points, and key relics for your satchel!';
      } else if (lower.includes('who are you') || lower.includes('guide')) {
        reply = 'I am the animated spirit of the Isla Perdida Cartographers, here to record your chronicle and offer wisdom when requested!';
      } else {
        reply = `A keen question! In ${currentLevel.title}, ancient builders prized observation and logic. Review the inscribed clues in your surroundings, and your instinct will guide you through.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'guide',
          text: reply,
        },
      ]);
      sound.playSolve();
    }, 400);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-stone-900 border-l-2 border-amber-600/70 shadow-2xl flex flex-col text-stone-100 select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-700/50">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-serif font-bold text-sm text-amber-200 uppercase tracking-wider">
              Expedition AI Guide
            </h3>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Attuned to Sector {currentLevel.id}</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close Guide"
          className="text-stone-400 hover:text-stone-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'guide' ? 'items-start' : 'items-end'}`}
          >
            <span className="text-[10px] font-mono text-stone-400 mb-1">
              {m.sender === 'guide' ? 'AI Guide' : state.profile.name}
            </span>
            <div
              className={`p-3 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                m.sender === 'guide'
                  ? 'bg-[#241c14] border border-amber-700/50 text-amber-100'
                  : 'bg-amber-600 text-stone-950 font-medium'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSend} className="p-3 bg-stone-950 border-t border-amber-800/40 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder={`Ask about ${currentLevel.title}...`}
          className="flex-1 bg-stone-900 border border-amber-700/50 rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
        />
        <button
          type="submit"
          aria-label="Ask Question"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold p-2 rounded-xl transition-all active:scale-95 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
