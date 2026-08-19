import type { IfLabKind, IfLabOp, IfLabSpec, IfLabStage } from '../engine/types'

export const IF_LAB_KINDS: IfLabKind[] = [
  'age-gate',
  'score-badge',
  'stock',
  'input-error',
  'weather',
  'cart',
  'member',
]

export const ENGLISH_FOR_OP: Record<Exclude<IfLabOp, '&&'>, string[]> = {
  '<': ['less than', 'is less than'],
  '>': ['greater than', 'is greater than'],
  '>=': ['greater than or equal to', 'greater than or equal', 'at least'],
  '<=': ['less than or equal to', 'less than or equal', 'at most'],
  '===': ['equal to', 'equals', 'is equal to'],
  '!==': ['not equal to', 'is not equal to'],
}

export const AND_ANSWERS = ['and']

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function compare(
  left: string | number | boolean,
  op: Exclude<IfLabOp, '&&'>,
  right: string | number,
): boolean {
  if (typeof left === 'boolean') return false
  if (op === '===') return left === right
  if (op === '!==') return left !== right
  const a = Number(left)
  const b = Number(right)
  if (Number.isNaN(a) || Number.isNaN(b)) return false
  if (op === '<') return a < b
  if (op === '>') return a > b
  if (op === '<=') return a <= b
  return a >= b
}

export function evaluateSpec(
  spec: IfLabSpec,
  op: IfLabOp,
  right: string | number = spec.threshold,
): boolean {
  if (spec.kind === 'member') {
    const ageOk = compare(spec.current, '>=', spec.threshold)
    if (op === '&&') return ageOk && Boolean(spec.andCurrent)
    return false
  }
  if (op === '&&') return false
  return compare(spec.current, op, right)
}

type Roll = Omit<IfLabSpec, 'stage'>

function rollKind(kind: IfLabKind): Roll {
  switch (kind) {
    case 'age-gate': {
      const threshold = pick([15, 16, 17, 19, 21])
      const current = pick([10, 13, 14, 16, 18, 20, 24, 28])
      return {
        kind,
        variable: 'age',
        current,
        threshold,
        operator: '<',
        goalOn: current < threshold,
      }
    }
    case 'score-badge': {
      const threshold = pick([60, 70, 75, 85, 90])
      const current = pick([48, 62, 71, 80, 88, 94])
      return {
        kind,
        variable: 'score',
        current,
        threshold,
        operator: '>=',
        goalOn: current >= threshold,
      }
    }
    case 'stock': {
      const current = pick([0, 1, 2, 4, 9])
      return {
        kind,
        variable: 'stock',
        current,
        threshold: 0,
        operator: '===',
        goalOn: current === 0,
      }
    }
    case 'input-error': {
      const current = pick(['', 'Ken', 'Aya', 'Ren'])
      return {
        kind,
        variable: 'input',
        current,
        threshold: '',
        operator: '===',
        goalOn: current === '',
      }
    }
    case 'weather': {
      const threshold = pick([25, 28, 31, 34])
      const current = pick([12, 22, 26, 29, 33, 36])
      return {
        kind,
        variable: 'temperature',
        current,
        threshold,
        operator: '>=',
        goalOn: current >= threshold,
      }
    }
    case 'cart': {
      const current = pick([0, 1, 2, 5, 12])
      return {
        kind,
        variable: 'count',
        current,
        threshold: 0,
        operator: '!==',
        goalOn: current !== 0,
      }
    }
    case 'member': {
      const threshold = pick([16, 18, 20])
      const current = pick([12, 15, 17, 19, 22, 27])
      const andCurrent = pick([true, false])
      return {
        kind,
        variable: 'age',
        current,
        threshold,
        operator: '&&',
        goalOn: Number(current) >= threshold && andCurrent,
        andVariable: 'isMember',
        andCurrent,
      }
    }
  }
}

export function rollIfLab(kind: IfLabKind, stage: IfLabStage): IfLabSpec {
  return { ...rollKind(kind), stage }
}

