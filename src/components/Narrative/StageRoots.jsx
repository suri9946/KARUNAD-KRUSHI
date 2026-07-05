import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function StageRoots({ active }) {
  const { t } = useLanguage();
  return (
    <div style={{
      opacity: active ? 1 : 0, pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-start', zIndex: 2, padding: '0 10%'
    }}>
      <div style={{ maxWidth: '550px', animation: active ? 'stageFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-roots-glow)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Phase 06 / Root Symbiosis</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '1.2', marginBottom: '1.5rem' }}>{t('stageRootsTitle')}</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>{t('stageRootsDesc')}</p>
        <div style={{ position: 'relative', height: '80px', overflow: 'hidden', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.08)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-roots-glow)', textShadow: '0 0 20px rgba(245, 158, 11, 0.4)' }}>1000%</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>increase in effective water & mineral absorption surface area via mycorrhizal hyphae extensions</div>
        </div>
      </div>
      <style>{`@keyframes stageFadeIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
