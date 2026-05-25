import Hero from '../components/Hero';
import ShopNow from '../components/ShopNow';
import Products from '../components/Products';
import Offer from '../components/Offer';
import About from '../components/About';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main style={{ paddingTop: '70px' }}>
      <Hero />
      <ShopNow />
      <Products />
      <Offer />
      <About />
      <Footer />
    </main>
  );
}
