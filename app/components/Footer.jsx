import {Suspense, useState} from 'react';
import {Await, NavLink, Link} from 'react-router';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  }

  const storeDomain = publicStoreDomain || 'petcare.com';

  return (
    <footer className="pet-footer">
      <div className="pet-container">
        {/* Main 4-Column Footer Grid */}
        <div className="pet-footer-grid">
          {/* Column 1: Brand, Social Proof & Contact Info */}
          <div className="pet-footer-col">
            <Link to="/" className="pet-footer-logo">
              <div className="footer-logo-badge">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 10c-2.2 0-4 1.8-4 4 0 2.5 2.5 4.5 4 6.2 1.5-1.7 4-3.7 4-6.2 0-2.2-1.8-4-4-4zm-5.5-2.5C5.1 7.5 4 8.6 4 10s1.1 2.5 2.5 2.5S9 11.4 9 10s-1.1-2.5-2.5-2.5zm11 0C16.1 7.5 15 8.6 15 10s1.1 2.5 2.5 2.5S20 11.4 20 10s-1.1-2.5-2.5-2.5zM4 14.5C3.2 14.5 2.5 15.2 2.5 16s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zm16 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z"/>
                </svg>
              </div>
              <span className="footer-logo-text">Pet Care</span>
            </Link>

            {/* Social Proof Line */}
            <div className="pet-footer-social-proof">
              <span>⭐ Trusted by 10,000+ Pet Owners Worldwide</span>
            </div>

            <p className="pet-footer-desc">
              Premium pet supplies & interactive toys for dogs and cats. Crafted with love, durability, and safety for your beloved companions.
            </p>
            <ul className="pet-footer-contact-list">
              <li>🌐 <span>Reliable Worldwide Shipping (7-15 Business Days)</span></li>
              <li>📞 <span>Customer Service: <strong>+1 (800) 555-0199</strong></span></li>
              <li>✉️ <span>Email: support@{storeDomain}</span></li>
              <li>📍 <span>New York, NY, United States</span></li>
            </ul>
          </div>

          {/* Column 2: Shop Categories */}
          <div className="pet-footer-col">
            <h4 className="pet-footer-heading">Shop Categories</h4>
            <ul className="pet-footer-links">
              <li><Link to="/collections/dog-toys">Dog Toys</Link></li>
              <li><Link to="/collections/cat-toys">Cat Toys</Link></li>
              <li><Link to="/collections/collars-leashes-harnesses">Collars, Leashes & Harnesses</Link></li>
              <li><Link to="/collections/pet-beds-mats">Pet Beds & Mats</Link></li>
              <li><Link to="/collections/pet-costumes-apparel">Pet Costumes & Apparel</Link></li>
              <li><Link to="/collections/grooming-health-care">Grooming & Health Care</Link></li>
              <li><Link to="/collections/new-arrivals">New Arrivals 🔥</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policy Links */}
          <div className="pet-footer-col">
            <h4 className="pet-footer-heading">Customer Care</h4>
            <ul className="pet-footer-links">
              <li><Link to="/account/orders">Track Your Order</Link></li>
              <li><Link to="/policies/refund-policy">Return & Refund Policy</Link></li>
              <li><Link to="/policies/refund-policy">30-Day Money-Back Guarantee</Link></li>
              <li><Link to="/pages/about">Contact Us / FAQ</Link></li>
              <li><Link to="/policies/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/policies/terms-of-service">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & SVG Payment Badges */}
          <div className="pet-footer-col">
            <h4 className="pet-footer-heading">Get 10% Off</h4>
            <p className="pet-footer-subtext">Subscribe for VIP pet perks, new arrivals, and instant discount codes!</p>
            {subscribed ? (
              <div className="newsletter-success">
                🎉 Thank you! Your <strong>PET10OFF</strong> coupon code has been sent to your email.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="pet-newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
            )}

            <div className="pet-payment-methods">
              <span className="payment-heading">Guaranteed Safe Checkout:</span>
              <div className="payment-badges-svg">
                {/* Apple Pay SVG */}
                <div className="payment-svg-card" title="Apple Pay">
                  <svg viewBox="0 0 38 24" width="38" height="24">
                    <rect width="38" height="24" rx="4" fill="#FFFFFF"/>
                    <path fill="#000" d="M12.8 11.4c0-1.1.9-1.6 1.4-1.9-.6-.9-1.6-1-1.9-1-.8-.1-1.6.5-2 .5-.4 0-1.1-.5-1.8-.5-.9 0-1.8.5-2.2 1.4-1 1.7-.2 4.1.7 5.5.5.7 1 1.4 1.7 1.4.7 0 1-.4 1.8-.4.8 0 1 .4 1.8.4.7 0 1.2-.7 1.7-1.3.5-.8.7-1.5.7-1.5-.1 0-1.5-.6-1.5-2.1zM11.4 7.8c.4-.5.6-1.1.6-1.7-.6 0-1.2.4-1.6.8-.4.4-.7 1.1-.6 1.7.6.1 1.2-.3 1.6-.8z"/>
                    <text x="16.5" y="15" fill="#000" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif">Pay</text>
                  </svg>
                </div>
                {/* Google Pay SVG */}
                <div className="payment-svg-card" title="Google Pay">
                  <svg viewBox="0 0 38 24" width="38" height="24">
                    <rect width="38" height="24" rx="4" fill="#FFFFFF"/>
                    <path fill="#4285F4" d="M13 12.5v-2h6.5c.1.4.2.8.2 1.3 0 1.6-.4 3.6-1.8 5-1.3 1.4-3 2.2-5.4 2.2-4.4 0-8-3.6-8-8s3.6-8 8-8c2.4 0 4.2.9 5.5 2.2l-1.5 1.5c-.9-.9-2.2-1.6-4-1.6-3.2 0-5.8 2.6-5.8 5.8s2.6 5.8 5.8 5.8c2.1 0 3.3-.8 4.1-1.6.6-.6 1-1.5 1.2-2.8H13z"/>
                    <text x="21" y="15" fill="#5F6368" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif">Pay</text>
                  </svg>
                </div>
                {/* PayPal SVG */}
                <div className="payment-svg-card" title="PayPal">
                  <svg viewBox="0 0 38 24" width="38" height="24">
                    <rect width="38" height="24" rx="4" fill="#FFFFFF"/>
                    <path fill="#003087" d="M11 6h4.8c1.6 0 2.8.3 3.4 1 .6.6.8 1.5.5 2.7-.4 1.9-1.5 3.1-3.3 3.7-.6.2-1.3.3-2.1.3H13.2l-.7 4.3h-2.5L11 6z"/>
                    <path fill="#0079C1" d="M13.5 9h4.3c.9 0 1.6.2 2 .7.4.4.5 1 .3 1.9-.3 1.4-1.1 2.3-2.3 2.7-.4.1-.9.2-1.5.2h-2.1l-.7 4.5h-2.2L13.5 9z"/>
                  </svg>
                </div>
                {/* Visa SVG */}
                <div className="payment-svg-card" title="Visa">
                  <svg viewBox="0 0 38 24" width="38" height="24">
                    <rect width="38" height="24" rx="4" fill="#FFFFFF"/>
                    <path fill="#1A1F71" d="M15.2 16.5l1.6-10h2.6l-1.6 10h-2.6zm8.8-9.8c-.5-.2-1.3-.4-2.3-.4-2.5 0-4.3 1.3-4.3 3.2 0 1.4 1.3 2.2 2.2 2.7.9.5 1.3.8 1.3 1.2 0 .6-.8.9-1.5.9-1 0-1.5-.2-2.3-.5l-.3-.2-.4 2.4c.7.3 1.9.6 3.1.6 2.7 0 4.4-1.3 4.4-3.3 0-1.1-.7-1.9-2.1-2.6-.9-.4-1.4-.7-1.4-1.2 0-.4.5-.8 1.4-.8.8 0 1.4.2 1.9.4l.2.1.4-2.3zm6.3-.2h-2c-.6 0-1.1.2-1.3.7l-3.8 9.3h2.7l.5-1.5h3.4l.3 1.5h2.4l-2.1-10zm-1.8 6.3l1.4-3.8.8 3.8h-2.2zm-18-6.3l-2.5 6.8-.3-1.4c-.5-1.7-2.1-3.6-3.9-4.5l2.5 9.1h2.7l4-10h-2.5z"/>
                  </svg>
                </div>
                {/* Mastercard SVG */}
                <div className="payment-svg-card" title="Mastercard">
                  <svg viewBox="0 0 38 24" width="38" height="24">
                    <rect width="38" height="24" rx="4" fill="#FFFFFF"/>
                    <circle cx="15" cy="12" r="6" fill="#EB001B"/>
                    <circle cx="23" cy="12" r="6" fill="#F79E1B"/>
                    <path fill="#FF5F00" d="M19 7.8A5.96 5.96 0 0 0 16.6 12 5.96 5.96 0 0 0 19 16.2 5.96 5.96 0 0 0 21.4 12 5.96 5.96 0 0 0 19 7.8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pet-footer-bottom">
          <p>© {new Date().getFullYear()} <strong>Pet Care Store</strong>. All Rights Reserved. Crafted with love for pets worldwide 🐾</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
