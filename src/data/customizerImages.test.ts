import { describe, expect, it } from 'vitest'
import {
  customizerViews,
  isCustomizerView,
  withUploadVersion,
} from './customizerImages'

describe('customizer preview image helpers', () => {
  it('keeps the four backend view identifiers stable', () => {
    expect(customizerViews).toEqual(['front', 'back', 'left', 'right'])
    expect(customizerViews.every(isCustomizerView)).toBe(true)
    expect(isCustomizerView('front-back')).toBe(false)
  })

  it('cache-busts an overwritten Blob URL with its upload timestamp', () => {
    expect(withUploadVersion({
      url: 'https://example.public.blob.vercel-storage.com/customizer/front.webp',
      uploadedAt: '2026-08-13T18:30:00.000Z',
    })).toBe('https://example.public.blob.vercel-storage.com/customizer/front.webp?v=2026-08-13T18%3A30%3A00.000Z')
  })
})
