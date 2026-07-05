import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const totalFrames = 50;
    const assets = [
      '/assets/logo.png',
      '/assets/hero_video.mp4',
      '/assets/products/tomato.png',
      '/assets/products/general_blend.png',
      '/assets/products/chilli.png',
      '/assets/products/brinjal.png'
    ];

    // Generate frame paths
    for (let i = 1; i <= totalFrames; i++) {
      const frameNum = String(i).padStart(3, '0');
      assets.push(`/assets/frames/ezgif-frame-${frameNum}.jpg`);
    }

    let loadedCount = 0;
    const totalAssets = assets.length;

    const updateProgress = () => {
      loadedCount++;
      const currentPercent = Math.min(Math.round((loadedCount / totalAssets) * 100), 100);
      setProgress(currentPercent);

      if (loadedCount >= totalAssets) {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            onComplete();
          }, 800); // Fades out transition timing
        }, 500); // Hold at 100% briefly
      }
    };

    // Preload Images and Video
    assets.forEach(url => {
      if (url.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = url;
        video.preload = 'auto';
        video.onloadeddata = updateProgress;
        video.onerror = updateProgress; // Fallback
      } else {
        const img = new Image();
        img.src = url;
        img.onload = updateProgress;
        img.onerror = updateProgress; // Fallback
      }
    });

  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'hsl(30, 8%, 8%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: fadeOut ? 0 : 1,
      pointerEvents: fadeOut ? 'none' : 'all',
      fontFamily: 'var(--font-headers)'
    }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '2rem' }}>
        {/* Animated premium glowing core */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.05)',
          borderTopColor: 'var(--color-crops)',
          animation: 'spin 1.5s linear infinite',
          position: 'absolute'
        }} />
        <div style={{
          width: '80%',
          height: '80%',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.02)',
          borderBottomColor: 'var(--color-science-glow)',
          animation: 'spin-reverse 2s linear infinite',
          position: 'absolute',
          top: '10%',
          left: '10%'
        }} />
        {/* Centered logo icon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--color-text-primary)',
          fontSize: '1.2rem',
          fontWeight: 800,
          letterSpacing: '1px'
        }}>
          KK
        </div>
      </div>

      <h1 style={{
        fontSize: '1rem',
        fontWeight: 400,
        letterSpacing: '4px',
        color: 'var(--color-text-muted)',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        {t('splashText')}
      </h1>

      <div style={{
        width: '240px',
        height: '2px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'var(--color-crops)',
          boxShadow: '0 0 10px var(--color-crops)',
          transition: 'width 0.2s ease-out'
        }} />
      </div>

      <div style={{
        fontSize: '2rem',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {progress}%
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
