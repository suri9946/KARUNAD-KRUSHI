import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Dna, ShieldCheck } from 'lucide-react';

export default function StageScience({ active }) {
  const { t } = useLanguage();

  return (
    <div style={{
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      zIndex: 2,
      padding: '0 10%'
    }}>
      <div style={{
        maxWidth: '550px',
        animation: active ? 'stageFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--color-science-glow)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          <Dna size={14} className="spin-slow" />
          <span>Phase 03 / Scientific Isolation</span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: '1.2',
          marginBottom: '1.5rem'
        }}>
          {t('stageScienceTitle')}
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          color: 'var(--color-text-muted)',
          lineHeight: '1.7',
          marginBottom: '2rem'
        }}>
          {t('stageScienceDesc')}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem'
        }}>
          <div style={{
            background: 'rgba(0, 242, 254, 0.02)',
            border: '1px solid rgba(0, 242, 254, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--color-science-glow)', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.25rem' }}>N-Fixation</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Azotobacter Isolates</span>
          </div>

          <div style={{
            background: 'rgba(0, 242, 254, 0.02)',
            border: '1px solid rgba(0, 242, 254, 0.08)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--color-science-glow)', fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.25rem' }}>P-Solubilization</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pseudomonas Strains</span>
          </div>
        </div>
      </div>

      <style>{`
        .spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
