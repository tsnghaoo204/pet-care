import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Pet Care | ${data?.blog?.title ?? 'Pet Care Journal'} Blog`}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const {blogHandle} = params;
  let blogData = null;

  try {
    const res = await context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: blogHandle || 'news',
        ...paginationVariables,
      },
    });
    blogData = res?.blog ?? null;
  } catch (e) {
    // Fallback
  }

  if (!blogData) {
    blogData = {
      title: 'Pet Care Journal & Guides',
      handle: blogHandle || 'news',
      articles: { nodes: [] },
    };
  }

  return {blog: blogData};
}

function loadDeferredData({context}) {
  return {};
}

export default function Blog() {
  /** @type {LoaderReturnData} */
  const {blog} = useLoaderData();
  const [activeTab, setActiveTab] = useState('all');

  const displayArticles = blog?.articles?.nodes ?? [];

  const filteredArticles = displayArticles.filter((article) => {
    const cat = (article.category || article.title || '').toLowerCase();
    if (activeTab === 'cat') return cat.includes('cat');
    if (activeTab === 'dog') return cat.includes('dog');
    return true;
  });

  return (
    <div className="pet-container" style={{paddingTop: '2.5rem', paddingBottom: '5rem'}}>
      <div className="pet-blog-hero">
        <div className="pet-section-badge">🐾 Pet Care Journal</div>
        <h1 className="pet-blog-title">{blog.title || 'Dog & Cat Care Blog 📚'}</h1>
        <p className="pet-blog-subtitle">
          Expert advice on nutrition, health, interactive toys, and training for your pets.
        </p>

        {/* Filter Category Tabs */}
        <div className="pet-blog-tabs">
          <button
            type="button"
            className={`pet-blog-pill ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            🌟 All Articles
          </button>
          <button
            type="button"
            className={`pet-blog-pill ${activeTab === 'cat' ? 'active' : ''}`}
            onClick={() => setActiveTab('cat')}
          >
            🐱 Cat Care & Toys
          </button>
          <button
            type="button"
            className={`pet-blog-pill ${activeTab === 'dog' ? 'active' : ''}`}
            onClick={() => setActiveTab('dog')}
          >
            🐶 Dog Care & Training
          </button>
        </div>
      </div>

      {displayArticles.length === 0 ? (
        <div className="pet-empty-blog-box" style={{textAlign: 'center', padding: '4rem 1.5rem', background: '#fff', borderRadius: '24px', border: '1.5px solid rgba(61, 123, 93, 0.14)'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--pet-text)'}}>No Blog Posts Found Yet 📰</h2>
          <p style={{color: 'var(--pet-text-muted)', maxWidth: '540px', margin: '0 auto 1.5rem'}}>
            Articles created in Shopify Admin ➔ Online Store ➔ Blog Posts will automatically appear here via Storefront API.
          </p>
          <Link to="/collections/all" className="featured-read-btn">
            Explore Pet Products ➔
          </Link>
        </div>
      ) : (
        <div className="pet-blog-grid">
          {filteredArticles.map((article) => (
            <div className="pet-article-card" key={article.id}>
              <Link to={`/blogs/${article.blog?.handle || blog.handle}/${article.handle}`} className="article-card-img-box">
                {article.image ? (
                  <img src={article.image.url} alt={article.image.altText || article.title} className="article-card-img" />
                ) : (
                  <div className="article-placeholder">🐾</div>
                )}
                <span className="article-card-badge">{article.category || 'Pet Care'}</span>
              </Link>
              <div className="article-card-body">
                <div className="article-meta">
                  <span>⏱️ {article.readTime || '5 min read'}</span>
                  <span>•</span>
                  <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                </div>
                <h3 className="article-card-title">
                  <Link to={`/blogs/${article.blog?.handle || blog.handle}/${article.handle}`}>{article.title}</Link>
                </h3>
                <p className="article-card-excerpt">{article.excerpt || 'Discover practical pet care tips and advice.'}</p>
                <div className="article-card-footer">
                  <span className="article-author">✍️ Contributors</span>
                  <Link to={`/blogs/${article.blog?.handle || blog.handle}/${article.handle}`} className="article-read-link">
                    Read ➔
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
`;

/** @typedef {import('./+types/blogs.$blogHandle._index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
