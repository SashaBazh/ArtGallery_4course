import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Пароль должен содержать не менее 8 символов.';
    }
    if (!/[A-Za-z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну букву.';
    }
    if (!/[0-9]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру.';
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);

    // Проверка валидации перед отправкой
    if (!email.includes('@')) {
      setEmailError('Введите корректный email.');
      return;
    }

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate('/catalog');
    } else {
      setEmailError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleLogin}>
        <h2 className="form-title">Вход</h2>
        <div className="form-group">
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            placeholder="Введите email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null); // Убираем ошибку при изменении
            }}
            required
          />
          {emailError && <p className="form-error">{emailError}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="loginPassword">Пароль</label>
          <input
            type="password"
            id="loginPassword"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(null); // Убираем ошибку при изменении
            }}
            required
          />
          {passwordError && <p className="form-error">{passwordError}</p>}
        </div>
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default Login;
