import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: 'hsl(30, 8%, 6%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '4rem 0 2rem 0',
      position: 'relative',
      zIndex: 10,
      fontFamily: 'var(--font-body)',
      color: 'var(--color-text-muted)'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        {/* Left column - Brand */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-headers)',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            {t('brandName')}
          </h2>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {t('tagline')}. Dedicated to restoring soil biology and maximizing yields sustainably.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* Social Links Mock */}
            <span style={{ fontSize: '0.85rem' }}>© {new Date().getFullYear()} Karunad Krushi. All rights reserved.</span>
          </div>
        </div>

        {/* Middle column - Links */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-headers)',
            color: 'var(--color-text-primary)',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1.2rem',
            letterSpacing: '1px'
          }}>
            QUICK ROUTING
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>
                {t('home')}
              </Link>
            </li>
            <li>
              <Link to="/science" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>
                {t('scienceHub')}
              </Link>
            </li>
            <li>
              <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>
                {t('blog')}
              </Link>
            </li>
            <li>
              <Link to="/admin/login" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.9rem' }}>
                Dashboard Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Right column - Contacts */}
        <div>
          <h4 style={{
            fontFamily: 'var(--font-headers)',
            color: 'var(--color-text-primary)',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1.2rem',
            letterSpacing: '1px'
          }}>
            HEADQUARTERS
          </h4>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            Karunad Krushi Agricultural Solutions
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
            No. 45, Lalbagh Road, Basavanagudi,<br />
            Bengaluru, Karnataka - 560004
          </p>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            Email: contact@karunadkrushi.com<br />
            Phone: +91 80 2345 6789
          </p>
        </div>
      </div>

      <div className="container" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '2rem',
        textAlign: 'center',
        fontSize: '0.8rem'
      }}>
        <p>Scientific Agriculture • Reclaiming sterile lands • Resilient yields</p>
      </div>
    </footer>
  );
}
