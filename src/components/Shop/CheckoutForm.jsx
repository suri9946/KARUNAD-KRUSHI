import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { orderApi } from '../../services/orderApi';
import { X, CheckCircle, CreditCard, Shield, Truck, Sparkles, Loader } from 'lucide-react';
import Toast from '../ui/Toast';

export default function CheckoutForm({ isOpen, onClose }) {
  const { cartItems, cartTotal, clearCart, setIsCartOpen } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Processing, 4: Invoice
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });
  const [paymentType, setPaymentType] = useState('card'); // card, upi
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [processingText, setProcessingText] = useState('Initiating transaction...');
  const [orderInvoice, setOrderInvoice] = useState(null);
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.zip) {
        setToast({ message: 'Please fill in all shipping details.', type: 'error' });
        return;
      }
      setStep(2);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentType === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      setToast({ message: 'Please enter card information.', type: 'error' });
      return;
    }
    if (paymentType === 'upi' && !upiId) {
      setToast({ message: 'Please enter UPI ID.', type: 'error' });
      return;
    }

    // Proceed to loading state
    setStep(3);
    runSimulatedPayment();
  };

  const runSimulatedPayment = () => {
    const states = [
      { text: 'Securing gateway connection...', time: 1000 },
      { text: 'Processing credentials with bank networks...', time: 1200 },
      { text: 'Verifying stock and biological allocation...', time: 1000 },
      { text: 'Logging invoice ledger details...', time: 800 }
    ];

    let current = 0;
    const runNext = () => {
      if (current < states.length) {
        setProcessingText(states[current].text);
        setTimeout(() => {
          current++;
          runNext();
        }, states[current].time);
      } else {
        // Complete the order after simulations finish
        const orderData = {
          customer: form,
          items: cartItems,
          total: cartTotal,
          payment: {
            method: paymentType
          }
        };

        orderApi.saveOrder(orderData).then(createdOrder => {
          setOrderInvoice(createdOrder);
          clearCart(); // Clear cart items
          setStep(4);
        }).catch(err => {
          console.error('Order placement error:', err);
          setToast({ message: 'Transaction logging failed. Please retry.', type: 'error' });
          setStep(2);
        });
      }
    };

    runNext();
  };

  const closeAndFinish = () => {
    setIsCartOpen(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 11000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-body)'
    }}>
      <div style={{
        backgroundColor: 'hsl(30, 8%, 10%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Close Button */}
        {step !== 3 && step !== 4 && (
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>
        )}

        {/* Wizard Headers */}
        <div style={{ padding: '2rem 2rem 1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {step === 1 && <h2 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.4rem', fontWeight: 700 }}>Shipping & Delivery Details</h2>}
          {step === 2 && <h2 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.4rem', fontWeight: 700 }}>Secure Payment Simulation</h2>}
          {step === 3 && <h2 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.4rem', fontWeight: 700, textAlign: 'center' }}>Processing Transaction</h2>}
          {step === 4 && <h2 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.4rem', fontWeight: 700, textAlign: 'center', color: 'var(--color-crops)' }}>Order Placed Successfully!</h2>}

          {/* Progress Indicators */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: step >= s ? 'var(--color-crops)' : 'rgba(255,255,255,0.08)',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Wizard Body */}
        <div style={{ padding: '2rem', flex: 1 }}>
          
          {/* STEP 1: SHIPPING FORM */}
          {step === 1 && (
            <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Phone Number *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Delivery Address *</label>
                <textarea 
                  required 
                  rows={2} 
                  value={form.address} 
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', resize: 'none' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>City *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.city} 
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>State *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Karnataka"
                    value={form.state} 
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Zip Code *</label>
                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={form.zip} 
                    onChange={e => setForm({ ...form, zip: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.5rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Total Amount</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 750, color: 'var(--color-crops)' }}>₹{cartTotal.toLocaleString('en-IN')}</div>
                </div>
                <button type="submit" className="premium-btn" style={{ padding: '0.75rem 2.25rem' }}>
                  Proceed to Payment
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setPaymentType('card')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `1px solid ${paymentType === 'card' ? 'var(--color-crops)' : 'rgba(255,255,255,0.08)'}`,
                    background: paymentType === 'card' ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                    color: paymentType === 'card' ? 'var(--color-crops)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <CreditCard size={20} />
                  Credit / Debit Card
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentType('upi')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `1px solid ${paymentType === 'upi' ? 'var(--color-crops)' : 'rgba(255,255,255,0.08)'}`,
                    background: paymentType === 'upi' ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                    color: paymentType === 'upi' ? 'var(--color-crops)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <Sparkles size={20} />
                  Instant UPI
                </button>
              </div>

              {/* CARD DETAILS FORM */}
              {paymentType === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.3s ease' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Card Number</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="4111 2222 3333 4444"
                      maxLength={16}
                      value={cardDetails.number}
                      onChange={e => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '') })}
                      style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>Expiry Date</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CVV</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="***"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI ID INPUT */}
              {paymentType === 'upi' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.3s ease' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>UPI ID (VPA)</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="username@okaxis"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none' }} 
                    />
                  </div>
                </div>
              )}

              {/* Security Badging */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: 'rgba(34, 197, 94, 0.03)',
                border: '1px solid rgba(34, 197, 94, 0.08)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)'
              }}>
                <Shield size={16} style={{ color: 'var(--color-crops)' }} />
                <span>Secured 256-bit encryption. Safe organic agricultural transaction hub.</span>
              </div>

              {/* Form Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  ← Go Back
                </button>
                <button type="submit" className="premium-btn" style={{ padding: '0.75rem 2.25rem' }}>
                  Complete Simulation
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: TRANSACTION PROCESSING */}
          {step === 3 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 0',
              gap: '1.5rem',
              textAlign: 'center'
            }}>
              <Loader size={48} className="spin-animation" style={{ color: 'var(--color-crops)' }} />
              <div>
                <h4 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Processing simulated payment...
                </h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
                  {processingText}
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER INVOICE CONFIRMATION */}
          {step === 4 && orderInvoice && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                <CheckCircle size={56} style={{ color: 'var(--color-crops)' }} />
              </div>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '1.5rem',
                fontSize: '0.9rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Order ID:</span>
                  <span style={{ fontWeight: 'bold' }}>{orderInvoice.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Customer:</span>
                  <span>{orderInvoice.customer.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Destination:</span>
                  <span style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                    {orderInvoice.customer.address}, {orderInvoice.customer.city}, {orderInvoice.customer.state} - {orderInvoice.customer.zip}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Delivery Status:</span>
                  <span style={{ color: 'var(--color-roots-glow)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Truck size={14} /> Preparing dispatch
                  </span>
                </div>

                {/* Items Summaries */}
                <div style={{ marginTop: '1rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Shipped</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {orderInvoice.items.map((it, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{it.name} ({it.size}) x{it.quantity}</span>
                        <span>₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem', paddingTop: '1rem', fontWeight: 800, fontSize: '1.05rem' }}>
                  <span>Total Amount Paid</span>
                  <span style={{ color: 'var(--color-crops)' }}>₹{orderInvoice.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                A confirmation invoice has been sent to <strong style={{ color: '#fff' }}>{orderInvoice.customer.email}</strong>. Biological soil activation is scheduled upon shipment delivery.
              </div>

              <button 
                onClick={closeAndFinish} 
                className="premium-btn" 
                style={{ width: '100%', padding: '0.85rem' }}
              >
                Close and Finish
              </button>
            </div>
          )}

        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
