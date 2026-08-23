import { useCallback, useEffect, useRef, useState } from 'react'
import {
  playComboBurst,
  playCorrect,
  playLevelUp,
  playWrong,
  unlockAudio,
} from '../audio/sfx'
import {
  applyCorrect,
  applyWrong,
  comboTierLabel,
  createMomentum,
} from '../engine/momentum'
import {
  applyAnswerToProgress,
  finalizeRun,
  loadProgress,
  saveProgress,
} from '../engine/progress'
import {
  buildSession,
  createRecoveryQuestion,
  isAnswerCorrect,
  timeLimitForMode,
} from '../engine/session'
import { stringifyPulseTrack } from '../engine/pulse/session'
import { stringifyLyricTrack } from '../engine/lyric/session'
import type {
  GameMode,
  LyricClip,
  MomentumState,
  Progress,
  PulseClip,
  Question,
  ReviewItem,
  RunResult,
} from '../engine/types'

function clipText(value: string, max = 80): string {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max)}…`
}

export type Screen = 'title' | 'playing' | 'result'

export function useGame() {
  const [screen, setScreen] = useState<Screen>('title')
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [mode, setMode] = useState<GameMode>('standard')
  const [queue, setQueue] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [momentum, setMomentum] = useState<MomentumState>(createMomentum)
  const [timeLeft, setTimeLeft] = useState(80)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [burstKey, setBurstKey] = useState(0)
  const [tierFlash, setTierFlash] = useState<string | null>(null)
  const [result, setResult] = useState<RunResult | null>(null)
  const [locked, setLocked] = useState(false)

  const questionStartedAt = useRef(Date.now())
  const progressRef = useRef(progress)
  const endingRef = useRef(false)
  const runStatsRef = useRef({
    momentum: createMomentum(),
    correct: 0,
    answered: 0,
  })
  const queueRef = useRef<Question[]>([])
  const indexRef = useRef(0)
  const modeRef = useRef<GameMode>('standard')
  const lockedRef = useRef(false)
  const pulseClipsRef = useRef<PulseClip[]>([])
  const lyricClipsRef = useRef<LyricClip[]>([])
  const reviewRef = useRef<ReviewItem[]>([])

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    lockedRef.current = locked
  }, [locked])

  useEffect(() => {
    runStatsRef.current = {
      momentum,
      correct: correctCount,
      answered: answeredCount,
    }
  }, [momentum, correctCount, answeredCount])

  const current = queue[index] ?? null

  const endRun = useCallback(() => {
    if (endingRef.current) return
    endingRef.current = true
    const stats = runStatsRef.current
    const { progress: next, result: runResult } = finalizeRun(
      progressRef.current,
      modeRef.current,
      stats.momentum.score,
      stats.correct,
      stats.answered,
      stats.momentum.bestCombo,
    )
    const pulseClips = pulseClipsRef.current
    const lyricClips = lyricClipsRef.current
    const review = reviewRef.current
    setProgress(next)
    setResult({
      ...runResult,
      review,
      ...(pulseClips.length > 0
        ? {
            pulseClips,
            pulseCode: stringifyPulseTrack(pulseClips),
            pulseBpm: pulseClips[0].bpm,
          }
        : {}),
      ...(lyricClips.length > 0
        ? {
            lyricClips,
            lyricCode: stringifyLyricTrack(lyricClips),
          }
        : {}),
    })
    setScreen('result')
    if (
      runResult.leveledUp ||
      runResult.unlockedParticiple ||
      runResult.unlockedHard ||
      runResult.unlockedPulseSyntax ||
      runResult.unlockedPulseBuild
    ) {
      playLevelUp()
    }
  }, [])

  useEffect(() => {
    if (screen !== 'playing') return

    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.setTimeout(() => endRun(), 0)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => window.clearInterval(id)
  }, [screen, endRun])

  const startRun = useCallback(async (nextMode: GameMode) => {
    if (
      (nextMode === 'pulse-syntax' &&
        !progressRef.current.unlocked.pulseSyntax) ||
      (nextMode === 'pulse-build' &&
        !progressRef.current.unlocked.pulseBuild)
    ) {
      return
    }
    await unlockAudio()
    endingRef.current = false
    const session = buildSession(progressRef.current, nextMode)
    setMode(nextMode)
    modeRef.current = nextMode
    setQueue(session)
    queueRef.current = session
    setIndex(0)
    indexRef.current = 0
    const fresh = createMomentum()
    setMomentum(fresh)
    setTimeLeft(timeLimitForMode(nextMode))
    setCorrectCount(0)
    setAnsweredCount(0)
    runStatsRef.current = { momentum: fresh, correct: 0, answered: 0 }
    setFeedback('idle')
    setTierFlash(null)
    setResult(null)
    setLocked(false)
    lockedRef.current = false
    questionStartedAt.current = Date.now()
    pulseClipsRef.current = []
    lyricClipsRef.current = []
    reviewRef.current = []
    setScreen('playing')
  }, [])

  const answer = useCallback(
    (choice: string) => {
      if (screen !== 'playing' || lockedRef.current) return
      const q = queueRef.current[indexRef.current]
      if (!q) return

      lockedRef.current = true
      setLocked(true)

      const reactionMs = Date.now() - questionStartedAt.current
      const ok = isAnswerCorrect(q, choice)
      const prev = runStatsRef.current
      let nextCorrect = prev.correct
      let nextMomentum = prev.momentum
      const nextAnswered = prev.answered + 1

      const nextProgress = applyAnswerToProgress(
        progressRef.current,
        q.itemId,
        ok,
        reactionMs,
      )

      if (ok && q.type === 'pulse' && q.pulse) {
        pulseClipsRef.current = [
          ...pulseClipsRef.current,
          {
            code: choice,
            bpm: q.pulse.bpm,
            genre: q.pulse.genre,
            kind: q.pulse.kind,
          },
        ]
      }
      reviewRef.current = [
        ...reviewRef.current,
        {
          prompt: clipText(q.prompt),
          answer: clipText(q.answer),
          given: clipText(choice),
          ok,
        },
      ]

      if (ok && q.type === 'lyric' && q.lyric) {
        lyricClipsRef.current = [
          ...lyricClipsRef.current,
          {
            code: choice,
            bpm: q.lyric.bpm,
            word: q.lyric.word,
            ride: q.lyric.ride,
          },
        ]
      }

      if (ok) {
        nextCorrect += 1
        nextMomentum = applyCorrect(prev.momentum, reactionMs)
        playCorrect(nextMomentum.combo)
        const tier = comboTierLabel(nextMomentum.combo)
        if (tier && [3, 5, 8, 12].includes(nextMomentum.combo)) {
          setTierFlash(tier)
          setBurstKey((k) => k + 1)
          playComboBurst(nextMomentum.combo)
        }
        setFeedback('correct')
      } else {
        nextMomentum = applyWrong(prev.momentum)
        playWrong()
        setFeedback('wrong')
      }

      runStatsRef.current = {
        momentum: nextMomentum,
        correct: nextCorrect,
        answered: nextAnswered,
      }
      setMomentum(nextMomentum)
      setCorrectCount(nextCorrect)
      setAnsweredCount(nextAnswered)
      setProgress(nextProgress)
      saveProgress(nextProgress)

      window.setTimeout(() => {
        if (endingRef.current) return
        setFeedback('idle')
        setTierFlash(null)

        let nextQueue = queueRef.current
        const currentIndex = indexRef.current
        let nextIndex = currentIndex + 1

        if (!ok) {
          const recovery = createRecoveryQuestion(
            q,
            modeRef.current,
            q.type,
          )
          nextQueue = [
            ...nextQueue.slice(0, currentIndex + 1),
            recovery,
            ...nextQueue.slice(currentIndex + 1),
          ]
          queueRef.current = nextQueue
          setQueue(nextQueue)
        }

        if (nextIndex >= nextQueue.length) {
          endRun()
          return
        }

        indexRef.current = nextIndex
        setIndex(nextIndex)
        questionStartedAt.current = Date.now()
        lockedRef.current = false
        setLocked(false)
      }, ok
        ? 320
        : q.type === 'pulse' || q.type === 'lyric'
          ? 1400
          : q.type === 'initial-type' ||
              q.type === 'if-lab' ||
              q.type === 'tag-lab'
            ? 1100
            : 520)
    },
    [endRun, screen],
  )

  const backToTitle = useCallback(() => {
    endingRef.current = true
    setScreen('title')
    setResult(null)
    setLocked(false)
    lockedRef.current = false
    setFeedback('idle')
    setTierFlash(null)
  }, [])

  return {
    screen,
    progress,
    mode,
    current,
    momentum,
    timeLeft,
    correctCount,
    answeredCount,
    feedback,
    burstKey,
    tierFlash,
    result,
    totalQuestions: queue.length,
    questionNumber: Math.min(index + 1, queue.length || 1),
    startRun,
    answer,
    backToTitle,
  }
}
