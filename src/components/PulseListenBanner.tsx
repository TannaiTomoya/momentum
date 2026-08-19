import { useState } from 'react'
import { unlockAudio } from '../audio/sfx'
import {
  downloadBlob,
  exportPulseTrack,
  playPulseTrack,
} from '../engine/pulse/audio'
import { clipsToPatterns, stringifyPulseTrack } from '../engine/pulse/session'
import { readPulseHash } from '../engine/pulse/share'
import type { PulseClip, PulseKind } from '../engine/types'

function payloadToClips(
  clips: { c: string; b: number; g?: PulseClip['genre']; k?: string }[],
): PulseClip[] {
  return clips.map((clip) => ({
    code: clip.c,
    bpm: clip.b,
    genre: clip.g ?? 'house',
    kind: (clip.k as PulseKind | undefined) ?? 'kick4',
  }))
}

export function PulseListenBanner() {
  const [shared] = useState(() =>
    typeof window === 'undefined' ? null : readPulseHash(),
  )
  const [note, setNote] = useState('')
  if (!shared) return null

  const clips = payloadToClips(shared.clips)
  if (clips.length === 0) return null
  const patterns = clipsToPatterns(clips)
  const code = stringifyPulseTrack(clips)

  const play = async () => {
    await unlockAudio()
    await playPulseTrack(patterns, 2)
    setNote('再生中')
  }

  const save = async () => {
    const blob = await exportPulseTrack(patterns, 2)
    downloadBlob(blob, `pulse-shared-${clips.length}clips.wav`)
    setNote('WAV を保存した')
  }

  return (
    <div className="pulse-share-banner">
      <p className="mode-group-title">共有トラック · {clips.length} クリップ</p>
      <pre className="pulse-share-code">{code}</pre>
      <div className="pulse-actions">
        <button type="button" className="type-submit" onClick={() => void play()}>
          再生
        </button>
        <button type="button" className="type-submit" onClick={() => void save()}>
          WAV
        </button>
      </div>
      {note && <p className="if-lab-status">{note}</p>}
    </div>
  )
}
