import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import CheckoutForm from './CheckoutForm';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Slide-out Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        maxWidth: '450px',
        height: '100vh',
        backgroundColor: 'hsl(30, 8%, 10%)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text-primary)',
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--color-crops)' }} />
            <h3 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.2rem', fontWeight: 650 }}>
              Your Cart ({cartCount})
            </h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: '1rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center'
            }}>
              <ShoppingBag size={48} style={{ opacity: 0.2 }} />
              <p style={{ fontSize: '0.95rem' }}>Your shopping cart is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="premium-btn-secondary"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '1rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                alignItems: 'center'
              }}>
                {/* Product Image */}
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <img 
                    src={item.mainImageUrl} 
                    alt={item.name} 
                    style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem', lineHeight: '1.3' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-crops)', fontWeight: 500, marginBottom: '0.5rem' }}>
                    Size: {item.size}
                  </div>
                  
                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '15px',
                      padding: '0.15rem 0.6rem'
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.variantSku, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px' }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '0.8rem', minWidth: '18px', textAlign: 'center', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price and Remove */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.variantSku)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-crisis)',
                      opacity: 0.6,
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                      padding: '4px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Subtotal</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 750, color: 'var(--color-crops)' }}>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              Shipping and taxes calculated at checkout. Real-time organic stock reservation.
            </p>
            <button 
              onClick={() => setShowCheckout(true)}
              className="premium-btn" 
              style={{ width: '100%', gap: '0.75rem', padding: '0.9rem' }}
            >
              <CreditCard size={18} /> Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* Checkout Wizard Overlay */}
      {showCheckout && (
        <CheckoutForm 
          isOpen={showCheckout} 
          onClose={() => setShowCheckout(false)} 
        />
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
