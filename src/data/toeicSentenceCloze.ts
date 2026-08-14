import type { InitialClozeCard } from './initials'

function enHint(en: string): string {
  return en
    .split(/\s+/)
    .map((word) => {
      if (!word) return word
      return word[0] + '_'.repeat(Math.max(0, word.length - 1))
    })
    .join(' ')
}

function card(
  id: string,
  prompt: string,
  ja: string,
  answer: string,
  acceptAnswers: string[] = [answer],
  note?: string,
): InitialClozeCard {
  const accepts = Array.from(
    new Set([answer, ...acceptAnswers].map((a) => a.trim()).filter(Boolean)),
  )
  return {
    id,
    prompt,
    ja,
    answer,
    acceptAnswers: accepts,
    initialHint: enHint(answer),
    note,
  }
}

/** 単語テスト① 文章の中の単語・熟語（TOEIC超必須） */
export const TOEIC_MUST_CLOZE_CARDS: InitialClozeCard[] = [
  card(
    'must-01',
    "Today I'll check the fire ______, sprinklers, and smoke detectors in the building.",
    '今日、建物内の消火器、スプリンクラー、煙探知機を点検します。',
    'extinguisher',
  ),
  card(
    'must-02',
    'Do you have an ______?',
    'アポイントメントはお取りになっていますか。',
    'appointment',
  ),
  card(
    'must-03',
    "We ______ today's visit with the property owner.",
    '私たちは建物のオーナーと今日の訪問を取り決めました。',
    'arranged',
  ),
  card(
    'must-04',
    "Please wear this ID ______ while you're in the building.",
    '建物内にいる間、この身分証明バッジを着用してください。',
    'badge',
  ),
  card(
    'must-05',
    "Is there a good place for me to start where I won't get in anyone's ______?",
    '誰の邪魔にもならずに始められる場所はありますか。',
    'way',
  ),
  card(
    'must-06',
    'The groups that use suites four and five are currently out on a ______.',
    '4番と5番のオフィスを使っているグループは現在、社員研修に出ています。',
    'retreat',
    ['retreat', 'training', 'workshop'],
    'retreat / training / workshop いずれも可',
  ),
  card(
    'must-07',
    "I'll ______ there now.",
    'それでは今からそこへ向かいます。',
    'head',
  ),
  card(
    'must-08',
    'I called this meeting to ______ you on the timeline.',
    'この会議を招集したのは、スケジュールについてあなたに最新情報を伝えるためです。',
    'update',
  ),
  card(
    'must-09',
    "We've been developing the Auto-Check software for our client Super Speed ______.",
    '私たちは顧客であるSuper Speed社のためにAuto-Checkソフトウェアを開発しています。',
    'Industries',
    ['Industries', 'industries'],
  ),
  card(
    'must-10',
    'A representative from Super Speed will visit our office to see a ______ and ask questions.',
    'Super Speed社の担当者が、プレビューを見て質問するために来社します。',
    'preview',
  ),
  card(
    'must-11',
    'Super Speed wants to ______ the software includes all the requested functionalities.',
    'Super Speed社は、そのソフトウェアに要求されたすべての機能が含まれていることを確認したいと考えています。',
    'ensure',
  ),
  card(
    'must-12',
    'By the middle of June, a select number of Super Speed employees will begin using a ______ version.',
    '6月半ばまでに、選ばれたSuper Speed社の従業員がベータ版の使用を開始します。',
    'beta',
  ),
  card(
    'must-13',
    'They will report their ______ by the end of July.',
    '彼らは7月末までに使用経験について報告します。',
    'experiences',
    ['experiences', 'experience'],
  ),
  card(
    'must-14',
    'Finally, we will work on software ______ to address any issues.',
    '最終的に、問題に対処するためソフトウェアの修正に取り組みます。',
    'updates',
    ['updates', 'repairs', 'revisions'],
    'updates / repairs / revisions いずれも可',
  ),
  card(
    'must-15',
    'We will address any ______ that the client encountered throughout August.',
    '8月を通して顧客が経験した問題に対処します。',
    'issues',
  ),
  card(
    'must-16',
    'We will ______ the final product at the end of August.',
    '8月末に最終製品を提供開始します。',
    'release',
    ['release', 'launch'],
    'release / launch いずれも可',
  ),
  card(
    'must-17',
    'The meeting was called to update you on the ______ to deliver the software.',
    'その会議は、ソフトウェアを提供するまでのスケジュールについて最新情報を伝えるために開かれました。',
    'timelines',
    ['timelines', 'timeline'],
  ),
  card(
    'must-18',
    "The building's office numbers are listed in the company ______.",
    '建物のオフィス番号は会社の案内板に載っています。',
    'directory',
  ),
  card(
    'must-19',
    'The second floor contains ______ 4–6.',
    '2階には4～6番のオフィスがあります。',
    'suites',
    ['suites', 'offices', 'office'],
    'suites / offices / office いずれも可',
  ),
  card(
    'must-20',
    'The third floor contains suites 7–10, ______ the fourth floor contains suites 11–12.',
    '3階には7～10番、4階には11～12番のオフィスがあります。「一方で」を表す語。',
    'while',
  ),
]

