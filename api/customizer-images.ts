import { list, put } from '@vercel/blob'
import {
  customizerViews,
  isCustomizerView,
  type CustomizerImagesResponse,
  type ManagedCustomizerImages,
} from '../src/data/customizerImages.js'
import { isAdminAuthorized, isAdminConfigured } from '../src/server/adminAuth.js'

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const BLOB_LIST_TIMEOUT_MS = 5_000
const BLOB_UPLOAD_TIMEOUT_MS = 30_000
const PRODUCT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const runtimeEnvironment = (
  globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }
).process?.env ?? {}

async function withDeadline<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error('The storage request timed out.')), timeoutMs)
  })

  try {
    return await Promise.race([operation, deadline])
  } finally {
    if (timeout !== undefined) clearTimeout(timeout)
  }
}

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

async function getImages(productSlug: string): Promise<CustomizerImagesResponse> {
  const token = runtimeEnvironment.BLOB_READ_WRITE_TOKEN
  const adminConfigured = isAdminConfigured()
  if (!token) {
    return {
      productSlug,
      storageConfigured: false,
      storageAvailable: false,
      adminConfigured,
      complete: false,
      images: {},
    }
  }

  const prefix = `customizer/${productSlug}/`
  const result = await withDeadline(
    list({
      prefix,
      limit: 100,
      token,
      abortSignal: AbortSignal.timeout(BLOB_LIST_TIMEOUT_MS),
    }),
    BLOB_LIST_TIMEOUT_MS + 500,
  )
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
    storageAvailable: true,
    adminConfigured,
    complete: customizerViews.every((view) => Boolean(images[view])),
    images,
  }
}

export function parseRequestUrl(requestUrl: string): URL {
  // Vercel's web handler adapter can provide a path-only request URL.
  // The fallback origin is only used to parse its query string.
  return new URL(requestUrl, 'https://customizer.internal')
}

async function handleRequest(request: Request): Promise<Response> {
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
      return jsonResponse({
        productSlug,
        storageConfigured: Boolean(runtimeEnvironment.BLOB_READ_WRITE_TOKEN),
        storageAvailable: false,
        adminConfigured: isAdminConfigured(),
        complete: false,
        images: {},
      })
    }
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' })
  }
  if (!runtimeEnvironment.BLOB_READ_WRITE_TOKEN) {
    return jsonResponse({ error: 'Vercel Blob is not configured for this project.' }, 503)
  }
  if (!(await isAdminAuthorized(request))) {
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
    const blob = await withDeadline(
      put(pathname, body, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        abortSignal: AbortSignal.timeout(BLOB_UPLOAD_TIMEOUT_MS),
        contentType: 'image/webp',
        token: runtimeEnvironment.BLOB_READ_WRITE_TOKEN,
      }),
      BLOB_UPLOAD_TIMEOUT_MS + 500,
    )
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

// Vercel's Web Handler API requires a named `fetch` export. A default export
// is treated as the Node `(request, response)` signature and ignores Response returns.
export async function fetch(request: Request): Promise<Response> {
  return handleRequest(request)
}
