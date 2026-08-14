const ADMIN_COOKIE = 'we_admin_session'
const SESSION_SECONDS = 8 * 60 * 60

const runtimeEnvironment = (
  globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }
).process?.env ?? {}

function configuredPassword(): string {
  return runtimeEnvironment.SITE_ADMIN_PASSWORD || runtimeEnvironment.CUSTOMIZER_ADMIN_PASSWORD || ''
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function secureEqual(first: string, second: string): Promise<boolean> {
  const [firstHash, secondHash] = await Promise.all([sha256(first), sha256(second)])
  let difference = firstHash.length ^ secondHash.length
  const length = Math.max(firstHash.length, secondHash.length)
  for (let index = 0; index < length; index += 1) {
    difference |= (firstHash.charCodeAt(index) || 0) ^ (secondHash.charCodeAt(index) || 0)
  }
  return difference === 0
}

async function sessionToken(password: string): Promise<string> {
  return sha256(`we-admin-session:v1:${password}`)
}

function cookieValue(request: Request, name: string): string {
  const cookieHeader = request.headers.get('cookie') ?? ''
  for (const part of cookieHeader.split(';')) {
    const [key, ...value] = part.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return ''
}

export function isAdminConfigured(): boolean {
  return Boolean(configuredPassword())
}

export function isStorageConfigured(): boolean {
  return Boolean(runtimeEnvironment.BLOB_READ_WRITE_TOKEN)
}

export function blobToken(): string {
  return runtimeEnvironment.BLOB_READ_WRITE_TOKEN ?? ''
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expected = configuredPassword()
  if (!expected || !password) return false
  return secureEqual(password, expected)
}

export async function isAdminAuthorized(request: Request): Promise<boolean> {
  const expected = configuredPassword()
  if (!expected) return false

  const authorization = request.headers.get('authorization')
  if (authorization?.startsWith('Bearer ')) {
    return secureEqual(authorization.slice('Bearer '.length), expected)
  }

  const receivedSession = cookieValue(request, ADMIN_COOKIE)
  if (!receivedSession) return false
  return secureEqual(receivedSession, await sessionToken(expected))
}

export async function createAdminSessionCookie(password: string): Promise<string> {
  const token = await sessionToken(password)
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Strict`
}

export function clearAdminSessionCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`
}

export function runtimeEnv(): Record<string, string | undefined> {
  return runtimeEnvironment
}
