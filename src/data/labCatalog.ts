import type { GameMode, Progress } from '../engine/types'

export type LabDifficulty = 'beginner' | 'intermediate' | 'advanced'

export const LAB_DIFFICULTY_LABEL: Record<LabDifficulty, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
}

/** モード別難易度（未登録は中級） */
export const LAB_DIFFICULTY_BY_MODE: Partial<Record<GameMode, LabDifficulty>> = {
  standard: 'beginner',
  'vocab-ja-en': 'beginner',
  'vocab-en-ja': 'beginner',
  'toeic-en-ja': 'beginner',
  core: 'intermediate',
  abb: 'intermediate',
  aba: 'intermediate',
  abc: 'intermediate',
  'ing-form': 'intermediate',
  'pos-suffix': 'intermediate',
  'pos-word': 'intermediate',
  'word-order': 'intermediate',
  'comp-obj': 'advanced',
  'phrase-clause': 'advanced',
  'conj-prep': 'intermediate',
  'conj-linker': 'intermediate',
  'conj-part5': 'intermediate',
  'noun-count': 'intermediate',
  'noun-plural': 'intermediate',
  'noun-quant': 'intermediate',
  'noun-agree': 'intermediate',
  'prep-time': 'intermediate',
  'prep-place': 'intermediate',
  'prep-other': 'intermediate',
  'prep-set': 'intermediate',
  cloze: 'intermediate',
  phrases: 'intermediate',
  'vocab-initials': 'intermediate',
  'vocab-initials-en': 'intermediate',
  'vocab-initials-cloze': 'intermediate',
  'vocab-initials-phrases': 'intermediate',
  'toeic-ja-en': 'intermediate',
  'toeic-cloze': 'intermediate',
  'toeic-must-cloze': 'advanced',
  'toeic-biz-cloze': 'advanced',
  participle: 'advanced',
  hard: 'advanced',
  'html-css-quiz': 'intermediate',
  'js-basics-quiz': 'intermediate',
  'if-meaning': 'intermediate',
  'if-syntax': 'advanced',
  'if-build': 'advanced',
  'tag-meaning': 'intermediate',
  'tag-syntax': 'advanced',
  'tag-build': 'advanced',
  'pulse-meaning': 'intermediate',
  'pulse-syntax': 'advanced',
  'pulse-build': 'advanced',
  'lyric-meaning': 'intermediate',
  'lyric-syntax': 'advanced',
  'lyric-build': 'advanced',
  'lyric-grammar': 'advanced',
}

/** おすすめ学習順（小さいほど先） */
export const LAB_RECOMMEND_ORDER: Partial<Record<GameMode, number>> = {
  standard: 1,
  'vocab-ja-en': 2,
  core: 3,
  'pos-suffix': 4,
  'noun-count': 5,
  'prep-time': 6,
  'conj-part5': 7,
  'toeic-en-ja': 8,
  'toeic-must-cloze': 9,
  hard: 10,
}

export function labDifficulty(mode: GameMode): LabDifficulty {
  return LAB_DIFFICULTY_BY_MODE[mode] ?? 'intermediate'
}

export function recommendedLabs(): LabEntry[] {
  return LAB_CATALOG
    .filter((lab) => LAB_RECOMMEND_ORDER[lab.mode] != null)
    .sort(
      (a, b) =>
        (LAB_RECOMMEND_ORDER[a.mode] ?? 99) - (LAB_RECOMMEND_ORDER[b.mode] ?? 99),
    )
}

export type LabKind =
  | 'verbs'
  | 'grammar'
  | 'web'
  | 'if'
  | 'tag'
  | 'pulse'
  | 'lyric'
  | 'biz'
  | 'toeic'

export type LabStage = 'meaning' | 'syntax' | 'build' | 'grammar' | 'other' | 'toeic'

export type LabLock = 'pulse-syntax' | 'pulse-build' | 'participle' | 'hard'

