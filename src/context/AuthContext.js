// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig'; // Используем 'api' вместо 'axiosInstance'

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      const profile = response.data;
      setUser(profile); // Профиль включает роль
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth', { email, password });
      const { access_token, refresh_token, token_type } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('token_type', token_type);

      await fetchUserProfile();
      return { success: true };
    } catch (err) {
      console.error('Ошибка при входе:', err);
      return {
        success: false,
        message: err.response?.data?.detail || 'Вход не удался',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      const { access_token, refresh_token, token_type } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('token_type', token_type);

      await fetchUserProfile();
      return { success: true };
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      return {
        success: false,
        message: err.response?.data?.detail || 'Регистрация не удалась',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
