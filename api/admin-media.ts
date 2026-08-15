import { list, put } from '@vercel/blob'
import {
  blobToken,
  isAdminAuthorized,
  isStorageConfigured,
} from '../src/server/adminAuth.js'
import { BLOB_ACCESS, blobMediaUrl } from '../src/server/blobMedia.js'

const MEDIA_PREFIX = 'cms/media/'
const MAX_MEDIA_BYTES = 10 * 1024 * 1024
const STORAGE_TIMEOUT_MS = 20_000
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function jsonResponse(body: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
  })
}

function safeFilename(value: string): string {
  const extension = value.toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[0] ?? '.webp'
  const stem = value
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'image'
  return `${stem}-${Date.now()}${extension}`
}

async function handleRequest(request: Request): Promise<Response> {
  if (!(await isAdminAuthorized(request))) return jsonResponse({ error: 'Admin authentication is required.' }, 401)
  if (!isStorageConfigured()) return jsonResponse({ error: 'Vercel Blob is not configured.' }, 503)

  if (request.method === 'GET') {
    try {
      const result = await list({
        prefix: MEDIA_PREFIX,
        limit: 200,
        token: blobToken(),
        abortSignal: AbortSignal.timeout(STORAGE_TIMEOUT_MS),
      })
      return jsonResponse({
        media: result.blobs
          .sort((first, second) => second.uploadedAt.getTime() - first.uploadedAt.getTime())
          .map((blob) => ({
            pathname: blob.pathname,
            url: blobMediaUrl(blob.pathname, blob.uploadedAt),
            size: blob.size,
            uploadedAt: blob.uploadedAt.toISOString(),
          })),
      })
    } catch (error) {
      console.error('Unable to list admin media.', error)
      return jsonResponse({ error: 'The media library could not be loaded.' }, 500)
    }
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' })
  }

  const contentType = request.headers.get('content-type')?.split(';')[0] ?? ''
  if (!ALLOWED_TYPES.has(contentType)) return jsonResponse({ error: 'Upload a JPG, PNG, or WEBP image.' }, 415)
  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > MAX_MEDIA_BYTES) return jsonResponse({ error: 'The image exceeds 10 MB.' }, 413)

  try {
    const body = await request.arrayBuffer()
    if (!body.byteLength) return jsonResponse({ error: 'The uploaded image is empty.' }, 400)
    if (body.byteLength > MAX_MEDIA_BYTES) return jsonResponse({ error: 'The image exceeds 10 MB.' }, 413)
    const filename = safeFilename(request.headers.get('x-file-name') ?? 'image')
    const blob = await put(`${MEDIA_PREFIX}${filename}`, body, {
      access: BLOB_ACCESS,
      addRandomSuffix: false,
      contentType,
      token: blobToken(),
      abortSignal: AbortSignal.timeout(STORAGE_TIMEOUT_MS),
    })
    const uploadedAt = new Date()
    return jsonResponse({
      image: {
        pathname: blob.pathname,
        url: blobMediaUrl(blob.pathname, uploadedAt),
        size: body.byteLength,
        uploadedAt: uploadedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('Unable to upload admin media.', error)
    return jsonResponse({ error: 'The image could not be uploaded.' }, 500)
  }
}

export async function fetch(request: Request): Promise<Response> {
  return handleRequest(request)
}
