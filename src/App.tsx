import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { useProducts } from './hooks/useProducts'
import { layoutFromId } from './lib/productLayout'
import type { CategoryId } from './types/catalog'
import { CATEGORIES } from './types/catalog'
import type { Product } from './types/product'

/** Put your file at `public/logo.png` (or change the path, e.g. `/logo.svg`). */
const LOGO_SRC = '/logo.png'

function IconHome() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCategory() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconBell() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 10a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M10 20a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconMessage() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H6a2 2 0 0 1-2-2V6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconGear() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M18.25 12a6.3 6.3 0 0 0-.05-.62l1.86-1.45-1.8-3.12-2.22.9a6.4 6.4 0 0 0-1.07-.62l-.34-2.36h-3.66l-.34 2.36c-.38.16-.74.36-1.07.62l-2.22-.9-1.8 3.12 1.86 1.45c-.03.2-.05.41-.05.62s.02.42.05.62l-1.86 1.45 1.8 3.12 2.22-.9c.33.26.69.46 1.07.62l.34 2.36h3.66l.34-2.36c.38-.16.74-.36 1.07-.62l2.22.9 1.8-3.12-1.86-1.45c.03-.2.05-.41.05-.62Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M16 16l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCamera() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9h3l1.5-2h7L17 9h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="3.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

function IconMic() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="4" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M6 12a6 6 0 0 0 12 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ProductPin({ product: p }: { product: Product }) {
  const { height, tone } = layoutFromId(p.id)
  const label = p.title?.trim() || 'Product'

  return (
    <article className="pin" role="listitem">
      <div className="pin__media">
        {p.imageUrl ? (
          <img
            className="pin__img"
            src={p.imageUrl}
            alt={label}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`pin__placeholder pin__placeholder--h-${height} pin__placeholder--tone-${tone}`}
            aria-hidden
          />
        )}
        <div className="pin__bar">
          <span className="pin__price">{p.price}</span>
        </div>
        <div className="pin__overlay">
          <div className="pin__overlay-top">
            <button type="button" className="pin__save">
              Save
            </button>
          </div>
          <div className="pin__overlay-bottom">
            {p.details ? (
              <p className="pin__details">{p.details}</p>
            ) : null}
            <a
              className="pin__affiliate"
              href={p.affiliateLink}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
            >
              Shop
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

function App() {
  const { products, loading, error } = useProducts()
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(
    'all',
  )
  const categoryWrapRef = useRef<HTMLDivElement>(null)

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'all') return products
    return products.filter((p) => p.category === selectedCategory)
  }, [products, selectedCategory])

  useEffect(() => {
    if (!categoryOpen) return
    const onPointerDown = (e: PointerEvent) => {
      const el = categoryWrapRef.current
      if (el && !el.contains(e.target as Node)) setCategoryOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [categoryOpen])

  return (
    <div className="app">
      <aside className="sidebar" aria-label="Primary">
        <a href="/" className="sidebar__logo" aria-label="BuyInterest home">
          <img
            className="sidebar__logo-img"
            src={LOGO_SRC}
            alt=""
            width={48}
            height={48}
            decoding="async"
          />
        </a>
        <nav className="sidebar__nav" aria-label="Main navigation">
          <button
            type="button"
            className="sidebar__link sidebar__link--active"
            aria-current="page"
            title="Home"
          >
            <IconHome />
          </button>

          <div
            className={`sidebar__category${categoryOpen ? ' sidebar__category--open' : ''}`}
            ref={categoryWrapRef}
          >
            <button
              type="button"
              className={`sidebar__category-trigger${categoryOpen ? ' sidebar__category-trigger--active' : ''}`}
              title="Category"
              aria-expanded={categoryOpen}
              aria-haspopup="true"
              onClick={() => setCategoryOpen((open) => !open)}
            >
              <IconCategory />
            </button>
            <div
              className="sidebar__category-flyout"
              role="menu"
              aria-hidden={!categoryOpen}
            >
              <p className="sidebar__category-heading">Browse by category</p>
              <ul className="sidebar__category-list">
                <li>
                  <button
                    type="button"
                    className={
                      'sidebar__category-option' +
                      (selectedCategory === 'all'
                        ? ' sidebar__category-option--active'
                        : '')
                    }
                    onClick={() => {
                      setSelectedCategory('all')
                      setCategoryOpen(false)
                    }}
                  >
                    All categories
                  </button>
                </li>
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={
                        'sidebar__category-option' +
                        (selectedCategory === c.id
                          ? ' sidebar__category-option--active'
                          : '')
                      }
                      onClick={() => {
                        setSelectedCategory(c.id)
                        setCategoryOpen(false)
                      }}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button type="button" className="sidebar__link" title="Create">
            <IconPlus />
          </button>
          <button type="button" className="sidebar__link" title="Notifications">
            <IconBell />
          </button>
          <button type="button" className="sidebar__link" title="Messages">
            <IconMessage />
          </button>
        </nav>
        <div className="sidebar__footer">
          <button type="button" className="sidebar__link" title="Settings">
            <IconGear />
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="header">
          <div className="header__search-wrap">
            <IconSearch />
            <label className="visually-hidden" htmlFor="search">
              Search
            </label>
            <input
              id="search"
              className="header__search"
              type="search"
              placeholder="Search"
              autoComplete="off"
            />
            <div className="header__search-actions">
              <button type="button" className="icon-btn" title="Search by image">
                <IconCamera />
              </button>
              <button type="button" className="icon-btn" title="Voice search">
                <IconMic />
              </button>
            </div>
          </div>
          <div className="header__right">
            <img
              className="avatar"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80&auto=format&fit=crop"
              width={40}
              height={40}
              alt="Your profile"
            />
          </div>
        </header>

        <main className="feed">
          {error ? (
            <p className="feed__banner feed__banner--error" role="alert">
              {error}
            </p>
          ) : null}
          {loading ? (
            <p className="feed__banner">Loading products…</p>
          ) : null}
          {!loading && !error && visibleProducts.length === 0 ? (
            <p className="feed__empty">
              No products yet. In Firebase Console add documents to the{' '}
              <strong>products</strong> collection (fields:{' '}
              <code>category</code>, <code>price</code>, <code>details</code>,{' '}
              <code>affiliateLink</code>, <code>imageUrl</code>, optional{' '}
              <code>title</code>, <code>order</code>). Upload images to Storage
              under <code>products/</code> and paste the file&apos;s download URL
              into <code>imageUrl</code>.
            </p>
          ) : null}
          <div className="masonry" role="list">
            {visibleProducts.map((p) => (
              <ProductPin key={p.id} product={p} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
