import React, { useState, useEffect } from 'react';
import { inquiryApi } from '../../services/inquiryApi';
import Toast from '../../components/ui/Toast';
import { MessageSquare, Mail, Phone, CheckCircle } from 'lucide-react';

export default function InquiryHub() {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadInquiries = () => {
    setLoading(true);
    inquiryApi.getInquiries()
      .then(data => {
        setInquiries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const markRead = async (id) => {
    try {
      await inquiryApi.updateInquiryStatus(id, 'resolved');
      loadInquiries();
      setToast({ message: 'Marked as read', type: 'success' });
      if (selected?.id === id) {
        setSelected(prev => ({ ...prev, status: 'resolved' }));
      }
    } catch (err) {
      setToast({ message: 'Failed to update inquiry status', type: 'error' });
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await inquiryApi.deleteInquiry(id);
      loadInquiries();
      if (selected?.id === id) setSelected(null);
      setToast({ message: 'Inquiry deleted', type: 'info' });
    } catch (err) {
      setToast({ message: 'Failed to delete inquiry', type: 'error' });
    }
  };

  const unreadCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Inquiry Hub</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          {loading ? 'Loading...' : `${unreadCount} unread of ${inquiries.length} total`}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {inquiries.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px' }}>
              <MessageSquare size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No inquiries yet. They'll appear here when visitors submit the contact form.</p>
            </div>
          )}
          {inquiries.map(inq => (
            <div key={inq.id} onClick={() => setSelected(inq)} style={{
              background: selected?.id === inq.id ? 'rgba(34,197,94,0.04)' : 'var(--color-card-bg)',
              border: `1px solid ${selected?.id === inq.id ? 'rgba(34,197,94,0.15)' : 'var(--color-card-border)'}`,
              borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'var(--transition-fast)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{inq.name}</span>
                    {inq.status === 'new' && <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', color: 'var(--color-roots-glow)' }}>NEW</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{inq.email}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>{inq.message}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  {inq.status === 'new' && (
                    <button onClick={e => { e.stopPropagation(); markRead(inq.id); }} title="Mark read"
                      style={{ padding: '0.4rem', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: '6px', color: 'var(--color-crops)', cursor: 'pointer' }}>
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <button onClick={e => { e.stopPropagation(); deleteInquiry(inq.id); }} title="Delete"
                    style={{ padding: '0.4rem', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '6px', color: '#ef4444', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail pane */}
        {selected && (
          <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '2rem', position: 'sticky', top: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>Inquiry Details</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>From</div>
                <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{selected.name}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={`mailto:${selected.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-crops)', fontSize: '0.85rem', textDecoration: 'none' }}><Mail size={14} /> {selected.email}</a>
                {selected.phone && <a href={`tel:${selected.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-roots-glow)', fontSize: '0.85rem', textDecoration: 'none' }}><Phone size={14} /> {selected.phone}</a>}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Message</div>
                <p style={{ color: 'var(--color-text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>{selected.message}</p>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Received: {new Date(selected.created_at).toLocaleString('en-IN')}</div>
              {selected.status === 'new' && (
                <button className="premium-btn" onClick={() => markRead(selected.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <CheckCircle size={14} /> Mark as Read
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
