import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const fallbackAudiences = [
  {
    title: 'Urban Farmers',
    title_en: 'Urban Farmers',
    title_kn: 'ನಗರ ರೈತರು',
    image: '/assets/audience/urban.png',
    color: 'hsl(175, 80%, 45%)', // Science glow teal
    points: [
      {
        label: 'Maximized Space Efficiency',
        label_en: 'Maximized Space Efficiency',
        label_kn: 'ಗರಿಷ್ಠ ಸ್ಥಳ ದಕ್ಷತೆ',
        desc: 'Deepens root branching to get the highest yield out of compact vertical and rooftop setups.',
        desc_en: 'Deepens root branching to get the highest yield out of compact vertical and rooftop setups.',
        desc_kn: 'ಕಡಿಮೆ ಜಾಗದ ಲಂಬ ಮತ್ತು ಮೇಲ್ಛಾವಣಿಯ ಕೃಷಿಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಇಳುವರಿ ಪಡೆಯಲು ಬೇರುಗಳ ಬೆಳವಣಿಗೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.'
      },
      {
        label: 'Smart Moisture Retention',
        label_en: 'Smart Moisture Retention',
        label_kn: 'ಬುದ್ಧಿವಂತ ತೇವಾಂಶ ಧಾರಣ',
        desc: 'Upgrades soil structure to hold water longer, preventing quick drying in shallow containers.',
        desc_en: 'Upgrades soil structure to hold water longer, preventing quick drying in shallow containers.',
        desc_kn: 'ಕಡಿಮೆ ಆಳದ ಕುಂಡಗಳಲ್ಲಿ ನೀರು ಬೇಗನೆ ಒಣಗದಂತೆ ತಡೆಯಲು ಮಣ್ಣಿನ ತೇವಾಂಶ ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯವನ್ನು ಸುಧಾರಿಸುತ್ತದೆ.'
      }
    ]
  },
  {
    title: 'Organic Farmers',
    title_en: 'Organic Farmers',
    title_kn: 'ಸಾವಯವ ರೈತರು',
    image: '/assets/audience/organic.png',
    color: 'hsl(135, 45%, 45%)', // Organic green
    points: [
      {
        label: 'Certified Biological Integrity',
        label_en: 'Certified Biological Integrity',
        label_kn: 'ಪ್ರಮಾಣೀಕೃತ ಜೈವಿಕ ಸಮಗ್ರತೆ',
        desc: '100% natural recovery blend that perfectly respects organic standards and zero-chemical soil life.',
        desc_en: '100% natural recovery blend that perfectly respects organic standards and zero-chemical soil life.',
        desc_kn: 'ಸಾವಯವ ಗುಣಮಟ್ಟ ಮತ್ತು ಶೂನ್ಯ-ರಾಸಾಯನಿಕ ಮಣ್ಣಿನ ಜೀವನವನ್ನು ಗೌರವಿಸುವ ೧೦೦% ನೈಸರ್ಗಿಕ ಮಿಶ್ರಣ.'
      },
      {
        label: 'Revived Living Soil',
        label_en: 'Revived Living Soil',
        label_kn: 'ಪುನರುಜ್ಜೀವನಗೊಂಡ ಜೀವಂತ ಮಣ್ಣು',
        desc: 'Rebuilds native microbial populations to bring exhausted, intensively farmed land back to life.',
        desc_en: 'Rebuilds native microbial populations to bring exhausted, intensively farmed land back to life.',
        desc_kn: 'ಅತಿಯಾದ ಕೃಷಿಯಿಂದ ದಣಿದ ಭೂಮಿಯನ್ನು ಪುನರುಜ್ಜೀವನಗೊಳಿಸಲು ಸ್ಥಳೀಯ ಸೂಕ್ಷ್ಮಜೀವಿಗಳ ಸಂಖ್ಯೆಯನ್ನು ಮರುನಿರ್ಮಾಣ ಮಾಡುತ್ತದೆ.'
      }
    ]
  },
  {
    title: 'Plant Nurseries',
    title_en: 'Plant Nurseries',
    title_kn: 'ಸಸ್ಯ ನರ್ಸರಿಗಳು',
    image: '/assets/audience/nursery.png',
    color: 'hsl(45, 90%, 55%)', // Roots gold
    points: [
      {
        label: 'Rapid Sapling Growth',
        label_en: 'Rapid Sapling Growth',
        label_kn: 'ವೇಗದ ಸಸ್ಯಗಳ ಬೆಳವಣಿಗೆ',
        desc: 'Accelerates early root-zone activation so young hybrid plants reach market readiness much faster.',
        desc_en: 'Accelerates early root-zone activation so young hybrid plants reach market readiness much faster.',
        desc_kn: 'ಹೈಬ್ರಿಡ್ ಸಸ್ಯಗಳು ಮಾರುಕಟ್ಟೆಗೆ ಬೇಗನೆ ಸಿದ್ಧವಾಗಲು ಆರಂಭಿಕ ಬೇರು-ವಲಯದ ಬೆಳವಣಿಗೆಯನ್ನು ವೇಗಗೊಳಿಸುತ್ತದೆ.'
      },
      {
        label: 'Zero Transplant Shock',
        label_en: 'Zero Transplant Shock',
        label_kn: 'ಸ್ಥಳಾಂತರದ ಆಘಾತ ಮುಕ್ತ',
        desc: 'Strengthens natural plant biostimulation to drastically reduce seedling mortality and stress.',
        desc_en: 'Strengthens natural plant biostimulation to drastically reduce seedling mortality and stress.',
        desc_kn: 'ಸಸಿಗಳ ಮರಣ ಪ್ರಮಾಣ ಮತ್ತು ಒತ್ತಡವನ್ನು ಗಣನೀಯವಾಗಿ ಕಡಿಮೆ ಮಾಡಲು ನೈಸರ್ಗಿಕ ಜೈವಿಕ ಪ್ರಚೋದನೆಯನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.'
      }
    ]
  },
  {
    title: 'Home Gardeners',
    title_en: 'Home Gardeners',
    title_kn: 'ಮನೆ ತೋಟಗಾರರು',
    image: '/assets/audience/home_garden.png',
    color: 'hsl(12, 60%, 50%)', // Rust red/orange
    points: [
      {
        label: 'Premium 1 kg Packs',
        label_en: 'Premium 1 kg Packs',
        label_kn: 'ಪ್ರೀಮಿಯಂ ೧ ಕೆಜಿ ಪ್ಯಾಕ್‌ಗಳು',
        desc: 'Tailored, clean, and mess-free packaging designed explicitly for simple home and balcony pot application.',
        desc_en: 'Tailored, clean, and mess-free packaging designed explicitly for simple home and balcony pot application.',
        desc_kn: 'ಮನೆ ಮತ್ತು ಬಾಲ್ಕನಿ ಕುಂಡಗಳಲ್ಲಿ ಬಳಸಲು ಸುಲಭ ಮತ್ತು ಸ್ವಚ್ಛವಾದ ವಿಶೇಷ ಪ್ಯಾಕೇಜಿಂಗ್ ವಿನ್ಯಾಸ.'
      },
      {
        label: 'Vibrant Leaf & Bloom Vigor',
        label_en: 'Vibrant Leaf & Bloom Vigor',
        label_kn: 'ಎಲೆ ಮತ್ತು ಹೂವುಗಳ ಚೈತನ್ಯ',
        desc: 'Naturally triggers efficient nutrient cycling, giving everyday growers visibly greener and healthier potted plants.',
        desc_en: 'Naturally triggers efficient nutrient cycling, giving everyday growers visibly greener and healthier potted plants.',
        desc_kn: 'ನೈಸರ್ಗಿಕವಾಗಿ ಪೋಷಕಾಂಶಗಳ ಚಕ್ರವನ್ನು ಪ್ರಚೋದಿಸಿ, ಕುಂಡದಲ್ಲಿ ಬೆಳೆಯುವ ಸಸ್ಯಗಳನ್ನು ಹೆಚ್ಚು ಹಸಿರಾಗಿ ಮತ್ತು ಆರೋಗ್ಯಕರವಾಗಿ ಮಾಡುತ್ತದೆ.'
      }
    ]
  }
];

