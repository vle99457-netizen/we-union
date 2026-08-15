import { get } from '@vercel/blob'
import { BLOB_ACCESS, isPublicBlobMediaPathname } from '../src/server/blobMedia.js'
import { blobToken, isStorageConfigured } from '../src/server/adminAuth.js'

const STORAGE_TIMEOUT_MS = 20_000
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function textResponse(message: string, status: number, headers?: HeadersInit): Response {
  return new Response(message, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  })
}

export function parseRequestUrl(requestUrl: string): URL {
  return new URL(requestUrl, 'https://blob-media.internal')
}

async function handleRequest(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return textResponse('Method not allowed.', 405, { Allow: 'GET' })
  }

  const pathname = parseRequestUrl(request.url).searchParams.get('pathname') ?? ''
  if (!isPublicBlobMediaPathname(pathname)) return textResponse('Image not found.', 404)
  if (!isStorageConfigured()) return textResponse('Vercel Blob is not configured.', 503)

  try {
    const result = await get(pathname, {
      access: BLOB_ACCESS,
      token: blobToken(),
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
      abortSignal: AbortSignal.timeout(STORAGE_TIMEOUT_MS),
    })
    if (!result) return textResponse('Image not found.', 404)

    if (result.statusCode === 304) {
      return new Response(null, {
        status: 304,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          ETag: result.blob.etag,
          'X-Content-Type-Options': 'nosniff',
        },
      })
    }

    if (!ALLOWED_IMAGE_TYPES.has(result.blob.contentType)) {
      console.error('Rejected a Blob media response with an unexpected content type.', {
        pathname,
        contentType: result.blob.contentType,
      })
      return textResponse('Unsupported image type.', 415)
    }

    return new Response(result.stream, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': 'inline',
        'Content-Length': String(result.blob.size),
        'Content-Type': result.blob.contentType,
        ETag: result.blob.etag,
        'Last-Modified': result.blob.uploadedAt.toUTCString(),
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Unable to read Blob media.', error)
    return textResponse('The image could not be loaded.', 500)
  }
}

export async function fetch(request: Request): Promise<Response> {
  return handleRequest(request)
}
