import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { inquiryApi } from '../../services/inquiryApi';
import Toast from '../ui/Toast';
import Input from '../ui/Input';

export default function StageTrust({ active }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [toast, setToast] = useState(null);

  const testimonials = [
    { name: 'Ravi Kiran, Tumkur', text: 'After using General BioBlend for one season, my tomato yield jumped 45%. The soil feels alive again!', stars: 5 },
    { name: 'Savitha Gowda, Hassan', text: 'My chilli crop had zero wilting this year. Amazing product, highly recommended.', stars: 5 },
    { name: 'Dr. Mohan, Agricultural Dept.', text: 'Scientific approach to soil restoration. The microbial data is verifiable and results consistent.', stars: 5 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    try {
      await inquiryApi.saveInquiry(form);
      setToast({ message: t('inquirySuccess'), type: 'success' });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setToast({ message: 'Failed to submit inquiry. Please check connection.', type: 'error' });
    }
  };

  return (
    <div style={{
      opacity: active ? 1 : 0, pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'relative', width: '100%', minHeight: '100vh',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 2,
      padding: '120px 10% 60px'
    }}>
      <div style={{ width: '100%', maxWidth: '1100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-crops)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Phase 08 / Trust & Covenant</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>{t('stageTrustTitle')}</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>{t('stageTrustDesc')}</p>
        </div>

        {/* Testimonials */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: 'var(--color-card-bg)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1.75rem'
            }}>
              <div style={{ color: 'var(--color-roots-glow)', fontSize: '1.2rem', marginBottom: '1rem' }}>{'★'.repeat(t.stars)}</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem', fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>— {t.name}</div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2rem', textAlign: 'center' }}>{t('contactUs')}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <Input label={t('name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <Input label={t('email')} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <Input label={t('phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: 'var(--font-headers)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>{t('message')}</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={4}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--color-text-primary)', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="premium-btn" style={{ width: '100%', justifyContent: 'center' }}>{t('send')}</button>
          </form>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
