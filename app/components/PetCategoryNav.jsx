import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

export function PetCategoryNav({collections}) {
  const collectionList = collections?.nodes || [];

  if (!collectionList.length) {
    return null;
  }

  return (
    <section className="pet-category-section">
      <div className="pet-container">
        <div className="pet-section-header">
          <div className="pet-section-badge">Danh Mục Nổi Bật</div>
          <h2 className="pet-section-title">Danh Mục Phù Hợp Cho Thú Cưng</h2>
          <p className="pet-section-subtitle">
            Lựa chọn sản phẩm theo bộ sưu tập đã được tạo trên Shopify
          </p>
        </div>

        <div className="pet-category-grid">
          {collectionList.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.handle}`}
              className="pet-category-card"
            >
              <div className="pet-category-icon-box">
                {col.image ? (
                  <Image data={col.image} alt={col.image.altText || col.title} width={50} height={50} />
                ) : (
                  <span>🐾</span>
                )}
              </div>
              <div className="pet-category-name">{col.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
