import { useEffect, useState } from 'react'
import type { MomentumState, Question } from '../engine/types'
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
  onAnswer: (choice: string) => void
}

export function GameScreen({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  momentum,
  feedback,
  burstKey,
  tierFlash,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setSelected(null)
  }, [question.id])

  const handleChoice = (choice: string) => {
    if (feedback !== 'idle') return
    setSelected(choice)
    onAnswer(choice)
  }

  return (
    <section
      className={`stage feedback-${feedback}`}
      style={{ ['--heat' as string]: String(momentum.heat) }}
    >
      <div className="hud">
        <div className="hud-block">
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
          {question.verb.kind === 'regular' ? 'Regular' : 'Irregular'}
          {' · '}
          {question.hint}
        </div>
        <h2 className="prompt-text">{question.prompt}</h2>
        {question.isRecovery && (
          <p className="recovery">挽回チャンス — さっきの語をもう一度</p>
        )}
        <ComboBurst label={tierFlash} burstKey={burstKey} />
      </div>

      <div className="choices">
        {question.choices.map((choice) => (
          <button
            key={`${question.id}-${choice}`}
            type="button"
            className="choice"
            data-selected={selected === choice}
            disabled={feedback !== 'idle'}
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </button>
        ))}
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
