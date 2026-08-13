import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProduct, getSeries, stories } from '../data/catalog'

const defaultDescription = 'Sports heritage meets personal identity. Explore WE original series, create a personal piece, and discover the stories behind the work.'

function routeMetadata(pathname: string): [string, string] {
  if (pathname === '/') return ['WE — Sports Heritage Meets Personal Identity', defaultDescription]
  if (pathname === '/collections') return ['Original Series — WE', 'Explore WE original series as full-width visual worlds before entering each product list.']
  if (pathname === '/custom/team') return ['Team Orders — WE', 'Plan an original WE group system through a structured, non-transactional team brief.']
  if (pathname.startsWith('/custom/saved/')) return ['Create Yours — WE', 'Return to a locally saved WE personalization draft.']
  if (pathname === '/custom') return ['Create Yours — WE', 'Personalize a WE original through Choose, Personalize, Review, and Order & Track.']
  if (pathname === '/search') return ['Search — WE', 'Find WE originals, series, stories, and support.']

  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'collections' && parts[1]) {
    const current = getSeries(parts[1])
    if (current) return [`${current.name} — WE`, current.description]
  }
  if (parts[0] === 'products' && parts[1]) {
    const current = getProduct(parts[1])
    if (current) return [`${current.name} — WE`, `${current.color}. An original WE sportswear concept shaped by identity, story, and craft.`]
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
