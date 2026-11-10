import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeAnswer,
  validateRiddleAnswer,
  validateCodeAnswer,
  validateNumberAnswer,
  validateSequenceAnswer,
  validateLogicPuzzle,
  calculatePuzzleReward,
  calculateHintPenalty,
  calculateCompletionPercentage,
  calculateRank,
  evaluateAchievements,
} from './rules.ts';
import { LogicPuzzleData } from './types.ts';

test('normalizeAnswer strips articles, whitespace, and punctuation', () => {
  assert.equal(normalizeAnswer('  A Map!  '), 'map');
  assert.equal(normalizeAnswer('The Echo...'), 'echo');
  assert.equal(normalizeAnswer('an Ancient Key?'), 'ancient key');
});

test('validateRiddleAnswer handles synonyms and varied punctuation', () => {
  const accepted = ['map', 'treasure map', 'a map'];
  assert.equal(validateRiddleAnswer('a map', accepted), true);
  assert.equal(validateRiddleAnswer('Map!', accepted), true);
  assert.equal(validateRiddleAnswer('THE TREASURE MAP', accepted), true);
  assert.equal(validateRiddleAnswer('compass', accepted), false);
  assert.equal(validateRiddleAnswer('', accepted), false);
});

test('validateCodeAnswer checks exact match of numeric lock code', () => {
  assert.equal(validateCodeAnswer('374', '374'), true);
  assert.equal(validateCodeAnswer(' 374 ', '374'), true);
  assert.equal(validateCodeAnswer('375', '374'), false);
});

test('validateNumberAnswer correctly compares numerical challenges', () => {
  assert.equal(validateNumberAnswer(42, 42), true);
  assert.equal(validateNumberAnswer('42', 42), true);
  assert.equal(validateNumberAnswer(' 42 ', 42), true);
  assert.equal(validateNumberAnswer('99', 42), false);
  assert.equal(validateNumberAnswer('abc', 42), false);
});

test('validateSequenceAnswer checks sequence predictions', () => {
  assert.equal(validateSequenceAnswer('63', '63'), true);
  assert.equal(validateSequenceAnswer(63, 63), true);
  assert.equal(validateSequenceAnswer('North', 'north'), true);
  assert.equal(validateSequenceAnswer('South', 'north'), false);
});

test('validateLogicPuzzle checks complete and correct placements', () => {
  const dummyPuzzle: LogicPuzzleData = {
    id: 'elem_puzzle',
    title: 'Elemental Alignment',
    type: 'logic',
    instructions: 'Place elements',
    loreText: 'Temple altar',
    points: 100,
    bonusNoHint: 50,
    hints: [],
    scenario: 'Elemental positions',
    clues: [],
    slots: [
      { id: 'north', label: 'North Altar', correctItem: 'fire' },
      { id: 'south', label: 'South Altar', correctItem: 'water' },
    ],
    availableItems: [
      { id: 'fire', name: 'Fire', symbol: '🔥' },
      { id: 'water', name: 'Water', symbol: '💧' },
    ],
  };

  // Incomplete
  const r1 = validateLogicPuzzle({ north: 'fire' }, dummyPuzzle);
  assert.equal(r1.isComplete, false);
  assert.equal(r1.isCorrect, false);
  assert.equal(r1.correctSlotsCount, 1);

  // Complete but wrong
  const r2 = validateLogicPuzzle({ north: 'water', south: 'fire' }, dummyPuzzle);
  assert.equal(r2.isComplete, true);
  assert.equal(r2.isCorrect, false);

  // Complete and correct
  const r3 = validateLogicPuzzle({ north: 'fire', south: 'water' }, dummyPuzzle);
  assert.equal(r3.isComplete, true);
  assert.equal(r3.isCorrect, true);
  assert.equal(r3.correctSlotsCount, 2);
});

test('calculatePuzzleReward grants bonus when no hints used', () => {
  const zeroHints = calculatePuzzleReward(100, 50, 0);
  assert.equal(zeroHints.pointsAwarded, 150);
  assert.equal(zeroHints.hadBonus, true);

  const withHints = calculatePuzzleReward(100, 50, 1);
  assert.equal(withHints.pointsAwarded, 100);
  assert.equal(withHints.hadBonus, false);
});

test('calculateHintPenalty deducts the expected penalty', () => {
  assert.equal(calculateHintPenalty(20), 20);
  assert.equal(calculateHintPenalty(-5), 0);
});

test('calculateCompletionPercentage calculates accurately', () => {
  const percent = calculateCompletionPercentage(5, 10, 5, 10);
  assert.equal(percent, 50);
  const full = calculateCompletionPercentage(10, 10, 10, 10);
  assert.equal(full, 100);
});

test('calculateRank assigns titles appropriately', () => {
  assert.equal(calculateRank(2600).title, 'Grand Master Explorer');
  assert.equal(calculateRank(1900).title, 'Legendary Treasure Hunter');
  assert.equal(calculateRank(1300).title, 'Veteran Cartographer');
  assert.equal(calculateRank(700).title, 'Daring Pathfinder');
  assert.equal(calculateRank(200).title, 'Novice Adventurer');
});

test('evaluateAchievements unlocks achievements on milestones', () => {
  const initial = evaluateAchievements({
    stats: {
      puzzlesSolved: 1,
      hintsUsed: 0,
      coinsCollected: 100,
      score: 150,
      timeElapsedSeconds: 120,
      trapsDisarmed: 0,
      perfectPuzzles: 1,
    },
    unlockedLevelId: 2,
    solvedPuzzleIds: ['p1'],
    collectedInventory: [],
    usedHintIds: [],
    isGameWon: false,
  }, []);

  assert.ok(initial.includes('first_discovery'));
  assert.ok(!initial.includes('legendary_explorer'));

  const won = evaluateAchievements({
    stats: {
      puzzlesSolved: 10,
      hintsUsed: 1,
      coinsCollected: 650,
      score: 2400,
      timeElapsedSeconds: 400,
      trapsDisarmed: 1,
      perfectPuzzles: 4,
    },
    unlockedLevelId: 5,
    solvedPuzzleIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
    collectedInventory: [
      { id: '1', name: 'Gem1', category: 'gem', description: '', lore: '', icon: '', obtainedAtLevel: 1 },
      { id: '2', name: 'Gem2', category: 'gem', description: '', lore: '', icon: '', obtainedAtLevel: 2 },
      { id: '3', name: 'Art1', category: 'artifact', description: '', lore: '', icon: '', obtainedAtLevel: 3 },
    ],
    usedHintIds: ['h1'],
    isGameWon: true,
  }, ['first_discovery']);

  assert.ok(won.includes('puzzle_master'));
  assert.ok(won.includes('treasure_hunter'));
  assert.ok(won.includes('hidden_object_expert'));
  assert.ok(won.includes('legendary_explorer'));
  assert.ok(won.includes('untouchable'));
  assert.ok(won.includes('trap_dodger'));
});
