import type { PulseGenre, PulsePattern } from '../types'

export const STEPS = 16
export const DANCE_BPMS = [96, 104, 112, 120, 128] as const
export const PULSE_GENRES: PulseGenre[] = ['house', 'breaks', 'ukg']

export function emptyPattern(
  bpm = 112,
  genre: PulseGenre = 'house',
): PulsePattern {
  return {
    kick: Array.from({ length: STEPS }, () => false),
    snare: Array.from({ length: STEPS }, () => false),
    hat: Array.from({ length: STEPS }, () => false),
    humanizeMs: 0,
    velocity: 0,
    bpm,
    genre,
  }
}

export function parseSteps(raw: string): boolean[] {
  const cells = raw.replace(/\s+/g, '').split('')
  if (cells.length === 0) return Array.from({ length: STEPS }, () => false)
  const hits = cells.map((c) => c === 'x' || c === 'X' || c === '1')
  if (hits.length === STEPS) return hits
  if (hits.length === 4) {
    return hits.flatMap((h) => [h, false, false, false])
  }
  if (hits.length === 8) {
    return hits.flatMap((h) => [h, false])
  }
  const padded = [...hits]
  while (padded.length < STEPS) padded.push(false)
  return padded.slice(0, STEPS)
}

export function stepsToString(steps: boolean[]): string {
  return steps.map((hit) => (hit ? 'x' : '-')).join('')
}

export function stringifyPattern(pattern: PulsePattern): string {
  const lines = [
    `bpm(${pattern.bpm})`,
    `kick("${stepsToString(pattern.kick)}")`,
  ]
  if (pattern.snare.some(Boolean)) {
    lines.push(`snare("${stepsToString(pattern.snare)}")`)
  }
  if (pattern.hat.some(Boolean)) {
    lines.push(`hat("${stepsToString(pattern.hat)}")`)
  }
  if (pattern.humanizeMs > 0) {
    lines.push(`humanize(${Math.round(pattern.humanizeMs)})`)
  }
  if (pattern.velocity > 0) {
    lines.push(`velocity(${pattern.velocity})`)
  }
  return lines.join('\n')
}

export function parsePulseCode(
  code: string,
  fallbackBpm = 112,
  options?: { lockBpm?: boolean; genre?: PulseGenre },
): PulsePattern | { error: string } {
  const lockBpm = options?.lockBpm !== false
  const pattern = emptyPattern(fallbackBpm, options?.genre ?? 'house')
  const kick = (raw: string) => {
    pattern.kick = parseSteps(String(raw ?? ''))
  }
  const snare = (raw: string) => {
    pattern.snare = parseSteps(String(raw ?? ''))
  }
  const hat = (raw: string) => {
    pattern.hat = parseSteps(String(raw ?? ''))
  }
  const humanize = (ms: number) => {
    pattern.humanizeMs = Math.max(0, Number(ms) || 0)
  }
  const velocity = (amount: number) => {
    pattern.velocity = Math.min(1, Math.max(0, Number(amount) || 0))
  }
  const bpm = (value: number) => {
    if (lockBpm) return
    const next = Number(value)
    if (Number.isFinite(next) && next >= 60 && next <= 180) pattern.bpm = next
  }

  try {
    const fn = new Function(
      'kick',
      'snare',
      'hat',
      'humanize',
      'velocity',
      'bpm',
      `"use strict";\n${code}`,
    )
    fn(kick, snare, hat, humanize, velocity, bpm)
    return pattern
  } catch (error) {
    const message = error instanceof Error ? error.message : 'parse error'
    return { error: message }
  }
}

export function hitCount(steps: boolean[]): number {
  return steps.filter(Boolean).length
}

export function offbeatHits(pattern: PulsePattern): number {
  let count = 0
  for (let i = 1; i < STEPS; i += 2) {
    if (pattern.kick[i] || pattern.snare[i] || pattern.hat[i]) count += 1
  }
  return count
}

export function hasFourOnFloor(pattern: PulsePattern): boolean {
  return Boolean(
    pattern.kick[0] && pattern.kick[4] && pattern.kick[8] && pattern.kick[12],
  )
}

export function isHumanized(pattern: PulsePattern): boolean {
  return pattern.humanizeMs >= 6 && pattern.humanizeMs <= 32
}

export function isQuantized(pattern: PulsePattern): boolean {
  return pattern.humanizeMs < 6 && pattern.velocity < 0.15
}
