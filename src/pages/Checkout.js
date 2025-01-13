import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import './Checkout.css';

const Checkout = () => {
  const { cart, fetchCart, clearCart } = useContext(CartContext);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotalPrice = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post('/cart/order', {
        delivery_address: address,
        email,
      });

      if (response.status === 200) {
        setMessage('Ваш заказ успешно оформлен! С вами скоро свяжется наш менеджер.');
        clearCart();
        setEmail('');
        setAddress('');
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      setError('Не удалось оформить заказ. Попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <p>Ваша корзина пуста.</p>
          <button className="back-to-catalog-btn" onClick={() => navigate('/catalog')}>
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Оформление заказа</h2>
      {message && <div className="checkout-success">{message}</div>}
      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-products">
        <h4>Ваши товары</h4>
        <table className="checkout-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Количество</th>
              <th>Цена</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.product_id}>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="checkout-total">
          Общая сумма: ${calculateTotalPrice().toFixed(2)}
        </div>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Ваш email</label>
          <input
            type="email"
            id="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Адрес доставки</label>
          <input
            type="text"
            id="address"
            placeholder="Введите ваш адрес доставки"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="checkout-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
