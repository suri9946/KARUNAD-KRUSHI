import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import Toast from '../../components/ui/Toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const emptyProduct = { name: '', slug: '', short_description: '', main_image_url: '', ingredients: '', application_guide: '', scientific_backing: '', variants: [] };

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProducts = () => {
    setLoading(true);
    productApi.getProducts()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productApi.deleteProduct(id);
      loadProducts();
      setToast({ message: 'Product deleted', type: 'info' });
    } catch (err) {
      setToast({ message: 'Failed to delete product', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Products</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{products.length} products in database</p>
        </div>
        <button className="premium-btn" onClick={() => navigate('/admin/products/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-headers)' }}>
          <div className="pulse" style={{ fontSize: '1.1rem' }}>Loading Products...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {products.map(p => (
            <div key={p.id} style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ height: '160px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-card-border)' }}>
              <img src={p.main_image_url} alt={p.name} style={{ maxHeight: '130px', maxWidth: '90%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{p.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.short_description}</p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', background: 'rgba(245, 158, 11, 0.07)', border: '1px solid rgba(245, 158, 11, 0.12)', borderRadius: '8px', color: 'var(--color-roots-glow)', cursor: 'pointer', fontFamily: 'var(--font-headers)', fontSize: '0.8rem' }}>
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(p.id)} style={{ padding: '0.6rem 0.8rem', background: 'rgba(239, 68, 68, 0.07)', border: '1px solid rgba(239, 68, 68, 0.12)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
