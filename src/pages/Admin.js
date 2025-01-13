// src/pages/Admin.js
import React, { useState, useEffect } from 'react';
import { Container, Nav, Tab, Spinner, Alert } from 'react-bootstrap';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import OrderManagement from '../components/admin/OrderManagement';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products'); // Вкладка по умолчанию
  const [error, setError] = useState(null);

  // Восстановление сохранённой вкладки при загрузке
  useEffect(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab) {
      setActiveTab(savedTab); // Устанавливаем вкладку из localStorage
    }
  }, []);

  const handleTabChange = (tabKey) => {
    if (!tabKey) return; // Не обновляем, если tabKey пустой
    setActiveTab(tabKey); // Обновляем вкладку в состоянии
    localStorage.setItem('adminActiveTab', tabKey); // Сохраняем вкладку в localStorage
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Админка</h1>
      <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
        {/* Навигация между вкладками */}
        <Nav variant="tabs" className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="products">Товары</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="categories">Категории</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders">Заказы</Nav.Link>
          </Nav.Item>
        </Nav>
        {/* Содержимое вкладок */}
        <Tab.Content>
          <Tab.Pane eventKey="products">
            <ProductManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="categories">
            <CategoryManagement />
          </Tab.Pane>
          <Tab.Pane eventKey="orders">
            <OrderManagement />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Admin;
