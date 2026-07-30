import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';

export function PetCareBlogSection({articles}) {
  const articleList = articles?.nodes || [];

  if (!articleList.length) {
    return null;
  }

  return (
    <section className="pet-container" style={{marginTop: '3rem'}}>
      <div className="pet-section-header">
        <div className="pet-section-badge">Góc Cẩm Nang Thú Cưng</div>
        <h2 className="pet-section-title">Bài Viết & Cẩm Nang Chăm Sóc</h2>
        <p className="pet-section-subtitle">
          Cập nhật kiến thức chăm sóc và tư vấn bổ ích từ cửa hàng
        </p>
      </div>

      <div className="pet-blog-grid">
        {articleList.map((article) => {
          const blogHandle = article.blog?.handle || 'news';
          return (
            <div key={article.id} className="pet-blog-card">
              {article.image && (
                <div className="pet-blog-img-wrap">
                  <Image data={article.image} alt={article.image.altText || article.title} loading="lazy" />
                </div>
              )}
              <div className="pet-blog-content">
                <h3 className="pet-blog-title">{article.title}</h3>
                {article.excerpt && <p className="pet-blog-excerpt">{article.excerpt}</p>}
                <Link to={`/blogs/${blogHandle}/${article.handle}`} className="pet-blog-link">
                  Đọc bài viết ➔
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
