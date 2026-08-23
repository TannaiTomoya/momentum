import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import type { MomentumState, Question, QuestionType } from '../engine/types'
import { ComboBurst } from './ComboBurst'
import { IfLabPreview } from './IfLabPreview'
import { TagLabPreview } from './TagLabPreview'

const HIDE_SUBTITLE_UNTIL_ANSWER: QuestionType[] = [
  'ing-classify',
  'word-order-classify',
  'comp-obj-classify',
  'phrase-clause-classify',
  'conj-choice',
  'linker-classify',
  'quant-choice',
  'agree-choice',
]

function shouldHideSubtitleUntilAnswer(question: Question): boolean {
  if (HIDE_SUBTITLE_UNTIL_ANSWER.includes(question.type)) return true
  if (question.type === 'pos-classify' && question.subtitle) return true
  return false
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
  onAnswer: (choice: string) => void
  onBackToMenu: () => void
}

function renderPrompt(question: Question): ReactNode {
  const { prompt, emphasis } = question
  if (!emphasis) return prompt

  const index = prompt.toLowerCase().indexOf(emphasis.toLowerCase())
  if (index < 0) return prompt

  const before = prompt.slice(0, index)
  const match = prompt.slice(index, index + emphasis.length)
  const after = prompt.slice(index + emphasis.length)
  return (
    <>
      {before}
      <strong className="ing-emphasis">{match}</strong>
      {after}
    </>
  )
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
  onBackToMenu,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [exampleRevealed, setExampleRevealed] = useState(false)
  const [subtitleRevealed, setSubtitleRevealed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setSelected(null)
    setTyped('')
    setExampleRevealed(false)
    setSubtitleRevealed(false)
    if (
      question.type === 'initial-type' ||
      question.type === 'if-lab' ||
      question.type === 'tag-lab'
    ) {
      window.setTimeout(() => inputRef.current?.focus(), 40)
    }
  }, [question.id, question.type])

  const handleChoice = (choice: string) => {
    if (feedback !== 'idle') return
    setSelected(choice)
    onAnswer(choice)
  }

  const handleTypeSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (feedback !== 'idle') return
    const value = typed.trim()
    if (!value) return
    setSelected(value)
    onAnswer(value)
  }

  const sentenceLike =
    question.type === 'cloze-en-to-ja' ||
    question.type === 'ing-classify' ||
    question.type === 'word-order-classify' ||
    question.type === 'comp-obj-classify' ||
    question.type === 'phrase-clause-classify' ||
    question.type === 'conj-choice' ||
    question.type === 'linker-classify' ||
    (question.type === 'initial-type' && Boolean(question.subtitle)) ||
    question.type === 'if-lab' ||
    question.type === 'tag-lab'
  const isTyping =
    question.type === 'initial-type' ||
    question.type === 'if-lab' ||
    question.type === 'tag-lab'
  const hideSubtitleUntilAnswer = shouldHideSubtitleUntilAnswer(question)
  const showSubtitle =
    question.subtitle &&
    (!hideSubtitleUntilAnswer || feedback !== 'idle' || subtitleRevealed)
  const showSubtitleHint =
    hideSubtitleUntilAnswer &&
    question.subtitle &&
    feedback === 'idle' &&
    !subtitleRevealed
  const showExampleHint =
    question.exampleHint &&
    (exampleRevealed || feedback !== 'idle')
  const hideNoteUntilAnswer =
    question.type === 'pos-classify' ||
    question.type === 'word-order-classify' ||
    question.type === 'comp-obj-classify' ||
    question.type === 'phrase-clause-classify' ||
    question.type === 'conj-choice' ||
    question.type === 'linker-classify' ||
    question.type === 'count-classify' ||
    question.type === 'quant-choice' ||
    question.type === 'agree-choice'

  return (
    <section
      className={`stage feedback-${feedback}`}
      style={{ ['--heat' as string]: String(momentum.heat) }}
    >
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
        </div>
        <h2 className={`prompt-text${sentenceLike ? ' prompt-sentence' : ''}`}>
          {renderPrompt(question)}
        </h2>
        {question.initialHint && (
          <p className="initial-hint" aria-label="イニシャルヒント">
            {question.initialHint}
          </p>
        )}
        {showSubtitleHint && (
          <button
            type="button"
            className="hint-btn"
            onClick={() => setSubtitleRevealed(true)}
          >
            ヒント（訳を見る）
          </button>
        )}
        {showSubtitle && (
          <p className="prompt-subtitle">{question.subtitle}</p>
        )}
        {question.exampleHint && feedback === 'idle' && !exampleRevealed && (
          <button
            type="button"
            className="hint-btn"
            onClick={() => setExampleRevealed(true)}
          >
            ヒント（例語を見る）
          </button>
        )}
        {showExampleHint && (
          <p className="prompt-subtitle">例: {question.exampleHint}</p>
        )}
        {question.ifLab && (
          <IfLabPreview spec={question.ifLab} typed={typed} />
        )}
        {question.tagLab && (
          <TagLabPreview spec={question.tagLab} typed={typed} />
        )}
        {question.note &&
          (!hideNoteUntilAnswer || feedback !== 'idle') && (
            <p className="prompt-note">{question.note}</p>
          )}
        {question.isRecovery && (
          <p className="recovery">挽回チャンス — さっきの語をもう一度</p>
        )}
        {feedback === 'wrong' && isTyping && (
          <p className="answer-reveal">正解: {question.answer}</p>
        )}
        <ComboBurst label={tierFlash} burstKey={burstKey} />
      </div>

      {isTyping ? (
        <form className="type-form" onSubmit={handleTypeSubmit}>
          <input
            ref={inputRef}
            className="type-input"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={
              question.type === 'if-lab'
                ? question.ifLab?.stage === 'syntax'
                  ? '<  ===  && …'
                  : question.ifLab?.stage === 'build'
                    ? 'age < 16'
                    : 'less than / equal to …'
                : question.type === 'tag-lab'
                  ? question.tagLab?.stage === 'syntax'
                    ? 'tr  /  display: flex …'
                    : question.tagLab?.stage === 'build'
                      ? 'footer'
                      : 'header / table row …'
                  : question.hint.includes('英→日')
                    ? '日本語で入力…'
                    : '英語で入力…'
            }
            value={typed}
            disabled={feedback !== 'idle'}
            onChange={(e) => setTyped(e.target.value)}
            data-selected={selected !== null}
          />
          <button
            type="submit"
            className="type-submit"
            disabled={feedback !== 'idle' || !typed.trim()}
          >
            答える
          </button>
        </form>
      ) : (
        <div
          className={`choices${
            question.type === 'ing-classify' ||
            question.type === 'comp-obj-classify' ||
            question.type === 'phrase-clause-classify' ||
            question.type === 'count-classify' ||
            question.type === 'agree-choice'
              ? ' choices-binary'
              : question.type === 'pos-classify' ||
                  question.type === 'word-order-classify' ||
                  question.type === 'conj-choice' ||
                  question.type === 'linker-classify' ||
                  question.type === 'quant-choice'
                ? ' choices-pos'
                : ''
          }`}
        >
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
      )}

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
