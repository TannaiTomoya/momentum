export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb'

export const POS_LABEL: Record<PartOfSpeech, string> = {
  noun: '名詞',
  verb: '動詞',
  adjective: '形容詞',
  adverb: '副詞',
}

export const POS_CHOICES = [
  POS_LABEL.noun,
  POS_LABEL.verb,
  POS_LABEL.adjective,
  POS_LABEL.adverb,
]

export type SuffixCard = {
  id: string
  suffix: string
  examples: string
  pos: PartOfSpeech
  note?: string
}

export type PosWordCard = {
  id: string
  word: string
  meaning: string
  pos: PartOfSpeech
  tip: string
}

function suffix(
  id: string,
  suffixText: string,
  examples: string,
  pos: PartOfSpeech,
  note?: string,
): SuffixCard {
  return { id, suffix: suffixText, examples, pos, note }
}

function word(
  id: string,
  wordText: string,
  meaning: string,
  pos: PartOfSpeech,
  tip: string,
): PosWordCard {
  return { id, word: wordText, meaning, pos, tip }
}

/** 接尾辞 → 品詞 */
export const SUFFIX_CARDS: SuffixCard[] = [
  suffix('suf-ance', '-ance / -ence', 'appearance, difference', 'noun'),
  suffix('suf-ity', '-(i)ty', 'safety, reality', 'noun'),
  suffix('suf-cy', '-cy', 'policy, efficiency', 'noun'),
  suffix('suf-ness', '-ness', 'kindness, happiness', 'noun'),
  suffix('suf-ment', '-ment', 'enhancement, document', 'noun'),
  suffix('suf-th', '-th', 'growth, strength', 'noun'),
  suffix('suf-tion', '-tion', 'condition, information', 'noun'),
  suffix('suf-sion', '-sion / -ssion', 'decision, session, admission', 'noun'),
  suffix('suf-er', '-er / -or', 'customer, director', 'noun'),
  suffix('suf-ee', '-ee', 'trainee, employee', 'noun'),
  suffix('suf-ize', '-ize / -ise', 'specialize, advertise', 'verb'),
  suffix('suf-fy', '-fy', 'identify, clarify', 'verb'),
  suffix('suf-en', '-en', 'strengthen, widen', 'verb'),
  suffix('suf-ate', '-ate', 'participate, create', 'verb'),
  suffix('suf-al', '-al', 'personal, additional', 'adjective'),
  suffix('suf-able', '-able', 'available, reliable', 'adjective'),
  suffix('suf-ful', '-ful', 'useful, careful', 'adjective'),
  suffix('suf-ive', '-ive', 'creative, effective', 'adjective'),
  suffix('suf-ic', '-ic', 'electronic, basic', 'adjective'),
  suffix('suf-ous', '-ous', 'serious, famous', 'adjective'),
  suffix('suf-ant', '-ant / -ent', 'important, efficient', 'adjective'),
  suffix(
    'suf-ly',
    '-ly',
    'personally, significantly, relatively, shortly',
    'adverb',
    '注意: friendly / weekly など「名詞+ly」は形容詞。weekly は副詞用法もあり',
  ),
]

/** 単語 → 品詞（練習10問） */
export const POS_WORD_CARDS: PosWordCard[] = [
  word('pos-01', 'effective', '効果的な', 'adjective', '-ive → 形容詞'),
  word('pos-02', 'discussion', '議論', 'noun', '-sion → 名詞'),
  word('pos-03', 'identify', '認める・特定する', 'verb', '-fy → 動詞'),
  word('pos-04', 'admission', '許可・入場', 'noun', '-sion → 名詞'),
  word('pos-05', 'significantly', 'とても・かなり', 'adverb', '形容詞 + -ly → 副詞'),
  word('pos-06', 'annually', '年に1回', 'adverb', 'annual + -ly → 副詞'),
  word('pos-07', 'realize', '認識する', 'verb', '-ize → 動詞'),
  word('pos-08', 'additional', '追加の', 'adjective', '-al → 形容詞'),
  word('pos-09', 'department', '部門', 'noun', '-ment → 名詞'),
  word('pos-10', 'widen', '広がる・広げる', 'verb', '-en → 動詞'),
]
