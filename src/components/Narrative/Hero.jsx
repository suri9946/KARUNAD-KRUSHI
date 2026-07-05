import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, Play, Pause } from 'lucide-react';

export default function Hero({ active }) {
  const { t, heroVideoUrl } = useLanguage();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (active) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [active]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

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
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
      padding: '0 2rem'
    }}>
      {/* Background cinematic video looping */}
      <video
        ref={videoRef}
        src={heroVideoUrl}
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: 0.4
        }}
      />

      {/* Dark overlay gradients */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(10,10,10,0.5), rgba(10,10,10,0.95))',
        zIndex: -1
      }} />

      {/* Hero Content */}
      <div style={{
        textAlign: 'center',
        maxWidth: '850px',
        animation: active ? 'heroFadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
      }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: 700,
          letterSpacing: '1px',
          color: 'var(--color-text-primary)',
          lineHeight: '1.1',
          marginBottom: '1.5rem'
        }}>
          {t('stageHeroTitle')}
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--color-text-muted)',
          marginBottom: '2.5rem',
          lineHeight: '1.6',
          maxWidth: '650px',
          margin: '0 auto 2.5rem auto'
        }}>
          {t('stageHeroDesc')}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight * 1.5,
                behavior: 'smooth'
              });
            }}
            className="premium-btn"
          >
            {t('learnMore')}
          </button>
          
          <button
            onClick={togglePlay}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'var(--color-text-primary)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>
      </div>

      {/* Down indicators */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        color: 'var(--color-text-muted)',
        animation: 'bounce 2s infinite'
      }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll to start</span>
        <ChevronDown size={18} />
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
