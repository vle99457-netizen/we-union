import { describe, expect, it } from 'vitest'
import {
  formatPrice,
  getProduct,
  getSeries,
  products,
  searchCatalog,
  series,
} from './catalog'

describe('catalog helpers', () => {
  it('exposes exactly the three approved CREATE series and stable primary routes', () => {
    expect(series.map((item) => item.slug)).toEqual([
      'white-pulse',
      'black-rift',
      'identity-fusion',
    ])
    expect(series.every((item) => item.world === 'create')).toBe(true)
    expect(getSeries('white-pulse')?.name).toBe('White Pulse')
    expect(getProduct('black-rift-game-jersey')?.series).toBe('black-rift')
  })

  it('keeps all unverified catalog prices in a non-numeric TBD state', () => {
    expect(products.every((item) => item.price.status === 'tbd')).toBe(true)
    expect(formatPrice({ status: 'tbd' })).toBe('PRICE TBD')
  })

  it('exposes the five required White Pulse gallery views in order', () => {
    const gallery = getProduct('white-pulse-game-jersey')?.gallery
    expect(gallery).toHaveLength(5)
    expect(gallery?.map((item) => item.label)).toEqual([
      'Overall front and back view',
      'Collar detail',
      'Pattern close-up',
      'Seam detail',
      'On-body view',
    ])
    expect(new Set(gallery?.map((item) => item.src)).size).toBe(5)
  })

  it('searches products, series, and stories without case sensitivity', () => {
    const results = searchCatalog('IDENTITY')
    expect(results.length).toBeGreaterThanOrEqual(3)
    expect(results.every((item) => !/\$\s*\d/.test(item.description))).toBe(true)
    expect(searchCatalog('')).toEqual([])
  })
})
