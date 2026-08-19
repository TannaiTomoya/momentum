import type { LyricClip, LyricRide } from '../types'

export type LyricSharePayload = {
  clips: { c: string; b: number; w?: string; r?: LyricRide }[]
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

export function encodeLyricShare(payload: LyricSharePayload): string {
  return toBase64Url(JSON.stringify(payload))
}

export function decodeLyricShare(raw: string): LyricSharePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(raw)) as {
      clips?: LyricSharePayload['clips']
    }
    if (parsed.clips && parsed.clips.length > 0) {
      return { clips: parsed.clips }
    }
    return null
  } catch {
    return null
  }
}

export function lyricShareUrl(clips: LyricClip[]): string {
  const url = new URL(window.location.href)
  url.hash = `lyric=${encodeLyricShare({
    clips: clips.map((clip) => ({
      c: clip.code,
      b: clip.bpm,
      w: clip.word,
      r: clip.ride,
    })),
  })}`
  return url.toString()
}

export function readLyricHash(): LyricSharePayload | null {
  const hash = window.location.hash
  const match = hash.match(/^#lyric=([\w-]+)/)
  if (!match) return null
  return decodeLyricShare(match[1])
}
