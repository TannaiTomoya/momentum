export type IngKind = 'progressive' | 'gerund'

export type IngCard = {
  id: string
  en: string
  ja: string
  emphasis: string
  kind: IngKind
}

function card(
  id: string,
  en: string,
  ja: string,
  emphasis: string,
  kind: IngKind,
): IngCard {
  return { id, en, ja, emphasis, kind }
}

/** 現在進行形 vs 動名詞の判別カード（20文） */
export const ING_CARDS: IngCard[] = [
  card(
    'ing-01',
    'She is swimming in the pool now.',
    '彼女は今、プールで泳いでいます。',
    'swimming',
    'progressive',
  ),
  card(
    'ing-02',
    'Swimming is good exercise.',
    '泳ぐことは良い運動です。',
    'Swimming',
    'gerund',
  ),
  card(
    'ing-03',
    'He is running in the park.',
    '彼は公園を走っています。',
    'running',
    'progressive',
  ),
  card(
    'ing-04',
    'I like running in the morning.',
    '私は朝走ることが好きです。',
    'running',
    'gerund',
  ),
  card(
    'ing-05',
    'My sister is reading a book now.',
    '私の姉（妹）は今、本を読んでいます。',
    'reading',
    'progressive',
  ),
  card(
    'ing-06',
    'Reading books is important.',
    '本を読むことは大切です。',
    'Reading',
    'gerund',
  ),
  card(
    'ing-07',
    'My father is cooking dinner.',
    '父は夕食を作っています。',
    'cooking',
    'progressive',
  ),
  card(
    'ing-08',
    'Cooking is my hobby.',
    '料理することは私の趣味です。',
    'Cooking',
    'gerund',
  ),
  card(
    'ing-09',
    'They are studying English now.',
    '彼らは今、英語を勉強しています。',
    'studying',
    'progressive',
  ),
  card(
    'ing-10',
    'I enjoy studying English.',
    '私は英語を勉強することを楽しんでいます。',
    'studying',
    'gerund',
  ),
  card(
    'ing-11',
    'We are traveling around Japan.',
    '私たちは日本各地を旅行しています。',
    'traveling',
    'progressive',
  ),
  card(
    'ing-12',
    'Traveling alone can be exciting.',
    '一人で旅行することはワクワクすることがあります。',
    'Traveling',
    'gerund',
  ),
  card(
    'ing-13',
    'She is shopping at the mall.',
    '彼女はショッピングモールで買い物をしています。',
    'shopping',
    'progressive',
  ),
  card(
    'ing-14',
    'Shopping takes a lot of time.',
    '買い物をすることは時間がかかります。',
    'Shopping',
    'gerund',
  ),
  card(
    'ing-15',
    'They are dancing at the party.',
    '彼らはパーティーで踊っています。',
    'dancing',
    'progressive',
  ),
  card(
    'ing-16',
    'I love dancing.',
    '私は踊ることが大好きです。',
    'dancing',
    'gerund',
  ),
  card(
    'ing-17',
    'He is driving to work.',
    '彼は車で仕事に向かっています。',
    'driving',
    'progressive',
  ),
  card(
    'ing-18',
    'Driving at night is difficult for me.',
    '夜に運転することは私には難しいです。',
    'Driving',
    'gerund',
  ),
  card(
    'ing-19',
    'The baby is sleeping now.',
    '赤ちゃんは今寝ています。',
    'sleeping',
    'progressive',
  ),
  card(
    'ing-20',
    'Sleeping eight hours is important.',
    '8時間寝ることは大切です。',
    'Sleeping',
    'gerund',
  ),
]

export const ING_ANSWER_LABEL = {
  progressive: 'A：現在進行形（〜している）',
  gerund: 'B：動名詞（〜すること）',
} as const
