const sections = [
  { img: '/shoes/pexels-mnzoutfits-1598505.jpg', reverse: false },
  { img: '/shoes/pexels-jddaniel-2385477.jpg', reverse: true },
  { img: '/shoes/pexels-craytive-1478442.jpg', reverse: false },
];

const scrollToShop = (e) => {
  e.preventDefault();
  const el = document.getElementById('shop');
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

export default function ShopNow() {
  return (
    <>
      {sections.map((s, i) => (
        <section key={i} className={`shopnow ${s.reverse ? 'reverse' : ''}`}>
          <div className="shopnow-content">
            <span className="tag">NEW ARRIVALS</span>
            <h2><span>New Sneakers!</span><br />are here Now!</h2>
            <p>Presenting the best sneakers from around the world — crafted for performance, designed for style.</p>
            <button onClick={scrollToShop} className="btn">
              Shop Now &nbsp;<i className="fa-solid fa-arrow-right" />
            </button>
          </div>
          <div className="shopnow-img">
            <img src={s.img} alt="sneaker lifestyle" loading="lazy" />
          </div>
        </section>
      ))}
    </>
  );
}

