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

  await page.goto(`${baseUrl}/collections`, { waitUntil: 'networkidle0' })
  assert(await page.$$eval('a.collection-row', (rows) => rows.length === 3), 'Collection Gateway must expose one full-width link per series.')
  assert(await page.$$eval('.product-grid', (grids) => grids.length === 0), 'Gateway must not expose a product grid.')

  await page.goto(`${baseUrl}/products/water-ripple-game-jersey`, { waitUntil: 'networkidle0' })
  await page.type('#product-city-search', 'Chicago')
  await page.click('.city-discovery button[type="submit"]')
  await page.waitForFunction(() => window.location.search.includes('city=chicago'))
  await page.waitForFunction(() => document.querySelector('h1')?.textContent?.toLowerCase().includes('chicago'))
  assert(new URL(page.url()).searchParams.get('city') === 'chicago', 'City search must persist the city slug in the URL.')
  assert(await page.$eval('h1', (heading) => heading.textContent?.toLowerCase().includes('chicago')), 'City result heading must identify Chicago.')

  await page.goto(`${baseUrl}/search?city=portland`, { waitUntil: 'networkidle0' })
  assert(await page.$eval('h1', (heading) => heading.textContent?.includes('No city edit yet')), 'Unknown cities need an explicit zero-result state.')

  await page.goto(`${baseUrl}/custom?style=water-ripple-game-jersey&size=M`, { waitUntil: 'networkidle0' })
  const notice = await page.$eval('.create-disclaimer p:last-child', (paragraph) => paragraph.textContent?.trim())
  assert(notice === 'WE UNION CREATE products are built on original garment designs and customer-led personalization. WE UNION does not reproduce or accept official league, team, athlete, or third-party brand names, logos, wordmarks, signatures, or confusingly similar variations. Customer-submitted artwork must be original or properly authorized and is subject to intellectual property review.', 'CREATE notice must be an exact DOM match.')
  assert(errors.length === 0, `Browser errors: ${errors.join('; ')}`)
  console.log('E2E site passed: series gateway, city result/zero state, exact CREATE notice, and browser health.')
} finally {
  await browser.close()
  await server.close()
}
