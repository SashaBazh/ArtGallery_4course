// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/cart/');
      setCart(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      setCart({ items: [], total_price: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return;
    try {
      await api.post('/cart/', { product_id: productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await api.delete('/cart/', { params: { product_id: productId } });
      await fetchCart();
    } catch (error) {
      console.error('Ошибка при удалении из корзины:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    try {
      await api.put('/cart/', { product_id: productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Ошибка при обновлении количества:', error);
    }
  };

  const clearCart = async () => {
    if (!cart || !cart.items) return;
    for (let item of cart.items) {
      await removeFromCart(item.product_id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
