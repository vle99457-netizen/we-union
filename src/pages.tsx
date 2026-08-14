import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  CirclesThreePlus,
  Cube,
  HandHeart,
  MagnifyingGlass,
  Needle,
  Package,
  Pause,
  Play,
  ShieldCheck,
  Sparkle,
  UsersThree,
} from '@phosphor-icons/react'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatedContent } from './components/AnimatedContent'
import { ProductCard } from './components/ProductCard'
import { SectionHeading } from './components/SectionHeading'
import {
  formatPrice,
  honorConcepts,
  prototypeNotice,
  searchCatalog,
  type PersonalizationRegion,
  type ProductPersonalization,
  type WorldSlug,
} from './data/catalog'
import { useSiteConfig } from './context/SiteConfigContext'
import { pageSetting } from './data/siteConfig'
import {
  customizerViewLabels,
  isCustomizerView,
  withUploadVersion,
  type CustomizerImagesResponse,
  type CustomizerView,
  type ManagedCustomizerImages,
} from './data/customizerImages'
import {
  clampArtworkPosition,
  getArtworkRegionPosition,
  getArtworkScaleLimits,
  type ArtworkPosition,
  type ArtworkPositions,
} from './customizerArtwork'
import { useCart, type CartItem } from './store/CartContext'

const promiseIcons = [Sparkle, CirclesThreePlus, ShieldCheck, Package] as const

