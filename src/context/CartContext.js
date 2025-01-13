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
    if (!user) {
      console.warn('Пользователь не авторизован. Добавление в корзину невозможно.');
      return;
    }
  
    console.log('Попытка добавить товар в корзину:', {
      productId,
      quantity,
      userId: user.id, // предполагается, что user содержит id пользователя
    });
  
    try {
      console.log('Отправка POST-запроса на сервер...');
      const response = await api.post('/cart/', { product_id: productId, quantity });
  
      console.log('Ответ от сервера при добавлении в корзину:', {
        status: response.status,
        data: response.data,
      });
  
      console.log('Обновление корзины после успешного добавления...');
      await fetchCart();
      console.log('Корзина успешно обновлена.');
    } catch (error) {
      if (error.response) {
        console.error('Ошибка сервера при добавлении в корзину:', {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error('Сетевая ошибка при добавлении в корзину. Запрос не был выполнен:', {
          request: error.request,
        });
      } else {
        console.error('Неизвестная ошибка при добавлении в корзину:', {
          message: error.message,
        });
      }
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
