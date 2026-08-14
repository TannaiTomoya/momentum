import {
  ALL_VERBS,
  IRREGULAR_VERBS,
  PATTERN_ABA_VERBS,
  PATTERN_ABB_VERBS,
  PATTERN_ABC_VERBS,
  type Verb,
} from '../data/words'
import type { GameMode, Progress, QuestionType, WordStats } from './types'

export function verbPoolForMode(mode: GameMode): Verb[] {
  switch (mode) {
    case 'core':
      return IRREGULAR_VERBS
    case 'abb':
      return PATTERN_ABB_VERBS
    case 'aba':
      return PATTERN_ABA_VERBS
    case 'abc':
      return PATTERN_ABC_VERBS
    default:
      return ALL_VERBS
  }
}

export function isPatternMode(mode: GameMode): boolean {
  return mode === 'abb' || mode === 'aba' || mode === 'abc' || mode === 'core'
}

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

/** 指定プールから優先度順に抽出（少数語は循環して再利用） */
export function pickFromVerbPool(
  pool: Verb[],
  progress: Progress,
  count: number,
  now = Date.now(),
): Verb[] {
  if (pool.length === 0) return []
  const ranked = [...pool].sort(
    (a, b) => priorityScore(b, progress, now) - priorityScore(a, progress, now),
  )
  if (ranked.length >= count) return ranked.slice(0, count)

  const picked: Verb[] = []
  while (picked.length < count) {
    const cycle = picked.length > 0 && picked.length % ranked.length === 0
      ? [...ranked].sort(() => Math.random() - 0.5)
      : ranked
    for (const verb of cycle) {
      picked.push(verb)
      if (picked.length >= count) break
    }
  }
  return picked
}

/** 最重要不規則動詞 50 語のみから優先度順に抽出 */
export function pickCoreIrregularVerbs(
  progress: Progress,
  count: number,
  now = Date.now(),
): Verb[] {
  return pickFromVerbPool(IRREGULAR_VERBS, progress, count, now)
}

export function availableQuestionTypes(
  verb: Verb,
  mode: GameMode,
): QuestionType[] {
  // 型ドリルは過去形／過去分詞の区別を重点的に
  if (mode === 'abb' || mode === 'aba' || mode === 'abc') {
    return [
      'base-to-past',
      'base-to-participle',
      'past-to-base',
      'meaning-to-base',
    ]
  }

  const types: QuestionType[] = ['meaning-to-base', 'base-to-past', 'past-to-base']
  if (
    (mode === 'participle' || mode === 'hard' || mode === 'core') &&
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
