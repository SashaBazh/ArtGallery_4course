import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Image, Spinner, Alert, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const inCart = cart && cart.items && cart.items.some(item => item.product_id === parseInt(id, 10));

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/products/${id}`);
      if (!response.data || response.status !== 200) {
        throw new Error('Продукт не найден');
      }
      setProduct(response.data);
    } catch (err) {
      setError('Не удалось загрузить продукт. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    return `http://localhost:8000/api/data/stream?image_path=${encodeURIComponent(imagePath)}`;
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setQuantity(1);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading-spinner"></span>
        <p>Загрузка продукта...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-message">
        <p>Продукт не найден.</p>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <section className="product-hero">
        <div className="product-hero-content">
  
        </div>
      </section>

      <section className="product-details">
        <Container>
          <Row>
            <Col md={6} className="product-image-wrapper">
              {product.media && product.media.length > 0 ? (
                <img
                  src={getImageUrl(product.media[0])}
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="placeholder-image">Нет изображения</div>
              )}
            </Col>
            <Col md={6} className="product-info-wrapper">
              <h2>{product.name}</h2>
              <h4 className="product-price">${product.price.toFixed(2)}</h4>
              <p className="product-description">{product.description}</p>

              {inCart ? (
                <Button className="add-cart-button" onClick={handleRemoveFromCart}>
                   <FaShoppingCart /> Удалить из корзины
                </Button>
              ) : (
                <InputGroup className="quantity-input-group">
                  <FormControl
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  />
                  <Button className="add-cart-button" onClick={handleAddToCart}>
                    <FaShoppingCart /> Добавить в корзину
                  </Button>
                </InputGroup>
              )}

              {!user && (
                <p className="login-prompt">
                  Пожалуйста, <a href="/login">войдите</a>, чтобы добавлять товары в корзину.
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ProductDetail;
