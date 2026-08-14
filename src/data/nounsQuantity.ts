export type CountKind = 'countable' | 'uncountable'

export const COUNT_LABEL: Record<CountKind, string> = {
  countable: '可算名詞',
  uncountable: '不可算名詞',
}

export const COUNT_CHOICES = [COUNT_LABEL.countable, COUNT_LABEL.uncountable]

export type CountCard = {
  id: string
  word: string
  kind: CountKind
  tip: string
}

function count(
  id: string,
  word: string,
  kind: CountKind,
  tip: string,
): CountCard {
  return { id, word, kind, tip }
}

/** Practice-1 可算 / 不可算 */
export const COUNT_CARDS: CountCard[] = [
  count('cnt-01', 'information', 'uncountable', '情報＝概念。an information は不可'),
  count('cnt-02', 'knowledge', 'uncountable', '知識＝概念'),
  count('cnt-03', 'furniture', 'uncountable', '家具類＝カテゴリー総称'),
  count('cnt-04', 'fountain', 'countable', '噴水は数えられる'),
  count('cnt-05', 'advice', 'uncountable', '助言＝概念。a piece of advice'),
  count('cnt-06', 'baggage', 'uncountable', '荷物の総称'),
  count('cnt-07', 'device', 'countable', '装置・機器は数えられる'),
  count('cnt-08', 'clothing', 'uncountable', '衣類の総称'),
  count('cnt-09', 'equipment', 'uncountable', '設備・機器類の総称'),
  count('cnt-10', 'passenger', 'countable', '乗客は数えられる'),
]

export type PluralCard = {
  id: string
  singular: string
  plural: string
  accept: string[]
  tip: string
  /** イニシャルヒント */
  hint: string
}

function pluralHint(word: string): string {
  return word
    .split(/(\s|-)/)
    .map((part) => {
      if (part === ' ' || part === '-') return part
      if (!part) return part
      return part[0] + '_'.repeat(Math.max(0, part.length - 1))
    })
    .join('')
}

function plural(
  id: string,
  singular: string,
  pluralForm: string,
  tip: string,
  accept: string[] = [pluralForm],
): PluralCard {
  return {
    id,
    singular,
    plural: pluralForm,
    accept,
    tip,
    hint: pluralHint(pluralForm),
  }
}

/** Practice-2 複数形 */
export const PLURAL_CARDS: PluralCard[] = [
  plural('pl-01', 'woman', 'women', '不規則複数'),
  plural('pl-02', 'box', 'boxes', '-x → -es'),
  plural('pl-03', 'accessory', 'accessories', '-y → -ies'),
  plural('pl-04', 'foot', 'feet', '不規則複数'),
  plural('pl-05', 'library', 'libraries', '-y → -ies'),
  plural('pl-06', 'backpack', 'backpacks', '規則複数 -s'),
  plural('pl-07', 'leaf', 'leaves', '-f → -ves'),
  plural(
    'pl-08',
    'co-worker',
    'co-workers',
    '複合語は語尾に -s',
    ['co-workers', 'coworkers', 'co workers'],
  ),
  plural(
    'pl-09',
    'office supply',
    'office supplies',
    '複合語は主要名詞を複数に',
  ),
  plural('pl-10', 'bank account', 'bank accounts', '複合語は主要名詞を複数に'),
]

export type QuantCard = {
  id: string
  prompt: string
  ja: string
  answer: string
  accept: string[]
  choices: string[]
  tip: string
}

function quant(
  id: string,
  prompt: string,
  ja: string,
  answer: string,
  choices: string[],
  tip: string,
  accept: string[] = [answer],
): QuantCard {
  return { id, prompt, ja, answer, accept, choices, tip }
}

