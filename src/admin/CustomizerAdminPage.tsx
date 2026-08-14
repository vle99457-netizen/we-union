import { CheckCircle, ImageSquare, UploadSimple, WarningCircle } from '@phosphor-icons/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { products } from '../data/catalog'
import {
  customizerViewLabels,
  customizerViews,
  withUploadVersion,
  type CustomizerImagesResponse,
  type CustomizerView,
  type ManagedCustomizerImages,
} from '../data/customizerImages'

const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const NORMALIZED_SIZE = 1600
const CONTENT_SIZE = 1440
const MAX_SOURCE_BYTES = 15 * 1024 * 1024

type PreparedUpload = {
  blob: Blob
  filename: string
  previewUrl: string
}

type PreparedUploads = Partial<Record<CustomizerView, PreparedUpload>>

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('This browser could not prepare the image.'))
    }, 'image/webp', quality)
  })
}

async function normalizePreviewImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const canvas = document.createElement('canvas')
    canvas.width = NORMALIZED_SIZE
    canvas.height = NORMALIZED_SIZE
    const context = canvas.getContext('2d')
    if (!context) throw new Error('This browser could not prepare the image.')

    const scale = Math.min(CONTENT_SIZE / bitmap.width, CONTENT_SIZE / bitmap.height)
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.clearRect(0, 0, NORMALIZED_SIZE, NORMALIZED_SIZE)
    context.drawImage(bitmap, (NORMALIZED_SIZE - width) / 2, (NORMALIZED_SIZE - height) / 2, width, height)

    let output = await canvasToWebp(canvas, 0.9)
    if (output.size > 4 * 1024 * 1024) output = await canvasToWebp(canvas, 0.78)
    if (output.size > 4 * 1024 * 1024) throw new Error('The prepared image is still over 4 MB. Use a simpler source image.')
    return output
  } finally {
    bitmap.close()
  }
}

async function apiError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { error?: string }
    if (payload.error) return payload.error
  } catch {
    // The fallback below also covers non-JSON hosting responses.
  }
  return `The server returned ${response.status}.`
}

const previewProducts = products.filter((product) => product.personalization)

