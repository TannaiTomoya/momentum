import { useEffect, useMemo, useState } from 'react'
import type { MomentumState, Question } from '../engine/types'
import { playPulse, stopPulse } from '../engine/pulse/audio'
import { stepsToString } from '../engine/pulse/pattern'
import { judgePulse } from '../engine/pulse/score'
import { genreLabel, parseLockedPulse } from '../engine/pulse/session'
import { ComboBurst } from './ComboBurst'

function upsertDslLine(source: string, command: string, line: string): string {
  const current = new RegExp(
    `^\\s*${command}\\s*\\([^\\n]*\\)\\s*;?\\s*$`,
    'm',
  )
  if (current.test(source)) return source.replace(current, line)
  return `${source.trimEnd()}\n${line}\n`
}

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

export function PulseScreen({
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
  const spec = question.pulse
  const [code, setCode] = useState(spec?.starter ?? '')
  const [status, setStatus] = useState('コードを書くと音になる')

  useEffect(() => {
    setCode(spec?.starter ?? '')
    setStatus('コードを書くと音になる')
    stopPulse()
  }, [question.id, spec?.starter])

  useEffect(() => () => stopPulse(), [])

  const parsed = useMemo(() => {
    if (!spec) return { error: 'お題がない' } as const
    const next = parseLockedPulse(code, spec)
    if ('error' in next) return next
    next.bpm = spec.bpm
    next.genre = spec.genre
    return next
  }, [code, spec])
  const pattern = 'error' in parsed ? null : parsed

  useEffect(() => {
    if (feedback !== 'idle' || !spec) return
    const id = window.setTimeout(() => {
      const next = parseLockedPulse(code, spec)
      if ('error' in next) return
      next.bpm = spec.bpm
      next.genre = spec.genre
      void playPulse(next, 1)
      const judge = judgePulse(
        spec.kind,
        next,
        spec.stage === 'meaning' ? spec.target : undefined,
        spec.requireGroove,
      )
      setStatus(judge.detail)
    }, 480)
    return () => window.clearTimeout(id)
  }, [code, feedback, spec])

  const handleListen = () => {
    if (!spec?.target) return
    void playPulse(spec.target, 2)
    setStatus('お題の音を再生')
  }

  const handleSubmit = () => {
    if (feedback !== 'idle') return
    onAnswer(code)
  }

  const insertBuilderLine = (
    command: 'kick' | 'humanize',
    line: string,
    label: string,
  ) => {
    if (feedback !== 'idle') return
    setCode((current) => upsertDslLine(current, command, line))
    setStatus(`${label}をコードに入れた`)
  }

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
            {spec.bpm} BPM · {genreLabel(spec.genre)}
            はお題固定。bpm() を書いても変わらない。
            {spec.requireGroove ? ' humanize なしでは通らない。' : ''}
          </p>
        )}
        {question.note && <p className="prompt-note">{question.note}</p>}
        {question.isRecovery && (
          <p className="recovery">挽回チャンス — 同じグルーブをもう一度</p>
        )}
        {feedback === 'wrong' && (
          <p className="answer-reveal">例: {question.answer}</p>
        )}
        <ComboBurst label={tierFlash} burstKey={burstKey} />
      </div>

      {pattern && (
        <div className="pulse-grid" aria-hidden>
          {pattern.kick.map((on, i) => (
            <span
              key={`k-${i}`}
              className={`pulse-cell kick${on ? ' on' : ''}`}
            />
          ))}
        </div>
      )}

      {spec?.stage === 'build' && (
        <div className="pulse-builder-palette" aria-label="曲の部品を選ぶ">
          <div className="pulse-builder-group">
            <span className="pulse-builder-label">1. キック</span>
            <button
              type="button"
              className="pulse-builder-chip"
              disabled={feedback !== 'idle'}
              onClick={() =>
                insertBuilderLine(
                  'kick',
                  'kick("x---x---x---x---")',
                  '4つ打ち',
                )
              }
            >
              4つ打ち
              <code>x---x---x---x---</code>
            </button>
            <button
              type="button"
              className="pulse-builder-chip"
              disabled={feedback !== 'idle'}
              onClick={() =>
                insertBuilderLine(
                  'kick',
                  'kick("x--xx--xx--xx--x")',
                  '跳ねるキック',
                )
              }
            >
              跳ねる
              <code>x--xx--xx--xx--x</code>
            </button>
            <button
              type="button"
              className="pulse-builder-chip"
              disabled={feedback !== 'idle'}
              onClick={() =>
                insertBuilderLine(
                  'kick',
                  'kick("xx--xx--xx--xx--")',
                  '裏を足すキック',
                )
              }
            >
              裏を足す
              <code>xx--xx--xx--xx--</code>
            </button>
          </div>
          <div className="pulse-builder-group">
            <span className="pulse-builder-label">2. 揺らぎ</span>
            <button
              type="button"
              className="pulse-builder-chip"
              disabled={feedback !== 'idle'}
              onClick={() =>
                insertBuilderLine('humanize', 'humanize(8)', '揺らぎ 8ms')
              }
            >
              ほんの少し
              <code>humanize(8)</code>
            </button>
            <button
              type="button"
              className="pulse-builder-chip"
              disabled={feedback !== 'idle'}
              onClick={() =>
                insertBuilderLine('humanize', 'humanize(12)', '揺らぎ 12ms')
              }
            >
              少し揺らす
              <code>humanize(12)</code>
            </button>
            <button
              type="button"
              className="pulse-builder-chip"
              disabled={feedback !== 'idle'}
              onClick={() =>
                insertBuilderLine('humanize', 'humanize(20)', '揺らぎ 20ms')
              }
            >
              大きく揺らす
              <code>humanize(20)</code>
            </button>
          </div>
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
      {'error' in parsed && (
        <p className="mini-error">{parsed.error}</p>
      )}
      {pattern && (
        <p className="prompt-note">
          kick {stepsToString(pattern.kick)} · humanize {pattern.humanizeMs}ms
        </p>
      )}

      <div className="pulse-actions">
        {spec?.stage === 'meaning' && spec.target && (
          <button type="button" className="type-submit" onClick={handleListen}>
            お題を聴く
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
