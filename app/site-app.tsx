/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element, react-hooks/set-state-in-effect */
"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, type ImgHTMLAttributes } from "react";
import {
  ArrowRight,
  Check,
  Handbag,
  List,
  MagnifyingGlass,
  Minus,
  Plus,
  ShieldCheck,
  Sparkle,
  Truck,
  User,
  X,
} from "@phosphor-icons/react";
import { faqs, formatDate, formatMonthDay, formatPrice, orderStages, products, series as seriesData, stories, worlds, type Product, type SeriesSlug } from "./data";

type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  imagePosition: string;
  custom?: {
    name: string;
    number: string;
    view: string;
    designId: string;
    proofVersion: string;
  };
};

type IconName = "menu" | "search" | "user" | "bag" | "arrow" | "plus" | "minus" | "close" | "check" | "sparkle" | "shield" | "truck";

const PRODUCT_CATEGORIES = ["ALL", "JERSEYS", "OUTERWEAR", "TOPS", "ACCESSORIES"] as const;
const PRODUCT_SORTS = ["FEATURED", "PRICE LOW", "PRICE HIGH"] as const;
const PRODUCT_WORLDS = ["ALL", "CREATE", "HONOR", "BELONG"] as const;
const ACCOUNT_TABS = ["ORDERS", "SAVED DESIGNS", "PROFILE", "ADDRESSES", "RETURNS"] as const;
const SERIES_SLUGS = Object.keys(seriesData) as SeriesSlug[];

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const icons = { menu: List, search: MagnifyingGlass, user: User, bag: Handbag, arrow: ArrowRight, plus: Plus, minus: Minus, close: X, check: Check, sparkle: Sparkle, shield: ShieldCheck, truck: Truck };
  const Glyph = icons[name];
  return <Glyph aria-hidden="true" size={size} weight="regular" />;
}

function MediaImage({ src, alt, width, height, decoding = "async", ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & { src: string; alt: string }) {
  const dimensions = src.endsWith("favicon.svg")
    ? [64, 64]
    : src.includes("/products/")
      ? [930, 1380]
      : src.includes("craft-detail")
        ? [1400, 1000]
        : [1600, 1000];
  return <img src={src} alt={alt} width={width ?? dimensions[0]} height={height ?? dimensions[1]} decoding={decoding} {...props} />;
}

function replaceQuery(updates: Record<string, string>, defaults: Record<string, string> = {}) {
  const url = new URL(window.location.href);
  Object.entries(updates).forEach(([key, value]) => {
    if (!value || value === defaults[key]) url.searchParams.delete(key);
    else url.searchParams.set(key, value.toLowerCase().replace(/\s+/g, "-"));
  });
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function queryChoice(key: string, options: readonly string[], fallback: string) {
  const value = new URLSearchParams(window.location.search).get(key)?.replace(/-/g, " ").toUpperCase();
  return value && options.includes(value) ? value : fallback;
}

function Logo() {
  return (
    <a className="brand-logo" href="/" aria-label="WE home">
      <MediaImage src="/favicon.svg" alt="" />
      <span aria-hidden="true" translate="no">WE</span>
    </a>
  );
}

function Header({ cartCount }: { cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const nav = [
    ["CREATE", "/collections"],
    ["HONOR", "/world/honor"],
    ["BELONG", "/world/belong"],
    ["CREATE YOURS", "/custom"],
    ["STORIES", "/stories"],
    ["ABOUT", "/about"],
  ];
  useEffect(() => {
    if (!menuOpen) return;
    drawerCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);
  return (
    <>
      <div className="utility-bar">
        <span>UNITED STATES / USD</span>
        <nav aria-label="Utility navigation"><a href="/support">Help</a><a href="/track">Order Status</a><a href="/account">Join Us</a><a href="/account">Sign In</a></nav>
      </div>
      <header className="site-header">
        <button ref={menuButtonRef} className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, href]) => <a className={href === "/custom" ? "nav-accent" : ""} key={href} href={href}>{label}</a>)}
        </nav>
        <div className="header-tools">
          <a className="search-pill" href="/search" aria-label="Search"><Icon name="search" /><span>Search</span></a>
          <a className="icon-button desktop-only" href="/account" aria-label="Account"><Icon name="user" /></a>
          <a className="icon-button bag-button" href="/cart" aria-label={`Cart with ${cartCount} items`}><Icon name="bag" />{cartCount > 0 && <span>{cartCount}</span>}</a>
        </div>
      </header>
      <div className="announcement" aria-label="Brand promise"><strong>ORIGINAL DESIGN</strong><span>PERSONALIZED FOR YOU</span><span>MADE WITH PURPOSE</span></div>
      {menuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer-top"><Logo /><button ref={drawerCloseRef} className="icon-button" onClick={() => { setMenuOpen(false); requestAnimationFrame(() => menuButtonRef.current?.focus()); }} aria-label="Close menu"><Icon name="close" /></button></div>
          <nav aria-label="Mobile navigation">
            <p>THREE WORLDS</p>
            {nav.slice(0, 3).map(([label, href]) => <a key={href} href={href}>{label}<Icon name="arrow" /></a>)}
            <p>EXPLORE</p>
            {nav.slice(3).map(([label, href]) => <a key={href} href={href}>{label}<Icon name="arrow" /></a>)}
          </nav>
          <div className="drawer-links"><a href="/account">ACCOUNT</a><a href="/support">SUPPORT</a><a href="/track">TRACK ORDER</a></div>
        </div>
      )}
    </>
  );
}

function Footer() {
  const groups = [
    ["COLLECTIONS", [["All Series", "/collections"], ["Water Ripple", "/collections/water-ripple"], ["Black Rift", "/collections/black-rift"]]],
    ["WORLDS", [["Create", "/collections"], ["Honor", "/world/honor"], ["Belong", "/world/belong"]]],
    ["CUSTOMIZE", [["Create Yours", "/custom"], ["Team Orders", "/team-orders"], ["Saved Designs", "/account"]]],
    ["EXPLORE", [["Stories", "/stories"], ["Community", "/community"], ["Craftsmanship", "/craftsmanship"]]],
    ["SUPPORT", [["Help & FAQ", "/support"], ["Order Tracking", "/track"], ["Shipping", "/policies/shipping"], ["Returns", "/policies/returns"]]],
    ["COMPANY", [["About", "/about"], ["Privacy", "/policies/privacy"], ["Terms", "/policies/terms"], ["Accessibility", "/policies/accessibility"]]],
  ] as const;
  return (
    <footer className="site-footer">
      <h2 className="sr-only">Footer navigation</h2>
      <div className="footer-mark"><Logo /><p>Original sportswear built around identity, achievement, and belonging.</p></div>
      <div className="footer-grid">
        {groups.map(([title, links]) => <div key={title}><h3>{title}</h3>{links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>)}
      </div>
      <div className="footer-bottom"><span>© 2026 WE</span><span>MADE WITH PURPOSE</span><a href="/admin">ADMIN PROTOTYPE</a></div>
    </footer>
  );
}

function SectionTitle({ eyebrow, title, copy, light = false }: { eyebrow?: string; title: string; copy?: string; light?: boolean }) {
  return (
    <div className={`section-title ${light ? "section-title--light" : ""}`}>
      {eyebrow && <p className="eyebrow"><span />{eyebrow}</p>}
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  );
}

function ProductImage({ product, className = "", priority = false }: { product: Product; className?: string; priority?: boolean }) {
  return <div className={`product-image ${className}`}><MediaImage src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} /></div>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  return (
    <article className="product-card">
      <a href={`/product/${product.id}`} aria-label={`View ${product.name}`}><ProductImage product={product} /><span className="product-tag">{product.tag}</span></a>
      <div className="product-info">
        <div><p>{product.world}</p><h3><a href={`/product/${product.id}`}>{product.name}</a></h3><span className="product-meta">{product.category} / {product.colors.length} colors</span><strong>{formatPrice(product.price)}</strong></div>
        <button className="quick-add" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}><Icon name="plus" size={16} /><span>QUICK ADD</span></button>
      </div>
    </article>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setSent(true);
  }
  return (
    <section className="newsletter">
      <div><h2>STAY CLOSE.</h2><p>New series, embroidery notes, and early access. Nothing extra.</p></div>
      {sent ? <p className="newsletter-success" role="status" aria-live="polite"><Icon name="check" /> You’re on the list.</p> : <form onSubmit={submit}><label htmlFor="newsletter-email">EMAIL ADDRESS</label><div><input id="newsletter-email" name="email" type="email" required autoComplete="email" spellCheck={false} placeholder="you@example.com…" value={email} onChange={(e) => setEmail(e.target.value)} /><button type="submit">JOIN <Icon name="arrow" /></button></div></form>}
    </section>
  );
}

