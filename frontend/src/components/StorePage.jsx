import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function StorePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/products');
      const data = Array.isArray(response.data) ? response.data : [];
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not connect to the server. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    if (!user) {
      toast.error('Please login to add items to your cart!');
      return;
    }
    setCart([...cart, product]);
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getCartTotal = () => cart.reduce((total, item) => total + item.price, 0);

  const checkout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    toast.success(`Thank you for your purchase! Total: ₹${getCartTotal().toFixed(2)}`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="store-page">

      {/* ── Hero Section ── */}
      <div className="hero">
        <div className="hero-content">
          <span className="hero-badge">✦ New Arrivals</span>
          <h1 className="hero-title">
            Discover Products<br />
            <span className="hero-gradient">You'll Love</span>
          </h1>
          <p className="hero-subtitle">
            Curated tech essentials, delivered right to you. Browse our collection and shop with confidence.
          </p>
          {!user && (
            <div className="hero-actions">
              <Link to="/signup" className="hero-cta">Get Started — It's Free</Link>
              <Link to="/login" className="hero-cta-secondary">Login</Link>
            </div>
          )}
        </div>
        <div className="hero-visual">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-blob blob-3" />
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stat"><span>🛍️</span><strong>{products.length}</strong><small>Products</small></div>
        <div className="stat-divider" />
        <div className="stat"><span>⚡</span><strong>Fast</strong><small>Delivery</small></div>
        <div className="stat-divider" />
        <div className="stat"><span>🔒</span><strong>Secure</strong><small>Payments</small></div>
        <div className="stat-divider" />
        <div className="stat"><span>↩️</span><strong>Easy</strong><small>Returns</small></div>
      </div>

      {/* ── Products Section ── */}
      <div className="products-section">
        <div className="section-header">
          <h2>All Products</h2>
          {!user && (
            <p className="login-nudge">
              <Link to="/login">Login</Link> to add items to your cart
            </p>
          )}
        </div>

        {loading && (
          <div className="loading-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="empty-store">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="empty-store">
            <p>No products available yet.</p>
            {user && <p>Visit the <Link to="/admin">Admin page</Link> to add products.</p>}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-img-wrapper">
                  <img src={product.image} alt={product.name} />
                  <div className="product-img-overlay" />
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <div className="product-footer">
                    <span className="price">₹{product.price.toFixed(2)}</span>
                    <button
                      className={`add-to-cart-btn ${!user ? 'locked' : ''}`}
                      onClick={() => addToCart(product)}
                      title={!user ? 'Login to add to cart' : 'Add to Cart'}
                    >
                      {!user ? '🔒 Login to Buy' : '🛒 Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Floating Cart Button ── */}
      {user && cart.length > 0 && (
        <button className="cart-button" onClick={() => setShowCart(!showCart)}>
          🛒 Cart <span className="cart-badge">{cart.length}</span>
        </button>
      )}

      {/* ── Cart Sidebar ── */}
      {showCart && (
        <div className="cart-modal" onClick={(e) => e.target === e.currentTarget && setShowCart(false)}>
          <div className="cart-content">
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <p className="cart-empty">Your cart is empty!</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h5>{item.name}</h5>
                        <span>₹{item.price.toFixed(2)}</span>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(index)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <div className="cart-total-row">
                    <span>Total</span>
                    <strong>₹{getCartTotal().toFixed(2)}</strong>
                  </div>
                  <button className="checkout-btn" onClick={checkout}>
                    Checkout →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StorePage;
