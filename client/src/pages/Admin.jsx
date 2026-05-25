import { useEffect, useState } from 'react';
import axios from 'axios';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: '', category: '', price: '', image: '', description: '', stock: 100 });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      if (product?._id) {
        await axios.put(`/api/products/${product._id}`, form);
      } else {
        await axios.post('/api/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
      }
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{product?._id ? 'Edit Product' : 'Add New Product'}</h3>
        <form onSubmit={handleSubmit}>
          {['name', 'category', 'image', 'description'].map(f => (
            <div className="form-group" key={f}>
              <label style={{ textTransform: 'capitalize' }}>{f}</label>
              <input name={f} value={form[f]} onChange={handleChange} required={f !== 'description'} placeholder={f} />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Price (₹)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | product object
  const [loading, setLoading] = useState(false);

  const fetchStats = () => axios.get('/api/admin/stats').then(r => setStats(r.data));
  const fetchProducts = () => axios.get('/api/products').then(r => setProducts(r.data));
  const fetchOrders = () => axios.get('/api/admin/orders').then(r => setOrders(r.data));
  const fetchUsers = () => axios.get('/api/admin/users').then(r => setUsers(r.data));

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (tab === 'products') fetchProducts();
    if (tab === 'orders') fetchOrders();
    if (tab === 'users') fetchUsers();
  }, [tab]);

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await axios.patch(`/api/admin/orders/${orderId}`, { status });
    fetchOrders();
  };

  const handleModalSave = () => { setModal(null); fetchProducts(); };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙ Admin Panel</h1>
        <button className="btn" onClick={() => setModal('add')}>+ Add Product</button>
      </div>

      <div className="admin-tabs">
        {['dashboard', 'products', 'orders', 'users'].map(t => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tab === 'dashboard' && stats && (
        <div className="stats-grid">
          <div className="stat-card red"><div className="stat-label">Total Orders</div><div className="stat-value">{stats.totalOrders}</div></div>
          <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">{stats.totalUsers}</div></div>
          <div className="stat-card red"><div className="stat-label">Revenue (₹)</div><div className="stat-value">{stats.revenue?.toLocaleString('en-IN')}</div></div>
          <div className="stat-card"><div className="stat-label">Pending Orders</div><div className="stat-value">{stats.pendingOrders}</div></div>
        </div>
      )}

      {/* Products */}
      {tab === 'products' && (
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><img src={p.image} alt={p.name} style={{ width: 50, height: 50, objectFit: 'contain', background: '#111', borderRadius: 4 }} /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price?.toLocaleString('en-IN')}</td>
                <td>{p.stock}</td>
                <td>
                  <button className="action-btn" onClick={() => setModal(p)}><i className="fa-solid fa-pen" /></button>
                  <button className="action-btn" onClick={() => handleDeleteProduct(p._id)}><i className="fa-solid fa-trash" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Orders */}
      {tab === 'orders' && (
        <table className="admin-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Items</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td style={{ fontSize: '0.75rem', color: '#555' }}>{o._id}</td>
                <td>{o.user?.name}<br /><span style={{ color: '#555', fontSize: '0.8rem' }}>{o.user?.email}</span></td>
                <td>₹{o.total?.toLocaleString('en-IN')}</td>
                <td>{o.items?.length} items</td>
                <td>
                  <select
                    value={o.status}
                    onChange={e => handleStatusChange(o._id, e.target.value)}
                    style={{ background: '#111', color: '#fff', border: '1px solid #333', borderRadius: 6, padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Users */}
      {tab === 'users' && (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`status-badge ${u.role === 'admin' ? 'status-shipped' : 'status-delivered'}`}>{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
