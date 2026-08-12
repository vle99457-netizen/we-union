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
  '/collections/water-ripple?sort=low&filter=personalizable',
  '/products/water-ripple-game-jersey',
  '/custom?style=midnight-standard-jersey',
  '/custom/saved/demo',
  '/stories',
  '/stories/the-number-24',
  '/community',
  '/craftsmanship',
  '/about',
  '/team',
  '/cart',
  '/account',
  '/account/track',
  '/track',
  '/search?q=ripple',
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
  const [{ default: App }, { CartProvider }] = await Promise.all([
    server.ssrLoadModule('/src/App.tsx'),
    server.ssrLoadModule('/src/store/CartContext.tsx'),
  ])

  for (const route of routes) {
    const markup = renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [route] },
        createElement(CartProvider, null, createElement(App)),
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
