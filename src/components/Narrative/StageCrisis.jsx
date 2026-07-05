import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertTriangle } from 'lucide-react';

export default function StageCrisis({ active }) {
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
      justifyContent: 'flex-end',
      zIndex: 2,
      padding: '0 10%'
    }}>
      <div style={{
        maxWidth: '550px',
        animation: active ? 'stageFadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--color-crisis)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          <AlertTriangle size={14} />
          <span>Phase 02 / The Hidden Crisis</span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: '1.2',
          marginBottom: '1.5rem'
        }}>
          {t('stageCrisisTitle')}
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          color: 'var(--color-text-muted)',
          lineHeight: '1.7',
          marginBottom: '2rem'
        }}>
          {t('stageCrisisDesc')}
        </p>

        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.03)',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            <span>Chemical Salinization</span>
            <span style={{ color: 'var(--color-crisis)', fontWeight: 'bold' }}>HIGH ALERT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
            <span>Native Mycelial Hyphae</span>
            <span style={{ color: 'var(--color-crisis)', fontWeight: 'bold' }}>SEVERELY ERADICATED</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Compacted Density</span>
            <span style={{ color: 'var(--color-crisis)', fontWeight: 'bold' }}>CRITICAL LIMIT</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stageFadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
