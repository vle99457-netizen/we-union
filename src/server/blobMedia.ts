export const BLOB_ACCESS = 'private' as const

const CMS_MEDIA_PATHNAME = /^cms\/media\/[a-zA-Z0-9_-]{1,128}\.(?:jpe?g|png|webp)$/
const CUSTOMIZER_MEDIA_PATHNAME = /^customizer\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:front|back|left|right)\.webp$/

export function isPublicBlobMediaPathname(pathname: string): boolean {
  return CMS_MEDIA_PATHNAME.test(pathname) || CUSTOMIZER_MEDIA_PATHNAME.test(pathname)
}

export function blobMediaUrl(pathname: string, version?: string | Date): string {
  if (!isPublicBlobMediaPathname(pathname)) {
    throw new Error(`Blob pathname is not approved for public media delivery: ${pathname}`)
  }

  const params = new URLSearchParams({ pathname })
  if (version) {
    params.set('v', version instanceof Date ? version.getTime().toString() : version)
  }
  return `/api/blob-media?${params.toString()}`
}
