export type WordOrderPattern =
  | 'be-noun'
  | 'be-adj'
  | 'vi'
  | 'vt-obj'

export const WORD_ORDER_LABEL: Record<WordOrderPattern, string> = {
  'be-noun': 'S + be + 補語（名詞）',
  'be-adj': 'S + be + 補語（形容詞）',
  vi: 'S + 一般動詞',
  'vt-obj': 'S + 一般動詞 + 目的語',
}

export const WORD_ORDER_CHOICES = [
  WORD_ORDER_LABEL['be-noun'],
  WORD_ORDER_LABEL['be-adj'],
  WORD_ORDER_LABEL.vi,
  WORD_ORDER_LABEL['vt-obj'],
]

export type WordOrderCard = {
  id: string
  en: string
  ja: string
  pattern: WordOrderPattern
  tip: string
}

function card(
  id: string,
  en: string,
  ja: string,
  pattern: WordOrderPattern,
  tip: string,
): WordOrderCard {
  return { id, en, ja, pattern, tip }
}

/** 語順パターン判別 */
export const WORD_ORDER_CARDS: WordOrderCard[] = [
  card(
    'wo-01',
    'He is a manager.',
    '彼はマネージャーです。',
    'be-noun',
    'He ＝ a manager（補語は名詞）',
  ),
  card(
    'wo-02',
    'He is busy.',
    '彼は忙しいです。',
    'be-adj',
    'He ＝ busy（補語は形容詞）',
  ),
  card(
    'wo-03',
    'He works.',
    '彼は働きます。',
    'vi',
    '一般動詞のみ。目的語は不要',
  ),
  card(
    'wo-04',
    'He bought a ticket.',
    '彼はチケットを買いました。',
    'vt-obj',
    'bought の対象が a ticket（目的語）。He ≠ ticket',
  ),
  card(
    'wo-05',
    'She is a sales associate.',
    '彼女は販売員です。',
    'be-noun',
    'She ＝ a sales associate',
  ),
  card(
    'wo-06',
    'They are ready.',
    '彼らは準備ができています。',
    'be-adj',
    'They ＝ ready',
  ),
  card(
    'wo-07',
    'The meeting starts.',
    '会議が始まります。',
    'vi',
    'starts に目的語はない',
  ),
  card(
    'wo-08',
    'She submitted a report.',
    '彼女は報告書を提出しました。',
    'vt-obj',
    'submitted の対象が a report',
  ),
  card(
    'wo-09',
    'Mr. Lee is our supervisor.',
    'Leeさんは私たちの上司です。',
    'be-noun',
    'Mr. Lee ＝ our supervisor',
  ),
  card(
    'wo-10',
    'The store is closed.',
    'その店は閉まっています。',
    'be-adj',
    'The store ＝ closed',
  ),
  card(
    'wo-11',
    'Customers arrive.',
    'お客さんが到着します。',
    'vi',
    'arrive は目的語を取らない',
  ),
  card(
    'wo-12',
    'We need more information.',
    '私たちはもっと情報が必要です。',
    'vt-obj',
    'need の対象が more information',
  ),
  card(
    'wo-13',
    'This is an important item.',
    'これは重要な品物です。',
    'be-noun',
    'This ＝ an important item',
  ),
  card(
    'wo-14',
    'The freezer is broken.',
    'その冷凍庫は壊れています。',
    'be-adj',
    'The freezer ＝ broken',
  ),
  card(
    'wo-15',
    'Prices increase.',
    '価格が上がります。',
    'vi',
    'increase はここでは自動詞',
  ),
  card(
    'wo-16',
    'Please arrange the seating.',
    '座席を手配してください。',
    'vt-obj',
    'arrange の対象が the seating',
  ),
]

export type CompObjRole = 'complement' | 'object'

export const COMP_OBJ_LABEL: Record<CompObjRole, string> = {
  complement: '補語（主語＝これ）',
  object: '目的語（動作の対象）',
}

export const COMP_OBJ_CHOICES = [
  COMP_OBJ_LABEL.complement,
  COMP_OBJ_LABEL.object,
]

export type CompObjCard = {
  id: string
  en: string
  ja: string
  target: string
  role: CompObjRole
  tip: string
}

function roleCard(
  id: string,
  en: string,
  ja: string,
  target: string,
  role: CompObjRole,
  tip: string,
): CompObjCard {
  return { id, en, ja, target, role, tip }
}

/** 補語 vs 目的語 */
export const COMP_OBJ_CARDS: CompObjCard[] = [
  roleCard(
    'co-01',
    'He is a manager.',
    '彼はマネージャーです。',
    'a manager',
    'complement',
    'He ＝ a manager',
  ),
  roleCard(
    'co-02',
    'He is busy.',
    '彼は忙しいです。',
    'busy',
    'complement',
    'He ＝ busy',
  ),
  roleCard(
    'co-03',
    'He bought a ticket.',
    '彼はチケットを買いました。',
    'a ticket',
    'object',
    'He ≠ a ticket。bought の対象',
  ),
  roleCard(
    'co-04',
    'She submitted a report.',
    '彼女は報告書を提出しました。',
    'a report',
    'object',
    'She ≠ a report',
  ),
  roleCard(
    'co-05',
    'They are ready.',
    '彼らは準備ができています。',
    'ready',
    'complement',
    'They ＝ ready',
  ),
  roleCard(
    'co-06',
    'We need more information.',
    '私たちはもっと情報が必要です。',
    'more information',
    'object',
    'need の対象（名詞のカタマリ）',
  ),
  roleCard(
    'co-07',
    'Mr. Lee is our supervisor.',
    'Leeさんは私たちの上司です。',
    'our supervisor',
    'complement',
    'Mr. Lee ＝ our supervisor',
  ),
  roleCard(
    'co-08',
    'Please arrange the seating.',
    '座席を手配してください。',
    'the seating',
    'object',
    'arrange の対象',
  ),
]