export function HomePage() {
  const { config, worlds, stories } = useSiteConfig()
  const { home } = config
  const customSteps = home.custom.steps
  const [activeStep, setActiveStep] = useState(0)
  const [isProcessPlaying, setIsProcessPlaying] = useState(true)
  const activeCustomStep = customSteps[activeStep] ?? customSteps[0] ?? { label: '', copy: '', kicker: '', status: '' }

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => {
      if (motionPreference.matches) setIsProcessPlaying(false)
    }

    syncMotionPreference()
    motionPreference.addEventListener('change', syncMotionPreference)
    return () => motionPreference.removeEventListener('change', syncMotionPreference)
  }, [])

  useEffect(() => {
    if (!isProcessPlaying) return

    const timer = window.setTimeout(() => {
      setActiveStep((current) => (current + 1) % customSteps.length)
    }, 5200)

    return () => window.clearTimeout(timer)
  }, [activeStep, isProcessPlaying])

  return (
    <>
      {home.hero.enabled ? <section className="home-hero" aria-labelledby="home-title">
        <img
          className="home-hero__image"
          src={home.hero.image}
          alt="An athlete wearing an original black and gold WE jersey in a stadium tunnel"
          fetchPriority="high"
          decoding="async"
          width="1672"
          height="941"
        />
        <div className="home-hero__veil" />
        <div className="home-hero__content shell">
          <p className="eyebrow eyebrow--gold">{home.hero.eyebrow}</p>
          <h1 id="home-title">{home.hero.titleLine1}<br />{home.hero.titleLine2}</h1>
          <p className="hero-copy">{home.hero.copy}</p>
          <div className="button-row">
            <Link className="button button--gold" to={home.hero.primaryHref}>
              {home.hero.primaryLabel} <ArrowRight size={18} weight="bold" />
            </Link>
            <Link className="button button--ghost-light" to={home.hero.secondaryHref}>
              {home.hero.secondaryLabel}
            </Link>
          </div>
        </div>
        <a className="hero-scroll" href="#worlds">
          {home.hero.scrollLabel} <ArrowDown size={18} />
        </a>
        <p className="hero-index" aria-hidden="true">WE / 01—03</p>
      </section> : null}

      {home.worlds.enabled ? <section className="worlds-section section-pad shell" id="worlds" aria-labelledby="worlds-title">
        <SectionHeading
          id="worlds-title"
          eyebrow={home.worlds.eyebrow}
          title={home.worlds.title}
          copy={home.worlds.copy}
        />
        <div className="world-grid">
          {worlds.map((world) => (
            <div
              className={`world-card world-card--${world.slug}`}
              key={world.slug}
            >
              <Link to={`/${world.slug}`}>
                <img src={world.image} alt="" loading="lazy" decoding="async" width="1672" height="941" />
                <span className="world-card__shade" />
                <span className="world-card__index">{world.index}</span>
                <span className="world-card__content">
                  <span className="world-card__status">{world.statusLabel}</span>
                  <strong>{world.title}</strong>
                  <span>{world.copy}</span>
                </span>
                <ArrowUpRight className="world-card__arrow" size={25} weight="bold" />
              </Link>
            </div>
          ))}
        </div>
      </section> : null}

      {home.featured.enabled ? <section className="series-spotlight section-pad" aria-labelledby="series-title">
        <div className="shell">
          <SectionHeading
            id="series-title"
            eyebrow={home.featured.eyebrow}
            title={home.featured.title}
            copy={home.featured.copy}
            action={
              <Link className="text-link" to={home.featured.ctaHref}>
                {home.featured.ctaLabel} <ArrowRight size={17} weight="bold" />
              </Link>
            }
          />
        </div>
        <AnimatedContent className="series-banner">
          <img
            src={home.featured.image}
            alt="White Pulse original concept displayed above a flowing surface"
            loading="lazy"
            decoding="async"
            width="1672"
            height="941"
          />
          <div className="series-banner__copy">
            <p>{home.featured.bannerKicker}</p>
            <h3>{home.featured.bannerTitleLine1}<br />{home.featured.bannerTitleLine2}</h3>
          </div>
        </AnimatedContent>
      </section> : null}

      {home.custom.enabled ? <section
        className={`custom-story section-pad ${isProcessPlaying ? 'is-playing' : 'is-paused'}`}
        aria-labelledby="custom-title"
      >
        <div className="shell custom-story__grid">
          <div className="custom-story__intro">
            <p className="eyebrow eyebrow--gold">{home.custom.eyebrow}</p>
            <h2 id="custom-title">{home.custom.titleLine1}<br />{home.custom.titleLine2}</h2>
            <p>{home.custom.copy}</p>
            <Link className="button button--light" to={home.custom.ctaHref}>
              {home.custom.ctaLabel} <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
          <div
            className="custom-story__visual"
            data-step={activeStep + 1}
            role="group"
            aria-roledescription="carousel"
            aria-label="Create yours four-step preview"
          >
            <div className="process-card">
              <div className="process-card__grid" aria-hidden="true" />
              <div className="process-card__orbit" aria-hidden="true" />
              <div className="process-card__product">
                <img
                  className="process-card__jersey"
                  src={home.custom.image}
                  alt="Original white WE jersey changing through choose, personalize, review, and order stages"
                  loading="lazy"
                  decoding="async"
                  width="1145"
                  height="1373"
                />

                <div className="process-card__artwork" aria-hidden="true">
                  <span className="process-card__logo">WE</span>
                  <span className="process-card__city">
                    {activeStep === 0 ? 'ORIGINAL' : 'SACRAMENTO'}
                  </span>
                  <strong>{activeStep === 0 ? '01' : '17'}</strong>
                </div>
              </div>

              <div className="process-card__selection" aria-hidden="true">
                <i /><i /><i /><i />
              </div>
              <div className="process-card__scan" aria-hidden="true" />
              <div className="process-card__hotspots" aria-hidden="true">
                <span className="process-hotspot process-hotspot--city"><i />CITY / SACRAMENTO</span>
                <span className="process-hotspot process-hotspot--number"><i />NUMBER / 17</span>
                <span className="process-hotspot process-hotspot--logo"><i />LOGO / WE</span>
              </div>

              <div className="process-card__proof" aria-hidden="true">
                <span>Proof set</span>
                <ul>
                  {['Front', 'Back', 'Left sleeve', 'Right sleeve'].map((view) => (
                    <li key={view}><Check size={12} weight="bold" />{view}</li>
                  ))}
                </ul>
              </div>

              <div className="process-card__tracking" aria-hidden="true">
                <div>
                  <span>WE–2410–017</span>
                  <strong>TRACKING ACTIVE</strong>
                </div>
                <ol>
                  <li className="is-complete">Proof</li>
                  <li className="is-active">Production</li>
                  <li>Quality</li>
                  <li>Delivery</li>
                </ol>
              </div>

              <div className="process-card__index" aria-hidden="true">
                <span>WE</span>
                <strong>0{activeStep + 1}</strong>
              </div>
              <div className="process-card__status" aria-hidden="true">
                <span>{activeCustomStep.kicker}</span>
                <strong>{activeCustomStep.status}</strong>
              </div>
            </div>

            <div className="process-card__caption">
              <p aria-live={isProcessPlaying ? 'off' : 'polite'}>
                <span>0{activeStep + 1}</span>
                {activeCustomStep.copy}
              </p>
              <button
                type="button"
                className="process-card__playback"
                aria-label={isProcessPlaying ? 'Pause four-step animation' : 'Play four-step animation'}
                aria-pressed={isProcessPlaying}
                onClick={() => setIsProcessPlaying((current) => !current)}
              >
                {isProcessPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
                <span>{isProcessPlaying ? 'Pause' : 'Play'}</span>
              </button>
            </div>
          </div>
          <ol className="custom-steps">
            {customSteps.map((step, index) => (
              <li key={step.label}>
                <button
                  type="button"
                  className={activeStep === index ? 'is-active' : ''}
                  aria-pressed={activeStep === index}
                  onClick={() => setActiveStep(index)}
                >
                  <span>0{index + 1}</span>
                  {step.label}
                  <ArrowRight size={18} />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section> : null}

      {home.craftsmanship.enabled ? <section className="craft-story section-pad" aria-labelledby="craft-title">
        <div className="craft-story__image">
          <img
            src={home.craftsmanship.image}
            alt="A craftsperson inspecting embroidery on a black garment concept"
            loading="lazy"
            decoding="async"
            width="1672"
            height="941"
          />
        </div>
        <div className="craft-story__panel">
          <p className="eyebrow">{home.craftsmanship.eyebrow}</p>
          <h2 id="craft-title">{home.craftsmanship.title}</h2>
          <p>{home.craftsmanship.copy}</p>
          <Link className="text-link" to={home.craftsmanship.ctaHref}>
            {home.craftsmanship.ctaLabel} <ArrowRight size={17} weight="bold" />
          </Link>
          <dl className="craft-metrics">
            <div><dt>01</dt><dd>Material selection</dd></div>
            <div><dt>02</dt><dd>Personalized build</dd></div>
            <div><dt>03</dt><dd>Final inspection</dd></div>
          </dl>
        </div>
      </section> : null}

      {home.promises.enabled ? <section className="promise-section section-pad shell" aria-labelledby="promise-title">
        <SectionHeading id="promise-title" title={home.promises.title} />
        <div className="promise-grid">
          {home.promises.items.map(({ title, copy }, index) => {
            const Icon = promiseIcons[index] ?? Sparkle
            return (
            <article key={title}>
              <div className="promise-grid__top">
                <Icon size={25} weight="light" />
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
            )
          })}
        </div>
      </section> : null}

      {home.stories.enabled ? <section className="stories-section section-pad shell" aria-labelledby="stories-title">
        <SectionHeading
          id="stories-title"
          eyebrow={home.stories.eyebrow}
          title={home.stories.title}
          action={
            <Link className="text-link" to="/stories">
              {home.stories.ctaLabel} <ArrowRight size={17} weight="bold" />
            </Link>
          }
        />
        <div className="story-mosaic">
          {stories.map((story, index) => (
            <article className={index === 0 ? 'story-card story-card--lead' : 'story-card'} key={story.slug}>
              <Link to={`/stories/${story.slug}`}>
                <div className="story-card__image">
                  <img src={story.image} alt="" loading="lazy" decoding="async" width="1672" height="941" />
                  <span>{story.category}</span>
                </div>
                <p className="eyebrow">{story.readTime} read</p>
                <h3>{story.title}</h3>
                <p>{story.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </section> : null}

      {home.community.enabled ? <section className="community-banner" aria-labelledby="community-title">
        <img src={home.community.image} alt="An athlete walking toward the field in a personalized jersey" loading="lazy" decoding="async" width="1672" height="941" />
        <div className="community-banner__veil" />
        <div className="community-banner__content">
          <p className="eyebrow eyebrow--gold">{home.community.eyebrow}</p>
          <h2 id="community-title">{home.community.title}</h2>
          <p>{home.community.copy}</p>
          <Link className="button button--ghost-light" to={home.community.ctaHref}>
            {home.community.ctaLabel} <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section> : null}
    </>
  )
}

export function CollectionsPage() {
  const { config, series } = useSiteConfig()
  const page = pageSetting(config, 'collections')
  if (!page.enabled) return <NotFoundPage />
  return (
    <>
      <PageIntro
        index={page.eyebrow}
        title={page.title}
        copy={page.description}
      />
      <div className="collection-gateway">
        {series.map((item, index) => (
          <Link
            className={`collection-row collection-row--${item.tone}`}
            key={item.slug}
            to={`/collections/${item.slug}`}
            aria-label={`Explore the ${item.name} series`}
          >
            <img src={item.image} alt="" loading={index ? 'lazy' : 'eager'} decoding="async" width="1672" height="941" />
            <span className="collection-row__shade" />
            <span className="collection-row__index">0{index + 1}</span>
            <span className="collection-row__content">
              <span className="eyebrow">{item.eyebrow}</span>
              <strong>{item.name}</strong>
              <span className="collection-row__statement">{item.statement}</span>
              <span className="button button--ghost-light">
                Enter series <ArrowRight size={18} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}

export function SeriesPage() {
  const { slug } = useParams()
  const { config, products, series } = useSiteConfig()
  const current = series.find((item) => item.slug === slug)
  const [controls, setControls] = useSearchParams()
  const sort = ['featured', 'name-asc', 'name-desc'].includes(controls.get('sort') ?? '')
    ? controls.get('sort')!
    : 'featured'
  const filter = ['all', 'personalizable'].includes(controls.get('filter') ?? '')
    ? controls.get('filter')!
    : 'all'

  const updateControl = (key: 'sort' | 'filter', value: string) => {
    const next = new URLSearchParams(controls)
    const defaultValue = key === 'sort' ? 'featured' : 'all'
    if (value === defaultValue) next.delete(key)
    else next.set(key, value)
    setControls(next, { replace: true })
  }

  if (!current) return <NotFoundPage />

  const available = products.filter((product) => product.series === current.slug)
  const filtered = available.filter((product) => filter === 'all' || product.badge?.toLowerCase().includes(filter))
  const visible = [...filtered].sort((a, b) => {
    if (sort === 'featured') return 0
    if (sort === 'name-asc') return a.name.localeCompare(b.name)
    if (sort === 'name-desc') return b.name.localeCompare(a.name)
    return 0
  })

  return (
    <>
      <section className={`series-hero series-hero--${current.tone}`}>
        <img src={current.image} alt="" fetchPriority="high" width="1672" height="941" />
        <div className="series-hero__shade" />
        <div className="series-hero__content shell">
          <Link className="back-link" to="/collections"><ArrowLeft size={17} /> All series</Link>
          <p className="eyebrow">{current.eyebrow}</p>
          <h1>{current.name}</h1>
          <p>{current.statement}</p>
        </div>
      </section>
      <section className="listing-section section-pad shell">
        <div className="listing-toolbar">
          <div>
            <p className="eyebrow">{visible.length} concepts / pre-launch</p>
            <h2>Build the full story.</h2>
          </div>
          <div className="listing-controls">
            <label>
              Filter
              <select name="filter" value={filter} onChange={(event) => updateControl('filter', event.target.value)}>
                <option value="all">All pieces</option>
                <option value="personalizable">Personalizable</option>
              </select>
            </label>
            <label>
              Sort
              <select name="sort" value={sort} onChange={(event) => updateControl('sort', event.target.value)}>
                <option value="featured">Featured</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </label>
          </div>
        </div>
        {visible.length ? (
          <div className="product-grid">
            {visible.map((product, index) => <ProductCard key={product.slug} product={product} priority={index < 2} />)}
          </div>
        ) : (
          <div className="empty-state"><h3>No matching pieces</h3><p>Try a broader filter.</p></div>
        )}
        <div className="listing-more"><span>All current concepts shown</span><p>Additional pieces appear only after catalog and product facts are verified.</p></div>
        <nav className="series-crosslinks" aria-label="Other original series">
          <p className="eyebrow">Continue through CREATE</p>
          {series.filter((item) => item.slug !== current.slug).map((item) => (
            <Link key={item.slug} to={`/collections/${item.slug}`}>{item.name}<ArrowRight size={17} /></Link>
          ))}
        </nav>
        <p className="prototype-note">{prototypeNotice}</p>
      </section>
    </>
  )
}

export function WorldPage({ world }: { world: WorldSlug }) {
  const { config, worlds, series } = useSiteConfig()
  const current = worlds.find((item) => item.slug === world)
  const page = pageSetting(config, world)
  if (!page.enabled) return <NotFoundPage />
  if (!current) return <NotFoundPage />
  const supporting = {
    create: ['Original systems', 'Personal details', 'Rights-confirmed content'],
    honor: ['Original heritage language', 'Documented rights first', 'No implied affiliation'],
    belong: ['Future team identity', 'Future city heritage', 'Future culture series'],
  }[world]

  return (
    <>
      <section className={`world-hero world-hero--${world}`}>
        <img src={page.image || current.image} alt="" fetchPriority="high" width="1672" height="941" />
        <div className="world-hero__shade" />
        <div className="world-hero__content shell">
          <p className="eyebrow eyebrow--gold">{page.eyebrow} / {current.statusLabel}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          {world === 'create' ? (
            <Link className="button button--light" to="/collections">Explore originals <ArrowRight size={18} /></Link>
          ) : world === 'belong' ? (
            <Link className="button button--light" to="/custom/team">Plan a future brief <ArrowRight size={18} /></Link>
          ) : (
            <Link className="button button--light" to="/stories">Read the design position <ArrowRight size={18} /></Link>
          )}
        </div>
      </section>
      <section className="world-manifesto section-pad shell">
        <p className="eyebrow">Why {current.title}</p>
        <h2>{world === 'create' ? 'Expression deserves structure.' : world === 'honor' ? 'Heritage requires evidence.' : 'Together should still feel personal.'}</h2>
        <div className="world-manifesto__list">
          {supporting.map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}
        </div>
      </section>
      <section className="world-series section-pad">
        {world === 'create' ? series.map((item) => (
          <div className="shell split-feature" key={item.slug}>
            <img src={item.image} alt="" loading="lazy" width="1672" height="941" />
            <div>
              <p className="eyebrow">{item.eyebrow}</p>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <Link className="text-link" to={`/collections/${item.slug}`}>View series <ArrowRight size={17} /></Link>
            </div>
          </div>
        )) : world === 'honor' ? honorConcepts.map((concept) => (
          <article className="shell split-feature world-gate" key={concept.slug}>
            <img src={concept.image} alt="" loading="lazy" width="1672" height="941" />
            <div>
              <p className="eyebrow">Original concept / Rights review</p>
              <h2>{concept.name}</h2>
              <p>{concept.description}</p>
              <div className="rights-status"><ShieldCheck size={22} /><span>Not for sale · documented authorization required before publication</span></div>
            </div>
          </article>
        )) : (
          <div className="shell split-feature world-gate">
            <img src="/images/world-belong.webp" alt="A future community identity direction" loading="lazy" width="1672" height="941" />
            <div>
              <p className="eyebrow">Future direction / Coming soon</p>
              <h2>Wear where you belong.</h2>
              <p>BELONG currently has no formal series or products. Team Identity, City Heritage, and Culture Series remain future directions until their stories, rights, and product facts are approved.</p>
              <Link className="text-link" to="/custom/team">Share a future team brief <ArrowRight size={17} /></Link>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export function ProductPage() {
  const { slug } = useParams()
  const { config, products, series } = useSiteConfig()
  const product = products.find((item) => item.slug === slug)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [size, setSize] = useState<ApparelSize | ''>('')
  const [added, setAdded] = useState(false)
  const [cityQuery, setCityQuery] = useState('')
  const [cityMessage, setCityMessage] = useState('')
  const { addItem } = useCart()
  const navigate = useNavigate()
  const galleryThumbs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    setActiveGalleryIndex(0)
  }, [slug])

  if (!product) return <NotFoundPage />
  const fallbackGalleryItem = {
    src: product.image,
    label: 'Overall view',
    alt: product.name,
    width: 941,
    height: 941,
  }
  const hasProductGallery = Boolean(product.gallery?.length)
  const galleryItems = hasProductGallery ? product.gallery! : [fallbackGalleryItem]
  const galleryIndex = Math.min(activeGalleryIndex, galleryItems.length - 1)
  const activeGalleryItem = galleryItems[galleryIndex]!
  const currentSeries = series.find((item) => item.slug === product.series)
  const relatedProducts = products
    .filter((item) => item.series === product.series && item.slug !== product.slug)
    .slice(0, 3)

  const showGalleryItem = (index: number, moveFocus = false) => {
    setActiveGalleryIndex(index)
    if (moveFocus) galleryThumbs.current[index]?.focus()
  }

  const moveGallery = (direction: -1 | 1) => {
    const next = (galleryIndex + direction + galleryItems.length) % galleryItems.length
    showGalleryItem(next)
  }

  const handleGalleryKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % galleryItems.length
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + galleryItems.length) % galleryItems.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = galleryItems.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    showGalleryItem(nextIndex, true)
  }

  const findCity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = cityQuery.trim().toLowerCase()
    if (!normalized) {
      setCityMessage('Enter a city or choose a popular city below.')
      return
    }
    const match = cityChoices.find((city) =>
      city.name.toLowerCase() === normalized ||
      city.slug === normalized ||
      city.name.toLowerCase().includes(normalized),
    )
    if (match) {
      setCityMessage(`Loading ${match.name} originals.`)
      navigate(`/search?city=${match.slug}`)
      return
    }
    const citySlug = normalized
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setCityMessage(`No city edit is available for ${cityQuery.trim()}.`)
    navigate(`/search?city=${encodeURIComponent(citySlug || normalized)}`)
  }

  const add = () => {
    if (!size) return
    addItem({
      id: `${product.slug}-${size}`,
      productSlug: product.slug,
      name: product.name,
      detail: `${product.color} · Size ${size}`,
      price: product.price,
      image: product.image,
    })
    setAdded(true)
  }

  return (
    <>
    <section className="product-page shell" aria-label={`${product.name} product information`}>
      {hasProductGallery ? (
      <div
        className="product-gallery product-gallery--carousel"
        data-product-gallery
        role="region"
        aria-label={`${product.name} product images`}
        aria-roledescription="carousel"
      >
        <div
          className="product-gallery__stage"
          id="product-gallery-panel"
          role="tabpanel"
          aria-labelledby={`product-gallery-tab-${galleryIndex}`}
        >
          <img
            key={activeGalleryItem.src}
            data-gallery-main-image
            src={activeGalleryItem.src}
            alt={activeGalleryItem.alt}
            fetchPriority={galleryIndex === 0 ? 'high' : 'auto'}
            loading={galleryIndex === 0 ? 'eager' : 'lazy'}
            decoding="async"
            width={activeGalleryItem.width}
            height={activeGalleryItem.height}
          />
          {galleryItems.length > 1 ? (
            <>
              <button
                className="product-gallery__arrow product-gallery__arrow--previous"
                type="button"
                aria-label="Previous product image"
                onClick={() => moveGallery(-1)}
              >
                <ArrowLeft size={20} aria-hidden="true" />
              </button>
              <button
                className="product-gallery__arrow product-gallery__arrow--next"
                type="button"
                aria-label="Next product image"
                onClick={() => moveGallery(1)}
              >
                <ArrowRight size={20} aria-hidden="true" />
              </button>
              <span className="product-gallery__count" aria-hidden="true">
                {String(galleryIndex + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
              </span>
            </>
          ) : null}
        </div>
        {galleryItems.length > 1 ? (
          <>
            <div className="product-gallery__dots" aria-hidden="true">
              {galleryItems.map((item, index) => (
                <span
                  key={item.src}
                  className={index === galleryIndex ? 'is-active' : ''}
                  data-gallery-dot
                  data-active={index === galleryIndex}
                />
              ))}
            </div>
            <div className="product-gallery__thumbs" role="tablist" aria-label="Product image views">
              {galleryItems.map((item, index) => (
                <button
                  key={item.src}
                  ref={(element) => { galleryThumbs.current[index] = element }}
                  className={index === galleryIndex ? 'is-active' : ''}
                  id={`product-gallery-tab-${index}`}
                  data-gallery-thumbnail
                  type="button"
                  role="tab"
                  aria-label={`Show ${item.label.toLowerCase()}`}
                  aria-controls="product-gallery-panel"
                  aria-selected={index === galleryIndex}
                  tabIndex={index === galleryIndex ? 0 : -1}
                  onClick={() => showGalleryItem(index)}
                  onKeyDown={(event) => handleGalleryKeyDown(event, index)}
                >
                  <img src={item.src} alt="" loading="lazy" decoding="async" width={item.width} height={item.height} />
                </button>
              ))}
            </div>
          </>
        ) : null}
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {activeGalleryItem.label}, image {galleryIndex + 1} of {galleryItems.length}
        </p>
      </div>
      ) : (
        <div className="product-gallery">
          <div className="product-gallery__main"><img src={product.image} alt={product.name} fetchPriority="high" width="941" height="941" /></div>
          <div className="product-gallery__detail"><img src="/images/craft-embroidery.webp" alt="Embroidery construction concept detail" loading="lazy" width="1672" height="941" /></div>
        </div>
      )}
      <div className="product-info">
        <aside className="city-discovery" aria-labelledby="find-city-title">
          <div className="city-discovery__header">
            <div>
              <p className="eyebrow" id="find-city-title">Find your city</p>
              <p>Discover original WE color stories curated around a place—not an official team identity.</p>
            </div>
            <form role="search" onSubmit={findCity}>
              <label className="sr-only" htmlFor="product-city-search">Search by city</label>
              <MagnifyingGlass aria-hidden="true" size={18} />
              <input
                id="product-city-search"
                name="city"
                type="search"
                list="product-city-options"
                autoComplete="off"
                spellCheck={false}
                placeholder="Search by city"
                value={cityQuery}
                onChange={(event) => setCityQuery(event.target.value)}
              />
              <button type="submit">Find</button>
              <datalist id="product-city-options">
                {cityChoices.map((city) => <option key={city.slug} value={city.name} />)}
              </datalist>
            </form>
          </div>
          <p className="city-discovery__status" role="status" aria-live="polite">{cityMessage}</p>
          <div className="city-chips" aria-label="Popular cities">
            {cityChoices.map((city) => <Link key={city.slug} to={`/search?city=${city.slug}`}>{city.name}</Link>)}
          </div>
        </aside>
        <p className="eyebrow">{currentSeries?.name} / Concept preview</p>
        <h1>{product.name}</h1>
        {config.commerce.displayPrices ? <p className="product-info__price">{formatPrice(product.price)}</p> : null}
        <p className="product-info__description">{product.story}</p>
        <dl className="product-facts">
          <div><dt>Color</dt><dd>{product.color}</dd></div>
          <div><dt>Design status</dt><dd>Original concept / product facts TBD</dd></div>
          <div><dt>Personalization</dt><dd>{product.personalizable ? 'Proof and IP review supported' : 'Not enabled for this concept'}</dd></div>
        </dl>
        <fieldset className="size-picker">
          <legend>Choose size</legend>
          <div>
            {apparelSizes.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={size === option}
                className={size === option ? 'is-active' : ''}
                onClick={() => { setSize(option); setAdded(false) }}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="product-actions">
          <button className="button button--dark" type="button" onClick={add} disabled={!size}>
            {added ? <><Check size={18} /> Added to selection</> : size ? <>Add to selection <ArrowRight size={18} /></> : <>Choose a size</>}
          </button>
          {product.personalizable && config.customizer.enabled ? (
            size ? (
              <Link className="button button--outline" to={`/custom?style=${product.slug}&size=${size}`}>
                Personalize this
              </Link>
            ) : (
              <button className="button button--outline" type="button" disabled>Choose size to personalize</button>
            )
          ) : (
            <button className="button button--outline" type="button" disabled>Personalization unavailable</button>
          )}
        </div>
        <p className="product-action-status" role="status" aria-live="polite">{added ? 'Concept added. Pricing and availability remain unconfirmed.' : !size ? 'Choose a size to continue to an order review.' : ''}</p>
        <p className="prototype-note">{prototypeNotice}</p>
        <details>
          <summary>Delivery status</summary>
          <p>Production and delivery estimates appear only after product, operations, and carrier data are verified. No timeline is promised in this concept.</p>
        </details>
      </div>
    </section>
    <div className="mobile-purchase-bar" aria-label="Product action">
      {config.commerce.displayPrices ? <span>{formatPrice(product.price)}</span> : <span>{product.name}</span>}
      <button type="button" onClick={add} disabled={!size}>{added ? 'Added to selection' : size ? 'Add to selection' : 'Select size'}</button>
    </div>
    <div className="product-detail-stack shell">
      <section data-product-module="story" aria-labelledby="product-story-title">
        <p className="eyebrow">06 / The story</p>
        <h2 id="product-story-title">{product.theme}.</h2>
        <p>{product.story}</p>
        <p>{product.connection}</p>
      </section>
      <section data-product-module="craft" aria-labelledby="product-craft-title">
        <p className="eyebrow">07 / Design &amp; craft</p>
        <h2 id="product-craft-title">Intent before claim.</h2>
        <dl>
          <div><dt>Design language</dt><dd>{product.design}</dd></div>
          <div><dt>Craft direction</dt><dd>{product.craft}</dd></div>
        </dl>
      </section>
      <section data-product-module="size-fit" aria-labelledby="product-fit-title">
        <p className="eyebrow">08 / Size &amp; fit</p>
        <h2 id="product-fit-title">Product specification pending.</h2>
        <p>Fit, garment measurements, material composition, care, and performance information will be published only after verified product data is approved.</p>
        <Link className="text-link" to="/legal/size-guide">View size-guide framework <ArrowRight size={17} /></Link>
      </section>
      <section data-product-module="shipping" aria-labelledby="product-shipping-title">
        <p className="eyebrow">09 / Shipping &amp; returns</p>
        <h2 id="product-shipping-title">Terms follow verified operations.</h2>
        <p>Pricing, availability, production timing, delivery, changes, and personalized-product remedies remain TBD until approved policies and live services are connected.</p>
        <Link className="text-link" to="/legal/shipping">Read the policy framework <ArrowRight size={17} /></Link>
      </section>
      <section data-product-module="community" aria-labelledby="product-community-title">
        <p className="eyebrow">10 / Community</p>
        <h2 id="product-community-title">No fabricated reviews.</h2>
        <p>Verified wearer stories can appear here only with consent, moderation, and a documented right to publish. There are no customer reviews in this concept build.</p>
      </section>
      <section data-product-module="related" aria-labelledby="related-products-title">
        <p className="eyebrow">11 / Related</p>
        <h2 id="related-products-title">Continue the series.</h2>
        {relatedProducts.length ? (
          <div className="product-grid">
            {relatedProducts.map((item) => <ProductCard key={item.slug} product={item} />)}
          </div>
        ) : (
          <Link className="text-link" to={`/collections/${product.series}`}>View the full series <ArrowRight size={17} /></Link>
        )}
      </section>
    </div>
    </>
  )
}

const colors = [
  { name: 'SOURCE NAVY / artwork matched', value: '#132B4D' },
  { name: 'Pulse Green / visual preview', value: '#43B67A' },
  { name: 'WE BLACK / visual preview', value: '#0A0A0A' },
  { name: 'METAL SILVER / visual preview', value: '#A7ABB0' },
  { name: 'Rift Blue / visual preview', value: '#174A8B' },
]

const apparelSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const
type ApparelSize = (typeof apparelSizes)[number]

const cityChoices = [
  {
    slug: 'sacramento',
    name: 'Sacramento',
    statement: 'Sunlit neutrals, deep green accents, and originals made for long seasons.',
    productSlugs: ['white-pulse-game-jersey', 'identity-fusion-game-jersey'],
  },
  {
    slug: 'chicago',
    name: 'Chicago',
    statement: 'High-contrast layers and cold-weather depth, built around original WE series.',
    productSlugs: ['black-rift-game-jersey', 'black-rift-travel-layer'],
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles',
    statement: 'Bright movement, warm neutrals, and a light visual language for the everyday field.',
    productSlugs: ['white-pulse-motion-top', 'identity-fusion-studio-layer'],
  },
  {
    slug: 'new-york',
    name: 'New York',
    statement: 'Sharp contrast and city-ready layers with no borrowed team identity.',
    productSlugs: ['black-rift-game-jersey', 'identity-fusion-game-jersey'],
  },
] as const

function isApparelSize(value: string | null | undefined): value is ApparelSize {
  return apparelSizes.includes(value as ApparelSize)
}

type StudioView = CustomizerView
const studioViewLabels = customizerViewLabels
type LogoSlot = 'front' | 'leftSleeve' | 'rightSleeve'
type LogoAsset = { dataUrl: string; name: string }
type StudioLogos = Record<LogoSlot, LogoAsset>

function isStudioView(value: string | undefined): value is StudioView {
  return isCustomizerView(value)
}

type SavedDesignDraft = {
  productSlug?: string
  template?: string
  city?: string
  name?: string
  number?: string
  logoDataUrl?: string
  logoName?: string
  logos?: Partial<Record<LogoSlot, Partial<LogoAsset>>>
  artworkPositions?: ArtworkPositions
  color?: { name?: string }
  colorName?: string
  size?: string
  view?: StudioView
}

function MovableArtwork({
  region,
  position,
  label,
  className,
  onPositionChange,
  children,
}: {
  region: PersonalizationRegion
  position?: ArtworkPosition
  label: string
  className: string
  onPositionChange: (id: PersonalizationRegion['id'], position: ArtworkPosition) => void
  children: ReactNode
}) {
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const dragState = useRef<{
    pointerId: number
    startClientX: number
    startClientY: number
    startPosition: ArtworkPosition
    canvasWidth: number
    canvasHeight: number
  } | null>(null)
  const resizeState = useRef<{
    pointerId: number
    startClientX: number
    startClientY: number
    startScale: number
    baseWidth: number
    baseHeight: number
  } | null>(null)
  const currentPosition = clampArtworkPosition(region, position ?? getArtworkRegionPosition(region))
  const currentScale = currentPosition.scale ?? 1
  const scaleLimits = getArtworkScaleLimits(region)

  const updatePosition = (nextPosition: ArtworkPosition) => {
    onPositionChange(region.id, clampArtworkPosition(region, nextPosition))
  }

  const updateScale = (scale: number) => {
    updatePosition({ ...currentPosition, scale })
  }

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const canvas = event.currentTarget.closest('.studio-preview__canvas')
    if (!canvas) return
    const bounds = canvas.getBoundingClientRect()
    dragState.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startPosition: currentPosition,
      canvasWidth: bounds.width,
      canvasHeight: bounds.height,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    event.preventDefault()
  }

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const activeDrag = dragState.current
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return
    updatePosition({
      ...activeDrag.startPosition,
      x: activeDrag.startPosition.x + ((event.clientX - activeDrag.startClientX) / activeDrag.canvasWidth) * 100,
      y: activeDrag.startPosition.y + ((event.clientY - activeDrag.startClientY) / activeDrag.canvasHeight) * 100,
    })
    event.preventDefault()
  }

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return
    dragState.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setDragging(false)
  }

  const startResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const canvas = event.currentTarget.closest('.studio-preview__canvas')
    if (!canvas) return
    const bounds = canvas.getBoundingClientRect()
    resizeState.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScale: currentScale,
      baseWidth: (bounds.width * region.width) / 100,
      baseHeight: (bounds.height * region.height) / 100,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setResizing(true)
    event.preventDefault()
  }

  const moveResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    const activeResize = resizeState.current
    if (!activeResize || activeResize.pointerId !== event.pointerId) return
    const deltaX = event.clientX - activeResize.startClientX
    const deltaY = event.clientY - activeResize.startClientY
    const projectionBase = (activeResize.baseWidth ** 2) + (activeResize.baseHeight ** 2)
    const scaleDelta = projectionBase
      ? ((deltaX * activeResize.baseWidth) + (deltaY * activeResize.baseHeight)) / projectionBase
      : 0
    updateScale(activeResize.startScale + scaleDelta)
    event.preventDefault()
  }

  const finishResize = (event: ReactPointerEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    if (resizeState.current?.pointerId !== event.pointerId) return
    resizeState.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setResizing(false)
  }

  const moveWithKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const distance = event.shiftKey ? 2 : 0.5
    const movement: Partial<ArtworkPosition> = {}
    if (event.key === 'ArrowLeft') movement.x = -distance
    if (event.key === 'ArrowRight') movement.x = distance
    if (event.key === 'ArrowUp') movement.y = -distance
    if (event.key === 'ArrowDown') movement.y = distance
    if (movement.x === undefined && movement.y === undefined) return
    updatePosition({
      ...currentPosition,
      x: currentPosition.x + (movement.x ?? 0),
      y: currentPosition.y + (movement.y ?? 0),
    })
    event.preventDefault()
  }

  const resizeWithKeyboard = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    const distance = event.shiftKey ? 0.15 : 0.05
    const grow = event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === '+' || event.key === '='
    const shrink = event.key === 'ArrowLeft' || event.key === 'ArrowDown' || event.key === '-' || event.key === '_'
    if (!grow && !shrink) return
    event.stopPropagation()
    updateScale(currentScale + (grow ? distance : -distance))
    event.preventDefault()
  }

  return (
    <div
      aria-label={`Move and resize ${label}. Drag the item to move it, then drag its corner handle to resize it.`}
      className={`studio-artwork ${className}`}
      data-dragging={dragging ? 'true' : undefined}
      data-personalization-region={region.id}
      data-position-x={currentPosition.x.toFixed(2)}
      data-position-y={currentPosition.y.toFixed(2)}
      data-resizing={resizing ? 'true' : undefined}
      data-scale={currentScale.toFixed(2)}
      onKeyDown={moveWithKeyboard}
      onLostPointerCapture={() => {
        dragState.current = null
        setDragging(false)
      }}
      onPointerCancel={finishDrag}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      role="group"
      style={{
        left: `${currentPosition.x}%`,
        top: `${currentPosition.y}%`,
        width: `${region.width * currentScale}%`,
        height: `${region.height * currentScale}%`,
        transform: region.rotate ? `rotate(${region.rotate}deg)` : undefined,
      }}
      tabIndex={0}
      title={`Drag to move ${label}`}
    >
      {children}
      <span
        aria-label={`Resize ${label}`}
        aria-valuemax={Math.round(scaleLimits.max * 100)}
        aria-valuemin={Math.round(scaleLimits.min * 100)}
        aria-valuenow={Math.round(currentScale * 100)}
        aria-valuetext={`${Math.round(currentScale * 100)}% size`}
        className="studio-artwork__resize-handle"
        onKeyDown={resizeWithKeyboard}
        onLostPointerCapture={() => {
          resizeState.current = null
          setResizing(false)
        }}
        onPointerCancel={finishResize}
        onPointerDown={startResize}
        onPointerMove={moveResize}
        onPointerUp={finishResize}
        role="slider"
        tabIndex={0}
        title={`Drag to resize ${label}`}
      />
    </div>
  )
}

function PersonalizationArtwork({
  regions,
  view,
  city,
  name,
  number,
  logos,
  positions,
  onPositionChange,
  ink,
  outline,
}: {
  regions: readonly PersonalizationRegion[]
  view: StudioView
  city: string
  name: string
  number: string
  logos: StudioLogos
  positions: ArtworkPositions
  onPositionChange: (id: PersonalizationRegion['id'], position: ArtworkPosition) => void
  ink: string
  outline: string
}) {
  return regions
    .filter((region) => region.side === view)
    .map((region) => {
      if (region.kind === 'number') {
        if (!number) return null
        return (
          <MovableArtwork
            className="studio-artwork--number"
            key={region.id}
            label={region.side === 'front' ? 'front number' : 'back number'}
            onPositionChange={onPositionChange}
            position={positions[region.id]}
            region={region}
          >
            <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
              <text className="studio-number__outline" fill={ink} stroke={outline} x="50" y="84">{number}</text>
              <text className="studio-number__ink" fill={ink} stroke={ink} x="50" y="84">{number}</text>
            </svg>
          </MovableArtwork>
        )
      }

      if (region.kind === 'city' || region.kind === 'name') {
        const value = region.kind === 'city' ? city : name
        if (!value) return null
        const longText = value.length > (region.kind === 'city' ? 11 : 8)
        return (
          <MovableArtwork
            className={region.kind === 'city' ? 'studio-artwork--city' : 'studio-artwork--name'}
            key={region.id}
            label={region.kind === 'city' ? 'front city name' : 'player name'}
            onPositionChange={onPositionChange}
            position={positions[region.id]}
            region={region}
          >
            <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 24">
              <text
                fill={ink}
                textLength={longText ? 90 : undefined}
                lengthAdjust={longText ? 'spacingAndGlyphs' : undefined}
                x="50"
                y="18"
              >{value}</text>
            </svg>
          </MovableArtwork>
        )
      }

      const logo = logos[region.logoSlot ?? 'front']
      if (!logo.dataUrl) return null
      const placementLabel = region.logoSlot === 'leftSleeve'
        ? 'left sleeve logo'
        : region.logoSlot === 'rightSleeve' ? 'right sleeve logo' : 'front logo'
      return (
        <MovableArtwork
          className="studio-artwork--logo"
          key={region.id}
          label={placementLabel}
          onPositionChange={onPositionChange}
          position={positions[region.id]}
          region={region}
        >
          <img aria-hidden="true" src={logo.dataUrl} alt="" width="128" height="128" />
        </MovableArtwork>
      )
    })
}

function LogoUploadField({
  inputId,
  inputName,
  label,
  help,
  asset,
  error,
  onUpload,
  onRemove,
}: {
  inputId: string
  inputName: string
  label: string
  help: string
  asset: LogoAsset
  error: string
  onUpload: (file: File | undefined) => void
  onRemove: () => void
}) {
  const helpId = `${inputId}-help`
  return (
    <div className="logo-upload">
      <div>
        <span className="logo-upload__label">{label}</span>
        <small id={helpId}>{help}</small>
      </div>
      <div className="logo-upload__actions">
        {asset.dataUrl ? <img src={asset.dataUrl} alt={`${label} upload preview`} width="48" height="48" /> : null}
        <label className="logo-upload__button" htmlFor={inputId}>{asset.dataUrl ? 'Replace logo' : 'Upload logo'}</label>
        <input
          accept="image/png,image/jpeg,image/webp"
          aria-describedby={helpId}
          id={inputId}
          name={inputName}
          type="file"
          onChange={(event) => onUpload(event.target.files?.[0])}
        />
        {asset.dataUrl ? <button type="button" onClick={onRemove}>Remove</button> : null}
      </div>
      {asset.name ? <p className="logo-upload__filename">{asset.name}</p> : null}
      {error ? <p className="logo-upload__error" role="alert">{error}</p> : null}
    </div>
  )
}

function readDesignDraft(): SavedDesignDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem('we-saved-design')
    return value ? (JSON.parse(value) as SavedDesignDraft) : null
  } catch {
    return null
  }
}

type CustomizerViewImage = ProductPersonalization['viewImages'][CustomizerView]

function StudioBaseImage({
  image,
  alt,
  managed,
}: {
  image: CustomizerViewImage
  alt: string
  managed: boolean
}) {
  const cropId = `studio-base-crop-${useId().replace(/:/g, '')}`
  if (image.crop && !managed) {
    const crop = image.crop
    return (
      <svg
        className="studio-preview__base"
        data-custom-base="true"
        data-custom-base-src={image.src}
        data-preview-source="catalog-crop"
        role="img"
        aria-label={alt}
        viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`}
        preserveAspectRatio="xMidYMid meet"
        overflow="hidden"
      >
        <title>{alt}</title>
        <defs>
          <clipPath id={cropId}>
            <rect x={crop.x} y={crop.y} width={crop.width} height={crop.height} />
          </clipPath>
        </defs>
        <image
          href={image.src}
          x="0"
          y="0"
          width={crop.sourceWidth}
          height={crop.sourceHeight}
          clipPath={`url(#${cropId})`}
        />
      </svg>
    )
  }

  return (
    <img
      className="studio-preview__base"
      data-custom-base="true"
      data-custom-base-src={image.src}
      data-preview-source={managed ? 'backend' : 'catalog'}
      src={image.src}
      alt={alt}
      width="1600"
      height="1600"
    />
  )
}

export function CustomPage() {
  const { config, products, series } = useSiteConfig()
  const personalizableProducts = useMemo(() => products.filter((product) => product.personalizable), [products])
  const fallbackProduct = personalizableProducts[0] ?? config.catalog.products.find((product) => product.personalizable)!
  const findProduct = (slug?: string | null) => slug ? products.find((product) => product.slug === slug) : undefined
  const findSeries = (slug?: string | null) => slug ? series.find((item) => item.slug === slug) : undefined
  const [searchParams, setSearchParams] = useSearchParams()
  const draft = useMemo(readDesignDraft, [])
  const requestedProduct = findProduct(searchParams.get('style'))
  const draftProduct = findProduct(draft?.productSlug)
  const legacyDraftProduct = personalizableProducts.find(
    (product) => findSeries(product.series)?.name === draft?.template,
  )
  const initialProduct = requestedProduct?.personalizable
    ? requestedProduct
    : draftProduct?.personalizable
      ? draftProduct
      : legacyDraftProduct ?? fallbackProduct
  const draftColorName = draft?.colorName ?? draft?.color?.name
  const [step, setStep] = useState(0)
  const [selectedProductSlug, setSelectedProductSlug] = useState(initialProduct.slug)
  const [city, setCity] = useState(draft?.city ?? 'SACRAMENTO')
  const [name, setName] = useState(draft?.name ?? 'MORGAN')
  const [number, setNumber] = useState(draft?.number ?? '17')
  const [logos, setLogos] = useState<StudioLogos>(() => ({
    front: {
      dataUrl: draft?.logos?.front?.dataUrl ?? draft?.logoDataUrl ?? '',
      name: draft?.logos?.front?.name ?? draft?.logoName ?? '',
    },
    leftSleeve: {
      dataUrl: draft?.logos?.leftSleeve?.dataUrl ?? '',
      name: draft?.logos?.leftSleeve?.name ?? '',
    },
    rightSleeve: {
      dataUrl: draft?.logos?.rightSleeve?.dataUrl ?? '',
      name: draft?.logos?.rightSleeve?.name ?? '',
    },
  }))
  const [logoErrors, setLogoErrors] = useState<Record<LogoSlot, string>>({
    front: '',
    leftSleeve: '',
    rightSleeve: '',
  })
  const [artworkPositions, setArtworkPositions] = useState<ArtworkPositions>(draft?.artworkPositions ?? {})
  const [managedPreviewImages, setManagedPreviewImages] = useState<ManagedCustomizerImages>({})
  const [color, setColor] = useState(colors.find((item) => item.name === draftColorName) ?? colors[0]!)
  const [size, setSize] = useState<ApparelSize>(
    isApparelSize(searchParams.get('size'))
      ? searchParams.get('size') as ApparelSize
      : isApparelSize(draft?.size) ? draft.size : 'M',
  )
  const [view, setView] = useState<StudioView>(isStudioView(draft?.view) ? draft.view : 'front')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [rightsConfirmed, setRightsConfirmed] = useState(false)
  const [proofCreated, setProofCreated] = useState(false)
  const [proofRevision, setProofRevision] = useState(1)
  const [designId] = useState(
    () => `WE-CY-${Date.now().toString(36).slice(-6).toUpperCase()}`,
  )
  const { addItem } = useCart()
  const navigate = useNavigate()

  const steps = ['CHOOSE', 'PERSONALIZE', 'REVIEW', 'ORDER & TRACK']
  const selectedProduct = findProduct(selectedProductSlug) ?? fallbackProduct
  const templateSeries = findSeries(selectedProduct.series) ?? series[0] ?? config.catalog.series[0]!
  const personalization = selectedProduct.personalization
  const enabledRegions = personalization?.regions.filter((region) => {
    if (region.kind === 'city') return config.customizer.cityEnabled
    if (region.kind === 'name') return config.customizer.playerNameEnabled
    if (region.kind === 'number') return config.customizer.numberEnabled
    if (region.logoSlot === 'front') return config.customizer.frontLogoEnabled
    return config.customizer.sleeveLogosEnabled
  }) ?? []
  const managedPreviewImage = managedPreviewImages[view]
  const catalogPreviewImage = personalization?.viewImages[view]
  const previewImage: CustomizerViewImage = managedPreviewImage
    ? {
        src: withUploadVersion(managedPreviewImage),
        alt: `${selectedProduct.name} ${studioViewLabels[view]} view uploaded through the preview admin`,
      }
    : catalogPreviewImage ?? { src: selectedProduct.image, alt: `${selectedProduct.name} preview` }
  const templateImage = managedPreviewImages.front
    ? withUploadVersion(managedPreviewImages.front)
    : personalization?.viewImages.front.src ?? personalization?.cleanImage ?? selectedProduct.image
  const proofVersion = `P${String(proofRevision).padStart(2, '0')}`
  const next = () => setStep((current) => Math.min(steps.length - 1, current + 1))
  const previous = () => setStep((current) => Math.max(0, current - 1))

  const syncQuery = (productSlug: string, selectedSize: ApparelSize) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('style', productSlug)
    nextParams.set('size', selectedSize)
    setSearchParams(nextParams, { replace: true })
  }

  useEffect(() => {
    if (searchParams.get('style') === selectedProductSlug && searchParams.get('size') === size) return
    syncQuery(selectedProductSlug, size)
  }, [searchParams, selectedProductSlug, size])

  useEffect(() => {
    const controller = new AbortController()
    setManagedPreviewImages({})
    if (!personalization) return () => controller.abort()

    fetch(`/api/customizer-images?product=${encodeURIComponent(selectedProduct.slug)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then(async (response) => {
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return null
        return response.json() as Promise<CustomizerImagesResponse>
      })
      .then((payload) => {
        if (payload?.productSlug === selectedProduct.slug) setManagedPreviewImages(payload.images)
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setManagedPreviewImages({})
      })

    return () => controller.abort()
  }, [personalization, selectedProduct.slug])

  useEffect(() => {
    const saveTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          'we-saved-design',
          JSON.stringify({
            productSlug: selectedProduct.slug,
            template: templateSeries.name,
            city,
            name,
            number,
            logoDataUrl: logos.front.dataUrl,
            logoName: logos.front.name,
            logos,
            artworkPositions,
            colorName: color.name,
            size,
            view,
          }),
        )
        setSaveError(false)
      } catch {
        setSaveError(true)
      }
    }, 150)
    return () => window.clearTimeout(saveTimer)
  }, [artworkPositions, city, color.name, logos, name, number, selectedProduct.slug, size, templateSeries.name, view])

  useEffect(() => {
    if (!proofCreated || ordered) return
    setProofRevision((current) => current + 1)
    setProofCreated(false)
    setSaved(false)
    setRightsConfirmed(false)
  }, [artworkPositions, city, color.name, logos, name, number, ordered, selectedProduct.slug, size])

  const save = () => {
    try {
      window.localStorage.setItem(
        'we-saved-design',
        JSON.stringify({
          productSlug: selectedProduct.slug,
          template: templateSeries.name,
          city,
          name,
          number,
          logoDataUrl: logos.front.dataUrl,
          logoName: logos.front.name,
          logos,
          artworkPositions,
          colorName: color.name,
          size,
          view,
        }),
      )
      setSaved(true)
      setProofCreated(true)
      setSaveError(false)
    } catch {
      setSaved(false)
      setSaveError(true)
    }
  }
  const handleLogoUpload = (slot: LogoSlot, file: File | undefined) => {
    if (!file) return
    const setSlotError = (message: string) => {
      setLogoErrors((current) => ({ ...current, [slot]: message }))
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setSlotError('Use a PNG, JPG, or WEBP logo file.')
      return
    }
    if (file.size > config.customizer.maxLogoSizeMb * 1024 * 1024) {
      setSlotError(`Keep the logo file under ${config.customizer.maxLogoSizeMb} MB for this browser proof.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setSlotError('This logo could not be read. Try another file.')
        return
      }
      setLogos((current) => ({ ...current, [slot]: { dataUrl: reader.result as string, name: file.name } }))
      setSlotError('')
      setView(slot === 'front' ? 'front' : slot === 'leftSleeve' ? 'left' : 'right')
      setOrdered(false)
    }
    reader.onerror = () => setSlotError('This logo could not be read. Try another file.')
    reader.readAsDataURL(file)
  }

  const removeLogo = (slot: LogoSlot) => {
    setLogos((current) => ({ ...current, [slot]: { dataUrl: '', name: '' } }))
    setLogoErrors((current) => ({ ...current, [slot]: '' }))
    setOrdered(false)
  }

  const updateArtworkPosition = (id: PersonalizationRegion['id'], position: ArtworkPosition) => {
    setArtworkPositions((current) => ({ ...current, [id]: position }))
    setOrdered(false)
  }

  const addDesign = () => {
    if (!rightsConfirmed) return
    const logoSummary = [logos.front.name, logos.leftSleeve.name, logos.rightSleeve.name]
      .filter(Boolean)
      .join(' / ')
    addItem({
      id: `custom-${selectedProduct.slug}-${city}-${name}-${number}-${size}-${color.name}`,
      productSlug: selectedProduct.slug,
      name: `${selectedProduct.name} / Personalized`,
      detail: `${city || 'No city'} · ${name || 'No player name'} · ${number || 'No number'} · ${logoSummary || 'No custom logos'} · ${size} · ${color.name}`,
      price: selectedProduct.price,
      image: templateImage,
      designId,
      proofVersion,
    })
    setOrdered(true)
  }

  if (!config.customizer.enabled) return <NotFoundPage />

  return (
    <section className="studio-page">
      <div className="studio-top shell">
        <div>
          <p className="eyebrow">WE Studio / 2D preview</p>
          <h1>Create yours.</h1>
        </div>
        <ol className="studio-progress" aria-label="Customization progress">
          {steps.map((label, index) => (
            <li className={index === step ? 'is-current' : index < step ? 'is-complete' : ''} key={label}>
              <button type="button" onClick={() => setStep(index)} disabled={ordered} aria-current={index === step ? 'step' : undefined}>
                <span>{index < step ? <Check size={15} /> : index + 1}</span>{label}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="studio-workspace shell">
        <div className="studio-preview">
          <p className="studio-preview__label">
            Interactive sample / {studioViewLabels[view]}
            {personalization ? <span><CheckCircle size={14} weight="fill" /> Original artwork matched</span> : null}
            {managedPreviewImage ? <span data-managed-preview="true"><CheckCircle size={14} weight="fill" /> Admin image</span> : null}
          </p>
          {personalization ? (
            <div className="studio-preview__position-help">
              <p>Drag each city, name, number, or logo to move it. Use its corner handle to resize it; arrow keys provide precise adjustments.</p>
              <button type="button" disabled={!Object.keys(artworkPositions).length} onClick={() => setArtworkPositions({})}>Reset layout</button>
            </div>
          ) : null}
          <div
            className={`studio-preview__canvas studio-preview__canvas--${view}`}
            style={{ '--studio-color': color.value } as CSSProperties}
          >
            <StudioBaseImage
              image={previewImage}
              managed={Boolean(managedPreviewImage)}
              alt={`${previewImage.alt}${view === 'front' ? ` with city ${city} and number ${number}` : view === 'back' ? ` with player name ${name} and number ${number}` : ''}`}
            />
            {personalization ? (
              <PersonalizationArtwork
                regions={enabledRegions}
                view={view}
                city={city}
                name={name}
                number={number}
                logos={logos}
                positions={artworkPositions}
                onPositionChange={updateArtworkPosition}
                ink={color.value}
                outline={personalization.sourceOutline}
              />
            ) : null}
          </div>
          <div className="view-switcher" aria-label="Jersey view">
            {(['front', 'back', 'left', 'right'] as const).map((option) => (
              <button
                className={view === option ? 'is-active' : ''}
                type="button"
                aria-pressed={view === option}
                data-studio-view={option}
                key={option}
                onClick={() => setView(option)}
              >
                {studioViewLabels[option]}
              </button>
            ))}
          </div>
        </div>
        <div className="studio-panel">
          {step === 0 ? (
            <div className="studio-step">
              <p className="eyebrow">Step 01</p>
              <h2>Choose an original.</h2>
              <p>Your design starts inside a WE series so every personal detail has a coherent foundation.</p>
              <div className="template-list">
                {personalizableProducts.map((item) => (
                  <button
                    type="button"
                    className={selectedProduct.slug === item.slug ? 'is-active' : ''}
                    aria-pressed={selectedProduct.slug === item.slug}
                    key={item.slug}
                    onClick={() => {
                      setSelectedProductSlug(item.slug)
                      setOrdered(false)
                      syncQuery(item.slug, size)
                    }}
                  >
                    <img src={item.image} alt="" width="1672" height="941" />
                    <span><strong>{item.name}</strong><small>{findSeries(item.series)?.name}</small></span>
                    {selectedProduct.slug === item.slug ? <CheckCircle size={22} weight="fill" /> : null}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {step === 1 ? (
            <div className="studio-step">
              <p className="eyebrow">Step 02</p>
              <h2>Make it personal.</h2>
              <div className="field-grid">
                {config.customizer.cityEnabled ? <label>City name <input name="city-name" autoComplete="off" value={city} maxLength={18} onChange={(event) => setCity(event.target.value.toUpperCase())} /></label> : null}
                {config.customizer.playerNameEnabled ? <label>Player name <input name="player-name" autoComplete="off" value={name} maxLength={14} onChange={(event) => setName(event.target.value.toUpperCase())} /></label> : null}
                {config.customizer.numberEnabled ? <label>Number <input name="jersey-number" autoComplete="off" inputMode="numeric" pattern="[0-9]{0,2}" maxLength={2} value={number} onChange={(event) => setNumber(event.target.value.replace(/\D/g, ''))} /></label> : null}
                <label>Size
                  <select
                    name="size"
                    value={size}
                    onChange={(event) => {
                      const nextSize = event.target.value as ApparelSize
                      setSize(nextSize)
                      setOrdered(false)
                      syncQuery(selectedProduct.slug, nextSize)
                    }}
                  >
                    {apparelSizes.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              {personalization ? (
                <div className="artwork-match" role="status">
                  <CheckCircle size={22} weight="fill" />
                  <div>
                    <strong>Original artwork mapped</strong>
                    <p>{personalization.detectedSourceElements.join(' · ')}</p>
                    <small>The source marks are removed first; each replacement starts in the mapped area and can then be moved in the preview.</small>
                  </div>
                </div>
              ) : null}
              <fieldset className="logo-placements">
                <legend>Logo placements</legend>
                <p>Upload each location independently. A sleeve upload opens that sleeve preview automatically.</p>
                {config.customizer.frontLogoEnabled ? <LogoUploadField
                  inputId="custom-logo"
                  inputName="custom-logo"
                  label="Front logo"
                  help={`Transparent PNG recommended. JPG or WEBP also accepted, up to ${config.customizer.maxLogoSizeMb} MB.`}
                  asset={logos.front}
                  error={logoErrors.front}
                  onUpload={(file) => handleLogoUpload('front', file)}
                  onRemove={() => removeLogo('front')}
                /> : null}
                {config.customizer.sleeveLogosEnabled ? <LogoUploadField
                  inputId="left-sleeve-logo"
                  inputName="left-sleeve-logo"
                  label="Left sleeve logo"
                  help="Independent artwork for the left sleeve preview."
                  asset={logos.leftSleeve}
                  error={logoErrors.leftSleeve}
                  onUpload={(file) => handleLogoUpload('leftSleeve', file)}
                  onRemove={() => removeLogo('leftSleeve')}
                /> : null}
                {config.customizer.sleeveLogosEnabled ? <LogoUploadField
                  inputId="right-sleeve-logo"
                  inputName="right-sleeve-logo"
                  label="Right sleeve logo"
                  help="Independent artwork for the right sleeve preview."
                  asset={logos.rightSleeve}
                  error={logoErrors.rightSleeve}
                  onUpload={(file) => handleLogoUpload('rightSleeve', file)}
                  onRemove={() => removeLogo('rightSleeve')}
                /> : null}
              </fieldset>
              <fieldset className="color-picker">
                <legend>Accent color</legend>
                <div>
                  {colors.map((option) => (
                    <button
                      type="button"
                      key={option.name}
                      aria-label={option.name}
                      aria-pressed={color.name === option.name}
                      className={color.name === option.name ? 'is-active' : ''}
                      style={{ backgroundColor: option.value }}
                      onClick={() => setColor(option)}
                    ><span className="sr-only">{option.name}</span></button>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="studio-step review-step">
              <p className="eyebrow">Step 03</p>
              <h2>Review every detail.</h2>
              <dl>
                <div><dt>Original</dt><dd>{selectedProduct.name}</dd></div>
                <div><dt>Series</dt><dd>{templateSeries.name}</dd></div>
                <div><dt>City</dt><dd>{city || 'None'}</dd></div>
                <div><dt>Player / number</dt><dd>{name || 'None'} / {number || 'None'}</dd></div>
                <div><dt>Front logo</dt><dd>{logos.front.name || 'None'}</dd></div>
                <div><dt>Left sleeve logo</dt><dd>{logos.leftSleeve.name || 'None'}</dd></div>
                <div><dt>Right sleeve logo</dt><dd>{logos.rightSleeve.name || 'None'}</dd></div>
                <div><dt>Accent</dt><dd>{color.name}</dd></div>
                <div><dt>Size</dt><dd>{size}</dd></div>
                <div><dt>Design ID</dt><dd>{designId}</dd></div>
                <div><dt>Proof Version</dt><dd>{proofVersion}</dd></div>
                {config.commerce.displayPrices ? <div><dt>Price</dt><dd>{formatPrice(selectedProduct.price)}</dd></div> : null}
              </dl>
              <button className="text-link text-link--button" type="button" onClick={save}>
                {saved ? <><Check size={17} /> Design saved locally</> : <>Save this design <ArrowRight size={17} /></>}
              </button>
              <p className="draft-status" role="status">{saveError ? 'Browser storage is unavailable. Keep this page open to preserve the draft.' : 'Draft changes are kept in this browser.'}</p>
              <label className="rights-confirmation">
                <input name="rights-confirmation" type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} />
                I confirm the submitted city, player name, number, and artwork are mine to use and may be reviewed before production.
              </label>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="studio-step order-step">
              <p className="eyebrow">Step 04</p>
              <h2>Order & track.</h2>
              {ordered ? (
                <div className="order-confirmation" role="status">
                  <CheckCircle size={42} weight="fill" />
                  <h3>Proof frozen for order review.</h3>
                  <p><strong>Design ID {designId}</strong><br />Proof Version {proofVersion} is read-only in this selection. No payment or production order has been processed.</p>
                  <button className="button button--dark" type="button" onClick={() => navigate('/cart')}>View selection <ArrowRight size={18} /></button>
                </div>
              ) : (
                <>
                  <div className="production-path">
                    <div><span>01</span><p><strong>Design locked</strong>Details are confirmed.</p></div>
                    <div><span>02</span><p><strong>Production</strong>Status connects here.</p></div>
                    <div><span>03</span><p><strong>Inspection</strong>Release after review.</p></div>
                    <div><span>04</span><p><strong>Delivery</strong>Tracking connects here.</p></div>
                  </div>
                  <button className="button button--dark" type="button" onClick={addDesign} disabled={!rightsConfirmed}>Freeze proof for order review <ArrowRight size={18} /></button>
                  {!rightsConfirmed ? <p className="draft-status">Return to REVIEW and confirm content rights before freezing the proof.</p> : null}
                </>
              )}
            </div>
          ) : null}
          <div className="studio-nav">
            <button type="button" onClick={previous} disabled={step === 0 || ordered}><ArrowLeft size={17} /> Back</button>
            {step < steps.length - 1 ? <button type="button" onClick={next} disabled={ordered}>Continue to {steps[step + 1] ?? 'next step'} <ArrowRight size={17} /></button> : null}
          </div>
          <p className="prototype-note">Temporary screen-preview color tokens are not official brand color values. Production settings, price, and availability require verified catalog data.</p>
        </div>
      </div>
      <aside className="create-disclaimer shell" aria-labelledby="create-disclaimer-title">
        <p className="eyebrow" id="create-disclaimer-title">{config.customizer.disclaimerTitle}</p>
        <p>{config.customizer.disclaimer}</p>
      </aside>
    </section>
  )
}

export function StoriesPage() {
  const { config, stories } = useSiteConfig()
  const page = pageSetting(config, 'stories')
  if (!page.enabled) return <NotFoundPage />
  return (
    <>
      <PageIntro index={page.eyebrow} title={page.title} copy={page.description} />
      <section className="journal-grid section-pad shell">
        {stories.map((story, index) => (
          <article className={index === 0 ? 'journal-card journal-card--feature' : 'journal-card'} key={story.slug}>
            <Link to={`/stories/${story.slug}`}>
              <img src={story.image} alt="" loading={index ? 'lazy' : 'eager'} width="1672" height="941" />
              <p className="eyebrow">{story.category} / {story.readTime} read</p>
              <h2>{story.title}</h2>
              <p>{story.excerpt}</p>
            </Link>
          </article>
        ))}
      </section>
    </>
  )
}

export function StoryPage() {
  const { slug } = useParams()
  const { stories } = useSiteConfig()
  const story = stories.find((item) => item.slug === slug)
  if (!story) return <NotFoundPage />

  return (
    <article className="article-page">
      <header className="article-header shell">
        <Link className="back-link" to="/stories"><ArrowLeft size={17} /> Stories</Link>
        <p className="eyebrow">{story.category} / {story.readTime} read</p>
        <h1>{story.title}</h1>
        <p>{story.excerpt}</p>
      </header>
      <img className="article-hero" src={story.image} alt="" fetchPriority="high" width="1672" height="941" />
      <div className="article-body">
        <p className="article-lede">The visible design is only the surface. Under it are decisions about identity, memory, and the way a piece will move through the world.</p>
        <h2>An original before an identifier</h2>
        <p>WE begins with a complete visual idea. Personal details are then integrated into that system so the finished piece feels intentional from every angle.</p>
        <blockquote>Meaning does not need to be loud. It needs to be unmistakably yours.</blockquote>
        <h2>Made to keep its story</h2>
        <p>Material, placement, and finish are treated as one experience. The aim is a piece that reads clearly now and carries its context forward.</p>
        <Link className="button button--dark" to="/collections">Explore the originals <ArrowRight size={18} /></Link>
      </div>
    </article>
  )
}

export function CraftsmanshipPage() {
  const { config } = useSiteConfig()
  const page = pageSetting(config, 'craftsmanship')
  const stages = [
    ['01', 'Concept', 'Each piece begins as a WE visual system, not a blank template.'],
    ['02', 'Specification', 'Materials and construction become public only after evidence is approved.'],
    ['03', 'Personalization', 'Names, numbers, and marks are placed inside the original composition.'],
    ['04', 'Inspection', 'Verified checks can record alignment, color, construction, and finish before release.'],
  ]
  if (!page.enabled) return <NotFoundPage />
  return (
    <>
      <section className="craft-hero">
        <img src={page.image || '/images/craft-embroidery.webp'} alt="A craftsperson inspecting gold embroidery" fetchPriority="high" width="1672" height="941" />
        <div className="craft-hero__content shell"><p className="eyebrow eyebrow--gold">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p></div>
      </section>
      <section className="process-section section-pad shell">
        <SectionHeading eyebrow="The build" title="From original idea to inspected piece." copy="A visible, understandable process gives every personalized decision a place to belong." />
        <div className="process-list">
          {stages.map(([index, title, copy]) => <article key={title}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>
      <section className="material-proof section-pad">
        <div className="shell split-feature split-feature--reverse">
          <img src="/images/water-ripple.webp" alt="White Pulse garment concept above a flowing surface" loading="lazy" width="1672" height="941" />
          <div><p className="eyebrow">Evidence before claims</p><h2>Meaning first. Specifications verified.</h2><p>Final material, care, construction, and test information will appear only when a traceable product record is approved. No unsupported performance claim is presented here.</p></div>
        </div>
      </section>
    </>
  )
}

export function CommunityPage() {
  const { config } = useSiteConfig()
  const page = pageSetting(config, 'community')
  if (!page.enabled) return <NotFoundPage />
  return (
    <>
      <section className="community-hero">
        <img src={page.image || '/images/hero-stadium.webp'} alt="An athlete wearing a personalized WE jersey" fetchPriority="high" width="1672" height="941" />
        <div className="community-hero__content shell"><p className="eyebrow eyebrow--gold">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p></div>
      </section>
      <section className="community-grid section-pad shell">
        <article className="community-grid__quote"><p>Verified wearer stories will live here.</p><span>Consent, moderation, attribution, and withdrawal controls required before publication</span></article>
        <img src="/images/water-ripple.webp" alt="White Pulse creative concept study" loading="lazy" width="1672" height="941" />
        <img src="/images/craft-embroidery.webp" alt="Embroidery detail study" loading="lazy" width="1672" height="941" />
        <article className="community-grid__cta"><HandHeart size={32} /><h2>Share the meaning.</h2><p>Community submission workflows can connect here once moderation and consent systems are approved.</p><Link className="text-link" to="/support">Learn about submissions <ArrowRight size={17} /></Link></article>
      </section>
    </>
  )
}

export function AboutPage() {
  const { config } = useSiteConfig()
  const page = pageSetting(config, 'about')
  if (!page.enabled) return <NotFoundPage />
  return (
    <>
      <PageIntro index={page.eyebrow} title={page.title} copy={page.description} />
      <section className="about-statement section-pad shell"><p>WE exists between two ideas that are usually separated:</p><h2>I am part of this.<br /><span>And this is still mine.</span></h2></section>
      <section className="about-pillars section-pad shell">
        <article><Cube size={30} /><p className="eyebrow">Original</p><h3>Begin with a point of view.</h3><p>Every WE series is designed as a complete visual world before personalization begins.</p></article>
        <article><Needle size={30} /><p className="eyebrow">Personal</p><h3>Build meaning into the object.</h3><p>Details are integrated into composition, construction, and finish.</p></article>
        <article><UsersThree size={30} /><p className="eyebrow">Together</p><h3>Make room for the individual.</h3><p>Team identity gets stronger when every person can see themselves inside it.</p></article>
      </section>
    </>
  )
}

export function TeamPage() {
  const { config } = useSiteConfig()
  const page = pageSetting(config, 'team')
  const [submitted, setSubmitted] = useState(false)
  if (!page.enabled || !config.commerce.teamBriefEnabled) return <NotFoundPage />
  return (
    <>
      <PageIntro index={page.eyebrow} title={page.title} copy={page.description} />
      <section className="team-page section-pad shell">
        <div className="team-process">
          {['Share the brief', 'Build the visual system', 'Approve player details', 'Produce and track'].map((item, index) => <div key={item}><span>0{index + 1}</span><h2>{item}</h2></div>)}
        </div>
        <form className="team-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
          <p className="eyebrow">Brief intake prototype</p><h2>Tell us what you’re building.</h2>
          {submitted ? <div className="order-confirmation" role="status"><CheckCircle size={42} weight="fill" /><h3>Brief captured for this prototype.</h3><p>No message was sent. Connect the production CRM before launch.</p></div> : <>
            <label>Name <input name="contact-name" maxLength={80} required autoComplete="name" /></label>
            <label>Work email <input name="email" type="email" maxLength={120} required autoComplete="email" spellCheck={false} /></label>
            <label>Organization <input name="organization" maxLength={120} required autoComplete="organization" /></label>
            <div className="field-grid">
              <label>Estimated group size <select name="group-size" defaultValue="" required><option value="" disabled>Select a range</option><option>10–24</option><option>25–49</option><option>50–99</option><option>100+ / eligibility TBD</option></select></label>
              <label>Needed by <input name="needed-by" type="date" autoComplete="off" required /></label>
            </div>
            <label>Team or event type <select name="purpose" defaultValue="" required><option value="" disabled>Select one</option><option>School or club</option><option>Company or organization</option><option>Event or creative community</option><option>Other</option></select></label>
            <label>What are you creating? <textarea name="brief" rows={4} maxLength={1000} required /></label>
            <button className="button button--dark" type="submit">Save sample brief <ArrowRight size={18} /></button>
          </>}
        </form>
      </section>
    </>
  )
}

export function CartPage() {
  const { config } = useSiteConfig()
  const { items, subtotal, hasPendingPricing, removeItem, restoreItem, updateQuantity } = useCart()
  const [removed, setRemoved] = useState<CartItem | null>(null)
  const remove = (item: CartItem) => {
    removeItem(item.id)
    setRemoved(item)
  }
  const undoRemove = () => {
    if (!removed) return
    restoreItem(removed)
    setRemoved(null)
  }
  return (
    <section className="cart-page shell">
      <div className="page-title-row"><div><p className="eyebrow">Your selection</p><h1>Cart</h1></div><p>{items.length} {items.length === 1 ? 'piece' : 'pieces'}</p></div>
      {items.length ? <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => <article className="cart-item" key={item.id}>
            <img src={item.image} alt="" width="941" height="941" />
            <div><h2>{item.name}</h2><p>{item.detail}</p>{item.designId ? <p>Design ID {item.designId} · Proof {item.proofVersion}</p> : null}<button type="button" onClick={() => remove(item)}>Remove</button></div>
            <label>Quantity <select name={`quantity-${item.id}`} value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))}>{[1,2,3,4].map((value) => <option key={value}>{value}</option>)}</select></label>
            {config.commerce.displayPrices ? <p>{formatPrice(item.price.status === 'confirmed' ? { ...item.price, amount: item.price.amount * item.quantity } : item.price)}</p> : null}
          </article>)}
        </div>
        <aside className="order-summary"><p className="eyebrow">Order review</p>{config.commerce.displayPrices ? <div><span>Subtotal</span><strong>{subtotal === null ? 'PRICE TBD' : formatPrice({ status: 'confirmed', amount: subtotal, currency: 'USD' })}</strong></div> : null}<div><span>Shipping</span><span>{config.commerce.shippingLabel}</span></div><div><span>Tax</span><span>{config.commerce.taxLabel}</span></div>{config.commerce.checkoutEnabled ? <Link className="button button--dark" to="/checkout">Continue to order review <ArrowRight size={18} /></Link> : <p className="prototype-note">Checkout is currently unavailable.</p>}<p className="prototype-note">{hasPendingPricing ? 'One or more prices remain unverified. This flow cannot collect payment or create a production order.' : 'No charge will be made in this concept build.'}</p></aside>
      </div> : <div className="empty-state empty-state--large"><BagIcon /><h2>Your cart is open space.</h2><p>Choose a WE original or begin a personalized piece.</p><Link className="button button--dark" to="/collections">Explore originals <ArrowRight size={18} /></Link></div>}
      {removed ? <div className="undo-toast" role="status"><span>{removed.name} removed.</span><button type="button" onClick={undoRemove}>Undo</button><button type="button" aria-label="Dismiss removed item message" onClick={() => setRemoved(null)}>×</button></div> : null}
    </section>
  )
}

function BagIcon() { return <Package size={42} weight="light" /> }

export function CheckoutPage() {
  const { config } = useSiteConfig()
  const { items, subtotal, hasPendingPricing, clearCart } = useCart()
  const [complete, setComplete] = useState(false)
  if (!config.commerce.checkoutEnabled) return <Navigate to="/cart" replace />
  if (!items.length && !complete) return <Navigate to="/cart" replace />

  return (
    <section className="checkout-page shell">
      <div className="checkout-heading"><p className="eyebrow">Non-transactional prototype</p><h1>Order review</h1><p>No payment, production order, or personal data will be transmitted.</p></div>
      {complete ? <div className="checkout-complete"><CheckCircle size={56} weight="fill" /><p className="eyebrow">Demo complete</p><h2>Your experience is ready for integration.</h2><p>This prototype intentionally stops before payment processing.</p><Link className="button button--dark" to="/">Return home</Link></div> : <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); setComplete(true); clearCart() }}>
        <div className="checkout-fields">
          <fieldset><legend>Contact</legend><label>Email <input name="email" type="email" maxLength={120} autoComplete="email" spellCheck={false} required /></label></fieldset>
          <fieldset>
            <legend>Delivery address</legend>
            <div className="field-grid">
              <label>First name <input name="given-name" maxLength={80} autoComplete="given-name" required /></label>
              <label>Last name <input name="family-name" maxLength={80} autoComplete="family-name" required /></label>
            </div>
            <label>Address <input name="street-address" maxLength={160} autoComplete="street-address" required /></label>
            <div className="field-grid">
              <label>City <input name="city" maxLength={100} autoComplete="address-level2" required /></label>
              <label>State <select name="state" autoComplete="address-level1" defaultValue="" required><option value="" disabled>Select</option><option>California</option><option>New York</option><option>Texas</option><option>Other</option></select></label>
            </div>
            <label>ZIP code <input name="postal-code" inputMode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" maxLength={10} title="Enter a 5-digit ZIP code or ZIP+4" autoComplete="postal-code" required /></label>
          </fieldset>
          <fieldset><legend>Pricing &amp; payment status</legend><div className="demo-payment"><ShieldCheck size={25} /><p><strong>{hasPendingPricing ? 'PRICE TBD · payment unavailable' : 'Payment integration intentionally disabled'}</strong><br />Verified catalog pricing, approved terms, and a compliant payment provider are required before launch.</p></div></fieldset>
        </div>
        <aside className="order-summary"><p className="eyebrow">Review summary</p>{items.map((item) => <p key={item.id}>{item.name} × {item.quantity}{item.designId ? <><br /><small>{item.designId} / {item.proofVersion}</small></> : null}</p>)}<div><span>Total</span><strong>{subtotal === null ? 'PRICE TBD' : formatPrice({ status: 'confirmed', amount: subtotal, currency: 'USD' })}</strong></div><button className="button button--dark" type="submit">Complete review demo <ArrowRight size={18} /></button></aside>
      </form>}
    </section>
  )
}

export function AccountPage() {
  const { config } = useSiteConfig()
  const page = pageSetting(config, 'account')
  const [mode, setMode] = useState<'signin' | 'create'>('signin')
  const [submitted, setSubmitted] = useState(false)
  if (!page.enabled) return <NotFoundPage />
  return (
    <section className="account-page shell">
      <div className="account-page__art"><img src={page.image || '/images/hero-stadium.webp'} alt="" width="1672" height="941" /><div><p className="eyebrow eyebrow--gold">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p></div></div>
      <form className="account-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
        <div className="account-tabs"><button type="button" className={mode === 'signin' ? 'is-active' : ''} onClick={() => setMode('signin')}>Sign in</button><button type="button" className={mode === 'create' ? 'is-active' : ''} onClick={() => setMode('create')}>Create account</button></div>
        {submitted ? <div className="order-confirmation" role="status"><CheckCircle size={42} weight="fill" /><h2>Prototype form complete.</h2><p>Authentication is not connected in this concept build.</p></div> : <><p className="eyebrow">{mode === 'signin' ? 'Welcome back' : 'Start your WE'}</p><h2>{mode === 'signin' ? 'Your story continues.' : 'Keep every detail together.'}</h2>{mode === 'create' ? <label>Name <input name="name" maxLength={80} required autoComplete="name" /></label> : null}<label>Email <input name="email" type="email" maxLength={120} required autoComplete="email" spellCheck={false} /></label><label>Password <input name="password" type="password" minLength={8} maxLength={128} required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></label><button className="button button--dark" type="submit">{mode === 'signin' ? 'Sign in' : 'Create prototype account'} <ArrowRight size={18} /></button></>}
      </form>
    </section>
  )
}

export function TrackPage() {
  const { config } = useSiteConfig()
  const page = pageSetting(config, 'track')
  const [submitted, setSubmitted] = useState(false)
  if (!page.enabled || !config.commerce.orderTrackingEnabled) return <NotFoundPage />
  return (
    <section className="track-page shell">
      <div><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p></div>
      <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label>Order number <input name="order-number" autoComplete="off" spellCheck={false} placeholder="e.g., WE-000000…" pattern="WE-[0-9]{6}" maxLength={9} title="Use the format WE-000000" required /></label><label>Email address <input name="email" type="email" maxLength={120} autoComplete="email" spellCheck={false} required /></label><button className="button button--light" type="submit">Find prototype order <ArrowRight size={18} /></button>{submitted ? <p className="form-success" role="status">Tracking is not connected in this prototype. Add the fulfillment API here before launch.</p> : null}</form>
    </section>
  )
}

export function SearchPage() {
  const { products, series, stories } = useSiteConfig()
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const citySlug = params.get('city') ?? ''
  const city = cityChoices.find((item) => item.slug === citySlug)
  const unknownCity = Boolean(citySlug && !city)
  const [query, setQuery] = useState(initial)
  const results = useMemo(() => searchCatalog(initial, { products, series, stories }), [initial, products, series, stories])
  const cityProducts = city
    ? city.productSlugs.map((slug) => products.find((product) => product.slug === slug)).filter((product): product is NonNullable<typeof product> => Boolean(product))
    : []
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setParams(query.trim() ? { q: query.trim() } : {}) }
  return (
    <section className="search-page shell">
      <p className="eyebrow">{city || unknownCity ? 'Find your city' : 'Search WE'}</p><h1>{city ? `${city.name} originals.` : unknownCity ? 'No city edit yet.' : initial ? `Results for “${initial}”` : 'Find your way in.'}</h1>
      <form role="search" onSubmit={submit}><label htmlFor="search-page-input">Search products, series, and stories</label><input id="search-page-input" name="q" type="search" autoComplete="off" spellCheck={false} value={query} onChange={(event) => setQuery(event.target.value)} /><button type="submit"><ArrowRight size={23} /><span className="sr-only">Search</span></button></form>
      {city ? (
        <div className="city-results">
          <div className="city-results__intro"><p>{city.statement}</p><span>{cityProducts.length} original pieces / prototype</span></div>
          <div className="product-grid">{cityProducts.map((product, index) => <ProductCard key={product.slug} product={product} priority={index < 2} />)}</div>
          <p className="city-results__note">City discovery is an original WE merchandising layer. It does not imply affiliation with a league, team, athlete, or third-party brand.</p>
        </div>
      ) : unknownCity ? (
        <div className="city-results">
          <div className="empty-state empty-state--large" role="status">
            <h2>That city is not in the current edit.</h2>
            <p>Try a popular city, explore every original series, or begin a personalized piece.</p>
            <div className="city-chips" aria-label="Popular cities">
              {cityChoices.map((item) => <Link key={item.slug} to={`/search?city=${item.slug}`}>{item.name}</Link>)}
            </div>
            <div className="button-row"><Link className="button button--dark" to="/collections">All series</Link><Link className="button button--outline" to="/custom">Create yours</Link></div>
          </div>
        </div>
      ) : (
        <>
          {initial ? <p className="search-count" role="status">{results.length} {results.length === 1 ? 'result' : 'results'}</p> : null}
          <div className="search-results">{results.map((result) => <article key={`${result.type}-${result.href}`}><Link to={result.href}><img src={result.image} alt="" width="1672" height="941" /><div><p className="eyebrow">{result.type}</p><h2>{result.title}</h2><p>{result.description}</p></div><ArrowUpRight size={23} /></Link></article>)}</div>
          {initial && !results.length ? <div className="empty-state"><h2>Nothing matched yet.</h2><p>Try a series name such as White Pulse, or search “jersey.”</p></div> : null}
        </>
      )}
    </section>
  )
}

const supportTopics = [
  ['Orders & tracking', 'See where an order is in production or delivery.', '/track'],
  ['Personalization', 'Understand names, numbers, colors, and approvals.', '/custom'],
  ['Team orders', 'Plan a consistent system for a full group.', '/team'],
  ['Shipping & returns', 'Review the policy framework prepared for launch.', '/legal/shipping'],
] as const

export function SupportPage() {
  const { config } = useSiteConfig()
  const page = pageSetting(config, 'support')
  if (!page.enabled) return <NotFoundPage />
  return (
    <>
      <PageIntro index={page.eyebrow} title={page.title} copy={page.description} />
      <section className="support-grid section-pad shell">{supportTopics.map(([title, copy, href], index) => <Link to={href} key={title}><span>0{index + 1}</span><div><h2>{title}</h2><p>{copy}</p></div><ArrowUpRight size={23} /></Link>)}</section>
      <section className="faq-section section-pad shell"><SectionHeading eyebrow="FAQ" title="A few useful answers." /><div>{[
        ['Can I personalize every WE piece?', 'Personalization availability is defined per product. Eligible sample items are clearly labeled in the prototype.'],
        ['How long does production take?', 'Live production estimates are intentionally withheld until they can be supplied by the operations system.'],
        ['Can WE support a whole team?', 'The prototype supports a structured brief intake. Eligibility, minimum quantity, capacity, timing, and commercial terms remain TBD.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    </>
  )
}

export function PolicyPage() {
  const { slug } = useParams()
  const { config } = useSiteConfig()
  const page = config.policies.find((item) => item.slug === slug && item.enabled)
  if (!page) return <NotFoundPage />
  return <article className="policy-page shell"><p className="eyebrow">WE / Legal & policy</p><h1>{page.title}</h1><p className="policy-page__intro">{page.intro}</p>{page.sections.map(({ title, copy }) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}<p className="prototype-note">Prototype content requires operational and legal approval before publication.</p></article>
}

export function NotFoundPage() {
  return <section className="not-found shell"><p className="eyebrow">404 / Outside the lines</p><h1>This route isn’t part of the current field.</h1><p>Return to the WE originals and choose a new path.</p><div className="button-row"><Link className="button button--dark" to="/">Go home <ArrowRight size={18} /></Link><Link className="button button--outline" to="/collections">All series</Link><Link className="button button--outline" to="/custom">Create yours</Link><Link className="button button--outline" to="/support">Support</Link></div></section>
}

function PageIntro({ index, title, copy }: { index: string; title: string; copy: string }) {
  return <header className="page-intro shell"><p className="eyebrow">{index}</p><div><h1>{title}</h1><p>{copy}</p></div></header>
}
