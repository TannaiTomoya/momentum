import type { MomentumState } from './types'

export function createMomentum(): MomentumState {
  return {
    combo: 0,
    multiplier: 1,
    score: 0,
    bestCombo: 0,
    heat: 0,
  }
}

export function comboMultiplier(combo: number): number {
  if (combo >= 12) return 4
  if (combo >= 8) return 3
  if (combo >= 5) return 2.5
  if (combo >= 3) return 2
  return 1
}

/** Heat 0–1 for visual intensity */
export function comboHeat(combo: number): number {
  return Math.min(1, combo / 10)
}

export function applyCorrect(
  state: MomentumState,
  reactionMs: number,
): MomentumState {
  const combo = state.combo + 1
  const multiplier = comboMultiplier(combo)
  const speedBonus = reactionMs < 2500 ? 1.25 : reactionMs < 4500 ? 1.1 : 1
  const base = 100
  const gained = Math.round(base * multiplier * speedBonus)

  return {
    combo,
    multiplier,
    score: state.score + gained,
    bestCombo: Math.max(state.bestCombo, combo),
    heat: comboHeat(combo),
  }
}

export function applyWrong(state: MomentumState): MomentumState {
  return {
    ...state,
    combo: 0,
    multiplier: 1,
    heat: 0,
  }
}

export function comboTierLabel(combo: number): string | null {
  if (combo >= 12) return 'OVERDRIVE'
  if (combo >= 8) return 'ON FIRE'
  if (combo >= 5) return 'HEATING UP'
  if (combo >= 3) return 'MOMENTUM'
  return null
}
