import React, { useContext, useEffect, useState, useCallback } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

let debounceTimer;

const Cart = () => {
  const { cart, loading, fetchCart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [quantities, setQuantities] = useState({});
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart && cart.items) {
      const initialQuantities = {};
      cart.items.forEach((item) => {
        initialQuantities[item.product_id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const handleQuantityChange = (productId, value) => {
    const newQuantity = Math.max(1, parseInt(value, 10) || 1);
    setQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
    debounceUpdateQuantity(productId, newQuantity);
  };

  const debounceUpdateQuantity = useCallback((productId, quantity) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(async () => {
      setUpdating(true);
      await updateQuantity(productId, quantity);
      await fetchCart();
      setUpdating(false);
    }, 500); // Задержка в 500 мс для оптимизации запросов
  }, []);

  const handleRemoveFromCart = async (productId) => {
    setUpdating(true);
    await removeFromCart(productId);
    await fetchCart();
    setUpdating(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      const quantity = quantities[item.product_id] || item.quantity;
      return total + item.price * quantity;
    }, 0);
  };

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000/api/data/stream?image_path=${encodeURIComponent(imagePath)}`;
  };

  if (loading || updating) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <span>Загрузка корзины...</span>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Ваша корзина пуста.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Ваша корзина</h2>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div className="cart-item" key={item.product_id}>
            <div className="cart-item-image">
              <img
                src={item.product.media && item.product.media.length > 0 ? getImageUrl(item.product.media[0]) : '/placeholder.jpg'}
                alt={item.product_name}
              />
            </div>
            <div className="cart-item-details">
              <h3>{item.product_name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
              <div className="quantity-control">
                <input
                  type="number"
                  min="1"
                  value={quantities[item.product_id] || item.quantity}
                  onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                />
              </div>
              <p className="cart-item-total">
                Итого: ${(item.price * (quantities[item.product_id] || item.quantity)).toFixed(2)}
              </p>
              <button className="remove-btn" onClick={() => handleRemoveFromCart(item.product_id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Общая сумма: ${calculateTotalPrice().toFixed(2)}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
};

export default Cart;
