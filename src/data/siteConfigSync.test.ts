import { afterEach, describe, expect, it, vi } from 'vitest'
import { announceSiteConfigUpdate, subscribeToSiteConfigUpdates } from './siteConfigSync'

class TestBroadcastChannel {
  static channels = new Set<TestBroadcastChannel>()
  onmessage: ((event: MessageEvent) => void) | null = null

  constructor(readonly name: string) {
    TestBroadcastChannel.channels.add(this)
  }

  postMessage(data: unknown) {
    for (const channel of TestBroadcastChannel.channels) {
      if (channel !== this && channel.name === this.name) {
        channel.onmessage?.({ data } as MessageEvent)
      }
    }
  }

  close() {
    TestBroadcastChannel.channels.delete(this)
  }
}

describe('site configuration update notifications', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    TestBroadcastChannel.channels.clear()
  })

  it('notifies the current tab once and writes a cross-tab storage signal', () => {
    const browserWindow = new EventTarget() as EventTarget & {
      localStorage: { setItem: ReturnType<typeof vi.fn> }
    }
    browserWindow.localStorage = { setItem: vi.fn() }
    vi.stubGlobal('window', browserWindow)
    vi.stubGlobal('BroadcastChannel', TestBroadcastChannel)
    const onUpdate = vi.fn()
    const unsubscribe = subscribeToSiteConfigUpdates(onUpdate)

    announceSiteConfigUpdate('2026-08-20T08:00:00.000Z')

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(browserWindow.localStorage.setItem).toHaveBeenCalledTimes(1)
    const [storageKey, storageValue] = browserWindow.localStorage.setItem.mock.calls[0] as [string, string]
    expect(JSON.parse(storageValue)).toMatchObject({ updatedAt: '2026-08-20T08:00:00.000Z' })

    unsubscribe()
    const otherTabUpdate = vi.fn()
    const unsubscribeOtherTab = subscribeToSiteConfigUpdates(otherTabUpdate)
    const storageEvent = new Event('storage')
    Object.defineProperties(storageEvent, {
      key: { value: storageKey },
      newValue: { value: storageValue },
    })
    browserWindow.dispatchEvent(storageEvent)
    browserWindow.dispatchEvent(storageEvent)

    expect(otherTabUpdate).toHaveBeenCalledTimes(1)
    unsubscribeOtherTab()
  })
})
