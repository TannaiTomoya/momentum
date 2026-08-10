import { ALL_VERBS, type Verb } from '../data/words'
import type { GameMode, Progress, QuestionType, WordStats } from './types'

const DEFAULT_STATS: WordStats = {
  easiness: 2.5,
  interval: 0,
  repetitions: 0,
  nextDue: 0,
  correct: 0,
  wrong: 0,
  lastSeen: 0,
}

export function getWordStats(
  progress: Progress,
  verbId: string,
): WordStats {
  return progress.wordStats[verbId] ?? { ...DEFAULT_STATS }
}

/** Simplified SM-2 style update from correctness + speed */
export function updateWordStats(
  stats: WordStats,
  correct: boolean,
  reactionMs: number,
  now = Date.now(),
): WordStats {
  if (!correct) {
    return {
      ...stats,
      easiness: Math.max(1.3, stats.easiness - 0.2),
      interval: 0,
      repetitions: 0,
      nextDue: now,
      wrong: stats.wrong + 1,
      lastSeen: now,
    }
  }

  const speedFactor = reactionMs < 2500 ? 0.08 : reactionMs < 5000 ? 0 : -0.05
  const easiness = Math.min(
    2.8,
    Math.max(1.3, stats.easiness + 0.1 + speedFactor),
  )
  const repetitions = stats.repetitions + 1
  let interval: number
  if (repetitions === 1) interval = 1
  else if (repetitions === 2) interval = 3
  else interval = Math.round(stats.interval * easiness)

  // Convert interval units to ms (1 unit ≈ 45s during a session feel)
  const nextDue = now + interval * 45_000

  return {
    easiness,
    interval,
    repetitions,
    nextDue,
    correct: stats.correct + 1,
    wrong: stats.wrong,
    lastSeen: now,
  }
}

function priorityScore(verb: Verb, progress: Progress, now: number): number {
  const stats = getWordStats(progress, verb.id)
  const overdue = Math.max(0, now - stats.nextDue) / 1000
  const weakness = stats.wrong * 3 - stats.correct
  const freshness = stats.lastSeen === 0 ? 8 : 0
  return overdue + weakness + freshness + Math.random() * 2
}

export function pickInterleavedVerbs(
  progress: Progress,
  count: number,
  now = Date.now(),
): Verb[] {
  const regular = ALL_VERBS.filter((v) => v.kind === 'regular')
  const irregular = ALL_VERBS.filter((v) => v.kind === 'irregular')

  const rankedRegular = [...regular].sort(
    (a, b) => priorityScore(b, progress, now) - priorityScore(a, progress, now),
  )
  const rankedIrregular = [...irregular].sort(
    (a, b) => priorityScore(b, progress, now) - priorityScore(a, progress, now),
  )

  const picked: Verb[] = []
  let ri = 0
  let ii = 0
  let lastKind: Verb['kind'] | null = null
  let sameStreak = 0

  while (picked.length < count) {
    const preferRegular =
      lastKind === 'irregular' ||
      (lastKind === 'regular' && sameStreak >= 2
        ? false
        : lastKind === null
          ? Math.random() < 0.5
          : sameStreak >= 1
            ? Math.random() < 0.35
            : Math.random() < 0.55)

    let next: Verb | undefined
    if (preferRegular && ri < rankedRegular.length) {
      next = rankedRegular[ri++]
    } else if (ii < rankedIrregular.length) {
      next = rankedIrregular[ii++]
    } else if (ri < rankedRegular.length) {
      next = rankedRegular[ri++]
    }

    if (!next) break

    if (next.kind === lastKind) sameStreak += 1
    else {
      lastKind = next.kind
      sameStreak = 1
    }
    picked.push(next)
  }

  return picked
}

export function availableQuestionTypes(
  verb: Verb,
  mode: GameMode,
): QuestionType[] {
  const types: QuestionType[] = ['meaning-to-base', 'base-to-past', 'past-to-base']
  if (
    (mode === 'participle' || mode === 'hard') &&
    verb.kind === 'irregular'
  ) {
    types.push('base-to-participle')
  }
  return types
}

/** Avoid repeating the same question type back-to-back when possible */
export function pickQuestionType(
  verb: Verb,
  mode: GameMode,
  previousType: QuestionType | null,
): QuestionType {
  const types = availableQuestionTypes(verb, mode)
  const filtered =
    previousType && types.length > 1
      ? types.filter((t) => t !== previousType)
      : types
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export function weakVerbIds(progress: Progress, limit = 8): string[] {
  return Object.entries(progress.wordStats)
    .filter(([, s]) => s.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong || a[1].correct - b[1].correct)
    .slice(0, limit)
    .map(([id]) => id)
}
