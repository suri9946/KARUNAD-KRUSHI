import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { productApi } from '../../services/productApi';

export default function StageCrops({ active }) {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productApi.getProducts().then(allProducts => {
      if (allProducts && allProducts.length > 0) {
        setProducts(allProducts.slice(0, 4));
      }
    }).catch(err => console.error('Failed to sync StageCrops products:', err));
  }, []);

  return (
    <div style={{
      opacity: active ? 1 : 0, pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 2, padding: '0 10%'
    }}>
      <div style={{ maxWidth: '560px', animation: active ? 'stageFadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-crops)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Phase 07 / Thriving Canopy</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '1.2', marginBottom: '1.5rem' }}>{t('stageCropsTitle')}</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>{t('stageCropsDesc')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {products.map(p => (
            <Link key={p.id} to={`/products/${p.slug}`} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(34, 197, 94, 0.03)', border: '1px solid rgba(34, 197, 94, 0.08)',
              borderRadius: '10px', padding: '0.75rem', textDecoration: 'none', transition: 'var(--transition-fast)'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.2)'; e.currentTarget.style.background = 'rgba(34, 197, 94, 0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.08)'; e.currentTarget.style.background = 'rgba(34, 197, 94, 0.03)'; }}
            >
              <img src={p.main_image_url} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} onError={e => e.target.style.display = 'none'} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: '1.3' }}>{p.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-crops)' }}>View Details →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`@keyframes stageFadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
