import type { PulseKind, PulsePattern } from '../types'
import {
  hasFourOnFloor,
  hitCount,
  isHumanized,
  isQuantized,
  offbeatHits,
} from './pattern'

export type PulseJudge = {
  ok: boolean
  groove: boolean
  detail: string
}

function kickMatch(a: PulsePattern, b: PulsePattern): number {
  let same = 0
  for (let i = 0; i < 16; i += 1) {
    if (a.kick[i] === b.kick[i]) same += 1
  }
  return same
}

export function judgePulse(
  kind: PulseKind,
  pattern: PulsePattern,
  target?: PulsePattern,
  requireGroove = false,
): PulseJudge {
  const groove = isHumanized(pattern) || pattern.velocity >= 0.2
  const quantized = isQuantized(pattern)
  const grooveOk = !requireGroove || (groove && !quantized)

  if (target) {
    const close = kickMatch(pattern, target) >= 14
    const needGroove = requireGroove || isHumanized(target)
    const ok = close && (!needGroove || (groove && !quantized))
    return {
      ok,
      groove,
      detail: ok
        ? groove
          ? '聴いたリズムを再現し、揺らぎもある'
          : 'リズムは合っている'
        : close && quantized
          ? 'リズムは合っているが、正しすぎる。humanize を足して'
          : 'キックの位置が聴いた音と違う',
    }
  }

  if (kind === 'kick4') {
    const ok = hasFourOnFloor(pattern) && grooveOk
    return {
      ok,
      groove,
      detail: ok
        ? '4つ打ちのキック'
        : !hasFourOnFloor(pattern)
          ? '0・4・8・12 拍目にキックが必要'
          : '正しすぎる。humanize(8〜24) を足して',
    }
  }

  if (kind === 'syncopation') {
    const ok = offbeatHits(pattern) >= 3 && grooveOk
    return {
      ok,
      groove,
      detail: ok
        ? '裏拍にヒットがある'
        : offbeatHits(pattern) < 3
          ? '奇数ステップ（裏）に音を置いて'
          : '正しすぎる。humanize を足して',
    }
  }

  if (kind === 'hat8') {
    const ok = hitCount(pattern.hat) >= 8 && grooveOk
    return {
      ok,
      groove,
      detail: ok
        ? 'ハットが走っている'
        : hitCount(pattern.hat) < 8
          ? 'hat を8つ以上'
          : '正しすぎる。humanize を足して',
    }
  }

  if (kind === 'humanize') {
    const ok = hasFourOnFloor(pattern) && groove && !quantized
    return {
      ok,
      groove,
      detail: ok
        ? '正確さの上に揺らぎがある'
        : quantized
          ? '正しすぎる。humanize(8〜24) を足して'
          : '4つ打ち＋ humanize が必要',
    }
  }

  const ok = hasFourOnFloor(pattern) && groove && !quantized
  return {
    ok,
    groove,
    detail: ok
      ? '機械の格子からグルーブが生まれた'
      : quantized
        ? '量子化だけだと満点にならない'
        : 'kick の4つ打ちと humanize を重ねて',
  }
}

