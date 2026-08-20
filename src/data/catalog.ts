import type { CustomizerView } from './customizerImages.js'

export type WorldSlug = 'create' | 'honor' | 'belong'

export type Price =
  | { status: 'tbd' }
  | { status: 'confirmed'; amount: number; currency: 'USD' }

export type WorldAvailability = 'live' | 'rights-review' | 'coming-soon'

export type World = {
  slug: WorldSlug
  index: string
  title: string
  copy: string
  image: string
  availability: WorldAvailability
  statusLabel: string
}

export type Series = {
  slug: string
  name: string
  eyebrow: string
  statement: string
  description: string
  world: 'create'
  image: string
  tone: 'dark' | 'light' | 'blue'
  designLanguage: string
  craftDirection: string
}

export type ProductGalleryItem = {
  src: string
  label: string
  alt: string
  width: number
  height: number
}

export type PersonalizationRegion = {
  id:
    | 'front-city'
    | 'front-number'
    | 'back-number'
    | 'back-name'
    | 'front-logo'
    | 'left-sleeve-logo'
    | 'right-sleeve-logo'
  kind: 'city' | 'number' | 'name' | 'logo'
  side: 'front' | 'back' | 'left' | 'right'
  logoSlot?: 'front' | 'leftSleeve' | 'rightSleeve'
  x: number
  y: number
  width: number
  height: number
  rotate?: number
}

export type ProductPersonalization = {
  cleanImage: string
  viewImages: Record<CustomizerView, {
    src: string
    alt: string
    crop?: {
      x: number
      y: number
      width: number
      height: number
      sourceWidth: number
      sourceHeight: number
    }
  }>
  sourceInk: string
  sourceOutline: string
  detectedSourceElements: readonly string[]
  regions: readonly PersonalizationRegion[]
}

export type Product = {
  slug: string
  name: string
  series: string
  world: 'create'
  price: Price
  color: string
  image: string
  gallery?: readonly ProductGalleryItem[]
  badge?: string
  personalizable?: boolean
  personalization?: ProductPersonalization
  catalogState: 'concept-preview'
  theme: string
  story: string
  design: string
  craft: string
  connection: string
}

export type HonorConcept = {
  slug: string
  name: string
  statement: string
  description: string
  image: string
  availability: 'rights-review'
}

export type Story = {
  slug: string
  category: string
  title: string
  excerpt: string
  image: string
  readTime: string
}

export const worlds: World[] = [
  {
    slug: 'create',
    index: '01',
    title: 'Create',
    copy: 'Start with an original. Make the name, number, and visual rhythm unmistakably yours.',
    image: '/images/crack-series.webp',
    availability: 'live',
    statusLabel: 'Original series',
  },
  {
    slug: 'honor',
    index: '02',
    title: 'Honor',
    copy: 'Explore original heritage concepts only after identity, archive, and usage rights are verified.',
    image: '/images/world-honor.webp',
    availability: 'rights-review',
    statusLabel: 'Rights review',
  },
  {
    slug: 'belong',
    index: '03',
    title: 'Belong',
    copy: 'A future direction for team, city, and cultural identity—without losing the individual inside it.',
    image: '/images/hero-stadium.webp',
    availability: 'coming-soon',
    statusLabel: 'Coming soon',
  },
]

