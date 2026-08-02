import {useLoaderData, Link} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Pet Care | ${data?.article?.title ?? 'Article'}`}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request, params}) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  let articleData = null;

  try {
    const res = await context.storefront.query(ARTICLE_QUERY, {
      variables: {
        blogHandle,
        articleHandle,
      },
    });
    articleData = res?.blog?.articleByHandle ?? null;
  } catch (e) {
    // Fallback
  }

  if (!articleData) {
    throw new Response(`Article ${articleHandle} not found`, {status: 404});
  }

  return {article: articleData};
}

function loadDeferredData({context}) {
  return {};
}

export default function Article() {
  /** @type {LoaderReturnData} */
  const {article} = useLoaderData();
  const {title, image, contentHtml, author, publishedAt, category} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(publishedAt || Date.now()));

  return (
    <article className="pet-container" style={{paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '840px'}}>
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/blogs/news">Pet Care Blog</Link>
        <span>/</span>
        <span className="current-crumb">{title}</span>
      </nav>

      {/* Article Header */}
      <header className="article-header">
        <span className="article-category-badge">{category || 'Pet Care Guide'}</span>
        <h1 className="article-main-title">{title}</h1>

        <div className="article-author-card">
          <div className="author-avatar">🐾</div>
          <div className="author-details">
            <div className="author-name-text">Contributors: Pet Care Team</div>
            <div className="author-pub-date">Published on {publishedDate} • 5 min read</div>
          </div>
        </div>
      </header>

      {/* Hero Featured Image */}
      {image && (
        <div className="article-hero-img-box">
          <img src={image.url} alt={image.altText || title} className="article-hero-img" />
        </div>
      )}

      {/* Article Body Content */}
      <div
        dangerouslySetInnerHTML={{__html: contentHtml}}
        className="pet-article-content"
      />

      <div className="article-footer-cta">
        <div className="cta-box">
          <h3>Looking for Premium Pet Accessories? 🛍️</h3>
          <p>Explore our top-rated toys, harnesses, beds, and grooming supplies for your beloved dogs & cats.</p>
          <Link to="/collections/all" className="cta-shop-btn">
            Shop All Pet Supplies ➔
          </Link>
        </div>
      </div>
    </article>
  );
}

const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;

/** @typedef {import('./+types/blogs.$blogHandle.$articleHandle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
