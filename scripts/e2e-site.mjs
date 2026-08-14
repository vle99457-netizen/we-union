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

  await page.goto(`${baseUrl}/custom?style=white-pulse-game-jersey&size=M`, { waitUntil: 'networkidle0' })
  const personalizationPreview = await page.$eval('.studio-preview__canvas', (canvas) => ({
    cleanBase: canvas.querySelector('[data-custom-base="true"]')?.getAttribute('src'),
    legacyOverlayCount: canvas.querySelectorAll('.studio-preview__mark').length,
    frontNumber: canvas.querySelector('[data-personalization-region="front-number"] .studio-number__ink')?.textContent,
  }))
  assert(
    personalizationPreview.cleanBase === '/images/white-pulse-game-jersey-custom-base.webp',
    'Customizer must start from the clean product base instead of covering the source number.',
  )
  assert(personalizationPreview.legacyOverlayCount === 0, 'Legacy WE / 01 overlay must be removed.')
  assert(personalizationPreview.frontNumber === '17', 'Detected front number region must inherit the initial number.')
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
  const logoInput = await page.$('input[name="custom-logo"]')
  if (!logoInput) throw new Error('Customizer logo input is missing.')
  await logoInput.uploadFile(path.join(process.cwd(), 'public', 'images', 'we-wordmark.png'))
  await page.waitForFunction(() => (
    document.querySelector('[data-personalization-region="front-logo"] img')?.getAttribute('src')?.startsWith('data:image/png')
  ))
  await page.click('input[name="jersey-number"]')
  await page.keyboard.down('Control')
  await page.keyboard.press('KeyA')
  await page.keyboard.up('Control')
  await page.keyboard.type('8')
  await page.waitForFunction(() => (
    document.querySelector('[data-personalization-region="front-number"] .studio-number__ink')?.textContent === '8'
  ))
  await page.click('.view-switcher button:nth-child(2)')
  await page.waitForFunction(() => (
    document.querySelector('[data-personalization-region="back-number"] .studio-number__ink')?.textContent === '8'
      && document.querySelector('[data-personalization-region="back-name"]')?.textContent === 'MORGAN'
  ))
  const notice = await page.$eval('.create-disclaimer p:last-child', (paragraph) => paragraph.textContent?.trim())
  assert(notice === 'WE UNION CREATE products are built on original garment designs and customer-led personalization. WE UNION does not reproduce or accept official league, team, athlete, or third-party brand names, logos, wordmarks, signatures, or confusingly similar variations. Customer-submitted artwork must be original or properly authorized and is subject to intellectual property review.', 'CREATE notice must be an exact DOM match.')
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`)
  console.log('E2E site passed: CREATE navigation, approved series, compatibility redirects, HONOR/BELONG gates, five-view PDP gallery, PRICE TBD, city discovery, source-artwork replacement, exact CREATE notice, and browser health.')
} finally {
  await browser.close()
  await server.close()
}
