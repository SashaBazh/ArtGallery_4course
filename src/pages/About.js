import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './About.css';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero" data-aos="fade-up">
        <div className="about-hero-content">
          <h1>О галерее</h1>
          <p>
            Добро пожаловать в ArtGallery – место, где каждая картина находит своего зрителя.
          </p>
          <Link to="/catalog" className="about-btn">Посмотреть каталог</Link>
        </div>
      </section>

      {/* История магазина */}
      <section className="about-history" data-aos="fade-right">
        <div className="history-content">
          <h2>Наша история</h2>
          <p>
            ArtGallery началась как небольшая студия для художников и коллекционеров в 2015 году. Мы стремимся объединить творцов и ценителей искусства, предлагая уникальные произведения, которые украсят любой дом или офис.
          </p>
        </div>
        <div className="history-image" data-aos="fade-left">
          <img
            src="https://magazineart.art/wp-content/uploads/img_5359.jpeg"
            alt="История галереи"
          />
        </div>
      </section>

      {/* Наши ценности */}
      <section className="about-values">
        <h2 data-aos="fade-up">Наши ценности</h2>
        <div className="values-container">
          <div className="value-card" data-aos="fade-up" data-aos-delay="100">
            <h3>Уникальность</h3>
            <p>Каждая картина – это оригинальное произведение искусства.</p>
          </div>
          <div className="value-card" data-aos="fade-up" data-aos-delay="200">
            <h3>Качество</h3>
            <p>Мы предоставляем только лучшие работы от проверенных художников.</p>
          </div>
          <div className="value-card" data-aos="fade-up" data-aos-delay="300">
            <h3>Доступность</h3>
            <p>Цены, которые подойдут как коллекционерам, так и любителям.</p>
          </div>
        </div>
      </section>

      {/* Художники */}
      <section className="about-artists">
        <h2 data-aos="fade-up">Наши художники</h2>
        <div className="artists-gallery">
          <div className="artist-card" data-aos="zoom-in">
            <img
              src="/assets/images/2.png"
              alt="Художник 1"
            />
            <h3>Ирина Смирнова</h3>
            <p>Мастер абстрактной живописи</p>
          </div>
          <div className="artist-card" data-aos="zoom-in" data-aos-delay="100">
            <img
              src="/assets/images/1.png"
              alt="Художник 2"
            />
            <h3>Алексей Кузнецов</h3>
            <p>Пейзажист и реалист</p>
          </div>
          <div className="artist-card" data-aos="zoom-in" data-aos-delay="200">
            <img
              src="/assets/images/3.png"
              alt="Художник 3"
            />
            <h3>Мария Иванова</h3>
            <p>Модерн и экспрессионизм</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta" data-aos="fade-up">
        <h2>Готовы найти свою картину?</h2>
        <p>Ознакомьтесь с каталогом и выберите произведение искусства, которое идеально дополнит ваш интерьер.</p>
        <Link to="/catalog" className="cta-btn">Перейти в каталог</Link>
      </section>
    </div>
  );
};

export default About;
