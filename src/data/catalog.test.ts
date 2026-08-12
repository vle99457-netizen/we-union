import { describe, expect, it } from 'vitest'
import { formatPrice, getProduct, getSeries, searchCatalog } from './catalog'

describe('catalog helpers', () => {
  it('finds stable slugs used by route pages', () => {
    expect(getSeries('water-ripple')?.name).toBe('Water Ripple')
    expect(getProduct('water-ripple-game-jersey')?.price).toBe(99)
  })

  it('formats sample prices for US shoppers', () => {
    expect(formatPrice(129)).toBe('$129')
  })

  it('searches products, series, and stories without case sensitivity', () => {
    expect(searchCatalog('RIPPLE').length).toBeGreaterThanOrEqual(3)
    expect(searchCatalog('')).toEqual([])
  })
})
