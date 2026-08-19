import type {
  TagLabKind,
  TagLabSpec,
  TagLabStage,
  TagToken,
} from '../engine/types'

export const TAG_LAB_KINDS: TagLabKind[] = [
  'skeleton',
  'table',
  'form',
  'box',
  'flex',
  'center',
  'lp',
]

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

const SKELETON_TOKENS: TagToken[] = ['header', 'main', 'footer', 'body']
const TABLE_TOKENS: TagToken[] = ['tr', 'th', 'td']
const FORM_TOKENS: TagToken[] = ['label', 'required', 'password', 'email']
const BOX_TOKENS: TagToken[] = ['margin', 'padding']

const PRODUCT_TABLES: { headers: [string, string]; rows: [string, string][] }[] =
  [
    {
      headers: ['商品', '価格'],
      rows: [
        ['ペン', '120円'],
        ['ノート', '280円'],
      ],
    },
    {
      headers: ['曜日', '予定'],
      rows: [
        ['月', 'HTML'],
        ['火', 'CSS'],
      ],
    },
    {
      headers: ['年', 'できごと'],
      rows: [
        ['2024年', 'Webに興味を持つ'],
        ['2026年', 'セブ島IT勉強会に参加'],
      ],
    },
  ]

const SKILL_POOL = ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Flexbox']

const FIELDS: { id: string; label: string }[] = [
  { id: 'username', label: 'ユーザー名' },
  { id: 'email', label: 'メール' },
  { id: 'guest', label: 'お名前' },
]

export const MEANING_ANSWERS: Record<TagToken, string[]> = {
  header: ['header', 'the header'],
  main: ['main', 'the main'],
  footer: ['footer', 'the footer'],
  body: ['body', 'the body'],
  tr: ['table row', 'row'],
  th: ['table header', 'header cell'],
  td: ['table data', 'data cell'],
  label: ['label'],
  required: ['required'],
  password: ['password'],
  email: ['email'],
  margin: ['margin', 'outside'],
  padding: ['padding', 'inside'],
  flex: ['flex'],
  center: ['auto', 'center'],
  copy: ['copyright', 'copy'],
}

export const SYNTAX_ANSWERS: Record<TagToken, string[]> = {
  header: ['header', '<header>'],
  main: ['main', '<main>'],
  footer: ['footer', '<footer>'],
  body: ['body', '<body>'],
  tr: ['tr', '<tr>'],
  th: ['th', '<th>'],
  td: ['td', '<td>'],
  label: ['label', '<label>', 'for'],
  required: ['required'],
  password: ['password', 'type="password"'],
  email: ['email', 'type="email"'],
  margin: ['margin'],
  padding: ['padding'],
  flex: ['flex', 'display: flex', 'display:flex'],
  center: ['margin: 0 auto', 'margin:0 auto', '0 auto'],
  copy: ['&copy;', 'copy', 'copyright'],
}

export function widgetTitle(kind: TagLabKind): string {
  switch (kind) {
    case 'skeleton':
      return 'ページ骨格'
    case 'table':
      return '表'
    case 'form':
      return 'フォーム'
    case 'box':
      return '余白'
    case 'flex':
      return '横並び'
    case 'center':
      return '中央寄せ'
    case 'lp':
      return '自己紹介LP'
  }
}

export function featureLabel(token: TagToken): string {
  switch (token) {
    case 'header':
      return 'ヘッダー点灯'
    case 'main':
      return 'メイン点灯'
    case 'footer':
      return 'フッター点灯'
    case 'body':
      return '本文エリア点灯'
    case 'tr':
      return '行が強調'
    case 'th':
      return '見出しセル'
    case 'td':
      return 'データセル'
    case 'label':
      return 'ラベル連動'
    case 'required':
      return '必須エラー'
    case 'password':
      return 'パスワード隠れ'
    case 'email':
      return 'メール形式'
    case 'margin':
      return '外側の余白'
    case 'padding':
      return '内側の余白'
    case 'flex':
      return 'カード横並び'
    case 'center':
      return '中央に収まる'
    case 'copy':
      return '© 表示'
  }
}

