import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const previewRoot = path.join(root, 'docs', 'previews', 'v3')
const verificationPath = path.join(previewRoot, 'verification.json')

const expectedPreviews = [
  ['desktop/01-homepage.webp', '/', 'V01 Homepage', 'WE — Sports Heritage Meets Personal Identity', 'Gear made personal.'],
  ['desktop/02-collection-gateway.webp', '/collections', 'V02A Collection Gateway', 'Original Series — WE', 'Every series starts with an idea.'],
  ['desktop/03-series-list.webp', '/collections/white-pulse', 'V02B Series Product List', 'White Pulse — WE', 'White Pulse'],
  ['desktop/04-world-create.webp', '/create', 'V03 World Landing / Create', 'Create — WE', 'Create'],
  ['desktop/05-product-detail.webp', '/products/white-pulse-game-jersey', 'V04 Product Detail', 'White Pulse Game Jersey — WE', 'White Pulse Game Jersey'],
  ['desktop/06-create-studio.webp', '/custom?style=black-rift-game-jersey&size=M', 'V05 Create Studio', 'Create Yours — WE', 'Create yours.'],
  ['desktop/07-cart.webp', '/cart', 'V06 Cart', 'Cart — WE', 'Cart'],
  ['desktop/08-checkout.webp', '/checkout', 'V07 Checkout', 'Checkout — WE', 'Order review'],
  ['desktop/09-account.webp', '/account', 'V08 Account', 'Account — WE', 'Designs, orders, and the story so far.'],
  ['desktop/10-order-track.webp', '/track', 'V09 Order Tracking', 'Order Tracking — WE', 'Follow the piece.'],
  ['desktop/11-stories.webp', '/stories', 'V10 Stories', 'Stories — WE', 'The story is part of the object.'],
  ['desktop/12-story-detail.webp', '/stories/from-buyer-to-creator', 'V11 Story Detail', 'From Buyer to Creator — WE', 'From Buyer to Creator'],
  ['desktop/13-craftsmanship.webp', '/craftsmanship', 'V12 Craftsmanship', 'Craftsmanship — WE', 'Evidence in every detail.'],
  ['desktop/14-community.webp', '/community', 'V13 Community', 'Community — WE', 'One original. Countless meanings.'],
  ['desktop/15-about.webp', '/about', 'V14 About', 'About — WE', 'A uniform is never just a uniform.'],
  ['desktop/16-support.webp', '/support', 'V15 Support', 'Support — WE', 'Start with the right path.'],
  ['desktop/17-team-orders.webp', '/custom/team', 'V16 Team Orders', 'Team Orders — WE', 'One system. Every player.'],
  ['desktop/18-search.webp', '/search?q=identity', 'V17 Search', 'Search — WE', 'Results for “identity”'],
  ['desktop/19-policy.webp', '/legal/privacy', 'V18 Policy', 'Policies — WE', 'Privacy framework'],
  ['desktop/20-not-found.webp', '/not-a-real-route', 'V19 Not Found', 'Page Not Found — WE', 'This route isn’t part of the current field.'],
  ['desktop/21-world-honor.webp', '/honor', 'World Landing / Honor', 'Honor — WE', 'Honor'],
  ['desktop/22-world-belong.webp', '/belong', 'World Landing / Belong', 'Belong — WE', 'Belong'],
  ['desktop/23-black-rift-series-list.webp', '/collections/black-rift', 'Black Rift Series Product List', 'Black Rift — WE', 'Black Rift'],
  ['desktop/24-city-results.webp', '/search?city=chicago', 'City Discovery Results', 'Search — WE', 'Chicago originals.'],
  ['desktop/25-saved-design.webp', '/custom/saved/demo', 'Saved Design State', 'Create Yours — WE', 'Create yours.'],
  ['desktop/26-faq.webp', '/faq', 'FAQ Route', 'FAQ — WE', 'Start with the right path.'],
  ['mobile/01-homepage-mobile.webp', '/', 'V01 Homepage / Mobile', 'WE — Sports Heritage Meets Personal Identity', 'Gear made personal.'],
  ['mobile/02-collection-gateway-mobile.webp', '/collections', 'V02A Collection Gateway / Mobile', 'Original Series — WE', 'Every series starts with an idea.'],
  ['mobile/05-product-detail-mobile.webp', '/products/white-pulse-game-jersey', 'V04 Product Detail / Mobile', 'White Pulse Game Jersey — WE', 'White Pulse Game Jersey'],
  ['mobile/06-create-studio-mobile.webp', '/custom?style=black-rift-game-jersey&size=M', 'V05 Create Studio / Mobile', 'Create Yours — WE', 'Create yours.'],
  ['mobile/08-checkout-mobile.webp', '/checkout', 'V07 Checkout / Mobile', 'Checkout — WE', 'Order review'],
]

const errors = []

function check(condition, message) {
  if (!condition) errors.push(message)
}

function normalizeText(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().toLocaleLowerCase('en-US') : ''
}

function expectedViewport(file) {
  return file.startsWith('mobile/')
    ? { width: 390, height: 844, deviceScaleFactor: 1 }
    : { width: 1440, height: 1000, deviceScaleFactor: 1 }
}

