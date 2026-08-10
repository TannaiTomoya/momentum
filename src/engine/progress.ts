import type { Progress, RunResult, WordStats } from './types'
import { updateWordStats } from './scheduler'

const STORAGE_KEY = 'verb-momentum-progress-v1'

const DEFAULT_PROGRESS: Progress = {
  xp: 0,
  level: 1,
  highScore: 0,
  bestCombo: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  wordStats: {},
  unlocked: {
    participle: false,
    hard: false,
  },
}

export function xpToNextLevel(level: number): number {
  return 120 + (level - 1) * 80
}

export function levelFromXp(xp: number): number {
  let level = 1
  let remaining = xp
  while (remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level)
    level += 1
    if (level > 99) break
  }
  return level
}

export function xpIntoCurrentLevel(xp: number, level: number): number {
  let spent = 0
  for (let l = 1; l < level; l += 1) spent += xpToNextLevel(l)
  return xp - spent
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESS, wordStats: {}, unlocked: { ...DEFAULT_PROGRESS.unlocked } }
    const parsed = JSON.parse(raw) as Progress
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      unlocked: {
        ...DEFAULT_PROGRESS.unlocked,
        ...parsed.unlocked,
      },
      wordStats: parsed.wordStats ?? {},
    }
  } catch {
    return { ...DEFAULT_PROGRESS, wordStats: {}, unlocked: { ...DEFAULT_PROGRESS.unlocked } }
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function applyAnswerToProgress(
  progress: Progress,
  verbId: string,
  correct: boolean,
  reactionMs: number,
): Progress {
  const prev = progress.wordStats[verbId] ?? ({
    easiness: 2.5,
    interval: 0,
    repetitions: 0,
    nextDue: 0,
    correct: 0,
    wrong: 0,
    lastSeen: 0,
  } satisfies WordStats)

  return {
    ...progress,
    totalAnswered: progress.totalAnswered + 1,
    totalCorrect: progress.totalCorrect + (correct ? 1 : 0),
    wordStats: {
      ...progress.wordStats,
      [verbId]: updateWordStats(prev, correct, reactionMs),
    },
  }
}

export function finalizeRun(
  progress: Progress,
  score: number,
  correct: number,
  answered: number,
  bestCombo: number,
): { progress: Progress; result: RunResult } {
  const accuracy = answered === 0 ? 0 : correct / answered
  const xpGained = Math.round(score * 0.35 + correct * 12 + bestCombo * 5 + accuracy * 40)
  const nextXp = progress.xp + xpGained
  const newLevel = levelFromXp(nextXp)
  const leveledUp = newLevel > progress.level

  const unlockedParticiple = newLevel >= 2 || progress.unlocked.participle
  const unlockedHard = newLevel >= 3 || progress.unlocked.hard

  const next: Progress = {
    ...progress,
    xp: nextXp,
    level: newLevel,
    highScore: Math.max(progress.highScore, score),
    bestCombo: Math.max(progress.bestCombo, bestCombo),
    unlocked: {
      participle: unlockedParticiple,
      hard: unlockedHard,
    },
  }

  saveProgress(next)

  return {
    progress: next,
    result: {
      score,
      correct,
      answered,
      bestCombo,
      xpGained,
      leveledUp,
      newLevel,
      unlockedParticiple:
        unlockedParticiple && !progress.unlocked.participle,
      unlockedHard: unlockedHard && !progress.unlocked.hard,
    },
  }
}
