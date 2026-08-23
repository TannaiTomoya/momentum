import {
  ING_ANSWER_LABEL,
  ING_CARDS,
  type IngCard,
} from '../data/ingForms'
import {
  POS_CHOICES,
  POS_LABEL,
  POS_WORD_CARDS,
  SUFFIX_CARDS,
  type PosWordCard,
  type SuffixCard,
} from '../data/posSuffixes'
import {
  COMP_OBJ_CARDS,
  COMP_OBJ_CHOICES,
  COMP_OBJ_LABEL,
  WORD_ORDER_CARDS,
  WORD_ORDER_CHOICES,
  WORD_ORDER_LABEL,
  type CompObjCard,
  type WordOrderCard,
} from '../data/wordOrder'
import {
  CONJ_PART5_CARDS,
  CONJ_PREP_CARDS,
  LINKER_CARDS,
  LINKER_CHOICES,
  LINKER_LABEL,
  PHRASE_CLAUSE_CARDS,
  PHRASE_CLAUSE_CHOICES,
  PHRASE_CLAUSE_LABEL,
  type ChoiceCard,
  type LinkerCard,
  type PhraseClauseCard,
} from '../data/conjunctions'
import {
  AGREE_CARDS,
  COUNT_CARDS,
  COUNT_CHOICES,
  COUNT_LABEL,
  PLURAL_CARDS,
  QUANT_CARDS,
  type AgreeCard,
  type CountCard,
  type PluralCard,
  type QuantCard,
} from '../data/nounsQuantity'
import {
  PREP_OTHER_CARDS,
  PREP_PLACE_CARDS,
  PREP_SET_CARDS,
  PREP_TIME_CARDS,
  type PrepCard,
} from '../data/prepositions'
import {
  HTML_CSS_QUIZ_CARDS,
  JS_BASICS_QUIZ_CARDS,
} from '../data/webBasics'
import {
  INITIAL_CARDS,
  INITIAL_CLOZE_CARDS,
  INITIAL_EN_JA_CARDS,
  INITIAL_PHRASE_EN_JA_CARDS,
  INITIAL_TOEIC_CLOZE_CARDS,
  INITIAL_TOEIC_EN_JA_CARDS,
  INITIAL_TOEIC_JA_EN_CARDS,
  type InitialCard,
  type InitialClozeCard,
} from '../data/initials'
import {
  TOEIC_BIZ_CLOZE_CARDS,
  TOEIC_MUST_CLOZE_CARDS,
} from '../data/toeicSentenceCloze'
import {
  CLOZE_CARDS,
  PHRASE_CARDS,
  VOCAB_CARDS,
  VOCAB_EN_JA_FOCUS,
  type ClozeCard,
  type PhraseCard,
  type VocabCard,
} from '../data/vocab'
import {
  isIfLabMode,
  ifLabQuestionCount,
  ifLabTimeLimit,
  buildIfLabSession,
  createIfLabRecoveryQuestion,
} from './ifLabSession'
import {
  isTagLabMode,
  tagLabQuestionCount,
  tagLabTimeLimit,
  buildTagLabSession,
  createTagLabRecoveryQuestion,
} from './tagLabSession'
import {
  isPulseMode,
  pulseQuestionCount,
  pulseTimeLimit,
  buildPulseSession,
  createPulseRecoveryQuestion,
} from './pulse/session'
import {
  isLyricMode,
  lyricQuestionCount,
  lyricTimeLimit,
  buildLyricSession,
  createLyricRecoveryQuestion,
} from './lyric/session'
import type { GameMode, Progress, Question, QuestionType } from './types'
import { getWordStats } from './scheduler'

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
  const picks = shuffle(others).slice(0, Math.max(0, count - 1))
  return shuffle([correct, ...picks])
}

function priorityScore(id: string, progress: Progress, now: number): number {
  const stats = getWordStats(progress, id)
  const overdue = Math.max(0, now - stats.nextDue) / 1000
  const weakness = stats.wrong * 3 - stats.correct
  const freshness = stats.lastSeen === 0 ? 8 : 0
  return overdue + weakness + freshness + Math.random() * 2
}

