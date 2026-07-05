import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productApi } from '../../services/productApi';
import { blogApi } from '../../services/blogApi';
import { scienceApi } from '../../services/scienceApi';
import { inquiryApi } from '../../services/inquiryApi';
import { orderApi } from '../../services/orderApi';
import DashboardChart from '../../components/Chart/DashboardChart';
import { Package, BookOpen, FlaskConical, MessageSquare, ShoppingBag, ArrowUpRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, to }) => {
  const content = (
    <div style={{
      background: 'var(--color-card-bg)', backdropFilter: 'blur(12px)',
      border: '1px solid var(--color-card-border)', borderRadius: '16px',
      padding: '1.5rem', transition: 'var(--transition-smooth)',
      cursor: to ? 'pointer' : 'default'
    }}
      onMouseEnter={e => { if (to) { e.currentTarget.style.borderColor = `${color}30`; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
      onMouseLeave={e => { if (to) { e.currentTarget.style.borderColor = 'var(--color-card-border)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} style={{ color }} />
        </div>
        {to && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Manage →</span>}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{label}</div>
    </div>
  );
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link> : content;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ products: 0, blogs: 0, science: 0, inquiries: 0, orders: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prods, blgs, scis, inqs, ords] = await Promise.all([
        productApi.getProducts(),
        blogApi.getBlogs(),
        scienceApi.getArticles(),
        inquiryApi.getInquiries(),
        orderApi.getOrders()
      ]);

      setCounts({
        products: prods ? prods.length : 0,
        blogs: blgs ? blgs.length : 0,
        science: scis ? scis.length : 0,
        inquiries: inqs ? inqs.length : 0,
        orders: ords ? ords.length : 0
      });
      setInquiries(inqs || []);
      setRecentOrders((ords || []).slice(0, 5));
    } catch (err) {
      console.error('Failed to load Dashboard metrics from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const unreadInquiries = inquiries.filter(i => i.status === 'new').length;

  const stats = [
    { icon: Package, label: 'Products', value: loading ? '...' : counts.products, color: '#22c55e', to: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders Ledger', value: loading ? '...' : counts.orders, color: '#3b82f6', to: '/admin/orders' },
    { icon: BookOpen, label: 'Blog Posts', value: loading ? '...' : counts.blogs, color: '#f59e0b', to: '/admin/blog' },
    { icon: FlaskConical, label: 'Science Papers', value: loading ? '...' : counts.science, color: '#06b6d4', to: '/admin/science' },
    { icon: MessageSquare, label: 'Inquiries', value: loading ? '...' : counts.inquiries, color: '#a78bfa', to: '/admin/inquiries', badge: unreadInquiries > 0 ? unreadInquiries : undefined },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
          Welcome back, {user?.name || 'Admin'} 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Here's a live overview of Karunad Krushi cloud database activity.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts / Data Lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <DashboardChart />

        {/* Recent Purchases List */}
        <div style={{ background: 'var(--color-card-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>Recent Purchases</h2>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--color-crops)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Ledger <ArrowUpRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No orders placed yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentOrders.map(order => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{order.customer_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-crops)', fontSize: '0.9rem' }}>₹{Number(order.total).toFixed(2)}</div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{order.payment_status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Inquiries List */}
      <div style={{ background: 'var(--color-card-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>Recent Inquiries</h2>
          <Link to="/admin/inquiries" style={{ fontSize: '0.85rem', color: 'var(--color-crops)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Inbox <ArrowUpRight size={14} />
          </Link>
        </div>
        {inquiries.length === 0 && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>No inquiries yet.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
          {inquiries.slice(0, 4).map(inq => (
            <div key={inq.id} style={{ padding: '0.875rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>{inq.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{inq.email} • {new Date(inq.created_at).toLocaleDateString('en-IN')}</div>
              </div>
              {inq.status === 'new' && <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '6px', color: 'var(--color-roots-glow)', fontWeight: 600 }}>NEW</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
