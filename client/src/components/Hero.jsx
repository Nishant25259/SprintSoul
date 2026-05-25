import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-glow" />
      <div className="hero-content">
        <h1>SPRINT<span>SOUL</span>.CO</h1>
        <p>Premium sneakers. Built for speed. Worn for soul.</p>
        <a href="#shop" className="btn">Shop Now &nbsp;<i className="fa-solid fa-arrow-right" /></a>
      </div>
    </section>
  );
}
