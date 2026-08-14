export const ADMIN_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'
export const ADMIN_IMAGE_MAX_BYTES = 10 * 1024 * 1024

export type AdminImageValidationError = 'type' | 'size'

export type AdminMediaUpload = {
  pathname: string
  url: string
  size: number
  uploadedAt: string
}

export function validateAdminImageFile(file: { type: string; size: number }): AdminImageValidationError | null {
  if (!ADMIN_IMAGE_ACCEPT.split(',').includes(file.type)) return 'type'
  if (file.size > ADMIN_IMAGE_MAX_BYTES) return 'size'
  return null
}

async function responseError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { error?: string }
    if (payload.error) return payload.error
  } catch {
    // Fall through to the hosting status when the response is not JSON.
  }
  return `HTTP ${response.status}`
}

export async function uploadAdminImage(
  file: File,
  fetcher: typeof fetch = globalThis.fetch,
): Promise<AdminMediaUpload> {
  const response = await fetcher('/api/admin-media', {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      'X-File-Name': file.name,
    },
    credentials: 'same-origin',
    body: file,
  })
  if (!response.ok) throw new Error(await responseError(response))
  const payload = await response.json() as { image?: AdminMediaUpload }
  if (!payload.image?.url) throw new Error('The upload response did not include an image URL.')
  return payload.image
}