export default function TargetAudience() {
  const { lang, audiences: dbAudiences } = useLanguage();
  const audiences = dbAudiences || fallbackAudiences;

  return (
    <section style={{
      backgroundColor: 'hsl(30, 8%, 8%)',
      padding: '80px 0',
      position: 'relative',
      zIndex: 5,
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      fontFamily: 'var(--font-body)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-crops)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {lang === 'kn' ? 'ಫಲಿತಾಂಶಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ' : 'Designed For Results'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3.2vw, 3rem)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            {lang === 'kn' ? 'ವಿವಿಧ ಬೆಳೆಗಾರರಿಗಾಗಿ ಪ್ರತ್ಯೇಕ ಫಾರ್ಮುಲೇಶನ್' : 'Specially Formulated For Diverse Growers'}
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-muted)',
            maxWidth: '650px',
            margin: '0 auto'
          }}>
            {lang === 'kn'
              ? 'ನೀವು ವಾಣಿಜ್ಯ ಪ್ರಮಾಣದ ಕೃಷಿ ಭೂಮಿ, ಸಸ್ಯ ನರ್ಸರಿಗಳು, ನಗರೀಕೃತ ಮೇಲ್ಛಾವಣಿ ಅಥವಾ ಬಾಲ್ಕನಿ ಕುಂಡಗಳನ್ನು ನಿರ್ವಹಿಸುತ್ತಿರಲಿ, ಕರುನಾಡು ಕೃಷಿ ನಿಮಗೆ ಜೈವಿಕ ಪ್ರಯೋಜನಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.'
              : 'Whether you manage commercial scale acreage, boutique seedling nurseries, urban rooftops, or balcony pots, Karunad Krushi provides specific organic biological advantages.'
            }
          </p>
        </div>

        {/* Horizontally scrollable container */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          overflowX: 'auto',
          padding: '1.5rem 0.5rem',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch'
        }} className="audience-scroll-container">
          {audiences.map((aud, index) => {
            const title = lang === 'kn' ? aud.title_kn || aud.title : aud.title_en || aud.title;
            return (
              <div key={index} style={{
                flex: '0 0 350px',
                scrollSnapAlign: 'start',
                background: 'var(--color-card-bg)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '20px',
                padding: '2rem 1.75rem',
                transition: 'var(--transition-smooth)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.5rem'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = aud.color;
                  e.currentTarget.style.boxShadow = `0 10px 30px -10px ${aud.color}44`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--color-card-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  {/* Profile Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      border: `2px solid ${aud.color}`,
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.05)',
                      flexShrink: 0
                    }}>
                      <img src={aud.image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-headers)',
                        fontSize: '1.35rem',
                        fontWeight: 650,
                        color: 'var(--color-text-primary)'
                      }}>{title}</h3>
                      <span style={{ fontSize: '0.75rem', color: aud.color, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                        {lang === 'kn' ? 'ಉದ್ದೇಶಿತ ವಲಯ' : 'Target Sector'}
                      </span>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {(aud.points || []).map((pt, i) => {
                      const label = lang === 'kn' ? pt.label_kn || pt.label : pt.label_en || pt.label;
                      const desc = lang === 'kn' ? pt.desc_kn || pt.desc : pt.desc_en || pt.desc;
                      return (
                        <div key={i} style={{ borderLeft: `2px solid ${aud.color}`, paddingLeft: '1rem' }}>
                          <h4 style={{
                            fontFamily: 'var(--font-headers)',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            marginBottom: '0.25rem'
                          }}>{label}</h4>
                          <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: '1.5'
                          }}>{desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .audience-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        .audience-scroll-container::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .audience-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .audience-scroll-container::-webkit-scrollbar-thumb:hover {
          background: var(--color-crops);
        }
      `}</style>
    </section>
  );
}
