import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const inCart = cart && cart.items && cart.items.some((item) => item.product_id === product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setQuantity(1);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  const getImageUrl = (imagePath) => {
    return `https://course.excellentjewellery.ru/gallery/api/data/stream?image_path=${encodeURIComponent(imagePath)}`;
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-link">
        {product.media && product.media.length > 0 ? (
          <img
            src={getImageUrl(product.media[0])}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="placeholder-image">Нет изображения</div>
        )}
      </Link>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        {inCart ? (
          <button className="remove-from-cart" onClick={handleRemoveFromCart}>
            Удалить из корзины
          </button>
        ) : (
          <div className="add-to-cart-container">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="quantity-input"
            />
            <button className="add-to-cart" onClick={handleAddToCart}>
              <FaShoppingCart /> Добавить
            </button>
          </div>
        )}
        <Link to={`/products/${product.id}`} className="product-details">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
