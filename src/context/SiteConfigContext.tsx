import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  defaultSiteConfig,
  normalizeSiteConfig,
  visibleProducts,
  visibleSeries,
  visibleStories,
  visibleWorlds,
  type SiteConfig,
} from '../data/siteConfig'

type SiteConfigContextValue = {
  config: SiteConfig
  loading: boolean
  refresh: () => Promise<void>
  products: ReturnType<typeof visibleProducts>
  series: ReturnType<typeof visibleSeries>
  stories: ReturnType<typeof visibleStories>
  worlds: ReturnType<typeof visibleWorlds>
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null)

export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(() => structuredClone(defaultSiteConfig))
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const response = await fetch('/api/site-config', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'same-origin',
      })
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return
      const payload = await response.json() as { config?: unknown }
      if (payload.config) setConfig(normalizeSiteConfig(payload.config))
    } catch {
      // Static defaults keep the public site available if storage is temporarily unavailable.
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
  }, [])

  const value = useMemo<SiteConfigContextValue>(() => ({
    config,
    loading,
    refresh,
    products: visibleProducts(config),
    series: visibleSeries(config),
    stories: visibleStories(config),
    worlds: visibleWorlds(config),
  }), [config, loading])

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig(): SiteConfigContextValue {
  const value = useContext(SiteConfigContext)
  if (!value) throw new Error('useSiteConfig must be used inside SiteConfigProvider.')
  return value
}
