import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import { createBrotliDecompress } from 'node:zlib'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { createServer } from 'vite'

const root = process.cwd()
const outputRoot = path.join(root, 'docs', 'previews', 'v3')
const executablePath = process.env.PREVIEW_CHROMIUM ?? await resolveChromiumExecutable()
let previewServer
let baseUrl = process.env.PREVIEW_BASE_URL

if (!baseUrl) {
  previewServer = await createServer({
    root,
    logLevel: 'error',
    server: { host: '127.0.0.1', port: 4173, strictPort: false },
  })
  await previewServer.listen()
  const address = previewServer.httpServer?.address()
  if (!address || typeof address === 'string') throw new Error('Preview server did not expose a TCP port.')
  baseUrl = `http://127.0.0.1:${address.port}`
}

async function resolveChromiumExecutable() {
  const browserDirectory = path.join(tmpdir(), 'we-preview-chromium')
  const browserPath = path.join(browserDirectory, 'chromium')
  if (existsSync(browserPath) && (await fs.stat(browserPath)).size > 0) return browserPath

  const packageEntryUrl = import.meta.resolve('@sparticuz/chromium')
  const packageRoot = path.dirname(path.dirname(fileURLToPath(packageEntryUrl)))
  const compressedBrowser = path.join(packageRoot, 'bin', 'chromium.br')
  const partialPath = `${browserPath}.partial`
  await fs.mkdir(browserDirectory, { recursive: true })
  await pipeline(
    createReadStream(compressedBrowser),
    createBrotliDecompress(),
    createWriteStream(partialPath, { mode: 0o700 }),
  )
  await fs.rename(partialPath, browserPath)
  await fs.chmod(browserPath, 0o700)
  return browserPath
}

const desktopPages = [
  ['01-homepage', '/', 'V01 Homepage'],
  ['02-collection-gateway', '/collections', 'V02A Collection Gateway'],
  ['03-series-list', '/collections/water-ripple', 'V02B Series Product List'],
  ['04-world-create', '/create', 'V03 World Landing / Create'],
  ['05-product-detail', '/products/water-ripple-game-jersey', 'V04 Product Detail'],
  ['06-create-studio', '/custom?style=crack-game-jersey&size=M', 'V05 Create Studio'],
  ['07-cart', '/cart', 'V06 Cart', 'cart'],
  ['08-checkout', '/checkout', 'V07 Checkout', 'cart'],
  ['09-account', '/account', 'V08 Account'],
  ['10-order-track', '/track', 'V09 Order Tracking'],
  ['11-stories', '/stories', 'V10 Stories'],
  ['12-story-detail', '/stories/the-number-24', 'V11 Story Detail'],
  ['13-craftsmanship', '/craftsmanship', 'V12 Craftsmanship'],
  ['14-community', '/community', 'V13 Community'],
  ['15-about', '/about', 'V14 About'],
  ['16-support', '/support', 'V15 Support'],
  ['17-team-orders', '/custom/team', 'V16 Team Orders'],
  ['18-search', '/search?q=ripple', 'V17 Search'],
  ['19-policy', '/legal/privacy', 'V18 Policy'],
  ['20-not-found', '/not-a-real-route', 'V19 Not Found'],
  ['21-world-honor', '/honor', 'World Landing / Honor'],
  ['22-world-belong', '/belong', 'World Landing / Belong'],
  ['23-crack-series-list', '/collections/crack', 'Crack Series Product List'],
  ['24-city-results', '/search?city=chicago', 'City Discovery Results'],
  ['25-saved-design', '/custom/saved/demo', 'Saved Design State', 'design'],
  ['26-faq', '/faq', 'FAQ Route'],
]

const mobilePages = [
  ['01-homepage-mobile', '/', 'V01 Homepage / Mobile'],
  ['02-collection-gateway-mobile', '/collections', 'V02A Collection Gateway / Mobile'],
  ['05-product-detail-mobile', '/products/water-ripple-game-jersey', 'V04 Product Detail / Mobile'],
  ['06-create-studio-mobile', '/custom?style=crack-game-jersey&size=M', 'V05 Create Studio / Mobile'],
  ['08-checkout-mobile', '/checkout', 'V07 Checkout / Mobile', 'cart'],
]

