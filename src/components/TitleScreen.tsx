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
