import { useState } from 'react'
import { unlockAudio } from '../audio/sfx'
import {
  downloadBlob,
  exportPulseTrack,
  playPulseTrack,
} from '../engine/pulse/audio'
import { clipsToPatterns, stringifyPulseTrack } from '../engine/pulse/session'
import { pulseShareUrl } from '../engine/pulse/share'
import {
  exportLyricTrack,
  playLyricTrack,
} from '../engine/lyric/audio'
import {
  clipsToLyricPatterns,
  stringifyLyricTrack,
} from '../engine/lyric/session'
import { lyricShareUrl } from '../engine/lyric/share'
import type { RunResult } from '../engine/types'

type Props = {
  result: RunResult
  onAgain: () => void
  onTitle: () => void
}

export function ResultScreen({ result, onAgain, onTitle }: Props) {
  const [shareNote, setShareNote] = useState('')
  const accuracy =
    result.answered === 0
      ? 0
      : Math.round((result.correct / result.answered) * 100)
  const clips = result.pulseClips ?? []
  const pulseCode = result.pulseCode ?? stringifyPulseTrack(clips)
  const patterns = clipsToPatterns(clips)
  const lyricClips = result.lyricClips ?? []
  const lyricCode = result.lyricCode ?? stringifyLyricTrack(lyricClips)
  const lyricPatterns = clipsToLyricPatterns(lyricClips)

  const saveWav = async () => {
    if (patterns.length === 0) return
    const blob = await exportPulseTrack(patterns, 2)
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    downloadBlob(blob, `pulse-run-${stamp}-c${result.bestCombo}.wav`)
    setShareNote(`WAV（${clips.length} クリップ）を保存した`)
  }

  const saveCode = () => {
    if (!pulseCode) return
    const blob = new Blob([pulseCode], { type: 'text/javascript;charset=utf-8' })
    downloadBlob(blob, `pulse-run-${result.bestCombo}.js`)
    setShareNote('コードを保存した')
  }

  const playRun = async () => {
    if (patterns.length === 0) return
    await unlockAudio()
    await playPulseTrack(patterns, 2)
    setShareNote('ラン全体を再生中')
  }

  const copyLink = async () => {
    if (clips.length === 0) return
    const url = pulseShareUrl(clips)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Pulse', text: pulseCode, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
      setShareNote('リンクをコピーした')
    } catch {
      await navigator.clipboard.writeText(url)
      setShareNote('リンクをコピーした')
    }
  }

  const copyLyricLink = async () => {
    if (lyricClips.length === 0) return
    const url = lyricShareUrl(lyricClips)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Lyric', text: lyricCode, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
      setShareNote('リンクをコピーした')
    } catch {
      await navigator.clipboard.writeText(url)
      setShareNote('リンクをコピーした')
    }
  }

  return (
    <section className="stage result-panel">
      <h1>RUN CLEAR</h1>
      <p className="tagline">モメンタムを維持できたか？ 弱点は次回ランに混ざる。</p>

      <div className="result-grid">
        <div className="stat">
          <span className="label">Score</span>
          <span className="value">{result.score}</span>
        </div>
        <div className="stat">
          <span className="label">Accuracy</span>
          <span className="value">{accuracy}%</span>
        </div>
        <div className="stat">
          <span className="label">Best Combo</span>
          <span className="value">{result.bestCombo}</span>
        </div>
        <div className="stat">
          <span className="label">XP</span>
          <span className="value">+{result.xpGained}</span>
        </div>
      </div>

      {result.leveledUp && (
        <p className="unlock-note">Level Up! → Lv.{result.newLevel}</p>
      )}
      {result.unlockedParticiple && (
        <p className="unlock-note">Participle Mix が解放された</p>
      )}
      {result.unlockedHard && (
        <p className="unlock-note">Hard Rush が解放された</p>
      )}
      {result.unlockedPulseSyntax && (
        <p className="unlock-note">Pulse Syntax が解放された</p>
      )}
      {result.unlockedPulseBuild && (
        <p className="unlock-note">Pulse Build が解放された</p>
      )}

      {(result.review?.length ?? 0) > 0 && (
        <div className="review-panel">
          <p className="mode-group-title">このランの正誤</p>
          <ul className="review-list">
            {result.review?.map((item, index) => (
              <li key={`${item.prompt}-${index}`} className={item.ok ? 'ok' : 'ng'}>
                <span className="review-mark">{item.ok ? '○' : '×'}</span>
                <span className="review-prompt">{item.prompt}</span>
                {!item.ok && (
                  <span className="review-answer">正解: {item.answer}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {clips.length > 0 && (
        <div className="pulse-share-banner">
          <p className="mode-group-title">
            このランの音 · {clips.length} クリップ
          </p>
          <pre className="pulse-share-code">{pulseCode}</pre>
          <div className="pulse-actions">
            <button
              type="button"
              className="type-submit"
              onClick={() => void playRun()}
            >
              再生
            </button>
            <button
              type="button"
              className="type-submit"
              onClick={() => void saveWav()}
            >
              WAV
            </button>
            <button type="button" className="type-submit" onClick={saveCode}>
              コード
            </button>
            <button
              type="button"
              className="type-submit"
              onClick={() => void copyLink()}
            >
              共有
            </button>
          </div>
          {shareNote && <p className="if-lab-status">{shareNote}</p>}
        </div>
      )}

      {lyricClips.length > 0 && (
        <div className="pulse-share-banner">
          <p className="mode-group-title">
            このランの Lyric · {lyricClips.length} クリップ
          </p>
          <pre className="pulse-share-code">{lyricCode}</pre>
          <div className="pulse-actions">
            <button
              type="button"
              className="type-submit"
              onClick={() => {
                void (async () => {
                  if (lyricPatterns.length === 0) return
                  await unlockAudio()
                  await playLyricTrack(lyricPatterns, 2)
                  setShareNote('ラン全体を再生中')
                })()
              }}
            >
              再生
            </button>
            <button
              type="button"
              className="type-submit"
              onClick={() => {
                void (async () => {
                  if (lyricPatterns.length === 0) return
                  const blob = await exportLyricTrack(lyricPatterns, 2)
                  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
                  downloadBlob(blob, `lyric-run-${stamp}-c${result.bestCombo}.wav`)
                  setShareNote(`WAV（${lyricClips.length} クリップ）を保存した`)
                })()
              }}
            >
              WAV
            </button>
            <button
              type="button"
              className="type-submit"
              onClick={() => {
                if (!lyricCode) return
                const blob = new Blob([lyricCode], {
                  type: 'text/javascript;charset=utf-8',
                })
                downloadBlob(blob, `lyric-run-${result.bestCombo}.js`)
                setShareNote('コードを保存した')
              }}
            >
              コード
            </button>
            <button
              type="button"
              className="type-submit"
              onClick={() => void copyLyricLink()}
            >
              共有
            </button>
          </div>
          {shareNote && <p className="if-lab-status">{shareNote}</p>}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="primary-btn" onClick={onAgain}>
          もう一度
        </button>
        <button
          type="button"
          className="mode-btn"
          style={{ minWidth: 160 }}
          onClick={onTitle}
        >
          <h2 style={{ margin: 0, fontSize: '1rem' }}>タイトルへ</h2>
        </button>
      </div>
    </section>
  )
}
