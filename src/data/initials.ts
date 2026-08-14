export type InitialDirection = 'ja-to-en' | 'en-to-ja'

export type InitialCard = {
  id: string
  ja: string
  en: string
  acceptEn: string[]
  acceptJa: string[]
  direction: InitialDirection
  /** f______ または 冷＿＿ 形式 */
  initialHint: string
  note?: string
}

function enHint(en: string): string {
  return en
    .split(/\s+/)
    .map((word) => {
      if (!word) return word
      return word[0] + '_'.repeat(Math.max(0, word.length - 1))
    })
    .join(' ')
}

function jaHint(ja: string): string {
  const chars = [...ja]
  if (chars.length === 0) return ''
  return chars[0] + '＿'.repeat(Math.max(0, chars.length - 1))
}

function jaToEnCard(
  id: string,
  ja: string,
  en: string,
  acceptEn: string[] = [en],
  note?: string,
): InitialCard {
  return {
    id,
    ja,
    en,
    acceptEn,
    acceptJa: [ja],
    direction: 'ja-to-en',
    initialHint: enHint(en),
    note,
  }
}

function enToJaCard(
  id: string,
  en: string,
  ja: string,
  acceptJa: string[] = [ja],
  note?: string,
): InitialCard {
  return {
    id,
    ja,
    en,
    acceptEn: [en],
    acceptJa,
    direction: 'en-to-ja',
    initialHint: jaHint(ja),
    note,
  }
}

/** イニシャル入力①（日本語 → 英語） */
export const INITIAL_CARDS: InitialCard[] = [
  jaToEnCard('init-01', '冷凍庫', 'freezer'),
  jaToEnCard('init-02', '売り場・部門', 'section'),
  jaToEnCard(
    'init-03',
    '乳製品売り場',
    'dairy section',
    ['dairy section'],
    'daily report（報告書）と混同しない',
  ),
  jaToEnCard('init-04', 'アイスクリーム用冷凍庫', 'ice cream freezer'),
  jaToEnCard('init-05', '正しく、きちんと', 'properly'),
  jaToEnCard('init-06', '実際には', 'actually'),
  jaToEnCard('init-07', '精肉部門', 'meat department'),
  jaToEnCard('init-08', '品物・商品', 'item'),
  jaToEnCard('init-09', '壊れた', 'broken'),
  jaToEnCard('init-10', '動かす、移動させる', 'move'),
  jaToEnCard('init-11', '後ろ、奥', 'back'),
  jaToEnCard(
    'init-12',
    '修理',
    'repair',
    ['repair', 'fix', 'mend'],
    '動詞なら fix / mend も可',
  ),
  jaToEnCard('init-13', '修理を依頼する', 'request a repair'),
  jaToEnCard('init-14', '情報', 'information'),
  jaToEnCard('init-15', '最初の、第一の', 'initial'),
  jaToEnCard('init-16', 'サービス依頼', 'service request'),
  jaToEnCard('init-17', 'マネージャー、責任者', 'manager'),
  jaToEnCard(
    'init-18',
    '販売員',
    'sales associate',
    ['sales associate', 'sales clerk'],
  ),
  jaToEnCard(
    'init-19',
    '保守・メンテナンス作業員',
    'mentenance worker',
    ['mentenance worker', 'maintenance worker'],
  ),
  jaToEnCard('init-20', '配達員', 'delivery person'),
]

/** イニシャル入力②（英語 → 日本語 / 単語テスト②） */
export const INITIAL_EN_JA_CARDS: InitialCard[] = [
  enToJaCard('init-en-21', 'freezer', '冷凍庫'),
  enToJaCard('init-en-22', 'section', '売り場', [
    '売り場',
    '部門',
    '売り場・部門',
    '売り場部門',
  ]),
  enToJaCard('init-en-23', 'properly', '正しく', [
    '正しく',
    'きちんと',
    '正しく、きちんと',
  ]),
  enToJaCard('init-en-24', 'actually', '実際に', [
    '実際に',
    '実際には',
  ]),
  enToJaCard('init-en-25', 'department', '部門', [
    '部門',
    '売り場・部門',
    '売り場',
  ]),
  enToJaCard('init-en-26', 'item', '商品', [
    '商品',
    '品物',
    '品物・商品',
  ]),
  enToJaCard('init-en-27', 'broken', '壊れた'),
  enToJaCard('init-en-28', 'move', '動かす', [
    '動かす',
    '移動させる',
    '動かす、移動させる',
  ]),
  enToJaCard('init-en-29', 'repair', '修理'),
  enToJaCard('init-en-30', 'manager', '責任者', [
    '責任者',
    'マネージャー',
    'マネージャー、責任者',
  ]),
]

