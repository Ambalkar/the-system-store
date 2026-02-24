import { useState, useEffect } from 'react';
import axios from 'axios';

function StorePage({ darkMode }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const checkout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Thank you for your purchase! Total: ₹${getCartTotal().toFixed(2)}`);
    setCart([]);
    setShowCart(false);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="store-page">
      <h2>Welcome to Our Store</h2>
      
      {products.length === 0 ? (
        <div className="empty-store">
          <p>No products available yet.</p>
          <p>Visit the <a href="/admin">Admin page</a> to add products.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <div className="product-footer">
                  <span className="price">₹{product.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Button */}
      <button 
        className="cart-button" 
        onClick={() => setShowCart(!showCart)}
      >
        🛒 Cart ({cart.length})
      </button>

      {/* Cart Modal */}
      {showCart && (
        <div className="cart-modal">
          <div className="cart-content">
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-btn" onClick={() => setShowCart(false)}>
                ×
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p>Your cart is empty!</p>
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
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <h4>Total: ₹{getCartTotal().toFixed(2)}</h4>
                  <button className="checkout-btn" onClick={checkout}>
                    Checkout
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
