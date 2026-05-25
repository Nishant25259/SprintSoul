import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      setCartLoading(true);
      const { data } = await axios.get('/api/cart');
      setCart(data);
    } catch {
      // ignore — user might not be logged in
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, qty = 1) => {
    try {
      const { data } = await axios.post('/api/cart', { productId, qty });
      setCart(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateQty = async (itemId, qty) => {
    try {
      const { data } = await axios.put(`/api/cart/${itemId}`, { qty });
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await axios.delete(`/api/cart/${itemId}`);
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkout = async () => {
    try {
      const { data } = await axios.post('/api/cart/checkout');
      setCart({ items: [], total: 0 });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Checkout failed' };
    }
  };

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.qty, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, cartLoading, cartCount, addToCart, updateQty, removeItem, checkout, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
