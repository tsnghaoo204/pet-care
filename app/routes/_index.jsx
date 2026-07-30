import {Suspense} from 'react';
import {Await, useLoaderData} from 'react-router';
import {PetHero} from '~/components/PetHero';
import {PetCategoryNav} from '~/components/PetCategoryNav';
import {PetProductCard} from '~/components/PetProductCard';
import {ValueProps} from '~/components/ValueProps';
import {PetCareBlogSection} from '~/components/PetCareBlogSection';
import {MockShopNotice} from '~/components/MockShopNotice';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'Pet Care & Pet Toys | Đồ Chơi & Đồ Dùng Thú Cưng'},
    {
      name: 'description',
      content:
        'Cửa hàng đồ chơi và phụ kiện thú cưng an toàn, chất lượng cao dành cho chó mèo.',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY).catch((err) => {
      console.error('Error fetching collections:', err);
      return {collections: {nodes: []}};
    }),
  ]);

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    collections,
  };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error('Storefront Product Query Error:', error);
      return null;
    });

  const articles = context.storefront
    .query(ARTICLES_QUERY)
    .then((res) => res?.articles)
    .catch((error) => {
      console.error('Storefront Article Query Error:', error);
      return null;
    });

  return {
    recommendedProducts,
    articles,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  return (
    <div className="pet-homepage">
      {data.isShopLinked ? null : <MockShopNotice />}

      {/* 1. Hero Section */}
      <PetHero />

      {/* 2. Category Nav Section (Real Shopify Collections) */}
      <PetCategoryNav collections={data.collections} />

      {/* 3. Featured Products Section (Real Shopify Products) */}
      <section className="pet-container" style={{paddingTop: '2rem'}}>
        <div className="pet-section-header">
          <div className="pet-section-badge">Sản Phẩm Nổi Bật</div>
          <h2 className="pet-section-title">Đồ Dùng Thú Cưng Mới Nhất</h2>
          <p className="pet-section-subtitle">
            Khám phá các sản phẩm chất lượng cao vừa cập nhật từ cửa hàng
          </p>
        </div>

        {/* Product Cards Grid */}
        <Suspense fallback={<div className="pet-container" style={{textAlign: 'center', padding: '2rem'}}>Đang tải sản phẩm...</div>}>
          <Await resolve={data.recommendedProducts}>
            {(response) => {
              const products = response?.products?.nodes || [];
              if (!products.length) {
                return (
                  <div style={{textAlign: 'center', padding: '3rem 1rem', color: '#6C757D'}}>
                    <p style={{fontSize: '1.2rem', fontWeight: 600}}>Chưa có sản phẩm nào trong cửa hàng Shopify.</p>
                    <p style={{fontSize: '0.95rem'}}>Hãy thêm sản phẩm mới trong trang quản trị Shopify Admin để hiển thị ở đây!</p>
                  </div>
                );
              }
              return (
                <div className="pet-products-grid">
                  {products.map((product) => (
                    <PetProductCard key={product.id} product={product} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </section>

      {/* 4. Value Propositions */}
      <ValueProps />

      {/* 5. Pet Care Blog Guides (Real Shopify Articles) */}
      <Suspense fallback={null}>
        <Await resolve={data.articles}>
          {(articles) => <PetCareBlogSection articles={articles} />}
        </Await>
      </Suspense>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 6, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        image {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const ARTICLES_QUERY = `#graphql
  query Articles($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    articles(first: 3, sortKey: PUBLISHED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        excerpt
        image {
          id
          url
          altText
          width
          height
        }
        blog {
          handle
        }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
