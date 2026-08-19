import { lyricWordPool, type LyricWord } from '../../data/lyric'
import {
  LYRIC_GRAMMAR_CARDS,
  type LyricGrammarCard,
} from '../../data/lyricGrammar'
import { getWordStats } from '../scheduler'
import type {
  GameMode,
  LyricClip,
  LyricRide,
  LyricSpec,
  Progress,
  Question,
} from '../types'
import { judgeLyric } from './score'
import {
  emptyLyric,
  LYRIC_BPMS,
  parseLyricCode,
  rideSteps,
  stringifyLyric,
  type LyricPattern,
} from './pattern'

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function isLabId(id: string): boolean {
  return (
    id.startsWith('pulse-') ||
    id.startsWith('if-') ||
    id.startsWith('tag-') ||
    id.startsWith('lyric-')
  )
}

function pickBpm(): number {
  return pick(LYRIC_BPMS)
}

function pickRide(late: boolean): LyricRide {
  if (late) return Math.random() < 0.55 ? 'off' : 'on'
  return Math.random() < 0.7 ? 'on' : 'off'
}

function pickWords(progress: Progress, count: number): LyricWord[] {
  const pool = lyricWordPool().filter((word) => !isLabId(word.id))
  const now = Date.now()
  const ranked = [...pool].sort((a, b) => {
    const sa = getWordStats(progress, a.id)
    const sb = getWordStats(progress, b.id)
    const scoreA =
      sa.wrong * 3 - sa.correct + Math.max(0, now - sa.nextDue) / 1000
    const scoreB =
      sb.wrong * 3 - sb.correct + Math.max(0, now - sb.nextDue) / 1000
    return scoreB - scoreA
  })
  const picked: LyricWord[] = []
  const used = new Set<string>()
  for (const word of ranked) {
    if (used.has(word.en.toLowerCase())) continue
    used.add(word.en.toLowerCase())
    picked.push(word)
    if (picked.length >= count) break
  }
  while (picked.length < count && pool.length > 0) {
    picked.push(pick(pool))
  }
  return picked
}

function stageForMode(mode: GameMode): LyricSpec['stage'] {
  if (mode === 'lyric-grammar') return 'grammar'
  if (mode === 'lyric-syntax') return 'syntax'
  if (mode === 'lyric-build') return 'build'
  return 'meaning'
}

export function isLyricMode(mode: GameMode): boolean {
  return (
    mode === 'lyric-meaning' ||
    mode === 'lyric-syntax' ||
    mode === 'lyric-build' ||
    mode === 'lyric-grammar'
  )
}

export function lyricQuestionCount(mode: GameMode): number {
  if (mode === 'lyric-build') return 8
  return 10
}

export function lyricTimeLimit(mode: GameMode): number {
  if (mode === 'lyric-grammar') return 160
  if (mode === 'lyric-build') return 140
  if (mode === 'lyric-syntax') return 120
  return 130
}

function starterFor(
  stage: LyricSpec['stage'],
  bpm: number,
  word: string,
): string {
  const head = `bpm(${bpm})\nkick("x---x---x---x---")\n`
  if (stage === 'grammar') {
    return `${head}// 英文と16歩を lyric("英文", "16歩") に書く\n`
  }
  if (stage === 'build') {
    return `${head}// BPM とキックは固定。lyric("語", "16歩") を書く\n`
  }
  if (stage === 'syntax') {
    return `${head}lyric("${word}", "----------------")\n`
  }
  return `${head}// 意味に合う語を lyric("....") で書く。BPM / キックは変えられない\n`
}

function promptFor(
  stage: LyricSpec['stage'],
  bpm: number,
  word: LyricWord,
  ride: LyricRide,
): string {
  const head = `${bpm} BPM（選べない）`
  const rideJa = ride === 'on' ? 'オンビート（偶数）' : '裏（奇数）'
  if (stage === 'meaning') {
    return `${head}。「${word.ja}」を lyric() に書け。`
  }
  if (stage === 'syntax') {
    return `${head}。${word.en} を ${rideJa} に置け。`
  }
  return `${head}。${word.en}（${word.ja}）を ${rideJa} に乗せて書け。`
}

function noteFor(stage: LyricSpec['stage'], ride: LyricRide): string {
  if (stage === 'meaning') return 'kick はお題固定。語だけ合えば通る。'
  return ride === 'on'
    ? 'lyric("語", "x-x-x-x-x-x-x-x-") のように偶数に x。humanize は不要。'
    : 'lyric("語", "-x-x-x-x-x-x-x-x") のように奇数に x。humanize は不要。'
}

function chip(stage: LyricSpec['stage']): string {
  if (stage === 'meaning') return 'Meaning'
  if (stage === 'syntax') return 'Syntax'
  if (stage === 'grammar') return 'Grammar'
  return 'Build'
}

function pickGrammarCards(
  progress: Progress,
  count: number,
): LyricGrammarCard[] {
  const ranked = [...LYRIC_GRAMMAR_CARDS].sort((a, b) => {
    const sa = getWordStats(progress, a.id)
    const sb = getWordStats(progress, b.id)
    const scoreA = sa.wrong * 3 - sa.correct + Math.random()
    const scoreB = sb.wrong * 3 - sb.correct + Math.random()
    return scoreB - scoreA
  })
  return ranked.slice(0, count)
}

