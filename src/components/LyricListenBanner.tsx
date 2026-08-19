import { useState } from 'react'
import { unlockAudio } from '../audio/sfx'
import { downloadBlob } from '../engine/pulse/audio'
import {
  exportLyricTrack,
  playLyricTrack,
} from '../engine/lyric/audio'
import {
  clipsToLyricPatterns,
  stringifyLyricTrack,
} from '../engine/lyric/session'
import { readLyricHash } from '../engine/lyric/share'
import type { LyricClip } from '../engine/types'

export function LyricListenBanner() {
  const [shared] = useState(() =>
    typeof window === 'undefined' ? null : readLyricHash(),
  )
  const [note, setNote] = useState('')
  if (!shared) return null

  const clips: LyricClip[] = shared.clips.map((clip) => ({
    code: clip.c,
    bpm: clip.b,
    word: clip.w ?? '',
    ride: clip.r ?? 'on',
  }))
  if (clips.length === 0) return null
  const patterns = clipsToLyricPatterns(clips)
  const code = stringifyLyricTrack(clips)

  const play = async () => {
    await unlockAudio()
    await playLyricTrack(patterns, 2)
    setNote('再生中')
  }

  const save = async () => {
    const blob = await exportLyricTrack(patterns, 2)
    downloadBlob(blob, `lyric-shared-${clips.length}clips.wav`)
    setNote('WAV を保存した')
  }

  return (
    <div className="pulse-share-banner">
      <p className="mode-group-title">共有 Lyric · {clips.length} クリップ</p>
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
