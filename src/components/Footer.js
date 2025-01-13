import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h5 className="footer-title">ArtGallery</h5>
          <p className="footer-description">
            Онлайн-магазин живописи, где вы найдете уникальные картины для вашего дома или офиса.
          </p>
        </div>
        <div className="footer-column">
          <h5 className="footer-title">Контакты</h5>
          <p>Email: support@artgallery.com</p>
          <p>Телефон: +375 (33) 668-47-69</p>
        </div>
        <div className="footer-column">
          <h5 className="footer-title">Следите за нами</h5>
          <div className="footer-socials">
            <a href="https://facebook.com" className="social-link"><FaFacebookF size={20} /></a>
            <a href="https://instagram.com" className="social-link"><FaInstagram size={20} /></a>
            <a href="https://twitter.com" className="social-link"><FaTwitter size={20} /></a>
            <a href="https://pinterest.com" className="social-link"><FaPinterest size={20} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <small>&copy; {new Date().getFullYear()} ArtGallery. Все права защищены.</small>
      </div>
    </footer>
  );
};

export default Footer;
