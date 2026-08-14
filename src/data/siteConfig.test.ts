import { describe, expect, it } from 'vitest'
import {
  defaultSiteConfig,
  normalizeSiteConfig,
  pageSetting,
  visibleProducts,
} from './siteConfig'

describe('site configuration', () => {
  it('merges partial stored values with safe complete defaults', () => {
    const config = normalizeSiteConfig({
      version: 1,
      global: { siteName: 'WE TEST' },
      home: { hero: { titleLine1: 'New line' } },
    })

    expect(config.global.siteName).toBe('WE TEST')
    expect(config.global.navigation).toHaveLength(defaultSiteConfig.global.navigation.length)
    expect(config.home.hero.titleLine1).toBe('New line')
    expect(config.home.hero.titleLine2).toBe(defaultSiteConfig.home.hero.titleLine2)
    expect(config.catalog.products).toHaveLength(defaultSiteConfig.catalog.products.length)
  })

  it('preserves stable catalog records while applying visibility controls', () => {
    const first = defaultSiteConfig.catalog.products[0]!
    const config = normalizeSiteConfig({
      ...defaultSiteConfig,
      catalog: {
        ...defaultSiteConfig.catalog,
        products: [{ ...first, visible: false }],
      },
    })

    expect(config.catalog.products[0]?.slug).toBe(first.slug)
    expect(visibleProducts(config).some((product) => product.slug === first.slug)).toBe(false)
    expect(config.catalog.products.length).toBe(defaultSiteConfig.catalog.products.length)
  })

  it('keeps the four-step homepage motion structurally complete', () => {
    const config = normalizeSiteConfig({
      ...defaultSiteConfig,
      home: {
        ...defaultSiteConfig.home,
        custom: { ...defaultSiteConfig.home.custom, steps: [] },
      },
    })

    expect(config.home.custom.steps).toHaveLength(4)
    expect(pageSetting(config, 'support').route).toBe('/support')
  })
})
