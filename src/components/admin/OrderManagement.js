// src/components/admin/OrderManagement.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from '../../api/axiosConfig';
import './Admin_.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/cart/order/history');
      setOrders(response.data);
    } catch (err) {
      setError('Ошибка при загрузке заказов.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/cart/order/${orderId}`);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (err) {
      setError('Ошибка при загрузке деталей заказа.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/cart/order/${orderId}?order_status=${newStatus}`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert('Статус заказа успешно обновлен.');
    } catch (err) {
      alert('Ошибка при обновлении статуса заказа.');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Управление заказами</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>${order.total_price.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => fetchOrderDetails(order.id)}
                    className="me-2"
                  >
                    Подробнее
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => updateOrderStatus(order.id, 'processing')}
                    className="me-2"
                  >
                    В обработке
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                  >
                    Завершить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Детали заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <h5>Клиент: {selectedOrder.user_id}</h5>
              <p>Адрес доставки: {selectedOrder.delivery_address}</p>
              <p>Статус: {selectedOrder.status}</p>
              <h6>Товары:</h6>
              <ul>
                {selectedOrder.items.map((item) => (
                  <li key={item.product_id}>
                    {item.product.name} — {item.quantity} × $
                    {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <h6>Итого: ${selectedOrder.total_price.toFixed(2)}</h6>
            </>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
