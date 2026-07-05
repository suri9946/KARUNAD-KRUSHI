import React, { useState, useEffect } from 'react';
import Toast from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import { seoApi } from '../../services/seoApi';
import { Globe, Search, Eye, Save, RefreshCw } from 'lucide-react';

// All pages that have configurable SEO metadata
const seoPages = [
  {
    id: 'home',
    label: 'Home Page',
    path: '/',
    icon: '🏠',
    defaults: {
      title: 'Karunad Krushi — BioBlend Soil Restoration',
      meta_description: 'Revive depleted farmland with BioBlend — India\'s premium biological soil activator. Trusted by urban farmers, nurseries & organic growers.',
      keywords: 'BioBlend, soil restoration, organic farming, biostimulant, India, Karunad Krushi',
      og_image: '/assets/og-home.jpg'
    }
  },
  {
    id: 'science',
    label: 'Science Hub',
    path: '/science',
    icon: '🔬',
    defaults: {
      title: 'The Science Behind BioBlend — Karunad Krushi',
      meta_description: 'Explore the microbial biology, soil ecology, and peer-reviewed research powering BioBlend\'s biological soil restoration technology.',
      keywords: 'soil microbiology, mycorrhiza, trichoderma, biostimulant science, soil health research',
      og_image: '/assets/og-science.jpg'
    }
  },
  {
    id: 'blog',
    label: 'Blog',
    path: '/blog',
    icon: '📝',
    defaults: {
      title: 'Farming Insights & Tips — Karunad Krushi Blog',
      meta_description: 'Read expert articles on organic farming, soil biology, crop improvement techniques, and sustainable agriculture from the Karunad Krushi team.',
      keywords: 'farming blog, organic farming tips, soil health, agriculture insights',
      og_image: '/assets/og-blog.jpg'
    }
  },
  {
    id: 'products',
    label: 'Product Pages',
    path: '/products/*',
    icon: '📦',
    defaults: {
      title: 'BioBlend Products — Karunad Krushi',
      meta_description: 'Explore BioBlend\'s range of biological soil activators for home gardeners, organic farmers, nurseries, and urban growers.',
      keywords: 'BioBlend buy, soil activator, biological fertilizer, organic crop booster',
      og_image: '/assets/og-products.jpg'
    }
  }
];

function ScoreBar({ label, score, color }) {
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{score}/100</span>
      </div>
      <div style={{
        height: '6px', background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', width: `${score}%`,
          background: `linear-gradient(90deg, rgba(255,255,255,0.05), ${color})`,
          borderRadius: '4px', transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }} />
      </div>
    </div>
  );
}

