import { describe, expect, it } from 'vitest'
import { fetch as blobMediaFetch, parseRequestUrl } from '../api/blob-media'
import { BLOB_ACCESS, blobMediaUrl, isPublicBlobMediaPathname } from '../src/server/blobMedia'

describe('private Blob media delivery', () => {
  it('uses the private access mode required by the connected store', () => {
    expect(BLOB_ACCESS).toBe('private')
  })

  it('creates same-origin, versioned media URLs', () => {
    expect(blobMediaUrl('cms/media/home-123.webp', new Date('2026-08-15T00:00:00.000Z'))).toBe(
      '/api/blob-media?pathname=cms%2Fmedia%2Fhome-123.webp&v=1786752000000',
    )
  })

  it('only exposes approved public website image paths', () => {
    expect(isPublicBlobMediaPathname('cms/media/hero-123.png')).toBe(true)
    expect(isPublicBlobMediaPathname('customizer/white-pulse-game-jersey/front.webp')).toBe(true)
    expect(isPublicBlobMediaPathname('customizer/white-pulse-game-jersey/side.webp')).toBe(false)
    expect(isPublicBlobMediaPathname('cms/site-config.json')).toBe(false)
    expect(isPublicBlobMediaPathname('cms/media/../../site-config.json')).toBe(false)
    expect(isPublicBlobMediaPathname('cms/media/payload.svg')).toBe(false)
  })

  it('parses Vercel path-only request URLs', () => {
    const url = parseRequestUrl('/api/blob-media?pathname=cms%2Fmedia%2Fhero-123.png')
    expect(url.searchParams.get('pathname')).toBe('cms/media/hero-123.png')
  })

  it('rejects attempts to read the private configuration blob', async () => {
    const response = await blobMediaFetch(new Request(
      'https://blob-media.internal/api/blob-media?pathname=cms%2Fsite-config.json',
    ))

    expect(response.status).toBe(404)
    await expect(response.text()).resolves.toBe('Image not found.')
  })
})
