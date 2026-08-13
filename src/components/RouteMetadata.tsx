import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProduct, getSeries, stories } from '../data/catalog'

const defaultDescription = 'Original sportswear, personal meaning. Explore WE series, customize an original, and discover city-curated pieces.'

function routeMetadata(pathname: string): [string, string] {
  if (pathname === '/') return ['WE — Gear Made Personal', defaultDescription]
  if (pathname === '/collections') return ['Original Series — WE', 'Explore WE original series as full-width visual worlds before entering each product list.']
  if (pathname === '/custom') return ['Create Yours — WE', 'Personalize a WE original through Choose, Personalize, Review, and Order & Track.']
  if (pathname === '/search') return ['Search — WE', 'Find WE originals, series, stories, support, and city-curated edits.']

  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'collections' && parts[1]) {
    const current = getSeries(parts[1])
    if (current) return [`${current.name} — WE`, current.description]
  }
  if (parts[0] === 'products' && parts[1]) {
    const current = getProduct(parts[1])
    if (current) return [`${current.name} — WE`, `${current.color}. An original WE performance piece with clear personalization and service boundaries.`]
  }
  if (parts[0] === 'stories' && parts[1]) {
    const current = stories.find((story) => story.slug === parts[1])
    if (current) return [`${current.title} — WE`, current.excerpt]
  }

  const labels: Record<string, string> = {
    create: 'Create', honor: 'Honor', belong: 'Belong', stories: 'Stories', community: 'Community',
    craftsmanship: 'Craftsmanship', about: 'About', team: 'Team Orders', cart: 'Cart', checkout: 'Checkout',
    account: 'Account', track: 'Order Tracking', support: 'Support', faq: 'FAQ', legal: 'Policies',
  }
  return [`${labels[parts[0] ?? ''] ?? 'Page Not Found'} — WE`, defaultDescription]
}

export function RouteMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    const [title, description] = routeMetadata(pathname)
    document.title = title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = description
  }, [pathname])

  return null
}
