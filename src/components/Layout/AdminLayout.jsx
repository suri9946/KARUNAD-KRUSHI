import React from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, BookOpen, FlaskConical, MessageSquare, Settings, BarChart2, LogOut, Globe, LayoutDashboard, ShoppingBag } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: Package, label: 'Products', to: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', to: '/admin/orders' },
  { icon: BookOpen, label: 'Blog', to: '/admin/blog' },
  { icon: FlaskConical, label: 'Science', to: '/admin/science' },
  { icon: MessageSquare, label: 'Inquiries', to: '/admin/inquiries' },
  { icon: Settings, label: 'Content', to: '/admin/content' },
  { icon: BarChart2, label: 'Media Vault', to: '/admin/media' },
];

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(30, 8%, 7%)', fontFamily: 'var(--font-body)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0, borderRight: '1px solid var(--color-card-border)',
        background: 'rgba(10,10,10,0.7)', backdropFilter: 'blur(20px)',
        display: 'flex', flexDirection: 'column', padding: '1.5rem 0', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100
      }}>
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--color-card-border)' }}>
          <img src="/assets/logo.png" alt="Karunad Krushi" style={{ height: '36px', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to));
            return (
              <Link key={item.to} to={item.to} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                  borderRadius: '10px', color: active ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  background: active ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(34, 197, 94, 0.12)' : 'transparent'}`,
                  fontSize: '0.875rem', fontWeight: active ? 600 : 400, transition: 'var(--transition-fast)'
                }}>
                  <item.icon size={16} style={{ color: active ? 'var(--color-crops)' : 'inherit' }} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-card-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
            <Globe size={14} /> View Public Site
          </Link>
          <button onClick={() => { logout(); navigate('/admin/login'); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', padding: 0 }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '2.5rem', overflowY: 'auto', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