function createLyricGrammarQuestion(
  card: LyricGrammarCard,
  isRecovery = false,
  extras?: { bpm?: number; ride?: LyricRide },
): Question {
  const bpm = extras?.bpm ?? pickBpm()
  const ride = extras?.ride ?? pickRide(true)
  const target = emptyLyric(bpm)
  target.word = card.example
  target.steps = rideSteps(ride, false)
  const spec: LyricSpec = {
    stage: 'grammar',
    bpm,
    word: card.cue,
    accept: [card.example],
    ja: card.instruction,
    ride,
    requireRide: true,
    starter: starterFor('grammar', bpm, card.cue),
    grammar: {
      kind: card.kind,
      instruction: card.instruction,
      example: card.example,
      tip: card.tip,
    },
    target,
  }
  const rideJa = ride === 'on' ? 'オンビート（偶数）' : '裏（奇数）'
  return {
    id: `${card.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId: card.id,
    chip: 'Grammar',
    type: 'lyric',
    prompt: `${bpm} BPM（選べない）。${card.instruction} ${rideJa}に乗せろ。`,
    hint: `${card.cue} · ${bpm} BPM`,
    answer: stringifyLyric(target),
    acceptAnswers: [card.example],
    choices: [],
    isRecovery,
    subtitle: '既存の文法を英文に戻し、拍へ置く',
    note: `${card.tip} humanize は不要。`,
    lyric: spec,
  }
}

export function createLyricQuestion(
  word: LyricWord,
  stage: LyricSpec['stage'],
  isRecovery = false,
  extras?: { bpm?: number; ride?: LyricRide; late?: boolean },
): Question {
  const bpm = extras?.bpm ?? pickBpm()
  const ride = extras?.ride ?? pickRide(extras?.late ?? false)
  const requireRide = stage !== 'meaning'
  const target = emptyLyric(bpm)
  target.word = word.en
  target.steps = rideSteps(ride, extras?.late ?? false)
  const spec: LyricSpec = {
    stage,
    bpm,
    word: word.en,
    accept: word.accept,
    ja: word.ja,
    ride,
    requireRide,
    starter: starterFor(stage, bpm, word.en),
    target,
  }
  return {
    id: `lyric-${word.id}-${stage}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId: word.id,
    chip: chip(stage),
    type: 'lyric',
    prompt: promptFor(stage, bpm, word, ride),
    hint: stage === 'meaning' ? `${bpm} BPM` : `${word.en} · ${bpm} BPM`,
    answer: stringifyLyric(target),
    acceptAnswers: word.accept,
    choices: [],
    isRecovery,
    subtitle: 'BPM / キックはお題固定。書くのは lyric()',
    note: noteFor(stage, ride),
    lyric: spec,
  }
}

export function buildLyricSession(
  progress: Progress,
  mode: GameMode,
): Question[] {
  const stage = stageForMode(mode)
  const count = lyricQuestionCount(mode)
  if (stage === 'grammar') {
    return pickGrammarCards(progress, count).map((card) =>
      createLyricGrammarQuestion(card),
    )
  }
  const words = pickWords(progress, count)
  return words.map((word, index) => {
    const late = index >= Math.floor(count / 2)
    return createLyricQuestion(word, stage, false, { late })
  })
}

export function createLyricRecoveryQuestion(question: Question): Question {
  const spec = question.lyric
  if (!spec) {
    return { ...question, isRecovery: true, id: `${question.id}-recovery` }
  }
  if (spec.grammar) {
    const card = LYRIC_GRAMMAR_CARDS.find(
      (item) => item.kind === spec.grammar?.kind,
    )
    if (card) {
      return createLyricGrammarQuestion(card, true, {
        bpm: spec.bpm,
        ride: spec.ride,
      })
    }
  }
  return createLyricQuestion(
    {
      id: question.itemId,
      en: spec.word,
      ja: spec.ja,
      accept: spec.accept,
    },
    spec.stage,
    true,
    { bpm: spec.bpm, ride: spec.ride },
  )
}

export function parseLockedLyric(
  code: string,
  spec: LyricSpec,
): LyricPattern | { error: string } {
  const parsed = parseLyricCode(code, spec.bpm)
  if ('error' in parsed) return parsed
  parsed.bpm = spec.bpm
  return parsed
}

export function isLyricAnswerCorrect(question: Question, code: string): boolean {
  const spec = question.lyric
  if (!spec) return false
  const parsed = parseLockedLyric(code, spec)
  if ('error' in parsed) return false
  return judgeLyric(spec, parsed).ok
}

export function stringifyLyricTrack(clips: LyricClip[]): string {
  return clips
    .map(
      (clip, index) =>
        `// ${index + 1}. ${clip.word} · ${clip.bpm} BPM · ${clip.ride}\n${clip.code.trim()}`,
    )
    .join('\n\n')
}

export function clipsToLyricPatterns(clips: LyricClip[]): LyricPattern[] {
  return clips.map((clip) => {
    const parsed = parseLyricCode(clip.code, clip.bpm)
    if ('error' in parsed) {
      const fallback = emptyLyric(clip.bpm)
      fallback.word = clip.word
      return fallback
    }
    parsed.bpm = clip.bpm
    return parsed
  })
}
