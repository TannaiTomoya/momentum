export type VocabCard = {
  id: string
  ja: string
  en: string
  acceptEn: string[]
  acceptJa: string[]
}

export type ClozeCard = {
  id: string
  en: string
  ja: string
  acceptJa: string[]
}

export type PhraseCard = {
  id: string
  en: string
  ja: string
  acceptEn: string[]
  acceptJa: string[]
  priority?: boolean
}

function vocab(
  id: string,
  ja: string,
  en: string,
  acceptEn: string[] = [en],
  acceptJa: string[] = [ja],
): VocabCard {
  return { id, ja, en, acceptEn, acceptJa }
}

function cloze(
  id: string,
  en: string,
  ja: string,
  acceptJa: string[] = [ja],
): ClozeCard {
  return { id, en, ja, acceptJa }
}

function phrase(
  id: string,
  en: string,
  ja: string,
  opts?: {
    acceptEn?: string[]
    acceptJa?: string[]
    priority?: boolean
  },
): PhraseCard {
  return {
    id,
    en,
    ja,
    acceptEn: opts?.acceptEn ?? [en],
    acceptJa: opts?.acceptJa ?? [ja],
    priority: opts?.priority,
  }
}

/** 単語テスト① / ② 共通カード */
export const VOCAB_CARDS: VocabCard[] = [
  vocab('v-freezer', '冷凍庫', 'freezer'),
  vocab('v-section', '売り場・部門', 'section', ['section'], [
    '売り場・部門',
    '売り場',
    '部門',
    '課',
  ]),
  vocab('v-dairy-section', '乳製品売り場', 'dairy section'),
  vocab('v-ice-cream-freezer', 'アイスクリーム用冷凍庫', 'ice cream freezer'),
  vocab('v-properly', '正しく、きちんと', 'properly', ['properly'], [
    '正しく、きちんと',
    '正しく',
    'きちんと',
  ]),
  vocab('v-actually', '実際には', 'actually'),
  vocab('v-meat-department', '精肉部門', 'meat department'),
  vocab('v-item', '品物・商品', 'item', ['item'], ['品物・商品', '品物', '商品']),
  vocab('v-broken', '壊れた', 'broken'),
  vocab('v-move', '動かす、移動させる', 'move', ['move'], [
    '動かす、移動させる',
    '動かす',
    '移動させる',
  ]),
  vocab('v-back', '後ろ、奥', 'back', ['back'], ['後ろ、奥', '後ろ', '奥']),
  vocab(
    'v-repair',
    '修理',
    'repair',
    ['repair', 'fix', 'mend'],
    ['修理'],
  ),
  vocab('v-request-a-repair', '修理を依頼する', 'request a repair'),
  vocab('v-information', '情報', 'information'),
  vocab('v-initial', '最初の、第一の', 'initial', ['initial'], [
    '最初の、第一の',
    '最初の',
    '第一の',
  ]),
  vocab('v-service-request', 'サービス依頼', 'service request', ['service request'], [
    'サービス依頼',
    '修理依頼',
    'サービス依頼・修理依頼',
  ]),
  vocab('v-manager', 'マネージャー、責任者', 'manager', ['manager'], [
    'マネージャー、責任者',
    'マネージャー',
    '責任者',
  ]),
  vocab(
    'v-sales-associate',
    '販売員',
    'sales associate',
    ['sales associate', 'sales clerk'],
  ),
  vocab('v-maintenance-worker', '保守・メンテナンス作業員', 'mentenance worker', [
    'mentenance worker',
    'maintenance worker',
  ]),
  vocab('v-delivery-person', '配達員', 'delivery person'),
]

/** 単語テスト②用の短めセット（21–30） */
export const VOCAB_EN_JA_FOCUS: VocabCard[] = [
  VOCAB_CARDS.find((c) => c.id === 'v-freezer')!,
  VOCAB_CARDS.find((c) => c.id === 'v-section')!,
  VOCAB_CARDS.find((c) => c.id === 'v-properly')!,
  VOCAB_CARDS.find((c) => c.id === 'v-actually')!,
  vocab('v-department', '部門', 'department', ['department'], [
    '部門',
    '売り場・部門',
    '売り場',
  ]),
  VOCAB_CARDS.find((c) => c.id === 'v-item')!,
  VOCAB_CARDS.find((c) => c.id === 'v-broken')!,
  VOCAB_CARDS.find((c) => c.id === 'v-move')!,
  VOCAB_CARDS.find((c) => c.id === 'v-repair')!,
  VOCAB_CARDS.find((c) => c.id === 'v-manager')!,
]

export const CLOZE_CARDS: ClozeCard[] = [
  cloze(
    'c-31',
    "The freezer isn't working properly.",
    'きちんと作動していません。',
    ['きちんと作動していません。', 'きちんと作動していません'],
  ),
  cloze(
    'c-32',
    'One of the ice cream freezers is broken.',
    'アイスクリーム用冷凍庫の一つが壊れています。',
  ),
  cloze(
    'c-33',
    'I can move the items to the back of the store.',
    '商品を店の奥へ移動できます。',
  ),
  cloze(
    'c-34',
    "Please get the phone number for Jacob's Repair.",
    "Jacob's Repairの電話番号を教えてください。",
  ),
  cloze(
    'c-35',
    "That's the initial information we need.",
    'それが私たちに必要な最初の情報です。',
  ),
  cloze(
    'c-36',
    'We need to submit a service request.',
    '修理依頼を提出する必要があります。',
    ['修理依頼を提出する必要があります。', 'サービス依頼を提出する必要があります。'],
  ),
  cloze(
    'c-37',
    'The woman is a sales associate.',
    'その女性は販売員です。',
  ),
  cloze(
    'c-38',
    'Who should I contact about freezer maintenance?',
    '冷凍庫のメンテナンスについて誰に連絡すればいいですか。',
  ),
  cloze(
    'c-39',
    'The delivery person delivers items to customers.',
    'その配達員は顧客に商品を届けます。',
  ),
  cloze(
    'c-40',
    'Can you explain how to submit a service request to the manager?',
    '責任者にサービス依頼を出す方法を説明してもらえますか。',
  ),
]

