import {
  xpIntoCurrentLevel,
  xpToNextLevel,
} from '../engine/progress'
import type { GameMode, Progress } from '../engine/types'

type Props = {
  progress: Progress
  onStart: (mode: GameMode) => void
}

export function TitleScreen({ progress, onStart }: Props) {
  const into = xpIntoCurrentLevel(progress.xp, progress.level)
  const need = xpToNextLevel(progress.level)
  const accuracy =
    progress.totalAnswered === 0
      ? 0
      : Math.round((progress.totalCorrect / progress.totalAnswered) * 100)

  return (
    <section className="stage">
      <h1 className="brand">MOMENTUM VERBS</h1>
      <p className="tagline">
        規則・不規則を混ぜて想起し、コンボで加速する動詞ラッシュ。
      </p>

      <div className="meta-row">
        <span>
          Lv <strong>{progress.level}</strong>
        </span>
        <span>
          XP <strong>{into}</strong> / {need}
        </span>
        <span>
          Best <strong>{progress.highScore}</strong>
        </span>
        <span>
          Combo <strong>{progress.bestCombo}</strong>
        </span>
        <span>
          Acc <strong>{accuracy}%</strong>
        </span>
      </div>

      <div className="mode-list">
        <button className="mode-btn" type="button" onClick={() => onStart('standard')}>
          <h2>Momentum Rush</h2>
          <p>意味・原形・過去形をインターリーブ。連続正解で倍率が跳ねる。</p>
        </button>

        <button className="mode-btn" type="button" onClick={() => onStart('core')}>
          <h2>Core Irregular 50</h2>
          <p>
            最重要の不規則動詞 50 語だけをランダム出題。原形・過去形・過去分詞まで定着させる。
          </p>
        </button>

        <div className="mode-group">
          <h3 className="mode-group-title">型別ドリル</h3>
          <p className="mode-group-note">変化パターンごとに分けて定着させる。</p>
          <div className="mode-list nested">
            <button className="mode-btn" type="button" onClick={() => onStart('abb')}>
              <h2>A-B-B 型</h2>
              <p>過去形＝過去分詞（buy → bought → bought など 12 語）</p>
            </button>
            <button className="mode-btn" type="button" onClick={() => onStart('aba')}>
              <h2>A-B-A 型</h2>
              <p>原形＝過去分詞（come → came → come など 3 語）</p>
            </button>
            <button className="mode-btn" type="button" onClick={() => onStart('abc')}>
              <h2>A-B-C 型</h2>
              <p>3 形すべて異なる（begin → began → begun など 11 語）</p>
            </button>
          </div>
        </div>

        <div className="mode-group">
          <h3 className="mode-group-title">文法ドリル</h3>
          <p className="mode-group-note">
            be動詞+ing なら進行形、名詞の働きなら動名詞。接尾辞で品詞を推測。
          </p>
          <div className="mode-list nested">
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('ing-form')}
            >
              <h2>現在進行形 vs 動名詞</h2>
              <p>
                太字の -ing が「〜している」か「〜すること」かを判別（20問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('pos-suffix')}
            >
              <h2>接尾辞 → 品詞</h2>
              <p>
                -ment / -ize / -ive / -ly などが名詞・動詞・形容詞・副詞のどれかを仕分け。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('pos-word')}
            >
              <h2>単語 → 品詞</h2>
              <p>
                effective / discussion / identify など 10 語の品詞を判別。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('word-order')}
            >
              <h2>英文の語順</h2>
              <p>
                S+be+補語 / S+一般動詞(+目的語) の4パターンを判別（16問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('comp-obj')}
            >
              <h2>補語 vs 目的語</h2>
              <p>
                太字が主語を補う補語か、動作の対象の目的語かを判別（8問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('phrase-clause')}
            >
              <h2>句 vs 節</h2>
              <p>
                太字部分に主語＋本動詞があるかで句と節を判別（10問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('conj-prep')}
            >
              <h2>接続詞 vs 前置詞</h2>
              <p>
                Because / Despite / While など、後ろが節か句かで選ぶ（8問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('conj-linker')}
            >
              <h2>等位・従位・接続副詞</h2>
              <p>
                so / because / however などのつなぎ方の違いを判別（8問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('conj-part5')}
            >
              <h2>接続詞 Part5</h2>
              <p>
                either…or / unless / whether など TOEIC 形式の空所補充（10問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('noun-count')}
            >
              <h2>可算 / 不可算</h2>
              <p>
                information / furniture / passenger などを判別（10問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('noun-plural')}
            >
              <h2>複数形入力</h2>
              <p>
                woman → women など、規則・不規則の複数形をタイピング（10問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('noun-quant')}
            >
              <h2>数量形容詞</h2>
              <p>
                many / much / a few / each など、合う名詞を選ぶ（10問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('noun-agree')}
            >
              <h2>主語と動詞の一致</h2>
              <p>
                furniture is / cars are など、is / are を選ぶ（8問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('prep-time')}
            >
              <h2>前置詞（時）</h2>
              <p>
                at / on / in / for / until / by など時の前置詞（15問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('prep-place')}
            >
              <h2>前置詞（場所）</h2>
              <p>
                at / in / by / behind / along など場所の前置詞（12問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('prep-other')}
            >
              <h2>前置詞（その他）</h2>
              <p>
                under construction / as / without / regarding など（8問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('prep-set')}
            >
              <h2>前置詞（セット表現）</h2>
              <p>
                subscribe to / within / owing to / eligible for など（8問）。
              </p>
            </button>
          </div>
        </div>

        <div className="mode-group">
          <h3 className="mode-group-title">ビジネス英単語</h3>
          <p className="mode-group-note">
            freezer / service request / be eligible for などを集中練習。
          </p>
          <div className="mode-list nested">
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('vocab-ja-en')}
            >
              <h2>単語テスト① 日本語 → 英語</h2>
              <p>冷凍庫・売り場・修理依頼など 20 語を想起。</p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('vocab-initials')}
            >
              <h2>イニシャル入力① 日→英</h2>
              <p>
                日本語を見て f______ 形式のヒントから英語をタイピング（20問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('vocab-en-ja')}
            >
              <h2>単語テスト② 英語 → 日本語</h2>
              <p>freezer / section / manager など 10 語。</p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('vocab-initials-en')}
            >
              <h2>イニシャル入力② 英→日</h2>
              <p>
                freezer などを見て 冷＿＿ 形式のヒントから日本語をタイピング（10問）。
              </p>
            </button>
            <button className="mode-btn" type="button" onClick={() => onStart('cloze')}>
              <h2>穴埋め 英文 → 日本語</h2>
              <p>The freezer isn't working properly. など 10 文。</p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('vocab-initials-cloze')}
            >
              <h2>イニシャル入力③ 穴埋め</h2>
              <p>
                英文の空欄を p_______ ヒント付きでタイピング（ちょっと難しい・10問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('phrases')}
            >
              <h2>重要表現ドリル</h2>
              <p>
                be eligible for / submit A to B / be located near などを重点出題。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('vocab-initials-phrases')}
            >
              <h2>イニシャル入力④ TOEICフレーズ</h2>
              <p>
                英語フレーズを見て 座＿＿＿＿＿ ヒント付きで日本語をタイピング（20問）。
              </p>
            </button>
          </div>
        </div>

        <div className="mode-group">
          <h3 className="mode-group-title">TOEIC 写真描写</h3>
          <p className="mode-group-note">
            wipe down / patio / sidewalk café など、写真描写で頻出の語を集中練習。
          </p>
          <div className="mode-list nested">
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('toeic-en-ja')}
            >
              <h2>TOEIC単語① 英→日</h2>
              <p>wipe down / outdoor / patio など 12 語を日本語で入力。</p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('toeic-ja-en')}
            >
              <h2>TOEIC単語② 日→英</h2>
              <p>「～をきれいに拭く」などを英語でタイピング（12問）。</p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('toeic-cloze')}
            >
              <h2>TOEIC穴埋め</h2>
              <p>wiping / sweeping / in front など空欄を入力（6問）。</p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('toeic-must-cloze')}
            >
              <h2>単語テスト① 文章穴埋め</h2>
              <p>
                TOEIC超必須。extinguisher / appointment / ensure などを英文穴埋めで想起（20問）。
              </p>
            </button>
            <button
              className="mode-btn"
              type="button"
              onClick={() => onStart('toeic-biz-cloze')}
            >
              <h2>FOR BIZ Unit1・2 穴埋め</h2>
              <p>
                inspecting / filing / assembling など超頻出語を英文穴埋めで入力（30問）。
              </p>
            </button>
          </div>
        </div>

        <button
          className="mode-btn"
          type="button"
          disabled={!progress.unlocked.participle}
          onClick={() => onStart('participle')}
        >
          <h2>Participle Mix</h2>
          <p>過去分詞を混ぜた検索練習。不規則動詞の定着を狙う。</p>
          {!progress.unlocked.participle && (
            <div className="lock">Lv.2 で解放</div>
          )}
        </button>

        <button
          className="mode-btn"
          type="button"
          disabled={!progress.unlocked.hard}
          onClick={() => onStart('hard')}
        >
          <h2>Hard Rush</h2>
          <p>短時間・多問数。モメンタムを落とさず駆け抜けろ。</p>
          {!progress.unlocked.hard && <div className="lock">Lv.3 で解放</div>}
        </button>
      </div>

      <p className="science-note">
        検索練習・インターリービング・間隔反復を組み込み、連続正解による
        Psychological Momentum でテンションを上げる設計です。
      </p>
    </section>
  )
}
