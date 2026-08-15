import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

const blobMocks = vi.hoisted(() => ({
  get: vi.fn(),
  list: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@vercel/blob', () => blobMocks)

const ADMIN_PASSWORD = 'test-admin-password'
const BLOB_TOKEN = 'test-private-blob-token'

function authorizedHeaders(contentType?: string): HeadersInit {
  return {
    Authorization: `Bearer ${ADMIN_PASSWORD}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
  }
}

describe('private Blob API integration', () => {
  beforeEach(() => {
    process.env.CUSTOMIZER_ADMIN_PASSWORD = ADMIN_PASSWORD
    process.env.BLOB_READ_WRITE_TOKEN = BLOB_TOKEN
    blobMocks.get.mockReset()
    blobMocks.list.mockReset()
    blobMocks.put.mockReset()
    vi.resetModules()
  })

  afterAll(() => {
    delete process.env.CUSTOMIZER_ADMIN_PASSWORD
    delete process.env.BLOB_READ_WRITE_TOKEN
  })

  it('uploads CMS media privately and returns a same-origin display URL', async () => {
    blobMocks.put.mockResolvedValue({ pathname: 'cms/media/hero-123.png' })
    const { fetch: adminMediaFetch } = await import('../api/admin-media')
    const response = await adminMediaFetch(new Request('https://example.test/api/admin-media', {
      method: 'POST',
      headers: {
        ...authorizedHeaders('image/png'),
        'X-File-Name': 'hero.png',
      },
      body: new Uint8Array([1, 2, 3]),
    }))
    const payload = await response.json() as { image: { url: string } }

    expect(response.status).toBe(200)
    expect(blobMocks.put).toHaveBeenCalledWith(
      expect.stringMatching(/^cms\/media\/hero-\d+\.png$/),
      expect.any(ArrayBuffer),
      expect.objectContaining({ access: 'private', token: BLOB_TOKEN }),
    )
    expect(payload.image.url).toMatch(/^\/api\/blob-media\?pathname=cms%2Fmedia%2Fhero-123\.png&v=\d+$/)
  })

  it('publishes site configuration to private storage', async () => {
    blobMocks.put.mockResolvedValue({ pathname: 'cms/site-config.json' })
    const [{ fetch: siteConfigFetch }, { defaultSiteConfig }] = await Promise.all([
      import('../api/site-config'),
      import('../src/data/siteConfig'),
    ])
    const response = await siteConfigFetch(new Request('https://example.test/api/site-config', {
      method: 'PUT',
      headers: authorizedHeaders('application/json'),
      body: JSON.stringify(defaultSiteConfig),
    }))

    expect(response.status).toBe(200)
    expect(blobMocks.put).toHaveBeenCalledWith(
      'cms/site-config.json',
      expect.any(String),
      expect.objectContaining({ access: 'private', token: BLOB_TOKEN }),
    )
  })

  it('uploads customizer views privately and returns a same-origin display URL', async () => {
    blobMocks.put.mockResolvedValue({
      pathname: 'customizer/white-pulse-game-jersey/front.webp',
    })
    const { fetch: customizerImagesFetch } = await import('../api/customizer-images')
    const response = await customizerImagesFetch(new Request(
      'https://example.test/api/customizer-images?product=white-pulse-game-jersey&view=front',
      {
        method: 'POST',
        headers: authorizedHeaders('image/webp'),
        body: new Uint8Array([1, 2, 3]),
      },
    ))
    const payload = await response.json() as { image: { url: string } }

    expect(response.status).toBe(200)
    expect(blobMocks.put).toHaveBeenCalledWith(
      'customizer/white-pulse-game-jersey/front.webp',
      expect.any(ArrayBuffer),
      expect.objectContaining({ access: 'private', token: BLOB_TOKEN }),
    )
    expect(payload.image.url).toMatch(
      /^\/api\/blob-media\?pathname=customizer%2Fwhite-pulse-game-jersey%2Ffront\.webp&v=\d+$/,
    )
  })

  it('streams an approved private image without exposing Blob credentials', async () => {
    const uploadedAt = new Date('2026-08-15T00:00:00.000Z')
    blobMocks.get.mockResolvedValue({
      statusCode: 200,
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array([1, 2, 3]))
          controller.close()
        },
      }),
      headers: new Headers(),
      blob: {
        contentType: 'image/png',
        size: 3,
        etag: 'etag-123',
        uploadedAt,
      },
    })
    const { fetch: blobMediaFetch } = await import('../api/blob-media')
    const response = await blobMediaFetch(new Request(
      'https://example.test/api/blob-media?pathname=cms%2Fmedia%2Fhero-123.png',
    ))

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('image/png')
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]))
    expect(blobMocks.get).toHaveBeenCalledWith(
      'cms/media/hero-123.png',
      expect.objectContaining({ access: 'private', token: BLOB_TOKEN }),
    )
  })
})
