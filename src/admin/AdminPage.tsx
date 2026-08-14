import {
  ArrowClockwise,
  ArrowSquareOut,
  CheckCircle,
  FileText,
  FloppyDisk,
  Gear,
  Globe,
  House,
  Images,
  LockKey,
  Package,
  SignOut,
  SquaresFour,
  Stack,
  TShirt,
  UploadSimple,
  WarningCircle,
} from '@phosphor-icons/react'
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CustomizerAdminPage } from './CustomizerAdminPage'
import { normalizeSiteConfig, type SiteConfig } from '../data/siteConfig'

export type AdminLanguage = 'zh' | 'en'

type AdminSection =
  | 'dashboard'
  | 'global'
  | 'homepage'
  | 'catalog'
  | 'content'
  | 'customizer'
  | 'media'
  | 'commerce'
  | 'system'

type AuthState = 'checking' | 'guest' | 'authenticated'
type MutateDraft = (mutation: (next: SiteConfig) => void) => void

type AdminPayload = {
  authenticated?: boolean
  adminConfigured?: boolean
  storageConfigured?: boolean
  config?: unknown
  error?: string
}

type MediaItem = {
  pathname: string
  url: string
  size: number
  uploadedAt: string
}

const sectionIds: AdminSection[] = [
  'dashboard',
  'global',
  'homepage',
  'catalog',
  'content',
  'customizer',
  'media',
  'commerce',
  'system',
]

const sectionIcons: Record<AdminSection, typeof SquaresFour> = {
  dashboard: SquaresFour,
  global: Globe,
  homepage: House,
  catalog: Stack,
  content: FileText,
  customizer: TShirt,
  media: Images,
  commerce: Package,
  system: Gear,
}

const navLabels: Record<AdminSection, [string, string]> = {
  dashboard: ['概览', 'Dashboard'],
  global: ['品牌与导航', 'Brand & navigation'],
  homepage: ['首页内容', 'Homepage'],
  catalog: ['目录与商品', 'Catalog'],
  content: ['页面与政策', 'Pages & policies'],
  customizer: ['定制器', 'Customizer'],
  media: ['媒体库', 'Media library'],
  commerce: ['商务设置', 'Commerce'],
  system: ['SEO 与系统', 'SEO & system'],
}

function label(language: AdminLanguage, zh: string, en: string): string {
  return language === 'zh' ? zh : en
}

async function responseError(response: Response): Promise<string> {
  try {
    const payload = await response.json() as { error?: string }
    if (payload.error) return payload.error
  } catch {
    // Use the hosting status fallback below.
  }
  return `HTTP ${response.status}`
}

