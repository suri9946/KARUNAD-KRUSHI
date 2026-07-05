import React, { useState, useEffect, useRef } from 'react';
import SplashScreen from '../../components/Narrative/SplashScreen';
import ScrollCanvas from '../../components/Narrative/ScrollCanvas';
import Hero from '../../components/Narrative/Hero';
import StageDeadSoil from '../../components/Narrative/StageDeadSoil';
import StageCrisis from '../../components/Narrative/StageCrisis';
import StageScience from '../../components/Narrative/StageScience';
import StageBioBlend from '../../components/Narrative/StageBioBlend';
import StageLivingSoil from '../../components/Narrative/StageLivingSoil';
import StageRoots from '../../components/Narrative/StageRoots';
import StageCrops from '../../components/Narrative/StageCrops';
import StageTrust from '../../components/Narrative/StageTrust';
import Footer from '../../components/Layout/Footer';
import TargetAudience from '../../components/Narrative/TargetAudience';
import ProductListSection from '../../components/Shop/ProductListSection';

// Memoize stages outside the component to prevent recreation on scroll progress
const MemoizedHero = React.memo(Hero);
const MemoizedStageDeadSoil = React.memo(StageDeadSoil);
const MemoizedStageCrisis = React.memo(StageCrisis);
const MemoizedStageScience = React.memo(StageScience);
const MemoizedStageBioBlend = React.memo(StageBioBlend);
const MemoizedStageLivingSoil = React.memo(StageLivingSoil);
const MemoizedStageRoots = React.memo(StageRoots);
const MemoizedStageCrops = React.memo(StageCrops);
const MemoizedStageTrust = React.memo(StageTrust);
const MemoizedTargetAudience = React.memo(TargetAudience);
const MemoizedProductListSection = React.memo(ProductListSection);

// Number of full-height sections for scroll-based stage transitions
const TOTAL_STAGES = 8;

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!splashDone) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const vh = window.innerHeight;
          // Each stage occupies one viewport height worth of scrolling
          const stageHeight = vh;
          const currentStage = Math.min(Math.floor(scrollY / stageHeight), TOTAL_STAGES - 1);

          // Overall canvas progress (frames 0-1)
          const totalScrollable = stageHeight * TOTAL_STAGES;
          setScrollProgress(scrollY / totalScrollable);
          setActiveStage(currentStage);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [splashDone]);

  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  return (
    <>
      {/* Fixed canvas behind all stages */}
      <ScrollCanvas currentProgress={scrollProgress} />

      {/* Dark overlay that fades based on active stage */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        background: `linear-gradient(to bottom, rgba(5,5,5,${0.4 + activeStage * 0.05}), rgba(5,5,5,${0.6 + activeStage * 0.04}))`,
        zIndex: 1,
        pointerEvents: 'none',
        transition: 'background 1s ease'
      }} />

      {/* Scrollable page with pinned stage overlays */}
      <div ref={containerRef}>
        {/* Scroll spacer - creates scroll distance for all stages */}
        <div style={{ height: `${(TOTAL_STAGES + 1) * 100}vh` }} />
      </div>

      {/* Pinned stage overlays */}
      <MemoizedHero active={activeStage === 0} />
      <MemoizedStageDeadSoil active={activeStage === 1} />
      <MemoizedStageCrisis active={activeStage === 2} />
      <MemoizedStageScience active={activeStage === 3} />
      <MemoizedStageBioBlend active={activeStage === 4} />
      <MemoizedStageLivingSoil active={activeStage === 5} />
      <MemoizedStageRoots active={activeStage === 6} />
      <MemoizedStageCrops active={activeStage === 7} />

      {/* StageTrust is the last and is content-height, rendered after scroll space */}
      <div style={{
        position: 'relative', zIndex: 5,
        backgroundColor: 'hsl(30, 8%, 8%)',
        marginTop: '-100vh'
      }}>
        <MemoizedStageTrust active={true} />
        
        {/* Target Audience & E-Commerce Sections */}
        <MemoizedTargetAudience />
        <MemoizedProductListSection />
        
        <Footer />
      </div>
    </>
  );
}
