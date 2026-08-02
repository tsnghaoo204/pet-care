import {useState} from 'react';
import {redirect, useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';

const ALL_COLLECTIONS_QUERY = `#graphql
  query AllCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 10) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Pet Care | ${data?.collection?.title ?? 'Catalog'} Collection`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 9,
  });

  if (!handle) {
    throw redirect('/collections/all');
  }

  let collectionData = null;
  let allCollections = [];

  try {
    const [mainRes, collectionsRes] = await Promise.all([
      storefront.query(COLLECTION_QUERY, {
        variables: {handle, ...paginationVariables},
      }).catch(() => null),
      storefront.query(ALL_COLLECTIONS_QUERY).catch(() => null),
    ]);

    collectionData = mainRes?.collection ?? null;
    allCollections = collectionsRes?.collections?.nodes ?? [];
  } catch (err) {
    // Fallback
  }

  if (!collectionData) {
    try {
      const fallbackRes = await storefront.query(COLLECTION_QUERY, {
        variables: {handle: 'all', ...paginationVariables},
      });
      collectionData = fallbackRes?.collection ?? null;
    } catch (e) {
      // Fallback
    }
  }

  if (!collectionData) {
    collectionData = {
      id: 'fallback-catalog',
      handle: handle || 'all',
      title: 'Pet Care Catalog',
      description: 'Explore our collection of supplies for your pets.',
      products: { nodes: [], pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null } },
    };
  }

  return {
    collection: collectionData,
    allCollections,
    activeHandle: handle,
  };
}

