import {
  MEANING_ANSWERS,
  SYNTAX_ANSWERS,
  TAG_LAB_KINDS,
  buildTagPrompt,
  rollTagLab,
} from '../data/tagLab'
import type {
  GameMode,
  Progress,
  Question,
  TagLabKind,
  TagLabStage,
  TagToken,
} from './types'

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function isTagLabMode(mode: GameMode): boolean {
  return mode === 'tag-meaning' || mode === 'tag-syntax' || mode === 'tag-build'
}

export function tagLabQuestionCount(mode: GameMode): number {
  if (mode === 'tag-build') return 10
  return 12
}

export function tagLabTimeLimit(mode: GameMode): number {
  if (mode === 'tag-build') return 120
  if (mode === 'tag-syntax') return 100
  return 110
}

function stageForMode(mode: GameMode): TagLabStage {
  if (mode === 'tag-syntax') return 'syntax'
  if (mode === 'tag-build') return 'build'
  return 'meaning'
}

function chipFor(stage: TagLabStage): string {
  if (stage === 'meaning') return 'Meaning'
  if (stage === 'syntax') return 'Syntax'
  return 'Build'
}

export function createTagLabQuestion(
  kind: TagLabKind,
  stage: TagLabStage,
  isRecovery = false,
): Question {
  const spec = rollTagLab(kind, stage)
  const body = buildTagPrompt(spec)
  return {
    id: `tag-${kind}-${stage}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId: `tag-${kind}`,
    chip: chipFor(stage),
    type: 'tag-lab',
    prompt: body.prompt,
    hint: body.hint,
    answer: body.answer,
    acceptAnswers: body.acceptAnswers,
    choices: [],
    isRecovery,
    subtitle: body.subtitle,
    note: body.note,
    tagLab: spec,
  }
}

export function buildTagLabSession(
  _progress: Progress,
  mode: GameMode,
): Question[] {
  const stage = stageForMode(mode)
  const count = tagLabQuestionCount(mode)
  const kinds = shuffle(
    Array.from({ length: Math.ceil(count / TAG_LAB_KINDS.length) }, () =>
      shuffle(TAG_LAB_KINDS),
    ).flat(),
  ).slice(0, count)

  return kinds.map((kind) => createTagLabQuestion(kind, stage))
}

export function createTagLabRecoveryQuestion(question: Question): Question {
  const spec = question.tagLab
  if (!spec) {
    return { ...question, isRecovery: true, id: `${question.id}-recovery` }
  }
  return createTagLabQuestion(spec.kind, spec.stage, true)
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/display\s*:\s*/g, '')
    .replace(/[<>]/g, '')
    .replace(/;$/, '')
}

const TOKEN_ORDER: TagToken[] = [
  'header',
  'footer',
  'password',
  'required',
  'padding',
  'margin',
  'center',
  'label',
  'email',
  'copy',
  'body',
  'main',
  'flex',
  'th',
  'td',
  'tr',
]

export function parseTagLabInput(raw: string): TagToken | null {
  const key = normalize(raw)
  if (!key) return null

  if (
    key === 'margin: 0 auto' ||
    key === 'margin:0 auto' ||
    key === '0 auto'
  ) {
    return 'center'
  }
  if (key === '&copy' || key === 'copyright' || key === 'copy') return 'copy'
  if (key === 'table row' || key === 'row') return 'tr'
  if (key === 'table header' || key === 'header cell') return 'th'
  if (key === 'the header') return 'header'
  if (key === 'table data' || key === 'data cell') return 'td'
  if (key === 'outside') return 'margin'
  if (key === 'inside') return 'padding'
  if (key === 'auto' || key === 'center') return 'center'
  if (key === 'type="password"' || key === 'type=password') return 'password'
  if (key === 'type="email"' || key === 'type=email') return 'email'
  if (key === 'for') return 'label'

  for (const token of TOKEN_ORDER) {
    if (key === token) return token
    const meaningHit = MEANING_ANSWERS[token].some((a) => normalize(a) === key)
    const syntaxHit = SYNTAX_ANSWERS[token].some((a) => normalize(a) === key)
    if (meaningHit || syntaxHit) return token
  }
  return null
}

export function liveTagToken(typed: string): TagToken | null {
  return parseTagLabInput(typed)
}

export function isTagLabAnswerCorrect(
  question: Question,
  choice: string,
): boolean {
  const spec = question.tagLab
  if (!spec) return false

  const normalized = normalize(choice)
  const listed = question.acceptAnswers.some((a) => normalize(a) === normalized)
  if (spec.stage === 'meaning' || spec.stage === 'syntax') return listed

  const live = parseTagLabInput(choice)
  return listed || live === spec.token
}
