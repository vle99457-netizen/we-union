const SITE_CONFIG_STORAGE_KEY = 'we-site-config-published'
const SITE_CONFIG_EVENT = 'we:site-config-published'
const SITE_CONFIG_CHANNEL = 'we-site-config'

type SiteConfigUpdate = {
  revision: string
  updatedAt: string | null
}

function isSiteConfigUpdate(value: unknown): value is SiteConfigUpdate {
  return Boolean(
    value
    && typeof value === 'object'
    && 'revision' in value
    && typeof value.revision === 'string',
  )
}

function createUpdate(updatedAt: string | null): SiteConfigUpdate {
  return {
    revision: `${updatedAt ?? 'unversioned'}:${Date.now()}:${Math.random().toString(36).slice(2)}`,
    updatedAt,
  }
}

export function announceSiteConfigUpdate(updatedAt: string | null): void {
  if (typeof window === 'undefined') return
  const update = createUpdate(updatedAt)

  window.dispatchEvent(new CustomEvent(SITE_CONFIG_EVENT, { detail: update }))
  try {
    window.localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(update))
  } catch {
    // BroadcastChannel and the same-tab event still cover browsers with blocked storage.
  }

  if (typeof BroadcastChannel === 'undefined') return
  const channel = new BroadcastChannel(SITE_CONFIG_CHANNEL)
  channel.postMessage(update)
  channel.close()
}

export function subscribeToSiteConfigUpdates(onUpdate: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined
  let lastRevision = ''
  const notify = (update: unknown) => {
    if (!isSiteConfigUpdate(update) || update.revision === lastRevision) return
    lastRevision = update.revision
    onUpdate()
  }
  const onSameTabUpdate = (event: Event) => notify((event as CustomEvent<unknown>).detail)
  const onStorageUpdate = (event: StorageEvent) => {
    if (event.key !== SITE_CONFIG_STORAGE_KEY || !event.newValue) return
    try {
      notify(JSON.parse(event.newValue))
    } catch {
      // Ignore malformed values written by older builds or browser extensions.
    }
  }

  window.addEventListener(SITE_CONFIG_EVENT, onSameTabUpdate)
  window.addEventListener('storage', onStorageUpdate)

  const channel = typeof BroadcastChannel === 'undefined'
    ? null
    : new BroadcastChannel(SITE_CONFIG_CHANNEL)
  if (channel) channel.onmessage = (event) => notify(event.data)

  return () => {
    window.removeEventListener(SITE_CONFIG_EVENT, onSameTabUpdate)
    window.removeEventListener('storage', onStorageUpdate)
    channel?.close()
  }
}