function formatDate(value: string | null, language: AdminLanguage): string {
  if (!value) return label(language, '尚未发布自定义配置', 'No custom configuration published')
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function Field({
  label: fieldLabel,
  value,
  onChange,
  type = 'text',
  multiline = false,
  help,
  min,
  max,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'url' | 'number'
  multiline?: boolean
  help?: string
  min?: number
  max?: number
}) {
  const fieldName = `admin-field-${useId().replace(/:/g, '')}`
  return (
    <label className="admin-field">
      <span>{fieldLabel}</span>
      {multiline ? (
        <textarea name={fieldName} value={value} rows={4} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          type={type}
          name={fieldName}
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {help ? <small>{help}</small> : null}
    </label>
  )
}

function SelectField({
  label: fieldLabel,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  const fieldName = `admin-select-${useId().replace(/:/g, '')}`
  return (
    <label className="admin-field">
      <span>{fieldLabel}</span>
      <select name={fieldName} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function ToggleField({ label: fieldLabel, checked, onChange, help }: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  help?: string
}) {
  const fieldName = `admin-toggle-${useId().replace(/:/g, '')}`
  return (
    <label className="admin-toggle">
      <input name={fieldName} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="admin-toggle__switch" aria-hidden="true" />
      <span><strong>{fieldLabel}</strong>{help ? <small>{help}</small> : null}</span>
    </label>
  )
}

function Panel({ title, description, children, actions }: {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}) {
  return (
    <section className="admin-panel">
      <header className="admin-panel__header">
        <div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>
        {actions}
      </header>
      {children}
    </section>
  )
}

function LoginScreen({
  language,
  onLanguageChange,
  onLogin,
  checking,
  error,
  adminConfigured,
}: {
  language: AdminLanguage
  onLanguageChange: (language: AdminLanguage) => void
  onLogin: (password: string) => Promise<void>
  checking: boolean
  error: string
  adminConfigured: boolean | null
}) {
  const [password, setPassword] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void onLogin(password).then(() => setPassword(''))
  }

  return (
    <main className="admin-login">
      <div className="admin-login__language" aria-label={label(language, '后台语言', 'Admin language')}>
        <button type="button" className={language === 'zh' ? 'is-active' : ''} onClick={() => onLanguageChange('zh')}>中文</button>
        <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => onLanguageChange('en')}>EN</button>
      </div>
      <form className="admin-login__card" onSubmit={submit}>
        <Link className="admin-login__brand" to="/" aria-label="WE home">
          <img src="/images/we-logo.svg" alt="WE" width="307" height="195" />
        </Link>
        <LockKey size={34} weight="light" />
        <p className="eyebrow">WE / ADMIN</p>
        <h1>{label(language, '管理后台', 'Administration')}</h1>
        <p>{label(language, '使用 Production 环境中配置的管理员密码登录。', 'Sign in with the administrator password configured in Production.')}</p>
        <label>
          {label(language, '管理员密码', 'Admin password')}
          <input
            name="admin-password"
            type="password"
            value={password}
            autoComplete="current-password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button className="button button--dark" type="submit" disabled={checking || !password || adminConfigured === false}>
          {checking ? label(language, '正在验证…', 'Verifying…') : label(language, '登录后台', 'Sign in')}
        </button>
        {adminConfigured === false ? (
          <p className="admin-message admin-message--error"><WarningCircle size={18} />{label(language, 'Production 环境未配置 CUSTOMIZER_ADMIN_PASSWORD。', 'CUSTOMIZER_ADMIN_PASSWORD is not configured in Production.')}</p>
        ) : null}
        {error ? <p className="admin-message admin-message--error" role="alert"><WarningCircle size={18} />{error}</p> : null}
        <Link className="admin-login__back" to="/">← {label(language, '返回网站', 'Back to website')}</Link>
      </form>
    </main>
  )
}

function DashboardSection({ config, language, storageConfigured, onNavigate }: {
  config: SiteConfig
  language: AdminLanguage
  storageConfigured: boolean
  onNavigate: (section: AdminSection) => void
}) {
  const visibleProducts = config.catalog.products.filter((item) => item.visible).length
  const enabledPages = config.pages.filter((item) => item.enabled).length
  const enabledSections = Object.values(config.home).filter((item) => item.enabled).length
  return (
    <div className="admin-section-stack">
      <Panel
        title={label(language, '网站概览', 'Website overview')}
        description={label(language, '集中查看当前发布状态和可管理内容。', 'See publishing status and managed content at a glance.')}
      >
        <div className="admin-metric-grid">
          <article><span>{label(language, '可见商品', 'Visible products')}</span><strong>{visibleProducts}</strong><small>{config.catalog.products.length} {label(language, '个商品', 'total')}</small></article>
          <article><span>{label(language, '首页区块', 'Homepage sections')}</span><strong>{enabledSections}</strong><small>8 {label(language, '个区块', 'total')}</small></article>
          <article><span>{label(language, '启用页面', 'Enabled pages')}</span><strong>{enabledPages}</strong><small>{config.pages.length} {label(language, '个页面', 'total')}</small></article>
          <article><span>{label(language, '存储状态', 'Storage')}</span><strong className={storageConfigured ? 'is-good' : 'is-warning'}>{storageConfigured ? label(language, '已连接', 'Ready') : label(language, '未连接', 'Missing')}</strong><small>Vercel Blob</small></article>
        </div>
      </Panel>
      <Panel title={label(language, '快速管理', 'Quick management')}>
        <div className="admin-quick-grid">
          {(['homepage', 'catalog', 'content', 'customizer', 'media', 'system'] as AdminSection[]).map((section) => {
            const Icon = sectionIcons[section]
            return <button type="button" key={section} onClick={() => onNavigate(section)}><Icon size={24} /><span>{label(language, ...navLabels[section])}</span><small>→</small></button>
          })}
        </div>
      </Panel>
      <Panel title={label(language, '发布信息', 'Publishing information')}>
        <dl className="admin-status-list">
          <div><dt>{label(language, '最近发布', 'Last published')}</dt><dd>{formatDate(config.updatedAt, language)}</dd></div>
          <div><dt>{label(language, '配置版本', 'Configuration version')}</dt><dd>v{config.version}</dd></div>
          <div><dt>{label(language, '后台会话', 'Admin session')}</dt><dd><CheckCircle size={17} weight="fill" />{label(language, '已安全登录', 'Authenticated')}</dd></div>
        </dl>
      </Panel>
    </div>
  )
}

function GlobalSection({ config, language, mutate }: { config: SiteConfig; language: AdminLanguage; mutate: MutateDraft }) {
  const updateGlobal = <K extends keyof SiteConfig['global']>(key: K, value: SiteConfig['global'][K]) => {
    mutate((next) => { next.global[key] = value })
  }
  return (
    <div className="admin-section-stack">
      <Panel title={label(language, '品牌信息', 'Brand identity')} description={label(language, '控制全站页眉、页脚和联系信息。', 'Controls global header, footer, and contact information.')}>
        <div className="admin-field-grid">
          <Field label={label(language, '网站名称', 'Site name')} value={config.global.siteName} onChange={(value) => updateGlobal('siteName', value)} />
          <Field label={label(language, 'Logo 图片地址', 'Logo image URL')} value={config.global.logoUrl} onChange={(value) => updateGlobal('logoUrl', value)} />
          <Field label={label(language, '联系邮箱', 'Contact email')} type="email" value={config.global.contactEmail} onChange={(value) => updateGlobal('contactEmail', value)} />
          <Field label={label(language, '客服邮箱', 'Support email')} type="email" value={config.global.supportEmail} onChange={(value) => updateGlobal('supportEmail', value)} />
          <Field label={label(language, '顶部提示语', 'Utility message')} value={config.global.utilityText} onChange={(value) => updateGlobal('utilityText', value)} />
          <Field label={label(language, '顶部链接文案', 'Utility link label')} value={config.global.utilityLinkLabel} onChange={(value) => updateGlobal('utilityLinkLabel', value)} />
          <Field label={label(language, '顶部链接地址', 'Utility link URL')} value={config.global.utilityLinkHref} onChange={(value) => updateGlobal('utilityLinkHref', value)} />
          <Field label={label(language, '页脚眉题', 'Footer eyebrow')} value={config.global.footerEyebrow} onChange={(value) => updateGlobal('footerEyebrow', value)} />
          <Field label={label(language, '页脚标题', 'Footer title')} multiline value={config.global.footerTitle} onChange={(value) => updateGlobal('footerTitle', value)} help={label(language, '换行会在网站中保留。', 'Line breaks are preserved on the website.')} />
          <Field label={label(language, '页脚标语', 'Footer tagline')} value={config.global.footerTagline} onChange={(value) => updateGlobal('footerTagline', value)} />
        </div>
        <ToggleField label={label(language, '显示邮件订阅表单', 'Show newsletter form')} checked={config.global.newsletterEnabled} onChange={(value) => updateGlobal('newsletterEnabled', value)} />
      </Panel>
      <Panel title={label(language, '主导航', 'Primary navigation')} description={label(language, '修改顺序不在本版本开放；可编辑名称、链接和显示状态。', 'Edit labels, destinations, and visibility. Ordering remains fixed in this version.')}>
        <div className="admin-repeater">
          {config.global.navigation.map((item, index) => (
            <article key={item.id}>
              <span className="admin-repeater__index">{String(index + 1).padStart(2, '0')}</span>
              <Field label={label(language, '名称', 'Label')} value={item.label} onChange={(value) => mutate((next) => { next.global.navigation[index]!.label = value })} />
              <Field label={label(language, '链接', 'Destination')} value={item.href} onChange={(value) => mutate((next) => { next.global.navigation[index]!.href = value })} />
              <ToggleField label={label(language, '显示', 'Visible')} checked={item.enabled} onChange={(value) => mutate((next) => { next.global.navigation[index]!.enabled = value })} />
            </article>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function HomepageSection({ config, language, mutate }: { config: SiteConfig; language: AdminLanguage; mutate: MutateDraft }) {
  const home = config.home
  return (
    <div className="admin-section-stack admin-home-sections">
      <Panel title={label(language, '首页内容', 'Homepage content')} description={label(language, '每个区块都可独立启用，并直接控制线上首页文案与图片。', 'Each section can be enabled independently and controls the live homepage copy and imagery.')}>
        <p className="admin-inline-note">{label(language, '图片可填写 /images/... 或媒体库中的完整 Blob URL。', 'Images can use /images/... paths or full Blob URLs from the media library.')}</p>
      </Panel>

      <details className="admin-editor-group" open>
        <summary><span>01</span>{label(language, '首屏主视觉', 'Hero')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.hero.enabled} onChange={(value) => mutate((next) => { next.home.hero.enabled = value })} /></summary>
        <div className="admin-field-grid">
          <Field label={label(language, '眉题', 'Eyebrow')} value={home.hero.eyebrow} onChange={(value) => mutate((next) => { next.home.hero.eyebrow = value })} />
          <Field label={label(language, '标题第一行', 'Title line 1')} value={home.hero.titleLine1} onChange={(value) => mutate((next) => { next.home.hero.titleLine1 = value })} />
          <Field label={label(language, '标题第二行', 'Title line 2')} value={home.hero.titleLine2} onChange={(value) => mutate((next) => { next.home.hero.titleLine2 = value })} />
          <Field label={label(language, '说明', 'Description')} multiline value={home.hero.copy} onChange={(value) => mutate((next) => { next.home.hero.copy = value })} />
          <Field label={label(language, '背景图片', 'Background image')} value={home.hero.image} onChange={(value) => mutate((next) => { next.home.hero.image = value })} />
          <Field label={label(language, '主按钮文案', 'Primary button')} value={home.hero.primaryLabel} onChange={(value) => mutate((next) => { next.home.hero.primaryLabel = value })} />
          <Field label={label(language, '主按钮链接', 'Primary destination')} value={home.hero.primaryHref} onChange={(value) => mutate((next) => { next.home.hero.primaryHref = value })} />
          <Field label={label(language, '次按钮文案', 'Secondary button')} value={home.hero.secondaryLabel} onChange={(value) => mutate((next) => { next.home.hero.secondaryLabel = value })} />
          <Field label={label(language, '次按钮链接', 'Secondary destination')} value={home.hero.secondaryHref} onChange={(value) => mutate((next) => { next.home.hero.secondaryHref = value })} />
          <Field label={label(language, '向下引导文案', 'Scroll label')} value={home.hero.scrollLabel} onChange={(value) => mutate((next) => { next.home.hero.scrollLabel = value })} />
        </div>
      </details>

      <details className="admin-editor-group">
        <summary><span>02</span>{label(language, '世界入口', 'Worlds')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.worlds.enabled} onChange={(value) => mutate((next) => { next.home.worlds.enabled = value })} /></summary>
        <div className="admin-field-grid">
          <Field label={label(language, '眉题', 'Eyebrow')} value={home.worlds.eyebrow} onChange={(value) => mutate((next) => { next.home.worlds.eyebrow = value })} />
          <Field label={label(language, '标题', 'Title')} value={home.worlds.title} onChange={(value) => mutate((next) => { next.home.worlds.title = value })} />
          <Field label={label(language, '说明', 'Description')} multiline value={home.worlds.copy} onChange={(value) => mutate((next) => { next.home.worlds.copy = value })} />
        </div>
      </details>

      <details className="admin-editor-group">
        <summary><span>03</span>{label(language, '精选系列', 'Featured series')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.featured.enabled} onChange={(value) => mutate((next) => { next.home.featured.enabled = value })} /></summary>
        <div className="admin-field-grid">
          <Field label={label(language, '眉题', 'Eyebrow')} value={home.featured.eyebrow} onChange={(value) => mutate((next) => { next.home.featured.eyebrow = value })} />
          <Field label={label(language, '标题', 'Title')} value={home.featured.title} onChange={(value) => mutate((next) => { next.home.featured.title = value })} />
          <Field label={label(language, '说明', 'Description')} multiline value={home.featured.copy} onChange={(value) => mutate((next) => { next.home.featured.copy = value })} />
          <Field label={label(language, '图片', 'Image')} value={home.featured.image} onChange={(value) => mutate((next) => { next.home.featured.image = value })} />
          <Field label={label(language, '按钮文案', 'Button label')} value={home.featured.ctaLabel} onChange={(value) => mutate((next) => { next.home.featured.ctaLabel = value })} />
          <Field label={label(language, '按钮链接', 'Button destination')} value={home.featured.ctaHref} onChange={(value) => mutate((next) => { next.home.featured.ctaHref = value })} />
          <Field label={label(language, '视觉标记', 'Banner kicker')} value={home.featured.bannerKicker} onChange={(value) => mutate((next) => { next.home.featured.bannerKicker = value })} />
          <Field label={label(language, '视觉标题第一行', 'Banner title line 1')} value={home.featured.bannerTitleLine1} onChange={(value) => mutate((next) => { next.home.featured.bannerTitleLine1 = value })} />
          <Field label={label(language, '视觉标题第二行', 'Banner title line 2')} value={home.featured.bannerTitleLine2} onChange={(value) => mutate((next) => { next.home.featured.bannerTitleLine2 = value })} />
        </div>
      </details>

      <details className="admin-editor-group">
        <summary><span>04</span>{label(language, '四步定制动效', 'Four-step custom motion')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.custom.enabled} onChange={(value) => mutate((next) => { next.home.custom.enabled = value })} /></summary>
        <div className="admin-field-grid">
          <Field label={label(language, '眉题', 'Eyebrow')} value={home.custom.eyebrow} onChange={(value) => mutate((next) => { next.home.custom.eyebrow = value })} />
          <Field label={label(language, '标题第一行', 'Title line 1')} value={home.custom.titleLine1} onChange={(value) => mutate((next) => { next.home.custom.titleLine1 = value })} />
          <Field label={label(language, '标题第二行', 'Title line 2')} value={home.custom.titleLine2} onChange={(value) => mutate((next) => { next.home.custom.titleLine2 = value })} />
          <Field label={label(language, '说明', 'Description')} multiline value={home.custom.copy} onChange={(value) => mutate((next) => { next.home.custom.copy = value })} />
          <Field label={label(language, '球衣图片', 'Jersey image')} value={home.custom.image} onChange={(value) => mutate((next) => { next.home.custom.image = value })} />
          <Field label={label(language, '按钮文案', 'Button label')} value={home.custom.ctaLabel} onChange={(value) => mutate((next) => { next.home.custom.ctaLabel = value })} />
          <Field label={label(language, '按钮链接', 'Button destination')} value={home.custom.ctaHref} onChange={(value) => mutate((next) => { next.home.custom.ctaHref = value })} />
        </div>
        <div className="admin-repeater admin-repeater--steps">
          {home.custom.steps.map((step, index) => (
            <article key={index}>
              <span className="admin-repeater__index">0{index + 1}</span>
              <Field label={label(language, '步骤名称', 'Step label')} value={step.label} onChange={(value) => mutate((next) => { next.home.custom.steps[index]!.label = value })} />
              <Field label={label(language, '步骤说明', 'Step description')} value={step.copy} onChange={(value) => mutate((next) => { next.home.custom.steps[index]!.copy = value })} />
              <Field label={label(language, '状态分类', 'Status kicker')} value={step.kicker} onChange={(value) => mutate((next) => { next.home.custom.steps[index]!.kicker = value })} />
              <Field label={label(language, '状态内容', 'Status value')} value={step.status} onChange={(value) => mutate((next) => { next.home.custom.steps[index]!.status = value })} />
            </article>
          ))}
        </div>
      </details>

      <details className="admin-editor-group">
        <summary><span>05</span>{label(language, '工艺故事', 'Craftsmanship story')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.craftsmanship.enabled} onChange={(value) => mutate((next) => { next.home.craftsmanship.enabled = value })} /></summary>
        <div className="admin-field-grid">
          <Field label={label(language, '眉题', 'Eyebrow')} value={home.craftsmanship.eyebrow} onChange={(value) => mutate((next) => { next.home.craftsmanship.eyebrow = value })} />
          <Field label={label(language, '标题', 'Title')} value={home.craftsmanship.title} onChange={(value) => mutate((next) => { next.home.craftsmanship.title = value })} />
          <Field label={label(language, '说明', 'Description')} multiline value={home.craftsmanship.copy} onChange={(value) => mutate((next) => { next.home.craftsmanship.copy = value })} />
          <Field label={label(language, '图片', 'Image')} value={home.craftsmanship.image} onChange={(value) => mutate((next) => { next.home.craftsmanship.image = value })} />
          <Field label={label(language, '按钮文案', 'Button label')} value={home.craftsmanship.ctaLabel} onChange={(value) => mutate((next) => { next.home.craftsmanship.ctaLabel = value })} />
          <Field label={label(language, '按钮链接', 'Button destination')} value={home.craftsmanship.ctaHref} onChange={(value) => mutate((next) => { next.home.craftsmanship.ctaHref = value })} />
        </div>
      </details>

      <details className="admin-editor-group">
        <summary><span>06</span>{label(language, '品牌承诺', 'Brand promises')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.promises.enabled} onChange={(value) => mutate((next) => { next.home.promises.enabled = value })} /></summary>
        <Field label={label(language, '区块标题', 'Section title')} value={home.promises.title} onChange={(value) => mutate((next) => { next.home.promises.title = value })} />
        <div className="admin-repeater admin-repeater--steps">
          {home.promises.items.map((item, index) => (
            <article key={index}>
              <span className="admin-repeater__index">0{index + 1}</span>
              <Field label={label(language, '标题', 'Title')} value={item.title} onChange={(value) => mutate((next) => { next.home.promises.items[index]!.title = value })} />
              <Field label={label(language, '说明', 'Description')} multiline value={item.copy} onChange={(value) => mutate((next) => { next.home.promises.items[index]!.copy = value })} />
            </article>
          ))}
        </div>
      </details>

      <details className="admin-editor-group">
        <summary><span>07</span>{label(language, '故事列表', 'Stories section')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.stories.enabled} onChange={(value) => mutate((next) => { next.home.stories.enabled = value })} /></summary>
        <div className="admin-field-grid">
          <Field label={label(language, '眉题', 'Eyebrow')} value={home.stories.eyebrow} onChange={(value) => mutate((next) => { next.home.stories.eyebrow = value })} />
          <Field label={label(language, '标题', 'Title')} value={home.stories.title} onChange={(value) => mutate((next) => { next.home.stories.title = value })} />
          <Field label={label(language, '链接文案', 'Link label')} value={home.stories.ctaLabel} onChange={(value) => mutate((next) => { next.home.stories.ctaLabel = value })} />
        </div>
      </details>

      <details className="admin-editor-group">
        <summary><span>08</span>{label(language, '社区横幅', 'Community banner')}<ToggleField label={label(language, '启用', 'Enabled')} checked={home.community.enabled} onChange={(value) => mutate((next) => { next.home.community.enabled = value })} /></summary>
        <div className="admin-field-grid">
          <Field label={label(language, '眉题', 'Eyebrow')} value={home.community.eyebrow} onChange={(value) => mutate((next) => { next.home.community.eyebrow = value })} />
          <Field label={label(language, '标题', 'Title')} value={home.community.title} onChange={(value) => mutate((next) => { next.home.community.title = value })} />
          <Field label={label(language, '说明', 'Description')} multiline value={home.community.copy} onChange={(value) => mutate((next) => { next.home.community.copy = value })} />
          <Field label={label(language, '图片', 'Image')} value={home.community.image} onChange={(value) => mutate((next) => { next.home.community.image = value })} />
          <Field label={label(language, '按钮文案', 'Button label')} value={home.community.ctaLabel} onChange={(value) => mutate((next) => { next.home.community.ctaLabel = value })} />
          <Field label={label(language, '按钮链接', 'Button destination')} value={home.community.ctaHref} onChange={(value) => mutate((next) => { next.home.community.ctaHref = value })} />
        </div>
      </details>
    </div>
  )
}

type CatalogKind = keyof SiteConfig['catalog']

function patchCatalogItem(mutate: MutateDraft, kind: CatalogKind, index: number, patch: Record<string, unknown>) {
  mutate((next) => {
    const collection = next.catalog[kind] as unknown as Array<Record<string, unknown>>
    Object.assign(collection[index]!, patch)
  })
}

function CatalogSection({ config, language, mutate }: { config: SiteConfig; language: AdminLanguage; mutate: MutateDraft }) {
  const [kind, setKind] = useState<CatalogKind>('products')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const collection = config.catalog[kind]
  const index = Math.min(selectedIndex, Math.max(collection.length - 1, 0))
  const item = collection[index]
  const options = collection.map((entry, entryIndex) => ({
    value: String(entryIndex),
    label: 'name' in entry ? entry.name : entry.title,
  }))

  return (
    <div className="admin-section-stack">
      <Panel title={label(language, '目录与商品', 'Catalog & products')} description={label(language, '管理世界、系列、商品和故事。Slug 作为稳定网址不可在后台修改。', 'Manage worlds, series, products, and stories. Slugs remain fixed as stable URLs.')}>
        <div className="admin-tab-row" role="tablist" aria-label={label(language, '目录类型', 'Catalog type')}>
          {(['products', 'series', 'worlds', 'stories'] as CatalogKind[]).map((value) => (
            <button type="button" role="tab" aria-selected={kind === value} className={kind === value ? 'is-active' : ''} key={value} onClick={() => { setKind(value); setSelectedIndex(0) }}>
              {label(language, ({ products: '商品', series: '系列', worlds: '世界', stories: '故事' })[value], ({ products: 'Products', series: 'Series', worlds: 'Worlds', stories: 'Stories' })[value])}
              <span>{config.catalog[value].length}</span>
            </button>
          ))}
        </div>
        {item ? (
          <>
            <div className="admin-catalog-picker">
              <SelectField label={label(language, '选择项目', 'Select item')} value={String(index)} options={options} onChange={(value) => setSelectedIndex(Number(value))} />
              <p><span>Slug</span><code>{item.slug}</code></p>
            </div>
            <div className="admin-field-grid">
              <ToggleField label={label(language, '在网站显示', 'Visible on website')} checked={item.visible} onChange={(value) => patchCatalogItem(mutate, kind, index, { visible: value })} />
              {kind === 'products' && 'featured' in item ? <ToggleField label={label(language, '设为精选商品', 'Featured product')} checked={item.featured} onChange={(value) => patchCatalogItem(mutate, kind, index, { featured: value })} /> : null}
              {'name' in item ? <Field label={label(language, '名称', 'Name')} value={item.name} onChange={(value) => patchCatalogItem(mutate, kind, index, { name: value })} /> : null}
              {'title' in item ? <Field label={label(language, '标题', 'Title')} value={item.title} onChange={(value) => patchCatalogItem(mutate, kind, index, { title: value })} /> : null}
              {'eyebrow' in item ? <Field label={label(language, '眉题', 'Eyebrow')} value={item.eyebrow} onChange={(value) => patchCatalogItem(mutate, kind, index, { eyebrow: value })} /> : null}
              {'statement' in item ? <Field label={label(language, '主张', 'Statement')} value={item.statement} onChange={(value) => patchCatalogItem(mutate, kind, index, { statement: value })} /> : null}
              {'description' in item ? <Field label={label(language, '说明', 'Description')} multiline value={item.description} onChange={(value) => patchCatalogItem(mutate, kind, index, { description: value })} /> : null}
              {'copy' in item ? <Field label={label(language, '说明', 'Description')} multiline value={item.copy} onChange={(value) => patchCatalogItem(mutate, kind, index, { copy: value })} /> : null}
              {'excerpt' in item ? <Field label={label(language, '摘要', 'Excerpt')} multiline value={item.excerpt} onChange={(value) => patchCatalogItem(mutate, kind, index, { excerpt: value })} /> : null}
              {'image' in item ? <Field label={label(language, '主图地址', 'Primary image URL')} value={item.image} onChange={(value) => patchCatalogItem(mutate, kind, index, { image: value })} /> : null}
              {'category' in item ? <Field label={label(language, '分类', 'Category')} value={item.category} onChange={(value) => patchCatalogItem(mutate, kind, index, { category: value })} /> : null}
              {'readTime' in item ? <Field label={label(language, '阅读时间', 'Read time')} value={item.readTime} onChange={(value) => patchCatalogItem(mutate, kind, index, { readTime: value })} /> : null}
              {'statusLabel' in item ? <Field label={label(language, '状态文案', 'Status label')} value={item.statusLabel} onChange={(value) => patchCatalogItem(mutate, kind, index, { statusLabel: value })} /> : null}
              {'availability' in item ? <SelectField label={label(language, '可用状态', 'Availability')} value={item.availability} options={[
                { value: 'live', label: label(language, '已上线', 'Live') },
                { value: 'rights-review', label: label(language, '版权审核', 'Rights review') },
                { value: 'coming-soon', label: label(language, '即将推出', 'Coming soon') },
              ]} onChange={(value) => patchCatalogItem(mutate, kind, index, { availability: value })} /> : null}
              {'tone' in item ? <SelectField label={label(language, '视觉色调', 'Visual tone')} value={item.tone} options={[
                { value: 'dark', label: label(language, '深色', 'Dark') },
                { value: 'light', label: label(language, '浅色', 'Light') },
                { value: 'blue', label: label(language, '蓝色', 'Blue') },
              ]} onChange={(value) => patchCatalogItem(mutate, kind, index, { tone: value })} /> : null}
              {'designLanguage' in item ? <Field label={label(language, '设计语言', 'Design language')} multiline value={item.designLanguage} onChange={(value) => patchCatalogItem(mutate, kind, index, { designLanguage: value })} /> : null}
              {'craftDirection' in item ? <Field label={label(language, '工艺方向', 'Craft direction')} multiline value={item.craftDirection} onChange={(value) => patchCatalogItem(mutate, kind, index, { craftDirection: value })} /> : null}
              {'series' in item ? <SelectField label={label(language, '所属系列', 'Series')} value={item.series} options={config.catalog.series.map((series) => ({ value: series.slug, label: series.name }))} onChange={(value) => patchCatalogItem(mutate, kind, index, { series: value })} /> : null}
              {'color' in item ? <Field label={label(language, '颜色', 'Color')} value={item.color} onChange={(value) => patchCatalogItem(mutate, kind, index, { color: value })} /> : null}
              {'badge' in item ? <Field label={label(language, '徽标文案', 'Badge')} value={item.badge ?? ''} onChange={(value) => patchCatalogItem(mutate, kind, index, { badge: value })} /> : null}
              {'personalizable' in item ? <ToggleField label={label(language, '允许定制', 'Personalizable')} checked={Boolean(item.personalizable)} onChange={(value) => patchCatalogItem(mutate, kind, index, { personalizable: value })} /> : null}
              {'theme' in item ? <Field label={label(language, '主题', 'Theme')} value={item.theme} onChange={(value) => patchCatalogItem(mutate, kind, index, { theme: value })} /> : null}
              {'story' in item ? <Field label={label(language, '产品故事', 'Product story')} multiline value={item.story} onChange={(value) => patchCatalogItem(mutate, kind, index, { story: value })} /> : null}
              {'design' in item ? <Field label={label(language, '设计说明', 'Design notes')} multiline value={item.design} onChange={(value) => patchCatalogItem(mutate, kind, index, { design: value })} /> : null}
              {'craft' in item ? <Field label={label(language, '工艺说明', 'Craft notes')} multiline value={item.craft} onChange={(value) => patchCatalogItem(mutate, kind, index, { craft: value })} /> : null}
              {'connection' in item ? <Field label={label(language, '定制关联', 'Customization connection')} multiline value={item.connection} onChange={(value) => patchCatalogItem(mutate, kind, index, { connection: value })} /> : null}
            </div>
            {kind === 'products' ? (
              <div className="admin-price-editor">
                <SelectField label={label(language, '价格状态', 'Price status')} value={config.catalog.products[index]!.price.status} options={[
                  { value: 'tbd', label: label(language, '待确认', 'TBD') },
                  { value: 'confirmed', label: label(language, '已确认', 'Confirmed') },
                ]} onChange={(value) => mutate((next) => {
                  const product = next.catalog.products[index]!
                  product.price = value === 'confirmed' ? { status: 'confirmed', amount: 0, currency: 'USD' } : { status: 'tbd' }
                })} />
                {config.catalog.products[index]!.price.status === 'confirmed' ? <Field label={label(language, '价格（USD）', 'Price (USD)')} type="number" min={0} value={config.catalog.products[index]!.price.amount} onChange={(value) => mutate((next) => {
                  const product = next.catalog.products[index]!
                  if (product.price.status === 'confirmed') product.price.amount = Math.max(0, Number(value) || 0)
                })} /> : null}
              </div>
            ) : null}
          </>
        ) : <p>{label(language, '没有可编辑项目。', 'No items to edit.')}</p>}
      </Panel>
    </div>
  )
}

function ContentSection({ config, language, mutate }: { config: SiteConfig; language: AdminLanguage; mutate: MutateDraft }) {
  const [pageIndex, setPageIndex] = useState(0)
  const [policyIndex, setPolicyIndex] = useState(0)
  const page = config.pages[Math.min(pageIndex, config.pages.length - 1)]!
  const policy = config.policies[Math.min(policyIndex, config.policies.length - 1)]!
  return (
    <div className="admin-section-stack">
      <Panel title={label(language, '内容页面', 'Content pages')} description={label(language, '编辑全站各页面的顶部内容、主图和启用状态。', 'Edit page introductions, hero imagery, and availability across the site.')}>
        <div className="admin-catalog-picker">
          <SelectField label={label(language, '选择页面', 'Select page')} value={String(pageIndex)} options={config.pages.map((item, index) => ({ value: String(index), label: `${item.label} · ${item.route}` }))} onChange={(value) => setPageIndex(Number(value))} />
          <p><span>{label(language, '路由', 'Route')}</span><code>{page.route}</code></p>
        </div>
        <div className="admin-field-grid">
          <ToggleField label={label(language, '启用页面', 'Page enabled')} checked={page.enabled} onChange={(value) => mutate((next) => { next.pages[pageIndex]!.enabled = value })} />
          <Field label={label(language, '后台名称', 'Admin label')} value={page.label} onChange={(value) => mutate((next) => { next.pages[pageIndex]!.label = value })} />
          <Field label={label(language, '眉题', 'Eyebrow')} value={page.eyebrow} onChange={(value) => mutate((next) => { next.pages[pageIndex]!.eyebrow = value })} />
          <Field label={label(language, '标题', 'Title')} value={page.title} onChange={(value) => mutate((next) => { next.pages[pageIndex]!.title = value })} />
          <Field label={label(language, '说明', 'Description')} multiline value={page.description} onChange={(value) => mutate((next) => { next.pages[pageIndex]!.description = value })} />
          <Field label={label(language, '主图地址', 'Hero image URL')} value={page.image} onChange={(value) => mutate((next) => { next.pages[pageIndex]!.image = value })} />
        </div>
      </Panel>
      <Panel title={label(language, '政策与法律页面', 'Policies & legal pages')} description={label(language, '政策文本发布前仍应由运营与法律团队确认。', 'Policy copy should still be approved by operations and counsel before publishing.')}>
        <div className="admin-catalog-picker">
          <SelectField label={label(language, '选择政策', 'Select policy')} value={String(policyIndex)} options={config.policies.map((item, index) => ({ value: String(index), label: `${item.title} · ${item.slug}` }))} onChange={(value) => setPolicyIndex(Number(value))} />
          <p><span>Slug</span><code>{policy.slug}</code></p>
        </div>
        <div className="admin-field-grid">
          <ToggleField label={label(language, '启用政策页面', 'Policy page enabled')} checked={policy.enabled} onChange={(value) => mutate((next) => { next.policies[policyIndex]!.enabled = value })} />
          <Field label={label(language, '标题', 'Title')} value={policy.title} onChange={(value) => mutate((next) => { next.policies[policyIndex]!.title = value })} />
          <Field label={label(language, '导言', 'Introduction')} multiline value={policy.intro} onChange={(value) => mutate((next) => { next.policies[policyIndex]!.intro = value })} />
        </div>
        <div className="admin-repeater admin-repeater--policy">
          {policy.sections.map((section, sectionIndex) => (
            <article key={sectionIndex}>
              <span className="admin-repeater__index">{String(sectionIndex + 1).padStart(2, '0')}</span>
              <Field label={label(language, '小节标题', 'Section title')} value={section.title} onChange={(value) => mutate((next) => { next.policies[policyIndex]!.sections[sectionIndex]!.title = value })} />
              <Field label={label(language, '小节内容', 'Section copy')} multiline value={section.copy} onChange={(value) => mutate((next) => { next.policies[policyIndex]!.sections[sectionIndex]!.copy = value })} />
              {policy.sections.length > 1 ? <button className="admin-text-button admin-text-button--danger" type="button" onClick={() => mutate((next) => { next.policies[policyIndex]!.sections.splice(sectionIndex, 1) })}>{label(language, '删除小节', 'Remove section')}</button> : null}
            </article>
          ))}
        </div>
        <button className="button button--outline" type="button" onClick={() => mutate((next) => { next.policies[policyIndex]!.sections.push({ title: label(language, '新小节', 'New section'), copy: '' }) })}>+ {label(language, '添加小节', 'Add section')}</button>
      </Panel>
    </div>
  )
}

function CustomizerSection({ config, language, mutate }: { config: SiteConfig; language: AdminLanguage; mutate: MutateDraft }) {
  return (
    <div className="admin-section-stack">
      <Panel title={label(language, '定制功能设置', 'Customizer settings')} description={label(language, '控制定制页面可以使用的字段、Logo 规则和免责声明。', 'Control available fields, logo limits, and the legal notice in the customizer.')}>
        <div className="admin-toggle-grid">
          <ToggleField label={label(language, '启用定制器', 'Customizer enabled')} checked={config.customizer.enabled} onChange={(value) => mutate((next) => { next.customizer.enabled = value })} />
          <ToggleField label={label(language, '城市名称', 'City name')} checked={config.customizer.cityEnabled} onChange={(value) => mutate((next) => { next.customizer.cityEnabled = value })} />
          <ToggleField label={label(language, '球员名字', 'Player name')} checked={config.customizer.playerNameEnabled} onChange={(value) => mutate((next) => { next.customizer.playerNameEnabled = value })} />
          <ToggleField label={label(language, '号码', 'Number')} checked={config.customizer.numberEnabled} onChange={(value) => mutate((next) => { next.customizer.numberEnabled = value })} />
          <ToggleField label={label(language, '正面 Logo', 'Front logo')} checked={config.customizer.frontLogoEnabled} onChange={(value) => mutate((next) => { next.customizer.frontLogoEnabled = value })} />
          <ToggleField label={label(language, '左右衣袖 Logo', 'Sleeve logos')} checked={config.customizer.sleeveLogosEnabled} onChange={(value) => mutate((next) => { next.customizer.sleeveLogosEnabled = value })} />
        </div>
        <div className="admin-field-grid">
          <Field label={label(language, 'Logo 最大文件（MB）', 'Maximum logo file (MB)')} type="number" min={1} max={10} value={config.customizer.maxLogoSizeMb} onChange={(value) => mutate((next) => { next.customizer.maxLogoSizeMb = Math.min(10, Math.max(1, Number(value) || 1)) })} />
          <Field label={label(language, '免责声明标题', 'Disclaimer title')} value={config.customizer.disclaimerTitle} onChange={(value) => mutate((next) => { next.customizer.disclaimerTitle = value })} />
          <Field label={label(language, '免责声明内容', 'Disclaimer copy')} multiline value={config.customizer.disclaimer} onChange={(value) => mutate((next) => { next.customizer.disclaimer = value })} />
        </div>
      </Panel>
      <CustomizerAdminPage language={language} embedded />
    </div>
  )
}

function MediaSection({ language }: { language: AdminLanguage }) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const loadMedia = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin-media', { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      if (!response.ok) throw new Error(await responseError(response))
      const payload = await response.json() as { media?: MediaItem[] }
      setMedia(payload.media ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : label(language, '媒体库加载失败。', 'The media library could not be loaded.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadMedia() }, [])

  const upload = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const response = await fetch('/api/admin-media', {
        method: 'POST',
        headers: { 'Content-Type': file.type, 'X-File-Name': file.name },
        credentials: 'same-origin',
        body: file,
      })
      if (!response.ok) throw new Error(await responseError(response))
      const payload = await response.json() as { image: MediaItem }
      setMedia((current) => [payload.image, ...current])
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : label(language, '图片上传失败。', 'The image could not be uploaded.'))
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    window.setTimeout(() => setCopied(''), 1800)
  }

  return (
    <Panel
      title={label(language, '媒体库', 'Media library')}
      description={label(language, '上传网站主图和内容图片。复制 URL 后可粘贴到任意图片字段。', 'Upload content imagery, then copy its URL into any image field.')}
      actions={<label className="button button--dark admin-media-upload"><UploadSimple size={18} />{uploading ? label(language, '上传中…', 'Uploading…') : label(language, '上传图片', 'Upload image')}<input name="admin-media-image" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => void upload(event.target.files?.[0])} /></label>}
    >
      {error ? <p className="admin-message admin-message--error" role="alert"><WarningCircle size={18} />{error}</p> : null}
      {loading ? <p className="admin-loading-line">{label(language, '正在载入媒体…', 'Loading media…')}</p> : null}
      {!loading && !media.length ? <div className="admin-empty"><Images size={36} /><h3>{label(language, '媒体库为空', 'No media yet')}</h3><p>{label(language, '上传第一张图片开始使用。', 'Upload your first image to get started.')}</p></div> : null}
      <div className="admin-media-grid">
        {media.map((item) => (
          <article key={item.pathname}>
            <img src={item.url} alt="" loading="lazy" width="800" height="800" />
            <div><strong>{item.pathname.replace('cms/media/', '')}</strong><small>{Math.max(1, Math.round(item.size / 1024))} KB · {formatDate(item.uploadedAt, language)}</small></div>
            <button type="button" onClick={() => void copyUrl(item.url)}>{copied === item.url ? label(language, '已复制', 'Copied') : label(language, '复制 URL', 'Copy URL')}</button>
          </article>
        ))}
      </div>
    </Panel>
  )
}

function CommerceSection({ config, language, mutate }: { config: SiteConfig; language: AdminLanguage; mutate: MutateDraft }) {
  return (
    <div className="admin-section-stack">
      <Panel title={label(language, '商务功能', 'Commerce controls')} description={label(language, '这些开关决定网站是否显示价格、结账入口、团队表单和订单追踪。', 'These controls determine whether prices, checkout, team briefs, and tracking appear on the website.')}>
        <div className="admin-toggle-grid">
          <ToggleField label={label(language, '显示商品价格', 'Display product prices')} checked={config.commerce.displayPrices} onChange={(value) => mutate((next) => { next.commerce.displayPrices = value })} />
          <ToggleField label={label(language, '启用结账入口', 'Checkout enabled')} checked={config.commerce.checkoutEnabled} onChange={(value) => mutate((next) => { next.commerce.checkoutEnabled = value })} help={label(language, '当前仍是非交易型演示流程。', 'The current flow remains non-transactional.')} />
          <ToggleField label={label(language, '启用订单追踪', 'Order tracking enabled')} checked={config.commerce.orderTrackingEnabled} onChange={(value) => mutate((next) => { next.commerce.orderTrackingEnabled = value })} />
          <ToggleField label={label(language, '启用团队需求表单', 'Team brief enabled')} checked={config.commerce.teamBriefEnabled} onChange={(value) => mutate((next) => { next.commerce.teamBriefEnabled = value })} />
        </div>
        <div className="admin-field-grid">
          <Field label={label(language, '配送费用文案', 'Shipping label')} value={config.commerce.shippingLabel} onChange={(value) => mutate((next) => { next.commerce.shippingLabel = value })} />
          <Field label={label(language, '税费文案', 'Tax label')} value={config.commerce.taxLabel} onChange={(value) => mutate((next) => { next.commerce.taxLabel = value })} />
          <SelectField label={label(language, '货币（当前固定）', 'Currency (currently fixed)')} value={config.commerce.currency} options={[{ value: 'USD', label: 'USD' }]} onChange={() => undefined} />
        </div>
      </Panel>
      <Panel title={label(language, '集成状态', 'Integration status')}>
        <div className="admin-integration-list">
          <article><span className="is-warning" /><div><strong>{label(language, '支付', 'Payments')}</strong><p>{label(language, '尚未连接支付服务；后台不会收款。', 'No payment provider is connected; the site cannot collect payment.')}</p></div><small>{label(language, '待接入', 'Not connected')}</small></article>
          <article><span className="is-warning" /><div><strong>{label(language, '订单与履约', 'Orders & fulfillment')}</strong><p>{label(language, '追踪页面仍等待真实订单 API。', 'Tracking still awaits a production order API.')}</p></div><small>{label(language, '待接入', 'Not connected')}</small></article>
          <article><span className="is-good" /><div><strong>Vercel Blob</strong><p>{label(language, '站点配置和媒体资源使用同一项目存储。', 'Site configuration and media use the project Blob store.')}</p></div><small>{label(language, '已连接', 'Connected')}</small></article>
        </div>
      </Panel>
    </div>
  )
}

function SystemSection({ config, language, mutate }: { config: SiteConfig; language: AdminLanguage; mutate: MutateDraft }) {
  return (
    <div className="admin-section-stack">
      <Panel title="SEO" description={label(language, '设置全站默认搜索标题、描述和分享图片。', 'Set default search metadata and social sharing imagery.')}>
        <div className="admin-field-grid">
          <Field label={label(language, '默认页面标题', 'Default page title')} value={config.seo.defaultTitle} onChange={(value) => mutate((next) => { next.seo.defaultTitle = value })} />
          <Field label={label(language, '默认描述', 'Default description')} multiline value={config.seo.defaultDescription} onChange={(value) => mutate((next) => { next.seo.defaultDescription = value })} />
          <Field label={label(language, '分享图片', 'Social image')} value={config.seo.ogImage} onChange={(value) => mutate((next) => { next.seo.ogImage = value })} />
          <ToggleField label={label(language, '允许搜索引擎收录', 'Allow search indexing')} checked={config.seo.robotsIndex} onChange={(value) => mutate((next) => { next.seo.robotsIndex = value })} />
        </div>
      </Panel>
      <Panel title={label(language, '系统状态', 'System status')} description={label(language, '维护模式发布后会隐藏公开网站，但后台仍可登录。', 'Maintenance mode hides the public website after publishing while keeping the admin accessible.')}>
        <ToggleField label={label(language, '开启维护模式', 'Enable maintenance mode')} checked={config.system.maintenanceMode} onChange={(value) => mutate((next) => { next.system.maintenanceMode = value })} help={label(language, '发布前请确认，开启后访客只会看到维护页面。', 'Confirm before publishing: visitors will only see the maintenance screen.')} />
        <div className="admin-field-grid">
          <Field label={label(language, '维护页标题', 'Maintenance title')} value={config.system.maintenanceTitle} onChange={(value) => mutate((next) => { next.system.maintenanceTitle = value })} />
          <Field label={label(language, '维护页说明', 'Maintenance message')} multiline value={config.system.maintenanceMessage} onChange={(value) => mutate((next) => { next.system.maintenanceMessage = value })} />
        </div>
      </Panel>
    </div>
  )
}

export function AdminPage() {
  const [params, setParams] = useSearchParams()
  const requestedSection = params.get('section') as AdminSection | null
  const section = requestedSection && sectionIds.includes(requestedSection) ? requestedSection : 'dashboard'
  const [language, setLanguage] = useState<AdminLanguage>(() => localStorage.getItem('we-admin-language') === 'en' ? 'en' : 'zh')
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [published, setPublished] = useState<SiteConfig | null>(null)
  const [draft, setDraft] = useState<SiteConfig | null>(null)
  const [adminConfigured, setAdminConfigured] = useState<boolean | null>(null)
  const [storageConfigured, setStorageConfigured] = useState(false)
  const [loginBusy, setLoginBusy] = useState(false)
  const [publishBusy, setPublishBusy] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const changeLanguage = (nextLanguage: AdminLanguage) => {
    setLanguage(nextLanguage)
    localStorage.setItem('we-admin-language', nextLanguage)
  }

  const applyPayload = (payload: AdminPayload) => {
    setAdminConfigured(payload.adminConfigured ?? true)
    setStorageConfigured(Boolean(payload.storageConfigured))
    if (payload.config) {
      const config = normalizeSiteConfig(payload.config)
      setPublished(config)
      setDraft(structuredClone(config))
    }
  }

  useEffect(() => {
    let active = true
    const checkSession = async () => {
      try {
        const response = await fetch('/api/site-config?admin=1', {
          headers: { Accept: 'application/json' },
          credentials: 'same-origin',
          cache: 'no-store',
        })
        const payload = response.headers.get('content-type')?.includes('application/json')
          ? await response.json() as AdminPayload
          : {}
        if (!active) return
        setAdminConfigured(payload.adminConfigured ?? null)
        setStorageConfigured(Boolean(payload.storageConfigured))
        if (response.status === 401) {
          setAuthState('guest')
          return
        }
        if (!response.ok) throw new Error(payload.error ?? `HTTP ${response.status}`)
        applyPayload(payload)
        setAuthState('authenticated')
      } catch (sessionError) {
        if (!active) return
        setAuthState('guest')
        setError(sessionError instanceof Error ? sessionError.message : label(language, '无法连接后台接口。', 'The admin API could not be reached.'))
      }
    }
    void checkSession()
    return () => { active = false }
  }, [])

  const hasChanges = useMemo(() => Boolean(draft && published && JSON.stringify(draft) !== JSON.stringify(published)), [draft, published])

  useEffect(() => {
    if (!hasChanges) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [hasChanges])

  const login = async (password: string) => {
    setLoginBusy(true)
    setError('')
    try {
      const response = await fetch('/api/site-config?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      })
      if (!response.ok) throw new Error(await responseError(response))
      const payload = await response.json() as AdminPayload
      applyPayload(payload)
      setAuthState('authenticated')
      setStatus(label(language, '登录成功。', 'Signed in.'))
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : label(language, '登录失败。', 'Sign-in failed.'))
    } finally {
      setLoginBusy(false)
    }
  }

  const logout = async () => {
    if (hasChanges && !window.confirm(label(language, '未发布的修改将丢失，确定退出吗？', 'Unpublished changes will be lost. Sign out?'))) return
    await fetch('/api/site-config?action=logout', { method: 'POST', credentials: 'same-origin' })
    setAuthState('guest')
    setPublished(null)
    setDraft(null)
    setStatus('')
  }

  const mutate: MutateDraft = (mutation) => {
    setDraft((current) => {
      if (!current) return current
      const next = structuredClone(current)
      mutation(next)
      return next
    })
    setError('')
    setStatus('')
  }

  const publish = async () => {
    if (!draft) return
    if (!draft.global.siteName.trim() || !draft.seo.defaultTitle.trim()) {
      setError(label(language, '网站名称和 SEO 默认标题不能为空。', 'Site name and the default SEO title are required.'))
      return
    }
    setPublishBusy(true)
    setError('')
    setStatus('')
    try {
      const response = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(draft),
      })
      if (!response.ok) throw new Error(await responseError(response))
      const payload = await response.json() as { config: unknown }
      const config = normalizeSiteConfig(payload.config)
      setPublished(config)
      setDraft(structuredClone(config))
      setStatus(label(language, '已发布。网站刷新后将读取新配置。', 'Published. The website will use the new configuration on refresh.'))
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : label(language, '发布失败。', 'Publishing failed.'))
    } finally {
      setPublishBusy(false)
    }
  }

  const reset = () => {
    if (!published || !hasChanges) return
    if (!window.confirm(label(language, '放弃所有未发布修改？', 'Discard all unpublished changes?'))) return
    setDraft(structuredClone(published))
    setStatus(label(language, '已恢复到最近发布版本。', 'Restored to the last published version.'))
  }

  const navigate = (nextSection: AdminSection) => {
    setParams(nextSection === 'dashboard' ? {} : { section: nextSection }, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (authState !== 'authenticated' || !draft) {
    return <LoginScreen language={language} onLanguageChange={changeLanguage} onLogin={login} checking={authState === 'checking' || loginBusy} error={error} adminConfigured={adminConfigured} />
  }

  const content = {
    dashboard: <DashboardSection config={draft} language={language} storageConfigured={storageConfigured} onNavigate={navigate} />,
    global: <GlobalSection config={draft} language={language} mutate={mutate} />,
    homepage: <HomepageSection config={draft} language={language} mutate={mutate} />,
    catalog: <CatalogSection config={draft} language={language} mutate={mutate} />,
    content: <ContentSection config={draft} language={language} mutate={mutate} />,
    customizer: <CustomizerSection config={draft} language={language} mutate={mutate} />,
    media: <MediaSection language={language} />,
    commerce: <CommerceSection config={draft} language={language} mutate={mutate} />,
    system: <SystemSection config={draft} language={language} mutate={mutate} />,
  }[section]

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-sidebar__brand" to="/" target="_blank" rel="noreferrer">
          <img src="/images/we-logo.svg" alt="WE" width="307" height="195" />
          <span>ADMIN</span>
        </Link>
        <nav aria-label={label(language, '后台导航', 'Admin navigation')}>
          {sectionIds.map((item) => {
            const Icon = sectionIcons[item]
            return <button type="button" key={item} className={section === item ? 'is-active' : ''} aria-current={section === item ? 'page' : undefined} onClick={() => navigate(item)}><Icon size={20} /><span>{label(language, ...navLabels[item])}</span></button>
          })}
        </nav>
        <div className="admin-sidebar__bottom">
          <a href="/" target="_blank" rel="noreferrer"><ArrowSquareOut size={19} />{label(language, '查看网站', 'View website')}</a>
          <button type="button" onClick={() => void logout()}><SignOut size={19} />{label(language, '退出登录', 'Sign out')}</button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">WE / ADMIN</p>
            <h1>{label(language, ...navLabels[section])}</h1>
          </div>
          <div className="admin-topbar__actions">
            <div className="admin-language" aria-label={label(language, '后台语言', 'Admin language')}>
              <button type="button" className={language === 'zh' ? 'is-active' : ''} onClick={() => changeLanguage('zh')}>中文</button>
              <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => changeLanguage('en')}>EN</button>
            </div>
            <button className="admin-reset" type="button" disabled={!hasChanges || publishBusy} onClick={reset}><ArrowClockwise size={18} />{label(language, '撤销修改', 'Reset')}</button>
            <button className="button button--dark" type="button" disabled={!hasChanges || publishBusy || !storageConfigured} onClick={() => void publish()}><FloppyDisk size={18} />{publishBusy ? label(language, '发布中…', 'Publishing…') : label(language, '发布更改', 'Publish changes')}</button>
          </div>
        </header>
        <div className="admin-publish-bar" data-dirty={hasChanges}>
          <span>{hasChanges ? label(language, '有未发布的修改', 'Unpublished changes') : label(language, '已与线上版本同步', 'Synced with published version')}</span>
          <small>{formatDate(draft.updatedAt, language)}</small>
        </div>
        <main className="admin-content">
          {!storageConfigured ? <p className="admin-message admin-message--error"><WarningCircle size={18} />{label(language, 'Vercel Blob 未连接，暂时无法发布配置或上传媒体。', 'Vercel Blob is not connected, so configuration and media cannot be published.')}</p> : null}
          {error ? <p className="admin-message admin-message--error" role="alert"><WarningCircle size={18} />{error}</p> : null}
          {status ? <p className="admin-message admin-message--success" role="status"><CheckCircle size={18} weight="fill" />{status}</p> : null}
          {content}
        </main>
      </div>
    </div>
  )
}