export const series: Series[] = [
  {
    slug: 'white-pulse',
    name: 'White Pulse',
    eyebrow: 'Series 01 / Create',
    statement: 'Feel the motion.',
    description:
      'Continuous waves and flowing paths translate personal rhythm into a precise, light visual language.',
    world: 'create',
    image: '/images/water-ripple.webp',
    tone: 'blue',
    designLanguage: 'Motion Curve / continuous wave / dynamic path',
    craftDirection: 'Continuous texture and precise print direction; production specification pending verification.',
  },
  {
    slug: 'black-rift',
    name: 'Black Rift',
    eyebrow: 'Series 02 / Create',
    statement: 'Break the ordinary.',
    description:
      'Fracture lines, controlled pressure, and deep contrast form an original visual expression of resolve.',
    world: 'create',
    image: '/images/crack-series.webp',
    tone: 'dark',
    designLanguage: 'Identity Line / fracture texture / controlled contrast',
    craftDirection: 'Layered fracture-texture direction; final process and material specification remain TBD.',
  },
  {
    slug: 'identity-fusion',
    name: 'Identity Fusion',
    eyebrow: 'Series 03 / Create',
    statement: 'Identity is personal.',
    description:
      'Name, number, type, and symbol are composed as one identity rather than added as decoration.',
    world: 'create',
    image: '/images/craft-embroidery.webp',
    tone: 'light',
    designLanguage: 'Broken type / number structure / name fusion',
    craftDirection:
      'High-density embroidery direction with layered type detail; technical values require production evidence.',
  },
]

const priceTbd = (): Price => ({ status: 'tbd' })

