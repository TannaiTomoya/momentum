import type { Verb, VerbKind } from '../data/words'
import type { LyricGrammarKind } from '../data/lyricGrammar'

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
  | 'if-lab'
  | 'tag-lab'
  | 'pulse'
  | 'lyric'

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
  | 'html-css-quiz'
  | 'js-basics-quiz'
  | 'if-meaning'
  | 'if-syntax'
  | 'if-build'
  | 'tag-meaning'
  | 'tag-syntax'
  | 'tag-build'
  | 'pulse-meaning'
  | 'pulse-syntax'
  | 'pulse-build'
  | 'lyric-meaning'
  | 'lyric-syntax'
  | 'lyric-build'
  | 'lyric-grammar'

export type IfLabKind =
  | 'age-gate'
  | 'score-badge'
  | 'stock'
  | 'input-error'
  | 'weather'
  | 'cart'
  | 'member'

export type IfLabStage = 'meaning' | 'syntax' | 'build'

export type IfLabOp = '<' | '>' | '<=' | '>=' | '===' | '!==' | '&&'

export type IfLabSpec = {
  kind: IfLabKind
  stage: IfLabStage
  variable: string
  current: string | number | boolean
  threshold: string | number
  operator: IfLabOp
  goalOn: boolean
  andVariable?: string
  andCurrent?: boolean
}

export type TagLabKind =
  | 'skeleton'
  | 'table'
  | 'form'
  | 'box'
  | 'flex'
  | 'center'
  | 'lp'

export type TagLabStage = 'meaning' | 'syntax' | 'build'

export type TagToken =
  | 'header'
  | 'main'
  | 'footer'
  | 'body'
  | 'tr'
  | 'th'
  | 'td'
  | 'label'
  | 'required'
  | 'password'
  | 'email'
  | 'margin'
  | 'padding'
  | 'flex'
  | 'center'
  | 'copy'

export type TagLabSpec = {
  kind: TagLabKind
  stage: TagLabStage
  token: TagToken
  tableHeaders?: [string, string]
  tableRows?: [string, string][]
  skills?: string[]
  fieldId?: string
  fieldLabel?: string
}

export type PulseKind = 'kick4' | 'syncopation' | 'hat8' | 'humanize' | 'groove'

export type PulseStage = 'meaning' | 'syntax' | 'build'

export type PulseGenre = 'house' | 'breaks' | 'ukg'

export type PulsePattern = {
  kick: boolean[]
  snare: boolean[]
  hat: boolean[]
  humanizeMs: number
  velocity: number
  bpm: number
  genre: PulseGenre
}

export type PulseSpec = {
  kind: PulseKind
  stage: PulseStage
  bpm: number
  genre: PulseGenre
  starter: string
  requireGroove: boolean
  target?: PulsePattern
}

export type PulseClip = {
  code: string
  bpm: number
  genre: PulseGenre
  kind: PulseKind
}

export type LyricStage = 'meaning' | 'syntax' | 'build' | 'grammar'

export type LyricRide = 'on' | 'off'

export type LyricGrammarSpec = {
  kind: LyricGrammarKind
  instruction: string
  example: string
  tip: string
}

export type LyricSpec = {
  stage: LyricStage
  bpm: number
  word: string
  accept: string[]
  ja: string
  ride: LyricRide
  requireRide: boolean
  starter: string
  grammar?: LyricGrammarSpec
  target?: {
    word: string
    steps: boolean[]
    bpm: number
  }
}

export type LyricClip = {
  code: string
  bpm: number
  word: string
  ride: LyricRide
}

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
  /** 接尾辞モードなど：ボタンで開示する例語 */
  exampleHint?: string
  /** イニシャル穴埋め表示（f______） */
  initialHint?: string
  /** 注意書き */
  note?: string
  /** 条件入力で動くミニ画面 */
  ifLab?: IfLabSpec
  /** タグ入力で動くミニ画面 */
  tagLab?: TagLabSpec
  /** ライブコーディングのお題 */
  pulse?: PulseSpec
  /** 拍に語を乗せるお題 */
  lyric?: LyricSpec
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
    pulseSyntax: boolean
    pulseBuild: boolean
  }
}

export type MomentumState = {
  combo: number
  multiplier: number
  score: number
  bestCombo: number
  heat: number
}

export type ReviewItem = {
  prompt: string
  answer: string
  given: string
  ok: boolean
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
  unlockedPulseSyntax: boolean
  unlockedPulseBuild: boolean
  pulseCode?: string
  pulseBpm?: number
  pulseClips?: PulseClip[]
  lyricCode?: string
  lyricClips?: LyricClip[]
  review?: ReviewItem[]
}

export type { Verb, VerbKind }
