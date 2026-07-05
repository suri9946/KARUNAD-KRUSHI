import React, { useState, useEffect } from 'react';
import { contentApi } from '../../services/contentApi';
import { useLanguage } from '../../context/LanguageContext';
import Toast from '../../components/ui/Toast';
import { Settings, BookOpen, Users, Save, RefreshCw } from 'lucide-react';

export default function ContentEditor() {
  const { refreshContent } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Load content from Supabase
  const loadContent = async () => {
    setLoading(true);
    try {
      const dbContent = await contentApi.getSiteContent();
      setContent(dbContent || {});
    } catch (err) {
      setToast({ message: 'Failed to load content from Supabase', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Update a specific key value
  const updateKeyField = (key, field, value) => {
    setContent(prev => {
      const currentObj = prev[key] || { en: '', kn: '' };
      return {
        ...prev,
        [key]: { ...currentObj, [field]: value }
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Loop over keys and save them
      for (const [key, value] of Object.entries(content)) {
        await contentApi.saveSiteContent(key, value);
      }
      setToast({ message: 'All changes saved to Supabase cloud!', type: 'success' });
      // Notify translation provider to refresh
      if (refreshContent) {
        await refreshContent();
      }
    } catch (err) {
      setToast({ message: 'Failed to save changes', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveKey = async (key) => {
    try {
      await contentApi.saveSiteContent(key, content[key]);
      setToast({ message: `Saved "${key}" successfully!`, type: 'success' });
      if (refreshContent) await refreshContent();
    } catch (err) {
      setToast({ message: `Failed to save "${key}"`, type: 'error' });
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--color-text-muted)', padding: '2rem' }}>Loading dynamic site content...</div>;
  }

  // Helper inputs
  const renderLangInputs = (key, label) => {
    const data = content[key] || { en: '', kn: '' };
    return (
      <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-headers)' }}>{label}</label>
          <button 
            onClick={() => handleSaveKey(key)}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--color-crops)', borderRadius: '6px', cursor: 'pointer' }}
          >
            Save key
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>English</span>
            <input 
              value={data.en || ''} 
              onChange={e => updateKeyField(key, 'en', e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Kannada</span>
            <input 
              value={data.kn || ''} 
              onChange={e => updateKeyField(key, 'kn', e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderTextAreaInputs = (key, label) => {
    const data = content[key] || { en: '', kn: '' };
    return (
      <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-headers)' }}>{label}</label>
          <button 
            onClick={() => handleSaveKey(key)}
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--color-crops)', borderRadius: '6px', cursor: 'pointer' }}
          >
            Save key
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>English</span>
            <textarea 
              rows={3}
              value={data.en || ''} 
              onChange={e => updateKeyField(key, 'en', e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#fff', fontSize: '0.85rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Kannada</span>
            <textarea 
              rows={3}
              value={data.kn || ''} 
              onChange={e => updateKeyField(key, 'kn', e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#fff', fontSize: '0.85rem', resize: 'vertical', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Audiences edit
  const audiencesData = content['audiences'] || { value: [] };
  const audiencesList = Array.isArray(audiencesData) ? audiencesData : (audiencesData.value || []);

  const updateAudienceField = (index, field, value) => {
    const updated = [...audiencesList];
    updated[index] = { ...updated[index], [field]: value };
    setContent(prev => ({ ...prev, audiences: { value: updated } }));
  };

  const updateAudiencePoint = (audIdx, ptIdx, field, value) => {
    const updatedAuds = [...audiencesList];
    const updatedPoints = [...(updatedAuds[audIdx].points || [])];
    updatedPoints[ptIdx] = { ...updatedPoints[ptIdx], [field]: value };
    updatedAuds[audIdx] = { ...updatedAuds[audIdx], points: updatedPoints };
    setContent(prev => ({ ...prev, audiences: { value: updatedAuds } }));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Content Editor</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Edit live homepage texts, images, and translations saved directly in Supabase</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={loadContent}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            <RefreshCw size={14} /> Revert
          </button>
          <button className="premium-btn" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={14} /> {saving ? 'Saving All...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Tab selectors */}
        <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1rem' }}>
          <button onClick={() => setActiveTab('general')} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 0.875rem', borderRadius: '10px', border: 'none', marginBottom: '0.25rem',
            background: activeTab === 'general' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
            color: activeTab === 'general' ? 'var(--color-crops)' : 'var(--color-text-muted)', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.88rem'
          }}><Settings size={16} /> General Settings</button>
          
          <button onClick={() => setActiveTab('stages')} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 0.875rem', borderRadius: '10px', border: 'none', marginBottom: '0.25rem',
            background: activeTab === 'stages' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
            color: activeTab === 'stages' ? 'var(--color-crops)' : 'var(--color-text-muted)', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.88rem'
          }}><BookOpen size={16} /> Narrative Stages</button>
          
          <button onClick={() => setActiveTab('audiences')} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem 0.875rem', borderRadius: '10px', border: 'none', marginBottom: '0.25rem',
            background: activeTab === 'audiences' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
            color: activeTab === 'audiences' ? 'var(--color-crops)' : 'var(--color-text-muted)', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.88rem'
          }}><Users size={16} /> Target Sectors</button>
        </div>

        {/* Right: Tab Contents */}
        <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '2rem' }}>
          
          {activeTab === 'general' && (
            <div>
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Site Identity & Contact Information</h3>
              {renderLangInputs('brandName', 'Brand Title')}
              {renderLangInputs('tagline', 'Tagline / Slogan')}
              {renderLangInputs('mission', 'Mission / Motto')}
              
              <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Hero Loop Video / Image URL</label>
                  <button onClick={() => handleSaveKey('heroVideoUrl')} style={{ padding: '0.25rem 0.6rem', fontSize: '0.7rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--color-crops)', borderRadius: '6px', cursor: 'pointer' }}>Save Key</button>
                </div>
                <input 
                  value={(content['heroVideoUrl'] || {}).en || ''} 
                  onChange={e => updateKeyField('heroVideoUrl', 'en', e.target.value)}
                  placeholder="e.g. /assets/hero_video.mp4 or cloud bucket link"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              {renderLangInputs('footerAddress', 'Footer Office Address')}
              {renderLangInputs('footerEmail', 'Footer Contact Email')}
              {renderLangInputs('footerPhone', 'Footer Contact Phone')}
              {renderLangInputs('gstin', 'GSTIN Number')}
            </div>
          )}

          {activeTab === 'stages' && (
            <div>
              <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Narrative Stage Settings</h3>
              {renderLangInputs('splashText', 'Splash Screen Loader text')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageHeroTitle', 'Hero Title')}
              {renderTextAreaInputs('stageHeroDesc', 'Hero Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageDeadTitle', 'Stage 1: Dead Soil Title')}
              {renderTextAreaInputs('stageDeadDesc', 'Stage 1: Dead Soil Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageCrisisTitle', 'Stage 2: Hidden Crisis Title')}
              {renderTextAreaInputs('stageCrisisDesc', 'Stage 2: Hidden Crisis Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageScienceTitle', 'Stage 3: Scientific Regeneration Title')}
              {renderTextAreaInputs('stageScienceDesc', 'Stage 3: Scientific Regeneration Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageBioblendTitle', 'Stage 4: BioBlend Formulation Title')}
              {renderTextAreaInputs('stageBioblendDesc', 'Stage 4: BioBlend Formulation Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageLivingTitle', 'Stage 5: Living Soil Title')}
              {renderTextAreaInputs('stageLivingDesc', 'Stage 5: Living Soil Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageRootsTitle', 'Stage 6: Deep Root Networks Title')}
              {renderTextAreaInputs('stageRootsDesc', 'Stage 6: Deep Root Networks Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageCropsTitle', 'Stage 7: Thriving Canopy Title')}
              {renderTextAreaInputs('stageCropsDesc', 'Stage 7: Thriving Canopy Description')}
              <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '2rem 0' }} />
              {renderLangInputs('stageTrustTitle', 'Stage 8: Trust & Restoration Title')}
              {renderTextAreaInputs('stageTrustDesc', 'Stage 8: Trust & Restoration Description')}
            </div>
          )}

          {activeTab === 'audiences' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--color-text-primary)' }}>Target Sector Cards</h3>
                <button 
                  onClick={() => handleSaveKey('audiences')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--color-crops)', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Save Sector Config
                </button>
              </div>

              {audiencesList.map((aud, index) => (
                <div key={index} style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', background: 'rgba(255,255,255,0.01)' }}>
                  <h4 style={{ color: aud.color || '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Sector #{index + 1}: {aud.title_en || aud.title}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Sector Name (EN)</span>
                      <input 
                        value={aud.title_en || ''} 
                        onChange={e => updateAudienceField(index, 'title_en', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Sector Name (KN)</span>
                      <input 
                        value={aud.title_kn || ''} 
                        onChange={e => updateAudienceField(index, 'title_kn', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Image Path / URL</span>
                      <input 
                        value={aud.image || ''} 
                        onChange={e => updateAudienceField(index, 'image', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Border / Glow Color (e.g. HSL or Hex)</span>
                      <input 
                        value={aud.color || ''} 
                        onChange={e => updateAudienceField(index, 'color', e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Points (Benefits list) */}
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.75rem' }}>Key Benefits</span>
                    {(aud.points || []).map((pt, pIdx) => (
                      <div key={pIdx} style={{ marginBottom: '1.25rem', borderBottom: pIdx === 0 ? '1px dashed rgba(255,255,255,0.05)' : 'none', paddingBottom: pIdx === 0 ? '1rem' : '0' }}>
                        <span style={{ fontSize: '0.7rem', color: aud.color || '#fff', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Benefit #{pIdx + 1}</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Heading (EN)</span>
                            <input 
                              value={pt.label_en || pt.label || ''} 
                              onChange={e => updateAudiencePoint(index, pIdx, 'label_en', e.target.value)}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Heading (KN)</span>
                            <input 
                              value={pt.label_kn || ''} 
                              onChange={e => updateAudiencePoint(index, pIdx, 'label_kn', e.target.value)}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Description (EN)</span>
                            <textarea 
                              rows={2}
                              value={pt.desc_en || pt.desc || ''} 
                              onChange={e => updateAudiencePoint(index, pIdx, 'desc_en', e.target.value)}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.8rem', outline: 'none', fontFamily: 'var(--font-body)' }}
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Description (KN)</span>
                            <textarea 
                              rows={2}
                              value={pt.desc_kn || ''} 
                              onChange={e => updateAudiencePoint(index, pIdx, 'desc_kn', e.target.value)}
                              style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.8rem', outline: 'none', fontFamily: 'var(--font-body)' }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
