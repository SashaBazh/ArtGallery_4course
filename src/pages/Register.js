import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Минимум одна буква и одна цифра
    if (password.length < minLength) {
      return 'Пароль должен быть не менее 8 символов.';
    }
    if (!regex.test(password)) {
      return 'Пароль должен содержать минимум одну букву и одну цифру.';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const validationError = validatePassword(newPassword);
    setPasswordError(validationError);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/catalog');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="form-title">Регистрация</h2>
        {error && <p className="form-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="registerName">Имя</label>
          <input
            type="text"
            id="registerName"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="registerEmail">Email</label>
          <input
            type="email"
            id="registerEmail"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="registerPassword">Пароль</label>
          <input
            type="password"
            id="registerPassword"
            placeholder="Введите пароль"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {passwordError && <p className="form-error">{passwordError}</p>}
        </div>
        <button
          type="submit"
          className="form-submit"
          disabled={loading || passwordError.length > 0}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default Register;
