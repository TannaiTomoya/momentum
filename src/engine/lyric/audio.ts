import { getAudioContext } from '../../audio/sfx'
import { fourKick, LYRIC_STEPS, type LyricPattern } from './pattern'

type PlayHandle = {
  stop: () => void
}

let active: PlayHandle | null = null

function playKick(ctx: BaseAudioContext, dest: AudioNode, time: number) {
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(148, time)
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.12)
  amp.gain.setValueAtTime(0.0001, time)
  amp.gain.exponentialRampToValueAtTime(0.32, time + 0.01)
  amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.22)
  osc.connect(amp)
  amp.connect(dest)
  osc.start(time)
  osc.stop(time + 0.24)
}

function playBeep(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  step: number,
) {
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(660 + (step % 8) * 42, time)
  amp.gain.setValueAtTime(0.0001, time)
  amp.gain.exponentialRampToValueAtTime(0.12, time + 0.01)
  amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.09)
  osc.connect(amp)
  amp.connect(dest)
  osc.start(time)
  osc.stop(time + 0.1)
}

function scheduleLyric(
  ctx: BaseAudioContext,
  dest: AudioNode,
  pattern: LyricPattern,
  startAt: number,
  bars: number,
) {
  const stepSec = 60 / pattern.bpm / 4
  const kick = fourKick()
  for (let bar = 0; bar < bars; bar += 1) {
    for (let step = 0; step < LYRIC_STEPS; step += 1) {
      const time = startAt + (bar * LYRIC_STEPS + step) * stepSec
      if (kick[step]) playKick(ctx, dest, time)
      if (pattern.steps[step]) playBeep(ctx, dest, time, step)
    }
  }
  return LYRIC_STEPS * stepSec * bars
}

export function stopLyric() {
  active?.stop()
  active = null
}

export async function playLyric(
  pattern: LyricPattern,
  bars = 2,
): Promise<number> {
  const ctx = getAudioContext()
  if (!ctx) return 0
  if (ctx.state === 'suspended') await ctx.resume()
  stopLyric()
  const duration = scheduleLyric(
    ctx,
    ctx.destination,
    pattern,
    ctx.currentTime + 0.05,
    bars,
  )
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
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i))
    }
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

export async function exportLyricTrack(
  patterns: LyricPattern[],
  barsEach = 2,
): Promise<Blob> {
  const gap = 0.12
  const lengths = patterns.map((p) => LYRIC_STEPS * (60 / p.bpm / 4) * barsEach)
  const seconds =
    0.05 +
    lengths.reduce((sum, n) => sum + n, 0) +
    gap * Math.max(0, patterns.length - 1) +
    0.35
  const sampleRate = 44100
  const offline = new OfflineAudioContext(
    2,
    Math.max(1, Math.ceil(sampleRate * seconds)),
    sampleRate,
  )
  let t = 0.05
  for (let i = 0; i < patterns.length; i += 1) {
    scheduleLyric(offline, offline.destination, patterns[i], t, barsEach)
    t += lengths[i] + gap
  }
  const rendered = await offline.startRendering()
  return encodeWav(rendered)
}

export async function playLyricTrack(
  patterns: LyricPattern[],
  barsEach = 2,
): Promise<number> {
  const ctx = getAudioContext()
  if (!ctx || patterns.length === 0) return 0
  if (ctx.state === 'suspended') await ctx.resume()
  stopLyric()
  const gap = 0.12
  let t = ctx.currentTime + 0.05
  let lastEnd = 0
  for (const pattern of patterns) {
    const dur = scheduleLyric(ctx, ctx.destination, pattern, t, barsEach)
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
