import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  // Determine dynamic product tag badge
  const isNew = product.tags?.includes('new') || product.handle?.includes('new');
  const isHot = product.tags?.includes('hot') || product.handle?.includes('cat') || product.handle?.includes('dog');
  const tagText = isNew ? 'New Arrival ✨' : isHot ? 'Top Seller 🔥' : 'Best Choice ⭐';

  return (
    <Link
      className="pet-product-card"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="pet-product-card-img-box">
        <span className={`pet-product-tag ${isNew ? 'tag-new' : ''}`}>{tagText}</span>
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="1/1"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 300px, 100vw"
            className="pet-product-card-img"
          />
        ) : (
          <div className="pet-product-card-placeholder">🐾</div>
        )}
      </div>

      <div className="pet-product-card-body">
        <div className="pet-product-rating">⭐⭐⭐⭐⭐ (4.9)</div>
        <h3 className="pet-product-card-title">{product.title}</h3>
        <div className="pet-product-card-footer">
          <div className="pet-product-card-price">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
          <span className="pet-product-card-btn">View Item ➔</span>
        </div>
      </div>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
