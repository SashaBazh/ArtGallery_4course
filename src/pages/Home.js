import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-up">
        <div className="hero-content">
          <h1>Погрузитесь в мир живописи</h1>
          <p>Выберите уникальное произведение искусства для вашего интерьера.</p>
          <Link to="/catalog" className="hero-button">
            Перейти в каталог
          </Link>
        </div>
        <div className="hero-image" data-aos="fade-left"></div>
      </section>

      {/* Featured Paintings */}
      <section className="featured-section">
        <h2 data-aos="fade-up">Популярные картины</h2>
        <div className="featured-gallery">
          <div className="painting-card" data-aos="zoom-in">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Rubens-Lady.of.the.Chamber.to.Infanta.Isabella.jpg/250px-Rubens-Lady.of.the.Chamber.to.Infanta.Isabella.jpg"
              alt="Картина 1"
            />
            <h3>Портрет камеристки инфанты Изабеллы</h3>
            <p>Автор: Питер Пауль Рубенс</p>
          </div>
          <div className="painting-card" data-aos="zoom-in" data-aos-delay="100">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm19gC2BlXW1zibvYZF3bMGZWikKvlA7mpUw&s"
              alt="Картина 2"
            />
            <h3>Птица</h3>
            <p>Автор: Родригес Хосе</p>
          </div>
          <div className="painting-card" data-aos="zoom-in" data-aos-delay="200">
            <img
              src="https://ir-3.ozone.ru/s3/multimedia-9/c1000/6098433261.jpg"
              alt="Картина 3"
            />
            <h3>Крик</h3>
            <p>Автор: Эдвард Мунк</p>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="why-us-section">
        <h2 data-aos="fade-up">Почему выбирают нас</h2>
        <div className="advantages">
          <div className="advantage" data-aos="fade-right">
            <h3>Уникальные произведения</h3>
            <p>Каждая картина создается профессиональными художниками.</p>
          </div>
          <div className="advantage" data-aos="fade-up" data-aos-delay="100">
            <h3>Широкий выбор</h3>
            <p>Картины разных стилей и направлений на любой вкус.</p>
          </div>
          <div className="advantage" data-aos="fade-left" data-aos-delay="200">
            <h3>Гибкие условия доставки</h3>
            <p>Быстрая доставка в любой регион страны.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" data-aos="fade-up">
        <div className="cta-content">
          <h2>Украсьте свой дом произведением искусства</h2>
          <p>Выберите картину и создайте неповторимую атмосферу.</p>
          <Link to="/catalog" className="cta-button">Перейти в каталог</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
