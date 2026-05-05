export type PinHeight = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

const HEIGHTS: PinHeight[] = ['a', 'b', 'c', 'd', 'e', 'f']

/** Stable pseudo-random masonry look for placeholder cards (from Firestore doc id). */
export function layoutFromId(id: string): { height: PinHeight; tone: number } {
  let h = 0
  let t = 0
  for (let i = 0; i < id.length; i++) {
    const c = id.charCodeAt(i)
    h = (h + c) % HEIGHTS.length
    t = (t + c * (i + 1)) % 12
  }
  return { height: HEIGHTS[h], tone: t + 1 }
}
