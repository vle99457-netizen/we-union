import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteConfigContext'
import type { SiteConfig } from '../data/siteConfig'

function routeMetadata(pathname: string, config: SiteConfig): [string, string] {
  const defaultDescription = config.seo.defaultDescription
  if (pathname === '/') return [config.seo.defaultTitle, defaultDescription]
  if (pathname === '/collections') return ['Original Series — WE', 'Explore WE original series as full-width visual worlds before entering each product list.']
  if (pathname === '/custom/team') return ['Team Orders — WE', 'Plan an original WE group system through a structured, non-transactional team brief.']
  if (pathname.startsWith('/custom/saved/')) return ['Create Yours — WE', 'Return to a locally saved WE personalization draft.']
  if (pathname === '/custom') return ['Create Yours — WE', 'Personalize a WE original through Choose, Personalize, Review, and Order & Track.']
  if (pathname.startsWith('/admin')) return ['Administration — WE', 'Manage WE website content and configuration.']
  if (pathname === '/search') return ['Search — WE', 'Find WE originals, series, stories, and support.']

  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'collections' && parts[1]) {
    const current = config.catalog.series.find((item) => item.slug === parts[1] && item.visible)
    if (current) return [`${current.name} — WE`, current.description]
  }
  if (parts[0] === 'products' && parts[1]) {
    const current = config.catalog.products.find((item) => item.slug === parts[1] && item.visible)
    if (current) return [`${current.name} — WE`, `${current.color}. An original WE sportswear concept shaped by identity, story, and craft.`]
  }
  if (parts[0] === 'stories' && parts[1]) {
    const current = config.catalog.stories.find((story) => story.slug === parts[1] && story.visible)
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
  const { config } = useSiteConfig()

  useEffect(() => {
    const [title, description] = routeMetadata(pathname, config)
    document.title = title
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (meta) meta.content = description
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (robots) robots.content = config.seo.robotsIndex ? 'index, follow' : 'noindex, nofollow'
    const ogImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]')
    if (ogImage) ogImage.content = config.seo.ogImage
  }, [pathname, config])

  return null
}
