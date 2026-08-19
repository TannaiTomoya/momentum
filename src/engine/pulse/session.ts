import type {
  GameMode,
  Progress,
  PulseClip,
  PulseGenre,
  PulseKind,
  PulsePattern,
  PulseSpec,
  PulseStage,
  Question,
} from '../types'
import {
  DANCE_BPMS,
  PULSE_GENRES,
  emptyPattern,
  parsePulseCode,
  parseSteps,
  stringifyPattern,
} from './pattern'
import { judgePulse } from './score'

const KINDS: PulseKind[] = [
  'kick4',
  'syncopation',
  'hat8',
  'humanize',
  'groove',
]

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function isPulseMode(mode: GameMode): boolean {
  return (
    mode === 'pulse-meaning' ||
    mode === 'pulse-syntax' ||
    mode === 'pulse-build'
  )
}

export function pulseQuestionCount(mode: GameMode): number {
  if (mode === 'pulse-build') return 8
  return 10
}

export function pulseTimeLimit(mode: GameMode): number {
  if (mode === 'pulse-build') return 140
  if (mode === 'pulse-syntax') return 120
  return 130
}

function stageForMode(mode: GameMode): PulseStage {
  if (mode === 'pulse-syntax') return 'syntax'
  if (mode === 'pulse-build') return 'build'
  return 'meaning'
}

export function genreLabel(genre: PulseGenre): string {
  if (genre === 'breaks') return 'breaks'
  if (genre === 'ukg') return 'ukg'
  return 'house'
}

function bpmWeakness(progress: Progress, bpm: number): number {
  let score = 0
  for (const [id, stats] of Object.entries(progress.wordStats)) {
    if (!id.startsWith('pulse-') || !id.endsWith(`-${bpm}`)) continue
    score += stats.wrong * 3 - stats.correct
  }
  return score
}

function pickBpm(progress: Progress, late: boolean): number {
  const pool: number[] = late ? [112, 120, 128] : [...DANCE_BPMS]
  if (Math.random() >= 0.45) return pick(pool)
  const ranked = [...pool].sort(
    (a, b) => bpmWeakness(progress, b) - bpmWeakness(progress, a),
  )
  return ranked[0] ?? pick(pool)
}

function pickGenre(late: boolean): PulseGenre {
  if (late && Math.random() < 0.5) return pick(['breaks', 'ukg'] as PulseGenre[])
  return pick(PULSE_GENRES)
}

function pickKind(late: boolean, stage: PulseStage): PulseKind {
  if (late || stage === 'build') {
    return pick(['humanize', 'groove', 'syncopation', 'kick4'] as PulseKind[])
  }
  return pick(KINDS)
}

function fourKick(): boolean[] {
  return parseSteps('x---x---x---x---')
}

function applyGenre(pattern: PulsePattern, kind: PulseKind): PulsePattern {
  if (pattern.genre === 'house') {
    if (kind === 'hat8' || kind === 'kick4') {
      pattern.hat = parseSteps('x-x-x-x-x-x-x-x-')
    }
  }
  if (pattern.genre === 'breaks') {
    pattern.snare = parseSteps('----x-------x---')
    if (kind === 'syncopation') {
      pattern.hat = parseSteps('-x-x---x-x-x---x')
    }
  }
  if (pattern.genre === 'ukg') {
    pattern.hat = parseSteps('x--xx--xx--xx--x')
    if (kind === 'syncopation') {
      pattern.snare = parseSteps('------x-------x-')
    }
  }
  return pattern
}

function makeTarget(
  kind: PulseKind,
  bpm: number,
  genre: PulseGenre,
): PulsePattern {
  const pattern = emptyPattern(bpm, genre)
  pattern.kick = fourKick()
  if (kind === 'syncopation') {
    pattern.hat = parseSteps('-x-x-x-x-x-x-x-x')
  }
  if (kind === 'hat8') {
    pattern.hat = parseSteps('x-x-x-x-x-x-x-x-')
  }
  if (kind === 'humanize' || kind === 'groove') {
    pattern.humanizeMs = pick([8, 12, 16, 20])
    pattern.velocity = 0.25
  }
  applyGenre(pattern, kind)
  return pattern
}

function promptFor(
  kind: PulseKind,
  stage: PulseStage,
  bpm: number,
  genre: PulseGenre,
): string {
  const head = `${bpm} BPM · ${genreLabel(genre)}（選べない）`
  if (stage === 'meaning') {
    return `${head}。聴いたパターンをコードで書いてください。`
  }
  switch (kind) {
    case 'kick4':
      return `${head}。4つ打ちのキックをコードで作れ。`
    case 'syncopation':
      return `${head}。裏拍（奇数ステップ）に音を置け。`
    case 'hat8':
      return `${head}。ハットを8つ以上並べろ。`
    case 'humanize':
      return `${head}。4つ打ちに humanize を足して、機械感を外せ。`
    case 'groove':
      return `${head}。キック4つ打ち＋揺らぎでグルーブにしろ。`
  }
}

