const scrollToShop = (e) => {
  e.preventDefault();
  const el = document.getElementById('shop');
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-glow" />
      <div className="hero-content">
        <h1>SPRINT<span>SOUL</span>.CO</h1>
        <p>Premium sneakers. Built for speed. Worn for soul.</p>
        <button onClick={scrollToShop} className="btn">
          Shop Now &nbsp;<i className="fa-solid fa-arrow-right" />
        </button>
      </div>
    </section>
  );
}