export type LabEntry = {
  mode: GameMode
  kind: LabKind
  group: string
  title: string
  blurb: string
  stage: LabStage
  difficulty?: LabDifficulty
  recommendOrder?: number
}

export const LAB_KIND_LABEL: Record<LabKind, string> = {
  verbs: 'Verbs',
  grammar: '文法',
  web: 'Web基礎',
  if: '条件',
  tag: 'タグ',
  pulse: 'Pulse',
  lyric: 'Lyric',
  biz: 'ビジネス',
  toeic: 'TOEIC',
}

export const LAB_GROUP_NOTE: Record<string, string> = {
  型別ドリル: '変化パターンごとに分けて定着させる。',
  文法ドリル: 'be動詞+ing なら進行形、名詞の働きなら動名詞。接尾辞で品詞を推測。',
  Web基礎ドリル:
    'HTML/CSS の判別と、JavaScript の変数〜DOMまでを選択問題で定着させる。',
  条件と画面: '空きを埋めると、すぐ下の画面が切り替わる。数値は出題ごとに変わる。',
  タグと画面: '空きを埋めると、表・フォーム・カードが切り替わる。中身は出題ごとに変わる。',
  Pulse:
    'BPM とジャンルはお題が決める（自分では選べない）。通したクリップがラン終了後に1本になる。正確すぎると通らない。歌詞・投票・カメラはなし。',
  Lyric:
    '覚えた語を拍に乗せる。BPM とキックはお題固定。書くのは lyric()。歌声・投票・カメラはなし。',
  ビジネス英単語: 'freezer / service request / be eligible for などを集中練習。',
  'TOEIC 写真描写':
    'wipe down / patio / sidewalk café など、写真描写で頻出の語を集中練習。',
}

