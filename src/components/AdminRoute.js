// src/components/AdminRoute.js
import React, { useContext, useEffect, useState } from 'react';
import { Navigate} from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig'; // Убедитесь, что путь корректный
import Admin from '../pages/Admin'; // Убедитесь, что путь корректный

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const response = await api.get('/user/profile'); // Проверяем профиль
        const role = response.data?.role?.name || null;
        setIsAdmin(role === 'admin');
      } catch (err) {
        console.error('Ошибка проверки роли администратора:', err);
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (loading || checking) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Проверка доступа...</span>
      </div>
    );
  }

  return isAdmin ? <Admin /> : <Navigate to="/" replace />;
};

export default AdminRoute;
