import { get, put } from '@vercel/blob'
import {
  blobToken,
  clearAdminSessionCookie,
  createAdminSessionCookie,
  isAdminAuthorized,
  isAdminConfigured,
  isStorageConfigured,
  verifyAdminPassword,
} from '../src/server/adminAuth.js'
import {
  defaultSiteConfig,
  isPublishableSiteConfig,
  normalizeSiteConfig,
  siteConfigValidationIssues,
  type SiteConfig,
} from '../src/data/siteConfig.js'
import { BLOB_ACCESS } from '../src/server/blobMedia.js'

const CONFIG_PATHNAME = 'cms/site-config.json'
const MAX_CONFIG_BYTES = 750 * 1024
const STORAGE_TIMEOUT_MS = 8_000

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

async function withDeadline<T>(operation: Promise<T>, timeoutMs = STORAGE_TIMEOUT_MS): Promise<T> {
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

function parseRequestUrl(requestUrl: string): URL {
  return new URL(requestUrl, 'https://site-config.internal')
}

async function readStoredConfig(): Promise<SiteConfig> {
  const token = blobToken()
  if (!token) return structuredClone(defaultSiteConfig)

  const result = await withDeadline(get(CONFIG_PATHNAME, {
    access: BLOB_ACCESS,
    token,
    useCache: false,
    abortSignal: AbortSignal.timeout(STORAGE_TIMEOUT_MS),
  }))
  if (!result) return structuredClone(defaultSiteConfig)
  if (result.statusCode !== 200) throw new Error('The published site configuration could not be read.')
  return normalizeSiteConfig(await new Response(result.stream).json())
}

async function saveConfig(input: unknown): Promise<SiteConfig> {
  if (!isPublishableSiteConfig(input)) throw new Error('The site configuration is incomplete.')
  const config = normalizeSiteConfig(input)
  const validationIssues = siteConfigValidationIssues(config)
  if (validationIssues.length) throw new Error(`Configuration validation failed: ${validationIssues[0]}`)
  config.updatedAt = new Date().toISOString()
  const payload = JSON.stringify(config)
  if (new TextEncoder().encode(payload).byteLength > MAX_CONFIG_BYTES) {
    throw new Error('The site configuration exceeds the 750 KB limit.')
  }

  await withDeadline(put(CONFIG_PATHNAME, payload, {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8',
    token: blobToken(),
    abortSignal: AbortSignal.timeout(STORAGE_TIMEOUT_MS),
  }))
  return config
}

async function handleRequest(request: Request): Promise<Response> {
  const url = parseRequestUrl(request.url)
  const action = url.searchParams.get('action')

  if (request.method === 'POST' && action === 'login') {
    if (!isAdminConfigured()) return jsonResponse({ error: 'The admin password is not configured.' }, 503)
    let password = ''
    try {
      const body = await request.json() as { password?: unknown }
      password = typeof body.password === 'string' ? body.password : ''
    } catch {
      return jsonResponse({ error: 'A valid login request is required.' }, 400)
    }
    if (!(await verifyAdminPassword(password))) return jsonResponse({ error: 'The admin password is incorrect.' }, 401)

    let config = structuredClone(defaultSiteConfig)
    if (isStorageConfigured()) {
      try {
        config = await readStoredConfig()
      } catch (error) {
        console.error('Unable to read the site configuration during login.', error)
      }
    }
    return jsonResponse({
      authenticated: true,
      config,
      adminConfigured: true,
      storageConfigured: isStorageConfigured(),
    }, 200, { 'Set-Cookie': await createAdminSessionCookie(password) })
  }

  if (request.method === 'POST' && action === 'logout') {
    return jsonResponse({ authenticated: false }, 200, { 'Set-Cookie': clearAdminSessionCookie() })
  }

  if (request.method === 'GET') {
    const adminRequest = url.searchParams.get('admin') === '1'
    if (adminRequest && !(await isAdminAuthorized(request))) {
      return jsonResponse({
        authenticated: false,
        adminConfigured: isAdminConfigured(),
        storageConfigured: isStorageConfigured(),
      }, 401)
    }

    try {
      const config = await readStoredConfig()
      return jsonResponse({
        config,
        ...(adminRequest ? {
          authenticated: true,
          adminConfigured: isAdminConfigured(),
          storageConfigured: isStorageConfigured(),
        } : {}),
      })
    } catch (error) {
      console.error('Unable to read the published site configuration.', error)
      return jsonResponse({
        config: structuredClone(defaultSiteConfig),
        storageAvailable: false,
        ...(adminRequest ? {
          authenticated: true,
          adminConfigured: isAdminConfigured(),
          storageConfigured: isStorageConfigured(),
        } : {}),
      })
    }
  }

  if (request.method === 'PUT') {
    if (!(await isAdminAuthorized(request))) return jsonResponse({ error: 'Admin authentication is required.' }, 401)
    if (!isStorageConfigured()) return jsonResponse({ error: 'Vercel Blob is not configured.' }, 503)

    const contentLength = Number(request.headers.get('content-length') ?? '0')
    if (contentLength > MAX_CONFIG_BYTES) return jsonResponse({ error: 'The site configuration is too large.' }, 413)
    try {
      const config = await saveConfig(await request.json())
      return jsonResponse({ config, published: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The site configuration could not be published.'
      const status = message.includes('incomplete') || message.includes('validation') || message.includes('limit') ? 400 : 500
      console.error('Unable to publish the site configuration.', error)
      return jsonResponse({ error: message }, status)
    }
  }

  return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET, PUT, POST' })
}

export async function fetch(request: Request): Promise<Response> {
  return handleRequest(request)
}