function SeriesFeature({ slug, compact = false }: { slug: SeriesSlug; compact?: boolean }) {
  const series = seriesData[slug];
  const selected = products.filter((product) => product.series === slug).slice(0, 3);
  const SeriesHeading = compact ? "h3" : "h2";
  const headingId = `series-${slug}-title`;
  return (
    <article className={`series-showcase series-showcase--${series.tone} ${compact ? "series-showcase--compact" : ""}`} aria-labelledby={headingId} data-series={slug}>
      <MediaImage className="series-showcase-background" src={series.image} alt="" style={{ objectPosition: series.position }} loading="lazy" />
      <div className="series-showcase-shade" />
      <div className="series-showcase-copy">
        <p>{series.edition}</p>
        <SeriesHeading id={headingId}>{series.name}</SeriesHeading>
        <span>{series.copy}</span>
        <a className={`button ${series.tone === "dark" ? "button--light" : "button--dark"}`} href={`/collections/${slug}`}>EXPLORE THE SERIES <Icon name="arrow" /></a>
      </div>
      <div className="series-products" aria-hidden="true">
        {selected.map((product) => <MediaImage key={product.id} src={product.image} alt="" style={{ objectPosition: product.imagePosition }} loading="lazy" />)}
      </div>
    </article>
  );
}

function HomePage() {
  const promises: { icon: IconName; title: string }[] = [
    { icon: "sparkle", title: "ORIGINAL DESIGN" },
    { icon: "check", title: "PERSONALIZED PRODUCTION" },
    { icon: "shield", title: "STRICT QUALITY INSPECTION" },
    { icon: "truck", title: "TRACKED DELIVERY" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "WE", url: "https://we-union-store.vle99457.chatgpt.site" }) }} />
      <section className="hero">
        <div className="hero-media"><MediaImage src="/reference/image3.jpeg" alt="Athlete wearing an original WE sportswear jersey" fetchPriority="high" /></div>
        <div className="hero-grain" />
        <div className="hero-copy">
          <p className="hero-kicker"><span>ORIGINAL DESIGN</span><span>PERSONALIZED FOR YOU</span><span>MADE WITH PURPOSE</span></p>
          <h1>WE</h1>
          <p className="hero-lockup">GEAR MADE PERSONAL.</p>
          <p className="hero-body">Original sportswear built around identity, achievement, and belonging.</p>
          <div className="button-row"><a className="button button--light" href="/collections">EXPLORE COLLECTIONS</a><a className="button button--ghost" href="/custom">CREATE YOURS</a></div>
        </div>
      </section>

      <section className="section worlds-section">
        <SectionTitle title="THREE WORLDS. ONE POINT OF VIEW." copy="Create a mark. Honor a story. Belong to something larger." />
        <div className="world-grid">
          {Object.entries(worlds).map(([slug, world]) => <a className="world-card" href={slug === "create" ? "/collections" : `/world/${slug}`} key={world.name}><MediaImage src={world.image} alt="" style={{ objectPosition: world.position }} loading="lazy" /><div className="world-shade" /><div><h3>{world.name}</h3><p>{world.kicker}</p><span className="text-link">{slug === "create" ? "EXPLORE SERIES" : "ENTER WORLD"} <Icon name="arrow" /></span></div></a>)}
        </div>
      </section>

      <section className="section featured-series">
        <div className="split-heading"><SectionTitle title="NEW & FEATURED" copy="Enter through the story, then find the pieces built inside it." /><a className="text-link" href="/collections">ALL SERIES <Icon name="arrow" /></a></div>
        <div className="series-stack"><SeriesFeature slug="water-ripple" compact /><SeriesFeature slug="black-rift" compact /></div>
      </section>

      <section className="create-banner">
        <div className="create-image create-preview"><div className="create-preview-note"><span>LIVE DESIGN PREVIEW</span><strong>WE / 24</strong></div><GarmentPreview name="WE" number="24" color="Obsidian" view="BACK" /></div>
        <div className="create-panel"><SectionTitle eyebrow="CREATE YOURS" title="ORIGINAL FIRST. PERSONAL AFTER." light copy="Choose a WE original, then add the details that make it unmistakably yours." /><ol>{["CHOOSE", "PERSONALIZE", "REVIEW", "WE MAKE IT"].map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}</ol><a className="button button--silver" href="/custom">START CREATING <Icon name="arrow" /></a></div>
      </section>

      <section className="section craft-section">
        <div className="craft-media"><MediaImage src="/editorial/craft-detail.jpg" alt="Close view of embroidery and garment construction" loading="lazy" /></div>
        <div className="craft-copy"><SectionTitle title="DESIGNED WITH INTENT. MADE WITH CARE." light copy="Personalization works only when the foundation is right. Every material, seam, and finish is chosen to carry your details well." /><div className="evidence-grid">{["EMBROIDERY", "MATERIALS", "CONSTRUCTION", "INSPECTION"].map((item) => <div key={item}><h3>{item}</h3></div>)}</div><a className="text-link" href="/craftsmanship">SEE HOW IT’S MADE <Icon name="arrow" /></a></div>
      </section>

      <section className="promise-section" aria-label="WE promise">
        <h2 className="sr-only">WE promise</h2>
        <div className="promise-grid">{promises.map(({ icon, title }) => <article key={title}><Icon name={icon} size={22} /><h3>{title}</h3></article>)}</div>
      </section>

      <section className="section stories-section">
        <div className="split-heading"><SectionTitle title="STORIES BEHIND THE STITCH." /><a className="text-link" href="/stories">VIEW ALL STORIES <Icon name="arrow" /></a></div>
        <div className="story-grid">{stories.map((story, index) => <a href={`/stories/${story.slug}`} className={`story-card ${index === 0 ? "story-card--featured" : ""}`} key={story.slug}><div><MediaImage src={story.image} alt="" style={{ objectPosition: story.position }} loading="lazy" /></div><p>{story.type} / {formatDate(story.date)}</p><h3>{story.title}</h3><span>{story.excerpt}</span></a>)}</div>
      </section>

      <section className="community-banner"><MediaImage src="/reference/image15.jpeg" alt="WE community wearing personalized pieces" loading="lazy" /><div><p className="eyebrow"><span />COMMUNITY</p><h2>WORN<br />YOUR WAY.</h2><p>The final story begins with the person who wears it.</p><a className="button button--light" href="/community">MEET THE COMMUNITY <Icon name="arrow" /></a></div></section>
      <Newsletter />
    </>
  );
}

function CollectionsGatewayPage() {
  return <main className="collections-page"><section className="collections-intro"><p className="eyebrow"><span />CREATE / ORIGINAL SERIES</p><h1>CHOOSE A SERIES.<br />MAKE IT YOURS.</h1><p>Each row presents one distinct visual language with its representative pieces. Enter a series to see every available product.</p></section><div className="collections-stack">{SERIES_SLUGS.map((slug) => <SeriesFeature key={slug} slug={slug} />)}</div></main>;
}