export function CustomizerAdminPage() {
  const [productSlug, setProductSlug] = useState(previewProducts[0]?.slug ?? '')
  const [password, setPassword] = useState('')
  const [existingImages, setExistingImages] = useState<ManagedCustomizerImages>({})
  const [preparedUploads, setPreparedUploads] = useState<PreparedUploads>({})
  const [preparingView, setPreparingView] = useState<CustomizerView | null>(null)
  const [uploadingView, setUploadingView] = useState<CustomizerView | null>(null)
  const [storageConfigured, setStorageConfigured] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const previewUrls = useRef(new Set<string>())

  const releasePreparedUploads = () => {
    for (const upload of Object.values(preparedUploads)) {
      if (!upload) continue
      URL.revokeObjectURL(upload.previewUrl)
      previewUrls.current.delete(upload.previewUrl)
    }
    setPreparedUploads({})
  }

  const loadExistingImages = async (slug: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/customizer-images?product=${encodeURIComponent(slug)}`, {
        headers: { Accept: 'application/json' },
      })
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('The preview-image backend is available on the Vercel deployment.')
      }
      const payload = await response.json() as CustomizerImagesResponse
      setExistingImages(payload.images)
      setStorageConfigured(payload.storageConfigured)
    } catch (loadError) {
      setExistingImages({})
      setStorageConfigured(false)
      setError(loadError instanceof Error ? loadError.message : 'Preview images could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadExistingImages(productSlug)
  }, [productSlug])

  useEffect(() => () => {
    for (const previewUrl of previewUrls.current) URL.revokeObjectURL(previewUrl)
  }, [])

  const prepareUpload = async (view: CustomizerView, file: File | undefined) => {
    if (!file) return
    setError('')
    setStatus('')
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Use a PNG, JPG, or WEBP image.')
      return
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError('Keep each source image under 15 MB.')
      return
    }

    setPreparingView(view)
    try {
      const blob = await normalizePreviewImage(file)
      const previewUrl = URL.createObjectURL(blob)
      previewUrls.current.add(previewUrl)
      setPreparedUploads((current) => {
        const previous = current[view]
        if (previous) {
          URL.revokeObjectURL(previous.previewUrl)
          previewUrls.current.delete(previous.previewUrl)
        }
        return { ...current, [view]: { blob, filename: file.name, previewUrl } }
      })
    } catch (prepareError) {
      setError(prepareError instanceof Error ? prepareError.message : 'This image could not be prepared.')
    } finally {
      setPreparingView(null)
    }
  }

  const hasCompleteSet = customizerViews.every((view) => existingImages[view] || preparedUploads[view])

  const uploadImages = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setStatus('')
    if (!password) {
      setError('Enter the admin password.')
      return
    }
    if (!hasCompleteSet) {
      setError('Add all four single-garment views before the first publish.')
      return
    }

    const pendingViews = customizerViews.filter((view) => preparedUploads[view])
    if (!pendingViews.length) {
      setStatus('All four saved preview images are already current.')
      return
    }

    try {
      for (const view of pendingViews) {
        const upload = preparedUploads[view]
        if (!upload) continue
        setUploadingView(view)
        const response = await fetch(
          `/api/customizer-images?product=${encodeURIComponent(productSlug)}&view=${view}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${password}`,
              'Content-Type': 'image/webp',
            },
            body: upload.blob,
          },
        )
        if (!response.ok) throw new Error(await apiError(response))
      }

      releasePreparedUploads()
      await loadExistingImages(productSlug)
      setPassword('')
      setStatus('The four-view preview set is published and available in the customizer.')
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'The preview images could not be uploaded.')
    } finally {
      setUploadingView(null)
    }
  }

  return (
    <section className="customizer-admin shell">
      <header className="customizer-admin__header">
        <p className="eyebrow">WE Studio / Admin</p>
        <h1>Customizer preview images.</h1>
        <p>Upload one centered garment image for each view. Do not combine front and back garments in the same image.</p>
      </header>

      <form className="customizer-admin__form" onSubmit={uploadImages}>
        <div className="customizer-admin__controls">
          <label>
            Product
            <select
              name="preview-product"
              value={productSlug}
              onChange={(event) => {
                releasePreparedUploads()
                setProductSlug(event.target.value)
                setStatus('')
              }}
            >
              {previewProducts.map((product) => <option value={product.slug} key={product.slug}>{product.name}</option>)}
            </select>
          </label>
          <label>
            Admin password
            <input
              name="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </div>

        <div className="customizer-admin__notice">
          <ImageSquare size={25} />
          <p><strong>Image rules</strong> PNG, JPG, or WEBP; one garment only; centered; full garment visible. Each file is normalized to a square 1600 × 1600 WEBP with a safe margin.</p>
        </div>

        <div className="customizer-admin__grid" aria-busy={loading || Boolean(uploadingView)}>
          {customizerViews.map((view) => {
            const prepared = preparedUploads[view]
            const existing = existingImages[view]
            const previewUrl = prepared?.previewUrl ?? (existing ? withUploadVersion(existing) : '')
            return (
              <article className="customizer-upload-card" data-admin-view={view} key={view}>
                <div className="customizer-upload-card__heading">
                  <div>
                    <span>{customizerViews.indexOf(view) + 1}</span>
                    <h2>{customizerViewLabels[view]}</h2>
                  </div>
                  {prepared || existing ? <CheckCircle size={23} weight="fill" aria-label="Image ready" /> : <WarningCircle size={23} aria-label="Image required" />}
                </div>
                <div className="customizer-upload-card__preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt={`${customizerViewLabels[view]} admin preview`} width="1600" height="1600" />
                  ) : (
                    <span><ImageSquare size={34} /> No image</span>
                  )}
                </div>
                <p>{prepared ? `Ready: ${prepared.filename}` : existing ? 'Published image' : 'Required for first publish'}</p>
                <label className="customizer-upload-card__button" htmlFor={`preview-${view}`}>
                  <UploadSimple size={18} /> {prepared || existing ? 'Replace image' : 'Choose image'}
                </label>
                <input
                  id={`preview-${view}`}
                  name={`${view}-preview-image`}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={Boolean(preparingView || uploadingView)}
                  onChange={(event) => void prepareUpload(view, event.target.files?.[0])}
                />
                {preparingView === view ? <small role="status">Preparing square preview…</small> : null}
                {uploadingView === view ? <small role="status">Uploading…</small> : null}
              </article>
            )
          })}
        </div>

        {storageConfigured === false && !loading ? (
          <p className="customizer-admin__storage-note"><WarningCircle size={18} /> Connect a Vercel Blob store and set the server environment variables before publishing.</p>
        ) : null}
        {error ? <p className="customizer-admin__error" role="alert">{error}</p> : null}
        {status ? <p className="customizer-admin__success" role="status"><CheckCircle size={18} weight="fill" /> {status}</p> : null}
        <div className="customizer-admin__actions">
          <p>{hasCompleteSet ? 'Four-view set ready.' : 'All four views are required for the first publish.'}</p>
          <button className="button button--dark" type="submit" disabled={loading || Boolean(preparingView || uploadingView) || !hasCompleteSet}>
            {uploadingView ? `Publishing ${customizerViewLabels[uploadingView]}…` : 'Publish preview set'}
          </button>
        </div>
      </form>
    </section>
  )
}
