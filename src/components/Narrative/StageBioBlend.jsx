import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Leaf, FlaskConical } from 'lucide-react';

export default function StageBioBlend({ active }) {
  const { t } = useLanguage();
  return (
    <div style={{
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'all' : 'none',
      transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-start', zIndex: 2, padding: '0 10%'
    }}>
      <div style={{ maxWidth: '560px', animation: active ? 'stageFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'hsl(135, 70%, 55%)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>
          <FlaskConical size={14} />
          <span>Phase 04 / BioBlend Formula</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: '1.2', marginBottom: '1.5rem' }}>
          {t('stageBioblendTitle')}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
          {t('stageBioblendDesc')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {['Humic & Fulvic Acids', 'Mycorrhizal Spore Concentrate', 'Nitrogen-Fixing Bacteria', 'Organic Carrier Matrix'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-crops)', boxShadow: '0 0 6px var(--color-crops)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes stageFadeIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
