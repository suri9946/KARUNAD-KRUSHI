import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import useSupabase from '../../hooks/useSupabase';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import Toast from '../../components/ui/Toast';
import Footer from '../../components/Layout/Footer';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  
  const { data: product, loading } = useSupabase(() => productApi.getProductBySlug(slug), [slug]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)', fontFamily: 'var(--font-headers)' }}>
        <div className="pulse" style={{ fontSize: '1.25rem' }}>Loading Product Details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)', fontFamily: 'var(--font-headers)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Product Not Found</h2>
        <Link to="/" className="premium-btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(30, 8%, 8%)', fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)', paddingTop: '100px' }}>
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {/* Back link */}
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', marginBottom: '2.5rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}>
          {/* Product Image */}
          <div style={{ position: 'sticky', top: '110px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={product.main_image_url} alt={product.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-crops)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Karunad Krushi — BioBlend Line</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: '1.2' }}>{product.name}</h1>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>{product.short_description}</p>

            {/* Variant Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.75rem', letterSpacing: '1px' }}>SELECT SIZE</div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {product.variants?.map(v => (
                  <button key={v.sku} onClick={() => setSelectedVariant(v)} style={{
                    padding: '0.5rem 1.2rem', borderRadius: '20px', border: `1px solid ${selectedVariant?.sku === v.sku ? 'var(--color-crops)' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedVariant?.sku === v.sku ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                    color: selectedVariant?.sku === v.sku ? 'var(--color-crops)' : 'var(--color-text-muted)',
                    cursor: 'pointer', fontFamily: 'var(--font-headers)', fontWeight: 500, transition: 'var(--transition-fast)'
                  }}>
                    {v.size} — ₹{v.price.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty Selector + Buy */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '30px', padding: '0.4rem 0.8rem' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>−</button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>+</button>
              </div>
              <button onClick={() => addToCart(product, selectedVariant, qty)} className="premium-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={16} /> {t('buyNow')}
              </button>
            </div>

            {/* Info Tabs */}
            {[
              { key: 'ingredients', label: t('ingredients'), content: product.ingredients?.join(' • ') },
              { key: 'app', label: t('applicationGuide'), content: product.application_guide },
              { key: 'sci', label: t('scientificBacking'), content: product.scientific_backing },
            ].map(sec => (
              <details key={sec.key} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 0' }}>
                <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-headers)', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {sec.label} <span style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>+</span>
                </summary>
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{sec.content}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Footer />
    </div>
  );
}
