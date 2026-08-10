import type { RunResult } from '../engine/types'

type Props = {
  result: RunResult
  onAgain: () => void
  onTitle: () => void
}

export function ResultScreen({ result, onAgain, onTitle }: Props) {
  const accuracy =
    result.answered === 0
      ? 0
      : Math.round((result.correct / result.answered) * 100)

  return (
    <section className="stage result-panel">
      <h1>RUN CLEAR</h1>
      <p className="tagline">モメンタムを維持できたか？ 弱点は次回ランに混ざる。</p>

      <div className="result-grid">
        <div className="stat">
          <span className="label">Score</span>
          <span className="value">{result.score}</span>
        </div>
        <div className="stat">
          <span className="label">Accuracy</span>
          <span className="value">{accuracy}%</span>
        </div>
        <div className="stat">
          <span className="label">Best Combo</span>
          <span className="value">{result.bestCombo}</span>
        </div>
        <div className="stat">
          <span className="label">XP</span>
          <span className="value">+{result.xpGained}</span>
        </div>
      </div>

      {result.leveledUp && (
        <p className="unlock-note">Level Up! → Lv.{result.newLevel}</p>
      )}
      {result.unlockedParticiple && (
        <p className="unlock-note">Participle Mix が解放された</p>
      )}
      {result.unlockedHard && (
        <p className="unlock-note">Hard Rush が解放された</p>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="primary-btn" onClick={onAgain}>
          もう一度
        </button>
        <button
          type="button"
          className="mode-btn"
          style={{ minWidth: 160 }}
          onClick={onTitle}
        >
          <h2 style={{ margin: 0, fontSize: '1rem' }}>タイトルへ</h2>
        </button>
      </div>
    </section>
  )
}