/** イニシャル入力④ TOEIC フレーズ（英語 → 日本語） */
export const INITIAL_PHRASE_EN_JA_CARDS: InitialCard[] = [
  enToJaCard(
    'init-ph-01',
    'arrange the seating',
    '座席を手配する',
    ['座席を手配する', '座席を配置する', '座席を手配する／座席を配置する'],
    '例: I will arrange the seating',
  ),
  enToJaCard('init-ph-02', 'know who will attend', '誰が出席するか分かる'),
  enToJaCard(
    'init-ph-03',
    'spend more than one year working',
    '1年以上働いていました',
    ['1年以上働いていました', '1年以上働く', '1年以上働いていた'],
  ),
  enToJaCard(
    'init-ph-04',
    'be eligible for a bonus',
    'ボーナスを受け取る資格がある',
    ['ボーナスを受け取る資格がある', 'ボーナスを受け取る資格が'],
  ),
  enToJaCard('init-ph-05', 'receive a bonus', 'ボーナスを受け取る'),
  enToJaCard('init-ph-06', 'conduct a thorough review', '徹底的な見直しを行う', [
    '徹底的な見直しを行う',
    '徹底的な見直しをする',
  ]),
  enToJaCard(
    'init-ph-07',
    'a review of our programs',
    '私たちのプログラムの見直し',
  ),
  enToJaCard('init-ph-08', 'at the end of the year', '年末に', [
    '年末に',
    '年の終わりに',
    '年末に／年の終わりに',
  ]),
  enToJaCard(
    'init-ph-09',
    'be located near a tourist attraction',
    '観光名所の近くに位置している',
  ),
  enToJaCard('init-ph-10', 'major tourist attractions', '主要な観光名所'),
  enToJaCard('init-ph-11', 'be more expensive', 'より高価である', [
    'より高価である',
    'より値段が高い',
    'より高価である／より値段が高い',
  ]),
  enToJaCard(
    'init-ph-12',
    'passenger volume has increased',
    '乗客数が増加した',
  ),
  enToJaCard('init-ph-13', 'greatly increase', '大幅に増加する', [
    '大幅に増加する',
    '大いに増やす',
    '大幅に増加する／大いに増やす',
  ]),
  enToJaCard(
    'init-ph-14',
    'submit a weekly progress report',
    '毎週の進捗報告を提出する',
    [
      '毎週の進捗報告を提出する',
      '毎週の進捗報告書を提出する',
    ],
  ),
  enToJaCard(
    'init-ph-15',
    'submit a report to your supervisor',
    '上司へ報告書を提出する',
    ['上司へ報告書を提出する', '上司に報告書を提出する'],
  ),
  enToJaCard(
    'init-ph-16',
    'by 4:00 P.M. on Friday',
    '金曜日の午後4時までに',
  ),
  enToJaCard(
    'init-ph-17',
    "last night's ballet performance",
    '昨夜のバレエ公演',
  ),
  enToJaCard('init-ph-18', 'for many reasons', '多くの理由で', [
    '多くの理由で',
    'さまざまな理由から',
    '多くの理由で／さまざまな理由から',
  ]),
  enToJaCard(
    'init-ph-19',
    'working at a trucking company',
    '運送会社で働いて',
    ['運送会社で働いて', '運送会社で働くこと', '運送会社で働く'],
  ),
  enToJaCard(
    'init-ph-20',
    'be eligible for a salary increase',
    '給料の昇給を受ける資格がある',
  ),
]

export type InitialClozeCard = {
  id: string
  /** 空欄入り英文 */
  prompt: string
  ja: string
  answer: string
  acceptAnswers: string[]
  initialHint: string
  note?: string
}

function clozeCard(
  id: string,
  prompt: string,
  ja: string,
  answer: string,
  acceptAnswers: string[] = [answer],
  note?: string,
): InitialClozeCard {
  return {
    id,
    prompt,
    ja,
    answer,
    acceptAnswers,
    initialHint: enHint(answer),
    note,
  }
}

/** イニシャル入力③（ちょっと難しい穴埋め） */
export const INITIAL_CLOZE_CARDS: InitialClozeCard[] = [
  clozeCard(
    'init-cloze-31',
    "The freezer isn't working ______.",
    'その冷凍庫は先月からきちんと作動していません。',
    'properly',
  ),
  clozeCard(
    'init-cloze-32',
    'One of the ice cream ______ is broken.',
    'アイスクリーム用冷凍庫の一つが壊れています。',
    'freezers',
  ),
  clozeCard(
    'init-cloze-33',
    'I can ______ the items to the back of the store.',
    '商品を店の奥へ移動できます。',
    'move',
  ),
  clozeCard(
    'init-cloze-34',
    "Please get the phone ______ for Jacob's Repair.",
    "Jacob's Repairの電話番号を教えてください。",
    'number',
  ),
  clozeCard(
    'init-cloze-35',
    "That's the ______ information we need.",
    'それが私たちに必要な最初の情報です。',
    'initial',
  ),
  clozeCard(
    'init-cloze-36',
    'We need to submit a service ______.',
    '修理依頼を提出する必要があります。',
    'request',
  ),
  clozeCard(
    'init-cloze-37',
    'The woman is a sales ______.',
    'その女性は販売員です。',
    'associate',
  ),
  clozeCard(
    'init-cloze-38',
    'Who should I contact about freezer ______?',
    '冷凍庫のメンテナンスについて誰に連絡すればいいですか。',
    'maintenance',
  ),
  clozeCard(
    'init-cloze-39',
    'The ______ delivers items to customers.',
    'その配達員は顧客に商品を届けます。',
    'delivery person',
  ),
  clozeCard(
    'init-cloze-40',
    'Can you explain how to submit a service request to the ______?',
    '責任者にサービス依頼を出す方法を説明してもらえますか。',
    'manager',
    ['manager'],
    'how to submit ＝ 提出の仕方',
  ),
]

