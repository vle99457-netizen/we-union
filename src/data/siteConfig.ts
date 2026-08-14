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
    }
  }
  catalog: {
    worlds: ManagedWorld[]
    series: ManagedSeries[]
    products: ManagedProduct[]
    stories: ManagedStory[]
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
    utilityText: 'Sports heritage meets personal identity.',
    utilityLinkLabel: 'All series',
    utilityLinkHref: '/collections',
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
    footerEyebrow: 'Stay in the story',
    footerTitle: 'New originals.\nNo noise.',
    footerTagline: 'Original sportswear. Made personal.',
    newsletterEnabled: true,
  },
  home: {
    hero: {
      enabled: true,
      eyebrow: 'Sports heritage meets personal identity',
      titleLine1: 'Gear made',
      titleLine2: 'personal.',
      copy: 'A uniform can identify you. A WE original can tell your story.',
      image: '/images/hero-stadium.webp',
      primaryLabel: 'Explore originals',
      primaryHref: '/collections',
      secondaryLabel: 'Create yours',
      secondaryHref: '/custom',
      scrollLabel: 'Discover the worlds',
    },
    worlds: {
      enabled: true,
      eyebrow: 'Three ways into WE',
      title: 'Choose what the piece should carry.',
      copy: 'Each world starts with a different intention. All three end in something personal.',
    },
    featured: {
      enabled: true,
      eyebrow: 'New & featured / Series 01',
      title: 'White Pulse',
      copy: 'Continuous waves and flowing paths translate personal rhythm into an original visual language.',
      image: '/images/water-ripple.webp',
      ctaLabel: 'View the series',
      ctaHref: '/collections/white-pulse',
      bannerKicker: 'WE / WP–01',
      bannerTitleLine1: 'Feel the motion.',
      bannerTitleLine2: 'Make it yours.',
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
        { label: 'CHOOSE', copy: 'Start with a WE original visual system.', kicker: 'Original / Selected', status: 'White Pulse 01' },
        { label: 'PERSONALIZE', copy: 'Set the city, name, number, logo, and approved details.', kicker: 'Identity / Applied', status: 'Sacramento · 17' },
        { label: 'REVIEW', copy: 'Confirm the front, back, and both sleeve proofs.', kicker: 'Proof / 04 views', status: 'Ready to review' },
        { label: 'ORDER & TRACK', copy: 'Approve the proof, then follow production and delivery.', kicker: 'Status / Live', status: 'Production ready' },
      ],
    },
    craftsmanship: {
      enabled: true,
      eyebrow: 'Made visible',
      title: 'The last five percent is where trust lives.',
      copy: 'Color alignment, stitch tension, placement, and finish are reviewed before a piece moves forward.',
      image: '/images/craft-embroidery.webp',
      ctaLabel: 'See how WE makes it',
      ctaHref: '/craftsmanship',
    },
    promises: {
      enabled: true,
      title: 'Four promises. No fine print.',
      items: [
        { title: 'Original design', copy: 'Every piece begins with an original from WE.' },
        { title: 'Personalized production', copy: 'Your approved details are built into a production-ready proof.' },
        { title: 'Strict quality inspection', copy: 'Verified inspection milestones connect before public release.' },
        { title: 'Tracked delivery', copy: 'Verified production and carrier events will connect here.' },
      ],
    },
    stories: { enabled: true, eyebrow: 'Stories', title: 'The meaning behind the material.', ctaLabel: 'Read all stories' },
    community: {
      enabled: true,
      eyebrow: 'Worn your way',
      title: 'The piece is finished when you live in it.',
      copy: 'See how individuals and teams make every WE original their own.',
      image: '/images/hero-stadium.webp',
      ctaLabel: 'Enter the community',
      ctaHref: '/community',
    },
  },
  catalog: {
    worlds: catalogWorlds.map((item) => ({ ...item, visible: true })),
    series: catalogSeries.map((item) => ({ ...item, visible: true })),
    products: catalogProducts.map((item, index) => ({ ...item, visible: true, featured: index === 0 })),
    stories: catalogStories.map((item) => ({ ...item, visible: true })),
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

function mergeBySlug<T extends { slug: string }>(defaults: T[], incoming: unknown): T[] {
  if (!Array.isArray(incoming)) return defaults
  const incomingItems = incoming.filter(isRecord) as Array<Record<string, unknown> & { slug?: unknown }>
  const bySlug = new Map(incomingItems.filter((item) => typeof item.slug === 'string').map((item) => [item.slug as string, item]))
  const merged = defaults.map((item) => ({ ...item, ...(bySlug.get(item.slug) ?? {}) })) as T[]
  const defaultSlugs = new Set(defaults.map((item) => item.slug))
  for (const item of incomingItems) {
    if (typeof item.slug === 'string' && !defaultSlugs.has(item.slug)) merged.push(item as T)
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
  const customizer = isRecord(input.customizer) ? input.customizer : {}
  const commerce = isRecord(input.commerce) ? input.commerce : {}
  const seo = isRecord(input.seo) ? input.seo : {}
  const system = isRecord(input.system) ? input.system : {}

  const homeKeys = ['hero', 'worlds', 'featured', 'custom', 'craftsmanship', 'promises', 'stories', 'community'] as const
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

  const incomingPolicies = Array.isArray(input.policies) ? input.policies.filter(isRecord) : []
  const policyBySlug = new Map(incomingPolicies.filter((item) => typeof item.slug === 'string').map((item) => [item.slug as string, item]))

  const requestedLogoUrl = typeof global.logoUrl === 'string' ? global.logoUrl.trim() : ''
  const normalizedLogoUrl = requestedLogoUrl && requestedLogoUrl !== '/images/we-wordmark.png'
    ? requestedLogoUrl
    : defaultSiteConfig.global.logoUrl

  return {
    version: 1,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
    global: {
      ...defaultSiteConfig.global,
      ...global,
      logoUrl: normalizedLogoUrl,
      navigation: Array.isArray(global.navigation) ? global.navigation as SiteConfig['global']['navigation'] : defaultSiteConfig.global.navigation,
    },
    home: normalizedHome,
    catalog: {
      worlds: mergeBySlug(defaultSiteConfig.catalog.worlds, catalog.worlds),
      series: mergeBySlug(defaultSiteConfig.catalog.series, catalog.series),
      products: mergeBySlug(defaultSiteConfig.catalog.products, catalog.products),
      stories: mergeBySlug(defaultSiteConfig.catalog.stories, catalog.stories),
    },
    pages: mergeById(defaultSiteConfig.pages, input.pages),
    policies: defaultSiteConfig.policies.map((item) => ({ ...item, ...(policyBySlug.get(item.slug) ?? {}) })) as ManagedPolicy[],
    customizer: { ...defaultSiteConfig.customizer, ...customizer },
    commerce: { ...defaultSiteConfig.commerce, ...commerce },
    seo: { ...defaultSiteConfig.seo, ...seo },
    system: { ...defaultSiteConfig.system, ...system },
  }
}

export function visibleWorlds(config: SiteConfig): World[] {
  return config.catalog.worlds.filter((item) => item.visible)
}

export function visibleSeries(config: SiteConfig): Series[] {
  return config.catalog.series.filter((item) => item.visible)
}

export function visibleProducts(config: SiteConfig): Product[] {
  return config.catalog.products.filter((item) => item.visible)
}

export function visibleStories(config: SiteConfig): Story[] {
  return config.catalog.stories.filter((item) => item.visible)
}

export function pageSetting(config: SiteConfig, id: AdminPageId): ManagedPage {
  return config.pages.find((page) => page.id === id) ?? defaultSiteConfig.pages.find((page) => page.id === id)!
}

export function isPublishableSiteConfig(value: unknown): value is SiteConfig {
  if (!isRecord(value) || value.version !== 1) return false
  if (!isRecord(value.global) || !isRecord(value.home) || !isRecord(value.catalog)) return false
  return Array.isArray(value.pages) && Array.isArray(value.policies)
}
