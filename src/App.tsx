import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteChrome } from './components/SiteChrome'
import { RouteMetadata } from './components/RouteMetadata'
import { useSiteConfig } from './context/SiteConfigContext'
import {
  AboutPage,
  AccountPage,
  CartPage,
  CheckoutPage,
  CollectionsPage,
  CommunityPage,
  CraftsmanshipPage,
  CustomPage,
  HomePage,
  NotFoundPage,
  PolicyPage,
  ProductPage,
  SearchPage,
  SeriesPage,
  StoriesPage,
  StoryPage,
  SupportPage,
  TeamPage,
  TrackPage,
  WorldPage,
} from './pages'

const AdminPage = lazy(() => import('./admin/AdminPage').then((module) => ({ default: module.AdminPage })))

function PublicRoutes() {
  return (
    <SiteChrome>
      <RouteMetadata />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<WorldPage world="create" />} />
        <Route path="/honor" element={<WorldPage world="honor" />} />
        <Route path="/belong" element={<WorldPage world="belong" />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/shop" element={<Navigate to="/collections" replace />} />
        <Route path="/collections/water-ripple" element={<Navigate to="/collections/white-pulse" replace />} />
        <Route path="/collections/crack" element={<Navigate to="/collections/black-rift" replace />} />
        <Route path="/collections/common-thread" element={<Navigate to="/belong" replace />} />
        <Route path="/collections/:slug" element={<SeriesPage />} />
        <Route path="/products/water-ripple-game-jersey" element={<Navigate to="/products/white-pulse-game-jersey" replace />} />
        <Route path="/products/water-ripple-warmup" element={<Navigate to="/products/white-pulse-motion-top" replace />} />
        <Route path="/products/crack-game-jersey" element={<Navigate to="/products/black-rift-game-jersey" replace />} />
        <Route path="/products/crack-travel-jacket" element={<Navigate to="/products/black-rift-travel-layer" replace />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/custom" element={<CustomPage />} />
        <Route path="/custom/team" element={<TeamPage />} />
        <Route path="/custom/saved/:id" element={<CustomPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/:slug" element={<StoryPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/craftsmanship" element={<CraftsmanshipPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/orders" element={<AccountPage />} />
        <Route path="/account/saved-designs" element={<AccountPage />} />
        <Route path="/account/track" element={<TrackPage />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/faq" element={<SupportPage />} />
        <Route path="/legal/:slug" element={<PolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteChrome>
  )
}

function MaintenanceScreen() {
  const { config } = useSiteConfig()
  return (
    <main className="maintenance-screen">
      <img src={config.global.logoUrl} alt={config.global.siteName} width="307" height="195" />
      <p className="eyebrow">WE / STUDIO</p>
      <h1>{config.system.maintenanceTitle}</h1>
      <p>{config.system.maintenanceMessage}</p>
    </main>
  )
}

export default function App() {
  const location = useLocation()
  const { config } = useSiteConfig()
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/')

  if (isAdminRoute) {
    return (
      <>
        <RouteMetadata />
        <Routes>
          <Route path="/admin" element={<Suspense fallback={<main className="admin-route-loading">Loading administration…</main>}><AdminPage /></Suspense>} />
          <Route path="/admin/customizer" element={<Navigate to="/admin?section=customizer" replace />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </>
    )
  }

  if (config.system.maintenanceMode) return <MaintenanceScreen />
  return <PublicRoutes />
}
