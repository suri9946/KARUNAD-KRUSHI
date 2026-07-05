import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../../services/blogApi';
import useSupabase from '../../hooks/useSupabase';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../../components/Layout/Footer';
import { Clock, Tag, ChevronRight } from 'lucide-react';

export default function BlogList() {
  const { t } = useLanguage();
  const { data: posts = [], loading } = useSupabase(() => blogApi.getBlogs(), []);
  const [tag, setTag] = useState('All');
  const allTags = ['All', ...new Set((posts || []).flatMap(p => p.tags || []))];
  const filtered = tag === 'All' ? (posts || []) : (posts || []).filter(p => p.tags?.includes(tag));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(30, 8%, 8%)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', paddingTop: '100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem 4rem', background: 'linear-gradient(to bottom, rgba(245, 158, 11, 0.03), transparent)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-roots-glow)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Stories from the Soil</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, marginBottom: '2rem' }}>{t('blog')}</h1>
        {/* Tag filter */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {allTags.map(tg => (
            <button key={tg} onClick={() => setTag(tg)} style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: `1px solid ${tag === tg ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255,255,255,0.08)'}`,
              background: tag === tg ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              color: tag === tg ? 'var(--color-roots-glow)' : 'var(--color-text-muted)',
              cursor: 'pointer', fontFamily: 'var(--font-headers)', fontSize: '0.85rem', transition: 'var(--transition-fast)'
            }}>{tg}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ paddingBottom: '5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-headers)' }}>
            <div className="pulse" style={{ fontSize: '1.1rem' }}>Loading Blog Posts...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>No articles found</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {filtered.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--color-card-bg)', backdropFilter: 'blur(12px)',
                border: '1px solid var(--color-card-border)', borderRadius: '16px', overflow: 'hidden',
                transition: 'var(--transition-smooth)', height: '100%', display: 'flex', flexDirection: 'column'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.15)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-card-border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {post.cover_image_url && (
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.parentElement.style.display = 'none'} />
                  </div>
                )}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {post.tags?.map(tg => (
                      <span key={tg} style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(245, 158, 11, 0.07)', border: '1px solid rgba(245, 158, 11, 0.12)', borderRadius: '12px', color: 'var(--color-roots-glow)' }}>{tg}</span>
                    ))}
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: '0.75rem', lineHeight: '1.4', flex: 1 }}>{post.title}</h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                      <Clock size={12} /> {post.read_time || '5 min read'}
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--color-roots-glow)', fontWeight: 600 }}>
                      Read <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
