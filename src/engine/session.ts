import { ALL_VERBS, VERB_BY_ID, type Verb } from '../data/words'
import { pickInterleavedVerbs, pickQuestionType, weakVerbIds } from './scheduler'
import type { GameMode, Progress, Question, QuestionType } from './types'

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function uniqueChoices(correct: string, pool: string[], count = 4): string[] {
  const others = shuffle(pool.filter((x) => x.toLowerCase() !== correct.toLowerCase()))
  const picks = others.slice(0, count - 1)
  return shuffle([correct, ...picks])
}

function buildPrompt(verb: Verb, type: QuestionType): Omit<
  Question,
  'id' | 'verb' | 'type' | 'isRecovery'
> {
  switch (type) {
    case 'meaning-to-base': {
      const pool = ALL_VERBS.map((v) => v.base)
      return {
        prompt: verb.meaning,
        hint: '意味 → 原形',
        answer: verb.base,
        acceptAnswers: [verb.base],
        choices: uniqueChoices(verb.base, pool),
      }
    }
    case 'base-to-past': {
      const pool = ALL_VERBS.map((v) => v.past)
      return {
        prompt: verb.base,
        hint: '原形 → 過去形',
        answer: verb.past,
        acceptAnswers: verb.pastAnswers,
        choices: uniqueChoices(verb.past, pool),
      }
    }
    case 'past-to-base': {
      const pool = ALL_VERBS.map((v) => v.base)
      return {
        prompt: verb.past,
        hint: '過去形 → 原形',
        answer: verb.base,
        acceptAnswers: [verb.base],
        choices: uniqueChoices(verb.base, pool),
      }
    }
    case 'base-to-participle': {
      const pool = ALL_VERBS.filter((v) => v.kind === 'irregular').map(
        (v) => v.participle,
      )
      return {
        prompt: verb.base,
        hint: '原形 → 過去分詞',
        answer: verb.participle,
        acceptAnswers: verb.participleAnswers,
        choices: uniqueChoices(verb.participle, pool),
      }
    }
  }
}

export function createQuestion(
  verb: Verb,
  type: QuestionType,
  isRecovery = false,
): Question {
  const body = buildPrompt(verb, type)
  return {
    id: `${verb.id}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    verb,
    type,
    isRecovery,
    ...body,
  }
}

export function questionCountForMode(mode: GameMode): number {
  if (mode === 'hard') return 24
  if (mode === 'participle') return 20
  return 18
}

export function timeLimitForMode(mode: GameMode): number {
  if (mode === 'hard') return 70
  if (mode === 'participle') return 90
  return 80
}

export function buildSession(
  progress: Progress,
  mode: GameMode,
): Question[] {
  const count = questionCountForMode(mode)
  const verbs = pickInterleavedVerbs(progress, count)

  // Inject weak verbs early for spaced retrieval
  const weakIds = weakVerbIds(progress, 4)
  for (const id of weakIds) {
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
    questions.push(createQuestion(verb, type))
  }

  return questions
}

export function createRecoveryQuestion(
  verb: Verb,
  mode: GameMode,
  previousType: QuestionType | null,
): Question {
  const type = pickQuestionType(verb, mode, previousType)
  return createQuestion(verb, type, true)
}

export function isAnswerCorrect(question: Question, choice: string): boolean {
  const normalized = choice.trim().toLowerCase()
  return question.acceptAnswers.some((a) => a.toLowerCase() === normalized)
}
