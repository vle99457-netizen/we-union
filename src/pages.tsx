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
  ShieldCheck,
  Sparkle,
  UsersThree,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatedContent } from './components/AnimatedContent'
import { ProductCard } from './components/ProductCard'
import { SectionHeading } from './components/SectionHeading'
import {
  formatPrice,
  getProduct,
  getSeries,
  products,
  prototypeNotice,
  searchCatalog,
  series,
  stories,
  worlds,
  type WorldSlug,
} from './data/catalog'
import { useCart, type CartItem } from './store/CartContext'

const promiseItems = [
  {
    title: 'Original design',
    copy: 'Every piece begins with an original from WE.',
    icon: Sparkle,
  },
  {
    title: 'Personalized production',
    copy: 'Your details are built into the piece.',
    icon: CirclesThreePlus,
  },
  {
    title: 'Strict quality inspection',
    copy: 'Each finished piece is checked before release.',
    icon: ShieldCheck,
  },
  {
    title: 'Tracked delivery',
    copy: 'Follow your order from production to delivery.',
    icon: Package,
  },
]

export function HomePage() {
  const [activeStep, setActiveStep] = useState(0)
  const customSteps = [
    ['Choose', 'Start with a WE original built for movement.'],
    ['Personalize', 'Set the color, name, number, and meaningful details.'],
    ['Review', 'Check every view before it enters production.'],
    ['Order & track', 'Follow the piece from production to delivery.'],
  ] as const

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <img
          className="home-hero__image"
          src="/images/hero-stadium.webp"
          alt="An athlete wearing an original black and gold WE jersey in a stadium tunnel"
          fetchPriority="high"
          decoding="async"
          width="1672"
          height="941"
        />
        <div className="home-hero__veil" />
        <div className="home-hero__content shell">
          <p className="eyebrow eyebrow--gold">WE originals / Made to mean more</p>
          <h1 id="home-title">Gear made<br />personal.</h1>
          <p className="hero-copy">A uniform can identify you. A WE original can tell your story.</p>
          <div className="button-row">
            <Link className="button button--gold" to="/collections">
              Explore originals <ArrowRight size={18} weight="bold" />
            </Link>
            <Link className="button button--ghost-light" to="/custom">
              Create yours
            </Link>
          </div>
        </div>
        <a className="hero-scroll" href="#worlds">
          Discover the worlds <ArrowDown size={18} />
        </a>
        <p className="hero-index" aria-hidden="true">WE / 01—03</p>
      </section>

      <section className="worlds-section section-pad shell" id="worlds" aria-labelledby="worlds-title">
        <SectionHeading
          id="worlds-title"
          eyebrow="Three ways into WE"
          title="Choose what the piece should carry."
          copy="Each world starts with a different intention. All three end in something personal."
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
                  <strong>{world.title}</strong>
                  <span>{world.copy}</span>
                </span>
                <ArrowUpRight className="world-card__arrow" size={25} weight="bold" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="series-spotlight section-pad" aria-labelledby="series-title">
        <div className="shell">
          <SectionHeading
            id="series-title"
            eyebrow="New & featured / Series 01"
            title="Water Ripple"
            copy="A graphic system built from the moment still water meets forward motion."
            action={
              <Link className="text-link" to="/collections/water-ripple">
                View the series <ArrowRight size={17} weight="bold" />
              </Link>
            }
          />
        </div>
        <AnimatedContent className="series-banner">
          <img
            src="/images/water-ripple.webp"
            alt="An original white and cobalt jersey displayed above rippling water"
            loading="lazy"
            decoding="async"
            width="1672"
            height="941"
          />
          <div className="series-banner__copy">
            <p>WE / WR–01</p>
            <h3>Move first.<br />Let the world answer.</h3>
          </div>
        </AnimatedContent>
      </section>

      <section className="custom-story section-pad" aria-labelledby="custom-title">
        <div className="shell custom-story__grid">
          <div className="custom-story__intro">
            <p className="eyebrow eyebrow--gold">Create yours</p>
            <h2 id="custom-title">Your meaning.<br />Built in.</h2>
            <p>Personalization is part of the object, not an afterthought placed on top.</p>
            <Link className="button button--light" to="/custom">
              Open the studio <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
          <div className="custom-story__visual" aria-live="polite">
            <img src="/images/product-water.webp" alt="Water Ripple jersey personalization preview" loading="lazy" width="941" height="941" />
            <div className="jersey-mark">
              <span>{activeStep === 1 ? 'MORGAN' : 'WE'}</span>
              <strong>{activeStep >= 1 ? '17' : '01'}</strong>
            </div>
            <p>{customSteps[activeStep]?.[1] ?? customSteps[0][1]}</p>
          </div>
          <ol className="custom-steps">
            {customSteps.map(([label], index) => (
              <li key={label}>
                <button
                  type="button"
                  className={activeStep === index ? 'is-active' : ''}
                  aria-pressed={activeStep === index}
                  onClick={() => setActiveStep(index)}
                >
                  <span>0{index + 1}</span>
                  {label}
                  <ArrowRight size={18} />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="craft-story section-pad" aria-labelledby="craft-title">
        <div className="craft-story__image">
          <img
            src="/images/craft-embroidery.webp"
            alt="A craftsperson inspecting gold embroidery on black performance fabric"
            loading="lazy"
            decoding="async"
            width="1672"
            height="941"
          />
        </div>
        <div className="craft-story__panel">
          <p className="eyebrow">Made visible</p>
          <h2 id="craft-title">The last five percent is where trust lives.</h2>
          <p>Color alignment, stitch tension, placement, and finish are reviewed before a piece moves forward.</p>
          <Link className="text-link" to="/craftsmanship">
            See how WE makes it <ArrowRight size={17} weight="bold" />
          </Link>
          <dl className="craft-metrics">
            <div><dt>01</dt><dd>Material selection</dd></div>
            <div><dt>02</dt><dd>Personalized build</dd></div>
            <div><dt>03</dt><dd>Final inspection</dd></div>
          </dl>
        </div>
      </section>

      <section className="promise-section section-pad shell" aria-labelledby="promise-title">
        <SectionHeading id="promise-title" title="Four promises. No fine print." />
        <div className="promise-grid">
          {promiseItems.map(({ title, copy, icon: Icon }, index) => (
            <article key={title}>
              <div className="promise-grid__top">
                <Icon size={25} weight="light" />
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stories-section section-pad shell" aria-labelledby="stories-title">
        <SectionHeading
          id="stories-title"
          eyebrow="Stories"
          title="The meaning behind the material."
          action={
            <Link className="text-link" to="/stories">
              Read all stories <ArrowRight size={17} weight="bold" />
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
      </section>

      <section className="community-banner" aria-labelledby="community-title">
        <img src="/images/hero-stadium.webp" alt="An athlete walking toward the field in a personalized jersey" loading="lazy" decoding="async" width="1672" height="941" />
        <div className="community-banner__veil" />
        <div className="community-banner__content">
          <p className="eyebrow eyebrow--gold">Worn your way</p>
          <h2 id="community-title">The piece is finished when you live in it.</h2>
          <p>See how individuals and teams make every WE original their own.</p>
          <Link className="button button--ghost-light" to="/community">
            Enter the community <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </>
  )
}

export function CollectionsPage() {
  return (
    <>
      <PageIntro
        index="01 / Originals"
        title="Every series starts with an idea."
        copy="Explore WE originals as complete visual worlds, then choose the piece that makes the idea yours."
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
  const current = getSeries(slug)
  const [controls, setControls] = useSearchParams()
  const sort = ['featured', 'low', 'high'].includes(controls.get('sort') ?? '')
    ? controls.get('sort')!
    : 'featured'
  const filter = ['all', 'personalizable', 'team'].includes(controls.get('filter') ?? '')
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
    if (sort === 'low') return a.price - b.price
    if (sort === 'high') return b.price - a.price
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
            <p className="eyebrow">{visible.length} pieces / prototype</p>
            <h2>Build the full story.</h2>
          </div>
          <div className="listing-controls">
            <label>
              Filter
              <select name="filter" value={filter} onChange={(event) => updateControl('filter', event.target.value)}>
                <option value="all">All pieces</option>
                <option value="personalizable">Personalizable</option>
                <option value="team">Team ready</option>
              </select>
            </label>
            <label>
              Sort
              <select name="sort" value={sort} onChange={(event) => updateControl('sort', event.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
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
        <p className="prototype-note">* {prototypeNotice}</p>
      </section>
    </>
  )
}

export function WorldPage({ world }: { world: WorldSlug }) {
  const current = worlds.find((item) => item.slug === world)
  if (!current) return <NotFoundPage />
  const worldSeries = series.filter((item) => item.world === world)
  const supporting = {
    create: ['Original systems', 'Personal details', 'No borrowed identities'],
    honor: ['Numbers with meaning', 'Memory in the details', 'Made to be carried'],
    belong: ['Individual within team', 'Shared visual language', 'Built for groups'],
  }[world]

  return (
    <>
      <section className={`world-hero world-hero--${world}`}>
        <img src={current.image} alt="" fetchPriority="high" width="1672" height="941" />
        <div className="world-hero__shade" />
        <div className="world-hero__content shell">
          <p className="eyebrow eyebrow--gold">World {current.index}</p>
          <h1>{current.title}</h1>
          <p>{current.copy}</p>
          <Link className="button button--light" to="/collections">Explore originals <ArrowRight size={18} /></Link>
        </div>
      </section>
      <section className="world-manifesto section-pad shell">
        <p className="eyebrow">Why {current.title}</p>
        <h2>{world === 'create' ? 'Expression deserves structure.' : world === 'honor' ? 'The detail is the memory.' : 'Together should still feel personal.'}</h2>
        <div className="world-manifesto__list">
          {supporting.map((item, index) => <p key={item}><span>0{index + 1}</span>{item}</p>)}
        </div>
      </section>
      <section className="world-series section-pad">
        {worldSeries.map((item) => (
          <div className="shell split-feature" key={item.slug}>
            <img src={item.image} alt="" loading="lazy" width="1672" height="941" />
            <div>
              <p className="eyebrow">{item.eyebrow}</p>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <Link className="text-link" to={`/collections/${item.slug}`}>View series <ArrowRight size={17} /></Link>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}

export function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const [size, setSize] = useState<ApparelSize | ''>('')
  const [added, setAdded] = useState(false)
  const [cityQuery, setCityQuery] = useState('')
  const [cityMessage, setCityMessage] = useState('')
  const { addItem } = useCart()
  const navigate = useNavigate()

  if (!product) return <NotFoundPage />
  const currentSeries = getSeries(product.series)

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
      name: product.name,
      detail: `${product.color} · Size ${size}`,
      price: product.price,
      image: product.image,
    })
    setAdded(true)
  }

  return (
    <section className="product-page shell">
      <div className="product-gallery">
        <div className="product-gallery__main"><img src={product.image} alt={product.name} fetchPriority="high" width="941" height="941" /></div>
        <div className="product-gallery__detail"><img src="/images/craft-embroidery.webp" alt="Gold embroidery construction detail" loading="lazy" width="1672" height="941" /></div>
      </div>
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
        <p className="eyebrow">{currentSeries?.name} / Prototype piece</p>
        <h1>{product.name}</h1>
        <p className="product-info__price">{formatPrice(product.price)}*</p>
        <p className="product-info__description">
          {product.personalizable
            ? 'An original WE performance layer designed to hold personal names and numbers without losing the series concept.'
            : 'An original WE performance layer presented as a standard sample construction for this prototype.'}
        </p>
        <dl className="product-facts">
          <div><dt>Color</dt><dd>{product.color}</dd></div>
          <div><dt>Build</dt><dd>Performance knit / sample specification</dd></div>
          <div><dt>Finish</dt><dd>{product.personalizable ? 'Personalized production available' : 'Standard sample construction'}</dd></div>
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
          <button className="button button--dark" type="button" onClick={add} disabled={!size} aria-live="polite">
            {added ? <><Check size={18} /> Added to cart</> : size ? <>Add to cart <ArrowRight size={18} /></> : <>Choose a size</>}
          </button>
          {product.personalizable ? (
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
        <p className="prototype-note">* {prototypeNotice}</p>
        <details>
          <summary>Fit & material</summary>
          <p>Sample specification: athletic fit, breathable knit zones, and reinforced personalized areas. Final specifications require merchandising approval.</p>
        </details>
        <details>
          <summary>Production & delivery</summary>
          <p>Production timing and shipping estimates connect to live operations data before launch; no estimate is presented in this prototype.</p>
        </details>
      </div>
    </section>
  )
}

const colors = [
  { name: 'Cobalt', value: '#174A8B' },
  { name: 'Obsidian', value: '#0A0A0A' },
  { name: 'WE Gold', value: '#9A7442' },
  { name: 'Crimson', value: '#8F1D2C' },
]

const apparelSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const
type ApparelSize = (typeof apparelSizes)[number]

const cityChoices = [
  {
    slug: 'sacramento',
    name: 'Sacramento',
    statement: 'Sunlit neutrals, deep green accents, and originals made for long seasons.',
    productSlugs: ['water-ripple-game-jersey', 'common-thread-training-top'],
  },
  {
    slug: 'chicago',
    name: 'Chicago',
    statement: 'High-contrast layers and cold-weather depth, built around original WE series.',
    productSlugs: ['crack-game-jersey', 'crack-travel-jacket'],
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles',
    statement: 'Bright movement, warm neutrals, and lightweight originals for the everyday field.',
    productSlugs: ['water-ripple-warmup', 'common-thread-travel-shell'],
  },
  {
    slug: 'new-york',
    name: 'New York',
    statement: 'Sharp contrast and city-ready layers with no borrowed team identity.',
    productSlugs: ['crack-game-jersey', 'common-thread-training-top'],
  },
] as const

const personalizableProducts = products.filter((product) => product.personalizable)

function isApparelSize(value: string | null | undefined): value is ApparelSize {
  return apparelSizes.includes(value as ApparelSize)
}

type StudioView = 'front' | 'back' | 'detail'

type SavedDesignDraft = {
  productSlug?: string
  template?: string
  name?: string
  number?: string
  color?: { name?: string }
  colorName?: string
  size?: string
  view?: StudioView
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

export function CustomPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const draft = useMemo(readDesignDraft, [])
  const requestedProduct = getProduct(searchParams.get('style') ?? undefined)
  const draftProduct = getProduct(draft?.productSlug)
  const legacyDraftProduct = personalizableProducts.find(
    (product) => getSeries(product.series)?.name === draft?.template,
  )
  const initialProduct = requestedProduct?.personalizable
    ? requestedProduct
    : draftProduct?.personalizable
      ? draftProduct
      : legacyDraftProduct ?? personalizableProducts[0]!
  const draftColorName = draft?.colorName ?? draft?.color?.name
  const [step, setStep] = useState(0)
  const [selectedProductSlug, setSelectedProductSlug] = useState(initialProduct.slug)
  const [name, setName] = useState(draft?.name ?? 'MORGAN')
  const [number, setNumber] = useState(draft?.number ?? '17')
  const [color, setColor] = useState(colors.find((item) => item.name === draftColorName) ?? colors[0]!)
  const [size, setSize] = useState<ApparelSize>(
    isApparelSize(searchParams.get('size'))
      ? searchParams.get('size') as ApparelSize
      : isApparelSize(draft?.size) ? draft.size : 'M',
  )
  const [view, setView] = useState<StudioView>(draft?.view ?? 'front')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const { addItem } = useCart()
  const navigate = useNavigate()

  const steps = ['Choose', 'Personalize', 'Review', 'Order & track']
  const selectedProduct = getProduct(selectedProductSlug) ?? personalizableProducts[0]!
  const templateSeries = getSeries(selectedProduct.series) ?? series[0]!
  const templateImage = selectedProduct.image
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
    try {
      window.localStorage.setItem(
        'we-saved-design',
        JSON.stringify({ productSlug: selectedProduct.slug, template: templateSeries.name, name, number, colorName: color.name, size, view }),
      )
      setSaveError(false)
    } catch {
      setSaveError(true)
    }
  }, [color.name, name, number, selectedProduct.slug, size, templateSeries.name, view])

  const save = () => {
    try {
      window.localStorage.setItem(
        'we-saved-design',
        JSON.stringify({ productSlug: selectedProduct.slug, template: templateSeries.name, name, number, colorName: color.name, size, view }),
      )
      setSaved(true)
      setSaveError(false)
    } catch {
      setSaved(false)
      setSaveError(true)
    }
  }
  const addDesign = () => {
    addItem({
      id: `custom-${selectedProduct.slug}-${name}-${number}-${size}-${color.name}`,
      name: `${selectedProduct.name} / Personalized`,
      detail: `${name || 'No name'} · ${number || 'No number'} · ${size} · ${color.name}`,
      price: selectedProduct.price,
      image: templateImage,
    })
    setOrdered(true)
  }

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
              <button type="button" onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}>
                <span>{index < step ? <Check size={15} /> : index + 1}</span>{label}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className="studio-workspace shell">
        <div className="studio-preview" aria-live="polite">
          <p className="studio-preview__label">Interactive sample / {view} view</p>
          <div
            className={`studio-preview__canvas studio-preview__canvas--${view}`}
            style={{ '--studio-color': color.value } as CSSProperties}
          >
            <img
              src={templateImage}
              alt={`${selectedProduct.name} ${view} preview${view === 'back' ? ` with name ${name} and number ${number}` : ''}`}
              width="941"
              height="941"
            />
            <div className="studio-preview__tint" />
            {view !== 'detail' ? (
              <div className="studio-preview__mark">
                <span>{view === 'back' ? name || 'YOUR NAME' : 'WE'}</span>
                <strong>{view === 'back' ? number || '00' : '01'}</strong>
              </div>
            ) : null}
          </div>
          <div className="view-switcher" aria-label="Jersey view">
            {(['front', 'back', 'detail'] as const).map((option) => (
              <button
                className={view === option ? 'is-active' : ''}
                type="button"
                aria-pressed={view === option}
                key={option}
                onClick={() => setView(option)}
              >
                {option}
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
                    <span><strong>{item.name}</strong><small>{getSeries(item.series)?.name}</small></span>
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
                <label>Name <input name="player-name" autoComplete="off" value={name} maxLength={14} onChange={(event) => setName(event.target.value.toUpperCase())} /></label>
                <label>Number <input name="jersey-number" autoComplete="off" inputMode="numeric" pattern="[0-9]{0,2}" maxLength={2} value={number} onChange={(event) => setNumber(event.target.value.replace(/\D/g, ''))} /></label>
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
                <div><dt>Name / number</dt><dd>{name || 'None'} / {number || 'None'}</dd></div>
                <div><dt>Accent</dt><dd>{color.name}</dd></div>
                <div><dt>Size</dt><dd>{size}</dd></div>
                <div><dt>Prototype price</dt><dd>{formatPrice(selectedProduct.price)}*</dd></div>
              </dl>
              <button className="text-link text-link--button" type="button" onClick={save}>
                {saved ? <><Check size={17} /> Design saved locally</> : <>Save this design <ArrowRight size={17} /></>}
              </button>
              <p className="draft-status" role="status">{saveError ? 'Browser storage is unavailable. Keep this page open to preserve the draft.' : 'Draft changes are kept in this browser.'}</p>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="studio-step order-step">
              <p className="eyebrow">Step 04</p>
              <h2>Order & track.</h2>
              {ordered ? (
                <div className="order-confirmation" role="status">
                  <CheckCircle size={42} weight="fill" />
                  <h3>Added to your prototype cart.</h3>
                  <p>No payment has been processed. Continue to review the checkout experience.</p>
                  <button className="button button--dark" type="button" onClick={() => navigate('/cart')}>View cart <ArrowRight size={18} /></button>
                </div>
              ) : (
                <>
                  <div className="production-path">
                    <div><span>01</span><p><strong>Design locked</strong>Details are confirmed.</p></div>
                    <div><span>02</span><p><strong>Production</strong>Status connects here.</p></div>
                    <div><span>03</span><p><strong>Inspection</strong>Release after review.</p></div>
                    <div><span>04</span><p><strong>Delivery</strong>Tracking connects here.</p></div>
                  </div>
                  <button className="button button--dark" type="button" onClick={addDesign}>Add sample design to cart <ArrowRight size={18} /></button>
                </>
              )}
            </div>
          ) : null}
          <div className="studio-nav">
            <button type="button" onClick={previous} disabled={step === 0}><ArrowLeft size={17} /> Back</button>
            {step < steps.length - 1 ? <button type="button" onClick={next}>Continue to {steps[step + 1] ?? 'next step'} <ArrowRight size={17} /></button> : null}
          </div>
          <p className="prototype-note">* Prototype content only. Production settings, price, and availability require live catalog data.</p>
        </div>
      </div>
      <aside className="create-disclaimer shell" aria-labelledby="create-disclaimer-title">
        <p className="eyebrow" id="create-disclaimer-title">Personalization &amp; intellectual property</p>
        <p>WE UNION CREATE products are built on original garment designs and customer-led personalization. WE UNION does not reproduce or accept official league, team, athlete, or third-party brand names, logos, wordmarks, signatures, or confusingly similar variations. Customer-submitted artwork must be original or properly authorized and is subject to intellectual property review.</p>
      </aside>
    </section>
  )
}

export function StoriesPage() {
  return (
    <>
      <PageIntro index="WE Journal" title="The story is part of the object." copy="Ideas, people, and craft from inside the world of WE." />
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
  const stages = [
    ['01', 'Concept', 'Each piece begins as a WE visual system, not a blank template.'],
    ['02', 'Material', 'Performance needs guide knit, stretch, and reinforcement decisions.'],
    ['03', 'Personalization', 'Names, numbers, and marks are placed inside the original composition.'],
    ['04', 'Inspection', 'Alignment, color, construction, and finish are checked before release.'],
  ]
  return (
    <>
      <section className="craft-hero">
        <img src="/images/craft-embroidery.webp" alt="A craftsperson inspecting gold embroidery" fetchPriority="high" width="1672" height="941" />
        <div className="craft-hero__content shell"><p className="eyebrow eyebrow--gold">Craftsmanship</p><h1>Evidence<br />in every detail.</h1></div>
      </section>
      <section className="process-section section-pad shell">
        <SectionHeading eyebrow="The build" title="From original idea to inspected piece." copy="A visible, understandable process gives every personalized decision a place to belong." />
        <div className="process-list">
          {stages.map(([index, title, copy]) => <article key={title}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>
      <section className="material-proof section-pad">
        <div className="shell split-feature split-feature--reverse">
          <img src="/images/water-ripple.webp" alt="Performance jersey material above water" loading="lazy" width="1672" height="941" />
          <div><p className="eyebrow">Material follows movement</p><h2>Performance first. Meaning built in.</h2><p>The final production specification will connect verified fabric performance, care, and testing data here. This prototype intentionally avoids unsupported claims.</p></div>
        </div>
      </section>
    </>
  )
}

export function CommunityPage() {
  return (
    <>
      <section className="community-hero">
        <img src="/images/hero-stadium.webp" alt="An athlete wearing a personalized WE jersey" fetchPriority="high" width="1672" height="941" />
        <div className="community-hero__content shell"><p className="eyebrow eyebrow--gold">Worn your way</p><h1>One original.<br />Countless meanings.</h1><p>A community preview showing how WE can hold individual and shared stories.</p></div>
      </section>
      <section className="community-grid section-pad shell">
        <article className="community-grid__quote"><p>“The number is the first thing people see. The reason behind it is what I carry.”</p><span>Sample community story / Not a customer testimonial</span></article>
        <img src="/images/water-ripple.webp" alt="Water Ripple jersey creative study" loading="lazy" width="1672" height="941" />
        <img src="/images/craft-embroidery.webp" alt="Embroidery detail study" loading="lazy" width="1672" height="941" />
        <article className="community-grid__cta"><HandHeart size={32} /><h2>Share the meaning.</h2><p>Community submission workflows can connect here once moderation and consent systems are approved.</p><Link className="text-link" to="/support">Learn about submissions <ArrowRight size={17} /></Link></article>
      </section>
    </>
  )
}

export function AboutPage() {
  return (
    <>
      <PageIntro index="About WE" title="A uniform is never just a uniform." copy="WE creates original performance apparel for the individual inside every team, memory, and moment." />
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
  const [submitted, setSubmitted] = useState(false)
  return (
    <>
      <PageIntro index="WE for teams" title="One system. Every player." copy="A structured team-order path for clubs, schools, organizations, and creative communities." />
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
              <label>Estimated group size <select name="group-size" defaultValue="" required><option value="" disabled>Select a range</option><option>10–24</option><option>25–49</option><option>50–99</option><option>100+</option></select></label>
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
  const { items, subtotal, removeItem, restoreItem, updateQuantity } = useCart()
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
            <div><h2>{item.name}</h2><p>{item.detail}</p><button type="button" onClick={() => remove(item)}>Remove</button></div>
            <label>Quantity <select name={`quantity-${item.id}`} value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))}>{[1,2,3,4].map((value) => <option key={value}>{value}</option>)}</select></label>
            <p>{formatPrice(item.price * item.quantity)}*</p>
          </article>)}
        </div>
        <aside className="order-summary"><p className="eyebrow">Sample order summary</p><div><span>Subtotal</span><strong>{formatPrice(subtotal)}*</strong></div><div><span>Shipping</span><span>Calculated with live service</span></div><div><span>Tax</span><span>Calculated at checkout</span></div><Link className="button button--dark" to="/checkout">Continue to demo checkout <ArrowRight size={18} /></Link><p className="prototype-note">* No charge will be made in this prototype.</p></aside>
      </div> : <div className="empty-state empty-state--large"><BagIcon /><h2>Your cart is open space.</h2><p>Choose a WE original or begin a personalized piece.</p><Link className="button button--dark" to="/collections">Explore originals <ArrowRight size={18} /></Link></div>}
      {removed ? <div className="undo-toast" role="status"><span>{removed.name} removed.</span><button type="button" onClick={undoRemove}>Undo</button><button type="button" aria-label="Dismiss removed item message" onClick={() => setRemoved(null)}>×</button></div> : null}
    </section>
  )
}

function BagIcon() { return <Package size={42} weight="light" /> }

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [complete, setComplete] = useState(false)
  if (!items.length && !complete) return <Navigate to="/cart" replace />

  return (
    <section className="checkout-page shell">
      <div className="checkout-heading"><p className="eyebrow">Secure-flow prototype</p><h1>Checkout</h1><p>No payment, order, or personal data will be transmitted.</p></div>
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
          <fieldset><legend>Payment demonstration</legend><div className="demo-payment"><ShieldCheck size={25} /><p><strong>Payment integration intentionally disabled</strong><br />Connect an approved PCI-compliant provider before launch.</p></div></fieldset>
        </div>
        <aside className="order-summary"><p className="eyebrow">Order summary</p>{items.map((item) => <p key={item.id}>{item.name} × {item.quantity}</p>)}<div><span>Prototype total</span><strong>{formatPrice(subtotal)}*</strong></div><button className="button button--dark" type="submit">Complete demo <ArrowRight size={18} /></button></aside>
      </form>}
    </section>
  )
}

export function AccountPage() {
  const [mode, setMode] = useState<'signin' | 'create'>('signin')
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="account-page shell">
      <div className="account-page__art"><img src="/images/hero-stadium.webp" alt="" width="1672" height="941" /><div><p className="eyebrow eyebrow--gold">Your WE</p><h1>Designs, orders,<br />and the story so far.</h1></div></div>
      <form className="account-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}>
        <div className="account-tabs"><button type="button" className={mode === 'signin' ? 'is-active' : ''} onClick={() => setMode('signin')}>Sign in</button><button type="button" className={mode === 'create' ? 'is-active' : ''} onClick={() => setMode('create')}>Create account</button></div>
        {submitted ? <div className="order-confirmation" role="status"><CheckCircle size={42} weight="fill" /><h2>Prototype form complete.</h2><p>Authentication is not connected in this concept build.</p></div> : <><p className="eyebrow">{mode === 'signin' ? 'Welcome back' : 'Start your WE'}</p><h2>{mode === 'signin' ? 'Your story continues.' : 'Keep every detail together.'}</h2>{mode === 'create' ? <label>Name <input name="name" maxLength={80} required autoComplete="name" /></label> : null}<label>Email <input name="email" type="email" maxLength={120} required autoComplete="email" spellCheck={false} /></label><label>Password <input name="password" type="password" minLength={8} maxLength={128} required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /></label><button className="button button--dark" type="submit">{mode === 'signin' ? 'Sign in' : 'Create prototype account'} <ArrowRight size={18} /></button></>}
      </form>
    </section>
  )
}

export function TrackPage() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <section className="track-page shell">
      <div><p className="eyebrow">Order & track</p><h1>Follow the piece.</h1><p>From personalized production through final inspection and delivery.</p></div>
      <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label>Order number <input name="order-number" autoComplete="off" spellCheck={false} placeholder="e.g., WE-000000…" pattern="WE-[0-9]{6}" maxLength={9} title="Use the format WE-000000" required /></label><label>Email address <input name="email" type="email" maxLength={120} autoComplete="email" spellCheck={false} required /></label><button className="button button--light" type="submit">Find prototype order <ArrowRight size={18} /></button>{submitted ? <p className="form-success" role="status">Tracking is not connected in this prototype. Add the fulfillment API here before launch.</p> : null}</form>
    </section>
  )
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const citySlug = params.get('city') ?? ''
  const city = cityChoices.find((item) => item.slug === citySlug)
  const unknownCity = Boolean(citySlug && !city)
  const [query, setQuery] = useState(initial)
  const results = useMemo(() => searchCatalog(initial), [initial])
  const cityProducts = city
    ? city.productSlugs.map((slug) => getProduct(slug)).filter((product): product is NonNullable<typeof product> => Boolean(product))
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
          {initial && !results.length ? <div className="empty-state"><h2>Nothing matched yet.</h2><p>Try a series name such as Water Ripple, or search “jersey.”</p></div> : null}
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
  return (
    <>
      <PageIntro index="Help & support" title="Start with the right path." copy="Clear routes for product questions, personalized production, orders, and team programs." />
      <section className="support-grid section-pad shell">{supportTopics.map(([title, copy, href], index) => <Link to={href} key={title}><span>0{index + 1}</span><div><h2>{title}</h2><p>{copy}</p></div><ArrowUpRight size={23} /></Link>)}</section>
      <section className="faq-section section-pad shell"><SectionHeading eyebrow="FAQ" title="A few useful answers." /><div>{[
        ['Can I personalize every WE piece?', 'Personalization availability is defined per product. Eligible sample items are clearly labeled in the prototype.'],
        ['How long does production take?', 'Live production estimates are intentionally withheld until they can be supplied by the operations system.'],
        ['Can WE support a whole team?', 'Yes—the team brief is designed for coordinated styles, player data, approvals, and tracking.'],
      ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    </>
  )
}

const legalContent: Record<string, { title: string; intro: string; sections: [string, string][] }> = {
  privacy: { title: 'Privacy framework', intro: 'A launch-ready privacy policy must be reviewed by counsel and connected to the actual data practices.', sections: [['Prototype data', 'Forms in this prototype do not send information to a server. Local cart and saved-design data remain in this browser.'], ['Before launch', 'Document processors, retention, consent, deletion, and regional rights based on the production architecture.']] },
  terms: { title: 'Terms framework', intro: 'These are product-language placeholders, not legal terms.', sections: [['Orders', 'Define acceptance, production approval, changes, cancellations, and remedies using the final operating model.'], ['Intellectual property', 'Document rights for customer-supplied names, numbers, and marks alongside WE original designs.']] },
  accessibility: { title: 'Accessibility', intro: 'WE is designed toward WCAG 2.2 AA across navigation, content, customization, and purchase flows.', sections: [['Current build', 'Keyboard navigation, visible focus, semantic controls, text alternatives, and reduced-motion preferences are supported.'], ['Feedback', 'A monitored accessibility contact channel must be added before launch.']] },
  shipping: { title: 'Shipping & returns framework', intro: 'Operational timelines and policies connect only when verified services and rules are ready.', sections: [['Personalized pieces', 'Define approval, production, change, and return rules in plain language before the buyer commits.'], ['Tracking', 'Expose carrier events and production milestones from the verified fulfillment source.']] },
}

export function PolicyPage() {
  const { slug } = useParams()
  const page = legalContent[slug ?? '']
  if (!page) return <NotFoundPage />
  return <article className="policy-page shell"><p className="eyebrow">WE / Legal & policy</p><h1>{page.title}</h1><p className="policy-page__intro">{page.intro}</p>{page.sections.map(([title, copy]) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}<p className="prototype-note">Prototype content requires operational and legal approval before publication.</p></article>
}

export function NotFoundPage() {
  return <section className="not-found shell"><p className="eyebrow">404 / Outside the lines</p><h1>This route isn’t part of the current field.</h1><p>Return to the WE originals and choose a new path.</p><div className="button-row"><Link className="button button--dark" to="/">Go home <ArrowRight size={18} /></Link><Link className="button button--outline" to="/collections">All series</Link><Link className="button button--outline" to="/custom">Create yours</Link><Link className="button button--outline" to="/support">Support</Link></div></section>
}

function PageIntro({ index, title, copy }: { index: string; title: string; copy: string }) {
  return <header className="page-intro shell"><p className="eyebrow">{index}</p><div><h1>{title}</h1><p>{copy}</p></div></header>
}
