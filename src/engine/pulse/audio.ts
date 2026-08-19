import { getAudioContext } from '../../audio/sfx'
import type { PulsePattern } from '../types'
import { STEPS } from './pattern'

type PlayHandle = {
  stop: () => void
}

let active: PlayHandle | null = null

function noiseBuffer(ctx: BaseAudioContext, seconds: number): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1
  return buffer
}

function playKick(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  gain: number,
  genre: PulsePattern['genre'],
) {
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = 'sine'
  const startF = genre === 'ukg' ? 108 : genre === 'breaks' ? 168 : 148
  osc.frequency.setValueAtTime(startF, time)
  osc.frequency.exponentialRampToValueAtTime(genre === 'ukg' ? 38 : 42, time + 0.12)
  amp.gain.setValueAtTime(0.0001, time)
  amp.gain.exponentialRampToValueAtTime(0.36 * gain, time + 0.01)
  amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.22)
  osc.connect(amp)
  amp.connect(dest)
  osc.start(time)
  osc.stop(time + 0.24)
}

function playSnare(ctx: BaseAudioContext, dest: AudioNode, time: number, gain: number) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 0.2)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1800
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0.0001, time)
  amp.gain.exponentialRampToValueAtTime(0.22 * gain, time + 0.008)
  amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.16)
  src.connect(filter)
  filter.connect(amp)
  amp.connect(dest)
  src.start(time)
  src.stop(time + 0.18)
}

function playHat(ctx: BaseAudioContext, dest: AudioNode, time: number, gain: number) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 0.08)
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 7000
  const amp = ctx.createGain()
  amp.gain.setValueAtTime(0.0001, time)
  amp.gain.exponentialRampToValueAtTime(0.08 * gain, time + 0.004)
  amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
  src.connect(filter)
  filter.connect(amp)
  amp.connect(dest)
  src.start(time)
  src.stop(time + 0.06)
}

function schedulePattern(
  ctx: BaseAudioContext,
  dest: AudioNode,
  pattern: PulsePattern,
  startAt: number,
  bars: number,
) {
  const stepSec = 60 / pattern.bpm / 4
  const jitter = pattern.humanizeMs / 1000
  const vel = pattern.velocity
  for (let bar = 0; bar < bars; bar += 1) {
    for (let step = 0; step < STEPS; step += 1) {
      const sway = jitter === 0 ? 0 : (Math.random() * 2 - 1) * jitter
      const time = startAt + (bar * STEPS + step) * stepSec + sway
      const g = 1 - vel * Math.random() * 0.45
      if (pattern.kick[step]) playKick(ctx, dest, time, g, pattern.genre)
      if (pattern.snare[step]) playSnare(ctx, dest, time, g * (pattern.genre === 'breaks' ? 1.15 : 1))
      if (pattern.hat[step]) playHat(ctx, dest, time, g * (pattern.genre === 'house' ? 1.1 : 1))
    }
  }
  return STEPS * stepSec * bars
}

export function stopPulse() {
  active?.stop()
  active = null
}

export async function playPulse(
  pattern: PulsePattern,
  bars = 2,
): Promise<number> {
  const ctx = getAudioContext()
  if (!ctx) return 0
  if (ctx.state === 'suspended') await ctx.resume()
  stopPulse()
  const duration = schedulePattern(ctx, ctx.destination, pattern, ctx.currentTime + 0.05, bars)
  const timer = window.setTimeout(() => {
    if (active) active = null
  }, duration * 1000 + 80)
  active = {
    stop: () => window.clearTimeout(timer),
  }
  return duration
}

function encodeWav(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels
  const rate = buffer.sampleRate
  const length = buffer.length
  const bytes = length * channels * 2
  const view = new DataView(new ArrayBuffer(44 + bytes))
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i))
  }
  write(0, 'RIFF')
  view.setUint32(4, 36 + bytes, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channels, true)
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * channels * 2, true)
  view.setUint16(32, channels * 2, true)
  view.setUint16(34, 16, true)
  write(36, 'data')
  view.setUint32(40, bytes, true)
  const mix: Float32Array[] = []
  for (let c = 0; c < channels; c += 1) mix.push(buffer.getChannelData(c))
  let offset = 44
  for (let i = 0; i < length; i += 1) {
    for (let c = 0; c < channels; c += 1) {
      const sample = Math.max(-1, Math.min(1, mix[c][i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
      offset += 2
    }
  }
  return new Blob([view], { type: 'audio/wav' })
}

export async function exportPulseWav(
  pattern: PulsePattern,
  bars = 4,
): Promise<Blob> {
  return exportPulseTrack([pattern], bars)
}

export async function exportPulseTrack(
  patterns: PulsePattern[],
  barsEach = 2,
): Promise<Blob> {
  if (patterns.length === 0) {
    return exportPulseWav(emptyFallback(), 2)
  }
  const gap = 0.12
  const lengths = patterns.map(
    (p) => STEPS * (60 / p.bpm / 4) * barsEach,
  )
  const seconds =
    0.05 +
    lengths.reduce((sum, n) => sum + n, 0) +
    gap * Math.max(0, patterns.length - 1) +
    0.35
  const sampleRate = 44100
  const offline = new OfflineAudioContext(
    2,
    Math.ceil(sampleRate * seconds),
    sampleRate,
  )
  let t = 0.05
  for (let i = 0; i < patterns.length; i += 1) {
    schedulePattern(offline, offline.destination, patterns[i], t, barsEach)
    t += lengths[i] + gap
  }
  const rendered = await offline.startRendering()
  return encodeWav(rendered)
}

function emptyFallback(): PulsePattern {
  return {
    kick: Array.from({ length: STEPS }, () => false),
    snare: Array.from({ length: STEPS }, () => false),
    hat: Array.from({ length: STEPS }, () => false),
    humanizeMs: 0,
    velocity: 0,
    bpm: 112,
    genre: 'house',
  }
}

export async function playPulseTrack(
  patterns: PulsePattern[],
  barsEach = 2,
): Promise<number> {
  const ctx = getAudioContext()
  if (!ctx || patterns.length === 0) return 0
  if (ctx.state === 'suspended') await ctx.resume()
  stopPulse()
  const gap = 0.12
  let t = ctx.currentTime + 0.05
  let lastEnd = 0
  for (const pattern of patterns) {
    const dur = schedulePattern(ctx, ctx.destination, pattern, t, barsEach)
    lastEnd = t + dur - ctx.currentTime
    t += dur + gap
  }
  const timer = window.setTimeout(() => {
    if (active) active = null
  }, lastEnd * 1000 + 80)
  active = {
    stop: () => window.clearTimeout(timer),
  }
  return lastEnd
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}