function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection, allCollections, activeHandle} = useLoaderData();

  const [petType, setPetType] = useState('all');
  const [pricePreset, setPricePreset] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('best-selling');

  const default7SEOCollections = [
    { handle: 'dog-toys', title: 'Dog Toys' },
    { handle: 'cat-toys', title: 'Cat Toys' },
    { handle: 'collars-leashes-harnesses', title: 'Collars, Leashes & Harnesses' },
    { handle: 'pet-beds-mats', title: 'Pet Beds & Mats' },
    { handle: 'pet-costumes-apparel', title: 'Pet Costumes & Apparel' },
    { handle: 'grooming-health-care', title: 'Grooming & Health Care' },
    { handle: 'new-arrivals', title: 'New Arrivals' },
  ];

  const filterItems = [
    { handle: 'all', title: 'All Products' },
    ...(allCollections.length > 1
      ? allCollections.map((c) => ({ handle: c.handle, title: c.title }))
      : default7SEOCollections),
  ];

  const currentHandle = activeHandle || collection.handle || 'all';

  function handleReset() {
    setPetType('all');
    setPricePreset('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setSortOption('best-selling');
  }

  const productNodes = collection?.products?.nodes ?? [];
  const filteredProductsNodes = productNodes.filter((p) => {
    const title = p.title.toLowerCase();

    // 1. Pet Type Filter
    if (petType === 'dog' && !title.includes('dog') && !title.includes('puppy')) return false;
    if (petType === 'cat' && !title.includes('cat') && !title.includes('kitten')) return false;
    if (petType === 'small-pet' && !title.includes('rabbit') && !title.includes('hamster') && !title.includes('bird')) return false;

    // 2. Size Filter
    if (selectedSize !== 'all') {
      const sz = selectedSize.toLowerCase();
      if (!title.includes(` ${sz} `) && !title.includes(`-${sz}`) && !title.includes(`${sz}-`)) {
        // Soft match if title contains size option
      }
    }

    // 3. Color Filter
    if (selectedColor !== 'all') {
      if (!title.includes(selectedColor.toLowerCase())) return false;
    }

    // 4. Price Filter (USD)
    const amount = parseFloat(p.priceRange?.minVariantPrice?.amount ?? 0);
    if (pricePreset === 'under-15' && amount >= 15) return false;
    if (pricePreset === '15-30' && (amount < 15 || amount > 30)) return false;
    if (pricePreset === '30-50' && (amount < 30 || amount > 50)) return false;
    if (pricePreset === '50-100' && (amount < 50 || amount > 100)) return false;
    if (pricePreset === 'over-100' && amount <= 100) return false;

    return true;
  });

  // Sort logic
  const sortedNodes = [...filteredProductsNodes].sort((a, b) => {
    const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount ?? 0);
    const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount ?? 0);

    if (sortOption === 'price-low-high') return priceA - priceB;
    if (sortOption === 'price-high-low') return priceB - priceA;
    if (sortOption === 'newest') return b.id.localeCompare(a.id);
    return 0; // default best selling
  });

  const defaultPageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  };

  const filteredConnection = {
    pageInfo: collection?.products?.pageInfo || defaultPageInfo,
    ...collection?.products,
    nodes: sortedNodes,
  };

  return (
    <div className="pet-container" style={{paddingTop: '2.5rem', paddingBottom: '5rem'}}>
      <div className="pet-catalog-page-top">
        <div className="pet-section-badge">🐾 Pet Care Catalog</div>
        <h1 className="pet-catalog-title">
          {currentHandle === 'all' ? 'All Pet Products & Supplies 🛒' : collection.title}
        </h1>
        <p className="pet-catalog-subtitle">
          {collection.description || 'Explore our curated selection of high-quality, durable, and safe supplies for your beloved pets.'}
        </p>
      </div>

      <div className="pet-catalog-layout">
        {/* Left Sidebar Filter Column */}
        <div className="pet-catalog-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <h3 className="sidebar-title">Filters</h3>
              <button type="button" onClick={handleReset} className="sidebar-reset-btn">
                Clear All
              </button>
            </div>

            {/* Filter 1: Pet Type (Dog / Cat / Small Pet) */}
            <div className="sidebar-section">
              <h4 className="filter-group-title">Pet Type</h4>
              <div className="filter-group-content">
                <label className="filter-radio-label">
                  <input type="radio" name="petType" checked={petType === 'all'} onChange={() => setPetType('all')} />
                  <span>All Pets</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="petType" checked={petType === 'dog'} onChange={() => setPetType('dog')} />
                  <span>🐶 Dogs & Puppies</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="petType" checked={petType === 'cat'} onChange={() => setPetType('cat')} />
                  <span>🐱 Cats & Kittens</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="petType" checked={petType === 'small-pet'} onChange={() => setPetType('small-pet')} />
                  <span>🐹 Small Animals</span>
                </label>
              </div>
            </div>

            <div className="sidebar-divider" />

            {/* Filter 2: Shop Categories */}
            <div className="sidebar-section">
              <h4 className="filter-group-title">Shop Categories</h4>
              <div className="filter-group-content">
                {filterItems.map((item) => (
                  <Link
                    key={item.handle}
                    to={`/collections/${item.handle}`}
                    prefetch="intent"
                    className={`sidebar-link ${currentHandle === item.handle ? 'active' : ''}`}
                  >
                    <span>{item.handle === 'all' ? '🏷️' : '🐾'}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="sidebar-divider" />

            {/* Filter 3: Price Range (USD) */}
            <div className="sidebar-section">
              <h4 className="filter-group-title">Price Range (USD)</h4>
              <div className="filter-group-content">
                <label className="filter-radio-label">
                  <input type="radio" name="price" checked={pricePreset === 'all'} onChange={() => setPricePreset('all')} />
                  <span>All Prices</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="price" checked={pricePreset === 'under-15'} onChange={() => setPricePreset('under-15')} />
                  <span>Under $15</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="price" checked={pricePreset === '15-30'} onChange={() => setPricePreset('15-30')} />
                  <span>$15 – $30</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="price" checked={pricePreset === '30-50'} onChange={() => setPricePreset('30-50')} />
                  <span>$30 – $50</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="price" checked={pricePreset === '50-100'} onChange={() => setPricePreset('50-100')} />
                  <span>$50 – $100</span>
                </label>
                <label className="filter-radio-label">
                  <input type="radio" name="price" checked={pricePreset === 'over-100'} onChange={() => setPricePreset('over-100')} />
                  <span>Over $100</span>
                </label>
              </div>
            </div>

            <div className="sidebar-divider" />

            {/* Filter 4: Size (S/M/L/XL) */}
            <div className="sidebar-section">
              <h4 className="filter-group-title">Size</h4>
              <div className="filter-size-grid">
                {['all', 'S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`filter-size-pill ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz === 'all' ? 'All' : sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-divider" />

            {/* Filter 5: Color Swatches */}
            <div className="sidebar-section">
              <h4 className="filter-group-title">Color</h4>
              <div className="filter-color-grid">
                {[
                  { id: 'all', name: 'All', color: '#e5e7eb' },
                  { id: 'black', name: 'Black', color: '#111827' },
                  { id: 'blue', name: 'Blue', color: '#3b82f6' },
                  { id: 'pink', name: 'Pink', color: '#ec4899' },
                  { id: 'green', name: 'Green', color: '#10b981' },
                  { id: 'red', name: 'Red', color: '#ef4444' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.name}
                    className={`filter-color-dot ${selectedColor === c.id ? 'active' : ''}`}
                    onClick={() => setSelectedColor(c.id)}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>

            <div className="sidebar-divider" />

            {/* Filter 6: Availability */}
            <div className="sidebar-section">
              <h4 className="filter-group-title">Availability</h4>
              <div className="filter-group-content">
                <label className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-badge-box">
              <span>🚚 Free Worldwide Shipping over $50</span>
            </div>
          </div>
        </div>

        {/* Right Products Column */}
        <div className="pet-catalog-products-wrap">
          {/* Top Sort Toolbar */}
          <div className="pet-catalog-toolbar">
            <div className="toolbar-count">
              Showing <strong>{sortedNodes.length}</strong> pet products
            </div>
            <div className="toolbar-sort">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pet-sort-select"
              >
                <option value="best-selling">Featured / Best Selling</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          <PaginatedResourceSection
            connection={filteredConnection}
            resourcesClassName="pet-products-grid-3col"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 9 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
