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

const server = await createServer({ logLevel: 'error', server: { host: '127.0.0.1', port: 4173, strictPort: false } })
await server.listen()
const address = server.httpServer?.address()
if (!address || typeof address === 'string') throw new Error('Logo browser server did not expose a port.')
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
  ],
})

try {
  const page = await browser.newPage()
  const errors = []
  let adminAuthenticated = false
  page.on('console', (message) => {
    const text = message.text()
    if (message.type() === 'error' && !text.includes('401 (Unauthorized)')) errors.push(text)
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.setRequestInterception(true)
  page.on('request', async (request) => {
    const url = new URL(request.url())
    if (url.pathname === '/api/site-config') {
      if (url.searchParams.get('admin') === '1' && !adminAuthenticated) {
        await request.respond({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ authenticated: false, adminConfigured: true, storageConfigured: true }),
        })
      } else {
        await request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            config: defaultSiteConfig,
            authenticated: adminAuthenticated || undefined,
            adminConfigured: true,
            storageConfigured: true,
          }),
        })
      }
      return
    }
    if (url.pathname === '/api/admin-media') {
      await request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ media: [] }) })
      return
    }
    if (url.pathname === '/api/customizer-images') {
      await request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ images: {}, complete: false }) })
      return
    }
    await request.continue()
  })

  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.site-header .brand-mark img')
  const desktopMarks = await page.$$eval(
    '.site-header .brand-mark img, .brand-mark--footer img, .process-card__logo img, .process-card__index img',
    (images) => images.map((image) => ({
      src: image.getAttribute('src'),
      loaded: image.complete && image.naturalWidth > 0,
      width: image.getBoundingClientRect().width,
      height: image.getBoundingClientRect().height,
    })),
  )
  assert(desktopMarks.length === 4, 'Desktop homepage must expose four interface logo placements.')
  assert(desktopMarks.every((mark) => mark.src === '/images/we-logo.svg'), 'Every desktop interface mark must use the official PDF SVG.')
  assert(desktopMarks.every((mark) => mark.loaded && mark.width > 0 && mark.height > 0), 'Every desktop interface mark must load without clipping to zero size.')
  assert(await page.$eval('link[rel="icon"]', (link) => link.getAttribute('href') === '/images/we-logo.svg'), 'The favicon must use the official PDF SVG.')
  await page.screenshot({ path: '/tmp/we-logo-home.png', type: 'png', fullPage: false })
  const process = await page.$('.custom-story')
  await process?.screenshot({ path: '/tmp/we-logo-process.png', type: 'png' })

  await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.admin-login__brand img')
  assert(await page.$eval('.admin-login__brand img', (image) => image.getAttribute('src') === '/images/we-logo.svg' && image.naturalWidth > 0), 'Admin login must use the official PDF SVG.')
  await page.screenshot({ path: '/tmp/we-logo-admin-login.png', type: 'png', fullPage: false })

  adminAuthenticated = true
  await page.reload({ waitUntil: 'networkidle0' })
  await page.waitForSelector('.admin-sidebar__brand img')
  assert(await page.$eval('.admin-sidebar__brand img', (image) => image.getAttribute('src') === '/images/we-logo.svg' && image.naturalWidth > 0), 'Admin sidebar must use the official PDF SVG.')

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  await page.click('.menu-trigger')
  await page.waitForSelector('.mobile-menu__top img')
  assert(await page.$eval('.mobile-menu__top img', (image) => image.getAttribute('src') === '/images/we-logo.svg' && image.naturalWidth > 0), 'Mobile navigation must use the official PDF SVG.')
  await page.screenshot({ path: '/tmp/we-logo-mobile-menu.png', type: 'png', fullPage: false })

  assert(errors.length === 0, `Logo browser check reported errors: ${errors.join(' | ')}`)
  console.log('Logo browser smoke passed: favicon, desktop header, mobile menu, footer, process animation, admin login, and admin sidebar.')
  console.log('/tmp/we-logo-home.png')
  console.log('/tmp/we-logo-process.png')
  console.log('/tmp/we-logo-admin-login.png')
  console.log('/tmp/we-logo-mobile-menu.png')
} finally {
  await browser.close()
  await server.close()
}
