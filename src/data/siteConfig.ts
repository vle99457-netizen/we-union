import {
  products as catalogProducts,
  series as catalogSeries,
  stories as catalogStories,
  worlds as catalogWorlds,
  type Product,
  type Series,
  type Story,
  type World,
} from './catalog.js'

export type ManagedWorld = World & { visible: boolean }
export type ManagedSeries = Series & { visible: boolean }
export type ManagedProduct = Product & { visible: boolean; featured: boolean }
export type ManagedStory = Story & { visible: boolean }

export type AdminPageId =
  | 'collections'
  | 'create'
  | 'honor'
  | 'belong'
  | 'stories'
  | 'craftsmanship'
  | 'community'
  | 'about'
  | 'team'
  | 'support'
  | 'account'
  | 'track'

export type ManagedPage = {
  id: AdminPageId
  route: string
  label: string
  eyebrow: string
  title: string
  description: string
  image: string
  enabled: boolean
}

export type ManagedPolicy = {
  slug: 'privacy' | 'terms' | 'accessibility' | 'shipping' | 'size-guide'
  title: string
  intro: string
  sections: Array<{ title: string; copy: string }>
  enabled: boolean
}

export type SiteConfig = {
  version: 1
  updatedAt: string | null
  global: {
    siteName: string
    logoUrl: string
    utilityText: string
    utilityLinkLabel: string
    utilityLinkHref: string
    navigation: Array<{ id: string; label: string; href: string; enabled: boolean }>
    contactEmail: string
    supportEmail: string
    footerEyebrow: string
    footerTitle: string
    footerTagline: string
    newsletterEnabled: boolean
  }
  home: {
    hero: {
      enabled: boolean
      eyebrow: string
      titleLine1: string
      titleLine2: string
      copy: string
      image: string
      searchLabel: string
      searchPlaceholder: string
      primaryLabel: string
      primaryHref: string
      secondaryLabel: string
      secondaryHref: string
      scrollLabel: string
    }
    worlds: { enabled: boolean; eyebrow: string; title: string; copy: string }
    featured: {
      enabled: boolean
      eyebrow: string
      title: string
      copy: string
      image: string
      ctaLabel: string
      ctaHref: string
      bannerKicker: string
      bannerTitleLine1: string
      bannerTitleLine2: string
    }
    products: {
      enabled: boolean
      eyebrow: string
      title: string
      copy: string
      ctaLabel: string
      ctaHref: string
    }
    custom: {
      enabled: boolean
      eyebrow: string
      titleLine1: string
      titleLine2: string
      copy: string
      ctaLabel: string
      ctaHref: string
      image: string
      steps: Array<{ label: string; copy: string; kicker: string; status: string }>
    }
    craftsmanship: {
      enabled: boolean
      eyebrow: string
      title: string
      copy: string
      image: string
      ctaLabel: string
      ctaHref: string
      items: Array<{ title: string; copy: string; image: string }>
    }
    promises: {
      enabled: boolean
      title: string
      items: Array<{ title: string; copy: string }>
    }
    stories: { enabled: boolean; eyebrow: string; title: string; ctaLabel: string }
    community: {
      enabled: boolean
      eyebrow: string
      title: string
      copy: string
      image: string
      ctaLabel: string
      ctaHref: string
      images: string[]
    }
  }
  catalog: {
    worlds: ManagedWorld[]
    series: ManagedSeries[]
    products: ManagedProduct[]
    stories: ManagedStory[]
  }
  sectionImages: {
    honorConcept: string
    belongFeature: string
    productDetail: string
    craftsmanshipFeature: string
    communityGalleryPrimary: string
    communityGallerySecondary: string
  }
  pages: ManagedPage[]
  policies: ManagedPolicy[]
  customizer: {
    enabled: boolean
    cityEnabled: boolean
    playerNameEnabled: boolean
    numberEnabled: boolean
    frontLogoEnabled: boolean
    sleeveLogosEnabled: boolean
    maxLogoSizeMb: number
    disclaimerTitle: string
    disclaimer: string
  }
  commerce: {
    currency: 'USD'
    displayPrices: boolean
    checkoutEnabled: boolean
    orderTrackingEnabled: boolean
    teamBriefEnabled: boolean
    shippingLabel: string
    taxLabel: string
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
    ogImage: string
    robotsIndex: boolean
  }
  system: {
    maintenanceMode: boolean
    maintenanceTitle: string
    maintenanceMessage: string
  }
}

