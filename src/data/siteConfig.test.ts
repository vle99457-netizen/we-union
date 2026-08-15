import { describe, expect, it } from 'vitest'
import {
  catalogSlugFromName,
  catalogValidationIssues,
  defaultSiteConfig,
  normalizeSiteConfig,
  pageSetting,
  visibleProducts,
  visibleSeries,
} from './siteConfig'

describe('site configuration', () => {
  it('merges partial stored values with safe complete defaults', () => {
    const config = normalizeSiteConfig({
      version: 1,
      global: { siteName: 'WE TEST' },
      home: { hero: { titleLine1: 'New line' } },
    })

    expect(config.global.siteName).toBe('WE TEST')
    expect(config.global.logoUrl).toBe('/images/we-logo.svg')
    expect(config.global.navigation).toHaveLength(defaultSiteConfig.global.navigation.length)
    expect(config.home.hero.titleLine1).toBe('New line')
    expect(config.home.hero.titleLine2).toBe(defaultSiteConfig.home.hero.titleLine2)
    expect(config.catalog.products).toHaveLength(defaultSiteConfig.catalog.products.length)
    expect(config.sectionImages.communityGalleryPrimary).toBe(defaultSiteConfig.sectionImages.communityGalleryPrimary)
  })

  it('keeps every supporting section image configurable when older stored data is normalized', () => {
    const config = normalizeSiteConfig({
      ...defaultSiteConfig,
      sectionImages: { communityGalleryPrimary: '/images/custom-community.webp' },
    })

    expect(config.sectionImages.communityGalleryPrimary).toBe('/images/custom-community.webp')
    expect(config.sectionImages.honorConcept).toBe(defaultSiteConfig.sectionImages.honorConcept)
    expect(Object.keys(config.sectionImages)).toHaveLength(6)
  })

  it('migrates the legacy wordmark URL to the official PDF logo', () => {
    const config = normalizeSiteConfig({
      ...defaultSiteConfig,
      global: {
        ...defaultSiteConfig.global,
        logoUrl: '/images/we-wordmark.png',
      },
    })

    expect(config.global.logoUrl).toBe('/images/we-logo.svg')
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

  it('creates URL-safe catalog slugs from editor names', () => {
    expect(catalogSlugFromName('  Summer Motion 2026  ')).toBe('summer-motion-2026')
    expect(catalogSlugFromName('Crème / Blue')).toBe('creme-blue')
  })

  it('preserves newly added series and products for the storefront', () => {
    const newSeries = {
      ...defaultSiteConfig.catalog.series[0]!,
      slug: 'summer-motion',
      name: 'Summer Motion',
    }
    const newProduct = {
      ...defaultSiteConfig.catalog.products[0]!,
      slug: 'summer-motion-game-jersey',
      name: 'Summer Motion Game Jersey',
      series: newSeries.slug,
      gallery: [],
      featured: false,
    }
    const config = normalizeSiteConfig({
      ...defaultSiteConfig,
      catalog: {
        ...defaultSiteConfig.catalog,
        series: [...defaultSiteConfig.catalog.series, newSeries],
        products: [...defaultSiteConfig.catalog.products, newProduct],
      },
    })

    expect(visibleSeries(config).some((item) => item.slug === newSeries.slug)).toBe(true)
    expect(visibleProducts(config).find((item) => item.slug === newProduct.slug)?.series).toBe(newSeries.slug)
    expect(catalogValidationIssues(config)).toEqual([])
  })

  it('rejects duplicate slugs and products assigned to missing series', () => {
    const config = structuredClone(defaultSiteConfig)
    config.catalog.series.push({ ...config.catalog.series[0]!, name: 'Duplicate series' })
    config.catalog.products.push({
      ...config.catalog.products[0]!,
      slug: 'orphan-product',
      name: 'Orphan Product',
      series: 'missing-series',
    })

    expect(catalogValidationIssues(config)).toEqual(expect.arrayContaining([
      expect.stringContaining('duplicated'),
      expect.stringContaining('missing series'),
    ]))
  })
})
