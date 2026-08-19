import {
  AND_ANSWERS,
  ENGLISH_FOR_OP,
  IF_LAB_KINDS,
  buildPrompt,
  evaluateSpec,
  rollIfLab,
  widgetTitle,
} from '../data/ifLab'
import type {
  GameMode,
  IfLabKind,
  IfLabOp,
  IfLabSpec,
  IfLabStage,
  Progress,
  Question,
} from './types'

const COMPARE_OPS: Exclude<IfLabOp, '&&'>[] = [
  '===',
  '!==',
  '<=',
  '>=',
  '<',
  '>',
]

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function isIfLabMode(mode: GameMode): boolean {
  return mode === 'if-meaning' || mode === 'if-syntax' || mode === 'if-build'
}

export function ifLabQuestionCount(mode: GameMode): number {
  if (mode === 'if-build') return 10
  return 12
}

export function ifLabTimeLimit(mode: GameMode): number {
  if (mode === 'if-build') return 120
  if (mode === 'if-syntax') return 100
  return 110
}

function stageForMode(mode: GameMode): IfLabStage {
  if (mode === 'if-syntax') return 'syntax'
  if (mode === 'if-build') return 'build'
  return 'meaning'
}

function chipFor(stage: IfLabStage): string {
  if (stage === 'meaning') return 'Meaning'
  if (stage === 'syntax') return 'Syntax'
  return 'Build'
}

export function createIfLabQuestion(
  kind: IfLabKind,
  stage: IfLabStage,
  isRecovery = false,
): Question {
  const spec = rollIfLab(kind, stage)
  const body = buildPrompt(spec)
  return {
    id: `if-${kind}-${stage}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId: `if-${kind}`,
    chip: chipFor(stage),
    type: 'if-lab',
    prompt: body.prompt,
    hint: body.hint,
    answer: body.answer,
    acceptAnswers: body.acceptAnswers,
    choices: [],
    isRecovery,
    subtitle: `${widgetTitle(kind)} · ${body.subtitle}`,
    note: body.note,
    ifLab: spec,
  }
}

export function buildIfLabSession(
  _progress: Progress,
  mode: GameMode,
): Question[] {
  const stage = stageForMode(mode)
  const count = ifLabQuestionCount(mode)
  const kinds = shuffle(
    Array.from({ length: Math.ceil(count / IF_LAB_KINDS.length) }, () =>
      shuffle(IF_LAB_KINDS),
    ).flat(),
  ).slice(0, count)

  return kinds.map((kind) => createIfLabQuestion(kind, stage))
}

export function createIfLabRecoveryQuestion(question: Question): Question {
  const spec = question.ifLab
  if (!spec) return { ...question, isRecovery: true, id: `${question.id}-recovery` }
  return createIfLabQuestion(spec.kind, spec.stage, true)
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function parseRight(raw: string): string | number {
  const trimmed = raw.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  if (trimmed === 'true') return 'true'
  if (trimmed === 'false') return 'false'
  if (trimmed !== '' && !Number.isNaN(Number(trimmed))) return Number(trimmed)
  return trimmed
}

export type ParsedIfLab = {
  op: IfLabOp
  right?: string | number
}

export function parseIfLabInput(
  spec: IfLabSpec,
  raw: string,
): ParsedIfLab | null {
  const text = raw.trim()
  if (!text) return null

  if (spec.stage === 'meaning') {
    const key = normalize(text)
    if (spec.kind === 'member') {
      return AND_ANSWERS.includes(key) ? { op: '&&' } : null
    }
    for (const op of COMPARE_OPS) {
      if (ENGLISH_FOR_OP[op].some((phrase) => normalize(phrase) === key)) {
        return { op }
      }
    }
    return null
  }

  if (spec.stage === 'syntax') {
    if (spec.kind === 'member') {
      return text === '&&' ? { op: '&&' } : null
    }
    const op = COMPARE_OPS.find((item) => item === text)
    return op ? { op } : null
  }

  const andMatch = text.match(
    /^(age)\s*(>=|>)\s*([^\s&]+)\s*&&\s*(isMember)$/i,
  )
  if (andMatch) {
    return { op: '&&', right: parseRight(andMatch[3]) }
  }

  const full = text.match(
    /^(age|score|stock|input|temperature|count)\s*(===|!==|<=|>=|<|>)\s*(.+)$/i,
  )
  if (full) {
    const op = full[2] as Exclude<IfLabOp, '&&'>
    return { op, right: parseRight(full[3]) }
  }

  const short = text.match(/^(===|!==|<=|>=|<|>)\s*(.+)$/)
  if (short) {
    const op = short[1] as Exclude<IfLabOp, '&&'>
    return { op, right: parseRight(short[2]) }
  }

  return null
}

export function liveFeatureOn(
  spec: IfLabSpec,
  typed: string,
): boolean | null {
  const parsed = parseIfLabInput(spec, typed)
  if (!parsed) return null
  if (spec.kind === 'member') {
    if (parsed.op !== '&&') return false
    const threshold = parsed.right ?? spec.threshold
    const ageOk = Number(spec.current) >= Number(threshold)
    return ageOk && Boolean(spec.andCurrent)
  }
  const right = parsed.right ?? spec.threshold
  if (parsed.op === '&&') return false
  return evaluateSpec({ ...spec, operator: parsed.op }, parsed.op, right)
}

function sameVariable(input: string, spec: IfLabSpec): boolean {
  const text = input.trim()
  if (spec.kind === 'member') {
    return /age/i.test(text) && /isMember/i.test(text) && /&&/.test(text)
  }
  const prefix = new RegExp(`^${spec.variable}\\b`, 'i')
  const short = /^(===|!==|<=|>=|<|>)\s*/
  return prefix.test(text) || short.test(text)
}

export function isIfLabAnswerCorrect(question: Question, choice: string): boolean {
  const spec = question.ifLab
  if (!spec) return false

  if (spec.stage === 'meaning' || spec.stage === 'syntax') {
    const normalized = normalize(choice)
    return question.acceptAnswers.some((a) => normalize(a) === normalized)
  }

  const parsed = parseIfLabInput(spec, choice)
  if (!parsed || !sameVariable(choice, spec)) return false
  const on = liveFeatureOn(spec, choice)
  if (on === null) return false
  return on === spec.goalOn
}