export const products: Product[] = [
  {
    slug: 'white-pulse-game-jersey',
    name: 'White Pulse Game Jersey',
    series: 'white-pulse',
    world: 'create',
    price: priceTbd(),
    color: 'WE WHITE / Pulse Green',
    image: '/images/white-pulse-game-jersey-01-front-back.webp',
    gallery: [
      {
        src: '/images/white-pulse-game-jersey-01-front-back.webp',
        label: 'Overall front and back view',
        alt: 'White Pulse Game Jersey front and back views',
        width: 1254,
        height: 1254,
      },
      {
        src: '/images/white-pulse-game-jersey-02-collar-detail.webp',
        label: 'Collar detail',
        alt: 'White Pulse Game Jersey collar detail',
        width: 1254,
        height: 1254,
      },
      {
        src: '/images/white-pulse-game-jersey-03-pattern-detail.webp',
        label: 'Pattern close-up',
        alt: 'White Pulse Game Jersey motion-curve pattern detail',
        width: 1254,
        height: 1254,
      },
      {
        src: '/images/white-pulse-game-jersey-04-seam-detail.webp',
        label: 'Seam detail',
        alt: 'White Pulse Game Jersey visible seam detail',
        width: 1254,
        height: 1254,
      },
      {
        src: '/images/white-pulse-game-jersey-05-on-model.webp',
        label: 'On-body view',
        alt: 'Adult model wearing the White Pulse Game Jersey',
        width: 1254,
        height: 1254,
      },
    ],
    badge: 'Concept preview',
    personalizable: true,
    personalization: {
      cleanImage: '/images/white-pulse-game-jersey-custom-base.webp',
      viewImages: {
        front: {
          src: '/images/white-pulse-game-jersey-custom-base.webp',
          alt: 'White Pulse Game Jersey single front view',
          crop: { x: 0, y: 145, width: 600, height: 920, sourceWidth: 1254, sourceHeight: 1254 },
        },
        back: {
          src: '/images/white-pulse-game-jersey-custom-base.webp',
          alt: 'White Pulse Game Jersey single back view',
          crop: { x: 654, y: 145, width: 600, height: 920, sourceWidth: 1254, sourceHeight: 1254 },
        },
        left: {
          src: '/images/white-pulse-game-jersey-custom-base.webp',
          alt: 'White Pulse Game Jersey left sleeve detail fallback',
          crop: { x: 310, y: 250, width: 300, height: 400, sourceWidth: 1254, sourceHeight: 1254 },
        },
        right: {
          src: '/images/white-pulse-game-jersey-custom-base.webp',
          alt: 'White Pulse Game Jersey right sleeve detail fallback',
          crop: { x: 15, y: 250, width: 300, height: 400, sourceWidth: 1254, sourceHeight: 1254 },
        },
      },
      sourceInk: '#132b4d',
      sourceOutline: '#aeb8c1',
      detectedSourceElements: [
        'Front city name area',
        'Front number',
        'Back number',
        'Back name position',
        'Front logo position',
        'Left sleeve logo area',
        'Right sleeve logo area',
      ],
      regions: [
        { id: 'front-city', kind: 'city', side: 'front', x: 32, y: 31, width: 36, height: 7 },
        { id: 'front-number', kind: 'number', side: 'front', x: 35, y: 38, width: 30, height: 34 },
        { id: 'back-number', kind: 'number', side: 'back', x: 32, y: 39, width: 36, height: 40 },
        { id: 'back-name', kind: 'name', side: 'back', x: 35, y: 31, width: 30, height: 8 },
        { id: 'front-logo', kind: 'logo', logoSlot: 'front', side: 'front', x: 30, y: 27, width: 12, height: 10, rotate: -1 },
        { id: 'left-sleeve-logo', kind: 'logo', logoSlot: 'leftSleeve', side: 'left', x: 42, y: 40, width: 16, height: 16 },
        { id: 'right-sleeve-logo', kind: 'logo', logoSlot: 'rightSleeve', side: 'right', x: 42, y: 40, width: 16, height: 16 },
      ],
    },
    catalogState: 'concept-preview',
    theme: 'Feel the motion',
    story: 'A personal rhythm becomes the starting point for an original uniform.',
    design: 'A continuous motion curve travels through the identity area without implying a performance claim.',
    craft: 'Print method, material, and measurable construction details remain pending product verification.',
    connection: 'Personalize a confirmed name, number, and approved mark through Create Yours.',
  },
  {
    slug: 'white-pulse-motion-top',
    name: 'White Pulse Motion Top',
    series: 'white-pulse',
    world: 'create',
    price: priceTbd(),
    color: 'WE WHITE / Cobalt',
    image: '/images/water-ripple.webp',
    badge: 'Concept preview',
    catalogState: 'concept-preview',
    theme: 'Feel the motion',
    story: 'A quieter White Pulse study built around flow, pause, and restart.',
    design: 'Motion curves are spaced to create a lighter visual field; this describes appearance only.',
    craft: 'Final print, material, care, and construction specifications are not yet verified.',
    connection: 'The series can be used as an approved base for a future personal edition.',
  },
  {
    slug: 'black-rift-game-jersey',
    name: 'Black Rift Game Jersey',
    series: 'black-rift',
    world: 'create',
    price: priceTbd(),
    color: 'WE BLACK / Rift Blue',
    image: '/images/product-crack.webp',
    badge: 'Concept preview',
    personalizable: true,
    catalogState: 'concept-preview',
    theme: 'Break the ordinary',
    story: 'Pressure becomes a visible break from the expected rather than a borrowed team language.',
    design: 'Original fracture paths divide the field while preserving space for a personal identity system.',
    craft: 'Layering, textile, and fracture application require sampling and production verification.',
    connection: 'Add a confirmed name and number without introducing third-party team or league marks.',
  },
  {
    slug: 'black-rift-travel-layer',
    name: 'Black Rift Travel Layer',
    series: 'black-rift',
    world: 'create',
    price: priceTbd(),
    color: 'WE BLACK / Electric Blue',
    image: '/images/crack-series.webp',
    badge: 'Concept preview',
    catalogState: 'concept-preview',
    theme: 'Break the ordinary',
    story: 'The fracture language expands into a second original silhouette study.',
    design: 'Controlled contrast keeps the visual force concentrated around the identity line.',
    craft: 'Construction, trim, material, fit, and care facts remain TBD until verified.',
    connection: 'A future personal edition can inherit the same approved identity system.',
  },
  {
    slug: 'identity-fusion-game-jersey',
    name: 'Identity Fusion Game Jersey',
    series: 'identity-fusion',
    world: 'create',
    price: priceTbd(),
    color: 'WE BLACK / METAL SILVER',
    image: '/images/craft-embroidery.webp',
    badge: 'Concept preview',
    personalizable: true,
    catalogState: 'concept-preview',
    theme: 'Identity is personal',
    story: 'A name and number become the composition itself, not a final layer added to it.',
    design: 'Broken type, number structure, and personal marks are fused into one original identity field.',
    craft: 'High-density embroidery is the documented direction; stitch values and materials remain TBD.',
    connection: 'Customer-provided names or handwriting require confirmation and an IP review before production.',
  },
  {
    slug: 'identity-fusion-studio-layer',
    name: 'Identity Fusion Studio Layer',
    series: 'identity-fusion',
    world: 'create',
    price: priceTbd(),
    color: 'WE WHITE / METAL SILVER',
    image: '/images/hero-stadium.webp',
    badge: 'Concept preview',
    catalogState: 'concept-preview',
    theme: 'Identity is personal',
    story: 'A restrained study in how identity can move between garment, story, and environment.',
    design: 'Heritage framing supports an original name and number without simulating an official badge.',
    craft: 'Embroidery placement, construction, fit, and material facts await approved product data.',
    connection: 'Approved personal content can be carried into a saved proof and unique Design ID.',
  },
]

