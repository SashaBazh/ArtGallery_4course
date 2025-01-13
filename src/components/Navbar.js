import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // Подключаем внешний CSS файл для кастомных стилей
import { FaBars, FaTimes } from 'react-icons/fa'; // Импорт иконок для бургера

const NavigationBar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="custom-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/assets/images/logo.png" alt="Painting Shop" className="navbar-logo" />
          ArtGallery
        </Link>
        <div className="burger-menu" onClick={toggleMenu}>
          {isOpen ? <FaTimes className="burger-icon" /> : <FaBars className="burger-icon" />}
        </div>
        <nav className={`nav-links ${isOpen ? 'nav-links-active' : ''}`}>
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/about" className="nav-link">О нас</Link>
          <Link to="/catalog" className="nav-link">Каталог</Link>
          {loading ? (
            <div className="nav-spinner">Загрузка...</div>
          ) : user ? (
            <>
              <Link to="/cart" className="nav-link">Корзина</Link>
              <div className="nav-dropdown">
                <span className="nav-dropdown-title">{user.name}</span>
                <div className="nav-dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Профиль</Link>
                  <div onClick={handleLogout} className="dropdown-item">Выйти</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Вход</Link>
              <Link to="/register" className="nav-link">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
