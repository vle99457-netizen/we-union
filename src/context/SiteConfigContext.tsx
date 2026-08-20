import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  defaultSiteConfig,
  normalizeSiteConfig,
  visibleProducts,
  visibleSeries,
  visibleStories,
  visibleWorlds,
  type SiteConfig,
} from '../data/siteConfig'
import { subscribeToSiteConfigUpdates } from '../data/siteConfigSync'

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
  const activeRefresh = useRef<Promise<void> | null>(null)
  const refreshQueued = useRef(false)

  const refresh = useCallback(async () => {
    if (activeRefresh.current) {
      refreshQueued.current = true
      return activeRefresh.current
    }
    const request = (async () => {
      do {
        refreshQueued.current = false
        try {
          const response = await fetch('/api/site-config', {
            headers: { Accept: 'application/json' },
            cache: 'no-store',
            credentials: 'same-origin',
          })
          if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) continue
          const payload = await response.json() as { config?: unknown }
          if (payload.config) setConfig(normalizeSiteConfig(payload.config))
        } catch {
          // Static defaults keep the public site available if storage is temporarily unavailable.
        } finally {
          setLoading(false)
        }
      } while (refreshQueued.current)
    })()
    activeRefresh.current = request
    try {
      await request
    } finally {
      if (activeRefresh.current === request) activeRefresh.current = null
    }
  }, [])

  useEffect(() => {
    void refresh()
    const unsubscribe = subscribeToSiteConfigUpdates(() => { void refresh() })
    const refreshOnFocus = () => { void refresh() }
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    window.addEventListener('focus', refreshOnFocus)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      unsubscribe()
      window.removeEventListener('focus', refreshOnFocus)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [refresh])

  const value = useMemo<SiteConfigContextValue>(() => ({
    config,
    loading,
    refresh,
    products: visibleProducts(config),
    series: visibleSeries(config),
    stories: visibleStories(config),
    worlds: visibleWorlds(config),
  }), [config, loading, refresh])

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig(): SiteConfigContextValue {
  const value = useContext(SiteConfigContext)
  if (!value) throw new Error('useSiteConfig must be used inside SiteConfigProvider.')
  return value
}
