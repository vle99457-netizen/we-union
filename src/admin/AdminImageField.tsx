import {
  ArrowSquareOut,
  CheckCircle,
  Images,
  UploadSimple,
  WarningCircle,
} from '@phosphor-icons/react'
import { useEffect, useId, useState } from 'react'
import {
  ADMIN_IMAGE_ACCEPT,
  uploadAdminImage,
  validateAdminImageFile,
} from './adminMedia'

type AdminImageFieldProps = {
  language: 'zh' | 'en'
  label: string
  value: string
  onChange: (value: string) => void
  help?: string
  previewAlt?: string
  compact?: boolean
  showUrlField?: boolean
}

function text(language: 'zh' | 'en', zh: string, en: string): string {
  return language === 'zh' ? zh : en
}

export function AdminImageField({
  language,
  label,
  value,
  onChange,
  help,
  previewAlt = '',
  compact = false,
  showUrlField = true,
}: AdminImageFieldProps) {
  const inputId = `admin-image-${useId().replace(/:/g, '')}`
  const [localPreview, setLocalPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview)
  }, [localPreview])

  const selectFile = async (file: File | undefined) => {
    if (!file) return
    const validation = validateAdminImageFile(file)
    if (validation) {
      setError(validation === 'type'
        ? text(language, '请选择 JPG、PNG 或 WEBP 图片。', 'Choose a JPG, PNG, or WEBP image.')
        : text(language, '图片不能超过 10 MB。', 'The image must be 10 MB or smaller.'))
      setStatus('')
      return
    }

    setLocalPreview(URL.createObjectURL(file))
    setUploading(true)
    setError('')
    setStatus(text(language, '正在上传所选图片…', 'Uploading the selected image…'))
    try {
      const image = await uploadAdminImage(file)
      onChange(image.url)
      setLocalPreview('')
      setStatus(text(language, '图片已上传；点击“发布更改”后网站生效。', 'Image uploaded; publish changes to make it live.'))
    } catch (uploadError) {
      setError(uploadError instanceof Error
        ? uploadError.message
        : text(language, '图片上传失败。', 'The image could not be uploaded.'))
      setStatus('')
    } finally {
      setUploading(false)
    }
  }

  const previewSource = localPreview || value

  return (
    <section className={`admin-image-field${compact ? ' admin-image-field--compact' : ''}`}>
      <div className="admin-image-field__preview" data-empty={!previewSource}>
        {previewSource ? (
          <img src={previewSource} alt={previewAlt} loading="lazy" decoding="async" width="960" height="640" />
        ) : (
          <span><Images size={28} />{text(language, '选择图片后在这里预览', 'Your image preview appears here')}</span>
        )}
        {localPreview ? <em>{text(language, '本地预览', 'Local preview')}</em> : null}
      </div>
      <div className="admin-image-field__body">
        <div className="admin-image-field__heading">
          <div>
            <strong>{label}</strong>
            {help ? <small>{help}</small> : null}
          </div>
          <div className="admin-image-field__actions">
            <label className="admin-image-field__choose" htmlFor={inputId} aria-disabled={uploading}>
              <UploadSimple size={17} />
              {uploading
                ? text(language, '上传中…', 'Uploading…')
                : text(language, value ? '从电脑更换' : '从电脑选择', value ? 'Replace from computer' : 'Choose from computer')}
              <input
                id={inputId}
                name={inputId}
                type="file"
                accept={ADMIN_IMAGE_ACCEPT}
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  event.target.value = ''
                  void selectFile(file)
                }}
              />
            </label>
            {value ? (
              <a href={value} target="_blank" rel="noreferrer" aria-label={text(language, '打开当前图片', 'Open current image')}>
                <ArrowSquareOut size={17} />
              </a>
            ) : null}
          </div>
        </div>
        {showUrlField ? (
          <label className="admin-image-field__url">
            <span>{text(language, '图片地址', 'Image URL')}</span>
            <input name={`${inputId}-url`} type="text" inputMode="url" value={value} placeholder="https://… or /images/…" onChange={(event) => {
              onChange(event.target.value)
              setError('')
              setStatus('')
            }} />
          </label>
        ) : null}
        {error ? <p className="admin-image-field__message is-error" role="alert"><WarningCircle size={16} />{error}</p> : null}
        {status ? <p className="admin-image-field__message is-success" role="status"><CheckCircle size={16} weight="fill" />{status}</p> : null}
      </div>
    </section>
  )
}
