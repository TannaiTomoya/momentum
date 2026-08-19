import { useMemo, useState, Fragment } from 'react'
import { PulseListenBanner } from './PulseListenBanner'
import { LyricListenBanner } from './LyricListenBanner'
import {
  xpIntoCurrentLevel,
  xpToNextLevel,
} from '../engine/progress'
import { timeLimitForMode } from '../engine/session'
import type { GameMode, Progress } from '../engine/types'
import {
  LAB_CATALOG,
  LAB_GROUP_NOTE,
  LAB_KIND_LABEL,
  isLabUnlocked,
  labLock,
  labLockLabel,
  type LabEntry,
  type LabKind,
  type LabStage,
} from '../data/labCatalog'

type Props = {
  progress: Progress
  onStart: (mode: GameMode) => void
}

type DurationFilter = 'all' | 'short' | 'long'

function groupLabs(labs: LabEntry[]): { group: string; items: LabEntry[] }[] {
  const order: string[] = []
  const map = new Map<string, LabEntry[]>()
  for (const lab of labs) {
    const key = lab.group || '__solo'
    if (!map.has(key)) {
      map.set(key, [])
      order.push(key)
    }
    map.get(key)?.push(lab)
  }
  return order.map((group) => ({
    group: group === '__solo' ? '' : group,
    items: map.get(group) ?? [],
  }))
}

export function TitleScreen({ progress, onStart }: Props) {
  const into = xpIntoCurrentLevel(progress.xp, progress.level)
  const need = xpToNextLevel(progress.level)
  const accuracy =
    progress.totalAnswered === 0
      ? 0
      : Math.round((progress.totalCorrect / progress.totalAnswered) * 100)

  const [keyword, setKeyword] = useState('')
  const [kind, setKind] = useState<LabKind | 'all'>('all')
  const [unlockedOnly, setUnlockedOnly] = useState(false)
  const [stage, setStage] = useState<LabStage | 'all'>('all')
  const [duration, setDuration] = useState<DurationFilter>('all')

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return LAB_CATALOG.filter((lab) => {
      if (kind !== 'all' && lab.kind !== kind) return false
      if (stage !== 'all' && lab.stage !== stage) return false
      if (unlockedOnly && !isLabUnlocked(lab.mode, progress)) return false
      const seconds = timeLimitForMode(lab.mode)
      if (duration === 'short' && seconds > 90) return false
      if (duration === 'long' && seconds <= 90) return false
      if (!q) return true
      const hay = `${lab.title} ${lab.blurb} ${lab.group} ${LAB_KIND_LABEL[lab.kind]}`.toLowerCase()
      return hay.includes(q)
    })
  }, [keyword, kind, unlockedOnly, stage, duration, progress])

  const grouped = groupLabs(filtered)

  return (
    <section className="stage">
      <h1 className="brand">MOMENTUM</h1>
      <p className="tagline">
        Verbs・文法・タグ・Pulse・Lyric。検索して、コンボで加速するラボ。
      </p>
      <PulseListenBanner />
      <LyricListenBanner />

      <div className="meta-row">
        <span>
          Lv <strong>{progress.level}</strong>
        </span>
        <span>
          XP <strong>{into}</strong> / {need}
        </span>
        <span>
          Best <strong>{progress.highScore}</strong>
        </span>
        <span>
          Combo <strong>{progress.bestCombo}</strong>
        </span>
        <span>
          Acc <strong>{accuracy}%</strong>
        </span>
      </div>

      <div className="lab-search">
        <label className="lab-search-field">
          キーワード
          <input
            type="search"
            value={keyword}
            placeholder="kick / because / 前置詞"
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>
        <label className="lab-search-field">
          種類
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as LabKind | 'all')}
          >
            <option value="all">すべて</option>
            {(Object.keys(LAB_KIND_LABEL) as LabKind[]).map((key) => (
              <option key={key} value={key}>
                {LAB_KIND_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="lab-detail">
        <p className="lab-detail-title">詳細検索</p>
        <label className="lab-detail-check">
          <input
            type="checkbox"
            checked={unlockedOnly}
            onChange={(event) => setUnlockedOnly(event.target.checked)}
          />
          解放済みのみ
        </label>
        <label className="lab-detail-field">
          ステージ
          <select
            value={stage}
            onChange={(event) => setStage(event.target.value as LabStage | 'all')}
          >
            <option value="all">すべて</option>
            <option value="meaning">Meaning</option>
            <option value="syntax">Syntax</option>
            <option value="build">Build</option>
            <option value="grammar">Grammar</option>
            <option value="toeic">TOEIC対策</option>
          </select>
        </label>
        <label className="lab-detail-field">
          制限時間
          <select
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value as DurationFilter)
            }
          >
            <option value="all">すべて</option>
            <option value="short">短い（90秒以下）</option>
            <option value="long">長い（91秒以上）</option>
          </select>
        </label>
      </div>

      <div className="lab-table-wrap">
        <table className="lab-table">
          <thead>
            <tr>
              <th>種類</th>
              <th>名前</th>
              <th>内容</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4}>該当するラボはない</td>
              </tr>
            )}
            {filtered.map((lab) => {
              const lock = labLock(lab.mode)
              const unlocked = isLabUnlocked(lab.mode, progress)
              return (
                <tr key={lab.mode}>
                  <td>{LAB_KIND_LABEL[lab.kind]}</td>
                  <td>{lab.group ? `${lab.group} / ${lab.title}` : lab.title}</td>
                  <td>{lab.blurb}</td>
                  <td>
                    <button
                      type="button"
                      className="type-submit"
                      disabled={!unlocked}
                      onClick={() => onStart(lab.mode)}
                    >
                      {unlocked ? '開始' : lock ? labLockLabel(lock) : '開始'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mode-list">
        {grouped.map(({ group, items }) => {
          if (!group) {
            return (
              <Fragment key={items.map((lab) => lab.mode).join('-')}>
                {items.map((lab) => {
                  const lock = labLock(lab.mode)
                  const unlocked = isLabUnlocked(lab.mode, progress)
                  return (
                    <button
                      key={lab.mode}
                      className="mode-btn"
                      type="button"
                      disabled={!unlocked}
                      onClick={() => onStart(lab.mode)}
                    >
                      <h2>{lab.title}</h2>
                      <p>{lab.blurb}</p>
                      {!unlocked && lock && (
                        <div className="lock">{labLockLabel(lock)}</div>
                      )}
                    </button>
                  )
                })}
              </Fragment>
            )
          }
          return (
            <div className="mode-group" key={group}>
              <h3 className="mode-group-title">{group}</h3>
              {LAB_GROUP_NOTE[group] && (
                <p className="mode-group-note">{LAB_GROUP_NOTE[group]}</p>
              )}
              <div className="mode-list nested">
                {items.map((lab) => {
                  const lock = labLock(lab.mode)
                  const unlocked = isLabUnlocked(lab.mode, progress)
                  return (
                    <button
                      key={lab.mode}
                      className="mode-btn"
                      type="button"
                      disabled={!unlocked}
                      onClick={() => onStart(lab.mode)}
                    >
                      <h2>{lab.title}</h2>
                      <p>{lab.blurb}</p>
                      {!unlocked && lock && (
                        <div className="lock">{labLockLabel(lock)}</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <p className="science-note">
        検索練習・インターリービング・間隔反復を組み込み、連続正解による
        Psychological Momentum でテンションを上げる設計です。
      </p>
    </section>
  )
}