function CollectionPage({ slug, onAdd }: { slug: string; onAdd: (product: Product) => void }) {
  const key = (slug in seriesData ? slug : "water-ripple") as SeriesSlug;
  const activeSeries = seriesData[key];
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("FEATURED");
  useEffect(() => {
    setCategory(queryChoice("type", PRODUCT_CATEGORIES, "ALL"));
    setSort(queryChoice("sort", PRODUCT_SORTS, "FEATURED"));
  }, []);
  const filtered = useMemo(() => {
    const result = products.filter((product) => product.series === key && (category === "ALL" || product.category.toUpperCase() === category));
    if (sort === "PRICE LOW") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "PRICE HIGH") return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [category, key, sort]);
  return (
    <main className="page-shell series-page">
      <section className={`series-intro series-intro--${activeSeries.tone}`}><MediaImage src={activeSeries.image} alt="" style={{ objectPosition: activeSeries.position }} /><div><p>{activeSeries.edition}</p><h1>{activeSeries.name}</h1><span>{activeSeries.copy}</span></div></section>
      <div className="shop-toolbar"><div className="shop-toolbar-title"><strong>{filtered.length} Products</strong></div><label className="sort-select">SORT<select name="series-sort" autoComplete="off" value={sort} onChange={(event) => { setSort(event.target.value); replaceQuery({ sort: event.target.value }, { sort: "FEATURED" }); }}><option>FEATURED</option><option>PRICE LOW</option><option>PRICE HIGH</option></select></label></div>
      <div className="shop-filters"><div className="filter-group"><span>TYPE</span>{PRODUCT_CATEGORIES.map((item) => <button type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => { setCategory(item); replaceQuery({ type: item }, { type: "ALL" }); }} key={item}>{item}</button>)}</div></div>
      <h2 className="sr-only">Products in {activeSeries.name}</h2>
      <div className="product-grid product-grid--shop">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div>
    </main>
  );
}

function ShopPage({ onAdd }: { onAdd: (product: Product) => void }) {
  const [world, setWorld] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("FEATURED");
  const [filtersOpen, setFiltersOpen] = useState(true);
  useEffect(() => {
    setWorld(queryChoice("world", PRODUCT_WORLDS, "ALL"));
    setCategory(queryChoice("type", PRODUCT_CATEGORIES, "ALL"));
    setSort(queryChoice("sort", PRODUCT_SORTS, "FEATURED"));
  }, []);
  const filtered = useMemo(() => {
    const result = products.filter((p) => (world === "ALL" || p.world === world) && (category === "ALL" || p.category.toUpperCase() === category));
    if (sort === "PRICE LOW") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "PRICE HIGH") return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [world, category, sort]);
  return (
    <main className="page-shell">
      <section className="page-intro page-intro--shop"><p className="eyebrow"><span />WE / PRODUCT ARCHIVE</p><h1>ALL PRODUCTS</h1><p>Original collections and customizable pieces, built around the story you choose to carry.</p></section>
      <div className="shop-toolbar">
        <div className="shop-toolbar-title"><strong>{filtered.length} Products</strong><button className="filter-toggle" type="button" onClick={() => setFiltersOpen(!filtersOpen)}>{filtersOpen ? "Hide Filters" : "Show Filters"}<Icon name={filtersOpen ? "minus" : "plus"} size={17} /></button></div>
        <label className="sort-select">SORT<select name="archive-sort" autoComplete="off" value={sort} onChange={(e) => { setSort(e.target.value); replaceQuery({ sort: e.target.value }, { sort: "FEATURED" }); }}><option>FEATURED</option><option>PRICE LOW</option><option>PRICE HIGH</option></select></label>
      </div>
      {filtersOpen && <div className="shop-filters"><div className="filter-group"><span>WORLD</span>{PRODUCT_WORLDS.map((item) => <button type="button" className={world === item ? "active" : ""} aria-pressed={world === item} onClick={() => { setWorld(item); replaceQuery({ world: item }, { world: "ALL" }); }} key={item}>{item}</button>)}</div><div className="filter-group"><span>TYPE</span>{PRODUCT_CATEGORIES.map((item) => <button type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => { setCategory(item); replaceQuery({ type: item }, { type: "ALL" }); }} key={item}>{item}</button>)}</div></div>}
      <h2 className="sr-only">All products</h2>
      <div className="product-grid product-grid--shop">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div>
    </main>
  );
}

function WorldPage({ slug, onAdd }: { slug: string; onAdd: (product: Product) => void }) {
  const key = (slug in worlds ? slug : "create") as keyof typeof worlds;
  if (key === "create") return <CollectionsGatewayPage />;
  const world = worlds[key];
  const selected = products.filter((p) => p.world === world.name);
  return (
    <main>
      <section className="world-hero"><MediaImage src={world.image} alt={`${world.name} collection`} style={{ objectPosition: world.position }} /><div className="world-hero-copy"><p className="eyebrow"><span />WORLD / {world.name}</p><h1>{world.name}</h1><p className="world-kicker">{world.kicker}</p><p>{world.body}</p><a className="button button--light" href="#collection">EXPLORE THE WORLD <Icon name="arrow" /></a></div></section>
      <section className="section editorial-block"><div><span className="editorial-number">WE / 0{Object.keys(worlds).indexOf(key) + 1}</span><h2>{key === "create" ? "A FOUNDATION FOR YOUR MARK." : key === "honor" ? "MEMORY, MADE TANGIBLE." : "IDENTITY LIVES IN THE DETAILS."}</h2></div><p>{key === "create" ? "The silhouette comes first: deliberate proportion, durable materials, and room for personal expression." : key === "honor" ? "We study the details that mattered, then translate them with restraint, always original and always respectful." : "A color, a route, a familiar phrase. The smallest signs can carry the strongest sense of place."}</p></section>
      <section id="collection" className="section"><div className="split-heading"><SectionTitle eyebrow={`${world.name} COLLECTION`} title="THE PIECES" /><a className="text-link" href="/collections">ALL SERIES <Icon name="arrow" /></a></div><div className="product-grid">{selected.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}</div></section>
    </main>
  );
}

function ProductPage({ id, onAdd }: { id: string; onAdd: (product: Product, options?: Partial<CartItem>) => void }) {
  const product = products.find((p) => p.id === id) || products[0];
  const [size, setSize] = useState("M");
  const [color, setColor] = useState(product.colors[0]);
  const [open, setOpen] = useState("DETAILS");
  return (
    <main className="pdp">
      <div className="breadcrumbs"><a href={`/collections/${product.series}`}>COLLECTIONS</a><span>/</span><span>{product.world}</span><span>/</span><span>{product.name}</span></div>
      <section className="pdp-grid">
        <div className="pdp-gallery"><ProductImage product={product} priority /><div className="pdp-detail-image"><MediaImage src="/editorial/craft-detail.jpg" alt="Material and stitch detail" loading="lazy" /></div></div>
        <div className="pdp-panel"><p className="eyebrow"><span />{product.world} / {product.tag}</p><h1>{product.name}</h1><p className="pdp-price">{formatPrice(product.price)}</p><p className="pdp-description">{product.description}</p>
          <fieldset><legend>COLOR <strong>{color}</strong></legend><div className="swatches">{product.colors.map((item, index) => <button type="button" key={item} className={`swatch swatch--${index} ${color === item ? "active" : ""}`} onClick={() => setColor(item)} aria-label={item} title={item} />)}</div></fieldset>
          <fieldset><legend>SIZE <a href="/policies/size-guide">SIZE GUIDE</a></legend><div className="size-grid">{["XS", "S", "M", "L", "XL", "2XL"].map((item) => <button type="button" className={size === item ? "active" : ""} onClick={() => setSize(item)} key={item}>{item}</button>)}</div></fieldset>
          {product.customizable && <a className="custom-option" href="/custom"><span>MAKE IT YOURS<small>Add a name, number, and approved marks.</small></span><Icon name="arrow" /></a>}
          <button className="button button--dark button--full" onClick={() => onAdd(product, { size, color } as Partial<CartItem>)}>ADD TO CART / {formatPrice(product.price)}</button>
          <p className="microcopy">Complimentary tracked delivery on orders over {formatPrice(150)}. Personalized pieces follow the approved proof.</p>
          <div className="accordion">{[["DETAILS", "Original WE construction, breathable knit body, reinforced shoulder seams, and an embroidery-ready personalization field."], ["DELIVERY & RETURNS", "Ready-to-ship pieces dispatch in 1 to 3 business days. Personalized pieces enter production after proof approval."], ["CARE", "Cold wash inside out. Do not iron directly over decoration. Air dry when possible."]].map(([title, copy]) => <div key={title}><button onClick={() => setOpen(open === title ? "" : title)} aria-expanded={open === title}>{title}<Icon name={open === title ? "minus" : "plus"} /></button>{open === title && <p>{copy}</p>}</div>)}</div>
        </div>
      </section>
      <section className="promise-strip">{["ORIGINAL DESIGN", "PERSONALIZED PRODUCTION", "QUALITY INSPECTED", "TRACKED DELIVERY"].map((item) => <span key={item}><Icon name="check" />{item}</span>)}</section>
    </main>
  );
}

