import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi } from '../../services/blogApi';
import useSupabase from '../../hooks/useSupabase';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../../components/Layout/Footer';
import { ArrowLeft, Clock, User } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: post, loading } = useSupabase(() => blogApi.getBlogBySlug(slug), [slug]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)' }}>
      <div className="pulse" style={{ fontSize: '1.25rem' }}>Loading Article...</div>
    </div>
  );

  if (!post) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-primary)' }}>
      <h2>Article Not Found</h2>
      <button className="premium-btn" onClick={() => navigate('/blog')}>Back to Blog</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(30, 8%, 8%)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '800px', paddingBottom: '5rem' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', marginBottom: '2.5rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Blog
        </button>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {post.tags?.map(tg => <span key={tg} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(245, 158, 11, 0.07)', border: '1px solid rgba(245, 158, 11, 0.12)', borderRadius: '12px', color: 'var(--color-roots-glow)' }}>{tg}</span>)}
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: '1.25', marginBottom: '1rem' }}>{post.title}</h1>

        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> {post.author_name || 'Karunad Krushi'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {post.read_time || '5 min read'}</span>
        </div>

        {post.cover_image_url && (
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem', maxHeight: '400px' }}>
            <img src={post.cover_image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.parentElement.style.display = 'none'} />
          </div>
        )}

        {/* Article Body */}
        <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
          {(post.body || post.excerpt || '').split('\n').map((para, i) => (
            <p key={i} style={{ marginBottom: '1.25rem' }}>{para}</p>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
