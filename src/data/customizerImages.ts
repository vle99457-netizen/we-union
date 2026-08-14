export const customizerViews = ['front', 'back', 'left', 'right'] as const

export type CustomizerView = (typeof customizerViews)[number]

export const customizerViewLabels: Record<CustomizerView, string> = {
  front: 'Front',
  back: 'Back',
  left: 'Left sleeve',
  right: 'Right sleeve',
}

export type ManagedCustomizerImage = {
  url: string
  uploadedAt: string
}

export type ManagedCustomizerImages = Partial<Record<CustomizerView, ManagedCustomizerImage>>

export type CustomizerImagesResponse = {
  productSlug: string
  storageConfigured: boolean
  complete: boolean
  images: ManagedCustomizerImages
}

export function isCustomizerView(value: string | null | undefined): value is CustomizerView {
  return customizerViews.includes(value as CustomizerView)
}

export function withUploadVersion(image: ManagedCustomizerImage): string {
  const separator = image.url.includes('?') ? '&' : '?'
  return `${image.url}${separator}v=${encodeURIComponent(image.uploadedAt)}`
}
