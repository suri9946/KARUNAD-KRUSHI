import React from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import useSupabase from '../../hooks/useSupabase';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductListSection() {
  const { data: products = [], loading } = useSupabase(() => productApi.getProducts(), []);
  const activeProducts = (products || []).filter(p => p.is_active);
  const { addToCart } = useCart();

  const handleQuickAdd = (e, prod) => {
    e.preventDefault();
    e.stopPropagation();
    if (prod.variants && prod.variants.length > 0) {
      addToCart(prod, prod.variants[0], 1);
    }
  };

  return (
    <section style={{
      backgroundColor: 'hsl(30, 8%, 6%)',
      padding: '100px 0',
      position: 'relative',
      zIndex: 5,
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      fontFamily: 'var(--font-body)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-crops)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>E-Commerce Catalog</div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3.2vw, 3rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            Shop Our Proprietary Formulations
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-muted)',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            Restore biological functionality and lock in nutrient pathways. Buy direct from our regional distribution hub.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-headers)' }}>
              <div className="pulse" style={{ fontSize: '1.1rem', letterSpacing: '1px' }}>Loading Dynamic Catalog...</div>
            </div>
          ) : activeProducts.map(prod => {
            const defaultVariant = prod.variants?.[0];
            const startPrice = defaultVariant ? defaultVariant.price : 0;
            const startSize = defaultVariant ? defaultVariant.size : '';

            return (
              <div 
                key={prod.id} 
                style={{
                  background: 'var(--color-card-bg)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--color-card-border)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  transition: 'var(--transition-smooth)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="product-card-hover"
              >
                {/* Product Image Area */}
                <Link to={`/products/${prod.slug}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  padding: '2.5rem 1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  aspectRatio: '1.2',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={prod.main_image_url} 
                    alt={prod.name} 
                    style={{
                      width: '75%',
                      height: '75%',
                      objectFit: 'contain',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} 
                    className="prod-card-image"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(5,5,5,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '0.7rem',
                    fontWeight: 655,
                    color: 'var(--color-crops)',
                    backdropFilter: 'blur(4px)'
                  }}>
                    IN STOCK
                  </div>
                </Link>

                {/* Details Content */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-headers)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem',
                      lineHeight: '1.3'
                    }}>
                      {prod.name}
                    </h3>
                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: '1.5',
                      marginBottom: '1.5rem',
                      height: '4.5em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {prod.short_description}
                    </p>
                  </div>

                  <div>
                    {/* Price and variant sizing */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '1.5rem',
                      borderTop: '1px solid rgba(255,255,255,0.03)',
                      paddingTop: '1rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Starts at ({startSize})
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-crops)' }}>
                        ₹{startPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <Link 
                        to={`/products/${prod.slug}`} 
                        className="premium-btn-secondary" 
                        style={{ padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px', gap: '0.4rem' }}
                      >
                        <Eye size={14} /> View Details
                      </Link>
                      <button 
                        onClick={(e) => handleQuickAdd(e, prod)}
                        className="premium-btn" 
                        style={{ padding: '0.6rem', fontSize: '0.85rem', borderRadius: '12px', gap: '0.4rem' }}
                      >
                        <ShoppingCart size={14} /> Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .product-card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }
        .product-card-hover:hover .prod-card-image {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
