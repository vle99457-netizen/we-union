import type { PersonalizationRegion } from './data/catalog'

export type ArtworkPosition = {
  x: number
  y: number
  scale?: number
}

export type ArtworkPositions = Partial<Record<PersonalizationRegion['id'], ArtworkPosition>>

export const MIN_ARTWORK_SCALE = 0.45
export const MAX_ARTWORK_SCALE = 2.5

export function getArtworkScaleLimits(region: PersonalizationRegion) {
  return {
    min: MIN_ARTWORK_SCALE,
    max: Math.min(MAX_ARTWORK_SCALE, 100 / region.width, 100 / region.height),
  }
}

export function getArtworkRegionPosition(region: PersonalizationRegion): ArtworkPosition {
  return {
    x: region.x,
    y: region.y,
    scale: 1,
  }
}

export function clampArtworkPosition(
  region: PersonalizationRegion,
  position: ArtworkPosition,
): ArtworkPosition {
  const limits = getArtworkScaleLimits(region)
  const requestedScale = Number.isFinite(position.scale) ? (position.scale ?? 1) : 1
  const scale = Math.min(limits.max, Math.max(limits.min, requestedScale))
  return {
    x: Math.min(100 - (region.width * scale), Math.max(0, position.x)),
    y: Math.min(100 - (region.height * scale), Math.max(0, position.y)),
    scale,
  }
}
