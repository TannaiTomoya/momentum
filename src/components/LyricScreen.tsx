import { useEffect, useMemo, useState } from 'react'
import type { MomentumState, Question } from '../engine/types'
import { playLyric, stopLyric } from '../engine/lyric/audio'
import { parseLockedLyric } from '../engine/lyric/session'
import { judgeLyric } from '../engine/lyric/score'
import { stepsToString } from '../engine/pulse/pattern'
import { ComboBurst } from './ComboBurst'

type Props = {
  question: Question
  questionNumber: number
  totalQuestions: number
  timeLeft: number
  momentum: MomentumState
  feedback: 'idle' | 'correct' | 'wrong'
  burstKey: number
  tierFlash: string | null
  onAnswer: (code: string) => void
  onBackToMenu: () => void
}

export function LyricScreen({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  momentum,
  feedback,
  burstKey,
  tierFlash,
  onAnswer,
  onBackToMenu,
}: Props) {
  const spec = question.lyric
  const [code, setCode] = useState(spec?.starter ?? '')
  const [status, setStatus] = useState('コードを書くとキックの上に beep が乗る')

  useEffect(() => {
    setCode(spec?.starter ?? '')
    setStatus('コードを書くとキックの上に beep が乗る')
    stopLyric()
  }, [question.id, spec?.starter])

  useEffect(() => () => stopLyric(), [])

  const parsed = useMemo(() => {
    if (!spec) return { error: 'お題がない' } as const
    return parseLockedLyric(code, spec)
  }, [code, spec])
  const pattern = 'error' in parsed ? null : parsed

  useEffect(() => {
    if (feedback !== 'idle' || !spec) return
    const id = window.setTimeout(() => {
      const next = parseLockedLyric(code, spec)
      if ('error' in next) return
      void playLyric(next, 1)
      setStatus(judgeLyric(spec, next).detail)
    }, 480)
    return () => window.clearTimeout(id)
  }, [code, feedback, spec])

  const handleListen = () => {
    if (!spec?.target) return
    void playLyric(spec.target, 2)
    setStatus('お題の乗りを再生')
  }

  const handleSubmit = () => {
    if (feedback !== 'idle') return
    onAnswer(code)
  }

  const rideJa = spec?.ride === 'off' ? '裏' : 'オンビート'

  return (
    <section
      className={`stage pulse-stage feedback-${feedback}`}
      style={{ ['--heat' as string]: String(momentum.heat) }}
    >
      <div
        className="pulse-code-bg"
        aria-hidden
        style={{ opacity: 0.08 + momentum.heat * 0.18 }}
      >
        {code}
      </div>

      <div className="hud">
        <div className="hud-block">
          <button
            type="button"
            className="back-menu-btn"
            onClick={() => {
              if (window.confirm('途中終了してメニューに戻りますか？')) {
                onBackToMenu()
              }
            }}
          >
            メニューへ
          </button>
          <span className="hud-label">Score</span>
          <span className="hud-value">{momentum.score}</span>
        </div>
        <div className={`timer ${timeLeft <= 10 ? 'urgent' : ''}`}>
          <span>{timeLeft}</span>
        </div>
        <div className="hud-block right">
          <span className="hud-label">Q</span>
          <span className="hud-value">
            {questionNumber}/{totalQuestions}
          </span>
        </div>
      </div>

      <div className={`prompt-area ${momentum.heat > 0.4 ? 'heat-on' : ''}`}>
        <div className="kind-chip">
          {question.chip}
          {' · '}
          {question.hint}
          {' · 固定'}
        </div>
        <h2 className="prompt-text prompt-sentence">{question.prompt}</h2>
        {spec && (
          <p className="prompt-note">
            {spec.bpm} BPM · キック固定。書くのは lyric()。
            {spec.requireRide ? ` ${rideJa} に x。` : ' 語が合えば通る。'}
          </p>
        )}
        {question.note && <p className="prompt-note">{question.note}</p>}
        {question.isRecovery && (
          <p className="recovery">挽回チャンス — 同じ語をもう一度</p>
        )}
        {feedback === 'wrong' && (
          <p className="answer-reveal">例: {question.answer}</p>
        )}
        <ComboBurst label={tierFlash} burstKey={burstKey} />
      </div>

      {pattern && (
        <div className="pulse-grid" aria-hidden>
          {pattern.steps.map((on, i) => (
            <span
              key={`l-${i}`}
              className={`pulse-cell lyric${on ? ' on' : ''}`}
            />
          ))}
        </div>
      )}

      <textarea
        className="pulse-editor"
        value={code}
        spellCheck={false}
        disabled={feedback !== 'idle'}
        onChange={(event) => setCode(event.target.value)}
      />

      <p className="if-lab-status">{status}</p>
      {'error' in parsed && <p className="mini-error">{parsed.error}</p>}
      {pattern && (
        <p className="prompt-note">
          lyric {pattern.word || '—'} · {stepsToString(pattern.steps)}
        </p>
      )}

      <div className="pulse-actions">
        {spec?.stage !== 'meaning' && spec?.target && (
          <button type="button" className="type-submit" onClick={handleListen}>
            乗りを聴く
          </button>
        )}
        <button
          type="button"
          className="primary-btn"
          disabled={feedback !== 'idle' || !code.trim()}
          onClick={handleSubmit}
        >
          答える
        </button>
      </div>

      <div className="combo-rail">
        <div>
          <div className="combo-text">{momentum.combo} COMBO</div>
          <div className="multiplier">×{momentum.multiplier}</div>
        </div>
        <div className="score-pop">BEST {momentum.bestCombo}</div>
      </div>
    </section>
  )
}
