import { describe, expect, it, vi } from 'vitest'
import {
  ADMIN_IMAGE_MAX_BYTES,
  encodeUploadFilename,
  uploadAdminImage,
  validateAdminImageFile,
} from './adminMedia'

describe('administrator media uploads', () => {
  it('accepts supported image formats and enforces the 10 MB limit', () => {
    expect(validateAdminImageFile({ type: 'image/jpeg', size: 1 })).toBeNull()
    expect(validateAdminImageFile({ type: 'image/png', size: ADMIN_IMAGE_MAX_BYTES })).toBeNull()
    expect(validateAdminImageFile({ type: 'image/webp', size: 1024 })).toBeNull()
    expect(validateAdminImageFile({ type: 'image/svg+xml', size: 1024 })).toBe('type')
    expect(validateAdminImageFile({ type: 'image/png', size: ADMIN_IMAGE_MAX_BYTES + 1 })).toBe('size')
  })

  it('uploads the original file to the protected media endpoint', async () => {
    const file = new File([new Uint8Array([1, 2, 3])], 'product.png', { type: 'image/png' })
    const image = {
      pathname: 'cms/media/product-1.png',
      url: 'https://assets.example/product-1.png',
      size: 3,
      uploadedAt: '2026-08-14T00:00:00.000Z',
    }
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.method).toBe('POST')
      expect(new Headers(init?.headers).get('Content-Type')).toBe('image/png')
      expect(new Headers(init?.headers).get('X-File-Name')).toBe('product.png')
      expect(init?.body).toBe(file)
      return new Response(JSON.stringify({ image }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    await expect(uploadAdminImage(file, fetcher as typeof fetch)).resolves.toEqual(image)
    expect(fetcher).toHaveBeenCalledWith('/api/admin-media', expect.objectContaining({ credentials: 'same-origin' }))
  })

  it('percent-encodes Unicode filenames before placing them in a request header', async () => {
    const file = new File([new Uint8Array([1])], '商品主图.png', { type: 'image/png' })
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const filenameHeader = new Headers(init?.headers).get('X-File-Name') ?? ''
      expect(filenameHeader).toBe(encodeUploadFilename(file.name))
      expect(filenameHeader).toMatch(/^[\x20-\x7E]+$/)
      return new Response(JSON.stringify({
        image: {
          pathname: 'cms/media/image-1.png',
          url: '/api/blob-media?pathname=cms%2Fmedia%2Fimage-1.png',
          size: 1,
          uploadedAt: '2026-08-14T00:00:00.000Z',
        },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    })

    await expect(uploadAdminImage(file, fetcher as typeof fetch)).resolves.toMatchObject({
      pathname: 'cms/media/image-1.png',
    })
  })
})
