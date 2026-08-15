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
if (!address || typeof address === 'string') throw new Error('Admin browser server did not expose a port.')
const baseUrl = `http://127.0.0.1:${address.port}`
const { defaultSiteConfig } = await server.ssrLoadModule('/src/data/siteConfig.ts')
const unicodeUploadPath = path.join(tmpdir(), '商品主图.webp')
await fs.copyFile(path.resolve('public/images/water-ripple.webp'), unicodeUploadPath)

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
  const consoleErrors = []
  const pageErrors = []
  let mediaUploadFilenameHeader = ''
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.setRequestInterception(true)
  page.on('request', async (request) => {
    const url = new URL(request.url())
    if (url.pathname === '/api/site-config') {
      await request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ config: defaultSiteConfig, authenticated: true, adminConfigured: true, storageConfigured: true }),
      })
      return
    }
    if (url.pathname === '/api/admin-media') {
      if (request.method() === 'POST') {
        mediaUploadFilenameHeader = request.headers()['x-file-name'] ?? ''
        await request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ image: { pathname: 'cms/media/smoke.webp', url: '/images/water-ripple.webp', size: 1024, uploadedAt: new Date().toISOString() } }),
        })
      } else {
        await request.respond({ status: 200, contentType: 'application/json', body: JSON.stringify({ media: [] }) })
      }
      return
    }
    if (url.pathname === '/api/customizer-images') {
      await request.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ productSlug: url.searchParams.get('product'), storageConfigured: true, storageAvailable: true, adminConfigured: true, complete: false, images: {} }),
      })
      return
    }
    await request.continue()
  })

  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.goto(baseUrl, { waitUntil: 'networkidle0' })
  await page.evaluate(() => localStorage.setItem('we-admin-language', 'zh'))
  await page.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('.admin-app')
  assert(await page.$$eval('.admin-sidebar nav button', (buttons) => buttons.length === 9), 'Admin navigation must expose nine modules.')
  assert(await page.$eval('.admin-topbar h1', (heading) => heading.textContent === '概览'), 'Admin must start in Chinese.')
  assert(await page.$$eval('.site-header, .site-footer', (elements) => elements.length === 0), 'Public chrome must not wrap the admin.')
  await page.screenshot({ path: '/tmp/we-admin-desktop.png', type: 'png', fullPage: true })

  await page.click('.admin-language button:last-child')
  await page.waitForFunction(() => document.querySelector('.admin-topbar h1')?.textContent === 'Dashboard')
  await page.click('.admin-sidebar nav button:nth-child(3)')
  await page.waitForFunction(() => document.querySelector('.admin-topbar h1')?.textContent === 'Homepage')
  assert(await page.$$eval('.admin-editor-group', (groups) => groups.length === 8), 'Homepage editor must expose all eight sections.')
  assert(await page.$$eval('.admin-image-field', (fields) => fields.length >= 5), 'Homepage image settings must expose direct local-image controls.')
  assert(await page.$$eval('.admin-image-field__preview img', (images) => images.length >= 5), 'Homepage image settings must show previews.')

  const homepageUpload = await page.$('.admin-image-field input[type="file"]')
  if (!homepageUpload) throw new Error('Homepage image upload input was not found.')
  await homepageUpload.uploadFile(unicodeUploadPath)
  await page.waitForFunction(() => document.querySelector('.admin-image-field__message.is-success')?.textContent?.includes('Image uploaded'))
  assert(mediaUploadFilenameHeader === encodeURIComponent(path.basename(unicodeUploadPath)), 'Unicode upload filenames must be percent-encoded in request headers.')
  assert(await page.$eval('.admin-publish-bar', (bar) => bar.dataset.dirty === 'true'), 'A completed image upload must mark the configuration as unpublished.')
  await page.screenshot({ path: '/tmp/we-admin-homepage-en.png', type: 'png', fullPage: true })

  await page.click('.admin-sidebar nav button:nth-child(4)')
  await page.waitForFunction(() => document.querySelector('.admin-topbar h1')?.textContent === 'Catalog')
  assert(await page.$$eval('.admin-product-gallery', (galleries) => galleries.length === 1), 'Product editing must expose the gallery manager.')
  assert(await page.$$eval('.admin-product-gallery__grid .admin-image-field__preview img', (images) => images.length >= 1), 'Product gallery images must show previews.')

  await page.click('[data-catalog-add="products"]')
  await page.waitForSelector('[data-catalog-create-form="products"]')
  const productCreateInputs = await page.$$('[data-catalog-create-form="products"] input')
  assert(productCreateInputs.length === 2, 'Product creation must request a name and URL slug.')
  await productCreateInputs[0].type('Smoke Product')
  assert(await productCreateInputs[1].evaluate((input) => input.value === 'smoke-product'), 'Product slug must be generated from its name.')
  await page.click('[data-catalog-create-form="products"] [data-catalog-create-submit]')
  await page.waitForFunction(() => (
    [...document.querySelectorAll('.admin-catalog-picker select option')]
      .some((option) => option.textContent === 'Smoke Product')
  ))
  assert(await page.$eval('.admin-catalog-picker code', (code) => code.textContent === 'smoke-product'), 'The new product must open in the full editor.')
  assert(await page.$$eval('.admin-product-gallery', (galleries) => galleries.length === 1), 'A newly created product must expose gallery editing.')

  await page.click('.admin-tab-row button:nth-child(2)')
  await page.click('[data-catalog-add="series"]')
  await page.waitForSelector('[data-catalog-create-form="series"]')
  const seriesCreateInputs = await page.$$('[data-catalog-create-form="series"] input')
  assert(seriesCreateInputs.length === 2, 'Series creation must request a name and URL slug.')
  await seriesCreateInputs[0].type('Smoke Series')
  assert(await seriesCreateInputs[1].evaluate((input) => input.value === 'smoke-series'), 'Series slug must be generated from its name.')
  await page.screenshot({ path: '/tmp/we-admin-catalog-create-form.png', type: 'png', fullPage: true })
  await page.click('[data-catalog-create-form="series"] [data-catalog-create-submit]')
  await page.waitForFunction(() => (
    [...document.querySelectorAll('.admin-catalog-picker select option')]
      .some((option) => option.textContent === 'Smoke Series')
  ))
  assert(await page.$eval('.admin-catalog-picker code', (code) => code.textContent === 'smoke-series'), 'The new series must open in the full editor.')
  assert(await page.$eval('.admin-publish-bar', (bar) => bar.dataset.dirty === 'true'), 'Creating catalog records must mark the configuration as unpublished.')
  await page.screenshot({ path: '/tmp/we-admin-catalog-create.png', type: 'png', fullPage: true })

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  await page.waitForFunction(() => window.innerWidth === 390)
  await page.waitForSelector('.admin-app')
  assert(await page.$eval('.admin-sidebar', (sidebar) => getComputedStyle(sidebar).position === 'fixed'), 'Mobile admin navigation must remain fixed.')
  assert(await page.$eval('body', (body) => body.scrollWidth <= window.innerWidth), 'Mobile admin must not overflow horizontally.')
  await page.screenshot({ path: '/tmp/we-admin-mobile.png', type: 'png', fullPage: true })

  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join('; ')}`)
  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join('; ')}`)
  console.log('Admin browser smoke passed: bilingual editing, catalog creation, local image uploads with previews, product gallery management, mobile layout, and browser health.')
  console.log('/tmp/we-admin-desktop.png')
  console.log('/tmp/we-admin-homepage-en.png')
  console.log('/tmp/we-admin-catalog-create-form.png')
  console.log('/tmp/we-admin-catalog-create.png')
  console.log('/tmp/we-admin-mobile.png')
} finally {
  await browser.close()
  await server.close()
  await fs.rm(unicodeUploadPath, { force: true })
}