/** TOEIC 写真描写系 英→日（単語テスト①） */
export const INITIAL_TOEIC_EN_JA_CARDS: InitialCard[] = [
  enToJaCard('toeic-en-01', 'wipe down', '拭く', [
    '拭く',
    'きれいに拭く',
    '～をきれいに拭く',
  ]),
  enToJaCard('toeic-en-02', 'outdoor', '屋外の'),
  enToJaCard('toeic-en-03', 'furniture', '家具'),
  enToJaCard('toeic-en-04', 'work under', '～の下（で働く）', [
    '～の下（で働く）',
    '～の下で働く',
    'の下で働く',
  ]),
  enToJaCard('toeic-en-05', 'open umbrella', 'パラソルが開いている', [
    'パラソルが開いている',
    '開いたパラソル',
  ]),
  enToJaCard('toeic-en-06', 'sweep', '～を掃く', ['～を掃く', '掃く']),
  enToJaCard('toeic-en-07', 'patio', 'テラス', [
    'テラス',
    '屋外の舗装された場所',
    'パラソル（テラス・屋外の舗装された場所）',
  ], 'patio＝テラス／屋外の舗装された場所'),
  enToJaCard('toeic-en-08', 'in front of', '～の前に', [
    '～の前に',
    'の前に',
  ]),
  enToJaCard('toeic-en-09', 'restaurant', 'レストラン'),
  enToJaCard('toeic-en-10', 'dine', '食事をする'),
  enToJaCard('toeic-en-11', 'sidewalk', '歩道'),
  enToJaCard('toeic-en-12', 'café', 'カフェ', ['カフェ']),
]

/** TOEIC 写真描写系 日→英（単語テスト②） */
export const INITIAL_TOEIC_JA_EN_CARDS: InitialCard[] = [
  jaToEnCard('toeic-ja-13', '～をきれいに拭く', 'wipe down'),
  jaToEnCard('toeic-ja-14', '屋外の', 'outdoor'),
  jaToEnCard('toeic-ja-15', '家具', 'furniture'),
  jaToEnCard('toeic-ja-16', '～の下で働く', 'work under'),
  jaToEnCard('toeic-ja-17', '開いた、開いている', 'open'),
  jaToEnCard('toeic-ja-18', '～を掃く', 'sweep'),
  jaToEnCard('toeic-ja-19', 'テラス、屋外の舗装された場所', 'patio'),
  jaToEnCard('toeic-ja-20', '～の前に', 'in front of'),
  jaToEnCard('toeic-ja-21', 'レストラン', 'restaurant'),
  jaToEnCard('toeic-ja-22', '食事をする', 'dine'),
  jaToEnCard('toeic-ja-23', '歩道', 'sidewalk'),
  jaToEnCard('toeic-ja-24', 'カフェ', 'café', ['café', 'cafe']),
]

/** TOEIC 写真描写系 穴埋め */
export const INITIAL_TOEIC_CLOZE_CARDS: InitialClozeCard[] = [
  clozeCard(
    'toeic-cloze-25',
    'The woman is ______ down some outdoor furniture.',
    '女性は屋外の家具をきれいに拭いています。',
    'wiping',
  ),
  clozeCard(
    'toeic-cloze-26',
    'The woman is ______ the patio.',
    '女性はテラスを掃いています。',
    'sweeping',
  ),
  clozeCard(
    'toeic-cloze-27',
    'The woman is dining at a ______ café.',
    '女性は歩道沿いのカフェで食事をしています。',
    'sidewalk',
  ),
  clozeCard(
    'toeic-cloze-28',
    'The woman is working ______ an open umbrella.',
    '女性は開いたパラソルの下で作業しています。',
    'under',
  ),
  clozeCard(
    'toeic-cloze-29',
    'The restaurant has a large outdoor ______.',
    'そのレストランには広い屋外テラスがあります。',
    'patio',
  ),
  clozeCard(
    'toeic-cloze-30',
    'The chairs are ______ of the restaurant.',
    'その椅子はレストランの前にあります。',
    'in front',
    ['in front', 'front'],
  ),
]
