import {Link} from 'react-router';
import {Money, Image} from '@shopify/hydrogen';

export function PetProductCard({product}) {
  if (!product) return null;

  const {handle, title, priceRange, featuredImage, tags} = product;
  const price = priceRange?.minVariantPrice;
  const tag = tags && tags.length > 0 ? tags[0] : null;

  return (
    <div className="pet-product-card">
      <div className="pet-product-image-box">
        {tag && <span className="pet-tag-badge">{tag}</span>}
        <Link to={`/products/${handle}`}>
          {featuredImage ? (
            <Image data={featuredImage} alt={featuredImage.altText || title} loading="lazy" />
          ) : (
            <div className="pet-product-image-placeholder">No Image</div>
          )}
        </Link>
      </div>

      <div className="pet-product-info">
        <Link to={`/products/${handle}`} className="pet-product-title">
          {title}
        </Link>

        <div className="pet-product-footer">
          <div className="pet-product-price">
            {price ? <Money data={price} /> : <span>Contact for price</span>}
          </div>

          <Link
            to={`/products/${handle}`}
            className="pet-add-cart-btn"
            title="Xem chi tiết & Mua hàng"
          >
            🛒
          </Link>
        </div>
      </div>
    </div>
  );
}
