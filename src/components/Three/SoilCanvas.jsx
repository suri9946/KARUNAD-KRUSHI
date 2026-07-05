import React, { useState, useEffect, useRef } from 'react';
import BioBlendParticles from './BioBlendParticles';

/**
 * SoilCanvas Component
 * Coordinates the background particle animations and tracks scroll positions
 * to calculate biological morph progress between Stage 3 (Science) and Stage 5 (Living Soil).
 */
export default function SoilCanvas() {
  const [morphProgress, setMorphProgress] = useState(0);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const vh = window.innerHeight;

          // Stage 3 starts around 300vh, Stage 5 ends around 600vh
          const startScroll = vh * 3.0; // StageScience
          const endScroll = vh * 5.5;   // StageLivingSoil

          if (scrollY >= startScroll && scrollY <= endScroll) {
            isVisibleRef.current = true;
            // Map scroll values within range to 0-1 progress
            const range = endScroll - startScroll;
            const progress = (scrollY - startScroll) / range;
            setMorphProgress(progress);
          } else if (scrollY < startScroll) {
            if (morphProgress !== 0) setMorphProgress(0);
            isVisibleRef.current = scrollY > vh * 2.0; // Keep visible slightly early
          } else if (scrollY > endScroll) {
            if (morphProgress !== 1) setMorphProgress(1);
            isVisibleRef.current = scrollY < vh * 6.5; // Keep visible slightly late
          } else {
            isVisibleRef.current = false;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run initially to align positions

    return () => window.removeEventListener('scroll', handleScroll);
  }, [morphProgress]);

  if (!isVisibleRef.current) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1, // Directly behind stages but above background video/canvas
      pointerEvents: 'none',
      transition: 'opacity 1s ease'
    }}>
      {/* Bioluminescent Micro-Imaging Microbial Network */}
      <BioBlendParticles progress={morphProgress} />

      {/* Grid overlay lines to add technical blueprint aesthetics */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.01) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.01) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        opacity: morphProgress * 0.5,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
