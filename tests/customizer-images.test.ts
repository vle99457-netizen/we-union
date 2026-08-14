import { describe, expect, it } from 'vitest'
import { parseRequestUrl } from '../api/customizer-images'

describe('customizer image API request parsing', () => {
  it('accepts the path-only URL shape used by the Vercel web handler adapter', () => {
    const url = parseRequestUrl(
      '/api/customizer-images?product=white-pulse-game-jersey&view=front',
    )

    expect(url.searchParams.get('product')).toBe('white-pulse-game-jersey')
    expect(url.searchParams.get('view')).toBe('front')
  })
})
