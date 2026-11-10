import { GameStats, GameState, Achievement, InventoryItem, LogicPuzzleData } from './types.ts';

/**
 * Normalizes answer string by trimming, lowercasing, and stripping leading articles ("a ", "the ", "an ")
 * and trailing punctuation.
 */
export function normalizeAnswer(input: string): string {
  if (!input) return '';
  let str = input.trim().toLowerCase();
  // Strip common punctuation
  str = str.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '');
  // Strip leading articles
  str = str.replace(/^(a|an|the)\s+/, '');
  return str.trim();
}

/**
 * Checks if a riddle answer matches any of the accepted variations.
 */
export function validateRiddleAnswer(userAnswer: string, acceptedAnswers: string[]): boolean {
  const normUser = normalizeAnswer(userAnswer);
  if (!normUser) return false;

  return acceptedAnswers.some(ans => {
    const normAccepted = normalizeAnswer(ans);
    return normUser === normAccepted || normUser.includes(normAccepted);
  });
}

/**
 * Validates a numeric code entry (e.g. "374") against the expected code.
 */
export function validateCodeAnswer(userCode: string, correctCode: string): boolean {
  return userCode.trim() === correctCode.trim();
}

/**
 * Validates a number / math challenge input.
 */
export function validateNumberAnswer(userNumber: number | string, targetNumber: number): boolean {
  const parsed = typeof userNumber === 'string' ? parseInt(userNumber.trim(), 10) : userNumber;
  return !isNaN(parsed) && parsed === targetNumber;
}

/**
 * Validates a sequence puzzle answer.
 */
export function validateSequenceAnswer(
  userAnswer: string | number,
  correctAnswer: string | number
): boolean {
  const u = String(userAnswer).trim().toLowerCase();
  const c = String(correctAnswer).trim().toLowerCase();
  return u === c;
}

/**
 * Validates a logic slot placement puzzle.
 */
export function validateLogicPuzzle(
  placements: Record<string, string>,
  puzzle: LogicPuzzleData
): { isComplete: boolean; isCorrect: boolean; correctSlotsCount: number } {
  const totalSlots = puzzle.slots.length;
  let filledCount = 0;
  let correctCount = 0;

  for (const slot of puzzle.slots) {
    const placed = placements[slot.id];
    if (placed) {
      filledCount++;
      if (placed === slot.correctItem) {
        correctCount++;
      }
    }
  }

  return {
    isComplete: filledCount === totalSlots,
    isCorrect: correctCount === totalSlots,
    correctSlotsCount: correctCount,
  };
}

/**
 * Calculates score delta for solving a puzzle.
 * - Base points awarded.
 * - If no hints used for this puzzle, adds bonusNoHint.
 */
export function calculatePuzzleReward(
  basePoints: number,
  bonusNoHint: number,
  usedHintsCount: number
): { pointsAwarded: number; hadBonus: boolean } {
  const hadBonus = usedHintsCount === 0;
  const pointsAwarded = basePoints + (hadBonus ? bonusNoHint : 0);
  return { pointsAwarded, hadBonus };
}

/**
 * Calculates hint penalty (typically 20 points).
 */
export function calculateHintPenalty(penalty: number = 20): number {
  return Math.max(0, penalty);
}

/**
 * Calculates overall game completion percentage based on levels completed,
 * puzzles solved, and inventory collected.
 */
export function calculateCompletionPercentage(
  solvedPuzzlesCount: number,
  totalPuzzlesCount: number = 10,
  inventoryCount: number,
  totalInventoryCount: number = 10
): number {
  const puzzleWeight = 0.7;
  const inventoryWeight = 0.3;

  const puzzleRatio = Math.min(1, solvedPuzzlesCount / Math.max(1, totalPuzzlesCount));
  const inventoryRatio = Math.min(1, inventoryCount / Math.max(1, totalInventoryCount));

  const total = (puzzleRatio * puzzleWeight + inventoryRatio * inventoryWeight) * 100;
  return Math.round(total);
}

/**
 * Computes player adventure rank based on final score and efficiency.
 */
export function calculateRank(score: number): { title: string; badge: string; description: string } {
  if (score >= 2500) {
    return {
      title: 'Grand Master Explorer',
      badge: '👑',
      description: 'You uncovered every secret of the Lost Island with peerless wit and valor!',
    };
  } else if (score >= 1800) {
    return {
      title: 'Legendary Treasure Hunter',
      badge: '🏆',
      description: 'Your name is now etched in the golden annals of the ancient explorers.',
    };
  } else if (score >= 1200) {
    return {
      title: 'Veteran Cartographer',
      badge: '🗺️',
      description: 'A master of treacherous trails, ancient locks, and lost ruins.',
    };
  } else if (score >= 600) {
    return {
      title: 'Daring Pathfinder',
      badge: '🧭',
      description: 'You boldly stepped into the unknown and found ancient wonders.',
    };
  }
  return {
    title: 'Novice Adventurer',
    badge: '🎒',
    description: 'The journey has begun, and grand mysteries still call your name.',
  };
}

/**
 * Evaluates achievement triggers and returns newly unlocked achievement IDs.
 */
export function evaluateAchievements(
  state: {
    stats: GameStats;
    unlockedLevelId: number;
    solvedPuzzleIds: string[];
    collectedInventory: InventoryItem[];
    usedHintIds: string[];
    isGameWon: boolean;
  },
  existingUnlockedIds: string[]
): string[] {
  const unlocked = new Set<string>(existingUnlockedIds);
  const newlyUnlocked: string[] = [];

  const grant = (id: string) => {
    if (!unlocked.has(id)) {
      unlocked.add(id);
      newlyUnlocked.push(id);
    }
  };

  // First Discovery: Solved at least 1 puzzle
  if (state.solvedPuzzleIds.length >= 1) {
    grant('first_discovery');
  }

  // Puzzle Master: Solved 5 or more puzzles
  if (state.solvedPuzzleIds.length >= 5) {
    grant('puzzle_master');
  }

  // Hidden Object Expert: Found at least 3 hidden objects
  const foundItems = state.collectedInventory.filter(
    item => item.category === 'artifact' || item.category === 'gem'
  );
  if (foundItems.length >= 3) {
    grant('hidden_object_expert');
  }

  // Speed Explorer: Completed game in under 15 minutes (900 seconds) or completed level 3 fast
  if (state.stats.timeElapsedSeconds > 0 && state.stats.timeElapsedSeconds < 600 && state.unlockedLevelId >= 3) {
    grant('speed_explorer');
  }

  // Treasure Hunter: Collected 500+ coins
  if (state.stats.coinsCollected >= 500) {
    grant('treasure_hunter');
  }

  // Untouchable: Solved 3 puzzles without using any hints
  if (state.stats.perfectPuzzles >= 3) {
    grant('untouchable');
  }

  // Trap Dodger: Successfully bypassed a dangerous trap
  if (state.stats.trapsDisarmed >= 1) {
    grant('trap_dodger');
  }

  // Legendary Explorer: Beat the game and unlocked Level 5 final treasure
  if (state.isGameWon) {
    grant('legendary_explorer');
  }

  return newlyUnlocked;
}
