export type PhraseClauseKind = 'phrase' | 'clause'

export const PHRASE_CLAUSE_LABEL: Record<PhraseClauseKind, string> = {
  phrase: '句（主語＋本動詞なし）',
  clause: '節（主語＋本動詞あり）',
}

export const PHRASE_CLAUSE_CHOICES = [
  PHRASE_CLAUSE_LABEL.phrase,
  PHRASE_CLAUSE_LABEL.clause,
]

export type PhraseClauseCard = {
  id: string
  en: string
  ja: string
  target: string
  kind: PhraseClauseKind
  tip: string
}

function pc(
  id: string,
  en: string,
  ja: string,
  target: string,
  kind: PhraseClauseKind,
  tip: string,
): PhraseClauseCard {
  return { id, en, ja, target, kind, tip }
}

/** A. 句 vs 節 */
export const PHRASE_CLAUSE_CARDS: PhraseClauseCard[] = [
  pc(
    'pc-01',
    'That company sells shoes in our country.',
    'その会社は我が国で靴を売っています。',
    'our country',
    'phrase',
    '主語＋本動詞がない → 句',
  ),
  pc(
    'pc-02',
    'That company sells shoes in some Asian countries.',
    'その会社はいくつかのアジアの国で靴を売っています。',
    'some Asian countries',
    'phrase',
    '名詞句。主語＋本動詞なし',
  ),
  pc(
    'pc-03',
    'When Nick got to the station, the train had left already.',
    'Nickが駅に着いたとき、電車はすでに出てしまっていた。',
    'When Nick got to the station',
    'clause',
    'Nick（主語）+ got（本動詞）→ 節',
  ),
  pc(
    'pc-04',
    'When Nick got to the station, the train had left already.',
    'Nickが駅に着いたとき、電車はすでに出てしまっていた。',
    'the train had left already',
    'clause',
    'the train + had left → 節',
  ),
  pc(
    'pc-05',
    'Though he got seriously ill, he didn’t give up.',
    '彼は重い病気になったが、あきらめなかった。',
    'he got seriously ill',
    'clause',
    'Though の後ろは節',
  ),
  pc(
    'pc-06',
    'Despite serious illness, he didn’t give up.',
    '重い病気にもかかわらず、彼はあきらめなかった。',
    'serious illness',
    'phrase',
    'Despite の後ろは句（名詞）',
  ),
  pc(
    'pc-07',
    'Because he got nervous, he forgot what to say.',
    '緊張したので、彼は何を言うべきか忘れた。',
    'he got nervous',
    'clause',
    'Because + 節',
  ),
  pc(
    'pc-08',
    'Because of his nervousness, he forgot what to say.',
    '緊張のために、彼は何を言うべきか忘れた。',
    'his nervousness',
    'phrase',
    'Because of + 句',
  ),
  pc(
    'pc-09',
    'While he was having the operation, his family waited.',
    '彼が手術を受けている間、家族は待っていた。',
    'he was having the operation',
    'clause',
    'While + 節',
  ),
  pc(
    'pc-10',
    'During the operation, his family waited.',
    '手術の間、家族は待っていた。',
    'the operation',
    'phrase',
    'During + 句',
  ),
]

export type ChoiceCard = {
  id: string
  prompt: string
  ja: string
  answer: string
  choices: string[]
  tip: string
}

function choice(
  id: string,
  prompt: string,
  ja: string,
  answer: string,
  choices: string[],
  tip: string,
): ChoiceCard {
  return { id, prompt, ja, answer, choices, tip }
}

