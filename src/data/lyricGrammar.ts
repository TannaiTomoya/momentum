import { PHRASE_CLAUSE_CARDS } from './conjunctions'
import { PHRASE_CARDS } from './vocab'

export type LyricGrammarKind =
  | 'because-clause'
  | 'because-of-phrase'
  | 'though-clause'
  | 'despite-phrase'
  | 'eligible-for'
  | 'either-or'
  | 'both-and'
  | 'whether-or-not'
  | 'unless-clause'
  | 'however-break'

export type LyricGrammarCard = {
  id: string
  kind: LyricGrammarKind
  cue: string
  instruction: string
  example: string
  tip: string
}

function clauseTarget(id: string): string {
  const card = PHRASE_CLAUSE_CARDS.find((item) => item.id === id)
  if (!card) throw new Error(`Missing phrase/clause card: ${id}`)
  return card.target
}

function phraseText(id: string): string {
  const card = PHRASE_CARDS.find((item) => item.id === id)
  if (!card) throw new Error(`Missing phrase card: ${id}`)
  return card.en
}

export const LYRIC_GRAMMAR_CARDS: LyricGrammarCard[] = [
  {
    id: 'lyric-grammar-because',
    kind: 'because-clause',
    cue: 'because + 節',
    instruction: '「緊張したので」を because + 主語 + 動詞で書け。',
    example: `because ${clauseTarget('pc-07')}`,
    tip: 'because の後ろは主語＋本動詞のある節。',
  },
  {
    id: 'lyric-grammar-because-of',
    kind: 'because-of-phrase',
    cue: 'because of + 句',
    instruction: '「緊張のために」を because of + 名詞句で書け。',
    example: `because of ${clauseTarget('pc-08')}`,
    tip: 'because of の後ろは名詞句。',
  },
  {
    id: 'lyric-grammar-though',
    kind: 'though-clause',
    cue: 'though + 節',
    instruction: '「重い病気になったが」を though + 主語 + 動詞で書け。',
    example: `though ${clauseTarget('pc-05')}`,
    tip: 'though の後ろは主語＋本動詞のある節。',
  },
  {
    id: 'lyric-grammar-despite',
    kind: 'despite-phrase',
    cue: 'despite + 句',
    instruction: '「重い病気にもかかわらず」を despite + 名詞句で書け。',
    example: `despite ${clauseTarget('pc-06')}`,
    tip: 'despite の後ろは名詞句。節を直接置かない。',
  },
  {
    id: 'lyric-grammar-eligible',
    kind: 'eligible-for',
    cue: 'eligible for + 名詞',
    instruction: '「ボーナスを受け取る資格がある」を eligible for で書け。',
    example: phraseText('p-eligible-bonus'),
    tip: 'eligible の後ろは for + 名詞。',
  },
  {
    id: 'lyric-grammar-either',
    kind: 'either-or',
    cue: 'either A or B',
    instruction: '「音か沈黙のどちらか」を either A or B で書け。',
    example: 'either sound or silence',
    tip: 'either と or で同じ形の語を並べる。',
  },
  {
    id: 'lyric-grammar-both',
    kind: 'both-and',
    cue: 'both A and B',
    instruction: '「速くて安全」を both A and B で書け。',
    example: 'both quick and safe',
    tip: 'both と and で同じ形の語を並べる。',
  },
  {
    id: 'lyric-grammar-whether',
    kind: 'whether-or-not',
    cue: 'whether ... or not',
    instruction: '「行くかどうか」を whether ... or not で書け。',
    example: 'whether to go or not',
    tip: 'whether to + 動詞 + or not。',
  },
  {
    id: 'lyric-grammar-unless',
    kind: 'unless-clause',
    cue: 'unless + 節',
    instruction: '「私たちが動かない限り」を unless + 主語 + 動詞で書け。',
    example: 'unless we move',
    tip: 'unless の後ろは主語＋本動詞のある節。',
  },
  {
    id: 'lyric-grammar-however',
    kind: 'however-break',
    cue: '. However,',
    instruction: '2文をピリオドで切り、However, で対比させろ。',
    example: 'I fell. However, I rose',
    tip: 'however は接続副詞。ピリオドで文を分ける。',
  },
]
