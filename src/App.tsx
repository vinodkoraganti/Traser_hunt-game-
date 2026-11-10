import React, { useState, useEffect, useCallback } from 'react';
import { GameState, InventoryItem, LeaderboardEntry, PlayerProfile, GameSettings } from './game/types.ts';
import {
  createInitialState,
  loadGameState,
  saveGameState,
  clearGameState,
  getLeaderboard,
  saveLeaderboardEntry,
} from './game/storage.ts';
import { GAME_LEVELS } from './game/levelsData.ts';
import { sound } from './game/audio.ts';
import { calculatePuzzleReward, calculateHintPenalty, evaluateAchievements } from './game/rules.ts';

// UI Components
import { StartScreen } from './components/StartScreen.tsx';
import { HUD } from './components/HUD.tsx';
import { AdventureMap } from './components/AdventureMap.tsx';
import { LevelView } from './components/LevelView.tsx';
import { TreasureChestModal } from './components/TreasureChestModal.tsx';
import { InventoryDrawer } from './components/InventoryDrawer.tsx';
import { VictoryScreen } from './components/VictoryScreen.tsx';
import { AIGuideDrawer } from './components/AIGuideDrawer.tsx';

// Modals
import { PlayerProfileModal } from './components/modals/PlayerProfileModal.tsx';
import { HowToPlayModal } from './components/modals/HowToPlayModal.tsx';
import { LeaderboardModal } from './components/modals/LeaderboardModal.tsx';
import { SettingsModal } from './components/modals/SettingsModal.tsx';
import { AchievementsModal } from './components/modals/AchievementsModal.tsx';
import { PauseMenuModal } from './components/modals/PauseMenuModal.tsx';

// Icons
import { Sparkles, Compass } from 'lucide-react';

