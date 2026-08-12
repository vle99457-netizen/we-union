import { ArrowUpRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { formatPrice, type Product } from '../data/catalog'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <article className="product-card">
      <Link
        className="product-card__image"
        to={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
      >
        {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
        <img
          src={product.image}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          width="941"
          height="941"
        />
        <span className="product-card__arrow" aria-hidden="true">
          <ArrowUpRight size={18} weight="bold" />
        </span>
      </Link>
      <div className="product-card__meta">
        <div>
          <h3>
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p>{product.color}</p>
        </div>
        <p className="product-card__price">{formatPrice(product.price)}*</p>
      </div>
    </article>
  )
}
