import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import useScrollDirection from '../../hooks/useScrollDirection';
import { Globe, ShieldAlert, LogOut, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const { setIsCartOpen, cartCount } = useCart();
  const location = useLocation();
  const scrollDirection = useScrollDirection();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor page scroll for progress indicators and sticky styles
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, backdrop-filter 0.3s ease',
      transform: scrollDirection === 'down' && isScrolled ? 'translateY(-100%)' : 'translateY(0)',
      backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.75)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
    }}>
      {/* Scroll Progress Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '3px',
        width: `${scrollProgress * 100}%`,
        background: 'linear-gradient(90deg, var(--color-science-glow), var(--color-crops))',
        boxShadow: '0 0 8px var(--color-crops)',
        transition: 'width 0.1s ease-out'
      }} />

      <div className="container" style={{
        height: '75px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo & Title */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
          <img
            src="/assets/logo.png"
            alt="Karunad Krushi Logo"
            onError={(e) => {
              // Hide image and display custom SVG/text fallback on error
              e.target.style.display = 'none';
            }}
            style={{
              height: '42px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontFamily: 'var(--font-headers)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--color-text-primary)',
              letterSpacing: '1px',
              lineHeight: '1.2'
            }}>
              {t('brandName')}
            </span>
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.5px'
            }}>
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            {t('home')}
          </Link>
          <Link to="/science" className={`nav-link ${location.pathname.startsWith('/science') ? 'active' : ''}`}>
            {t('scienceHub')}
          </Link>
          <Link to="/blog" className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}>
            {t('blog')}
          </Link>

          {/* Quick Admin Navigation */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/admin" className="nav-link" style={{ color: 'var(--color-science-glow)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldAlert size={16} /> Admin
              </Link>
              <button
                onClick={logout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-crisis)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="nav-link" style={{ fontSize: '0.85rem', opacity: 0.6 }}>
              CMS
            </Link>
          )}

          {/* Cart Icon trigger */}
          {!isAdminRoute && (
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-crops)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: 'var(--color-crops)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px var(--color-crops)'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Language Toggle Trigger */}
          <button
            onClick={toggleLanguage}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '0.4rem 0.9rem',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'var(--font-headers)',
              fontSize: '0.85rem',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