function starterFor(kind: PulseKind, stage: PulseStage, bpm: number): string {
  if (stage === 'build') {
    return `bpm(${bpm})\nkick("x---x---x---x---")\n// キックは選び直せる。次に humanize を選ぶ\n`
  }
  if (stage === 'syntax') {
    if (kind === 'humanize' || kind === 'groove') {
      return `bpm(${bpm})\nkick("x---x---x---x---")\n`
    }
    if (kind === 'syncopation' || kind === 'hat8') {
      return `bpm(${bpm})\nkick("x---x---x---x---")\n`
    }
    return `bpm(${bpm})\n`
  }
  return `bpm(${bpm})\n// 聴いてから kick("....") を書く。BPM は変えられない\n`
}

function noteFor(kind: PulseKind, requireGroove: boolean): string {
  const groove = requireGroove
    ? ' Syntax/Build は humanize なしでは通らない。'
    : ''
  switch (kind) {
    case 'kick4':
      return `kick("x---x---x---x---") が4つ打ち。${groove}`
    case 'syncopation':
      return `hat("-x-x-x-x-x-x-x-x") のように裏から始める。${groove}`
    case 'hat8':
      return `hat("x-x-x-x-x-x-x-x-") など。${groove}`
    case 'humanize':
      return 'humanize(8〜24) と velocity(0.2)。正確すぎると不合格。'
    case 'groove':
      return '格子の上にズレを乗せる。humanize なしでは満点にならない。'
  }
}

function chip(stage: PulseStage): string {
  if (stage === 'meaning') return 'Meaning'
  if (stage === 'syntax') return 'Syntax'
  return 'Build'
}

export function createPulseQuestion(
  kind: PulseKind,
  stage: PulseStage,
  isRecovery = false,
  extras?: { bpm?: number; genre?: PulseGenre; progress?: Progress; late?: boolean },
): Question {
  const bpm =
    extras?.bpm ??
    pickBpm(
      extras?.progress ?? {
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
          pulseSyntax: false,
          pulseBuild: false,
        },
      },
      extras?.late ?? false,
    )
  const genre = extras?.genre ?? pickGenre(extras?.late ?? false)
  const requireGroove = stage !== 'meaning' || kind === 'humanize' || kind === 'groove'
  const target = makeTarget(kind, bpm, genre)
  if (requireGroove && stage === 'meaning') {
    target.humanizeMs = target.humanizeMs || pick([8, 12, 16])
    target.velocity = Math.max(target.velocity, 0.2)
  }
  const spec: PulseSpec = {
    kind,
    stage,
    bpm,
    genre,
    starter: starterFor(kind, stage, bpm),
    requireGroove,
    target: stage === 'meaning' ? target : undefined,
  }
  const sample = stringifyPattern(target)
  return {
    id: `pulse-${kind}-${stage}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId: `pulse-${kind}-${bpm}`,
    chip: chip(stage),
    type: 'pulse',
    prompt: promptFor(kind, stage, bpm, genre),
    hint: `${genreLabel(genre)} · ${bpm} BPM`,
    answer: sample,
    acceptAnswers: [sample],
    choices: [],
    isRecovery,
    subtitle: 'BPM / ジャンルはお題固定。kick / snare / hat / humanize',
    note: noteFor(kind, requireGroove),
    pulse: spec,
  }
}

export function buildPulseSession(
  progress: Progress,
  mode: GameMode,
): Question[] {
  const stage = stageForMode(mode)
  const count = pulseQuestionCount(mode)
  const questions: Question[] = []
  for (let i = 0; i < count; i += 1) {
    const late = i >= Math.floor(count / 2)
    const kind = pickKind(late, stage)
    questions.push(
      createPulseQuestion(kind, stage, false, { progress, late }),
    )
  }
  return questions
}

export function createPulseRecoveryQuestion(question: Question): Question {
  const spec = question.pulse
  if (!spec) {
    return { ...question, isRecovery: true, id: `${question.id}-recovery` }
  }
  return createPulseQuestion(spec.kind, spec.stage, true, {
    bpm: spec.bpm,
    genre: spec.genre,
  })
}

export function parseLockedPulse(
  code: string,
  spec: PulseSpec,
): PulsePattern | { error: string } {
  return parsePulseCode(code, spec.bpm, { lockBpm: true, genre: spec.genre })
}

export function isPulseAnswerCorrect(question: Question, code: string): boolean {
  const spec = question.pulse
  if (!spec) return false
  const parsed = parseLockedPulse(code, spec)
  if ('error' in parsed) return false
  parsed.bpm = spec.bpm
  parsed.genre = spec.genre
  return judgePulse(
    spec.kind,
    parsed,
    spec.stage === 'meaning' ? spec.target : undefined,
    spec.requireGroove,
  ).ok
}

export function stringifyPulseTrack(clips: PulseClip[]): string {
  return clips
    .map(
      (clip, index) =>
        `// ${index + 1}. ${clip.genre} ${clip.bpm} BPM · ${clip.kind}\n${clip.code.trim()}`,
    )
    .join('\n\n')
}

export function clipsToPatterns(clips: PulseClip[]): PulsePattern[] {
  return clips.map((clip) => {
    const parsed = parsePulseCode(clip.code, clip.bpm, {
      lockBpm: true,
      genre: clip.genre,
    })
    if ('error' in parsed) return emptyPattern(clip.bpm, clip.genre)
    parsed.bpm = clip.bpm
    parsed.genre = clip.genre
    return parsed
  })
}
