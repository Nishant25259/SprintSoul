import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    const result = await addToCart(product._id);
    setAdding(false);
    setToast(result.success ? '✓ Added to cart!' : result.message);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="product-card">
      <div className="product-card-img">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <p className="cat">{product.category}</p>
        <p className="price">
          <i className="fa-solid fa-indian-rupee-sign" /> {product.price.toLocaleString('en-IN')}
          <span> MRP</span>
        </p>
        <button className="add-cart-btn" onClick={handleAddToCart} disabled={adding}>
          {adding ? 'Adding...' : <><i className="fa-solid fa-cart-plus" /> &nbsp;Add to Cart</>}
        </button>
      </div>
      {toast && <div className="toast success" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}>{toast}</div>}
    </div>
  );
}
