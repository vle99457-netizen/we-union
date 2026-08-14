import { describe, expect, it } from 'vitest'
import { fetch as customizerImagesFetch, parseRequestUrl } from '../api/customizer-images'

describe('customizer image API request parsing', () => {
  it('accepts the path-only URL shape used by the Vercel web handler adapter', () => {
    const url = parseRequestUrl(
      '/api/customizer-images?product=white-pulse-game-jersey&view=front',
    )

    expect(url.searchParams.get('product')).toBe('white-pulse-game-jersey')
    expect(url.searchParams.get('view')).toBe('front')
  })

  it('returns a Response through the named Vercel Web Handler export', async () => {
    const response = await customizerImagesFetch(new Request(
      'https://customizer.internal/api/customizer-images?product=NOT_VALID',
    ))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'A valid product slug is required.' })
  })
})
