import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import { createBrotliDecompress } from 'node:zlib'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import { createServer } from 'vite'

async function browserExecutable() {
  const directory = path.join(tmpdir(), 'we-preview-chromium')
  const browserPath = path.join(directory, 'chromium')
  if (existsSync(browserPath) && (await fs.stat(browserPath)).size > 0) return browserPath
  const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.resolve('@sparticuz/chromium'))))
  const partial = `${browserPath}.partial`
  await fs.mkdir(directory, { recursive: true })
  await pipeline(createReadStream(path.join(packageRoot, 'bin', 'chromium.br')), createBrotliDecompress(), createWriteStream(partial, { mode: 0o700 }))
  await fs.rename(partial, browserPath)
  await fs.chmod(browserPath, 0o700)
  return browserPath
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function assertNoUnverifiedAmount(page, label) {
  const text = await page.$eval('body', (body) => body.innerText)
  assert(!/\$\s*\d/.test(text), `${label} must not render an unverified dollar amount.`)
}

async function expectClientRedirect(page, baseUrl, from, to) {
  await page.goto(`${baseUrl}${from}`, { waitUntil: 'networkidle0' })
  await page.waitForFunction((expectedPath) => window.location.pathname === expectedPath, {}, to)
  assert(new URL(page.url()).pathname === to, `${from} must redirect to ${to}.`)
}

