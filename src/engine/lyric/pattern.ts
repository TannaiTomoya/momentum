import type { LyricRide } from '../types'
import { parseSteps, STEPS, stepsToString } from '../pulse/pattern'

export const LYRIC_STEPS = STEPS
export const LYRIC_BPMS = [96, 104, 112, 120, 128] as const

export type LyricPattern = {
  word: string
  steps: boolean[]
  bpm: number
}

export function emptyLyric(bpm = 112): LyricPattern {
  return {
    word: '',
    steps: Array.from({ length: LYRIC_STEPS }, () => false),
    bpm,
  }
}

export function fourKick(): boolean[] {
  return parseSteps('x---x---x---x---')
}

export function rideSteps(ride: LyricRide, dense: boolean): boolean[] {
  if (ride === 'on') {
    return parseSteps(dense ? 'x-x-x-x-x-x-x-x-' : 'x-------x-------')
  }
  return parseSteps(dense ? '-x-x-x-x-x-x-x-x' : '----x-------x---')
}

export function stringifyLyric(pattern: LyricPattern): string {
  const lines = [
    `bpm(${pattern.bpm})`,
    'kick("x---x---x---x---")',
  ]
  if (pattern.word) {
    lines.push(`lyric("${pattern.word}", "${stepsToString(pattern.steps)}")`)
  }
  return lines.join('\n')
}

export function parseLyricCode(
  code: string,
  fallbackBpm = 112,
): LyricPattern | { error: string } {
  const pattern = emptyLyric(fallbackBpm)
  const lyric = (word: unknown, steps?: unknown) => {
    pattern.word = String(word ?? '').trim()
    if (typeof steps === 'string') {
      pattern.steps = parseSteps(steps)
    } else if (typeof steps === 'number' && Number.isFinite(steps)) {
      const index = Math.max(0, Math.min(LYRIC_STEPS - 1, Math.floor(steps)))
      pattern.steps = Array.from({ length: LYRIC_STEPS }, (_, i) => i === index)
    }
  }
  const kick = () => {}
  const bpm = () => {}
  const snare = () => {}
  const hat = () => {}
  const humanize = () => {}
  const velocity = () => {}

  try {
    const fn = new Function(
      'lyric',
      'kick',
      'snare',
      'hat',
      'humanize',
      'velocity',
      'bpm',
      `"use strict";\n${code}`,
    )
    fn(lyric, kick, snare, hat, humanize, velocity, bpm)
    return pattern
  } catch (error) {
    const message = error instanceof Error ? error.message : 'parse error'
    return { error: message }
  }
}

export function rideOk(steps: boolean[], ride: LyricRide): boolean {
  const hits: number[] = []
  for (let i = 0; i < steps.length; i += 1) {
    if (steps[i]) hits.push(i)
  }
  if (hits.length === 0) return false
  if (ride === 'on') return hits.every((i) => i % 2 === 0)
  return hits.every((i) => i % 2 === 1)
}