const cart = [
  {
    id: 'crack-game-jersey-M',
    name: 'Crack Game Jersey',
    detail: 'Obsidian / Electric Blue · Size M',
    price: 119,
    image: '/images/product-crack.webp',
    quantity: 1,
  },
]

const savedDesign = {
  productSlug: 'crack-game-jersey',
  template: 'Crack Series',
  name: 'MORGAN',
  number: '17',
  colorName: 'Cobalt',
  size: 'M',
  view: 'back',
}

await fs.mkdir(path.join(outputRoot, 'desktop'), { recursive: true })
await fs.mkdir(path.join(outputRoot, 'mobile'), { recursive: true })

const browser = await puppeteer.launch({
  executablePath,
  headless: 'shell',
  args: [
    ...chromium.args.filter((arg) => !["--headless='shell'", '--in-process-gpu', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'].includes(arg)),
    '--headless',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
  ],
})

const report = []

async function prepareRoute(page, route, state) {
  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  await page.evaluate(() => localStorage.clear())
  if (state === 'cart') {
    await page.evaluate((value) => localStorage.setItem('we-cart', JSON.stringify(value)), cart)
  }
  if (state === 'design') {
    await page.evaluate((value) => localStorage.setItem('we-saved-design', JSON.stringify(value)), savedDesign)
  }

  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' })
  if (!response || response.status() >= 400) throw new Error(`${route} returned ${response?.status() ?? 'no response'}`)
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(async () => {
    const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
    const max = document.documentElement.scrollHeight
    for (let y = 0; y < max; y += Math.max(520, window.innerHeight * 0.72)) {
      window.scrollTo(0, y)
      await sleep(35)
    }
    window.scrollTo(0, max)
    await sleep(90)
    await Promise.all(
      [...document.images].map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true })
        image.addEventListener('error', resolve, { once: true })
      })),
    )
    window.scrollTo(0, 0)
  })

  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}

async function capture([fileName, route, label, state], viewport, folder) {
  const page = (await browser.pages())[0]
  const consoleErrors = []
  const pageErrors = []

  page.removeAllListeners('console')
  page.removeAllListeners('pageerror')
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.setViewport(viewport)
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  await page.evaluateOnNewDocument(() => {
    window.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style')
      style.textContent = `
        html { scroll-behavior: auto !important; }
        *, *::before, *::after {
          animation-delay: 0s !important;
          animation-duration: 0.001ms !important;
          transition-delay: 0s !important;
          transition-duration: 0.001ms !important;
          caret-color: transparent !important;
        }
      `
      document.head.appendChild(style)
    })
  })

  await prepareRoute(page, route, state)
  const health = await page.evaluate(() => ({
    title: document.title,
    h1Count: document.querySelectorAll('h1').length,
    hasMain: Boolean(document.querySelector('#main-content')),
    hasContent: document.body.innerText.trim().length > 120,
    hasErrorOverlay: Boolean(document.querySelector('.vite-error-overlay, #webpack-dev-server-client-overlay')),
    bodyHeight: document.documentElement.scrollHeight,
  }))
  const screenshotPath = path.join(outputRoot, folder, `${fileName}.webp`)
  await page.screenshot({ path: screenshotPath, type: 'webp', quality: 80, fullPage: true })

  const passed = health.h1Count === 1 && health.hasMain && health.hasContent && !health.hasErrorOverlay && pageErrors.length === 0
  report.push({ label, route, viewport, file: path.relative(root, screenshotPath), passed, health, consoleErrors, pageErrors })
  process.stdout.write(`${passed ? 'PASS' : 'FAIL'} ${label} ${route} -> ${path.relative(root, screenshotPath)}\n`)
}

try {
  for (const page of desktopPages) await capture(page, { width: 1440, height: 1000, deviceScaleFactor: 1 }, 'desktop')
  for (const page of mobilePages) await capture(page, { width: 390, height: 844, deviceScaleFactor: 1 }, 'mobile')
} finally {
  await browser.close()
  await previewServer?.close()
}

await fs.writeFile(
  path.join(outputRoot, 'verification.json'),
  `${JSON.stringify({ schemaVersion: 1, source: 'Local Vite route render', report }, null, 2)}\n`,
  'utf8',
)

const failures = report.filter((item) => !item.passed)
if (failures.length) {
  process.stderr.write(`${failures.length} preview routes failed browser verification.\n`)
  process.exit(1)
}

process.stdout.write(`Captured ${report.length} verified previews with no page errors.\n`)
