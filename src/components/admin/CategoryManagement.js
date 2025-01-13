import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import axios from '../../api/axiosConfig';
import './Admin_.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/products/category');
      setCategories(response.data);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
      setError('Ошибка при загрузке категорий.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { id, name, description } = currentCategory;

    try {
      if (id) {
        // Редактирование категории
        const formData = new FormData();
        formData.append(
          'category_data',
          JSON.stringify({ id, name, description })
        );
        await axios.put('/products/categories', formData);

        // Перезагружаем категории из API
        await fetchCategories();
      } else {
        // Создание новой категории
        const formData = new FormData();
        formData.append(
          'category_data',
          JSON.stringify({ name, description })
        );
        await axios.post('/products/categories', formData);

        // Перезагружаем категории из API
        await fetchCategories();
      }
      setShowModal(false);
    } catch (err) {
      console.error('Ошибка при сохранении категории:', err);
      alert('Ошибка при сохранении категории.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/categories/${id}`);
      // Перезагружаем категории из API
      await fetchCategories();
    } catch (err) {
      console.error('Ошибка удаления категории:', err);
      alert('Ошибка при удалении категории.');
    }
  };

  const openModal = (category = null) => {
    setCurrentCategory(category || { name: '', description: '' });
    setShowModal(true);
  };

  return (
    <div>
      <h2 className="mb-4">Управление категориями</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <Button onClick={() => openModal()} className="mb-3">
            Добавить категорию
          </Button>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => openModal(category)}
                        className="me-2"
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(category.id)}
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Категории не найдены.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCategory?.id ? 'Редактировать' : 'Добавить'} категорию
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                value={currentCategory?.name || ''}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    name: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                value={currentCategory?.description || ''}
                onChange={(e) =>
                  setCurrentCategory({
                    ...currentCategory,
                    description: e.target.value,
                  })
                }
              />
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

export default CategoryManagement;
