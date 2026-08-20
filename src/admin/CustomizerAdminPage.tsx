import { CheckCircle, ImageSquare, UploadSimple, WarningCircle } from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { ManagedProduct } from '../data/siteConfig'
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

export function CustomizerAdminPage({
  products,
  language = 'en',
  embedded = false,
}: {
  products: readonly ManagedProduct[]
  language?: 'zh' | 'en'
  embedded?: boolean
}) {
  const previewProducts = useMemo(() => products.filter((product) => product.personalizable), [products])
  const [requestedProductSlug, setRequestedProductSlug] = useState('')
  const productSlug = previewProducts.some((product) => product.slug === requestedProductSlug)
    ? requestedProductSlug
    : previewProducts[0]?.slug ?? ''
  const [existingImages, setExistingImages] = useState<ManagedCustomizerImages>({})
  const [preparedUploads, setPreparedUploads] = useState<PreparedUploads>({})
  const [preparingView, setPreparingView] = useState<CustomizerView | null>(null)
  const [uploadingView, setUploadingView] = useState<CustomizerView | null>(null)
  const [storageConfigured, setStorageConfigured] = useState<boolean | null>(null)
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null)
  const [adminConfigured, setAdminConfigured] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const previewUrls = useRef(new Set<string>())
  const t = (zh: string, en: string) => language === 'zh' ? zh : en
  const viewLabel = (view: CustomizerView) => ({
    front: t('正面', 'Front'),
    back: t('背面', 'Back'),
    left: t('左袖', 'Left sleeve'),
    right: t('右袖', 'Right sleeve'),
  })[view]

  const releasePreparedUploads = () => {
    setPreparedUploads((current) => {
      for (const upload of Object.values(current)) {
        if (!upload) continue
        URL.revokeObjectURL(upload.previewUrl)
        previewUrls.current.delete(upload.previewUrl)
      }
      return {}
    })
  }

  const loadExistingImages = async (slug: string, signal?: AbortSignal) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/customizer-images?product=${encodeURIComponent(slug)}`, {
        headers: { Accept: 'application/json' },
        signal,
      })
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error(t('定制预览接口仅在 Vercel 部署中可用。', 'The preview-image backend is available on the Vercel deployment.'))
      }
      const payload = await response.json() as CustomizerImagesResponse
      if (signal?.aborted) return
      setExistingImages(payload.images)
      setStorageConfigured(payload.storageConfigured)
      setStorageAvailable(payload.storageAvailable)
      setAdminConfigured(payload.adminConfigured)
    } catch (loadError) {
      if (signal?.aborted) return
      setExistingImages({})
      setStorageConfigured(false)
      setStorageAvailable(false)
      setAdminConfigured(false)
      setError(loadError instanceof Error ? loadError.message : t('无法载入预览图片。', 'Preview images could not be loaded.'))
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    setExistingImages({})
    setPreparedUploads((current) => {
      for (const upload of Object.values(current)) {
        if (!upload) continue
        URL.revokeObjectURL(upload.previewUrl)
        previewUrls.current.delete(upload.previewUrl)
      }
      return {}
    })
    if (!productSlug) {
      setLoading(false)
      setError('')
      return () => controller.abort()
    }
    void loadExistingImages(productSlug, controller.signal)
    return () => controller.abort()
  }, [productSlug])

  useEffect(() => () => {
    for (const previewUrl of previewUrls.current) URL.revokeObjectURL(previewUrl)
  }, [])

  const prepareUpload = async (view: CustomizerView, file: File | undefined) => {
    if (!file) return
    setError('')
    setStatus('')
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(t('请使用 PNG、JPG 或 WEBP 图片。', 'Use a PNG, JPG, or WEBP image.'))
      return
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError(t('每张源图片需小于 15 MB。', 'Keep each source image under 15 MB.'))
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
      setError(prepareError instanceof Error ? prepareError.message : t('无法处理这张图片。', 'This image could not be prepared.'))
    } finally {
      setPreparingView(null)
    }
  }

  const hasCompleteSet = customizerViews.every((view) => existingImages[view] || preparedUploads[view])

  const uploadImages = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setStatus('')
    if (!productSlug) {
      setError(t('请先在商品目录中启用至少一个可定制商品。', 'Enable at least one personalizable catalog product first.'))
      return
    }
    if (!adminConfigured) {
      setError(t('发布前请在 Vercel Production 环境设置 CUSTOMIZER_ADMIN_PASSWORD。', 'Set CUSTOMIZER_ADMIN_PASSWORD in the Vercel production environment before publishing.'))
      return
    }
    if (!storageConfigured || !storageAvailable) {
      setError(t('发布前必须连接并启用 Vercel Blob Store。', 'The Vercel Blob store must be connected and available before publishing.'))
      return
    }
    if (!hasCompleteSet) {
      setError(t('首次发布前必须补齐四张单件球衣视图。', 'Add all four single-garment views before the first publish.'))
      return
    }

    const pendingViews = customizerViews.filter((view) => preparedUploads[view])
    if (!pendingViews.length) {
      setStatus(t('四张已保存的预览图均为最新。', 'All four saved preview images are already current.'))
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
              'Content-Type': 'image/webp',
            },
            credentials: 'same-origin',
            body: upload.blob,
          },
        )
        if (!response.ok) throw new Error(await apiError(response))
      }

      releasePreparedUploads()
      await loadExistingImages(productSlug)
      setStatus(t('四视图预览已发布，并可在定制器中使用。', 'The four-view preview set is published and available in the customizer.'))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : t('无法上传预览图片。', 'The preview images could not be uploaded.'))
    } finally {
      setUploadingView(null)
    }
  }

  return (
    <section className={embedded ? 'customizer-admin customizer-admin--embedded' : 'customizer-admin shell'}>
      <header className="customizer-admin__header">
        <p className="eyebrow">WE Studio / Admin</p>
        <h1>{t('定制预览图片', 'Customizer preview images.')}</h1>
        <p>{t('每个视图上传一张居中的单件球衣图片。请勿将正面和背面球衣合并在同一张图中。', 'Upload one centered garment image for each view. Do not combine front and back garments in the same image.')}</p>
      </header>

      <form className="customizer-admin__form" onSubmit={uploadImages}>
        <div className="customizer-admin__controls">
          <label>
            {t('商品', 'Product')}
            <select
              name="preview-product"
              value={productSlug}
              disabled={!previewProducts.length}
              onChange={(event) => {
                releasePreparedUploads()
                setRequestedProductSlug(event.target.value)
                setStatus('')
              }}
            >
              {previewProducts.map((product) => <option value={product.slug} key={product.slug}>{product.name}</option>)}
            </select>
          </label>
        </div>

        {!previewProducts.length ? (
          <p className="customizer-admin__storage-note"><WarningCircle size={18} /> {t('请先在“目录与商品”中开启至少一个商品的“允许定制”。', 'Enable “Personalizable” for at least one catalog product first.')}</p>
        ) : null}

        <div className="customizer-admin__notice">
          <ImageSquare size={25} />
          <p><strong>{t('图片规则', 'Image rules')}</strong> {t('PNG、JPG 或 WEBP；每张只显示一件球衣；居中且完整可见。系统会统一为带安全边距的 1600 × 1600 WEBP。', 'PNG, JPG, or WEBP; one garment only; centered; full garment visible. Each file is normalized to a square 1600 × 1600 WEBP with a safe margin.')}</p>
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
                    <h2>{viewLabel(view)}</h2>
                  </div>
                  {prepared || existing ? <CheckCircle size={23} weight="fill" aria-label="Image ready" /> : <WarningCircle size={23} aria-label="Image required" />}
                </div>
                <div className="customizer-upload-card__preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt={`${viewLabel(view)} admin preview`} width="1600" height="1600" />
                  ) : (
                    <span><ImageSquare size={34} /> {t('暂无图片', 'No image')}</span>
                  )}
                </div>
                <p>{prepared ? `${t('待发布', 'Ready')}: ${prepared.filename}` : existing ? t('已发布图片', 'Published image') : t('首次发布必填', 'Required for first publish')}</p>
                <label className="customizer-upload-card__button" htmlFor={`preview-${view}`}>
                  <UploadSimple size={18} /> {prepared || existing ? t('替换图片', 'Replace image') : t('选择图片', 'Choose image')}
                </label>
                <input
                  id={`preview-${view}`}
                  name={`${view}-preview-image`}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={!productSlug || Boolean(preparingView || uploadingView)}
                  onChange={(event) => void prepareUpload(view, event.target.files?.[0])}
                />
                {preparingView === view ? <small role="status">{t('正在生成方形预览…', 'Preparing square preview…')}</small> : null}
                {uploadingView === view ? <small role="status">{t('上传中…', 'Uploading…')}</small> : null}
              </article>
            )
          })}
        </div>

        {storageConfigured === false && !loading ? (
          <p className="customizer-admin__storage-note"><WarningCircle size={18} /> {t('发布前请连接 Vercel Blob Store 并设置服务端环境变量。', 'Connect a Vercel Blob store and set the server environment variables before publishing.')}</p>
        ) : null}
        {storageConfigured && storageAvailable === false && !loading ? (
          <p className="customizer-admin__storage-note"><WarningCircle size={18} /> {t('Vercel Blob 已配置但未响应，请在发布前重试。', 'Vercel Blob is configured but did not respond. Try again before publishing.')}</p>
        ) : null}
        {adminConfigured === false && !loading ? (
          <p className="customizer-admin__storage-note"><WarningCircle size={18} /> {t('请在 Vercel Production 环境设置 CUSTOMIZER_ADMIN_PASSWORD。', 'Set CUSTOMIZER_ADMIN_PASSWORD in the Vercel production environment before publishing.')}</p>
        ) : null}
        {error ? <p className="customizer-admin__error" role="alert">{error}</p> : null}
        {status ? <p className="customizer-admin__success" role="status"><CheckCircle size={18} weight="fill" /> {status}</p> : null}
        <div className="customizer-admin__actions">
          <p>{hasCompleteSet ? t('四视图已就绪。', 'Four-view set ready.') : t('首次发布需要四张视图。', 'All four views are required for the first publish.')}</p>
          <button className="button button--dark" type="submit" disabled={!productSlug || loading || adminConfigured === false || storageConfigured === false || storageAvailable === false || Boolean(preparingView || uploadingView) || !hasCompleteSet}>
            {uploadingView ? `${t('正在发布', 'Publishing')} ${viewLabel(uploadingView)}…` : t('发布预览图组', 'Publish preview set')}
          </button>
        </div>
      </form>
    </section>
  )
}
