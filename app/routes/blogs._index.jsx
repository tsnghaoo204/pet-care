import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: `Pet Care | Expert Dog & Cat Lifestyle Blog`}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  let articlesList = [];
  try {
    const res = await context.storefront.query(ARTICLES_QUERY);
    articlesList = res?.articles?.nodes ?? [];
  } catch (e) {
    // Error
  }

  return {articles: articlesList};
}

function loadDeferredData() {
  return {};
}

export default function Blogs() {
  /** @type {LoaderReturnData} */
  const {articles} = useLoaderData();
  const [activeCategory, setActiveCategory] = useState('all');

  // Format articles fetched 100% via Storefront API GraphQL query
  const displayArticles = (articles || []).map((art) => ({
    id: art.id,
    handle: art.handle,
    blogHandle: art.blog?.handle || 'news',
    title: art.title,
    category: art.blog?.title || 'Pet Care',
    author: art.authorV2?.name || 'Pet Care Specialist',
    publishedAt: art.publishedAt,
    readTime: '5 min read',
    excerpt: art.excerpt || 'Explore practical pet care tips and advice for your pets.',
    image: art.image,
  }));

  const filteredArticles = displayArticles.filter((article) => {
    const cat = (article.category || article.title || '').toLowerCase();
    if (activeCategory === 'cat') return cat.includes('cat');
    if (activeCategory === 'dog') return cat.includes('dog');
    return true;
  });

  const featuredArticle = filteredArticles[0];

  return (
    <div className="pet-container" style={{paddingTop: '2.5rem', paddingBottom: '5rem'}}>
      {/* Blog Hero Section */}
      <div className="pet-blog-hero">
        <div className="pet-section-badge">🐾 Pet Care Journal</div>
        <h1 className="pet-blog-title">Expert Pet Care Guides & Tips 📚</h1>
        <p className="pet-blog-subtitle">
          Discover veterinarian-approved advice on nutrition, training, health, and toys for happy dogs & cats.
        </p>

        {/* Filter Category Tabs */}
        <div className="pet-blog-tabs">
          <button
            type="button"
            className={`pet-blog-pill ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            🌟 All Articles
          </button>
          <button
            type="button"
            className={`pet-blog-pill ${activeCategory === 'cat' ? 'active' : ''}`}
            onClick={() => setActiveCategory('cat')}
          >
            🐱 Cat Care & Toys
          </button>
          <button
            type="button"
            className={`pet-blog-pill ${activeCategory === 'dog' ? 'active' : ''}`}
            onClick={() => setActiveCategory('dog')}
          >
            🐶 Dog Care & Training
          </button>
        </div>
      </div>

      {displayArticles.length === 0 ? (
        <div className="pet-empty-blog-box" style={{textAlign: 'center', padding: '4rem 1.5rem', background: '#fff', borderRadius: '24px', border: '1.5px solid rgba(61, 123, 93, 0.14)'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--pet-text)'}}>No Blog Posts Found Yet 📰</h2>
          <p style={{color: 'var(--pet-text-muted)', maxWidth: '540px', margin: '0 auto 1.5rem'}}>
            Articles created in Shopify Admin ➔ Online Store ➔ Blog Posts will automatically appear here via Storefront API once published as "Visible".
          </p>
          <Link to="/collections/all" className="featured-read-btn">
            Explore Pet Products ➔
          </Link>
        </div>
      ) : (
        <>
          {/* Featured Big Article Card */}
          {activeCategory === 'all' && featuredArticle && (
            <div className="pet-blog-featured-card">
              <div className="featured-card-img-box">
                {featuredArticle.image ? (
                  <img src={featuredArticle.image.url} alt={featuredArticle.image.altText || featuredArticle.title} />
                ) : (
                  <div className="article-placeholder">🐾</div>
                )}
                <span className="featured-badge">Featured Story ✨</span>
              </div>
              <div className="featured-card-body">
                <div className="article-meta-row">
                  <span className="article-category-tag">{featuredArticle.category}</span>
                  <span className="article-read-time">⏱️ {featuredArticle.readTime}</span>
                </div>
                <h2 className="featured-card-title">
                  <Link to={`/blogs/${featuredArticle.blogHandle}/${featuredArticle.handle}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>
                <p className="featured-card-excerpt">{featuredArticle.excerpt}</p>
                <div className="article-author-row">
                  <span className="author-name">✍️ Contributors</span>
                  <Link
                    to={`/blogs/${featuredArticle.blogHandle}/${featuredArticle.handle}`}
                    className="featured-read-btn"
                  >
                    Read Article ➔
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <h3 className="blog-section-heading">Latest Pet Care Articles</h3>
          <div className="pet-blog-grid">
            {filteredArticles.map((article) => (
              <div className="pet-article-card" key={article.id}>
                <Link to={`/blogs/${article.blogHandle}/${article.handle}`} className="article-card-img-box">
                  {article.image ? (
                    <img src={article.image.url} alt={article.image.altText || article.title} className="article-card-img" />
                  ) : (
                    <div className="article-placeholder">🐾</div>
                  )}
                  <span className="article-card-badge">{article.category}</span>
                </Link>
                <div className="article-card-body">
                  <div className="article-meta">
                    <span>⏱️ {article.readTime}</span>
                    <span>•</span>
                    <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                  <h3 className="article-card-title">
                    <Link to={`/blogs/${article.blogHandle}/${article.handle}`}>{article.title}</Link>
                  </h3>
                  <p className="article-card-excerpt">{article.excerpt}</p>
                  <div className="article-card-footer">
                    <span className="article-author">✍️ Contributors</span>
                    <Link to={`/blogs/${article.blogHandle}/${article.handle}`} className="article-read-link">
                      Read ➔
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const ARTICLES_QUERY = `#graphql
  query Articles($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    articles(first: 25) {
      nodes {
        id
        handle
        title
        excerpt
        contentHtml
        publishedAt
        authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        blog {
          handle
          title
        }
      }
    }
  }
`;

/** @typedef {import('./+types/blogs._index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
