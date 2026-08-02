import { Suspense, useState, useRef, useEffect } from 'react';
import { Await, NavLink, Link, useAsyncValue, useFetcher, useNavigate } from 'react-router';
import { useAnalytics, useOptimisticCart, Image, Money } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';

/**
 * @param {HeaderProps}
 */
export function Header({ header, isLoggedIn, cart, publicStoreDomain }) {
  const { shop, menu } = header;
  return (
    <header className="header-wrapper">
      {/* Top Announcement Bar - Guest Shopper Perks */}
      <div className="announcement-bar">
        <div className="announcement-bar-content">
          <span>🐾 Free Express Shipping on Orders Over $50 | Fast Guest Checkout (No Account Needed) 🐾</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="header-main">
        <div className="header-container">
          {/* Logo with Paw Icon */}
          <NavLink prefetch="intent" to="/" className="header-logo" end>
            <div className="header-logo-badge">
              <svg className="header-logo-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 10c-2.2 0-4 1.8-4 4 0 2.5 2.5 4.5 4 6.2 1.5-1.7 4-3.7 4-6.2 0-2.2-1.8-4-4-4zm-5.5-2.5C5.1 7.5 4 8.6 4 10s1.1 2.5 2.5 2.5S9 11.4 9 10s-1.1-2.5-2.5-2.5zm11 0C16.1 7.5 15 8.6 15 10s1.1 2.5 2.5 2.5S20 11.4 20 10s-1.1-2.5-2.5-2.5zM4 14.5C3.2 14.5 2.5 15.2 2.5 16s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm16 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z" />
              </svg>
            </div>
            <span className="header-logo-text">{shop?.name || 'Pet Care'}</span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header?.shop?.primaryDomain?.url || ''}
            publicStoreDomain={publicStoreDomain}
          />

          {/* Action Icons (Expandable Search, Cart, Account, Mobile Toggle) */}
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
    </header>
  );
}

/**
 * Expandable Navbar Search Component (collapses to icon button, expands on click)
 */
function NavbarSearch() {
  const fetcher = useFetcher({ key: 'navbar-live-search' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input automatically when search bar is expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Close dropdown & collapse search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!searchTerm.trim()) {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm]);

  // Handle live typing input
  function handleInputChange(e) {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      setIsOpen(true);
      fetcher.submit(
        { q: value, limit: 6, predictive: true },
        { method: 'GET', action: '/search' },
      );
    } else {
      setIsOpen(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setIsExpanded(false);
    }
  }

  function toggleExpand() {
    setIsExpanded((prev) => !prev);
    if (isExpanded) {
      setIsOpen(false);
    }
  }

  function clearSearch() {
    setSearchTerm('');
    setIsOpen(false);
    setIsExpanded(false);
  }

  const results = fetcher?.data?.result;
  const products = results?.items?.products || [];
  const collections = results?.items?.collections || [];
  const isLoading = fetcher.state === 'loading';

  return (
    <div className={`navbar-search-wrapper ${isExpanded ? 'is-expanded' : ''}`} ref={searchRef}>
      {!isExpanded ? (
        <button
          type="button"
          className="header-cta-btn search-toggle-btn reset"
          onClick={toggleExpand}
          aria-label="Search"
          title="Search"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      ) : (
        <div className="navbar-search-input-group expanded">
          <svg className="search-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="navbar-search-input"
            placeholder="Search pet toys, food, supplies..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => {
              if (searchTerm.trim().length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Search products"
          />
          <button type="button" className="search-clear-btn reset" onClick={clearSearch} aria-label="Close search">
            ✕
          </button>
        </div>
      )}

      {/* Instant Dropdown Preview Panel */}
      {isExpanded && isOpen && (
        <div className="navbar-search-dropdown">
          {isLoading && (
            <div className="search-dropdown-loading">
              <span>🐾 Searching products...</span>
            </div>
          )}

          {!isLoading && products.length === 0 && collections.length === 0 && (
            <div className="search-dropdown-empty">
              <span>No products found for "{searchTerm}"</span>
            </div>
          )}

          {/* Product Live Matches */}
          {products.length > 0 && (
            <div className="search-dropdown-section">
              <div className="search-dropdown-heading">Suggested Products ({products.length})</div>
              <ul className="search-dropdown-list">
                {products.map((product) => {
                  const price = product?.selectedOrFirstAvailableVariant?.price;
                  const image = product?.selectedOrFirstAvailableVariant?.image;
                  return (
                    <li key={product.id} className="search-dropdown-item">
                      <Link
                        to={`/products/${product.handle}`}
                        onClick={() => {
                          setIsOpen(false);
                          setIsExpanded(false);
                        }}
                        className="search-product-link"
                      >
                        {image?.url ? (
                          <Image
                            src={image.url}
                            alt={image.altText || product.title}
                            width={44}
                            height={44}
                            className="search-product-thumb"
                          />
                        ) : (
                          <div className="search-product-thumb-placeholder">🐾</div>
                        )}
                        <div className="search-product-info">
                          <span className="search-product-title">{product.title}</span>
                          {price && (
                            <span className="search-product-price">
                              <Money data={price} />
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Collection Live Matches */}
          {collections.length > 0 && (
            <div className="search-dropdown-section">
              <div className="search-dropdown-heading">Pet Categories</div>
              <ul className="search-dropdown-list">
                {collections.map((collection) => (
                  <li key={collection.id} className="search-dropdown-item">
                    <Link
                      to={`/collections/${collection.handle}`}
                      onClick={() => {
                        setIsOpen(false);
                        setIsExpanded(false);
                      }}
                      className="search-collection-link"
                    >
                      📁 <span>{collection.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* View All Search Link */}
          {searchTerm && (
            <div className="search-dropdown-footer">
              <Link
                to={`/search?q=${encodeURIComponent(searchTerm)}`}
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className="search-view-all-btn"
              >
                View all results for <strong>"{searchTerm}"</strong> →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const FIXED_HEADER_MENU = [
  { id: 'fixed-catalog', title: 'Catalog', url: '/collections/all' },
  { id: 'fixed-blog', title: 'Blog', url: '/blogs/journal' },
  { id: 'fixed-contact', title: 'About Us', url: '/pages/about' },
];

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const { close } = useAside();

  return (
    <nav className={className} role="navigation">
      {FIXED_HEADER_MENU.map((item) => (
        <NavLink
          className={({ isActive }) => (isActive ? 'header-menu-item active' : 'header-menu-item')}
          end={item.url === '/'}
          key={item.id}
          onClick={close}
          prefetch="intent"
          to={item.url}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({ isLoggedIn, cart }) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavbarSearch />
      <CartToggle cart={cart} />
      <NavLink prefetch="intent" to="/account" className="header-cta-btn account-icon-btn reset" title="Account / Order Lookup" aria-label="Account">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </NavLink>
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
      title="Menu"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    </button>
  );
}

/**
 * @param {{count: number}}
 */
function CartBadge({ count }) {
  const { type, open, close } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  const isCartOpen = type === 'cart';

  return (
    <button
      type="button"
      className={`header-cta-btn cart-btn reset ${isCartOpen ? 'active' : ''}`}
      onClick={() => {
        if (isCartOpen) {
          close();
        } else {
          open('cart');
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          });
        }
      }}
      aria-label={`Quick Cart (${count} items)`}
      title="Quick Cart"
    >
      <div className="cart-icon-wrapper">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        {count > 0 && (
          <span className="cart-count-badge">{count > 99 ? '99+' : count}</span>
        )}
      </div>
      <span className="cta-label">Cart</span>
    </button>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({ isActive, isPending }) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
