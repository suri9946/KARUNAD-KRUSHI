import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Toast from '../../components/ui/Toast';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) { navigate('/admin'); }
    else { setToast({ message: 'Invalid credentials. Try admin@karunadkrushi.com / admin123', type: 'error' }); }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(30, 8%, 6%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', padding: '2rem' }}>
      {/* BG glow */}
      <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34, 197, 94, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/assets/logo.png" alt="Karunad Krushi" style={{ height: '60px', objectFit: 'contain', marginBottom: '1rem' }} onError={e => e.target.style.display = 'none'} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Karunad Krushi Content Management</p>
        </div>

        <div style={{ background: 'var(--color-card-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--color-card-border)', borderRadius: '20px', padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-headers)' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@karunadkrushi.com"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-headers)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            </div>
            <button type="submit" className="premium-btn" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.04)', border: '1px solid rgba(34, 197, 94, 0.1)', borderRadius: '10px' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--color-crops)' }}>Demo credentials:</strong><br />
              admin@karunadkrushi.com / admin123
            </p>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
