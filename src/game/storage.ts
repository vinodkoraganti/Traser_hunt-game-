import { GameState, LeaderboardEntry, GameSettings, PlayerProfile, ExplorerAvatar } from './types.ts';
import { INITIAL_ACHIEVEMENTS } from './achievementsData.ts';

const SAVE_KEY = 'treasure_quest_save_v1';
const LEADERBOARD_KEY = 'treasure_quest_leaderboard_v1';
const SETTINGS_KEY = 'treasure_quest_settings_v1';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  timedMode: false,
  timeLimitSeconds: 600,
  difficulty: 'normal',
};

export function createInitialState(name: string = 'Explorer Jack', avatar: ExplorerAvatar = 'pathfinder'): GameState {
  return {
    profile: {
      name: name.trim() || 'Explorer Jack',
      avatar,
      createdAt: Date.now(),
    },
    settings: { ...DEFAULT_SETTINGS },
    stats: {
      puzzlesSolved: 0,
      hintsUsed: 0,
      coinsCollected: 0,
      score: 0,
      timeElapsedSeconds: 0,
      trapsDisarmed: 0,
      perfectPuzzles: 0,
    },
    currentLevelId: 1,
    unlockedLevelId: 1,
    solvedPuzzleIds: [],
    usedHintIds: [],
    collectedInventory: [],
    unlockedAchievements: [],
    levelCompletionTimes: {},
    isGameOver: false,
    isGameWon: false,
    gameStartedAt: Date.now(),
    paused: false,
  };
}

export function saveGameState(state: GameState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    console.error('Failed to save game state to localStorage', err);
  }
}

export function loadGameState(): GameState | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    return parsed;
  } catch (err) {
    console.error('Failed to parse saved game state', err);
    return null;
  }
}

export function clearGameState(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(SAVE_KEY);
    }
  } catch (err) {
    console.error('Failed to clear game state', err);
  }
}

export const SEED_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    playerName: 'Captain Morgan',
    avatar: 'sea_captain',
    score: 2850,
    levelReached: 5,
    coins: 1750,
    timeTakenSeconds: 380,
    date: '2026-10-25',
    mode: 'timed',
  },
  {
    id: 'seed-2',
    playerName: 'Lady Indiana',
    avatar: 'archaeologist',
    score: 2420,
    levelReached: 5,
    coins: 1600,
    timeTakenSeconds: 510,
    date: '2026-10-26',
    mode: 'relaxed',
  },
  {
    id: 'seed-3',
    playerName: 'Sir Arthur',
    avatar: 'cryptographer',
    score: 1980,
    levelReached: 4,
    coins: 900,
    timeTakenSeconds: 620,
    date: '2026-10-24',
    mode: 'timed',
  },
  {
    id: 'seed-4',
    playerName: 'Elena Mapmaker',
    avatar: 'cartographer',
    score: 1540,
    levelReached: 3,
    coins: 550,
    timeTakenSeconds: 430,
    date: '2026-10-26',
    mode: 'relaxed',
  },
];

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return SEED_LEADERBOARD;
    const raw = window.localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) {
      window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(SEED_LEADERBOARD));
      return SEED_LEADERBOARD;
    }
    const list = JSON.parse(raw) as LeaderboardEntry[];
    return list.sort((a, b) => b.score - a.score);
  } catch (err) {
    return SEED_LEADERBOARD;
  }
}

export function saveLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  try {
    const current = getLeaderboard();
    const updated = [entry, ...current.filter(e => e.id !== entry.id)]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15); // keep top 15 entries
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch (err) {
    console.error('Failed to save leaderboard entry', err);
    return getLeaderboard();
  }
}
