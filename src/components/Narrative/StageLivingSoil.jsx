import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function StageLivingSoil({ active }) {
  const { t } = useLanguage();
  return (
    <div style={{
      opacity: active ? 1 : 0, pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 2, padding: '0 10%'
    }}>
      <div style={{ maxWidth: '540px', animation: active ? 'stageFadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(24, 60%, 55%)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>Phase 05 / Soil Rebirth</div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '1.2', marginBottom: '1.5rem' }}>{t('stageLivingTitle')}</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>{t('stageLivingDesc')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[['Soil Carbon', '+340%'], ['Microbial Count', '+1200%'], ['Water Retention', '+65%'], ['Earthworm Pop.', 'Restored']].map(([label, val], i) => (
            <div key={i} style={{ background: 'rgba(139, 90, 43, 0.06)', border: '1px solid rgba(139, 90, 43, 0.12)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
              <div style={{ color: 'hsl(24, 60%, 55%)', fontWeight: 800, fontSize: '1.5rem' }}>{val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes stageFadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
