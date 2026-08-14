import { describe, expect, it } from 'vitest'
import type { PersonalizationRegion } from './data/catalog'
import {
  MAX_ARTWORK_SCALE,
  MIN_ARTWORK_SCALE,
  clampArtworkPosition,
  getArtworkRegionPosition,
  getArtworkScaleLimits,
} from './customizerArtwork'

const logoRegion: PersonalizationRegion = {
  id: 'front-logo',
  kind: 'logo',
  logoSlot: 'front',
  side: 'front',
  x: 30,
  y: 27,
  width: 12,
  height: 10,
}

describe('customizer artwork transforms', () => {
  it('defaults every personalization item to its catalog position at 100% size', () => {
    expect(getArtworkRegionPosition(logoRegion)).toEqual({ x: 30, y: 27, scale: 1 })
  })

  it('keeps legacy saved positions compatible when no scale is present', () => {
    expect(clampArtworkPosition(logoRegion, { x: 44, y: 38 })).toEqual({
      x: 44,
      y: 38,
      scale: 1,
    })
  })

  it('allows independent scaling while keeping the full item inside the preview', () => {
    expect(clampArtworkPosition(logoRegion, { x: 90, y: 90, scale: 2 })).toEqual({
      x: 76,
      y: 80,
      scale: 2,
    })
  })

  it('clamps size to accessible editing limits', () => {
    expect(getArtworkScaleLimits(logoRegion)).toEqual({
      min: MIN_ARTWORK_SCALE,
      max: MAX_ARTWORK_SCALE,
    })
    expect(clampArtworkPosition(logoRegion, { x: 30, y: 27, scale: 0 }).scale).toBe(MIN_ARTWORK_SCALE)
    expect(clampArtworkPosition(logoRegion, { x: 30, y: 27, scale: 10 }).scale).toBe(MAX_ARTWORK_SCALE)
  })
})