function GarmentPreview({ name, number, color, view }: { name: string; number: string; color: string; view: string }) {
  const colors: Record<string, string> = { Obsidian: "#0b0c0e", "Warm Ivory": "#f4f3ef", Chrome: "#b9bec7", "Signal Blue": "#173f8a", "Signal Red": "#a82d2d" };
  return (
    <div className="garment-stage">
      <div className="safe-zone"><span>SAFE PRINT FIELD</span></div>
      <svg className="jersey" viewBox="0 0 520 520" role="img" aria-label={`${view} jersey preview in ${color}`}>
        <path d="M165 78 217 55h86l52 23 92 52-57 101-55-26v252H185V205l-55 26-57-101 92-52Z" fill={colors[color] || colors.Obsidian} stroke="#b9bec7" strokeWidth="3" />
        <path d="M217 55c9 26 23 39 43 39s34-13 43-39" fill="none" stroke="#b9bec7" strokeWidth="9" />
        <path d="M185 210h150M185 404h150" stroke="#b9bec7" strokeWidth="3" opacity=".75" />
        <text x="260" y="226" textAnchor="middle" fill={color === "Warm Ivory" ? "#0b0c0e" : "#f4f3ef"} fontFamily="Bebas Neue, sans-serif" fontWeight="400" fontSize="24" letterSpacing="4">{view === "BACK" ? (name || "YOUR NAME").slice(0, 12).toUpperCase() : "WE"}</text>
        <text x="260" y="335" textAnchor="middle" fill={color === "Warm Ivory" ? "#0b0c0e" : "#f4f3ef"} fontFamily="Bebas Neue, sans-serif" fontWeight="400" fontSize="104">{view === "LEFT" ? "L" : view === "RIGHT" ? "R" : (number || "01").padStart(2, "0")}</text>
      </svg>
      <div className="preview-label">LIVE PREVIEW / {view}</div>
    </div>
  );
}

function CustomizerPage({ onAdd }: { onAdd: (product: Product, options?: Partial<CartItem>) => void }) {
  const product = products[0];
  const [step, setStep] = useState(0);
  const [view, setView] = useState("FRONT");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("01");
  const [color, setColor] = useState("Obsidian");
  const [size, setSize] = useState("M");
  const [patch, setPatch] = useState(false);
  const [rights, setRights] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draftClean, setDraftClean] = useState(true);
  const draftReadyRef = useRef(false);
  const price = product.price + (name ? 12 : 0) + (number ? 8 : 0) + (patch ? 18 : 0);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("we-design");
      if (stored) {
        const draft = JSON.parse(stored);
        setName(draft.name || ""); setNumber(draft.number || "01"); setColor(draft.color || "Obsidian"); setSize(draft.size || "M"); setPatch(Boolean(draft.patch));
      }
    } catch { /* ignore malformed local demo data */ }
    requestAnimationFrame(() => { draftReadyRef.current = true; });
  }, []);
  useEffect(() => {
    if (draftReadyRef.current) setDraftClean(false);
  }, [name, number, color, size, patch]);
  useEffect(() => {
    if (draftClean) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [draftClean]);
  function saveDraft() {
    localStorage.setItem("we-design", JSON.stringify({ name, number, color, size, patch, updatedAt: new Date().toISOString() }));
    setDraftClean(true);
    setSaved(true); setTimeout(() => setSaved(false), 2200);
  }
  function next() { setStep((current) => Math.min(3, current + 1)); }
  function previous() { setStep((current) => Math.max(0, current - 1)); }
  function addCustom() {
    onAdd(product, { price, size, color, custom: { name, number, view, designId: "WU-D-260810", proofVersion: "V1" } } as Partial<CartItem>);
  }
  const steps = ["CHOOSE", "PERSONALIZE", "REVIEW", "ORDER & TRACK"];
  return (
    <main className="customizer-page">
      <div className="customizer-head"><div><p className="eyebrow"><span />CREATE YOURS / DESIGN STUDIO</p><h1>MAKE IT<br />UNMISTAKABLY YOURS.</h1></div><button className="save-button" onClick={saveDraft}>{saved ? "DRAFT SAVED" : "SAVE DRAFT"}</button></div>
      <div className="stepper" aria-label="Customization progress">{steps.map((item, index) => <button key={item} className={step === index ? "active" : step > index ? "done" : ""} onClick={() => setStep(index)}><span>{step > index ? "✓" : `0${index + 1}`}</span>{item}</button>)}</div>
      <div className="studio-grid">
        <section className="preview-panel"><div className="view-tabs">{["FRONT", "BACK", "LEFT", "RIGHT"].map((item) => <button className={view === item ? "active" : ""} key={item} onClick={() => setView(item)}>{item}</button>)}</div><GarmentPreview name={name} number={number} color={color} view={view} /><div className="preview-tools"><span>DRAG TO ROTATE</span><span>DESIGN ID / WU-D-260810</span></div></section>
        <section className="config-panel">
          {step === 0 && <div className="config-block"><p className="config-index">STEP 01 / BASE</p><h2>CHOOSE YOUR ORIGINAL.</h2><div className="base-card"><div><strong>{product.name}</strong><span>{product.description}</span></div><b>{formatPrice(product.price)}</b></div><label>SIZE<select name="size" autoComplete="off" value={size} onChange={(e) => setSize(e.target.value)}>{["XS", "S", "M", "L", "XL", "2XL"].map((item) => <option key={item}>{item}</option>)}</select></label><label>BASE COLOR<div className="color-options">{["Obsidian", "Warm Ivory", "Chrome", "Signal Blue"].map((item) => <button type="button" className={color === item ? "active" : ""} key={item} onClick={() => setColor(item)}><span className={`color-dot color-dot--${item.replace(" ", "-").toLowerCase()}`} />{item}</button>)}</div></label></div>}
          {step === 1 && <div className="config-block"><p className="config-index">STEP 02 / DETAILS</p><h2>PERSONALIZE THE PIECE.</h2><label>NAME <small>+ {formatPrice(12)}</small><input name="personalized-name" autoComplete="off" maxLength={12} placeholder="Your name…" value={name} onChange={(e) => setName(e.target.value)} /></label><label>NUMBER <small>0 TO 99 / + {formatPrice(8)}</small><input name="personalized-number" autoComplete="off" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={number} onChange={(e) => setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))} /></label><label>TYPEFACE<select name="typeface" autoComplete="off"><option>WE BLOCK</option><option>FIELD CONDENSED</option><option>ARCHIVE SANS</option></select></label><label className="toggle-row"><span><strong>WOVEN PATCH</strong><small>Approved placement / + {formatPrice(18)}</small></span><input name="woven-patch" type="checkbox" checked={patch} onChange={(e) => setPatch(e.target.checked)} /></label><label>UPLOAD A MARK <small>PNG, JPG, or PDF / reviewed before production</small><input name="artwork" type="file" accept=".png,.jpg,.jpeg,.pdf" /></label><p className="safety-note">Uploads are previewed as files only; SVG is not accepted or executed. Keep artwork inside the marked safe field.</p></div>}
          {step === 2 && <div className="config-block review-block"><p className="config-index">STEP 03 / PROOF V1</p><h2>REVIEW EVERY DETAIL.</h2><dl><div><dt>PIECE</dt><dd>{product.name} / {size}</dd></div><div><dt>COLOR</dt><dd>{color}</dd></div><div><dt>NAME</dt><dd>{name || "None"}</dd></div><div><dt>NUMBER</dt><dd>{number || "None"}</dd></div><div><dt>PATCH</dt><dd>{patch ? "Included" : "None"}</dd></div><div><dt>PROOF</dt><dd>Version 1</dd></div></dl><label className="rights-check"><input name="rights-approval" type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} /><span>I confirm I have permission to use any uploaded names, logos, or artwork, and I approve this proof for production.</span></label><p className="safety-note">Production starts only after proof approval. Verify spelling, number, size, color, and placement.</p></div>}
          {step === 3 && <div className="config-block order-block"><p className="config-index">STEP 04 / ORDER & TRACK</p><h2>READY FOR PRODUCTION.</h2><div className="production-map">{["PROOF APPROVAL", "PERSONALIZED PRODUCTION", "QUALITY INSPECTION", "TRACKED DELIVERY"].map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div><p>When the order is placed, your Design ID and proof version stay attached from production through delivery.</p><button className="button button--silver button--full" disabled={!rights} onClick={addCustom}>ADD APPROVED DESIGN / {formatPrice(price)}</button>{!rights && <small>Return to Review and approve the rights statement to continue.</small>}</div>}
          <div className="config-footer"><div><span>ESTIMATED TOTAL</span><strong>{formatPrice(price)}</strong></div><div>{step > 0 && <button className="button button--outline" onClick={previous}>BACK</button>}{step < 3 && <button className="button button--dark" onClick={next}>CONTINUE <Icon name="arrow" /></button>}</div></div>
        </section>
      </div>
    </main>
  );
}

