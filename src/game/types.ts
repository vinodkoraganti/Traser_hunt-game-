export type ExplorerAvatar = 
  | 'pathfinder' 
  | 'cartographer' 
  | 'cryptographer' 
  | 'archaeologist' 
  | 'sea_captain' 
  | 'mystic';

export interface AvatarInfo {
  id: ExplorerAvatar;
  name: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export type PuzzleType = 
  | 'riddle' 
  | 'number' 
  | 'logic' 
  | 'hidden_object' 
  | 'treasure_code' 
  | 'sequence';

export interface HintItem {
  id: string;
  text: string;
  penalty: number;
}

export interface BasePuzzle {
  id: string;
  title: string;
  type: PuzzleType;
  instructions: string;
  loreText: string;
  points: number;
  bonusNoHint: number;
  hints: HintItem[];
}

export interface RiddlePuzzleData extends BasePuzzle {
  type: 'riddle';
  riddle: string;
  acceptedAnswers: string[];
}

export interface NumberPuzzleData extends BasePuzzle {
  type: 'number';
  question: string;
  equationDescription: string;
  targetNumber: number;
  options?: number[];
  matrixClues?: string[];
}

export interface LogicPuzzleData extends BasePuzzle {
  type: 'logic';
  scenario: string;
  clues: string[];
  slots: { id: string; label: string; correctItem: string }[];
  availableItems: { id: string; name: string; symbol: string }[];
}

export interface HiddenObjectTarget {
  id: string;
  name: string;
  hint: string;
  xPercent: number; // 0-100% position on scene
  yPercent: number;
  radiusPercent: number;
  svgIcon: string;
}

export interface HiddenObjectPuzzleData extends BasePuzzle {
  type: 'hidden_object';
  sceneTheme: 'jungle' | 'cave' | 'temple' | 'desert';
  itemsToFind: HiddenObjectTarget[];
}

export interface TreasureCodePuzzleData extends BasePuzzle {
  type: 'treasure_code';
  codeLength: number;
  correctCode: string; // e.g. "374"
  riddleClues: string[];
  digitsRange: [number, number]; // [0, 9]
}

export interface SequencePuzzleData extends BasePuzzle {
  type: 'sequence';
  sequence: (string | number)[];
  missingIndex: number;
  correctAnswer: string | number;
  options: (string | number)[];
  explanation: string;
}

export type PuzzleData = 
  | RiddlePuzzleData 
  | NumberPuzzleData 
  | LogicPuzzleData 
  | HiddenObjectPuzzleData 
  | TreasureCodePuzzleData 
  | SequencePuzzleData;

export interface InventoryItem {
  id: string;
  name: string;
  category: 'key' | 'map_piece' | 'gem' | 'artifact' | 'parchment';
  description: string;
  lore: string;
  icon: string;
  obtainedAtLevel: number;
}

export interface LevelTrap {
  id: string;
  name: string;
  description: string;
  challenge: {
    question: string;
    options: { text: string; isSafe: boolean; feedback: string }[];
  };
}

export interface LevelDefinition {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  locationName: string;
  themeColor: string;
  ambientDescription: string;
  loreStory: string;
  puzzles: PuzzleData[];
  trap?: LevelTrap;
  chestReward: {
    coins: number;
    completionPoints: number;
    items: InventoryItem[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  conditionDescription: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  avatar: ExplorerAvatar;
  score: number;
  levelReached: number;
  coins: number;
  timeTakenSeconds: number;
  date: string;
  mode: 'timed' | 'relaxed';
}

export interface PlayerProfile {
  name: string;
  avatar: ExplorerAvatar;
  createdAt: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  timedMode: boolean;
  timeLimitSeconds: number; // default 600 (10 mins)
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface GameStats {
  puzzlesSolved: number;
  hintsUsed: number;
  coinsCollected: number;
  score: number;
  timeElapsedSeconds: number;
  trapsDisarmed: number;
  perfectPuzzles: number;
}

export interface GameState {
  profile: PlayerProfile;
  settings: GameSettings;
  stats: GameStats;
  currentLevelId: number;
  unlockedLevelId: number;
  solvedPuzzleIds: string[];
  usedHintIds: string[];
  collectedInventory: InventoryItem[];
  unlockedAchievements: string[];
  levelCompletionTimes: Record<number, number>;
  isGameOver: boolean;
  isGameWon: boolean;
  gameStartedAt: number;
  paused: boolean;
}
