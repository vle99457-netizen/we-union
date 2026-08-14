import { list, put } from '@vercel/blob'
import {
  customizerViews,
  isCustomizerView,
  type CustomizerImagesResponse,
  type ManagedCustomizerImages,
} from '../src/data/customizerImages.js'

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const BLOB_LIST_TIMEOUT_MS = 5_000
const BLOB_UPLOAD_TIMEOUT_MS = 30_000
const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const runtimeEnvironment = (
  globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }
).process?.env ?? {}

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

async function secureEqual(first: string, second: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const [firstHash, secondHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(first)),
    crypto.subtle.digest('SHA-256', encoder.encode(second)),
  ])
  const firstBytes = new Uint8Array(firstHash)
  const secondBytes = new Uint8Array(secondHash)
  let difference = 0
  for (let index = 0; index < firstBytes.length; index += 1) {
    difference |= firstBytes[index]! ^ secondBytes[index]!
  }
  return difference === 0
}

async function isAuthorized(request: Request): Promise<boolean> {
  const expectedPassword = runtimeEnvironment.CUSTOMIZER_ADMIN_PASSWORD
  const authorization = request.headers.get('authorization')
  if (!expectedPassword || !authorization?.startsWith('Bearer ')) return false
  return secureEqual(authorization.slice('Bearer '.length), expectedPassword)
}

async function getImages(productSlug: string): Promise<CustomizerImagesResponse> {
  const token = runtimeEnvironment.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return { productSlug, storageConfigured: false, complete: false, images: {} }
  }

  const prefix = `customizer/${productSlug}/`
  const result = await list({
    prefix,
    limit: 100,
    token,
    abortSignal: AbortSignal.timeout(BLOB_LIST_TIMEOUT_MS),
  })
  const images: ManagedCustomizerImages = {}

  for (const blob of result.blobs) {
    const filename = blob.pathname.slice(prefix.length)
    const view = filename.replace(/\.webp$/, '')
    if (!filename.endsWith('.webp') || !isCustomizerView(view)) continue
    images[view] = { url: blob.url, uploadedAt: blob.uploadedAt.toISOString() }
  }

  return {
    productSlug,
    storageConfigured: true,
    complete: customizerViews.every((view) => Boolean(images[view])),
    images,
  }
}

export function parseRequestUrl(requestUrl: string): URL {
  // Vercel's web handler adapter can provide a path-only request URL.
  // The fallback origin is only used to parse its query string.
  return new URL(requestUrl, 'https://customizer.internal')
}

export default async function handler(request: Request): Promise<Response> {
  const url = parseRequestUrl(request.url)
  const productSlug = url.searchParams.get('product')
  if (!productSlug || !PRODUCT_SLUG_PATTERN.test(productSlug)) {
    return jsonResponse({ error: 'A valid product slug is required.' }, 400)
  }

  if (request.method === 'GET') {
    try {
      return jsonResponse(await getImages(productSlug))
    } catch (error) {
      console.error('Unable to list customizer preview images.', error)
      return jsonResponse({ error: 'Preview images could not be loaded.' }, 500)
    }
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' })
  }
  if (!runtimeEnvironment.BLOB_READ_WRITE_TOKEN) {
    return jsonResponse({ error: 'Vercel Blob is not configured for this project.' }, 503)
  }
  if (!(await isAuthorized(request))) {
    return jsonResponse({ error: 'The admin password is incorrect.' }, 401)
  }

  const view = url.searchParams.get('view')
  if (!isCustomizerView(view)) return jsonResponse({ error: 'A valid preview view is required.' }, 400)
  if (request.headers.get('content-type')?.split(';')[0] !== 'image/webp') {
    return jsonResponse({ error: 'Uploads must be normalized WEBP images.' }, 415)
  }
  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (contentLength > MAX_UPLOAD_BYTES) {
    return jsonResponse({ error: 'The uploaded image exceeds 4 MB.' }, 413)
  }

  try {
    const body = await request.arrayBuffer()
    if (!body.byteLength) return jsonResponse({ error: 'The uploaded image is empty.' }, 400)
    if (body.byteLength > MAX_UPLOAD_BYTES) {
      return jsonResponse({ error: 'The uploaded image exceeds 4 MB.' }, 413)
    }

    const pathname = `customizer/${productSlug}/${view}.webp`
    const blob = await put(pathname, body, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      abortSignal: AbortSignal.timeout(BLOB_UPLOAD_TIMEOUT_MS),
      contentType: 'image/webp',
      token: runtimeEnvironment.BLOB_READ_WRITE_TOKEN,
    })
    return jsonResponse({
      productSlug,
      view,
      image: { url: blob.url, uploadedAt: new Date().toISOString() },
    })
  } catch (error) {
    console.error('Unable to upload a customizer preview image.', error)
    return jsonResponse({ error: 'The preview image could not be uploaded.' }, 500)
  }
}
