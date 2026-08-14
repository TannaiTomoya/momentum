import { IRREGULAR_VERBS, VERB_BY_ID, type Verb } from '../data/words'
import {
  isPatternMode,
  pickFromVerbPool,
  pickInterleavedVerbs,
  pickQuestionType,
  verbPoolForMode,
  weakVerbIds,
} from './scheduler'
import type { GameMode, Progress, Question, QuestionType } from './types'
import {
  buildVocabSession,
  createVocabRecoveryQuestion,
  isVocabMode,
  vocabQuestionCount,
  vocabTimeLimit,
} from './vocabSession'

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function uniqueChoices(correct: string, pool: string[], count = 4): string[] {
  const seen = new Set<string>()
  const others: string[] = []
  for (const item of pool) {
    const key = item.toLowerCase()
    if (key === correct.toLowerCase() || seen.has(key)) continue
    seen.add(key)
    others.push(item)
  }
  if (others.length < count - 1) {
    for (const verb of IRREGULAR_VERBS) {
      for (const item of [verb.base, verb.past, verb.participle]) {
        const key = item.toLowerCase()
        if (key === correct.toLowerCase() || seen.has(key)) continue
        seen.add(key)
        others.push(item)
        if (others.length >= count - 1) break
      }
      if (others.length >= count - 1) break
    }
  }
  const picks = shuffle(others).slice(0, count - 1)
  return shuffle([correct, ...picks])
}

function buildPrompt(
  verb: Verb,
  type: QuestionType,
  pool: Verb[],
): Omit<Question, 'id' | 'itemId' | 'chip' | 'type' | 'isRecovery'> {
  switch (type) {
    case 'meaning-to-base': {
      return {
        prompt: verb.meaning,
        hint: '意味 → 原形',
        answer: verb.base,
        acceptAnswers: [verb.base],
        choices: uniqueChoices(
          verb.base,
          pool.map((v) => v.base),
        ),
      }
    }
    case 'base-to-past': {
      return {
        prompt: verb.base,
        hint: '原形 → 過去形',
        answer: verb.past,
        acceptAnswers: verb.pastAnswers,
        choices: uniqueChoices(
          verb.past,
          pool.map((v) => v.past),
        ),
      }
    }
    case 'past-to-base': {
      return {
        prompt: verb.past,
        hint: '過去形 → 原形',
        answer: verb.base,
        acceptAnswers: [verb.base],
        choices: uniqueChoices(
          verb.base,
          pool.map((v) => v.base),
        ),
      }
    }
    case 'base-to-participle': {
      const participlePool = pool
        .filter((v) => v.kind === 'irregular')
        .map((v) => v.participle)
      return {
        prompt: verb.base,
        hint: '原形 → 過去分詞',
        answer: verb.participle,
        acceptAnswers: verb.participleAnswers,
        choices: uniqueChoices(verb.participle, participlePool),
      }
    }
    default:
      return {
        prompt: verb.meaning,
        hint: '意味 → 原形',
        answer: verb.base,
        acceptAnswers: [verb.base],
        choices: uniqueChoices(
          verb.base,
          pool.map((v) => v.base),
        ),
      }
  }
}

export function createQuestion(
  verb: Verb,
  type: QuestionType,
  isRecovery = false,
  mode: GameMode = 'standard',
): Question {
  const body = buildPrompt(verb, type, verbPoolForMode(mode))
  return {
    id: `${verb.id}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId: verb.id,
    chip: verb.kind === 'regular' ? 'Regular' : 'Irregular',
    type,
    isRecovery,
    ...body,
  }
}

export function questionCountForMode(mode: GameMode): number {
  if (isVocabMode(mode)) return vocabQuestionCount(mode)
  if (mode === 'hard') return 24
  if (mode === 'aba') return 12
  if (mode === 'abb' || mode === 'abc') return 16
  if (mode === 'participle' || mode === 'core') return 20
  return 18
}

export function timeLimitForMode(mode: GameMode): number {
  if (isVocabMode(mode)) return vocabTimeLimit(mode)
  if (mode === 'hard') return 70
  if (mode === 'aba') return 60
  if (mode === 'abb' || mode === 'abc') return 75
  if (mode === 'participle' || mode === 'core') return 90
  return 80
}

export function buildSession(
  progress: Progress,
  mode: GameMode,
): Question[] {
  if (isVocabMode(mode)) return buildVocabSession(progress, mode)

  const count = questionCountForMode(mode)
  const pool = verbPoolForMode(mode)
  const verbs = isPatternMode(mode)
    ? pickFromVerbPool(pool, progress, count)
    : pickInterleavedVerbs(progress, count)

  const allowedIds = new Set(pool.map((v) => v.id))

  const weakIds = weakVerbIds(progress, 4)
  for (const id of weakIds) {
    if (isPatternMode(mode) && !allowedIds.has(id)) continue
    const verb = VERB_BY_ID[id]
    if (!verb) continue
    if (!verbs.some((v) => v.id === id) && verbs.length > 3) {
      verbs[Math.floor(Math.random() * Math.min(6, verbs.length))] = verb
    }
  }

  const questions: Question[] = []
  let previousType: QuestionType | null = null

  for (const verb of verbs) {
    const type = pickQuestionType(verb, mode, previousType)
    previousType = type
    questions.push(createQuestion(verb, type, false, mode))
  }

  return questions
}

export function createRecoveryQuestion(
  question: Question,
  mode: GameMode,
  previousType: QuestionType | null,
): Question {
  if (isVocabMode(mode)) return createVocabRecoveryQuestion(question)

  const verb = VERB_BY_ID[question.itemId]
  if (!verb) return createVocabRecoveryQuestion(question)
  const type = pickQuestionType(verb, mode, previousType)
  return createQuestion(verb, type, true, mode)
}

function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
}

export function isAnswerCorrect(question: Question, choice: string): boolean {
  const normalized = normalizeAnswer(choice)
  return question.acceptAnswers.some((a) => normalizeAnswer(a) === normalized)
}
