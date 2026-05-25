import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, cartLoading, updateQty, removeItem, checkout } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    setCheckingOut(true);
    const result = await checkout();
    setMessage(result.message);
    setCheckingOut(false);
  };

  if (cartLoading) return <div className="loading-spinner" style={{ paddingTop: '100px' }}><i className="fa-solid fa-circle-notch fa-spin" /></div>;

  return (
    <div className="cart-page">
      <h1><i className="fa-solid fa-cart-shopping" /> &nbsp;Your Cart</h1>

      {message && <div className="error-msg" style={{ borderColor: 'rgba(0,200,100,0.4)', color: '#4d4', background: 'rgba(0,200,100,0.1)' }}>{message}</div>}

      {!cart?.items?.length ? (
        <div className="empty-cart">
          <i className="fa-solid fa-bag-shopping" />
          <p>Your cart is empty</p>
          <Link to="/#shop" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Browse Products</Link>
        </div>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item._id} className="cart-item">
              <img className="cart-item-img" src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => removeItem(item._id)} title="Remove">
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          ))}

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p className="total">Total: ₹{cart.total?.toLocaleString('en-IN')}</p>
            <button className="btn" style={{ width: '100%' }} onClick={handleCheckout} disabled={checkingOut}>
              {checkingOut ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