/** TOEIC超頻出単語テスト FOR BIZ Unit 1・Unit 2 */
export const TOEIC_BIZ_CLOZE_CARDS: InitialClozeCard[] = [
  card(
    'biz-01',
    'The worker is ______ the deck.',
    '作業員が甲板を点検しています。',
    'inspecting',
    ['inspecting', 'checking', 'examining'],
    'inspecting / checking / examining いずれも可',
  ),
  card(
    'biz-02',
    'He is ______ the documents.',
    '彼は書類をファイルしています。',
    'filing',
  ),
  card(
    'biz-03',
    'The man is ______ the parts.',
    '男性が部品を組み立てています。',
    'assembling',
  ),
  card(
    'biz-04',
    'The worker is ______ the old equipment.',
    '作業員が古い設備を取り外しています。',
    'removing',
  ),
  card(
    'biz-05',
    'She is ______ the plates on the table.',
    '彼女はテーブルの上に皿を置いています。',
    'putting',
    ['putting', 'placing'],
    'putting / placing いずれも可',
  ),
  card(
    'biz-06',
    'The woman is ______ the floor.',
    '女性が床を掃いています。',
    'sweeping',
  ),
  card(
    'biz-07',
    'The kitchen ______ are hung on the wall.',
    '台所用品は壁に掛かっています。',
    'utensils',
  ),
  card(
    'biz-08',
    'The worker is ______ the trash can.',
    '作業員がゴミ箱を空にしています。',
    'emptying',
  ),
  card(
    'biz-09',
    'The man is ______ the plumbing.',
    '男性が配管を修理しています。',
    'repairing',
    ['repairing', 'fixing', 'mending'],
    'repairing / fixing / mending いずれも可',
  ),
  card(
    'biz-10',
    'Some boxes are ______ against the wall.',
    '箱が壁のそばに積み上げられています。',
    'stacked',
    ['stacked', 'piled up'],
    'stacked / piled up いずれも可',
  ),
  card(
    'biz-11',
    'He ______ the problem.',
    '彼はその問題を引き起こした。',
    'caused',
  ),
  card(
    'biz-12',
    'She is ______ the company.',
    '彼女は会社を去りました。',
    'leaving',
  ),
  card(
    'biz-13',
    'We are ______ a new project.',
    '私たちは新しいプロジェクトに取り組んでいます。',
    'working on',
  ),
  card(
    'biz-14',
    'He is using his ______ during the meeting.',
    '彼は会議中にノートパソコンを使っています。',
    'laptop',
  ),
  card(
    'biz-15',
    'The workers are ______ new equipment.',
    '作業員が新しい機械を設置しています。',
    'installing',
    ['installing', 'placing', 'setting up'],
    'installing / placing / setting up いずれも可',
  ),
  card(
    'biz-16',
    'The ______ of the new product is very attractive.',
    '新商品のデザインはとても魅力的です。',
    'design',
  ),
  card(
    'biz-17',
    'They are ______ for the charity.',
    '彼らは慈善活動のために資金集めをしています。',
    'raising funds',
  ),
  card(
    'biz-18',
    'The new product will be ______ next month.',
    '新製品は来月発売される予定です。',
    'launched',
  ),
  card(
    'biz-19',
    'Could you ______ a meeting room?',
    '会議室を予約していただけますか。',
    'reserve',
    ['reserve', 'book'],
    'reserve / book いずれも可',
  ),
  card(
    'biz-20',
    'Please ask the ______ for help.',
    '受付係に聞いてみてください。',
    'receptionist',
  ),
  card(
    'biz-21',
    'The order was ______ yesterday.',
    '注文品は昨日発送されました。',
    'shipped',
  ),
  card(
    'biz-22',
    "I can't ______ the document.",
    'その書類を見つけられません。',
    'find',
    ['find', 'locate'],
    'find / locate いずれも可',
  ),
  card(
    'biz-23',
    'He ______ me to the meeting.',
    '彼は私に会議に同行してくれました。',
    'accompanied',
  ),
  card(
    'biz-24',
    'Please call the ______.',
    'その顧客に電話してください。',
    'customer',
    ['customer', 'client', 'guest'],
    'customer / client / guest いずれも可',
  ),
  card(
    'biz-25',
    'I ______ the English course.',
    '私は英語コースに登録しました。',
    'registered',
    [
      'registered',
      'registered for',
      'enrolled in',
      'enrolled',
      'signed up',
      'signed up for',
    ],
    'registered / enrolled in / signed up (for) いずれも可',
  ),
  card(
    'biz-26',
    'Could you ______ this report?',
    'この報告書を校正していただけますか。',
    'proofread',
    ['proofread', 'edit'],
    'proofread / edit いずれも可',
  ),
  card(
    'biz-27',
    'The ______ was completely unexpected.',
    'その結果は完全に予想外でした。',
    'outcome',
    ['outcome', 'result'],
    'outcome / result いずれも可',
  ),
  card(
    'biz-28',
    'I ______ a different day.',
    '私は別の日のほうを好みます。',
    'prefer',
  ),
  card(
    'biz-29',
    'Is the elevator still being ______?',
    'エレベーターはまだ修理中ですか。',
    'repaired',
  ),
  card(
    'biz-30',
    'It is difficult to ______ future problems.',
    '将来の問題を予測することは難しいです。',
    'anticipate',
    ['anticipate', 'predict', 'expect'],
    'anticipate / predict / expect いずれも可',
  ),
]
