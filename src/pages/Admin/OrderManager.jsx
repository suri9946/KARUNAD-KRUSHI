import React, { useState, useEffect } from 'react';
import { orderApi } from '../../services/orderApi';
import Toast from '../../components/ui/Toast';
import { Package, Mail, Phone, MapPin, DollarSign, Calendar, RefreshCw, Trash2, Eye } from 'lucide-react';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load orders from Supabase', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await orderApi.updateOrderStatus(id, status);
      setToast({ message: `Order status updated to ${status}`, type: 'success' });
      loadOrders();
      if (selected && selected.id === id) {
        setSelected(prev => ({ ...prev, payment_status: status }));
      }
    } catch (err) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order record permanently?')) return;
    try {
      await orderApi.deleteOrder(id);
      setToast({ message: 'Order record deleted', type: 'info' });
      loadOrders();
      if (selected && selected.id === id) {
        setSelected(null);
      }
    } catch (err) {
      setToast({ message: 'Failed to delete order', type: 'error' });
    }
  };

  // Filter orders
  const filtered = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.transaction_id?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats calculation
  const totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const orderCount = orders.length;
  const completedOrders = orders.filter(o => o.payment_status === 'completed' || o.payment_status === 'paid').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Orders Ledger</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Track sales, customer purchases, and payment statuses
          </p>
        </div>
        <button 
          onClick={loadOrders} 
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.65rem 1.25rem', borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--color-text-muted)', cursor: 'pointer',
            fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '0.85rem',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
        >
          <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Reload
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Total Sales Revenue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-crops)' }}>₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Total Purchase Orders</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{orderCount}</div>
        </div>
        <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Completed Purchases</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-science-glow)' }}>{completedOrders}</div>
        </div>
      </div>

      {/* Search Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search by customer name, email, or transaction ID..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', background: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)', borderRadius: '10px',
            padding: '0.8rem 1.2rem', color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)', outline: 'none', fontSize: '0.9rem',
            transition: 'var(--transition-fast)'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-crops)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-card-border)'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px' }}>
              Loading orders from cloud...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px' }}>
              <Package size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No customer purchase orders found.</p>
            </div>
          ) : (
            filtered.map(order => {
              const isPaid = order.payment_status === 'completed' || order.payment_status === 'paid';
              return (
                <div 
                  key={order.id} 
                  onClick={() => setSelected(order)}
                  style={{
                    background: selected?.id === order.id ? 'rgba(34,197,94,0.04)' : 'var(--color-card-bg)',
                    border: `1px solid ${selected?.id === order.id ? 'rgba(34,197,94,0.15)' : 'var(--color-card-border)'}`,
                    borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.95rem' }}>{order.customer_name}</span>
                        <span style={{ 
                          fontSize: '0.65rem', padding: '0.15rem 0.4rem', 
                          background: isPaid ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', 
                          border: `1px solid ${isPaid ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)'}`, 
                          borderRadius: '6px', color: isPaid ? 'var(--color-crops)' : 'var(--color-roots-glow)',
                          textTransform: 'uppercase', fontWeight: 600
                        }}>
                          {order.payment_status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>{order.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Txn ID: {order.transaction_id} • {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-crops)', fontSize: '1.1rem' }}>₹{Number(order.total).toFixed(2)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{Array.isArray(order.items) ? `${order.items.length} items` : 'items'}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Order Detail Pane */}
        {selected && (
          <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '2rem', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>Purchase Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.25rem' }}>Customer</span>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '1.05rem' }}>{selected.customer_name}</div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <a href={`mailto:${selected.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-crops)', fontSize: '0.8rem', textDecoration: 'none' }}><Mail size={12} /> {selected.email}</a>
                  <a href={`tel:${selected.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-science-glow)', fontSize: '0.8rem', textDecoration: 'none' }}><Phone size={12} /> {selected.phone}</a>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.25rem' }}>Shipping Address</span>
                <div style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <MapPin size={14} style={{ color: 'var(--color-roots-glow)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{selected.shipping_address}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-card-border)', borderBottom: '1px solid var(--color-card-border)', padding: '1rem 0' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.75rem' }}>Purchased Items</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Array.isArray(selected.items) && selected.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <div>
                        <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{item.productName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>SKU: {item.variantSku} ({item.size})</div>
                      </div>
                      <div style={{ color: 'var(--color-text-primary)' }}>
                        {item.quantity} × ₹{Number(item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Transaction ID</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{selected.transaction_id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Total Amount</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-crops)' }}>₹{Number(selected.total).toFixed(2)}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={12} /> Ordered On: {new Date(selected.created_at).toLocaleString('en-IN')}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {selected.payment_status !== 'completed' && selected.payment_status !== 'paid' ? (
                  <button 
                    className="premium-btn" 
                    onClick={() => handleUpdateStatus(selected.id, 'completed')}
                    style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem' }}
                  >
                    Mark as Completed
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUpdateStatus(selected.id, 'pending')}
                    style={{
                      flex: 1, padding: '0.55rem', fontSize: '0.8rem',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--color-text-muted)', cursor: 'pointer', borderRadius: '8px',
                      fontFamily: 'var(--font-headers)', fontWeight: 600, transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    Set to Pending
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(selected.id)}
                  style={{
                    padding: '0.55rem 0.8rem', background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444',
                    borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
