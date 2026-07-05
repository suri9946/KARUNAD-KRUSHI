import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { scienceApi } from '../../services/scienceApi';
import useSupabase from '../../hooks/useSupabase';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../../components/Layout/Footer';
import { Search, Download, ChevronRight } from 'lucide-react';

export default function ScienceHub() {
  const { t } = useLanguage();
  const { data: articles = [], loading } = useSupabase(() => scienceApi.getArticles(), []);
  const [query, setQuery] = useState('');
  const filtered = (articles || []).filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.abstract.toLowerCase().includes(query.toLowerCase()) ||
    a.authors.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'hsl(200, 70%, 7%)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', paddingTop: '100px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '3rem 2rem 4rem', background: 'linear-gradient(to bottom, rgba(0,200,200,0.04), transparent)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-science-glow)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Research & Publications</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, marginBottom: '1.5rem' }}>{t('scienceHub')}</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
          Peer-reviewed research, lab reports, and technical documentation supporting the BioBlend scientific framework.
        </p>
        <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search papers, authors, topics..."
            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,200,0.15)', borderRadius: '30px', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container" style={{ paddingBottom: '5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-headers)' }}>
            <div className="pulse" style={{ fontSize: '1.1rem' }}>Loading Research Library...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>No papers found for "{query}"</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filtered.map(article => (
            <div key={article.id} style={{
              background: 'rgba(0, 200, 200, 0.02)', border: '1px solid rgba(0, 200, 200, 0.08)',
              borderRadius: '16px', padding: '2rem', transition: 'var(--transition-smooth)'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0, 200, 200, 0.18)'; e.currentTarget.style.background = 'rgba(0, 200, 200, 0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0, 200, 200, 0.08)'; e.currentTarget.style.background = 'rgba(0, 200, 200, 0.02)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(0,200,200,0.1)', border: '1px solid rgba(0,200,200,0.15)', borderRadius: '20px', color: 'var(--color-science-glow)' }}>{article.category}</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-text-primary)', marginBottom: '0.5rem', lineHeight: '1.4' }}>{article.title}</h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-science-glow)', marginBottom: '1rem' }}>Authors: {article.authors}</div>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>{article.abstract}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,200,200,0.08)', border: '1px solid rgba(0,200,200,0.15)', borderRadius: '8px', padding: '0.6rem 1rem', color: 'var(--color-science-glow)', cursor: 'pointer', fontFamily: 'var(--font-headers)', fontSize: '0.85rem' }}
                    onClick={() => alert('PDF download would be available once backend is connected')}>
                    <Download size={14} /> PDF
                  </button>
                  <Link to={`/science/${article.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.6rem 1rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontFamily: 'var(--font-headers)', fontSize: '0.85rem' }}>
                    Full Paper <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
