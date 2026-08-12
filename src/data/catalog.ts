export type WorldSlug = 'create' | 'honor' | 'belong'

export type Series = {
  slug: string
  name: string
  eyebrow: string
  statement: string
  description: string
  world: WorldSlug
  image: string
  tone: 'dark' | 'light' | 'blue'
}

export type Product = {
  slug: string
  name: string
  series: string
  world: WorldSlug
  price: number
  color: string
  image: string
  badge?: string
  personalizable?: boolean
}

export type Story = {
  slug: string
  category: string
  title: string
  excerpt: string
  image: string
  readTime: string
}

export const worlds = [
  {
    slug: 'create' as const,
    index: '01',
    title: 'Create',
    copy: 'Start with an original. Make the details unmistakably yours.',
    image: '/images/water-ripple.webp',
  },
  {
    slug: 'honor' as const,
    index: '02',
    title: 'Honor',
    copy: 'Carry the number, place, and people that shaped the story.',
    image: '/images/world-honor.webp',
  },
  {
    slug: 'belong' as const,
    index: '03',
    title: 'Belong',
    copy: 'Build a shared identity without losing the individual inside it.',
    image: '/images/world-belong.webp',
  },
] as const

export const series: Series[] = [
  {
    slug: 'water-ripple',
    name: 'Water Ripple',
    eyebrow: 'Series 01 / Create',
    statement: 'Move first. Let the world answer.',
    description: 'A calm cobalt field disrupted by motion, built for names, numbers, and personal marks.',
    world: 'create',
    image: '/images/water-ripple.webp',
    tone: 'blue',
  },
  {
    slug: 'midnight-standard',
    name: 'Midnight Standard',
    eyebrow: 'Series 02 / Honor',
    statement: 'A number can hold an entire season.',
    description: 'Obsidian performance layers with disciplined gold detailing and high-contrast identifiers.',
    world: 'honor',
    image: '/images/hero-stadium.webp',
    tone: 'dark',
  },
  {
    slug: 'common-thread',
    name: 'Common Thread',
    eyebrow: 'Series 03 / Belong',
    statement: 'Different stories. One signal.',
    description: 'Warm neutral foundations and modular marks designed to read as one from any distance.',
    world: 'belong',
    image: '/images/craft-embroidery.webp',
    tone: 'light',
  },
]

export const products: Product[] = [
  {
    slug: 'water-ripple-game-jersey',
    name: 'Water Ripple Game Jersey',
    series: 'water-ripple',
    world: 'create',
    price: 99,
    color: 'Cobalt / Ivory',
    image: '/images/product-water.webp',
    badge: 'Personalizable',
    personalizable: true,
  },
  {
    slug: 'water-ripple-warmup',
    name: 'Water Ripple Warm-Up',
    series: 'water-ripple',
    world: 'create',
    price: 129,
    color: 'Cobalt / Navy',
    image: '/images/water-ripple.webp',
  },
  {
    slug: 'midnight-standard-jersey',
    name: 'Midnight Standard Jersey',
    series: 'midnight-standard',
    world: 'honor',
    price: 119,
    color: 'Obsidian / Gold',
    image: '/images/world-honor.webp',
    badge: 'Personalizable',
    personalizable: true,
  },
  {
    slug: 'midnight-standard-jacket',
    name: 'Midnight Standard Jacket',
    series: 'midnight-standard',
    world: 'honor',
    price: 169,
    color: 'Obsidian',
    image: '/images/hero-stadium.webp',
  },
  {
    slug: 'common-thread-training-top',
    name: 'Common Thread Training Top',
    series: 'common-thread',
    world: 'belong',
    price: 89,
    color: 'Ivory / Gold',
    image: '/images/world-belong.webp',
    badge: 'Team ready',
  },
  {
    slug: 'common-thread-travel-shell',
    name: 'Common Thread Travel Shell',
    series: 'common-thread',
    world: 'belong',
    price: 189,
    color: 'Charcoal / Ivory',
    image: '/images/craft-embroidery.webp',
  },
]

export const stories: Story[] = [
  {
    slug: 'the-number-24',
    category: 'Honor',
    title: 'What a Number Carries',
    excerpt: 'A uniform begins as material. Memory is what gives it weight.',
    image: '/images/hero-stadium.webp',
    readTime: '4 min',
  },
  {
    slug: 'motion-leaves-a-mark',
    category: 'Create',
    title: 'Motion Leaves a Mark',
    excerpt: 'Inside the line, color, and rhythm of the Water Ripple series.',
    image: '/images/water-ripple.webp',
    readTime: '3 min',
  },
  {
    slug: 'checked-by-hand',
    category: 'Craft',
    title: 'Checked by Hand',
    excerpt: 'The last inspection is small, slow, and deliberately human.',
    image: '/images/craft-embroidery.webp',
    readTime: '5 min',
  },
]

export const prototypeNotice =
  'Prototype catalog content and sample pricing are shown for design validation only.'

export function getSeries(slug?: string) {
  return series.find((item) => item.slug === slug)
}

export function getProduct(slug?: string) {
  return products.find((item) => item.slug === slug)
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function searchCatalog(query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return []

  return [
    ...products.map((item) => ({
      type: 'Product',
      title: item.name,
      description: `${item.color} · ${formatPrice(item.price)} sample`,
      href: `/products/${item.slug}`,
      image: item.image,
    })),
    ...stories.map((item) => ({
      type: 'Story',
      title: item.title,
      description: item.excerpt,
      href: `/stories/${item.slug}`,
      image: item.image,
    })),
    ...series.map((item) => ({
      type: 'Series',
      title: item.name,
      description: item.description,
      href: `/collections/${item.slug}`,
      image: item.image,
    })),
  ].filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(needle))
}
