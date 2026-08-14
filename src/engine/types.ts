import type { Verb, VerbKind } from '../data/words'

export type QuestionType =
  | 'meaning-to-base'
  | 'base-to-past'
  | 'past-to-base'
  | 'base-to-participle'
  | 'ja-to-en'
  | 'en-to-ja'
  | 'cloze-en-to-ja'
  | 'ing-classify'
  | 'initial-type'
  | 'pos-classify'
  | 'word-order-classify'
  | 'comp-obj-classify'
  | 'phrase-clause-classify'
  | 'conj-choice'
  | 'linker-classify'
  | 'count-classify'
  | 'quant-choice'
  | 'agree-choice'

export type GameMode =
  | 'standard'
  | 'participle'
  | 'hard'
  | 'core'
  | 'abb'
  | 'aba'
  | 'abc'
  | 'vocab-ja-en'
  | 'vocab-en-ja'
  | 'cloze'
  | 'phrases'
  | 'ing-form'
  | 'vocab-initials'
  | 'vocab-initials-en'
  | 'vocab-initials-cloze'
  | 'vocab-initials-phrases'
  | 'toeic-en-ja'
  | 'toeic-ja-en'
  | 'toeic-cloze'
  | 'toeic-must-cloze'
  | 'toeic-biz-cloze'
  | 'pos-suffix'
  | 'pos-word'
  | 'word-order'
  | 'comp-obj'
  | 'phrase-clause'
  | 'conj-prep'
  | 'conj-part5'
  | 'conj-linker'
  | 'noun-count'
  | 'noun-plural'
  | 'noun-quant'
  | 'noun-agree'
  | 'prep-time'
  | 'prep-place'
  | 'prep-other'
  | 'prep-set'

export type Question = {
  id: string
  itemId: string
  chip: string
  type: QuestionType
  prompt: string
  hint: string
  answer: string
  acceptAnswers: string[]
  choices: string[]
  isRecovery: boolean
  /** 太字表示する語（例: swimming） */
  emphasis?: string
  /** 補助訳など */
  subtitle?: string
  /** イニシャル穴埋め表示（f______） */
  initialHint?: string
  /** 注意書き */
  note?: string
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