function pickCards<T extends { id: string }>(
  pool: T[],
  progress: Progress,
  count: number,
  now = Date.now(),
): T[] {
  if (pool.length === 0) return []
  const ranked = [...pool].sort(
    (a, b) => priorityScore(b.id, progress, now) - priorityScore(a.id, progress, now),
  )
  if (ranked.length >= count) return ranked.slice(0, count)

  const picked: T[] = []
  while (picked.length < count) {
    const cycle =
      picked.length > 0 && picked.length % ranked.length === 0
        ? shuffle(ranked)
        : ranked
    for (const card of cycle) {
      picked.push(card)
      if (picked.length >= count) break
    }
  }
  return picked
}

function makeQuestion(
  itemId: string,
  type: QuestionType,
  chip: string,
  prompt: string,
  hint: string,
  answer: string,
  acceptAnswers: string[],
  choices: string[],
  isRecovery = false,
  extra?: Pick<
    Question,
    'emphasis' | 'subtitle' | 'exampleHint' | 'initialHint' | 'note'
  >,
): Question {
  return {
    id: `${itemId}-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId,
    chip,
    type,
    prompt,
    hint,
    answer,
    acceptAnswers,
    choices,
    isRecovery,
    ...extra,
  }
}

function ingQuestion(card: IngCard, isRecovery = false): Question {
  const answer = ING_ANSWER_LABEL[card.kind]
  const choices = shuffle([
    ING_ANSWER_LABEL.progressive,
    ING_ANSWER_LABEL.gerund,
  ])
  return makeQuestion(
    card.id,
    'ing-classify',
    'Grammar',
    card.en,
    '-ing の判別',
    answer,
    [answer],
    choices,
    isRecovery,
    { emphasis: card.emphasis, subtitle: card.ja },
  )
}

function initialQuestion(card: InitialCard, isRecovery = false): Question {
  const jaToEn = card.direction === 'ja-to-en'
  return makeQuestion(
    card.id,
    'initial-type',
    'Initials',
    jaToEn ? card.ja : card.en,
    jaToEn ? 'イニシャル入力（日→英）' : 'イニシャル入力（英→日）',
    jaToEn ? card.en : card.ja,
    jaToEn ? card.acceptEn : card.acceptJa,
    [],
    isRecovery,
    {
      initialHint: card.initialHint,
      note: card.note,
    },
  )
}

function initialClozeQuestion(
  card: InitialClozeCard,
  isRecovery = false,
  chip = 'Initials',
  hint = 'イニシャル穴埋め',
): Question {
  return makeQuestion(
    card.id,
    'initial-type',
    chip,
    card.prompt,
    hint,
    card.answer,
    card.acceptAnswers,
    [],
    isRecovery,
    {
      initialHint: card.initialHint,
      subtitle: card.ja,
      note: card.note,
    },
  )
}

function suffixPosQuestion(card: SuffixCard, isRecovery = false): Question {
  const answer = POS_LABEL[card.pos]
  return makeQuestion(
    card.id,
    'pos-classify',
    'POS',
    card.suffix,
    '接尾辞 → 品詞',
    answer,
    [answer],
    shuffle(POS_CHOICES),
    isRecovery,
    {
      exampleHint: card.examples,
      note: card.note,
    },
  )
}

function wordPosQuestion(card: PosWordCard, isRecovery = false): Question {
  const answer = POS_LABEL[card.pos]
  return makeQuestion(
    card.id,
    'pos-classify',
    'POS',
    card.word,
    '単語 → 品詞',
    answer,
    [answer],
    shuffle(POS_CHOICES),
    isRecovery,
    {
      subtitle: card.meaning,
      note: card.tip,
    },
  )
}

function wordOrderQuestion(card: WordOrderCard, isRecovery = false): Question {
  const answer = WORD_ORDER_LABEL[card.pattern]
  return makeQuestion(
    card.id,
    'word-order-classify',
    'Word Order',
    card.en,
    '語順パターン',
    answer,
    [answer],
    shuffle(WORD_ORDER_CHOICES),
    isRecovery,
    {
      subtitle: card.ja,
      note: card.tip,
      emphasis: undefined,
    },
  )
}

function compObjQuestion(card: CompObjCard, isRecovery = false): Question {
  const answer = COMP_OBJ_LABEL[card.role]
  return makeQuestion(
    card.id,
    'comp-obj-classify',
    'Grammar',
    card.en,
    '補語 vs 目的語',
    answer,
    [answer],
    shuffle(COMP_OBJ_CHOICES),
    isRecovery,
    {
      subtitle: card.ja,
      emphasis: card.target,
      note: card.tip,
    },
  )
}

function phraseClauseQuestion(
  card: PhraseClauseCard,
  isRecovery = false,
): Question {
  const answer = PHRASE_CLAUSE_LABEL[card.kind]
  return makeQuestion(
    card.id,
    'phrase-clause-classify',
    'Grammar',
    card.en,
    '句 vs 節',
    answer,
    [answer],
    shuffle(PHRASE_CLAUSE_CHOICES),
    isRecovery,
    {
      subtitle: card.ja,
      emphasis: card.target,
      note: card.tip,
    },
  )
}

function conjChoiceQuestion(
  card: ChoiceCard,
  isRecovery = false,
  chip = 'Conjunction',
  hint = '接続詞問題',
): Question {
  return makeQuestion(
    card.id,
    'conj-choice',
    chip,
    card.prompt,
    hint,
    card.answer,
    [card.answer],
    shuffle(card.choices),
    isRecovery,
    {
      subtitle: card.ja,
      note: card.tip,
    },
  )
}

function linkerQuestion(card: LinkerCard, isRecovery = false): Question {
  const answer = LINKER_LABEL[card.kind]
  return makeQuestion(
    card.id,
    'linker-classify',
    'Grammar',
    card.prompt,
    'つなぎ言葉の種類',
    answer,
    [answer],
    shuffle(LINKER_CHOICES),
    isRecovery,
    {
      subtitle: card.ja,
      note: card.tip,
    },
  )
}

function countQuestion(card: CountCard, isRecovery = false): Question {
  const answer = COUNT_LABEL[card.kind]
  return makeQuestion(
    card.id,
    'count-classify',
    'Noun',
    card.word,
    '可算 / 不可算',
    answer,
    [answer],
    shuffle(COUNT_CHOICES),
    isRecovery,
    { note: card.tip },
  )
}

function pluralQuestion(card: PluralCard, isRecovery = false): Question {
  return makeQuestion(
    card.id,
    'initial-type',
    'Noun',
    card.singular,
    '複数形を入力',
    card.plural,
    card.accept,
    [],
    isRecovery,
    {
      initialHint: card.hint,
      note: card.tip,
    },
  )
}

function quantQuestion(card: QuantCard, isRecovery = false): Question {
  return makeQuestion(
    card.id,
    'quant-choice',
    'Noun',
    card.prompt,
    '数量形容詞',
    card.answer,
    card.accept,
    shuffle(card.choices),
    isRecovery,
    {
      subtitle: card.ja,
      note: card.tip,
    },
  )
}

function agreeQuestion(card: AgreeCard, isRecovery = false): Question {
  return makeQuestion(
    card.id,
    'agree-choice',
    'Noun',
    card.prompt,
    '主語と動詞の一致',
    card.answer,
    [card.answer],
    shuffle(card.choices),
    isRecovery,
    {
      subtitle: card.ja,
      note: card.tip,
    },
  )
}

function prepQuestion(card: PrepCard, isRecovery = false): Question {
  return makeQuestion(
    card.id,
    'conj-choice',
    'Preposition',
    card.prompt,
    '前置詞',
    card.answer,
    card.accept,
    shuffle(card.choices),
    isRecovery,
    {
      subtitle: card.ja,
      note: card.tip,
    },
  )
}

function jaToEnQuestion(card: VocabCard | PhraseCard, isRecovery = false): Question {
  const pool =
    'acceptEn' in card && card.id.startsWith('p-')
      ? PHRASE_CARDS.map((c) => c.en)
      : VOCAB_CARDS.map((c) => c.en)
  return makeQuestion(
    card.id,
    'ja-to-en',
    card.id.startsWith('p-') ? 'Phrase' : 'Vocab',
    card.ja,
    '日本語 → 英語',
    card.en,
    card.acceptEn,
    uniqueChoices(card.en, pool),
    isRecovery,
  )
}

function enToJaQuestion(card: VocabCard | PhraseCard, isRecovery = false): Question {
  const pool =
    card.id.startsWith('p-')
      ? PHRASE_CARDS.map((c) => c.ja)
      : [...VOCAB_CARDS, ...VOCAB_EN_JA_FOCUS].map((c) => c.ja)
  return makeQuestion(
    card.id,
    'en-to-ja',
    card.id.startsWith('p-') ? 'Phrase' : 'Vocab',
    card.en,
    '英語 → 日本語',
    card.ja,
    card.acceptJa,
    uniqueChoices(card.ja, pool),
    isRecovery,
  )
}

function clozeQuestion(card: ClozeCard, isRecovery = false): Question {
  return makeQuestion(
    card.id,
    'cloze-en-to-ja',
    'Cloze',
    card.en,
    '英文 → 日本語',
    card.ja,
    card.acceptJa,
    uniqueChoices(
      card.ja,
      CLOZE_CARDS.map((c) => c.ja),
    ),
    isRecovery,
  )
}

export function isVocabMode(mode: GameMode): boolean {
  return (
    mode === 'vocab-ja-en' ||
    mode === 'vocab-en-ja' ||
    mode === 'cloze' ||
    mode === 'phrases' ||
    mode === 'ing-form' ||
    mode === 'vocab-initials' ||
    mode === 'vocab-initials-en' ||
    mode === 'vocab-initials-cloze' ||
    mode === 'vocab-initials-phrases' ||
    mode === 'toeic-en-ja' ||
    mode === 'toeic-ja-en' ||
    mode === 'toeic-cloze' ||
    mode === 'toeic-must-cloze' ||
    mode === 'toeic-biz-cloze' ||
    mode === 'pos-suffix' ||
    mode === 'pos-word' ||
    mode === 'word-order' ||
    mode === 'comp-obj' ||
    mode === 'phrase-clause' ||
    mode === 'conj-prep' ||
    mode === 'conj-part5' ||
    mode === 'conj-linker' ||
    mode === 'noun-count' ||
    mode === 'noun-plural' ||
    mode === 'noun-quant' ||
    mode === 'noun-agree' ||
    mode === 'prep-time' ||
    mode === 'prep-place' ||
    mode === 'prep-other' ||
    mode === 'prep-set' ||
    mode === 'html-css-quiz' ||
    mode === 'js-basics-quiz' ||
    isIfLabMode(mode) ||
    isTagLabMode(mode) ||
    isPulseMode(mode) ||
    isLyricMode(mode)
  )
}

export function vocabQuestionCount(mode: GameMode): number {
  if (
    mode === 'vocab-ja-en' ||
    mode === 'ing-form' ||
    mode === 'vocab-initials' ||
    mode === 'vocab-initials-phrases' ||
    mode === 'pos-suffix'
  ) {
    return 20
  }
  if (mode === 'word-order') return 16
  if (mode === 'toeic-en-ja' || mode === 'toeic-ja-en') return 12
  if (mode === 'toeic-cloze') return 6
  if (mode === 'toeic-must-cloze') return 20
  if (mode === 'toeic-biz-cloze') return 30
  if (
    mode === 'pos-word' ||
    mode === 'phrase-clause' ||
    mode === 'conj-part5'
  ) {
    return 10
  }
  if (
    mode === 'comp-obj' ||
    mode === 'conj-prep' ||
    mode === 'conj-linker' ||
    mode === 'noun-agree'
  ) {
    return 8
  }
  if (
    mode === 'noun-count' ||
    mode === 'noun-plural' ||
    mode === 'noun-quant' ||
    mode === 'prep-place'
  ) {
    return 12
  }
  if (mode === 'prep-time') return 15
  if (mode === 'prep-other' || mode === 'prep-set') return 8
  if (mode === 'html-css-quiz') return 12
  if (mode === 'js-basics-quiz') return 20
  if (
    mode === 'vocab-en-ja' ||
    mode === 'vocab-initials-en' ||
    mode === 'vocab-initials-cloze' ||
    mode === 'cloze'
  ) {
    return 10
  }
  if (isLyricMode(mode)) return lyricQuestionCount(mode)
  if (isPulseMode(mode)) return pulseQuestionCount(mode)
  if (isTagLabMode(mode)) return tagLabQuestionCount(mode)
  if (mode === 'if-build') return ifLabQuestionCount(mode)
  if (mode === 'if-meaning' || mode === 'if-syntax') {
    return ifLabQuestionCount(mode)
  }
  if (mode === 'phrases') return 16
  return 12
}

export function vocabTimeLimit(mode: GameMode): number {
  if (isLyricMode(mode)) return lyricTimeLimit(mode)
  if (isPulseMode(mode)) return pulseTimeLimit(mode)
  if (isTagLabMode(mode)) return tagLabTimeLimit(mode)
  if (isIfLabMode(mode)) return ifLabTimeLimit(mode)
  if (mode === 'vocab-initials' || mode === 'vocab-initials-phrases') return 120
  if (mode === 'vocab-initials-cloze' || mode === 'toeic-ja-en') return 110
  if (
    mode === 'pos-suffix' ||
    mode === 'word-order' ||
    mode === 'conj-part5'
  ) {
    return 100
  }
  if (
    mode === 'pos-word' ||
    mode === 'comp-obj' ||
    mode === 'phrase-clause' ||
    mode === 'conj-prep' ||
    mode === 'conj-linker' ||
    mode === 'noun-count' ||
    mode === 'noun-quant' ||
    mode === 'noun-agree'
  ) {
    return 80
  }
  if (mode === 'noun-plural' || mode === 'prep-time') return 90
  if (mode === 'prep-place') return 85
  if (mode === 'prep-other' || mode === 'prep-set') return 75
  if (mode === 'html-css-quiz') return 90
  if (mode === 'js-basics-quiz') return 120
  if (mode === 'toeic-en-ja') return 90
  if (mode === 'toeic-cloze') return 70
  if (mode === 'toeic-must-cloze') return 140
  if (mode === 'toeic-biz-cloze') return 180
  if (mode === 'vocab-initials-en') return 80
  if (mode === 'cloze') return 100
  if (mode === 'phrases' || mode === 'ing-form') return 90
  return 80
}

export function buildVocabSession(
  progress: Progress,
  mode: GameMode,
): Question[] {
  if (isLyricMode(mode)) return buildLyricSession(progress, mode)
  if (isIfLabMode(mode)) return buildIfLabSession(progress, mode)
  if (isTagLabMode(mode)) return buildTagLabSession(progress, mode)
  if (isPulseMode(mode)) return buildPulseSession(progress, mode)
  if (mode === 'vocab-ja-en') {
    return pickCards(VOCAB_CARDS, progress, vocabQuestionCount(mode)).map((card) =>
      jaToEnQuestion(card),
    )
  }

  if (mode === 'vocab-en-ja') {
    return pickCards(VOCAB_EN_JA_FOCUS, progress, vocabQuestionCount(mode)).map(
      (card) => enToJaQuestion(card),
    )
  }

  if (mode === 'cloze') {
    return pickCards(CLOZE_CARDS, progress, vocabQuestionCount(mode)).map((card) =>
      clozeQuestion(card),
    )
  }

  if (mode === 'ing-form') {
    return pickCards(ING_CARDS, progress, vocabQuestionCount(mode)).map((card) =>
      ingQuestion(card),
    )
  }

  if (mode === 'vocab-initials') {
    return pickCards(INITIAL_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => initialQuestion(card),
    )
  }

  if (mode === 'vocab-initials-en') {
    return pickCards(INITIAL_EN_JA_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => initialQuestion(card),
    )
  }

  if (mode === 'vocab-initials-cloze') {
    return pickCards(INITIAL_CLOZE_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => initialClozeQuestion(card),
    )
  }

  if (mode === 'vocab-initials-phrases') {
    return pickCards(
      INITIAL_PHRASE_EN_JA_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) => initialQuestion(card))
  }

  if (mode === 'toeic-en-ja') {
    return pickCards(
      INITIAL_TOEIC_EN_JA_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) => initialQuestion(card))
  }

  if (mode === 'toeic-ja-en') {
    return pickCards(
      INITIAL_TOEIC_JA_EN_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) => initialQuestion(card))
  }

  if (mode === 'toeic-cloze') {
    return pickCards(
      INITIAL_TOEIC_CLOZE_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) => initialClozeQuestion(card))
  }

  if (mode === 'toeic-must-cloze') {
    return pickCards(
      TOEIC_MUST_CLOZE_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) =>
      initialClozeQuestion(card, false, 'TOEIC必須', '文章穴埋め（英）'),
    )
  }

  if (mode === 'toeic-biz-cloze') {
    return pickCards(
      TOEIC_BIZ_CLOZE_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) =>
      initialClozeQuestion(card, false, 'FOR BIZ', '文章穴埋め（英）'),
    )
  }

  if (mode === 'pos-suffix') {
    return pickCards(SUFFIX_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => suffixPosQuestion(card),
    )
  }

  if (mode === 'pos-word') {
    return pickCards(POS_WORD_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => wordPosQuestion(card),
    )
  }

  if (mode === 'word-order') {
    return pickCards(WORD_ORDER_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => wordOrderQuestion(card),
    )
  }

  if (mode === 'comp-obj') {
    return pickCards(COMP_OBJ_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => compObjQuestion(card),
    )
  }

  if (mode === 'phrase-clause') {
    return pickCards(PHRASE_CLAUSE_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => phraseClauseQuestion(card),
    )
  }

  if (mode === 'conj-prep') {
    return pickCards(CONJ_PREP_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => conjChoiceQuestion(card),
    )
  }

  if (mode === 'conj-part5') {
    return pickCards(CONJ_PART5_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => conjChoiceQuestion(card),
    )
  }

  if (mode === 'conj-linker') {
    return pickCards(LINKER_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => linkerQuestion(card),
    )
  }

  if (mode === 'noun-count') {
    return pickCards(COUNT_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => countQuestion(card),
    )
  }

  if (mode === 'noun-plural') {
    return pickCards(PLURAL_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => pluralQuestion(card),
    )
  }

  if (mode === 'noun-quant') {
    return pickCards(QUANT_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => quantQuestion(card),
    )
  }

  if (mode === 'noun-agree') {
    return pickCards(AGREE_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => agreeQuestion(card),
    )
  }

  if (mode === 'prep-time') {
    return pickCards(PREP_TIME_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => prepQuestion(card),
    )
  }

  if (mode === 'prep-place') {
    return pickCards(PREP_PLACE_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => prepQuestion(card),
    )
  }

  if (mode === 'prep-other') {
    return pickCards(PREP_OTHER_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => prepQuestion(card),
    )
  }

  if (mode === 'prep-set') {
    return pickCards(PREP_SET_CARDS, progress, vocabQuestionCount(mode)).map(
      (card) => prepQuestion(card),
    )
  }

  if (mode === 'html-css-quiz') {
    return pickCards(
      HTML_CSS_QUIZ_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) =>
      conjChoiceQuestion(card, false, 'HTML/CSS', '判別ドリル'),
    )
  }

  if (mode === 'js-basics-quiz') {
    return pickCards(
      JS_BASICS_QUIZ_CARDS,
      progress,
      vocabQuestionCount(mode),
    ).map((card) =>
      conjChoiceQuestion(card, false, 'JavaScript', '基礎ドリル'),
    )
  }

  // phrases: prioritize must-know, mix directions
  const priority = PHRASE_CARDS.filter((c) => c.priority)
  const rest = PHRASE_CARDS.filter((c) => !c.priority)
  const count = vocabQuestionCount(mode)
  const priorityPick = pickCards(priority, progress, Math.min(8, priority.length))
  const restPick = pickCards(
    rest,
    progress,
    Math.max(0, count - priorityPick.length),
  )
  const cards = shuffle([...priorityPick, ...restPick]).slice(0, count)

  return cards.map((card, index) =>
    index % 2 === 0 ? jaToEnQuestion(card) : enToJaQuestion(card),
  )
}

export function createVocabRecoveryQuestion(question: Question): Question {
  if (question.type === 'lyric') {
    return createLyricRecoveryQuestion(question)
  }
  if (question.type === 'if-lab') {
    return createIfLabRecoveryQuestion(question)
  }
  if (question.type === 'tag-lab') {
    return createTagLabRecoveryQuestion(question)
  }
  if (question.type === 'pulse') {
    return createPulseRecoveryQuestion(question)
  }
  if (question.type === 'ing-classify') {
    const card = ING_CARDS.find((c) => c.id === question.itemId)
    if (card) return ingQuestion(card, true)
  }

  if (question.type === 'pos-classify') {
    const suffixCard = SUFFIX_CARDS.find((c) => c.id === question.itemId)
    if (suffixCard) return suffixPosQuestion(suffixCard, true)
    const wordCard = POS_WORD_CARDS.find((c) => c.id === question.itemId)
    if (wordCard) return wordPosQuestion(wordCard, true)
  }

  if (question.type === 'word-order-classify') {
    const card = WORD_ORDER_CARDS.find((c) => c.id === question.itemId)
    if (card) return wordOrderQuestion(card, true)
  }

  if (question.type === 'comp-obj-classify') {
    const card = COMP_OBJ_CARDS.find((c) => c.id === question.itemId)
    if (card) return compObjQuestion(card, true)
  }

  if (question.type === 'phrase-clause-classify') {
    const card = PHRASE_CLAUSE_CARDS.find((c) => c.id === question.itemId)
    if (card) return phraseClauseQuestion(card, true)
  }

  if (question.type === 'conj-choice') {
    const prepCard =
      PREP_TIME_CARDS.find((c) => c.id === question.itemId) ??
      PREP_PLACE_CARDS.find((c) => c.id === question.itemId) ??
      PREP_OTHER_CARDS.find((c) => c.id === question.itemId) ??
      PREP_SET_CARDS.find((c) => c.id === question.itemId)
    if (prepCard) return prepQuestion(prepCard, true)

    const card =
      CONJ_PREP_CARDS.find((c) => c.id === question.itemId) ??
      CONJ_PART5_CARDS.find((c) => c.id === question.itemId)
    if (card) return conjChoiceQuestion(card, true)

    const htmlCard = HTML_CSS_QUIZ_CARDS.find((c) => c.id === question.itemId)
    if (htmlCard) {
      return conjChoiceQuestion(htmlCard, true, 'HTML/CSS', '判別ドリル')
    }
    const jsCard = JS_BASICS_QUIZ_CARDS.find((c) => c.id === question.itemId)
    if (jsCard) {
      return conjChoiceQuestion(jsCard, true, 'JavaScript', '基礎ドリル')
    }
  }

  if (question.type === 'linker-classify') {
    const card = LINKER_CARDS.find((c) => c.id === question.itemId)
    if (card) return linkerQuestion(card, true)
  }

  if (question.type === 'count-classify') {
    const card = COUNT_CARDS.find((c) => c.id === question.itemId)
    if (card) return countQuestion(card, true)
  }

  if (question.type === 'quant-choice') {
    const card = QUANT_CARDS.find((c) => c.id === question.itemId)
    if (card) return quantQuestion(card, true)
  }

  if (question.type === 'agree-choice') {
    const card = AGREE_CARDS.find((c) => c.id === question.itemId)
    if (card) return agreeQuestion(card, true)
  }

  if (question.type === 'initial-type') {
    const pluralCard = PLURAL_CARDS.find((c) => c.id === question.itemId)
    if (pluralCard) return pluralQuestion(pluralCard, true)

    const mustCard = TOEIC_MUST_CLOZE_CARDS.find((c) => c.id === question.itemId)
    if (mustCard) {
      return initialClozeQuestion(mustCard, true, 'TOEIC必須', '文章穴埋め（英）')
    }
    const bizCard = TOEIC_BIZ_CLOZE_CARDS.find((c) => c.id === question.itemId)
    if (bizCard) {
      return initialClozeQuestion(bizCard, true, 'FOR BIZ', '文章穴埋め（英）')
    }

    const clozeCard =
      INITIAL_CLOZE_CARDS.find((c) => c.id === question.itemId) ??
      INITIAL_TOEIC_CLOZE_CARDS.find((c) => c.id === question.itemId)
    if (clozeCard) return initialClozeQuestion(clozeCard, true)

    const card =
      INITIAL_CARDS.find((c) => c.id === question.itemId) ??
      INITIAL_EN_JA_CARDS.find((c) => c.id === question.itemId) ??
      INITIAL_PHRASE_EN_JA_CARDS.find((c) => c.id === question.itemId) ??
      INITIAL_TOEIC_EN_JA_CARDS.find((c) => c.id === question.itemId) ??
      INITIAL_TOEIC_JA_EN_CARDS.find((c) => c.id === question.itemId)
    if (card) return initialQuestion(card, true)
  }

  if (question.type === 'cloze-en-to-ja') {
    const card = CLOZE_CARDS.find((c) => c.id === question.itemId)
    if (card) return clozeQuestion(card, true)
  }

  const vocab =
    VOCAB_CARDS.find((c) => c.id === question.itemId) ??
    VOCAB_EN_JA_FOCUS.find((c) => c.id === question.itemId)
  if (vocab) {
    return question.type === 'ja-to-en'
      ? jaToEnQuestion(vocab, true)
      : enToJaQuestion(vocab, true)
  }

  const phraseCard = PHRASE_CARDS.find((c) => c.id === question.itemId)
  if (phraseCard) {
    return question.type === 'ja-to-en'
      ? jaToEnQuestion(phraseCard, true)
      : enToJaQuestion(phraseCard, true)
  }

  return { ...question, isRecovery: true, id: `${question.id}-recovery` }
}
