let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gainValue: number,
  startAt = 0,
) {
  const audio = getCtx()
  if (!audio) return
  const now = audio.currentTime + startAt
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, now)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  osc.connect(gain)
  gain.connect(audio.destination)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

export async function unlockAudio() {
  const audio = getCtx()
  if (audio?.state === 'suspended') await audio.resume()
}

export function playCorrect(combo: number) {
  tone(520 + Math.min(combo, 10) * 28, 0.12, 'triangle', 0.08)
  if (combo >= 3) tone(780 + Math.min(combo, 10) * 20, 0.16, 'sine', 0.05, 0.05)
}

export function playComboBurst(combo: number) {
  tone(660, 0.08, 'square', 0.04)
  tone(880, 0.1, 'square', 0.035, 0.06)
  tone(1100 + combo * 10, 0.14, 'triangle', 0.045, 0.12)
}

export function playWrong() {
  tone(180, 0.18, 'sawtooth', 0.05)
  tone(140, 0.22, 'triangle', 0.04, 0.05)
}

export function playLevelUp() {
  tone(523, 0.1, 'triangle', 0.06)
  tone(659, 0.12, 'triangle', 0.06, 0.1)
  tone(784, 0.18, 'triangle', 0.07, 0.2)
}