/** Practice-3 数量形容詞 */
export const QUANT_CARDS: QuantCard[] = [
  quant(
    'q-01',
    'one (information / passenger)',
    '「1つの〜」',
    'passenger',
    ['information', 'passenger'],
    'one は可算単数のみ。information は不可算',
  ),
  quant(
    'q-02',
    'some (student / students)',
    '「いくつかの〜」',
    'students',
    ['student', 'students'],
    'some は可算複数 or 不可算',
  ),
  quant(
    'q-03',
    'three (book / books)',
    '「3つの〜」',
    'books',
    ['book', 'books'],
    '2以上の数字は可算複数',
  ),
  quant(
    'q-04',
    'a lot of (employee / employees)',
    '「たくさんの〜」',
    'employees',
    ['employee', 'employees'],
    'a lot of + 可算複数 / 不可算',
  ),
  quant(
    'q-05',
    'a lot of (companies / furniture)',
    '両方正しい場合あり',
    'companies / furniture',
    ['companies', 'furniture', 'companies / furniture'],
    'a lot of は可算複数・不可算の両方OK',
    ['companies', 'furniture', 'companies / furniture'],
  ),
  quant(
    'q-06',
    '(many / much) decisions',
    '「たくさんの決定」',
    'many',
    ['many', 'much'],
    'decisions は可算複数 → many',
  ),
  quant(
    'q-07',
    'each (product / products)',
    '「それぞれの〜」',
    'product',
    ['product', 'products'],
    'each / every は可算単数',
  ),
  quant(
    'q-08',
    '(a few / a little) water',
    '「少しの水」',
    'a little',
    ['a few', 'a little'],
    'water は不可算 → a little',
  ),
  quant(
    'q-09',
    'a number of (car / cars)',
    '「多数の〜」',
    'cars',
    ['car', 'cars'],
    'a number of + 可算複数',
  ),
  quant(
    'q-10',
    '(many / much) baggage',
    '「たくさんの荷物」',
    'much',
    ['many', 'much'],
    'baggage は不可算 → much',
  ),
]

export type AgreeCard = {
  id: string
  prompt: string
  ja: string
  answer: string
  choices: string[]
  tip: string
}

function agree(
  id: string,
  prompt: string,
  ja: string,
  answer: string,
  choices: string[],
  tip: string,
): AgreeCard {
  return { id, prompt, ja, answer, choices, tip }
}

/** D. 主語と動詞の一致 */
export const AGREE_CARDS: AgreeCard[] = [
  agree(
    'ag-01',
    'A car _____ parked outside.',
    '車が1台外に駐車されている。',
    'is',
    ['is', 'are'],
    'A car は可算単数 → is',
  ),
  agree(
    'ag-02',
    'A few cars _____ parked outside.',
    '数台の車が外に駐車されている。',
    'are',
    ['is', 'are'],
    'A few cars は可算複数 → are',
  ),
  agree(
    'ag-03',
    'Some furniture _____ in the living room.',
    'リビングに家具がいくつかある。',
    'is',
    ['is', 'are'],
    'furniture は不可算 → 単数扱い is',
  ),
  agree(
    'ag-04',
    'The information _____ useful.',
    'その情報は役に立つ。',
    'is',
    ['is', 'are'],
    'information は不可算 → is',
  ),
  agree(
    'ag-05',
    'Many passengers _____ waiting.',
    '多くの乗客が待っている。',
    'are',
    ['is', 'are'],
    'passengers は可算複数 → are',
  ),
  agree(
    'ag-06',
    'The equipment _____ new.',
    'その設備は新しい。',
    'is',
    ['is', 'are'],
    'equipment は不可算 → is',
  ),
  agree(
    'ag-07',
    'Each product _____ checked carefully.',
    '各製品は注意深くチェックされる。',
    'is',
    ['is', 'are'],
    'each + 単数 → is',
  ),
  agree(
    'ag-08',
    'A number of cars _____ parked outside.',
    '何台もの車が外に駐車されている。',
    'are',
    ['is', 'are'],
    'a number of + 複数 → 複数扱い are',
  ),
]
