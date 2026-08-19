import type { LyricGrammarKind } from '../../data/lyricGrammar'
import type { LyricSpec } from '../types'
import { rideOk, type LyricPattern } from './pattern'

export type LyricJudge = {
  ok: boolean
  detail: string
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

export function wordMatches(pattern: LyricPattern, accept: string[]): boolean {
  const got = normalize(pattern.word)
  if (!got) return false
  return accept.some((item) => normalize(item) === got)
}

function hasWords(line: string, words: string[]): boolean {
  return words.every((word) => new RegExp(`\\b${word}\\b`, 'i').test(line))
}

function hasClauseAfter(line: string, connector: string): boolean {
  const rest = line
    .replace(new RegExp(`^${connector}\\s+`, 'i'), '')
    .trim()
    .split(/\s+/)
  return rest.length >= 2
}

function grammarMatches(kind: LyricGrammarKind, raw: string): boolean {
  const line = raw.trim().replace(/\s+/g, ' ')
  switch (kind) {
    case 'because-clause':
      return (
        /^because\s+/i.test(line) &&
        !/^because\s+of\b/i.test(line) &&
        hasClauseAfter(line, 'because') &&
        hasWords(line, ['nervous'])
      )
    case 'because-of-phrase':
      return /^because\s+of\s+/i.test(line) && hasWords(line, ['nervousness'])
    case 'though-clause':
      return (
        /^though\s+/i.test(line) &&
        hasClauseAfter(line, 'though') &&
        hasWords(line, ['ill'])
      )
    case 'despite-phrase':
      return (
        /^despite\s+/i.test(line) &&
        !/^despite\s+(he|she|it|we|they)\s+/i.test(line) &&
        hasWords(line, ['illness'])
      )
    case 'eligible-for':
      return /\beligible\s+for\s+(an?\s+)?bonus\b/i.test(line)
    case 'either-or':
      return (
        /\beither\b.+\bor\b/i.test(line) &&
        hasWords(line, ['sound', 'silence'])
      )
    case 'both-and':
      return (
        /\bboth\b.+\band\b/i.test(line) &&
        hasWords(line, ['quick', 'safe'])
      )
    case 'whether-or-not':
      return (
        /\bwhether\b.+\bor\s+not\b/i.test(line) &&
        hasWords(line, ['go'])
      )
    case 'unless-clause':
      return (
        /^unless\s+/i.test(line) &&
        hasClauseAfter(line, 'unless') &&
        hasWords(line, ['we', 'move'])
      )
    case 'however-break':
      return (
        /\.\s*however\s*,/i.test(line) &&
        hasWords(line, ['fell', 'rose'])
      )
  }
}

export function judgeLyric(spec: LyricSpec, pattern: LyricPattern): LyricJudge {
  const wordOk = spec.grammar
    ? grammarMatches(spec.grammar.kind, pattern.word)
    : wordMatches(pattern, spec.accept)
  if (!wordOk) {
    return {
      ok: false,
      detail: spec.grammar
        ? `${spec.grammar.tip} 例の意味も満たして`
        : spec.stage === 'meaning'
          ? '語が違う。lyric("英語") で書いて'
          : `lyric("${spec.word}") が必要`,
    }
  }
  if (!spec.requireRide) {
    return { ok: true, detail: '指定の語が乗っている' }
  }
  if (!rideOk(pattern.steps, spec.ride)) {
    return {
      ok: false,
      detail:
        spec.ride === 'on'
          ? 'オンビート（偶数ステップ）に x を置いて'
          : '裏（奇数ステップ）に x を置いて',
    }
  }
  return {
    ok: true,
    detail: spec.grammar
      ? `構文が正しく、${spec.ride === 'on' ? 'オンビート' : '裏'}に乗っている`
      : spec.ride === 'on'
        ? '語がオンビートに乗っている'
        : '語が裏に乗っている',
  }
}
