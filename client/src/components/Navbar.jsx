import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Sprint<span>Soul</span>.co</Link>

        <ul className="navbar-links">
          <li><a href="/#home">Home</a></li>
          <li><a href="/#shop">Shop</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#footer">Contact</a></li>
        </ul>

        <div className="navbar-actions">
          {user && (
            <button className="cart-btn" onClick={() => navigate('/cart')} aria-label="Cart">
              <i className="fa-solid fa-cart-shopping" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-outline">Admin</Link>
              )}
              <span style={{ color: '#888', fontSize: '0.85rem' }}>Hi, {user.name.split(' ')[0]}</span>
              <button className="btn-primary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <button className="navbar-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </nav>

      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <a href="/#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="/#shop" onClick={() => setMenuOpen(false)}>Shop</a>
        <a href="/#about" onClick={() => setMenuOpen(false)}>About</a>
        {user ? (
          <>
            <a onClick={() => { navigate('/cart'); setMenuOpen(false); }}>Cart ({cartCount})</a>
            {user.role === 'admin' && <a onClick={() => { navigate('/admin'); setMenuOpen(false); }}>Admin</a>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <a onClick={() => { navigate('/login'); setMenuOpen(false); }}>Login</a>
            <a onClick={() => { navigate('/register'); setMenuOpen(false); }}>Sign Up</a>
          </>
        )}
      </div>
    </>
  );
}