/** C. Practice-1 接続詞 vs 前置詞 */
export const CONJ_PREP_CARDS: ChoiceCard[] = [
  choice(
    'cp-01',
    '(Because of / Because) the magazine became very popular among young boys, the publisher changed its name.',
    'その雑誌が人気になったので、出版社は名前を変えた。',
    'Because',
    ['Because', 'Because of'],
    '後ろが「the magazine became…」＝節 → 接続詞 Because',
  ),
  choice(
    'cp-02',
    '(Though / Despite) his excellent academic background, his performance was not impressive.',
    '優れた学歴にもかかわらず、ビジネスマンとしての実績は印象的ではなかった。',
    'Despite',
    ['Though', 'Despite'],
    '後ろが名詞句 → 前置詞 Despite（Though は節が必要）',
  ),
  choice(
    'cp-03',
    '(During / While) the election campaign, the candidate was always accompanied by his wife.',
    '選挙運動の間、候補者はいつも妻に付き添われていた。',
    'During',
    ['During', 'While'],
    '後ろが名詞句 → 前置詞 During',
  ),
  choice(
    'cp-04',
    '(Although / In spite of) the house was built twenty years ago, it survived the terrible storm.',
    'その家は20年前に建てられたが、ひどい嵐を生き延びた。',
    'Although',
    ['Although', 'In spite of'],
    '後ろが節 → 接続詞 Although',
  ),
  choice(
    'cp-05',
    '(While / During) he was having the operation, his family was waiting outside the room.',
    '彼が手術を受けている間、家族は部屋の外で待っていた。',
    'While',
    ['While', 'During'],
    '後ろが節 → 接続詞 While',
  ),
  choice(
    'cp-06',
    '(Because / Because of) heavy traffic, she arrived late.',
    'ひどい渋滞のために、彼女は遅れて到着した。',
    'Because of',
    ['Because', 'Because of'],
    'heavy traffic は句 → Because of',
  ),
  choice(
    'cp-07',
    '(Although / Despite) it rained heavily, the outdoor event continued.',
    '激しく雨が降ったが、屋外イベントは続いた。',
    'Although',
    ['Although', 'Despite'],
    'it rained… は節 → Although',
  ),
  choice(
    'cp-08',
    '(In spite of / Though) the rain, the outdoor event continued.',
    '雨にもかかわらず、屋外イベントは続いた。',
    'In spite of',
    ['In spite of', 'Though'],
    'the rain は句 → In spite of',
  ),
]

/** Exercise 1: Part 5 */
export const CONJ_PART5_CARDS: ChoiceCard[] = [
  choice(
    'p5-01',
    "Mr. Hawkins doesn’t get _____ the agenda or the documents prior to the conference.",
    'Hawkins氏は会議前に議題も書類も受け取っていない。',
    'either',
    ['both', 'either', 'nor', 'but'],
    'not either A or B',
  ),
  choice(
    'p5-02',
    'To attend the union meeting, workers must get permission from their supervisor, _____ they will be dismissed in the worst case scenario.',
    '労働組合の会合に出席するには上司の許可が必要。さもないと最悪の場合解雇される。',
    'or',
    ['or', 'and', 'when', 'but'],
    '許可を取れ、さもなければ解雇 → or',
  ),
  choice(
    'p5-03',
    '_____ it is not his obligation, Mr. Williams always goes around his office to see whether all the lights have been turned off.',
    '義務ではないが、Williams氏はいつも電気が消えているか見回る。',
    'Although',
    ['Nevertheless', 'Despite', 'Although', 'Even'],
    '後ろが節 → Although。Despite/Nevertheless は形が合わない',
  ),
  choice(
    'p5-04',
    'The goods should not be packed _____ the final inspection is finished.',
    '最終検査が終わるまで商品を梱包すべきではない。',
    'before',
    ['during', 'when', 'while', 'before'],
    '検査が終わる「前に」→ before + 節',
  ),
  choice(
    'p5-05',
    'Travel expenses should be claimed _____ the 1st of every month.',
    '旅費は毎月1日までに申請すべきである。',
    'by',
    ['by', 'when', 'because', 'for'],
    '期限「〜までに」→ 前置詞 by',
  ),
  choice(
    'p5-06',
    '_____ NAIC’s profits for the first quarter showed a slight recovery, its stock price is still going down.',
    '第1四半期の利益はわずかに回復したが、株価はなお下落している。',
    'While',
    ['Otherwise', 'As soon as', 'While', 'Due to'],
    '対照の While + 節。Due to は句が必要',
  ),
  choice(
    'p5-07',
    'The newly developed device will make the operation of the old equipment _____ quick and safe.',
    '新開発の装置は旧設備の操作を迅速かつ安全にする。',
    'both',
    ['both', 'between', 'neither', 'from'],
    'both A and B',
  ),
  choice(
    'p5-08',
    'We are supposed to make our decision about _____ to attend the exhibition or not.',
    '展示会に出席するかどうかについて決定することになっている。',
    'whether',
    ['because of', 'whether', 'not only', 'if'],
    'whether to V or not',
  ),
  choice(
    'p5-09',
    'The tuition will not be paid from the company, _____ the attendance is more than 80%.',
    '出席が80%を超えない限り、授業料は会社から支払われない。',
    'unless',
    ['in spite of', 'unless', 'as', 'even if'],
    '〜でない限り → unless + 節',
  ),
  choice(
    'p5-10',
    'She can handle the new computer system very well, _____ she used to be a software engineer before joining this company.',
    '彼女は新システムを上手に扱える。というのも、入社前はソフト技術者だったからだ。',
    'since',
    ['so', 'in addition to', 'therefore', 'since'],
    '理由の since + 節。therefore は接続副詞でこの形では不可',
  ),
]