const server = await createServer({ logLevel: 'error', server: { host: '127.0.0.1', port: 4173, strictPort: false } })
await server.listen()
const address = server.httpServer?.address()
if (!address || typeof address === 'string') throw new Error('E2E server did not expose a port.')
const baseUrl = `http://127.0.0.1:${address.port}`
const { defaultSiteConfig } = await server.ssrLoadModule('/src/data/siteConfig.ts')
const browser = await puppeteer.launch({
  executablePath: await browserExecutable(),
  headless: 'shell',
  args: [
    ...chromium.args.filter((arg) => !["--headless='shell'", '--in-process-gpu', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'].includes(arg)),
    '--headless',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
  ],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000 })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const managedPreviewPaths = {
    front: '/images/white-pulse-game-jersey-02-collar-detail.webp',
    back: '/images/white-pulse-game-jersey-03-pattern-detail.webp',
    left: '/images/white-pulse-game-jersey-04-seam-detail.webp',
    right: '/images/white-pulse-game-jersey-05-on-model.webp',
  }
  let serveManagedPreviewImages = true
  await page.setRequestInterception(true)
  page.on('request', async (request) => {
    const url = new URL(request.url())
    if (url.pathname === '/api/site-config') {
      await request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          config: defaultSiteConfig,
          authenticated: url.searchParams.get('admin') === '1' ? true : undefined,
          adminConfigured: true,
          storageConfigured: true,
        }),
      })
      return
    }
    if (url.pathname === '/api/admin-media') {
      await request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ media: [] }) })
      return
    }
    if (url.pathname !== '/api/customizer-images') {
      await request.continue()
      return
    }
    if (request.method() === 'GET') {
      await request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          productSlug: url.searchParams.get('product'),
          storageConfigured: true,
          complete: serveManagedPreviewImages,
          images: serveManagedPreviewImages
            ? Object.fromEntries(Object.entries(managedPreviewPaths).map(([view, imageUrl]) => [
                view,
                { url: imageUrl, uploadedAt: `2026-08-13T18:30:0${Object.keys(managedPreviewPaths).indexOf(view)}.000Z` },
              ]))
            : {},
        }),
      })
      return
    }
    await request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })

  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  const createNavigationPath = await page.$eval(
    'nav[aria-label="Primary navigation"] a',
    (link) => new URL(link.href).pathname,
  )
  assert(createNavigationPath === '/collections', 'Primary CREATE navigation must link directly to /collections.')
  await page.click('nav[aria-label="Primary navigation"] a')
  await page.waitForFunction(() => window.location.pathname === '/collections')

  await page.goto(`${baseUrl}/collections`, { waitUntil: 'networkidle0' })
  assert(await page.$$eval('a.collection-row', (rows) => rows.length === 3), 'Collection Gateway must expose one full-width link per series.')
  assert(await page.$$eval('.product-grid', (grids) => grids.length === 0), 'Gateway must not expose a product grid.')
  const seriesPaths = await page.$$eval('a.collection-row', (rows) => rows.map((row) => new URL(row.href).pathname))
  assert(
    JSON.stringify(seriesPaths) === JSON.stringify([
      '/collections/white-pulse',
      '/collections/black-rift',
      '/collections/identity-fusion',
    ]),
    'Collection Gateway must expose exactly White Pulse, Black Rift, and Identity Fusion in that order.',
  )

  await expectClientRedirect(page, baseUrl, '/shop', '/collections')
  await expectClientRedirect(page, baseUrl, '/collections/water-ripple', '/collections/white-pulse')
  await expectClientRedirect(page, baseUrl, '/collections/crack', '/collections/black-rift')
  await expectClientRedirect(page, baseUrl, '/collections/common-thread', '/belong')

  await page.goto(`${baseUrl}/honor`, { waitUntil: 'networkidle0' })
  assert(await page.$eval('body', (body) => /rights? review/i.test(body.innerText)), 'HONOR must be clearly marked as rights review.')
  assert(await page.$$eval('a[href^="/products/"]', (links) => links.length === 0), 'HONOR must not expose product purchase routes.')
  assert(
    await page.$$eval('a, button', (controls) => !controls.some((control) => /add to cart|buy now|purchase/i.test(control.textContent ?? ''))),
    'HONOR must not expose a purchase action.',
  )

  await page.goto(`${baseUrl}/belong`, { waitUntil: 'networkidle0' })
  assert(await page.$eval('body', (body) => /coming soon/i.test(body.innerText)), 'BELONG must be clearly marked Coming Soon.')
  assert(await page.$$eval('a[href^="/products/"]', (links) => links.length === 0), 'BELONG must not expose products before launch.')
  assert(await page.$$eval('.product-grid', (grids) => grids.length === 0), 'BELONG must not render a product grid before launch.')

  await page.goto(`${baseUrl}/products/white-pulse-game-jersey`, { waitUntil: 'networkidle0' })
  await page.waitForFunction(() => (
    [...document.querySelectorAll('[data-gallery-thumbnail] img')]
      .every((image) => image.complete && image.naturalWidth > 0)
  ))
  const expectedGalleryLabels = [
    'Show overall front and back view',
    'Show collar detail',
    'Show pattern close-up',
    'Show seam detail',
    'Show on-body view',
  ]
  const initialGallery = await page.$eval('[data-product-gallery]', (gallery) => {
    const thumbnails = [...gallery.querySelectorAll('[data-gallery-thumbnail]')]
    const dots = [...gallery.querySelectorAll('[data-gallery-dot]')]
    const mainImage = gallery.querySelector('[data-gallery-main-image]')
    return {
      roleDescription: gallery.getAttribute('aria-roledescription'),
      labels: thumbnails.map((thumbnail) => thumbnail.getAttribute('aria-label')),
      selected: thumbnails.map((thumbnail) => thumbnail.getAttribute('aria-selected')),
      thumbnailSources: thumbnails.map((thumbnail) => thumbnail.querySelector('img')?.currentSrc),
      thumbnailsLoaded: thumbnails.every((thumbnail) => {
        const image = thumbnail.querySelector('img')
        return Boolean(image?.complete && image.naturalWidth > 0)
      }),
      dotCount: dots.length,
      activeDots: dots.filter((dot) => dot.dataset.active === 'true').length,
      mainSource: mainImage?.currentSrc,
      mainAlt: mainImage?.getAttribute('alt'),
      mainLoaded: Boolean(mainImage?.complete && mainImage.naturalWidth > 0),
    }
  })
  assert(initialGallery.roleDescription === 'carousel', 'PDP gallery must expose carousel semantics.')
  assert(
    JSON.stringify(initialGallery.labels) === JSON.stringify(expectedGalleryLabels),
    'PDP thumbnails must expose the required five views in order.',
  )
  assert(
    new Set(initialGallery.thumbnailSources).size === 5 && initialGallery.thumbnailsLoaded,
    'All five unique PDP thumbnails must load.',
  )
  assert(
    JSON.stringify(initialGallery.selected) === JSON.stringify(['true', 'false', 'false', 'false', 'false']),
    'The overall front and back view must be selected initially.',
  )
  assert(initialGallery.dotCount === 5 && initialGallery.activeDots === 1, 'PDP gallery must expose five dots and one active dot.')
  assert(
    /front and back/i.test(initialGallery.mainAlt ?? '') && initialGallery.mainLoaded,
    'The initial PDP hero must be the loaded front and back view.',
  )

  await page.click('.product-gallery__arrow--previous')
  await page.waitForFunction(() => {
    const thumbnails = document.querySelectorAll('[data-gallery-thumbnail]')
    const dots = document.querySelectorAll('[data-gallery-dot]')
    const main = document.querySelector('[data-gallery-main-image]')
    return thumbnails[4]?.getAttribute('aria-selected') === 'true'
      && dots[4]?.dataset.active === 'true'
      && /model/i.test(main?.getAttribute('alt') ?? '')
  })
  await page.click('.product-gallery__arrow--next')
  await page.waitForFunction(() => {
    const thumbnails = document.querySelectorAll('[data-gallery-thumbnail]')
    const dots = document.querySelectorAll('[data-gallery-dot]')
    return thumbnails[0]?.getAttribute('aria-selected') === 'true' && dots[0]?.dataset.active === 'true'
  })

  await page.click('[data-gallery-thumbnail]:nth-child(3)')
  await page.waitForFunction(() => {
    const thumbnails = document.querySelectorAll('[data-gallery-thumbnail]')
    const main = document.querySelector('[data-gallery-main-image]')
    return thumbnails[2]?.getAttribute('aria-selected') === 'true' && /pattern/i.test(main?.getAttribute('alt') ?? '')
  })
  await page.focus('[data-gallery-thumbnail]:nth-child(3)')
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => {
    const thumbnails = document.querySelectorAll('[data-gallery-thumbnail]')
    return document.activeElement === thumbnails[3] && thumbnails[3]?.getAttribute('aria-selected') === 'true'
  })
  await page.keyboard.press('End')
  await page.waitForFunction(() => {
    const thumbnails = document.querySelectorAll('[data-gallery-thumbnail]')
    return document.activeElement === thumbnails[4] && thumbnails[4]?.getAttribute('aria-selected') === 'true'
  })
  await page.keyboard.press('Home')
  await page.waitForFunction(() => {
    const thumbnails = document.querySelectorAll('[data-gallery-thumbnail]')
    return document.activeElement === thumbnails[0] && thumbnails[0]?.getAttribute('aria-selected') === 'true'
  })
  await page.focus('[data-gallery-thumbnail]:nth-child(2)')
  await page.keyboard.press('Enter')
  await page.waitForFunction(() => (
    document.querySelectorAll('[data-gallery-thumbnail]')[1]?.getAttribute('aria-selected') === 'true'
      && /collar detail, image 2 of 5/i.test(document.querySelector('[data-product-gallery] [role="status"]')?.textContent ?? '')
  ))

  assert(await page.$eval('body', (body) => body.innerText.includes('PRICE TBD')), 'PDP must disclose PRICE TBD.')
  await assertNoUnverifiedAmount(page, 'PDP')

  await page.goto(`${baseUrl}/products/black-rift-game-jersey`, { waitUntil: 'networkidle0' })
  assert(await page.$$eval('[data-product-gallery]', (galleries) => galleries.length === 0), 'Non-target PDPs must not opt into the White Pulse carousel.')
  assert(await page.$$eval('.product-gallery__main', (images) => images.length === 1), 'Non-target PDPs must retain their primary product visual.')
  assert(await page.$$eval('.product-gallery__detail', (images) => images.length === 1), 'Non-target PDPs must retain their secondary detail visual.')

  await page.goto(`${baseUrl}/products/white-pulse-game-jersey`, { waitUntil: 'networkidle0' })
  await page.type('#product-city-search', 'Chicago')
  await page.click('.city-discovery button[type="submit"]')
  await page.waitForFunction(() => window.location.search.includes('city=chicago'))
  await page.waitForFunction(() => document.querySelector('h1')?.textContent?.toLowerCase().includes('chicago'))
  assert(new URL(page.url()).searchParams.get('city') === 'chicago', 'City search must persist the city slug in the URL.')
  assert(await page.$eval('h1', (heading) => heading.textContent?.toLowerCase().includes('chicago')), 'City result heading must identify Chicago.')

  await page.goto(`${baseUrl}/search?city=portland`, { waitUntil: 'networkidle0' })
  assert(await page.$eval('h1', (heading) => heading.textContent?.includes('No city edit yet')), 'Unknown cities need an explicit zero-result state.')

  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    localStorage.setItem('we-cart-v3', JSON.stringify([{
      id: 'white-pulse-game-jersey-M',
      name: 'White Pulse Game Jersey',
      detail: 'WE White / Pulse Blue · Size M',
      price: { status: 'tbd' },
      image: '/images/product-water.webp',
      quantity: 1,
    }]))
  })
  await page.goto(`${baseUrl}/cart`, { waitUntil: 'networkidle0' })
  assert(await page.$eval('body', (body) => body.innerText.includes('PRICE TBD')), 'Cart must preserve the TBD price state.')
  await assertNoUnverifiedAmount(page, 'Cart')

  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  await page.evaluate(() => localStorage.setItem('we-admin-language', 'en'))
  await page.goto(`${baseUrl}/admin/customizer`, { waitUntil: 'networkidle0' })
  assert(await page.$$eval('.customizer-upload-card', (cards) => cards.length === 4), 'Customizer admin must expose exactly four preview-image slots.')
  assert(await page.$$eval('.customizer-upload-card input[type="file"]', (inputs) => inputs.length === 4), 'Customizer admin must expose exactly four file inputs.')
  assert(
    await page.$$eval('.customizer-upload-card__preview img', (images) => images.length === 4 && images.every((image) => image.complete && image.naturalWidth > 0)),
    'Customizer admin must load all four published preview images.',
  )
  assert(await page.$eval('.customizer-admin__notice', (notice) => /one garment only/i.test(notice.textContent ?? '')), 'Customizer admin must state the one-garment image rule.')
  const adminFrontInput = await page.$('input[name="front-preview-image"]')
  if (!adminFrontInput) throw new Error('Customizer admin front-image input is missing.')
  await adminFrontInput.uploadFile(path.join(process.cwd(), 'public', 'images', 'white-pulse-game-jersey-02-collar-detail.webp'))
  await page.waitForFunction(() => (
    document.querySelector('[data-admin-view="front"] .customizer-upload-card__preview img')?.getAttribute('src')?.startsWith('blob:')
      && /Ready:/.test(document.querySelector('[data-admin-view="front"] > p')?.textContent ?? '')
  ))

  await page.goto(`${baseUrl}/custom?style=white-pulse-game-jersey&size=M`, { waitUntil: 'networkidle0' })
  const personalizationPreview = await page.$eval('.studio-preview__canvas', (canvas) => ({
    cleanBase: canvas.querySelector('[data-custom-base="true"]')?.getAttribute('data-custom-base-src'),
    source: canvas.querySelector('[data-custom-base="true"]')?.getAttribute('data-preview-source'),
    objectFit: getComputedStyle(canvas.querySelector('[data-custom-base="true"]')).objectFit,
    transform: getComputedStyle(canvas.querySelector('[data-custom-base="true"]')).transform,
    legacyOverlayCount: canvas.querySelectorAll('.studio-preview__mark').length,
    frontCity: canvas.querySelector('[data-personalization-region="front-city"]')?.textContent,
    frontNumber: canvas.querySelector('[data-personalization-region="front-number"] .studio-number__ink')?.textContent,
  }))
  assert(
    personalizationPreview.cleanBase?.startsWith(`${managedPreviewPaths.front}?v=`),
    'Customizer must load the backend-managed front image.',
  )
  assert(personalizationPreview.source === 'backend', 'Customizer must identify the backend-managed base image.')
  assert(personalizationPreview.objectFit === 'contain' && personalizationPreview.transform === 'none', 'Preview images must remain contained and untransformed.')
  assert(personalizationPreview.legacyOverlayCount === 0, 'Legacy WE / 01 overlay must be removed.')
  assert(personalizationPreview.frontCity === 'SACRAMENTO', 'Front city personalization must render in its mapped region.')
  assert(personalizationPreview.frontNumber === '17', 'Detected front number region must inherit the initial number.')
  for (const [studioView, expectedPath] of Object.entries(managedPreviewPaths)) {
    await page.click(`[data-studio-view="${studioView}"]`)
    await page.waitForFunction((path) => (
      document.querySelector('[data-custom-base="true"]')?.getAttribute('data-custom-base-src')?.startsWith(`${path}?v=`)
    ), {}, expectedPath)
    const renderedBase = await page.$eval('[data-custom-base="true"]', (image) => ({
      objectFit: getComputedStyle(image).objectFit,
      transform: getComputedStyle(image).transform,
    }))
    assert(renderedBase.objectFit === 'contain' && renderedBase.transform === 'none', `${studioView} preview must not be cropped, flipped, or stretched.`)
  }
  serveManagedPreviewImages = false
  await page.reload({ waitUntil: 'networkidle0' })
  await page.waitForFunction(() => document.querySelector('[data-preview-source="catalog-crop"]'))
  const fallbackPreview = await page.$eval('[data-preview-source="catalog-crop"]', (base) => ({
    tagName: base.tagName.toLowerCase(),
    viewBox: base.getAttribute('viewBox'),
    clipRect: base.querySelector('clipPath rect')?.getAttribute('width'),
    clippedImage: base.querySelector('image')?.getAttribute('clip-path'),
  }))
  assert(
    fallbackPreview.tagName === 'svg'
      && fallbackPreview.viewBox === '0 145 600 920'
      && fallbackPreview.clipRect === '600'
      && fallbackPreview.clippedImage?.startsWith('url(#studio-base-crop-'),
    'Catalog fallback must crop and clip the combined source to one front garment.',
  )
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('.studio-nav button')]
      .find((item) => item.textContent?.includes('PERSONALIZE'))
    if (!(button instanceof HTMLButtonElement)) throw new Error('PERSONALIZE button is missing.')
    button.click()
  })
  assert(
    await page.$eval('input[name="custom-logo"]', (input) => input.getAttribute('accept')) === 'image/png,image/jpeg,image/webp',
    'Customizer must expose a local raster logo replacement input.',
  )
  assert(await page.$('input[name="city-name"]'), 'Customizer must expose a front city name input.')
  assert(await page.$('input[name="left-sleeve-logo"]'), 'Customizer must expose an independent left sleeve logo input.')
  assert(await page.$('input[name="right-sleeve-logo"]'), 'Customizer must expose an independent right sleeve logo input.')
  const logoInput = await page.$('input[name="custom-logo"]')
  if (!logoInput) throw new Error('Customizer logo input is missing.')
  await logoInput.uploadFile(path.join(process.cwd(), 'public', 'images', 'we-wordmark.png'))
  await page.waitForFunction(() => (
    document.querySelector('[data-personalization-region="front-logo"] img')?.getAttribute('src')?.startsWith('data:image/png')
  ))
  await page.click('input[name="city-name"]')
  await page.keyboard.down('Control')
  await page.keyboard.press('KeyA')
  await page.keyboard.up('Control')
  await page.keyboard.type('OAKLAND')
  await page.waitForFunction(() => (
    document.querySelector('[data-personalization-region="front-city"]')?.textContent === 'OAKLAND'
  ))
  const cityArtwork = await page.$('[data-personalization-region="front-city"]')
  if (!cityArtwork) throw new Error('Movable city artwork is missing.')
  await cityArtwork.evaluate((element) => {
    document.documentElement.style.scrollBehavior = 'auto'
    element.scrollIntoView({ block: 'center', inline: 'center' })
  })
  const cityArtworkBox = await cityArtwork.boundingBox()
  if (!cityArtworkBox) throw new Error('Movable city artwork is outside the viewport.')
  const cityPositionBeforeDrag = await cityArtwork.evaluate((element) => element.getAttribute('data-position-x'))
  await page.mouse.move(cityArtworkBox.x + cityArtworkBox.width / 2, cityArtworkBox.y + cityArtworkBox.height / 2)
  await page.mouse.down()
  await page.mouse.move(cityArtworkBox.x + cityArtworkBox.width / 2 + 32, cityArtworkBox.y + cityArtworkBox.height / 2 + 12, { steps: 4 })
  await page.mouse.up()
  await page.waitForFunction((previousPosition) => (
    document.querySelector('[data-personalization-region="front-city"]')?.getAttribute('data-position-x') !== previousPosition
  ), {}, cityPositionBeforeDrag)
  const leftSleeveLogoInput = await page.$('input[name="left-sleeve-logo"]')
  if (!leftSleeveLogoInput) throw new Error('Left sleeve logo input is missing.')
  await leftSleeveLogoInput.uploadFile(path.join(process.cwd(), 'public', 'images', 'we-wordmark.png'))
  await page.waitForFunction(() => (
    document.querySelector('[data-studio-view="left"]')?.getAttribute('aria-pressed') === 'true'
      && document.querySelector('[data-personalization-region="left-sleeve-logo"] img')?.getAttribute('src')?.startsWith('data:image/png')
  ))
  const rightSleeveLogoInput = await page.$('input[name="right-sleeve-logo"]')
  if (!rightSleeveLogoInput) throw new Error('Right sleeve logo input is missing.')
  await rightSleeveLogoInput.uploadFile(path.join(process.cwd(), 'public', 'images', 'we-wordmark.png'))
  await page.waitForFunction(() => (
    document.querySelector('[data-studio-view="right"]')?.getAttribute('aria-pressed') === 'true'
      && document.querySelector('[data-personalization-region="right-sleeve-logo"] img')?.getAttribute('src')?.startsWith('data:image/png')
  ))
  await page.click('[data-studio-view="front"]')
  await page.click('input[name="jersey-number"]')
  await page.keyboard.down('Control')
  await page.keyboard.press('KeyA')
  await page.keyboard.up('Control')
  await page.keyboard.type('8')
  await page.waitForFunction(() => (
    document.querySelector('[data-personalization-region="front-number"] .studio-number__ink')?.textContent === '8'
  ))
  await page.click('[data-studio-view="back"]')
  await page.waitForFunction(() => (
    document.querySelector('[data-personalization-region="back-number"] .studio-number__ink')?.textContent === '8'
      && document.querySelector('[data-personalization-region="back-name"]')?.textContent === 'MORGAN'
  ))
  const notice = await page.$eval('.create-disclaimer p:last-child', (paragraph) => paragraph.textContent?.trim())
  assert(notice === defaultSiteConfig.customizer.disclaimer, 'CREATE notice must match the published site configuration.')
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`)
  console.log('E2E site passed: CREATE navigation, approved series, compatibility redirects, HONOR/BELONG gates, five-view PDP gallery, PRICE TBD, city discovery, four-slot preview admin, backend-managed untransformed view images, movable city/name/number/logo artwork, independent sleeve uploads, source-artwork replacement, exact CREATE notice, and browser health.')
} finally {
  await browser.close()
  await server.close()
}
