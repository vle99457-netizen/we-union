import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

const routes = [
  '/',
  '/create',
  '/honor',
  '/belong',
  '/collections',
  '/collections/white-pulse?sort=featured&filter=personalizable',
  '/collections/black-rift',
  '/collections/identity-fusion',
  '/products/white-pulse-game-jersey',
  '/products/black-rift-game-jersey',
  '/products/identity-fusion-game-jersey',
  '/custom?style=black-rift-game-jersey',
  '/custom/saved/demo',
  '/stories',
  '/stories/from-buyer-to-creator',
  '/community',
  '/craftsmanship',
  '/about',
  '/team',
  '/cart',
  '/account',
  '/account/track',
  '/track',
  '/search?q=identity',
  '/search?city=chicago',
  '/support',
  '/faq',
  '/legal/privacy',
  '/not-a-real-route',
]

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
})

try {
  const [{ default: App }, { CartProvider }, { SiteConfigProvider }] = await Promise.all([
    server.ssrLoadModule('/src/App.tsx'),
    server.ssrLoadModule('/src/store/CartContext.tsx'),
    server.ssrLoadModule('/src/context/SiteConfigContext.tsx'),
  ])

  for (const route of routes) {
    const markup = renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [route] },
        createElement(SiteConfigProvider, null, createElement(CartProvider, null, createElement(App))),
      ),
    )
    const h1Count = (markup.match(/<h1/g) ?? []).length
    if (h1Count !== 1) throw new Error(`${route} rendered ${h1Count} h1 elements`)
    if (!markup.includes('id="main-content"')) throw new Error(`${route} is missing the main landmark`)
  }

  console.log(`Route smoke passed: ${routes.length} server-rendered routes with one h1 and a main landmark.`)
} finally {
  await server.close()
}
