import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import axios from '../api/axiosConfig';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthContext } from '../context/AuthContext';
import './Catalog.css';
import { FaSearch, FaSlidersH } from 'react-icons/fa';

const Catalog = () => {
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/products/category');
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategoryId(response.data[0].id);
      }
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
    }
  };

  const fetchProducts = async (categoryId, search = '') => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/products/category/${categoryId}`, {
        params: { search },
      });
      let data = response.data;

      if (sortType === 'price_asc') {
        data = data.sort((a, b) => a.price - b.price);
      } else if (sortType === 'price_desc') {
        data = data.sort((a, b) => b.price - a.price);
      } else if (sortType === 'name_asc') {
        data = data.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === 'name_desc') {
        data = data.sort((a, b) => b.name.localeCompare(a.name));
      }

      setProducts(data);
    } catch (err) {
      console.error('Ошибка при загрузке продуктов:', err);
      setError('Не удалось загрузить продукты. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchProducts(selectedCategoryId, searchTerm);
    }
  }, [selectedCategoryId, searchTerm, sortType]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(selectedCategoryId, searchTerm);
  };

  return (
    <div className="catalog-page">
      <section className="catalog-hero">
        <Container>
          <Row>
            <Col md={12} data-aos="fade-up">
              <h1 className="text-center">Каталог картин</h1>
              <p className="text-center">Откройте для себя изысканный мир живописи.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Введите название картины..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-icon" onClick={handleSearchSubmit}>
          <FaSearch size={20} />
        </button>
        <button className="settings-icon" onClick={toggleSettings}>
          <FaSlidersH size={20} />
        </button>
      </section>

      <div className={`settings-panel ${isSettingsOpen ? 'active' : ''}`}>
        <h5>Фильтры</h5>
        <select value={selectedCategoryId || ''} onChange={handleCategoryChange}>
          <option value="">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="">Без сортировки</option>
          <option value="price_asc">Цена по возрастанию</option>
          <option value="price_desc">Цена по убыванию</option>
          <option value="name_asc">Название A-Z</option>
          <option value="name_desc">Название Z-A</option>
        </select>
      </div>

      <section className="catalog-products">
        <Container>
          {loading ? (
            <div className="loading-container">
              <Spinner animation="border" role="status" className="loading-spinner" />
              <span className="loading-text">Загрузка...</span>
            </div>
          ) : error ? (
            <Alert variant="danger" className="error-message">
              {error}
            </Alert>
          ) : products.length === 0 ? (
            <Alert variant="info" className="no-products-message">
              Нет доступных картин.
            </Alert>
          ) : (
            <Row>
              {products.map((product) => (
                <Col md={4} lg={3} sm={6} xs={12} key={product.id} className="mb-4" data-aos="zoom-in">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Catalog;