export default function App() {
  // Load saved state or default
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = loadGameState();
    return saved || createInitialState();
  });

  // Screen flow: 'start' | 'playing' | 'map' | 'victory' | 'game_over'
  const [currentScreen, setCurrentScreen] = useState<'start' | 'playing' | 'map' | 'victory' | 'game_over'>('start');

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [pauseMenuOpen, setPauseMenuOpen] = useState(false);
  const [chestModalOpen, setChestModalOpen] = useState(false);
  const [aiGuideOpen, setAiGuideOpen] = useState(false);

  // Local Leaderboard entries
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() => getLeaderboard());

  // Check URL autostart param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setCurrentScreen('playing');
      }
    }
  }, []);

  // Sync audio controller setting on mount / update
  useEffect(() => {
    sound.setSoundEnabled(gameState.settings.soundEnabled);
  }, [gameState.settings.soundEnabled]);

  // Persist state to localStorage on modification
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Timer loop for timed challenge mode
  useEffect(() => {
    if (currentScreen !== 'playing' || pauseMenuOpen || !gameState.settings.timedMode) {
      return;
    }

    const timer = setInterval(() => {
      setGameState(prev => {
        const nextElapsed = prev.stats.timeElapsedSeconds + 1;
        const timeLimit = prev.settings.timeLimitSeconds;
        const isTimeUp = prev.settings.timedMode && nextElapsed >= timeLimit;

        if (isTimeUp) {
          sound.playError();
          setCurrentScreen('game_over');
          return {
            ...prev,
            stats: { ...prev.stats, timeElapsedSeconds: nextElapsed },
            isGameOver: true,
          };
        }

        return {
          ...prev,
          stats: { ...prev.stats, timeElapsedSeconds: nextElapsed },
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, pauseMenuOpen, gameState.settings.timedMode, gameState.settings.timeLimitSeconds]);

  // Handle global keyboard shortcuts (Esc pause/close, Space/Enter start)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (chestModalOpen) return;
        if (
          profileModalOpen ||
          howToPlayOpen ||
          leaderboardOpen ||
          settingsOpen ||
          achievementsOpen ||
          inventoryOpen ||
          aiGuideOpen
        ) {
          setProfileModalOpen(false);
          setHowToPlayOpen(false);
          setLeaderboardOpen(false);
          setSettingsOpen(false);
          setAchievementsOpen(false);
          setInventoryOpen(false);
          setAiGuideOpen(false);
          return;
        }

        if (currentScreen === 'playing') {
          setPauseMenuOpen(prev => !prev);
        }
      } else if ((e.key === ' ' || e.key === 'Enter') && currentScreen === 'start') {
        // Space or enter starts adventure from start screen if no modal open
        if (
          !profileModalOpen &&
          !howToPlayOpen &&
          !leaderboardOpen &&
          !settingsOpen
        ) {
          sound.playClick();
          setCurrentScreen('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentScreen,
    chestModalOpen,
    profileModalOpen,
    howToPlayOpen,
    leaderboardOpen,
    settingsOpen,
    achievementsOpen,
    inventoryOpen,
    aiGuideOpen,
  ]);

  // Audio Toggle
  const handleToggleSound = useCallback(() => {
    const next = !gameState.settings.soundEnabled;
    sound.setSoundEnabled(next);
    if (next) sound.playClick();
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: next },
    }));
  }, [gameState.settings.soundEnabled]);

  // Start New Game
  const handleStartNewGame = () => {
    const fresh = createInitialState(gameState.profile.name, gameState.profile.avatar);
    fresh.settings = { ...gameState.settings };
    setGameState(fresh);
    setCurrentScreen('playing');
  };

  // Continue Saved Game
  const handleContinueGame = () => {
    setCurrentScreen('playing');
  };

  // Puzzle Solved Callback
  const handleSolvePuzzle = (puzzleId: string, usedHints: boolean) => {
    setGameState(prev => {
      if (prev.solvedPuzzleIds.includes(puzzleId)) return prev;

      const currentLvl = GAME_LEVELS.find(l => l.id === prev.currentLevelId) || GAME_LEVELS[0];
      const pData = currentLvl.puzzles.find(p => p.id === puzzleId);
      const basePts = pData?.points || 100;
      const bonusPts = pData?.bonusNoHint || 50;

      const { pointsAwarded } = calculatePuzzleReward(basePts, bonusPts, usedHints ? 1 : 0);
      const nextSolved = [...prev.solvedPuzzleIds, puzzleId];
      const nextPerfect = prev.stats.perfectPuzzles + (usedHints ? 0 : 1);

      const nextStats = {
        ...prev.stats,
        score: prev.stats.score + pointsAwarded,
        puzzlesSolved: prev.stats.puzzlesSolved + 1,
        perfectPuzzles: nextPerfect,
      };

      // Check achievements
      const newlyUnlocked = evaluateAchievements(
        {
          stats: nextStats,
          unlockedLevelId: prev.unlockedLevelId,
          solvedPuzzleIds: nextSolved,
          collectedInventory: prev.collectedInventory,
          usedHintIds: prev.usedHintIds,
          isGameWon: false,
        },
        prev.unlockedAchievements
      );

      const nextState: GameState = {
        ...prev,
        solvedPuzzleIds: nextSolved,
        stats: nextStats,
        unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked],
      };

      // Check if all puzzles in current level are solved
      const allLvlSolved = currentLvl.puzzles.every(p => nextSolved.includes(p.id));
      if (allLvlSolved) {
        setTimeout(() => {
          setChestModalOpen(true);
        }, 600);
      }

      return nextState;
    });
  };

  // Use Hint Callback
  const handleUseHint = (hintId: string, penalty: number) => {
    setGameState(prev => {
      if (prev.usedHintIds.includes(hintId)) return prev;

      const pDeduction = calculateHintPenalty(penalty);
      return {
        ...prev,
        usedHintIds: [...prev.usedHintIds, hintId],
        stats: {
          ...prev.stats,
          hintsUsed: prev.stats.hintsUsed + 1,
          score: Math.max(0, prev.stats.score - pDeduction),
        },
      };
    });
  };

  // Trap Resolution (Level 3)
  const handleResolveTrap = (isSafe: boolean) => {
    setGameState(prev => {
      const bonus = isSafe ? 100 : 0;
      const nextStats = {
        ...prev.stats,
        trapsDisarmed: prev.stats.trapsDisarmed + (isSafe ? 1 : 0),
        score: prev.stats.score + bonus,
      };

      const newlyUnlocked = evaluateAchievements(
        {
          stats: nextStats,
          unlockedLevelId: prev.unlockedLevelId,
          solvedPuzzleIds: prev.solvedPuzzleIds,
          collectedInventory: prev.collectedInventory,
          usedHintIds: prev.usedHintIds,
          isGameWon: false,
        },
        prev.unlockedAchievements
      );

      return {
        ...prev,
        stats: nextStats,
        unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked],
      };
    });
  };

  // Claim Level Chest & Advance
  const handleClaimChest = (items: InventoryItem[], coins: number, points: number) => {
    setChestModalOpen(false);

    setGameState(prev => {
      const nextLevelId = prev.currentLevelId + 1;
      const nextUnlockedLevelId = Math.max(prev.unlockedLevelId, nextLevelId);
      const isWon = prev.currentLevelId === 5;

      const nextInventory = [...prev.collectedInventory, ...items];
      const nextStats = {
        ...prev.stats,
        coinsCollected: prev.stats.coinsCollected + coins,
        score: prev.stats.score + points,
      };

      const newlyUnlocked = evaluateAchievements(
        {
          stats: nextStats,
          unlockedLevelId: nextUnlockedLevelId,
          solvedPuzzleIds: prev.solvedPuzzleIds,
          collectedInventory: nextInventory,
          usedHintIds: prev.usedHintIds,
          isGameWon: isWon,
        },
        prev.unlockedAchievements
      );

      const finalState: GameState = {
        ...prev,
        currentLevelId: isWon ? prev.currentLevelId : nextLevelId,
        unlockedLevelId: nextUnlockedLevelId,
        collectedInventory: nextInventory,
        stats: nextStats,
        unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked],
        isGameWon: isWon,
      };

      // Record leaderboard entry if completed or advanced
      const entry: LeaderboardEntry = {
        id: `entry-${Date.now()}`,
        playerName: prev.profile.name,
        avatar: prev.profile.avatar,
        score: nextStats.score,
        levelReached: isWon ? 5 : nextLevelId,
        coins: nextStats.coinsCollected,
        timeTakenSeconds: nextStats.timeElapsedSeconds,
        date: new Date().toISOString().split('T')[0],
        mode: prev.settings.timedMode ? 'timed' : 'relaxed',
      };
      setLeaderboardEntries(saveLeaderboardEntry(entry));

      if (isWon) {
        setTimeout(() => {
          setCurrentScreen('victory');
        }, 400);
      }

      return finalState;
    });
  };

  // Travel to Level from Map
  const handleSelectLevelFromMap = (levelId: number) => {
    setGameState(prev => ({
      ...prev,
      currentLevelId: levelId,
    }));
    setCurrentScreen('playing');
  };

  // Reset progress from settings
  const handleResetProgress = () => {
    clearGameState();
    const fresh = createInitialState(gameState.profile.name, gameState.profile.avatar);
    setGameState(fresh);
    setCurrentScreen('start');
  };

  const currentLevel = GAME_LEVELS.find(l => l.id === gameState.currentLevelId) || GAME_LEVELS[0];
  const timeRemaining = gameState.settings.timedMode
    ? Math.max(0, gameState.settings.timeLimitSeconds - gameState.stats.timeElapsedSeconds)
    : null;

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans text-slate-100 select-none overflow-x-hidden">
      {/* 1. START SCREEN */}
      {currentScreen === 'start' && (
        <StartScreen
          savedState={gameState}
          onStartNew={handleStartNewGame}
          onContinue={handleContinueGame}
          onOpenProfile={() => setProfileModalOpen(true)}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
          onOpenLeaderboard={() => setLeaderboardOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          soundEnabled={gameState.settings.soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* 2. PLAYING VIEW */}
      {currentScreen === 'playing' && (
        <main className="relative min-h-screen w-full flex flex-col">
          {/* Top perimeter low-occlusion HUD */}
          <HUD
            state={gameState}
            onOpenMap={() => setCurrentScreen('map')}
            onOpenInventory={() => setInventoryOpen(true)}
            onOpenPause={() => setPauseMenuOpen(true)}
            onToggleSound={handleToggleSound}
            timeRemaining={timeRemaining}
          />

          {/* Core Interactive Level Scene */}
          <LevelView
            level={currentLevel}
            state={gameState}
            onSolvePuzzle={handleSolvePuzzle}
            onUseHint={handleUseHint}
            onResolveTrap={handleResolveTrap}
            onTriggerChest={() => setChestModalOpen(true)}
            onOpenMap={() => setCurrentScreen('map')}
          />

          {/* Floating AI Guide Action Button at Bottom Right */}
          <button
            onClick={() => {
              sound.playClick();
              setAiGuideOpen(true);
            }}
            aria-label="Open AI Expedition Guide"
            className="fixed bottom-4 right-4 z-30 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold px-3 py-2 rounded-2xl shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center gap-1.5 active:scale-95 transition-all text-xs border border-yellow-200"
          >
            <Compass className="w-4 h-4 text-stone-950" />
            <span className="hidden sm:inline">AI Guide & Journal</span>
          </button>
        </main>
      )}

      {/* 3. ADVENTURE MAP VIEW */}
      {currentScreen === 'map' && (
        <main className="relative min-h-screen w-full flex flex-col">
          <HUD
            state={gameState}
            onOpenMap={() => {}}
            onOpenInventory={() => setInventoryOpen(true)}
            onOpenPause={() => setPauseMenuOpen(true)}
            onToggleSound={handleToggleSound}
            timeRemaining={timeRemaining}
          />

          <AdventureMap
            state={gameState}
            onSelectLevel={handleSelectLevelFromMap}
            onClose={() => setCurrentScreen('playing')}
          />
        </main>
      )}

      {/* 4. VICTORY SCREEN */}
      {currentScreen === 'victory' && (
        <VictoryScreen
          state={gameState}
          onRestart={handleStartNewGame}
          onHome={() => setCurrentScreen('start')}
        />
      )}

      {/* 5. GAME OVER (TIMER EXPIRATION) */}
      {currentScreen === 'game_over' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-rose-600 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-[0_0_50px_rgba(225,29,72,0.5)]">
            <span className="text-6xl">⏳</span>
            <h2 className="text-3xl font-serif font-black text-rose-400">TIME EXPIRED!</h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Night falls over Isla Perdida, and the ancient ruins shift! You can restart the expedition or explore in relaxed mode.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleStartNewGame}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-bold py-3 px-6 rounded-xl text-sm shadow"
              >
                Restart Expedition
              </button>
              <button
                onClick={() => {
                  setGameState(prev => ({
                    ...prev,
                    settings: { ...prev.settings, timedMode: false },
                  }));
                  setCurrentScreen('playing');
                }}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold py-2.5 px-4 rounded-xl text-xs"
              >
                Switch to Relaxed Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* Level Treasure Chest Unlock Ceremony */}
      {chestModalOpen && (
        <TreasureChestModal
          level={currentLevel}
          onClaimAndProceed={handleClaimChest}
        />
      )}

      {/* Satchel / Inventory */}
      {inventoryOpen && (
        <InventoryDrawer
          inventory={gameState.collectedInventory}
          coins={gameState.stats.coinsCollected}
          onClose={() => setInventoryOpen(false)}
        />
      )}

      {/* Player Profile & Avatar Selector */}
      {profileModalOpen && (
        <PlayerProfileModal
          currentProfile={gameState.profile}
          onSaveProfile={prof => setGameState(prev => ({ ...prev, profile: prof }))}
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {/* How to Play Manual */}
      {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}

      {/* Local Leaderboard */}
      {leaderboardOpen && (
        <LeaderboardModal
          entries={leaderboardEntries}
          currentPlayerName={gameState.profile.name}
          onClose={() => setLeaderboardOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <SettingsModal
          settings={gameState.settings}
          onUpdateSettings={s => setGameState(prev => ({ ...prev, settings: s }))}
          onResetProgress={handleResetProgress}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Achievements Modal */}
      {achievementsOpen && (
        <AchievementsModal
          unlockedAchievementIds={gameState.unlockedAchievements}
          onClose={() => setAchievementsOpen(false)}
        />
      )}

      {/* Pause Menu Modal */}
      {pauseMenuOpen && (
        <PauseMenuModal
          onResume={() => setPauseMenuOpen(false)}
          onOpenMap={() => {
            setPauseMenuOpen(false);
            setCurrentScreen('map');
          }}
          onOpenInventory={() => {
            setPauseMenuOpen(false);
            setInventoryOpen(true);
          }}
          onOpenAchievements={() => {
            setPauseMenuOpen(false);
            setAchievementsOpen(true);
          }}
          onOpenHowToPlay={() => {
            setPauseMenuOpen(false);
            setHowToPlayOpen(true);
          }}
          onOpenSettings={() => {
            setPauseMenuOpen(false);
            setSettingsOpen(true);
          }}
          onExitToTitle={() => {
            setPauseMenuOpen(false);
            setCurrentScreen('start');
          }}
        />
      )}

      {/* AI Guide Drawer */}
      <AIGuideDrawer
        state={gameState}
        isOpen={aiGuideOpen}
        onClose={() => setAiGuideOpen(false)}
      />
    </div>
  );
}