function CartPage({ cart, setCart }: { cart: CartItem[]; setCart: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const update = (key: string, quantity: number) => setCart((items) => items.map((item) => item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item));
  const remove = (key: string) => {
    if (window.confirm("Remove this item from your cart?")) setCart((items) => items.filter((item) => item.key !== key));
  };
  return (
    <main className="page-shell cart-page"><div className="section-title"><p className="eyebrow"><span />YOUR SELECTION</p><h1 className="cart-title">CART</h1><p className="section-copy">{cart.reduce((sum, item) => sum + item.quantity, 0)} item{cart.length === 1 ? "" : "s"} ready for the next step.</p></div>
      {cart.length === 0 ? <div className="empty-state"><span>WE / 000</span><h2>YOUR CART IS WAITING.</h2><p>Start with an original, then make it yours.</p><a className="button button--dark" href="/collections">EXPLORE COLLECTIONS <Icon name="arrow" /></a></div> : <div className="cart-layout"><section className="cart-list">{cart.map((item) => <article className="cart-item" key={item.key}><div className="cart-thumb"><MediaImage src={item.image} alt="" style={{ objectPosition: item.imagePosition }} loading="lazy" /></div><div className="cart-item-copy"><p>{item.custom ? "PERSONALIZED" : "READY TO SHIP"}</p><h2>{item.name}</h2><span>{item.color} / {item.size}</span>{item.custom && <div className="design-meta"><span>DESIGN ID {item.custom.designId}</span><span>PROOF {item.custom.proofVersion}</span><span>{item.custom.name || "NO NAME"} / {item.custom.number}</span><a href="/custom">EDIT DESIGN</a></div>}<div className="quantity"><button aria-label="Decrease quantity" onClick={() => update(item.key, item.quantity - 1)}><Icon name="minus" /></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => update(item.key, item.quantity + 1)}><Icon name="plus" /></button></div></div><div className="cart-item-price"><strong>{formatPrice(item.price * item.quantity)}</strong><button onClick={() => remove(item.key)}>REMOVE</button></div></article>)}</section><aside className="order-summary"><h2>ORDER SUMMARY</h2><dl><div><dt>SUBTOTAL</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>DELIVERY</dt><dd>{subtotal >= 150 ? "COMPLIMENTARY" : "CALCULATED NEXT"}</dd></div><div><dt>ESTIMATED TAX</dt><dd>CALCULATED NEXT</dd></div><div className="summary-total"><dt>ESTIMATED TOTAL</dt><dd>{formatPrice(subtotal)}</dd></div></dl><a className="button button--silver button--full" href="/checkout">CHECKOUT SECURELY <Icon name="arrow" /></a><p>Taxes and delivery are confirmed before payment. Personalized items display their proof version throughout checkout.</p></aside></div>}
    </main>
  );
}

