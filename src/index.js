// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Импорт Bootstrap Icons
import 'aos/dist/aos.css'; // Импорт стилей AOS
import './index.css'; // Ваши собственные стили
import CartProvider from './context/CartContext';

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("Не удалось найти элемент с id 'root'");
}
