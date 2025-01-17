import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert, Image } from 'react-bootstrap';
import axios from '../../api/axiosConfig';
import './Admin_.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/products/new'); // Замените на правильный эндпоинт
      setProducts(response.data);
    } catch (err) {
      setError('Ошибка при загрузке товаров.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/products/category'); // Замените на правильный эндпоинт
      setCategories(response.data);
    } catch (err) {
      setError('Ошибка при загрузке категорий.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      alert('Ошибка при удалении товара.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const productData = {
      id: currentProduct.id || null, // Передаем id для обновления
      category_id: currentProduct.category_id,
      name: currentProduct.name,
      description: currentProduct.description,
      price: currentProduct.price,
      media: currentProduct.media || [],
    };

    formData.append('product_data', JSON.stringify(productData)); // Формируем JSON для product_data

    if (imageFile) {
      formData.append('files', imageFile);
    }

    try {
      let response;
      if (currentProduct.id) {
        // Обновление
        response = await axios.put('/products/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Локально обновляем список продуктов
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === currentProduct.id ? { ...product, ...currentProduct } : product
          )
        );
      } else {
        // Создание
        response = await axios.post('/products/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Локально добавляем новый продукт в список
        setProducts((prevProducts) => [...prevProducts, response.data]);
      }

      setShowModal(false); // Закрываем модальное окно
    } catch (err) {
      alert('Ошибка при сохранении товара.');
    }
  };

  const getImageUrl = (imagePath) => {
    return `https://course.excellentjewellery.ru/gallery/api/data/stream?image_path=${encodeURIComponent(imagePath)}`;
  };

  const openModal = (product = null) => {
    setCurrentProduct(
      product || { name: '', description: '', price: 0, category_id: '', media: [] }
    );
    setImageFile(null);
    setShowModal(true);
  };

  return (
    <div>
      <h2 className="mb-4">Управление товарами</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Button onClick={() => openModal()} className="mb-3">
            Добавить товар
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Цена</th>
                <th>Категория</th>
                <th>Изображение</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>
                    {
                      categories.find((category) => category.id === product.category_id)
                        ?.name || 'Без категории'
                    }
                  </td>
                  <td>
                    {product.media?.[0] ? (
                      <Image
                        src={getImageUrl(product.media[0])}
                        alt={product.name}
                        thumbnail
                        style={{ maxWidth: '100px' }}
                      />
                    ) : (
                      'Нет изображения'
                    )}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => openModal(product)}
                      className="me-2"
                    >
                      Редактировать
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(product.id)}>
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProduct?.id ? 'Редактировать' : 'Добавить'} товар
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct?.name || ''}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                value={currentProduct?.description || ''}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Цена</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={currentProduct?.price || 0}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, price: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Control
                as="select"
                value={currentProduct?.category_id || ''}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, category_id: e.target.value })
                }
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Изображение</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                accept="image/*"
              />
              {currentProduct?.media?.[0] && (
                <Image
                  src={getImageUrl(currentProduct.media[0])}
                  alt="Предыдущее изображение"
                  thumbnail
                  className="mt-2"
                  style={{ maxWidth: '150px' }}
                />
              )}
            </Form.Group>
            <Button type="submit" variant="primary">
              Сохранить
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductManagement;
