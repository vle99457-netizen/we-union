import { describe, expect, it } from 'vitest'
import { fetch as siteConfigFetch } from '../api/site-config'

describe('site configuration API', () => {
  it('returns the complete default public configuration without storage', async () => {
    const response = await siteConfigFetch(new Request('https://site-config.internal/api/site-config'))
    const payload = await response.json() as { config: { version: number; home: { custom: { steps: unknown[] } } } }

    expect(response.status).toBe(200)
    expect(payload.config.version).toBe(1)
    expect(payload.config.home.custom.steps).toHaveLength(4)
  })

  it('protects the administrator configuration view', async () => {
    const response = await siteConfigFetch(new Request('https://site-config.internal/api/site-config?admin=1'))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toMatchObject({ authenticated: false })
  })

  it('rejects unauthenticated publishing', async () => {
    const response = await siteConfigFetch(new Request('https://site-config.internal/api/site-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 1 }),
    }))

    expect(response.status).toBe(401)
  })
})