async function isValidWebp(file) {
  const absolutePath = path.join(previewRoot, file)
  try {
    const stat = await fs.stat(absolutePath)
    if (!stat.isFile() || stat.size < 4096) return false

    const handle = await fs.open(absolutePath, 'r')
    try {
      const header = Buffer.alloc(12)
      const { bytesRead } = await handle.read(header, 0, header.length, 0)
      return bytesRead === 12
        && header.subarray(0, 4).toString('ascii') === 'RIFF'
        && header.subarray(8, 12).toString('ascii') === 'WEBP'
    } finally {
      await handle.close()
    }
  } catch {
    return false
  }
}

let manifest
try {
  manifest = JSON.parse(await fs.readFile(verificationPath, 'utf8'))
} catch (error) {
  process.stderr.write(`Unable to read ${path.relative(root, verificationPath)}: ${error.message}\n`)
  process.exit(1)
}

check(manifest.schemaVersion === 1, 'verification.json must use schemaVersion 1.')
check(manifest.source === 'Local Vite route render', 'verification.json must identify the local Vite route renderer.')
check(Array.isArray(manifest.report), 'verification.json must contain a report array.')

const report = Array.isArray(manifest.report) ? manifest.report : []
check(report.length === expectedPreviews.length, `Expected ${expectedPreviews.length} preview reports, received ${report.length}.`)

const reportsByFile = new Map()
const reportKeys = new Set()
for (const item of report) {
  const relativeFile = typeof item.file === 'string'
    ? path.relative(path.join(root, 'docs', 'previews', 'v3'), path.resolve(root, item.file)).split(path.sep).join('/')
    : ''

  check(relativeFile && !relativeFile.startsWith('..'), `Invalid preview path: ${String(item.file)}`)
  check(!reportsByFile.has(relativeFile), `Duplicate preview report: ${relativeFile}`)
  const reportKey = `${item.route}\u0000${item.viewport?.width}\u0000${item.viewport?.height}\u0000${item.viewport?.deviceScaleFactor}`
  check(!reportKeys.has(reportKey), `Duplicate route and viewport report: ${String(item.route)}`)
  reportsByFile.set(relativeFile, item)
  reportKeys.add(reportKey)
}

for (const [file, route, label, title, h1Text] of expectedPreviews) {
  const item = reportsByFile.get(file)
  check(Boolean(item), `Missing preview report: ${file}`)
  check(await isValidWebp(file), `Missing, undersized, or invalid WebP: ${file}`)
  if (!item) continue

  const viewport = expectedViewport(file)
  check(item.file === `docs/previews/v3/${file}`, `${file} must use its canonical repository path.`)
  check(item.route === route, `${file} must cover ${route}; received ${String(item.route)}.`)
  check(item.label === label, `${file} label must be "${label}".`)
  check(item.viewport?.width === viewport.width, `${file} width must be ${viewport.width}.`)
  check(item.viewport?.height === viewport.height, `${file} height must be ${viewport.height}.`)
  check(item.viewport?.deviceScaleFactor === viewport.deviceScaleFactor, `${file} deviceScaleFactor must be 1.`)
  check(item.passed === true, `${file} did not pass capture verification.`)
  check(item.health?.h1Count === 1, `${file} must contain exactly one h1.`)
  check(item.health?.hasMain === true, `${file} must contain the main content landmark.`)
  check(item.health?.hasContent === true, `${file} does not contain enough page content.`)
  check(item.health?.hasErrorOverlay === false, `${file} rendered an application error overlay.`)
  check(item.health?.title === title, `${file} title must be "${title}"; received "${String(item.health?.title)}".`)
  check(normalizeText(item.health?.h1Text) === normalizeText(h1Text), `${file} h1 must be "${h1Text}"; received "${String(item.health?.h1Text)}".`)
  check(Number.isFinite(item.health?.bodyHeight) && Number.isInteger(item.health.bodyHeight) && item.health.bodyHeight >= viewport.height, `${file} reported an invalid body height.`)
  check(Array.isArray(item.consoleErrors) && item.consoleErrors.length === 0, `${file} emitted console errors.`)
  check(Array.isArray(item.pageErrors) && item.pageErrors.length === 0, `${file} emitted page errors.`)
}

for (const file of reportsByFile.keys()) {
  check(expectedPreviews.some(([expectedFile]) => expectedFile === file), `Unexpected preview report: ${file}`)
}

for (const folder of ['desktop', 'mobile']) {
  const actualFiles = (await fs.readdir(path.join(previewRoot, folder)))
    .filter((file) => file.endsWith('.webp'))
    .map((file) => `${folder}/${file}`)
    .sort()
  const expectedFiles = expectedPreviews
    .map(([file]) => file)
    .filter((file) => file.startsWith(`${folder}/`))
    .sort()
  check(JSON.stringify(actualFiles) === JSON.stringify(expectedFiles), `${folder} WebP file set does not match the expected preview manifest.`)
}

if (errors.length) {
  process.stderr.write(`Preview package verification failed with ${errors.length} issue(s):\n`)
  for (const error of errors) process.stderr.write(`- ${error}\n`)
  process.exit(1)
}

process.stdout.write(`Verified ${expectedPreviews.length} semantic page reports and WebP files (26 desktop, 5 mobile).\n`)