export const PHRASE_CARDS: PhraseCard[] = [
  phrase('p-section-department', 'section / department', '売り場・部門', {
    acceptEn: ['section', 'department', 'section / department'],
    priority: true,
  }),
  phrase('p-repair-maintenance', 'repair / maintenance', '修理 / 保守・メンテナンス', {
    acceptEn: ['repair', 'maintenance', 'repair / maintenance'],
    acceptJa: ['修理 / 保守・メンテナンス', '修理', '保守・メンテナンス', 'メンテナンス'],
    priority: true,
  }),
  phrase('p-sales-associate', 'sales associate', '販売員', { priority: true }),
  phrase('p-delivery-person', 'delivery person', '配達員', { priority: true }),
  phrase('p-service-request', 'service request', 'サービス依頼・修理依頼', {
    acceptJa: ['サービス依頼・修理依頼', 'サービス依頼', '修理依頼'],
    priority: true,
  }),
  phrase('p-arrange-seating', 'arrange the seating', '座席を手配する／座席を配置する', {
    acceptJa: [
      '座席を手配する／座席を配置する',
      '座席を手配する',
      '座席を配置する',
    ],
  }),
  phrase('p-know-who-attend', 'know who will attend', '誰が出席するか分かる'),
  phrase(
    'p-spend-more-than-one-year',
    'spend more than one year working',
    '1年以上働く',
  ),
  phrase('p-eligible-bonus', 'be eligible for a bonus', 'ボーナスを受け取る資格がある', {
    priority: true,
  }),
  phrase('p-receive-bonus', 'receive a bonus', 'ボーナスを受け取る'),
  phrase(
    'p-thorough-review',
    'conduct a thorough review',
    '徹底的な見直しを行う',
    {
      acceptEn: [
        'conduct a thorough review',
        'do a thorough review',
        'conduct / do a thorough review',
      ],
      priority: true,
    },
  ),
  phrase(
    'p-review-programs',
    'a review of our programs',
    '私たちのプログラムの見直し',
  ),
  phrase('p-end-of-year', 'at the end of the year', '年末に／年の終わりに', {
    acceptJa: ['年末に／年の終わりに', '年末に', '年の終わりに'],
  }),
  phrase(
    'p-located-near-attraction',
    'be located near a tourist attraction',
    '観光名所の近くに位置している',
    { priority: true },
  ),
  phrase(
    'p-major-attractions',
    'major tourist attractions',
    '主要な観光名所',
  ),
  phrase('p-more-expensive', 'be more expensive', 'より高価である／より値段が高い', {
    acceptJa: [
      'より高価である／より値段が高い',
      'より高価である',
      'より値段が高い',
    ],
  }),
  phrase(
    'p-passenger-volume',
    'passenger volume has increased',
    '乗客数が増加した',
  ),
  phrase('p-greatly-increase', 'greatly increase', '大幅に増加する／大いに増やす', {
    acceptJa: ['大幅に増加する／大いに増やす', '大幅に増加する', '大いに増やす'],
  }),
  phrase(
    'p-weekly-progress-report',
    'submit a weekly progress report',
    '毎週の進捗報告書を提出する',
    { priority: true },
  ),
  phrase(
    'p-submit-report-supervisor',
    'submit a report to your supervisor',
    '上司に報告書を提出する',
    { priority: true },
  ),
  phrase('p-by-friday-4pm', 'by 4:00 P.M. on Friday', '金曜日の午後4時までに'),
  phrase(
    'p-ballet-performance',
    "last night's ballet performance",
    '昨夜のバレエ公演',
  ),
  phrase('p-for-many-reasons', 'for many reasons', '多くの理由で／さまざまな理由から', {
    acceptJa: [
      '多くの理由で／さまざまな理由から',
      '多くの理由で',
      'さまざまな理由から',
    ],
  }),
  phrase(
    'p-trucking-company',
    'working at a trucking company',
    '運送会社で働くこと',
  ),
  phrase(
    'p-eligible-salary',
    'be eligible for a salary increase',
    '給料の昇給を受ける資格がある',
    { priority: true },
  ),
  phrase('p-eligible-for', 'be eligible for ～', '～を受ける資格がある', {
    acceptEn: ['be eligible for', 'be eligible for ～'],
    priority: true,
  }),
  phrase('p-submit-a-to-b', 'submit A to B', 'AをBに提出する', {
    acceptEn: ['submit A to B', 'submit A to B'],
    priority: true,
  }),
  phrase('p-located-near', 'be located near ～', '～の近くに位置する', {
    acceptEn: ['be located near', 'be located near ～'],
    priority: true,
  }),
]
