import type { PulseClip, PulseGenre } from '../types'

export type PulseSharePayload = {
  clips: { c: string; b: number; g?: PulseGenre; k?: string }[]
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  bytes.forEach((byte) => {
    bin += String.fromCharCode(byte)
  })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(raw: string): string {
  const padded = raw.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const bin = atob(padded + pad)
  const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function encodePulseShare(payload: PulseSharePayload): string {
  return toBase64Url(JSON.stringify(payload))
}

export function decodePulseShare(raw: string): PulseSharePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(raw)) as {
      c?: string
      b?: number
      clips?: PulseSharePayload['clips']
    }
    if (parsed.clips && parsed.clips.length > 0) {
      return { clips: parsed.clips }
    }
    if (parsed.c) {
      return { clips: [{ c: parsed.c, b: parsed.b ?? 112 }] }
    }
    return null
  } catch {
    return null
  }
}

export function pulseShareUrl(clips: PulseClip[]): string {
  const url = new URL(window.location.href)
  url.hash = `pulse=${encodePulseShare({
    clips: clips.map((clip) => ({
      c: clip.code,
      b: clip.bpm,
      g: clip.genre,
      k: clip.kind,
    })),
  })}`
  return url.toString()
}

export function readPulseHash(): PulseSharePayload | null {
  const hash = window.location.hash
  const match = hash.match(/^#pulse=([\w-]+)/)
  if (!match) return null
  return decodePulseShare(match[1])
}