export const LAB_CATALOG: LabEntry[] = [
  {
    mode: 'standard',
    kind: 'verbs',
    group: '',
    title: 'Momentum Rush',
    blurb: '意味・原形・過去形をインターリーブ。連続正解で倍率が跳ねる。',
    stage: 'other',
  },
  {
    mode: 'core',
    kind: 'verbs',
    group: '',
    title: 'Core Irregular 50',
    blurb:
      '最重要の不規則動詞 50 語だけをランダム出題。原形・過去形・過去分詞まで定着させる。',
    stage: 'other',
  },
  {
    mode: 'abb',
    kind: 'verbs',
    group: '型別ドリル',
    title: 'A-B-B 型',
    blurb: '過去形＝過去分詞（buy → bought → bought など 12 語）',
    stage: 'other',
  },
  {
    mode: 'aba',
    kind: 'verbs',
    group: '型別ドリル',
    title: 'A-B-A 型',
    blurb: '原形＝過去分詞（come → came → come など 3 語）',
    stage: 'other',
  },
  {
    mode: 'abc',
    kind: 'verbs',
    group: '型別ドリル',
    title: 'A-B-C 型',
    blurb: '3 形すべて異なる（begin → began → begun など 11 語）',
    stage: 'other',
  },
  {
    mode: 'ing-form',
    kind: 'grammar',
    group: '文法ドリル',
    title: '現在進行形 vs 動名詞',
    blurb: '太字の -ing が「〜している」か「〜すること」かを判別（20問）。',
    stage: 'other',
  },
  {
    mode: 'pos-suffix',
    kind: 'grammar',
    group: '文法ドリル',
    title: '接尾辞 → 品詞',
    blurb: '-ment / -ize / -ive / -ly などが名詞・動詞・形容詞・副詞のどれかを仕分け。',
    stage: 'other',
  },
  {
    mode: 'pos-word',
    kind: 'grammar',
    group: '文法ドリル',
    title: '単語 → 品詞',
    blurb: 'effective / discussion / identify など 10 語の品詞を判別。',
    stage: 'other',
  },
  {
    mode: 'word-order',
    kind: 'grammar',
    group: '文法ドリル',
    title: '英文の語順',
    blurb: 'S+be+補語 / S+一般動詞(+目的語) の4パターンを判別（16問）。',
    stage: 'other',
  },
  {
    mode: 'comp-obj',
    kind: 'grammar',
    group: '文法ドリル',
    title: '補語 vs 目的語',
    blurb: '太字が主語を補う補語か、動作の対象の目的語かを判別（8問）。',
    stage: 'other',
  },
  {
    mode: 'phrase-clause',
    kind: 'grammar',
    group: '文法ドリル',
    title: '句 vs 節',
    blurb: '太字部分に主語＋本動詞があるかで句と節を判別（10問）。',
    stage: 'other',
  },
  {
    mode: 'conj-prep',
    kind: 'grammar',
    group: '文法ドリル',
    title: '接続詞 vs 前置詞',
    blurb: 'Because / Despite / While など、後ろが節か句かで選ぶ（8問）。',
    stage: 'other',
  },
  {
    mode: 'conj-linker',
    kind: 'grammar',
    group: '文法ドリル',
    title: '等位・従位・接続副詞',
    blurb: 'so / because / however などのつなぎ方の違いを判別（8問）。',
    stage: 'other',
  },
  {
    mode: 'conj-part5',
    kind: 'grammar',
    group: '文法ドリル',
    title: '接続詞 Part5',
    blurb: 'either…or / unless / whether など TOEIC 形式の空所補充（10問）。',
    stage: 'other',
  },
  {
    mode: 'noun-count',
    kind: 'grammar',
    group: '文法ドリル',
    title: '可算 / 不可算',
    blurb: 'information / furniture / passenger などを判別（10問）。',
    stage: 'other',
  },
  {
    mode: 'noun-plural',
    kind: 'grammar',
    group: '文法ドリル',
    title: '複数形入力',
    blurb: 'woman → women など、規則・不規則の複数形をタイピング（10問）。',
    stage: 'other',
  },
  {
    mode: 'noun-quant',
    kind: 'grammar',
    group: '文法ドリル',
    title: '数量形容詞',
    blurb: 'many / much / a few / each など、合う名詞を選ぶ（10問）。',
    stage: 'other',
  },
  {
    mode: 'noun-agree',
    kind: 'grammar',
    group: '文法ドリル',
    title: '主語と動詞の一致',
    blurb: 'furniture is / cars are など、is / are を選ぶ（8問）。',
    stage: 'other',
  },
  {
    mode: 'prep-time',
    kind: 'grammar',
    group: '文法ドリル',
    title: '前置詞（時）',
    blurb: 'at / on / in / for / until / by など時の前置詞（15問）。',
    stage: 'other',
  },
  {
    mode: 'prep-place',
    kind: 'grammar',
    group: '文法ドリル',
    title: '前置詞（場所）',
    blurb: 'at / in / by / behind / along など場所の前置詞（12問）。',
    stage: 'other',
  },
  {
    mode: 'prep-other',
    kind: 'grammar',
    group: '文法ドリル',
    title: '前置詞（その他）',
    blurb: 'under construction / as / without / regarding など（8問）。',
    stage: 'other',
  },
  {
    mode: 'prep-set',
    kind: 'grammar',
    group: '文法ドリル',
    title: '前置詞（セット表現）',
    blurb: 'subscribe to / within / owing to / eligible for など（8問）。',
    stage: 'other',
  },
  {
    mode: 'html-css-quiz',
    kind: 'web',
    group: 'Web基礎ドリル',
    title: 'HTML/CSS 判別',
    blurb:
      'margin / padding / flex / colspan / form などを選択で判別（12問）。',
    stage: 'other',
  },
  {
    mode: 'js-basics-quiz',
    kind: 'web',
    group: 'Web基礎ドリル',
    title: 'JavaScript 基礎',
    blurb:
      'let・const・if・for・配列・関数・DOM・FizzBuzz まで選択で確認（20問）。',
    stage: 'other',
  },
  {
    mode: 'if-meaning',
    kind: 'if',
    group: '条件と画面',
    title: 'Meaning',
    blurb: '英文の空きを埋めて、ゲート・バッジ・売り切れなどを動かす（12問）。',
    stage: 'meaning',
  },
  {
    mode: 'if-syntax',
    kind: 'if',
    group: '条件と画面',
    title: 'Syntax',
    blurb: '同じ画面を < / === / !== / && で動かす（12問）。',
    stage: 'syntax',
  },
  {
    mode: 'if-build',
    kind: 'if',
    group: '条件と画面',
    title: 'Build',
    blurb: '条件を自分で書いて、意図した画面にする（10問）。',
    stage: 'build',
  },
  {
    mode: 'tag-meaning',
    kind: 'tag',
    group: 'タグと画面',
    title: 'Meaning',
    blurb: '英文の空きを埋めて、骨格・表・余白などを動かす（12問）。',
    stage: 'meaning',
  },
  {
    mode: 'tag-syntax',
    kind: 'tag',
    group: 'タグと画面',
    title: 'Syntax',
    blurb: '同じ画面を tr / th / flex / required で動かす（12問）。',
    stage: 'syntax',
  },
  {
    mode: 'tag-build',
    kind: 'tag',
    group: 'タグと画面',
    title: 'Build',
    blurb: 'タグや CSS を自分で書いて、意図した画面にする（10問）。',
    stage: 'build',
  },
  {
    mode: 'pulse-meaning',
    kind: 'pulse',
    group: 'Pulse',
    title: 'Meaning',
    blurb:
      '指定 BPM・ジャンルで、聴いたキックをコードで書く。正答率60%以上で Syntax 解放（10問）。',
    stage: 'meaning',
  },
  {
    mode: 'pulse-syntax',
    kind: 'pulse',
    group: 'Pulse',
    title: 'Syntax',
    blurb:
      '固定 BPM のひな形にキック・裏拍・humanize を足す。正答率60%以上で Build 解放（10問）。',
    stage: 'syntax',
  },
  {
    mode: 'pulse-build',
    kind: 'pulse',
    group: 'Pulse',
    title: 'Build',
    blurb: 'kick のひな形から、候補を選んでグルーブを組む（8問）。',
    stage: 'build',
  },
  {
    mode: 'lyric-meaning',
    kind: 'lyric',
    group: 'Lyric',
    title: 'Meaning',
    blurb: '日本語の意味を lyric("英語") で書く（10問）。',
    stage: 'meaning',
  },
  {
    mode: 'lyric-syntax',
    kind: 'lyric',
    group: 'Lyric',
    title: 'Syntax',
    blurb: '指定語をオンビートか裏に置く（10問）。',
    stage: 'syntax',
  },
  {
    mode: 'lyric-build',
    kind: 'lyric',
    group: 'Lyric',
    title: 'Build',
    blurb: '語と乗りを自分で書く。humanize は不要（8問）。',
    stage: 'build',
  },
  {
    mode: 'lyric-grammar',
    kind: 'lyric',
    group: 'Lyric',
    title: 'Grammar',
    blurb:
      'because + 節 / despite + 句 / eligible for などを英文に戻して拍へ置く（10問）。',
    stage: 'grammar',
  },
  {
    mode: 'vocab-ja-en',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: '単語テスト① 日本語 → 英語',
    blurb: '冷凍庫・売り場・修理依頼など 20 語を想起。',
    stage: 'other',
  },
  {
    mode: 'vocab-initials',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: 'イニシャル入力① 日→英',
    blurb: '日本語を見て f______ 形式のヒントから英語をタイピング（20問）。',
    stage: 'other',
  },
  {
    mode: 'vocab-en-ja',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: '単語テスト② 英語 → 日本語',
    blurb: 'freezer / section / manager など 10 語。',
    stage: 'other',
  },
  {
    mode: 'vocab-initials-en',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: 'イニシャル入力② 英→日',
    blurb: 'freezer などを見て 冷＿＿ 形式のヒントから日本語をタイピング（10問）。',
    stage: 'other',
  },
  {
    mode: 'cloze',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: '穴埋め 英文 → 日本語',
    blurb: "The freezer isn't working properly. など 10 文。",
    stage: 'other',
  },
  {
    mode: 'vocab-initials-cloze',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: 'イニシャル入力③ 穴埋め',
    blurb: '英文の空欄を p_______ ヒント付きでタイピング（ちょっと難しい・10問）。',
    stage: 'other',
  },
  {
    mode: 'phrases',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: '重要表現ドリル',
    blurb: 'be eligible for / submit A to B / be located near などを重点出題。',
    stage: 'other',
  },
  {
    mode: 'vocab-initials-phrases',
    kind: 'biz',
    group: 'ビジネス英単語',
    title: 'イニシャル入力④ TOEICフレーズ',
    blurb: '英語フレーズを見て 座＿＿＿＿＿ ヒント付きで日本語をタイピング（20問）。',
    stage: 'other',
  },
  {
    mode: 'toeic-en-ja',
    kind: 'toeic',
    group: 'TOEIC 写真描写',
    title: 'TOEIC単語① 英→日',
    blurb: 'wipe down / outdoor / patio など 12 語を日本語で入力。',
    stage: 'toeic',
  },
  {
    mode: 'toeic-ja-en',
    kind: 'toeic',
    group: 'TOEIC 写真描写',
    title: 'TOEIC単語② 日→英',
    blurb: '「～をきれいに拭く」などを英語でタイピング（12問）。',
    stage: 'toeic',
  },
  {
    mode: 'toeic-cloze',
    kind: 'toeic',
    group: 'TOEIC 写真描写',
    title: 'TOEIC穴埋め',
    blurb: 'wiping / sweeping / in front など空欄を入力（6問）。',
    stage: 'toeic',
  },
  {
    mode: 'toeic-must-cloze',
    kind: 'toeic',
    group: 'TOEIC 写真描写',
    title: '単語テスト① 文章穴埋め',
    blurb:
      'TOEIC超必須。extinguisher / appointment / ensure などを英文穴埋めで想起（20問）。',
    stage: 'toeic',
  },
  {
    mode: 'toeic-biz-cloze',
    kind: 'toeic',
    group: 'TOEIC 写真描写',
    title: 'FOR BIZ Unit1・2 穴埋め',
    blurb: 'inspecting / filing / assembling など超頻出語を英文穴埋めで入力（30問）。',
    stage: 'toeic',
  },
  {
    mode: 'participle',
    kind: 'verbs',
    group: '',
    title: 'Participle Mix',
    blurb: '過去分詞を混ぜた検索練習。不規則動詞の定着を狙う。',
    stage: 'other',
  },
  {
    mode: 'hard',
    kind: 'verbs',
    group: '',
    title: 'Hard Rush',
    blurb: '短時間・多問数。モメンタムを落とさず駆け抜けろ。',
    stage: 'other',
  },
]

export function labLock(mode: GameMode): LabLock | null {
  if (mode === 'pulse-syntax') return 'pulse-syntax'
  if (mode === 'pulse-build') return 'pulse-build'
  if (mode === 'participle') return 'participle'
  if (mode === 'hard') return 'hard'
  return null
}

export function labLockLabel(lock: LabLock): string {
  if (lock === 'pulse-syntax') return 'Meaning クリアで解放'
  if (lock === 'pulse-build') return 'Syntax クリアで解放'
  if (lock === 'participle') return 'Lv.2 で解放'
  return 'Lv.3 で解放'
}

export function isLabUnlocked(mode: GameMode, progress: Progress): boolean {
  const lock = labLock(mode)
  if (!lock) return true
  if (lock === 'pulse-syntax') return progress.unlocked.pulseSyntax
  if (lock === 'pulse-build') return progress.unlocked.pulseBuild
  if (lock === 'participle') return progress.unlocked.participle
  return progress.unlocked.hard
}
