import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function StageDeadSoil({ active }) {
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
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--color-text-dead)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '1rem'
        }}>
          Phase 01 / Depleted Lands
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          lineHeight: '1.2',
          marginBottom: '1.5rem'
        }}>
          {t('stageDeadTitle')}
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1.05rem',
          color: 'var(--color-text-dead)',
          lineHeight: '1.7',
          marginBottom: '2rem'
        }}>
          {t('stageDeadDesc')}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          borderLeft: '2px solid var(--color-text-dead)',
          paddingLeft: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>&lt; 0.3%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dead)', letterSpacing: '1px', textTransform: 'uppercase' }}>Organic Carbon</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>78%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-dead)', letterSpacing: '1px', textTransform: 'uppercase' }}>Microbial Loss</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes stageFadeIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
