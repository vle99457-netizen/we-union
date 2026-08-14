import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { SiteConfigProvider } from './context/SiteConfigContext'
import { CartProvider } from './store/CartContext'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SiteConfigProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SiteConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