function skills(): string[] {
  const shuffled = [...SKILL_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export function rollTagLab(kind: TagLabKind, stage: TagLabStage): TagLabSpec {
  const table = pick(PRODUCT_TABLES)
  const field = pick(FIELDS)

  switch (kind) {
    case 'skeleton':
      return { kind, stage, token: pick(SKELETON_TOKENS), skills: skills() }
    case 'table':
      return {
        kind,
        stage,
        token: pick(TABLE_TOKENS),
        tableHeaders: table.headers,
        tableRows: table.rows,
      }
    case 'form':
      return {
        kind,
        stage,
        token: pick(FORM_TOKENS),
        fieldId: field.id,
        fieldLabel: field.label,
      }
    case 'box':
      return { kind, stage, token: pick(BOX_TOKENS) }
    case 'flex':
      return { kind, stage, token: 'flex', skills: skills() }
    case 'center':
      return { kind, stage, token: 'center' }
    case 'lp':
      return {
        kind,
        stage,
        token: pick(['copy', 'flex', 'header', 'footer'] as TagToken[]),
        skills: skills(),
        tableHeaders: ['年', 'できごと'],
        tableRows: [
          ['2024年', 'Webに興味を持つ'],
          ['2026年', 'セブ島IT勉強会に参加'],
        ],
      }
  }
}

function meaningPrompt(token: TagToken, spec: TagLabSpec): string {
  switch (token) {
    case 'header':
      return 'The top bar of a page is the ______.'
    case 'main':
      return 'The main content sits in ______.'
    case 'footer':
      return 'The bottom bar of a page is the ______.'
    case 'body':
      return 'The ______ holds what you see on screen.'
    case 'tr':
      return 'A ______ is one horizontal line in a table.'
    case 'th':
      return 'A ______ is a heading cell.'
    case 'td':
      return 'A ______ is a data cell.'
    case 'label':
      return `A ______ is tied to the input with id="${spec.fieldId ?? 'name'}".`
    case 'required':
      return '______ stops submit when the field is empty.'
    case 'password':
      return 'type="______" hides the letters.'
    case 'email':
      return 'type="______" checks the mail format.'
    case 'margin':
      return '______ is space outside the box.'
    case 'padding':
      return '______ is space inside the box.'
    case 'flex':
      return 'Put ______ on the parent to line children up.'
    case 'center':
      return 'margin: 0 ______ centers a max-width block.'
    case 'copy':
      return '&______; prints the © mark.'
  }
}

function syntaxPrompt(token: TagToken, spec: TagLabSpec): string {
  switch (token) {
    case 'header':
    case 'main':
    case 'footer':
    case 'body':
    case 'tr':
    case 'th':
    case 'td':
    case 'label':
      return `<______>`
    case 'required':
      return `<input type="text" ______>`
    case 'password':
      return `<input type="______">`
    case 'email':
      return `<input type="______">`
    case 'margin':
    case 'padding':
      return `${token === 'margin' ? '外側' : '内側'}: ______: 20px;`
    case 'flex':
      return `.parent { display: ______; }`
    case 'center':
      return `.container { max-width: 800px; margin: ______; }`
    case 'copy':
      return `<p>&______; 2026 TOM</p>`
    default:
      return `<______> ${spec.fieldId ?? ''}`
  }
}

function buildPromptText(token: TagToken): string {
  return `画面を「${featureLabel(token)}」にしてください。`
}

export function buildTagPrompt(spec: TagLabSpec): {
  prompt: string
  subtitle: string
  answer: string
  acceptAnswers: string[]
  hint: string
  note?: string
} {
  const { token, stage } = spec
  const meaning = MEANING_ANSWERS[token]
  const syntax = SYNTAX_ANSWERS[token]
  const subtitle = widgetTitle(spec.kind)

  if (stage === 'meaning') {
    return {
      prompt: meaningPrompt(token, spec),
      subtitle,
      answer: meaning[0],
      acceptAnswers: meaning,
      hint: '英文 → 画面',
    }
  }

  if (stage === 'syntax') {
    return {
      prompt: syntaxPrompt(token, spec),
      subtitle,
      answer: syntax[0],
      acceptAnswers: syntax,
      hint: '記号 → 画面',
    }
  }

  return {
    prompt: buildPromptText(token),
    subtitle,
    answer: syntax[0],
    acceptAnswers: [...new Set([...syntax, ...meaning])],
    hint: 'タグを書いて画面を動かす',
    note: 'タグ名・属性・CSS を自分で書く。入力すると下の画面が変わる。',
  }
}
