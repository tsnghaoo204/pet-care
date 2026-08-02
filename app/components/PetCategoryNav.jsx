import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

export function PetCategoryNav({collections}) {
  const shopifyList = collections?.nodes || [];

  const default6Categories = [
    { id: 'cat-dog-toys', title: 'Dog Toys', handle: 'dog-toys', icon: '🐶' },
    { id: 'cat-cat-toys', title: 'Cat Toys', handle: 'cat-toys', icon: '🐱' },
    { id: 'cat-collars', title: 'Collars & Harnesses', handle: 'collars-leashes-harnesses', icon: '🦮' },
    { id: 'cat-beds', title: 'Pet Beds & Mats', handle: 'pet-beds-mats', icon: '🛋️' },
    { id: 'cat-apparel', title: 'Costumes & Apparel', handle: 'pet-costumes-apparel', icon: '👔' },
    { id: 'cat-grooming', title: 'Grooming & Health', handle: 'grooming-health-care', icon: '🧼' },
  ];

  const displayList = shopifyList.length > 1
    ? shopifyList.map((col) => ({
        id: col.id,
        title: col.title,
        handle: col.handle,
        image: col.image,
      }))
    : default6Categories;

  return (
    <section className="pet-category-section">
      <div className="pet-container">
        <div className="pet-section-header">
          <div className="pet-section-badge">Popular Categories</div>
          <h2 className="pet-section-title">Shop by Pet Category</h2>
          <p className="pet-section-subtitle">
            Browse our curated collections for dogs, cats, and small pets
          </p>
        </div>

        <div className="pet-category-grid">
          {displayList.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.handle}`}
              className="pet-category-card"
            >
              <div className="pet-category-icon-box">
                {col.image ? (
                  <Image data={col.image} alt={col.image.altText || col.title} width={50} height={50} />
                ) : (
                  <span>{col.icon || '🐾'}</span>
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
