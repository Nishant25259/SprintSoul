import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/products')
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Failed to load products. Make sure the server is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="products" id="shop">
      <div className="products-header">
        <h2>TOP <span>TRENDING</span></h2>
        <p>Handpicked favourites — fresh drops, iconic silhouettes.</p>
      </div>
      {loading && <div className="loading-spinner"><i className="fa-solid fa-circle-notch fa-spin" /></div>}
      {error && <p style={{ textAlign: 'center', color: '#e8101a' }}>{error}</p>}
      {!loading && !error && (
        <div className="products-grid">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  );
}
