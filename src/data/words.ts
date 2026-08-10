export type VerbKind = 'regular' | 'irregular'

export type Verb = {
  id: string
  kind: VerbKind
  base: string
  past: string
  pastAnswers: string[]
  participle: string
  participleAnswers: string[]
  meaning: string
}

function regular(
  base: string,
  past: string,
  meaning: string,
): Verb {
  return {
    id: `r-${base}`,
    kind: 'regular',
    base,
    past,
    pastAnswers: [past],
    participle: past,
    participleAnswers: [past],
    meaning,
  }
}

function irregular(
  base: string,
  past: string,
  participle: string,
  meaning: string,
  pastAnswers?: string[],
  participleAnswers?: string[],
): Verb {
  return {
    id: `i-${base}`,
    kind: 'irregular',
    base,
    past,
    pastAnswers: pastAnswers ?? [past],
    participle,
    participleAnswers: participleAnswers ?? [participle],
    meaning,
  }
}

export const REGULAR_VERBS: Verb[] = [
  regular('accept', 'accepted', '受け入れる'),
  regular('add', 'added', '加える'),
  regular('allow', 'allowed', '許可する'),
  regular('answer', 'answered', '答える'),
  regular('arrive', 'arrived', '到着する'),
  regular('ask', 'asked', '尋ねる'),
  regular('believe', 'believed', '信じる'),
  regular('borrow', 'borrowed', '借りる'),
  regular('call', 'called', '呼ぶ・電話する'),
  regular('change', 'changed', '変える・変わる'),
  regular('compare', 'compared', '比較する'),
  regular('complete', 'completed', '完成させる'),
  regular('consider', 'considered', '考慮する'),
  regular('continue', 'continued', '続ける'),
  regular('create', 'created', '作る'),
  regular('decide', 'decided', '決める'),
  regular('deliver', 'delivered', '配達する'),
  regular('describe', 'described', '描写する'),
  regular('develop', 'developed', '発展させる'),
  regular('discuss', 'discussed', '話し合う'),
  regular('enjoy', 'enjoyed', '楽しむ'),
  regular('explain', 'explained', '説明する'),
  regular('finish', 'finished', '終える'),
  regular('follow', 'followed', '従う・ついていく'),
  regular('happen', 'happened', '起こる'),
  regular('improve', 'improved', '改善する'),
  regular('include', 'included', '含む'),
  regular('increase', 'increased', '増やす・増える'),
  regular('introduce', 'introduced', '紹介する'),
  regular('invite', 'invited', '招待する'),
  regular('join', 'joined', '参加する'),
  regular('learn', 'learned', '学ぶ'),
  regular('manage', 'managed', '管理する・何とかする'),
  regular('mention', 'mentioned', '言及する'),
  regular('offer', 'offered', '提供する・申し出る'),
  regular('order', 'ordered', '注文する'),
  regular('organize', 'organized', '組織する・整理する'),
  regular('prepare', 'prepared', '準備する'),
  regular('produce', 'produced', '生産する'),
  regular('provide', 'provided', '提供する'),
  regular('receive', 'received', '受け取る'),
  regular('reduce', 'reduced', '減らす'),
  regular('require', 'required', '必要とする'),
  regular('return', 'returned', '戻る・返す'),
  regular('support', 'supported', '支援する'),
  regular('suggest', 'suggested', '提案する'),
  regular('travel', 'traveled', '旅行する'),
  regular('use', 'used', '使う'),
  regular('visit', 'visited', '訪問する'),
]

export const IRREGULAR_VERBS: Verb[] = [
  irregular('be', 'was/were', 'been', '～である', ['was', 'were', 'was/were']),
  irregular('become', 'became', 'become', '～になる'),
  irregular('begin', 'began', 'begun', '始める'),
  irregular('break', 'broke', 'broken', '壊す'),
  irregular('bring', 'brought', 'brought', '持ってくる'),
  irregular('build', 'built', 'built', '建てる'),
  irregular('buy', 'bought', 'bought', '買う'),
  irregular('catch', 'caught', 'caught', '捕まえる'),
  irregular('choose', 'chose', 'chosen', '選ぶ'),
  irregular('come', 'came', 'come', '来る'),
  irregular('cost', 'cost', 'cost', '費用がかかる'),
  irregular('cut', 'cut', 'cut', '切る'),
  irregular('do', 'did', 'done', 'する'),
  irregular('draw', 'drew', 'drawn', '描く・引く'),
  irregular('drink', 'drank', 'drunk', '飲む'),
  irregular('drive', 'drove', 'driven', '運転する'),
  irregular('eat', 'ate', 'eaten', '食べる'),
  irregular('fall', 'fell', 'fallen', '落ちる'),
  irregular('feel', 'felt', 'felt', '感じる'),
  irregular('find', 'found', 'found', '見つける'),
  irregular('fly', 'flew', 'flown', '飛ぶ'),
  irregular('forget', 'forgot', 'forgotten', '忘れる'),
  irregular(
    'get',
    'got',
    'got/gotten',
    '得る・到着する',
    ['got'],
    ['got', 'gotten', 'got/gotten'],
  ),
  irregular('give', 'gave', 'given', '与える'),
  irregular('go', 'went', 'gone', '行く'),
  irregular('grow', 'grew', 'grown', '成長する・育てる'),
  irregular('have', 'had', 'had', '持つ'),
  irregular('hear', 'heard', 'heard', '聞く'),
  irregular('hold', 'held', 'held', '持つ・開催する'),
  irregular('keep', 'kept', 'kept', '保つ'),
  irregular('know', 'knew', 'known', '知る'),
  irregular('leave', 'left', 'left', '去る・残す'),
  irregular('lose', 'lost', 'lost', '失う・負ける'),
  irregular('make', 'made', 'made', '作る'),
  irregular('meet', 'met', 'met', '会う'),
  irregular('pay', 'paid', 'paid', '支払う'),
  irregular('put', 'put', 'put', '置く'),
  irregular('read', 'read', 'read', '読む'),
  irregular('run', 'ran', 'run', '走る'),
  irregular('say', 'said', 'said', '言う'),
  irregular('see', 'saw', 'seen', '見る'),
  irregular('sell', 'sold', 'sold', '売る'),
  irregular('send', 'sent', 'sent', '送る'),
  irregular('speak', 'spoke', 'spoken', '話す'),
  irregular('spend', 'spent', 'spent', '費やす'),
  irregular('stand', 'stood', 'stood', '立つ'),
  irregular('take', 'took', 'taken', '取る'),
  irregular('teach', 'taught', 'taught', '教える'),
  irregular('tell', 'told', 'told', '伝える'),
  irregular('write', 'wrote', 'written', '書く'),
]

export const ALL_VERBS: Verb[] = [...REGULAR_VERBS, ...IRREGULAR_VERBS]

export const VERB_BY_ID = Object.fromEntries(
  ALL_VERBS.map((verb) => [verb.id, verb]),
) as Record<string, Verb>