/** 等位接続詞 / 従位接続詞 / 接続副詞の使い分け */
export type LinkerKind = 'coordinating' | 'subordinating' | 'conjunctive-adv'

export const LINKER_LABEL: Record<LinkerKind, string> = {
  coordinating: '等位接続詞（節と節の間のみ）',
  subordinating: '従位接続詞（文頭でも可・後ろは節）',
  'conjunctive-adv': '接続副詞（文をつなげない）',
}

export const LINKER_CHOICES = [
  LINKER_LABEL.coordinating,
  LINKER_LABEL.subordinating,
  LINKER_LABEL['conjunctive-adv'],
]

export type LinkerCard = {
  id: string
  prompt: string
  ja: string
  kind: LinkerKind
  tip: string
}

function linker(
  id: string,
  prompt: string,
  ja: string,
  kind: LinkerKind,
  tip: string,
): LinkerCard {
  return { id, prompt, ja, kind, tip }
}

export const LINKER_CARDS: LinkerCard[] = [
  linker(
    'lk-01',
    'He worked hard, so he got promoted.',
    '彼は一生懸命働き、それで昇進した。',
    'coordinating',
    'so は等位接続詞。文頭に So で2節をつなぐ形は不可',
  ),
  linker(
    'lk-02',
    'Because he got nervous, he forgot what to say.',
    '緊張したので、何を言うか忘れた。',
    'subordinating',
    'Because は従位接続詞。文頭でも節の間でも可',
  ),
  linker(
    'lk-03',
    'He forgot what to say because he got nervous.',
    '緊張したので、何を言うか忘れた。',
    'subordinating',
    '従位接続詞は主節の後ろにも置ける',
  ),
  linker(
    'lk-04',
    'Jim thought the draft was perfect. However, Mr. Smith found some errors.',
    'Jimは草案は完璧だと思った。しかしSmith氏は誤りを見つけた。',
    'conjunctive-adv',
    'However は接続副詞。ピリオドで文を分けて使う',
  ),
  linker(
    'lk-05',
    'Jim thought the draft was perfect, but Mr. Smith found some errors.',
    'Jimは草案は完璧だと思ったが、Smith氏は誤りを見つけた。',
    'coordinating',
    'but は等位接続詞なので1文にできる',
  ),
  linker(
    'lk-06',
    'Although it is not his obligation, Mr. Williams checks the lights.',
    '義務ではないが、Williams氏は電気を確認する。',
    'subordinating',
    'Although + 節',
  ),
  linker(
    'lk-07',
    'Mr. Smith, however, found some errors.',
    'しかしSmith氏は誤りを見つけた。',
    'conjunctive-adv',
    '接続副詞は文中にも置ける',
  ),
  linker(
    'lk-08',
    'Though he got seriously ill, he didn’t give up.',
    '重い病気になったが、彼はあきらめなかった。',
    'subordinating',
    'Though の後ろは必ず節',
  ),
]