export const honorConcepts: HonorConcept[] = [
  {
    slug: 'roman-crest',
    name: 'Roman Crest',
    statement: 'Heritage of excellence.',
    description:
      'An original study of Roman numerals, classical framing, and dimensional crest language. It remains non-commerce while naming, archive, and usage rights are reviewed.',
    image: '/images/world-honor.webp',
    availability: 'rights-review',
  },
]

export const stories: Story[] = [
  {
    slug: 'from-buyer-to-creator',
    category: 'Identity',
    title: 'From Buyer to Creator',
    excerpt: 'Why the experience begins with a personal story instead of a finished product.',
    image: '/images/hero-stadium.webp',
    readTime: '4 min',
  },
  {
    slug: 'motion-becomes-identity',
    category: 'Create',
    title: 'Motion Becomes Identity',
    excerpt: 'Inside the continuous curve and personal rhythm of White Pulse.',
    image: '/images/water-ripple.webp',
    readTime: '3 min',
  },
  {
    slug: 'proof-before-promise',
    category: 'Craft',
    title: 'Proof Before Promise',
    excerpt: 'How design intent becomes verified product information before a claim is published.',
    image: '/images/craft-embroidery.webp',
    readTime: '5 min',
  },
]

export const prototypeNotice =
  'Concept presentation. Final price, materials, availability, production timing, and delivery terms remain TBD until verified.'

const legacySeriesAliases: Record<string, string> = {
  'water-ripple': 'white-pulse',
  crack: 'black-rift',
}

const legacyProductAliases: Record<string, string> = {
  'water-ripple-game-jersey': 'white-pulse-game-jersey',
  'water-ripple-warmup': 'white-pulse-motion-top',
  'crack-game-jersey': 'black-rift-game-jersey',
  'crack-travel-jacket': 'black-rift-travel-layer',
}

export function getSeries(slug?: string) {
  if (!slug) return undefined
  return series.find((item) => item.slug === (legacySeriesAliases[slug] ?? slug))
}

export function getProduct(slug?: string) {
  if (!slug) return undefined
  return products.find((item) => item.slug === (legacyProductAliases[slug] ?? slug))
}

export function formatPrice(price: Price) {
  if (price.status === 'tbd') return 'PRICE TBD'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

export function searchCatalog(
  query: string,
  source: { products: Product[]; stories: Story[]; series: Series[] } = { products, stories, series },
) {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  return [
    ...source.products.map((item) => ({
      type: 'Product',
      title: item.name,
      description: `${item.color} · ${formatPrice(item.price)}`,
      href: `/products/${item.slug}`,
      image: item.image,
    })),
    ...source.stories.map((item) => ({
      type: 'Story',
      title: item.title,
      description: item.excerpt,
      href: `/stories/${item.slug}`,
      image: item.image,
    })),
    ...source.series.map((item) => ({
      type: 'Series',
      title: item.name,
      description: item.description,
      href: `/collections/${item.slug}`,
      image: item.image,
    })),
  ].filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(needle))
}