export default function SEOManager() {
  const [selectedPage, setSelectedPage] = useState(seoPages[0]);
  const [pageData, setPageData] = useState(
    Object.fromEntries(seoPages.map(p => [p.id, { ...p.defaults }]))
  );
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    seoApi.getSEOSettings().then(dbSettings => {
      if (dbSettings && dbSettings.length > 0) {
        setPageData(prev => {
          const merged = { ...prev };
          dbSettings.forEach(row => {
            if (merged[row.page_id]) {
              merged[row.page_id] = {
                title: row.title || '',
                meta_description: row.meta_description || '',
                keywords: row.keywords || '',
                og_image: row.og_image || ''
              };
            }
          });
          return merged;
        });
      }
      setLoading(false);
    }).catch(err => {
      console.warn('Failed to load SEO settings from Supabase, using defaults:', err);
      setLoading(false);
    });
  }, []);

  const current = pageData[selectedPage.id] || selectedPage.defaults;

  const setField = (field, value) => {
    setPageData(prev => ({
      ...prev,
      [selectedPage.id]: { ...prev[selectedPage.id], [field]: value }
    }));
  };

  const handleReset = () => {
    setPageData(prev => ({
      ...prev,
      [selectedPage.id]: { ...selectedPage.defaults }
    }));
    setToast({ message: 'Reset to defaults', type: 'info' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await seoApi.saveSEOSettings(selectedPage.id, current);
      setToast({ message: `SEO settings saved for ${selectedPage.label}!`, type: 'success' });
    } catch (err) {
      setToast({ message: 'Save failed. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Calculate live SEO score based on content quality
  const titleLen = current.title?.length || 0;
  const descLen = current.meta_description?.length || 0;
  const keywordCount = current.keywords?.split(',').filter(Boolean).length || 0;

  const titleScore = titleLen >= 50 && titleLen <= 60 ? 100 : titleLen >= 40 ? 70 : titleLen > 0 ? 40 : 0;
  const descScore = descLen >= 150 && descLen <= 160 ? 100 : descLen >= 120 ? 70 : descLen > 0 ? 40 : 0;
  const keywordScore = Math.min(keywordCount * 15, 100);
  const ogScore = current.og_image ? 100 : 0;
  const overallScore = Math.round((titleScore + descScore + keywordScore + ogScore) / 4);

  const overallColor = overallScore >= 75 ? 'var(--color-crops)' : overallScore >= 50 ? 'var(--color-roots-glow)' : '#ef4444';

  if (loading) {
    return <div style={{ color: 'var(--color-text-muted)', padding: '2rem' }}>Loading page SEO configurations...</div>;
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Globe size={18} style={{ color: 'var(--color-science-glow)' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
              SEO Manager
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              Manage meta titles, descriptions, and social sharing settings per page
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleReset}
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
            <RefreshCw size={14} /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="premium-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}
          >
            <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Page Selector */}
        <div style={{
          background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)',
          borderRadius: '16px', padding: '1rem', position: 'sticky', top: '90px'
        }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
            Pages
          </p>
          {seoPages.map(page => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                width: '100%', padding: '0.75rem 0.875rem', borderRadius: '10px',
                border: 'none', marginBottom: '0.25rem',
                background: selectedPage.id === page.id ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                color: selectedPage.id === page.id ? 'var(--color-crops)' : 'var(--color-text-muted)',
                cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '0.88rem',
                transition: 'var(--transition-fast)',
                borderLeft: selectedPage.id === page.id ? '2px solid var(--color-crops)' : '2px solid transparent'
              }}
              onMouseEnter={e => { if (selectedPage.id !== page.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (selectedPage.id !== page.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '1rem' }}>{page.icon}</span>
              <div>
                <div>{page.label}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.6 }}>{page.path}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Right: SEO Fields + Score Panel */}
        <div>
          {/* SEO Score Card */}
          <div style={{
            background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)',
            borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>
                  SEO Health Score
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {selectedPage.label} — {selectedPage.path}
                </p>
              </div>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                border: `3px solid ${overallColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 15px ${overallColor}30`
              }}>
                <span style={{ fontFamily: 'var(--font-headers)', fontWeight: 800, fontSize: '1.1rem', color: overallColor }}>
                  {overallScore}
                </span>
              </div>
            </div>
            <ScoreBar label="Title Tag" score={titleScore} color="var(--color-crops)" />
            <ScoreBar label="Meta Description" score={descScore} color="var(--color-science-glow)" />
            <ScoreBar label="Keywords" score={keywordScore} color="var(--color-roots-glow)" />
            <ScoreBar label="OG Image" score={ogScore} color="#a78bfa" />
          </div>

          {/* Meta Fields */}
          <div style={{
            background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)',
            borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontFamily: 'var(--font-headers)', fontWeight: 700,
              fontSize: '1rem', color: 'var(--color-text-primary)',
              marginBottom: '1.25rem', paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--color-card-border)'
            }}>
              Meta Tags
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <Input
                label={`Page Title (${titleLen} chars — ideal 50–60)`}
                value={current.title}
                onChange={e => setField('title', e.target.value)}
                placeholder="e.g. BioBlend Soil Activator — Karunad Krushi"
              />
              {titleLen > 60 && (
                <p style={{ color: '#f59e0b', fontSize: '0.72rem', marginTop: '0.25rem' }}>⚠ Title exceeds 60 characters — may be truncated in search results</p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block', fontSize: '0.85rem', fontWeight: 500,
                color: 'var(--color-text-muted)', marginBottom: '0.5rem',
                fontFamily: 'var(--font-headers)'
              }}>
                Meta Description ({descLen} chars — ideal 150–160)
              </label>
              <textarea
                rows={3}
                value={current.meta_description}
                onChange={e => setField('meta_description', e.target.value)}
                placeholder="Compelling description that appears under your title in Google results..."
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                  padding: '0.75rem', color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)', resize: 'vertical',
                  outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box'
                }}
              />
              {descLen > 160 && (
                <p style={{ color: '#f59e0b', fontSize: '0.72rem', marginTop: '0.25rem' }}>⚠ Description exceeds 160 characters — may be trimmed in SERPs</p>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <Input
                label="Focus Keywords (comma-separated)"
                value={current.keywords}
                onChange={e => setField('keywords', e.target.value)}
                placeholder="organic soil, biostimulant, BioBlend, soil health..."
              />
            </div>

            <div>
              <Input
                label="OG Image URL (for social sharing)"
                value={current.og_image}
                onChange={e => setField('og_image', e.target.value)}
                placeholder="/assets/og-home.jpg or https://..."
              />
            </div>
          </div>

          {/* Google Search Preview */}
          <div style={{
            background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)',
            borderRadius: '16px', padding: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Search size={16} style={{ color: 'var(--color-text-muted)' }} />
              <h3 style={{
                fontFamily: 'var(--font-headers)', fontWeight: 700,
                fontSize: '1rem', color: 'var(--color-text-primary)'
              }}>
                Live Google Search Preview
              </h3>
            </div>

            {/* SERP Preview Card */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', padding: '1.25rem 1.5rem',
              fontFamily: 'Arial, sans-serif'
            }}>
              {/* URL breadcrumb */}
              <div style={{ fontSize: '0.78rem', color: '#bdc1c6', marginBottom: '4px' }}>
                karunadkrushi.com{selectedPage.path !== '*' ? selectedPage.path : ''} ›
              </div>
              {/* Title */}
              <div style={{
                fontSize: '1.15rem', color: '#8ab4f8',
                marginBottom: '4px', fontWeight: 400,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: '500px'
              }}>
                {current.title || 'Page Title'}
              </div>
              {/* Description */}
              <div style={{
                fontSize: '0.85rem', color: '#bdc1c6', lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {current.meta_description || 'Meta description will appear here...'}
              </div>
            </div>

            {/* Social preview hint */}
            {current.og_image && (
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Eye size={12} />
                Social share image configured: <span style={{ color: 'var(--color-crops)' }}>{current.og_image}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