const nowEmpty = null

export const defaultSiteConfig: SiteConfig = {
  version: 1,
  updatedAt: nowEmpty,
  global: {
    siteName: 'WE',
    logoUrl: '/images/we-logo.svg',
    utilityText: 'Shipping calculated at checkout.',
    utilityLinkLabel: 'Shipping & returns',
    utilityLinkHref: '/legal/shipping',
    navigation: [
      { id: 'create', label: 'Create', href: '/collections', enabled: true },
      { id: 'honor', label: 'Honor', href: '/honor', enabled: true },
      { id: 'belong', label: 'Belong', href: '/belong', enabled: true },
      { id: 'custom', label: 'Create Yours', href: '/custom', enabled: true },
      { id: 'stories', label: 'Stories', href: '/stories', enabled: true },
      { id: 'about', label: 'About', href: '/about', enabled: true },
    ],
    contactEmail: 'hello@we-union.com',
    supportEmail: 'support@we-union.com',
    footerEyebrow: 'Newsletter',
    footerTitle: 'Stay in\nthe story.',
    footerTagline: 'Original sportswear. Made personal.',
    newsletterEnabled: true,
  },
  home: {
    hero: {
      enabled: true,
      eyebrow: 'WE / Original sportswear',
      titleLine1: 'Gear made',
      titleLine2: 'personal.',
      copy: 'Original sportswear built around identity, achievement, and belonging.',
      image: '',
      searchLabel: 'Find your city',
      searchPlaceholder: 'Search by city',
      primaryLabel: 'Explore originals',
      primaryHref: '/collections',
      secondaryLabel: 'Create yours',
      secondaryHref: '/custom',
      scrollLabel: 'Discover the worlds',
    },
    worlds: {
      enabled: true,
      eyebrow: 'Three systems of WE',
      title: 'Create. Honor. Belong.',
      copy: 'Three distinct visual worlds—each built to carry a different kind of meaning.',
    },
    featured: {
      enabled: true,
      eyebrow: 'Current drop / Edit 01',
      title: 'Featured Release',
      copy: 'Meet the current WE edit: an original system, a clear story, and room to make it personal.',
      image: '/images/water-ripple.webp',
      ctaLabel: 'Explore the drop',
      ctaHref: '/collections/white-pulse',
      bannerKicker: 'White Pulse / Release 01',
      bannerTitleLine1: 'Wear the motion.',
      bannerTitleLine2: 'Make it personal.',
    },
    products: {
      enabled: true,
      eyebrow: 'Selected from the three worlds',
      title: 'New & Featured',
      copy: 'Two CREATE originals alongside one HONOR and one BELONG concept preview.',
      ctaLabel: 'View all originals',
      ctaHref: '/collections',
    },
    custom: {
      enabled: true,
      eyebrow: 'Create yours',
      titleLine1: 'Your meaning.',
      titleLine2: 'Built in.',
      copy: 'Personalization is part of the object, not an afterthought placed on top.',
      ctaLabel: 'Open the studio',
      ctaHref: '/custom',
      image: '/images/white-pulse-process-jersey.webp',
      steps: [
        { label: 'CHOOSE AN ORIGINAL', copy: 'Start with a WE original visual system.', kicker: 'Original / Selected', status: 'White Pulse 01' },
        { label: 'PERSONALIZE', copy: 'Set the city, name, number, logo, and approved details.', kicker: 'Identity / Applied', status: 'Sacramento · 17' },
        { label: 'REVIEW', copy: 'Confirm the front, back, and both sleeve proofs.', kicker: 'Proof / 04 views', status: 'Ready to review' },
        { label: 'MADE FOR YOU', copy: 'Approve the proof, then follow production and delivery.', kicker: 'Finished / Tracked', status: 'Made for you' },
      ],
    },
    craftsmanship: {
      enabled: true,
      eyebrow: 'Craftsmanship',
      title: 'Precision you can see.',
      copy: 'Embroidery, materials, stitching, and inspection make the design real—and make every approved piece consistent.',
      image: '/images/craft-embroidery.webp',
      ctaLabel: 'See how WE makes it',
      ctaHref: '/craftsmanship',
      items: [
        { title: 'Embroidery', copy: 'Elevated stitching with visible depth and controlled placement.', image: '/images/craft-embroidery.webp' },
        { title: 'Materials', copy: 'Approved fabric and trim choices support the intended form.', image: '/images/white-pulse-game-jersey-03-pattern-detail.webp' },
        { title: 'Stitching', copy: 'Construction details are reviewed where strength and finish meet.', image: '/images/white-pulse-game-jersey-04-seam-detail.webp' },
        { title: 'Inspection', copy: 'Every approved detail is checked before the piece moves forward.', image: '/images/white-pulse-game-jersey-05-on-model.webp' },
      ],
    },
    promises: {
      enabled: true,
      title: 'Built around the whole journey.',
      items: [
        { title: 'Original design', copy: 'Every piece begins with an original from WE.' },
        { title: 'Personalized production', copy: 'Your approved details are built into a production-ready proof.' },
        { title: 'Strict quality inspection', copy: 'Verified inspection milestones connect before public release.' },
        { title: 'Tracked delivery', copy: 'Verified production and carrier events will connect here.' },
      ],
    },
    stories: { enabled: true, eyebrow: 'Stories', title: 'Three worlds. Three kinds of meaning.', ctaLabel: 'Explore the stories' },
    community: {
      enabled: true,
      eyebrow: 'Worn your way',
      title: 'One original. Worn your way.',
      copy: 'A growing view of how people make WE originals part of their own story.',
      image: '/images/hero-stadium.webp',
      ctaLabel: 'See more styles',
      ctaHref: '/community',
      images: [
        '/images/white-pulse-game-jersey-05-on-model.webp',
        '/images/hero-stadium.webp',
        '/images/product-water.webp',
        '/images/product-crack.webp',
        '/images/world-honor.webp',
        '/images/world-belong.webp',
      ],
    },
  },
  catalog: {
    worlds: catalogWorlds.map((item) => ({ ...item, visible: true })),
    series: catalogSeries.map((item) => ({ ...item, visible: true })),
    products: catalogProducts.map((item, index) => ({ ...item, visible: true, featured: index === 0 })),
    stories: catalogStories.map((item) => ({ ...item, visible: true })),
  },
  sectionImages: {
    honorConcept: '/images/world-honor.webp',
    belongFeature: '/images/world-belong.webp',
    productDetail: '/images/craft-embroidery.webp',
    craftsmanshipFeature: '/images/water-ripple.webp',
    communityGalleryPrimary: '/images/water-ripple.webp',
    communityGallerySecondary: '/images/craft-embroidery.webp',
  },
  pages: [
    { id: 'collections', route: '/collections', label: 'Collections', eyebrow: '01 / Originals', title: 'Every series starts with an idea.', description: 'Explore WE originals as complete visual worlds, then choose the piece that makes the idea yours.', image: '/images/water-ripple.webp', enabled: true },
    { id: 'create', route: '/create', label: 'Create world', eyebrow: 'World 01', title: 'Create', description: 'Original visual systems made personal.', image: '/images/water-ripple.webp', enabled: true },
    { id: 'honor', route: '/honor', label: 'Honor world', eyebrow: 'World 02', title: 'Honor', description: 'A rights-first space for original heritage studies.', image: '/images/world-honor.webp', enabled: true },
    { id: 'belong', route: '/belong', label: 'Belong world', eyebrow: 'World 03', title: 'Belong', description: 'A future direction for team, city, and cultural identity.', image: '/images/world-belong.webp', enabled: true },
    { id: 'stories', route: '/stories', label: 'Stories', eyebrow: 'Journal / WE', title: 'Stories behind the work.', description: 'Identity, design, craft, and the meaning held inside an original.', image: '/images/hero-stadium.webp', enabled: true },
    { id: 'craftsmanship', route: '/craftsmanship', label: 'Craftsmanship', eyebrow: 'Made visible', title: 'Craft is the proof.', description: 'A clear view of the decisions, checks, and standards behind every approved piece.', image: '/images/craft-embroidery.webp', enabled: true },
    { id: 'community', route: '/community', label: 'Community', eyebrow: 'Worn your way', title: 'One original. Countless meanings.', description: 'A community preview showing how WE can hold individual and shared stories.', image: '/images/hero-stadium.webp', enabled: true },
    { id: 'about', route: '/about', label: 'About', eyebrow: 'About WE', title: 'Identity should never feel generic.', description: 'WE builds original sportswear systems that make room for personal meaning.', image: '/images/hero-stadium.webp', enabled: true },
    { id: 'team', route: '/team', label: 'Team orders', eyebrow: 'WE for teams', title: 'One system. Every player.', description: 'A structured team-order path for clubs, schools, organizations, and creative communities.', image: '/images/world-belong.webp', enabled: true },
    { id: 'support', route: '/support', label: 'Support', eyebrow: 'Help & support', title: 'Start with the right path.', description: 'Clear routes for product questions, personalized production, orders, and team programs.', image: '', enabled: true },
    { id: 'account', route: '/account', label: 'Account', eyebrow: 'Your WE', title: 'Designs, orders, and the story so far.', description: 'Manage saved concepts and future orders.', image: '/images/hero-stadium.webp', enabled: true },
    { id: 'track', route: '/track', label: 'Order tracking', eyebrow: 'Order & track', title: 'Follow the piece.', description: 'From personalized production through final inspection and delivery.', image: '', enabled: true },
  ],
  policies: [
    { slug: 'privacy', title: 'Privacy framework', intro: 'A launch-ready privacy policy must be reviewed by counsel and connected to the actual data practices.', enabled: true, sections: [{ title: 'Prototype data', copy: 'Forms in this prototype do not send information to a server. Local cart and saved-design data remain in this browser.' }, { title: 'Before launch', copy: 'Document processors, retention, consent, deletion, and regional rights based on the production architecture.' }] },
    { slug: 'terms', title: 'Terms framework', intro: 'These are product-language placeholders, not legal terms.', enabled: true, sections: [{ title: 'Orders', copy: 'Define acceptance, production approval, changes, cancellations, and remedies using the final operating model.' }, { title: 'Intellectual property', copy: 'Document rights for customer-supplied names, numbers, and marks alongside WE original designs.' }] },
    { slug: 'accessibility', title: 'Accessibility', intro: 'WE is designed toward WCAG 2.2 AA across navigation, content, customization, and purchase flows.', enabled: true, sections: [{ title: 'Current build', copy: 'Keyboard navigation, visible focus, semantic controls, text alternatives, and reduced-motion preferences are supported.' }, { title: 'Feedback', copy: 'A monitored accessibility contact channel must be added before launch.' }] },
    { slug: 'shipping', title: 'Shipping & returns framework', intro: 'Operational timelines and policies connect only when verified services and rules are ready.', enabled: true, sections: [{ title: 'Personalized pieces', copy: 'Define approval, production, change, and return rules in plain language before the buyer commits.' }, { title: 'Tracking', copy: 'Expose carrier events and production milestones from the verified fulfillment source.' }] },
    { slug: 'size-guide', title: 'Size guide framework', intro: 'Final garment measurements and fit guidance require approved product specifications.', enabled: true, sections: [{ title: 'Measurements', copy: 'Publish measurements by verified product and variant rather than applying a generic chart.' }, { title: 'Before launch', copy: 'Document measurement method, tolerance, fit terminology, and support escalation before recommending a size.' }] },
  ],
  customizer: {
    enabled: true,
    cityEnabled: true,
    playerNameEnabled: true,
    numberEnabled: true,
    frontLogoEnabled: true,
    sleeveLogosEnabled: true,
    maxLogoSizeMb: 2,
    disclaimerTitle: 'Personalization & intellectual property',
    disclaimer: 'WE CREATE products are built on original garment designs and customer-led personalization. WE does not reproduce or accept official league, team, athlete, or third-party brand names, logos, wordmarks, signatures, or confusingly similar variations. Customer-submitted artwork must be original or properly authorized and is subject to intellectual property review.',
  },
  commerce: {
    currency: 'USD',
    displayPrices: true,
    checkoutEnabled: true,
    orderTrackingEnabled: true,
    teamBriefEnabled: true,
    shippingLabel: 'TBD',
    taxLabel: 'TBD',
  },
  seo: {
    defaultTitle: 'WE — Sports Heritage Meets Personal Identity',
    defaultDescription: 'Sports heritage meets personal identity. Explore WE original series, create a personal piece, and discover the stories behind the work.',
    ogImage: '/images/hero-stadium.webp',
    robotsIndex: true,
  },
  system: {
    maintenanceMode: false,
    maintenanceTitle: 'The studio is being prepared.',
    maintenanceMessage: 'WE will be back shortly with the next original edit.',
  },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const catalogSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function catalogSlugFromName(value: string): string {
  return value
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function catalogValidationIssues(config: Pick<SiteConfig, 'catalog'>): string[] {
  const issues: string[] = []
  const seriesSlugs = new Set<string>()
  const productSlugs = new Set<string>()

  for (const item of config.catalog.series) {
    const slug = typeof item.slug === 'string' ? item.slug : ''
    const name = typeof item.name === 'string' ? item.name : ''
    if (!name.trim()) issues.push(`Series "${slug || '(missing slug)'}" needs a name.`)
    if (!catalogSlugPattern.test(slug)) issues.push(`Series slug "${slug || '(empty)'}" is not URL-safe.`)
    if (seriesSlugs.has(slug)) issues.push(`Series slug "${slug}" is duplicated.`)
    seriesSlugs.add(slug)
  }

  for (const item of config.catalog.products) {
    const slug = typeof item.slug === 'string' ? item.slug : ''
    const name = typeof item.name === 'string' ? item.name : ''
    const series = typeof item.series === 'string' ? item.series : ''
    if (!name.trim()) issues.push(`Product "${slug || '(missing slug)'}" needs a name.`)
    if (!catalogSlugPattern.test(slug)) issues.push(`Product slug "${slug || '(empty)'}" is not URL-safe.`)
    if (productSlugs.has(slug)) issues.push(`Product slug "${slug}" is duplicated.`)
    if (!seriesSlugs.has(series)) issues.push(`Product "${slug}" references a missing series.`)
    productSlugs.add(slug)
  }

  return issues
}

function mergeBySlug<T extends { slug: string }>(defaults: T[], incoming: unknown): T[] {
  if (!Array.isArray(incoming)) return defaults
  const incomingItems = incoming.filter(isRecord) as Array<Record<string, unknown> & { slug?: unknown }>
  const bySlug = new Map(incomingItems.filter((item) => typeof item.slug === 'string').map((item) => [item.slug as string, item]))
  const merged = defaults.map((item) => ({ ...item, ...(bySlug.get(item.slug) ?? {}) })) as T[]
  const seenSlugs = new Set(defaults.map((item) => item.slug))
  for (const item of incomingItems) {
    if (typeof item.slug === 'string' && !seenSlugs.has(item.slug)) {
      merged.push(item as T)
      seenSlugs.add(item.slug)
    }
  }
  return merged
}

function mergeById<T extends { id: string }>(defaults: T[], incoming: unknown): T[] {
  if (!Array.isArray(incoming)) return defaults
  const items = incoming.filter(isRecord)
  const byId = new Map(items.filter((item) => typeof item.id === 'string').map((item) => [item.id as string, item]))
  return defaults.map((item) => ({ ...item, ...(byId.get(item.id) ?? {}) })) as T[]
}

export function normalizeSiteConfig(input: unknown): SiteConfig {
  if (!isRecord(input)) return structuredClone(defaultSiteConfig)
  const global = isRecord(input.global) ? input.global : {}
  const home = isRecord(input.home) ? input.home : {}
  const catalog = isRecord(input.catalog) ? input.catalog : {}
  const sectionImages = isRecord(input.sectionImages) ? input.sectionImages : {}
  const customizer = isRecord(input.customizer) ? input.customizer : {}
  const commerce = isRecord(input.commerce) ? input.commerce : {}
  const seo = isRecord(input.seo) ? input.seo : {}
  const system = isRecord(input.system) ? input.system : {}

  const homeKeys = ['hero', 'worlds', 'featured', 'products', 'custom', 'craftsmanship', 'promises', 'stories', 'community'] as const
  const normalizedHome = structuredClone(defaultSiteConfig.home)
  for (const key of homeKeys) {
    if (isRecord(home[key])) Object.assign(normalizedHome[key], home[key])
  }
  if (isRecord(home.custom) && Array.isArray(home.custom.steps) && home.custom.steps.length === 4) {
    normalizedHome.custom.steps = home.custom.steps as SiteConfig['home']['custom']['steps']
  } else {
    normalizedHome.custom.steps = structuredClone(defaultSiteConfig.home.custom.steps)
  }
  if (isRecord(home.promises) && Array.isArray(home.promises.items) && home.promises.items.length === 4) {
    normalizedHome.promises.items = home.promises.items as SiteConfig['home']['promises']['items']
  } else {
    normalizedHome.promises.items = structuredClone(defaultSiteConfig.home.promises.items)
  }
  if (isRecord(home.craftsmanship) && Array.isArray(home.craftsmanship.items) && home.craftsmanship.items.length === 4) {
    normalizedHome.craftsmanship.items = home.craftsmanship.items as SiteConfig['home']['craftsmanship']['items']
  } else {
    normalizedHome.craftsmanship.items = structuredClone(defaultSiteConfig.home.craftsmanship.items)
  }
  if (isRecord(home.community) && Array.isArray(home.community.images) && home.community.images.length === 6) {
    normalizedHome.community.images = home.community.images as SiteConfig['home']['community']['images']
  } else {
    normalizedHome.community.images = structuredClone(defaultSiteConfig.home.community.images)
  }

  const needsHomepageMigration = !isRecord(home.products) && Array.isArray(catalog.products)
  if (needsHomepageMigration) {
    const legacySectionEnabled = (key: keyof SiteConfig['home']) => {
      const section = home[key]
      return isRecord(section) && typeof section.enabled === 'boolean'
        ? section.enabled
        : defaultSiteConfig.home[key].enabled
    }
    const legacyHeroImage = typeof normalizedHome.hero.image === 'string' ? normalizedHome.hero.image : ''
    const legacyFeaturedImage = typeof normalizedHome.featured.image === 'string' ? normalizedHome.featured.image : ''
    const legacyCustomImage = typeof normalizedHome.custom.image === 'string' ? normalizedHome.custom.image : ''
    const legacyCraftImage = typeof normalizedHome.craftsmanship.image === 'string' ? normalizedHome.craftsmanship.image : ''
    const legacyCommunityImage = typeof normalizedHome.community.image === 'string' ? normalizedHome.community.image : ''

    Object.assign(normalizedHome.hero, defaultSiteConfig.home.hero, {
      enabled: legacySectionEnabled('hero'),
      image: legacyHeroImage === '/images/hero-stadium.webp' ? '' : legacyHeroImage,
    })
    Object.assign(normalizedHome.worlds, defaultSiteConfig.home.worlds, { enabled: legacySectionEnabled('worlds') })
    Object.assign(normalizedHome.featured, defaultSiteConfig.home.featured, {
      enabled: legacySectionEnabled('featured'),
      image: legacyFeaturedImage || defaultSiteConfig.home.featured.image,
    })
    Object.assign(normalizedHome.products, defaultSiteConfig.home.products)
    Object.assign(normalizedHome.custom, defaultSiteConfig.home.custom, {
      enabled: legacySectionEnabled('custom'),
      image: legacyCustomImage || defaultSiteConfig.home.custom.image,
    })
    Object.assign(normalizedHome.craftsmanship, defaultSiteConfig.home.craftsmanship, {
      enabled: legacySectionEnabled('craftsmanship'),
      image: legacyCraftImage || defaultSiteConfig.home.craftsmanship.image,
    })
    normalizedHome.craftsmanship.items = structuredClone(defaultSiteConfig.home.craftsmanship.items)
    if (legacyCraftImage && legacyCraftImage !== '/images/craft-embroidery.webp') {
      normalizedHome.craftsmanship.items[0]!.image = legacyCraftImage
    }
    Object.assign(normalizedHome.promises, defaultSiteConfig.home.promises, { enabled: legacySectionEnabled('promises') })
    normalizedHome.promises.items = structuredClone(defaultSiteConfig.home.promises.items)
    Object.assign(normalizedHome.stories, defaultSiteConfig.home.stories, { enabled: legacySectionEnabled('stories') })
    Object.assign(normalizedHome.community, defaultSiteConfig.home.community, {
      enabled: legacySectionEnabled('community'),
      image: legacyCommunityImage || defaultSiteConfig.home.community.image,
    })
    normalizedHome.community.images = structuredClone(defaultSiteConfig.home.community.images)
    if (legacyCommunityImage && legacyCommunityImage !== '/images/hero-stadium.webp') {
      normalizedHome.community.images[0] = legacyCommunityImage
    }
  }

  const incomingPolicies = Array.isArray(input.policies) ? input.policies.filter(isRecord) : []
  const policyBySlug = new Map(incomingPolicies.filter((item) => typeof item.slug === 'string').map((item) => [item.slug as string, item]))

  const requestedLogoUrl = typeof global.logoUrl === 'string' ? global.logoUrl.trim() : ''
  const normalizedLogoUrl = requestedLogoUrl && requestedLogoUrl !== '/images/we-wordmark.png'
    ? requestedLogoUrl
    : defaultSiteConfig.global.logoUrl

  const normalizedGlobal = {
    ...defaultSiteConfig.global,
    ...global,
    logoUrl: normalizedLogoUrl,
    navigation: Array.isArray(global.navigation) ? global.navigation as SiteConfig['global']['navigation'] : defaultSiteConfig.global.navigation,
  }
  if (needsHomepageMigration) {
    normalizedGlobal.utilityText = defaultSiteConfig.global.utilityText
    normalizedGlobal.utilityLinkLabel = defaultSiteConfig.global.utilityLinkLabel
    normalizedGlobal.utilityLinkHref = defaultSiteConfig.global.utilityLinkHref
    normalizedGlobal.footerEyebrow = defaultSiteConfig.global.footerEyebrow
    normalizedGlobal.footerTitle = defaultSiteConfig.global.footerTitle
    normalizedGlobal.footerTagline = defaultSiteConfig.global.footerTagline
  }

  const normalizedCatalogWorlds = mergeBySlug(defaultSiteConfig.catalog.worlds, catalog.worlds)
  if (needsHomepageMigration) {
    const createWorld = normalizedCatalogWorlds.find((item) => item.slug === 'create')
    const belongWorld = normalizedCatalogWorlds.find((item) => item.slug === 'belong')
    if (createWorld?.image === '/images/water-ripple.webp') createWorld.image = '/images/crack-series.webp'
    if (belongWorld?.image === '/images/world-belong.webp') belongWorld.image = '/images/hero-stadium.webp'
  }

  return {
    version: 1,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
    global: normalizedGlobal,
    home: normalizedHome,
    catalog: {
      worlds: normalizedCatalogWorlds,
      series: mergeBySlug(defaultSiteConfig.catalog.series, catalog.series),
      products: mergeBySlug(defaultSiteConfig.catalog.products, catalog.products),
      stories: mergeBySlug(defaultSiteConfig.catalog.stories, catalog.stories),
    },
    sectionImages: { ...defaultSiteConfig.sectionImages, ...sectionImages },
    pages: mergeById(defaultSiteConfig.pages, input.pages),
    policies: defaultSiteConfig.policies.map((item) => ({ ...item, ...(policyBySlug.get(item.slug) ?? {}) })) as ManagedPolicy[],
    customizer: { ...defaultSiteConfig.customizer, ...customizer },
    commerce: { ...defaultSiteConfig.commerce, ...commerce },
    seo: { ...defaultSiteConfig.seo, ...seo },
    system: { ...defaultSiteConfig.system, ...system },
  }
}

export function visibleWorlds(config: SiteConfig): ManagedWorld[] {
  return config.catalog.worlds.filter((item) => item.visible)
}

export function visibleSeries(config: SiteConfig): ManagedSeries[] {
  return config.catalog.series.filter((item) => item.visible)
}

export function visibleProducts(config: SiteConfig): ManagedProduct[] {
  return config.catalog.products.filter((item) => item.visible)
}

export function visibleStories(config: SiteConfig): ManagedStory[] {
  return config.catalog.stories.filter((item) => item.visible)
}

export function pageSetting(config: SiteConfig, id: AdminPageId): ManagedPage {
  return config.pages.find((page) => page.id === id) ?? defaultSiteConfig.pages.find((page) => page.id === id)!
}

export function isPublishableSiteConfig(value: unknown): value is SiteConfig {
  if (!isRecord(value) || value.version !== 1) return false
  if (!isRecord(value.global) || !isRecord(value.home) || !isRecord(value.catalog)) return false
  return Array.isArray(value.catalog.series)
    && Array.isArray(value.catalog.products)
    && Array.isArray(value.pages)
    && Array.isArray(value.policies)
}
