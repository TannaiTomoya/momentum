import type { Verb, VerbKind } from '../data/words'

export type QuestionType =
  | 'meaning-to-base'
  | 'base-to-past'
  | 'past-to-base'
  | 'base-to-participle'

export type GameMode = 'standard' | 'participle' | 'hard'

export type Question = {
  id: string
  verb: Verb
  type: QuestionType
  prompt: string
  hint: string
  answer: string
  acceptAnswers: string[]
  choices: string[]
  isRecovery: boolean
}

export type WordStats = {
  easiness: number
  interval: number
  repetitions: number
  nextDue: number
  correct: number
  wrong: number
  lastSeen: number
}

export type Progress = {
  xp: number
  level: number
  highScore: number
  bestCombo: number
  totalCorrect: number
  totalAnswered: number
  wordStats: Record<string, WordStats>
  unlocked: {
    participle: boolean
    hard: boolean
  }
}

export type MomentumState = {
  combo: number
  multiplier: number
  score: number
  bestCombo: number
  heat: number
}

export type RunResult = {
  score: number
  correct: number
  answered: number
  bestCombo: number
  xpGained: number
  leveledUp: boolean
  newLevel: number
  unlockedParticiple: boolean
  unlockedHard: boolean
}

export type { Verb, VerbKind }