export function widgetTitle(kind: IfLabKind): string {
  switch (kind) {
    case 'age-gate':
      return '年齢ゲート'
    case 'score-badge':
      return '成績バッジ'
    case 'stock':
      return '在庫ラベル'
    case 'input-error':
      return '未入力エラー'
    case 'weather':
      return '気象アラート'
    case 'cart':
      return 'カートバッジ'
    case 'member':
      return '会員価格'
  }
}

export function featureLabel(kind: IfLabKind, on: boolean): string {
  switch (kind) {
    case 'age-gate':
      return on ? '視聴不可' : '視聴できる'
    case 'score-badge':
      return on ? '優が点灯' : '優は消灯'
    case 'stock':
      return on ? '売り切れ' : '購入できる'
    case 'input-error':
      return on ? '必須エラー' : '入力OK'
    case 'weather':
      return on ? '猛暑バナー' : '通常表示'
    case 'cart':
      return on ? 'バッジ表示' : 'バッジなし'
    case 'member':
      return on ? '会員料金' : '会員料金ではない'
  }
}

function quote(value: string | number | boolean): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

export function buildPrompt(spec: IfLabSpec): {
  prompt: string
  subtitle: string
  answer: string
  acceptAnswers: string[]
  hint: string
  note?: string
} {
  const { variable, threshold, operator, stage, kind } = spec
  const right = quote(threshold)
  const left = `${variable} ${displayCurrent(spec)}`

  if (stage === 'meaning') {
    if (kind === 'member' || operator === '&&') {
      return {
        prompt: `If age is ${threshold} or more ______ is a member, show member price.`,
        subtitle: left + memberSuffix(spec),
        answer: 'and',
        acceptAnswers: AND_ANSWERS,
        hint: '英文 → 画面',
      }
    }
    const english = ENGLISH_FOR_OP[operator][0]
    return {
      prompt: meaningSentence(kind, threshold),
      subtitle: left,
      answer: english,
      acceptAnswers: ENGLISH_FOR_OP[operator],
      hint: '英文 → 画面',
    }
  }

  if (stage === 'syntax') {
    if (kind === 'member') {
      return {
        prompt: `if (age >= ${threshold} ______ isMember)`,
        subtitle: left + memberSuffix(spec),
        answer: '&&',
        acceptAnswers: ['&&'],
        hint: '記号 → 画面',
      }
    }
    return {
      prompt: `if (${variable} ______ ${right})`,
      subtitle: left,
      answer: operator,
      acceptAnswers: [operator],
      hint: '記号 → 画面',
    }
  }

  const goal = featureLabel(kind, spec.goalOn)
  const canonical =
    kind === 'member'
      ? `age >= ${threshold} && isMember`
      : `${variable} ${operator} ${right}`

  return {
    prompt: `画面を「${goal}」にしてください。`,
    subtitle: left + (kind === 'member' ? memberSuffix(spec) : ''),
    answer: canonical,
    acceptAnswers: [canonical],
    hint: '条件を書いて画面を動かす',
    note: '変数名と比較を自分で書く。入力すると下の画面が変わる。',
  }
}

function displayCurrent(spec: IfLabSpec): string {
  if (spec.kind === 'input-error') {
    return spec.current === '' ? '= ""' : `= ${quote(spec.current)}`
  }
  return `= ${quote(spec.current)}`
}

function memberSuffix(spec: IfLabSpec): string {
  return ` · isMember = ${spec.andCurrent ? 'true' : 'false'}`
}

function meaningSentence(kind: IfLabKind, threshold: string | number): string {
  switch (kind) {
    case 'age-gate':
      return `If age is ______ ${threshold}, block the video.`
    case 'score-badge':
      return `If score is ______ ${threshold}, light the grade badge.`
    case 'stock':
      return `If stock is ______ 0, mark it sold out.`
    case 'input-error':
      return `If input is ______ "", show the required error.`
    case 'weather':
      return `If temperature is ______ ${threshold}, show the heat banner.`
    case 'cart':
      return `If count is ______ 0, show the cart badge.`
    case 'member':
      return `If age is ${threshold} or more ______ is a member, show member price.`
  }
}
