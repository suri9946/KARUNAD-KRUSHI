import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate floating leaf/spore particles for the 404 scene
    const pts = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 3,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.4 + 0.1
    }));
    setParticles(pts);

    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 30%, hsl(130, 25%, 8%) 0%, hsl(30, 8%, 5%) 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--color-crops) 0%, transparent 70%)',
          opacity: p.opacity,
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          transition: 'transform 0.8s ease-out',
          animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          pointerEvents: 'none'
        }} />
      ))}

      {/* Grid Lines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none'
      }} />

      {/* Center Content */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 2,
        maxWidth: '560px'
      }}>
        {/* Glowing 404 Number */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
          <div style={{
            fontSize: 'clamp(7rem, 20vw, 10rem)',
            fontFamily: 'var(--font-headers)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--color-crops) 0%, var(--color-science-glow) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.25))',
            transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)`,
            transition: 'transform 0.4s ease-out'
          }}>
            404
          </div>
          {/* Subtle glow ring behind the number */}
          <div style={{
            position: 'absolute',
            inset: '-20px',
            background: 'radial-gradient(ellipse, rgba(34, 197, 94, 0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: -1
          }} />
        </div>

        {/* Icon: wilted leaf / disconnected node */}
        <div style={{ marginBottom: '1.5rem', opacity: 0.6 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"
              stroke="var(--color-crops)" strokeWidth="1" strokeDasharray="4 2" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-headers)',
          fontWeight: 700,
          fontSize: 'clamp(1.4rem, 4vw, 2rem)',
          color: 'var(--color-text-primary)',
          marginBottom: '0.75rem'
        }}>
          Page Not Found
        </h1>

        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '1rem',
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          maxWidth: '380px',
          margin: '0 auto 2.5rem'
        }}>
          Looks like this page has gone underground — even BioBlend can't revive a URL that doesn't exist.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="premium-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            textDecoration: 'none'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12L12 3l9 9M5 10v10h5v-6h4v6h5V10"/>
            </svg>
            Back to Home
          </Link>

          <Link to="/science" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
            fontFamily: 'var(--font-headers)',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'var(--transition-fast)'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
            </svg>
            Explore Science
          </Link>
        </div>

        {/* Navigation quick links */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Products', to: '/#products' },
            { label: 'Blog', to: '/blog' },
            { label: 'Admin', to: '/admin/login' }
          ].map(link => (
            <Link key={link.to} to={link.to} style={{
              fontSize: '0.82rem',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              transition: 'var(--transition-fast)'
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-crops)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0px) scale(1); opacity: 0.1; }
          100% { transform: translateY(-30px) scale(1.1); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
