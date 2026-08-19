import { VOCAB_CARDS } from './vocab'
import { ALL_VERBS } from './words'

export type LyricWord = {
  id: string
  en: string
  ja: string
  accept: string[]
}

function isLyricToken(en: string): boolean {
  return /^[A-Za-z][A-Za-z'-]{1,16}$/.test(en.trim())
}

export function lyricWordPool(): LyricWord[] {
  const seen = new Set<string>()
  const words: LyricWord[] = []
  const push = (word: LyricWord) => {
    const key = word.en.toLowerCase()
    if (seen.has(key) || !isLyricToken(word.en)) return
    seen.add(key)
    words.push(word)
  }
  for (const verb of ALL_VERBS) {
    push({
      id: verb.id,
      en: verb.base,
      ja: verb.meaning,
      accept: [verb.base],
    })
  }
  for (const card of VOCAB_CARDS) {
    push({
      id: card.id,
      en: card.en,
      ja: card.ja,
      accept: card.acceptEn,
    })
  }
  return words
}