function CheckoutPage({ cart, clearCart }: { cart: CartItem[]; clearCart: () => void }) {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const stages = ["INFORMATION", "DELIVERY", "PAYMENT", "REVIEW"];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  function placeOrder() {
    const order = { id: "WU-2026-0148", createdAt: new Date().toISOString(), total: subtotal, stage: 1 };
    localStorage.setItem("we-order", JSON.stringify(order)); clearCart(); setComplete(true);
  }
  if (complete) return <main className="confirmation"><span className="confirmation-check"><Icon name="check" size={38} /></span><p className="eyebrow"><span />ORDER CONFIRMED</p><h1>YOUR PIECE<br />IS IN MOTION.</h1><p>Order <strong>WU-2026-0148</strong> has been created in this prototype. Production updates will stay connected to its Design ID and approved proof.</p><a className="button button--dark" href="/track">TRACK THE DEMO ORDER <Icon name="arrow" /></a></main>;
  if (!cart.length) return <main className="page-shell"><div className="empty-state"><h1>NO ITEMS TO CHECK OUT.</h1><p>Add a piece before starting checkout.</p><a className="button button--dark" href="/collections">EXPLORE COLLECTIONS</a></div></main>;
  return (
    <main className="checkout-page"><div className="checkout-main"><Logo light={false} /><div className="checkout-steps">{stages.map((item, index) => <button onClick={() => index <= step && setStep(index)} className={step === index ? "active" : step > index ? "done" : ""} key={item}><span>{step > index ? "✓" : index + 1}</span>{item}</button>)}</div>
      {step === 0 && <section className="checkout-panel"><h1>CONTACT & DELIVERY DETAILS</h1><div className="form-grid"><label className="full">EMAIL<input name="email" type="email" autoComplete="email" spellCheck={false} defaultValue="developer@example.com" /></label><label>FIRST NAME<input name="given-name" autoComplete="given-name" defaultValue="Alex" /></label><label>LAST NAME<input name="family-name" autoComplete="family-name" defaultValue="Morgan" /></label><label className="full">ADDRESS<input name="street-address" autoComplete="street-address" defaultValue="111 Market Street" /></label><label>CITY<input name="city" autoComplete="address-level2" defaultValue="Portland" /></label><label>STATE<select name="state" autoComplete="address-level1" defaultValue="OR"><option>OR</option><option>CA</option><option>NY</option></select></label><label>ZIP CODE<input name="postal-code" autoComplete="postal-code" inputMode="numeric" defaultValue="97205" /></label><label>COUNTRY<select name="country" autoComplete="country-name"><option>United States</option></select></label></div></section>}
      {step === 1 && <section className="checkout-panel"><h1>CHOOSE DELIVERY</h1><label className="delivery-option"><input type="radio" defaultChecked name="delivery" /><span><strong>TRACKED STANDARD</strong><small>3 to 6 business days after dispatch</small></span><b>{subtotal >= 150 ? "COMPLIMENTARY" : formatPrice(12)}</b></label><label className="delivery-option"><input type="radio" name="delivery" /><span><strong>TRACKED EXPRESS</strong><small>1 to 3 business days after dispatch</small></span><b>{formatPrice(28)}</b></label><p className="safety-note">Personalized production time is separate from delivery time and begins after proof approval.</p></section>}
      {step === 2 && <section className="checkout-panel"><h1>SECURE PAYMENT</h1><div className="hosted-payment"><span>HOSTED PAYMENT</span><h2>PAYMENT DETAILS STAY WITH THE PROVIDER.</h2><p>This prototype does not request or store card numbers. In production, a PCI-compliant hosted payment session opens here and returns only a tokenized result.</p><label><input type="radio" name="payment-method" defaultChecked /> SANDBOX PAYMENT TOKEN</label></div></section>}
      {step === 3 && <section className="checkout-panel"><h1>REVIEW & PLACE ORDER</h1><div className="review-order">{cart.map((item) => <div key={item.key}><span>{item.name} × {item.quantity}<small>{item.color} / {item.size}{item.custom ? ` / ${item.custom.designId} ${item.custom.proofVersion}` : ""}</small></span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}</div><label className="rights-check"><input name="order-review" type="checkbox" defaultChecked /><span>I have reviewed the delivery details, item specifications, and any personalized proof information.</span></label></section>}
      <div className="checkout-actions">{step > 0 && <button className="button button--outline" onClick={() => setStep(step - 1)}>BACK</button>}{step < 3 ? <button className="button button--dark" onClick={() => setStep(step + 1)}>CONTINUE <Icon name="arrow" /></button> : <button className="button button--silver" onClick={placeOrder}>PLACE DEMO ORDER <Icon name="arrow" /></button>}</div></div>
      <aside className="checkout-summary"><h2>YOUR ORDER</h2>{cart.map((item) => <div className="checkout-item" key={item.key}><div><MediaImage src={item.image} alt="" style={{ objectPosition: item.imagePosition }} loading="lazy" /><span>{item.quantity}</span></div><p>{item.name}<small>{item.custom ? "PERSONALIZED / PROOF V1" : "READY TO SHIP"}</small></p><b>{formatPrice(item.price * item.quantity)}</b></div>)}<dl><div><dt>SUBTOTAL</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>DELIVERY</dt><dd>{subtotal >= 150 ? "COMPLIMENTARY" : formatPrice(12)}</dd></div><div className="summary-total"><dt>TOTAL</dt><dd>{formatPrice(subtotal + (subtotal >= 150 ? 0 : 12))}</dd></div></dl></aside>
    </main>
  );
}

function AccountPage() {
  const [tab, setTab] = useState("ORDERS");
  useEffect(() => setTab(queryChoice("view", ACCOUNT_TABS, "ORDERS")), []);
  return <main className="account-page"><aside><p>WELCOME BACK</p><h1>ALEX<br />MORGAN</h1><nav aria-label="Account sections">{ACCOUNT_TABS.map((item) => <button type="button" className={tab === item ? "active" : ""} aria-current={tab === item ? "page" : undefined} onClick={() => { setTab(item); replaceQuery({ view: item }, { view: "ORDERS" }); }} key={item}>{item}<Icon name="arrow" /></button>)}</nav><button className="signout">SIGN OUT</button></aside><section><p className="eyebrow"><span />ACCOUNT / {tab}</p><h2>{tab}</h2>{tab === "ORDERS" && <div className="account-order"><div><span>DEMO ORDER</span><strong>WU-2026-0148</strong><p>Confirmed / {formatDate("2026-08-10")}</p></div><div><b>{formatPrice(158)}</b><a href="/track">TRACK ORDER <Icon name="arrow" /></a></div></div>}{tab === "SAVED DESIGNS" && <div className="saved-design"><GarmentPreview name="MORGAN" number="01" color="Obsidian" view="BACK" /><div><span>DRAFT / UPDATED TODAY</span><h3>{products[0].name}</h3><p>Design ID WU-D-260810</p><a className="button button--dark" href="/custom">CONTINUE DESIGN</a></div></div>}{![["ORDERS"], ["SAVED DESIGNS"]].flat().includes(tab) && <div className="account-placeholder"><span>LOCAL PROTOTYPE</span><h3>{tab} CONTROLS</h3><p>This area is structured for authenticated customer data. Connect identity and commerce services before production.</p><button className="button button--outline">EDIT {tab}</button></div>}</section></main>;
}

function TrackingPage() {
  const [searched, setSearched] = useState(true);
  const [order, setOrder] = useState("WU-2026-0148");
  const current = 3;
  return <main className="tracking-page"><section className="tracking-intro"><p className="eyebrow"><span />ORDER TRACKING</p><h1>FOLLOW EVERY<br />STEP OF THE WAY.</h1><form onSubmit={(e) => { e.preventDefault(); setSearched(Boolean(order)); }}><label>ORDER NUMBER<input name="order-number" autoComplete="off" spellCheck={false} value={order} onChange={(e) => setOrder(e.target.value)} /></label><label>EMAIL<input name="tracking-email" type="email" autoComplete="email" spellCheck={false} defaultValue="developer@example.com" /></label><button className="button button--silver">TRACK ORDER</button></form></section>{searched && <section className="tracking-result"><div className="tracking-meta"><div><span>DEMO ORDER</span><h2>WU-2026-0148</h2></div><div><span>CURRENT STATUS</span><strong>IN PRODUCTION</strong></div><div><span>ESTIMATED DISPATCH</span><strong>{formatMonthDay("2026-08-20")} TO {formatMonthDay("2026-08-24")}</strong></div></div><ol>{orderStages.map((stage, index) => <li className={index < current ? "done" : index === current ? "active" : ""} key={stage}><span>{index < current ? <Icon name="check" /> : index + 1}</span><div><strong>{stage}</strong>{index === current && <small>Your approved details are being applied to the piece.</small>}</div></li>)}</ol><p className="demo-note">Prototype status only. Production data must come from the order-management system.</p></section>}</main>;
}

function StoriesPage({ detail }: { detail?: string }) {
  const story = stories.find((item) => item.slug === detail) || stories[0];
  if (detail) return <main className="article-page"><header><p className="eyebrow"><span />{story.type} / {formatDate(story.date)}</p><h1>{story.title}</h1><p>{story.excerpt}</p></header><div className="article-hero"><MediaImage src={story.image} alt="" style={{ objectPosition: story.position }} loading="eager" /></div><article><p className="dropcap">A collection does not begin with a product. It begins with a reason, something observed, remembered, or shared that deserves a physical form.</p><h2>THE FIRST LINE</h2><p>For WE, that reason becomes a working system: a silhouette, a material language, a placement grid, and the space for someone else to finish the story.</p><blockquote>“Original first. Personal after.”</blockquote><h2>MADE TO BE COMPLETED</h2><p>The final piece is not a blank. It is a considered foundation that can carry a name, number, place, or mark without losing its own point of view.</p><a className="text-link" href="/stories">BACK TO ALL STORIES <Icon name="arrow" /></a></article></main>;
  return <main className="page-shell"><section className="page-intro"><p className="eyebrow"><span />FIELD NOTES</p><h1>STORIES WITH<br />A REASON.</h1><p>Design notes, community portraits, and the reasons behind every collection.</p></section><h2 className="sr-only">All stories</h2><div className="story-grid story-grid--index">{[...stories, ...stories].map((item, index) => <a href={`/stories/${item.slug}`} className="story-card" key={`${item.slug}-${index}`}><div><MediaImage src={item.image} alt="" style={{ objectPosition: item.position }} loading="lazy" /></div><p>{item.type} / {formatDate(item.date)}</p><h3>{index >= 3 ? `${item.title}: Field Edition` : item.title}</h3><span>{item.excerpt}</span></a>)}</div></main>;
}

function CraftsmanshipPage() {
  const stages = [["01", "MATERIALS", "Fabrics are selected for hand feel, movement, decoration stability, and repeated wear."], ["02", "CONSTRUCTION", "Proportion, reinforced seams, and controlled tolerances build a reliable foundation."], ["03", "PERSONALIZATION", "Approved names, numbers, and marks are placed within defined safe fields."], ["04", "INSPECTION", "The finished piece is checked against the approved proof before release."]];
  return <main><section className="craft-hero-page"><MediaImage src="/editorial/craft-detail.jpg" alt="WE craftsmanship process" /><div><p className="eyebrow"><span />CRAFTSMANSHIP</p><h1>DESIGNED WITH INTENT.<br />MADE WITH CARE.</h1><p>The quality of a personalized piece starts long before the first stitch.</p></div></section><section className="section process-list">{stages.map(([index, title, copy]) => <article key={title}><span>{index}</span><h2>{title}</h2><p>{copy}</p></article>)}</section><section className="inspection-callout"><div><p>QUALITY RECORD / WU-QC-04</p><h2>ONE PIECE.<br />MULTIPLE CHECKS.</h2></div><ul><li><Icon name="check" /> Match approved proof</li><li><Icon name="check" /> Verify placement and color</li><li><Icon name="check" /> Inspect seams and decoration</li><li><Icon name="check" /> Confirm packing and label</li></ul></section></main>;
}

function CommunityPage() {
  const positions = ["19% 33%", "47% 37%", "76% 38%", "27% 74%", "58% 72%", "88% 70%"];
  const [selected, setSelected] = useState<number | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  function closeLook() {
    setSelected(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }
  useEffect(() => {
    if (selected === null) return;
    lightboxCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        requestAnimationFrame(() => returnFocusRef.current?.focus());
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selected]);
  return <main><section className="community-hero-page"><MediaImage src="/reference/image15.jpeg" alt="WE community editorial concept" /><div><p className="eyebrow"><span />COMMUNITY / WORN YOUR WAY</p><h1>THE FINAL STORY<br />BEGINS WITH YOU.</h1><p>Real combinations, shared places, and pieces completed by the people who wear them.</p></div></section><section className="section"><SectionTitle eyebrow="COMMUNITY FIELD" title="WORN YOUR WAY." copy="Prototype editorial frames. Replace with approved community submissions before launch." /><div className="community-grid">{positions.map((position, index) => <button key={position} onClick={(event) => { returnFocusRef.current = event.currentTarget; setSelected(index); }} aria-label={`Open community look ${index + 1}`}><MediaImage src="/reference/image15.jpeg" alt="" style={{ objectPosition: position }} loading="lazy" /><span>WE / LOOK 0{index + 1}</span></button>)}</div></section>{selected !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Community look"><button ref={lightboxCloseRef} onClick={closeLook} aria-label="Close"><Icon name="close" /></button><MediaImage src="/reference/image15.jpeg" alt="Selected community editorial concept" style={{ objectPosition: positions[selected] }} /><div><span>WE / LOOK 0{selected + 1}</span><p>Prototype editorial sample. Publish only after submission approval.</p></div></div>}</main>;
}

function AboutPage() {
  return <main className="about-page"><section className="about-hero"><div><p className="eyebrow"><span />WE / OUR PURPOSE</p><h1>WE MAKE THE<br />FOUNDATION.<br />YOU MAKE IT MEAN.</h1></div><MediaImage src="/reference/image16.jpeg" alt="WE design studio and community" /></section><section className="manifesto"><p className="manifesto-index">01 / WHY WE EXIST</p><p>WE creates original sportswear for identity, achievement, and belonging. Each piece begins with a clear design point of view, then leaves considered room for the person, team, or place that completes it.</p></section><section className="values-grid">{[["ORIGINAL", "We design the foundation instead of starting from a blank template."], ["PERSONAL", "We treat names, numbers, and marks as part of the product, never an afterthought."], ["PURPOSEFUL", "We make fewer promises, then show the process behind each one."]].map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{copy}</p></article>)}</section></main>;
}

function SupportPage() {
  const [open, setOpen] = useState(0);
  return <main className="support-page"><section className="support-hero"><p className="eyebrow"><span />WE’RE HERE TO HELP</p><h1>HOW CAN WE<br />HELP YOU?</h1><form action="/search"><label className="sr-only" htmlFor="help-search">Search help</label><input id="help-search" name="q" autoComplete="off" spellCheck={false} placeholder="Search orders, customization, delivery…" /><button aria-label="Search"><Icon name="search" /></button></form></section><section className="support-cards">{[["TRACK AN ORDER", "Follow production and delivery progress.", "/track"], ["CUSTOMIZATION GUIDE", "Understand proofs, uploads, and timing.", "/custom"], ["TEAM & GROUP ORDERS", "Build a roster and order together.", "/team-orders"]].map(([title, copy, href], index) => <a href={href} key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{copy}</p><Icon name="arrow" /></a>)}</section><section className="faq-section"><SectionTitle eyebrow="FREQUENTLY ASKED" title="COMMON QUESTIONS" />{faqs.map(([question, answer], index) => <div className="faq" key={question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>{String(index + 1).padStart(2, "0")}</span>{question}<Icon name={open === index ? "minus" : "plus"} /></button>{open === index && <p>{answer}</p>}</div>)}</section></main>;
}

function TeamOrdersPage() {
  const [rows, setRows] = useState([{ name: "", number: "", size: "M" }]);
  const update = (index: number, field: string, value: string) => setRows((items) => items.map((row, i) => i === index ? { ...row, [field]: value } : row));
  return <main className="team-page"><section className="team-hero"><MediaImage src="/reference/image18.jpeg" alt="Team wearing coordinated personalized pieces" /><div><p className="eyebrow"><span />TEAM & GROUP ORDERS</p><h1>ONE FOUNDATION.<br />EVERY PERSON COUNTED.</h1><p>Build a coordinated order without losing the details that belong to each member.</p></div></section><section className="section roster-section"><div><SectionTitle eyebrow="ROSTER BUILDER / PROTOTYPE" title="BUILD THE GROUP" copy="Add members manually or choose a CSV file. Production systems must validate every row before order creation." /><label className="file-drop">IMPORT CSV<input type="file" name="roster" accept=".csv" /><span>NAME, NUMBER, SIZE, COLOR</span></label></div><div className="roster-table"><div className="roster-head"><span>NAME</span><span>NUMBER</span><span>SIZE</span><span /></div>{rows.map((row, index) => <div className="roster-row" key={index}><input aria-label={`Member ${index + 1} name`} name={`member-${index + 1}-name`} autoComplete="off" value={row.name} onChange={(e) => update(index, "name", e.target.value)} placeholder="Name…" /><input aria-label={`Member ${index + 1} number`} name={`member-${index + 1}-number`} autoComplete="off" inputMode="numeric" value={row.number} onChange={(e) => update(index, "number", e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="00…" /><select aria-label={`Member ${index + 1} size`} name={`member-${index + 1}-size`} autoComplete="off" value={row.size} onChange={(e) => update(index, "size", e.target.value)}>{["XS", "S", "M", "L", "XL", "2XL"].map((s) => <option key={s}>{s}</option>)}</select><button aria-label="Remove row" onClick={() => { if (window.confirm("Remove this roster row?")) setRows((items) => items.filter((_, i) => i !== index)); }}><Icon name="close" /></button></div>)}<button className="add-row" onClick={() => setRows((items) => [...items, { name: "", number: "", size: "M" }])}><Icon name="plus" /> ADD MEMBER</button><div className="roster-total"><span>{rows.length} MEMBERS</span><a className="button button--dark" href="/custom">CHOOSE A BASE <Icon name="arrow" /></a></div></div></section></main>;
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const results = query.trim() ? products.filter((p) => `${p.name} ${p.world} ${p.category}`.toLowerCase().includes(query.toLowerCase())) : products.slice(0, 4);
  return <main className="search-page"><section><p className="eyebrow"><span />SITE SEARCH</p><h1>FIND YOUR<br />NEXT PIECE.</h1><label><span className="sr-only">Search</span><Icon name="search" /><input name="query" autoComplete="off" spellCheck={false} placeholder="Try ‘jersey’…" value={query} onChange={(e) => setQuery(e.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><Icon name="close" /></button>}</label></section><div className="search-results"><p>{query ? `${results.length} RESULTS FOR “${query.toUpperCase()}”` : "POPULAR RIGHT NOW"}</p>{results.map((product) => <a href={`/product/${product.id}`} key={product.id}><div><MediaImage src={product.image} alt="" style={{ objectPosition: product.imagePosition }} loading="lazy" /></div><span><small>{product.world} / {product.category}</small><strong>{product.name}</strong></span><b>{formatPrice(product.price)}</b><Icon name="arrow" /></a>)}{query && results.length === 0 && <div className="no-results"><h2>NO EXACT MATCH.</h2><p>Try a world, product type, or shorter phrase.</p></div>}</div></main>;
}

function PolicyPage({ type }: { type: string }) {
  const titles: Record<string, string> = { shipping: "SHIPPING GUIDE", returns: "RETURNS & ISSUES", privacy: "PRIVACY", terms: "TERMS", accessibility: "ACCESSIBILITY", "size-guide": "SIZE GUIDE" };
  const title = titles[type] || "POLICY & GUIDE";
  return <main className="policy-page"><aside><p>SUPPORT / GUIDE</p><h1>{title}</h1><nav>{Object.entries(titles).map(([slug, label]) => <a className={slug === type ? "active" : ""} href={`/policies/${slug}`} key={slug}>{label}<Icon name="arrow" /></a>)}</nav></aside><article><p className="updated">LAST UPDATED / {formatDate("2026-08-10")}</p><h2>THE SHORT VERSION</h2><p>WE uses clear process checkpoints so you can understand what happens before, during, and after an order. This prototype demonstrates the intended information structure and is not a final legal policy.</p><h2>{type === "shipping" ? "WHEN YOUR ORDER MOVES" : type === "returns" ? "WHEN SOMETHING ISN’T RIGHT" : type === "size-guide" ? "CHOOSING YOUR SIZE" : "HOW THIS GUIDE WORKS"}</h2><p>Ready-to-ship and personalized items follow different timelines. Personalized production begins after proof approval, then passes quality inspection before packing and tracked delivery.</p><div className="policy-table"><div><strong>READY TO SHIP</strong><span>Dispatch target</span><b>1 to 3 business days</b></div><div><strong>PERSONALIZED</strong><span>Production target</span><b>10 to 15 business days</b></div><div><strong>TRACKING</strong><span>Available after</span><b>Carrier scan</b></div></div><h2>QUESTIONS?</h2><p>Use Support for order-specific help. Production policy, privacy, tax, and legal text must be reviewed by qualified operators before launch.</p><a className="button button--dark" href="/support">VISIT SUPPORT <Icon name="arrow" /></a></article></main>;
}

function AdminPage() {
  const roles = ["Super Admin", "Content Editor", "Merchandiser", "Designer / Prepress", "Production", "Quality Control", "Fulfillment", "Customer Support", "Analyst"];
  const modules = ["Dashboard", "Homepage CMS", "Catalog", "Customization Templates", "Design Assets", "Design Review", "Orders", "Production", "Quality", "Shipping", "Stories / Community", "Support", "Settings"];
  const [role, setRole] = useState(roles[0]);
  const [module, setModule] = useState("Dashboard");
  const [published, setPublished] = useState(false);
  const translations: Record<string, string> = { Dashboard: "仪表盘", "Homepage CMS": "首页内容", Catalog: "商品目录", "Customization Templates": "定制模板", "Design Assets": "设计素材", "Design Review": "设计审核", Orders: "订单", Production: "生产", Quality: "质检", Shipping: "配送", "Stories / Community": "故事 / 社区", Support: "客服", Settings: "设置" };
  return (
    <main className="admin-shell">
      <aside>
        <div className="admin-brand"><Logo /><span>CONTROL / 管理后台</span></div>
        <nav>{modules.map((item) => <button className={module === item ? "active" : ""} onClick={() => setModule(item)} key={item}>{item}<small>{translations[item]}</small></button>)}</nav>
      </aside>
      <section className="admin-main">
        <header><div><p>WE OPERATIONS</p><h1>{module}</h1></div><label>ROLE / 角色<select name="admin-role" autoComplete="off" value={role} onChange={(event) => setRole(event.target.value)}>{roles.map((item) => <option key={item}>{item}</option>)}</select></label></header>
        {module === "Dashboard" ? (
          <div className="admin-dashboard">
            <div className="admin-metrics">{[["OPEN ORDERS", "128", "待处理订单"], ["DESIGN REVIEWS", "24", "设计审核"], ["IN PRODUCTION", "67", "生产中"], ["QC HOLD", "03", "质检暂停"]].map(([label, value, cn]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{cn}</small></article>)}</div>
            <div className="admin-columns"><article><h2>PRODUCTION QUEUE / 生产队列</h2>{["WU-0148 / Proof approved", "WU-0147 / Embroidery", "WU-0145 / Final inspection"].map((item, index) => <p key={item}><span>0{index + 1}</span>{item}<b>{index === 2 ? "QC" : "ACTIVE"}</b></p>)}</article><article><h2>AUDIT LOG / 审计日志</h2>{["Homepage hero saved as draft", "Price rule updated", "Proof V2 approved"].map((item) => <p key={item}>{item}<small>Today / System demo</small></p>)}</article></div>
          </div>
        ) : (
          <div className="admin-editor">
            <div><p className="config-index">MODULE / {module.toUpperCase()}</p><h2>{module} workspace</h2><p>This bilingual operational prototype maps the required permissions, version history, and audit controls. Connect a real CMS, commerce database, and identity provider for production use.</p><label>INTERNAL TITLE / 内部标题<input name="internal-title" autoComplete="off" defaultValue={`${module} / 2026.08`} /></label><label>STATUS / 状态<select name="status" autoComplete="off"><option>Draft / 草稿</option><option>In review / 审核中</option><option>Published / 已发布</option></select></label><label>CHANGE NOTE / 变更说明<textarea name="change-note" autoComplete="off" defaultValue="Structured according to WE V2.4 requirements." /></label><button className="button button--dark" onClick={() => setPublished(true)}>{published ? "VERSION SAVED / 版本已保存" : "SAVE VERSION / 保存版本"}</button></div>
            <aside><h3>ACCESS / 权限</h3><p><strong>{role}</strong></p><ul><li><Icon name="check" /> View module / 查看</li><li><Icon name="check" /> Draft changes / 草拟</li><li><Icon name={role === "Analyst" ? "close" : "check"} /> Publish / 发布</li><li><Icon name="check" /> Audit logged / 记录审计</li></ul></aside>
          </div>
        )}
      </section>
    </main>
  );
}

function NotFoundPage() {
  return <main className="not-found"><span>404 / OFF THE FIELD</span><h1>THIS ROUTE<br />ISN’T IN PLAY.</h1><p>The page may have moved, but the rest of WE is close by.</p><a className="button button--light" href="/">RETURN HOME <Icon name="arrow" /></a></main>;
}

export default function SiteApp({ path = "/" }: { path?: string }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    try { const stored = localStorage.getItem("we-cart"); if (stored) setCart(JSON.parse(stored)); } catch { /* ignore malformed local demo data */ }
    setCartReady(true);
  }, []);
  useEffect(() => { if (cartReady) localStorage.setItem("we-cart", JSON.stringify(cart)); }, [cart, cartReady]);
  function addToCart(product: Product, options: Partial<CartItem> = {}) {
    const item: CartItem = { key: options.custom ? `${product.id}-${options.custom.designId}` : `${product.id}-${options.size || "M"}-${options.color || product.colors[0]}`, productId: product.id, name: product.name, price: options.price || product.price, quantity: 1, size: options.size || "M", color: options.color || product.colors[0], image: product.image, imagePosition: product.imagePosition, custom: options.custom };
    setCart((items) => { const existing = items.find((candidate) => candidate.key === item.key); return existing ? items.map((candidate) => candidate.key === item.key ? { ...candidate, quantity: candidate.quantity + 1 } : candidate) : [...items, item]; });
    setToast(`${product.name} added to cart`); setTimeout(() => setToast(""), 2600);
  }
  const segments = path.split("/").filter(Boolean);
  let page: React.ReactNode;
  if (!segments.length) page = <HomePage />;
  else if (segments[0] === "collections" && segments[1]) page = <CollectionPage slug={segments[1]} onAdd={addToCart} />;
  else if (segments[0] === "collections") page = <CollectionsGatewayPage />;
  else if (segments[0] === "shop") page = <ShopPage onAdd={addToCart} />;
  else if (segments[0] === "world") page = <WorldPage slug={segments[1] || "create"} onAdd={addToCart} />;
  else if (segments[0] === "product") page = <ProductPage id={segments[1] || products[0].id} onAdd={addToCart} />;
  else if (segments[0] === "custom" || segments[0] === "create-yours") page = <CustomizerPage onAdd={addToCart} />;
  else if (segments[0] === "cart") page = <CartPage cart={cart} setCart={setCart} />;
  else if (segments[0] === "checkout") page = <CheckoutPage cart={cart} clearCart={() => setCart([])} />;
  else if (segments[0] === "account") page = <AccountPage />;
  else if (segments[0] === "track") page = <TrackingPage />;
  else if (segments[0] === "stories") page = <StoriesPage detail={segments[1]} />;
  else if (segments[0] === "craftsmanship") page = <CraftsmanshipPage />;
  else if (segments[0] === "community") page = <CommunityPage />;
  else if (segments[0] === "about") page = <AboutPage />;
  else if (segments[0] === "support") page = <SupportPage />;
  else if (segments[0] === "team-orders") page = <TeamOrdersPage />;
  else if (segments[0] === "search") page = <SearchPage />;
  else if (segments[0] === "policies") page = <PolicyPage type={segments[1] || "shipping"} />;
  else if (segments[0] === "admin") return <><AdminPage />{toast && <div className="toast" role="status" aria-live="polite"><Icon name="check" />{toast}<a href="/cart">VIEW CART</a></div>}</>;
  else page = <NotFoundPage />;
  return <><a className="skip-link" href="#main-content">Skip to main content</a><Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} /><div id="main-content">{page}</div><Footer />{toast && <div className="toast" role="status" aria-live="polite"><Icon name="check" />{toast}<a href="/cart">VIEW CART</a></div>}</>;
}
