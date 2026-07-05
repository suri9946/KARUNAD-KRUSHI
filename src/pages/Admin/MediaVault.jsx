import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, Film, FileText, Trash2, Copy, Check, RefreshCw } from 'lucide-react';
import { mediaApi } from '../../services/mediaApi';
import Toast from '../../components/ui/Toast';

export default function MediaVault() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(null);
  const fileRef = useRef();

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await mediaApi.getGalleryAssets();
      const mapped = (data || []).map(row => ({
        id: row.id,
        name: row.title || row.image_url.split('/').pop(),
        type: row.image_url.match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image',
        url: row.image_url,
        size: 'Supabase Cloud',
        caption: row.caption || ''
      }));
      setAssets(mapped);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load cloud gallery assets', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const filtered = filter === 'all' ? assets : assets.filter(a => a.type === filter);

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    setToast({ message: 'URL copied!', type: 'success' });
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setToast({ message: `Uploading ${files.length} file(s) to Supabase Storage...`, type: 'info' });
    
    try {
      for (const file of files) {
        await mediaApi.uploadMedia(file, 'site-assets', file.name, 'Uploaded via Media Vault');
      }
      setToast({ message: 'Upload successful!', type: 'success' });
      loadAssets();
    } catch (err) {
      console.error(err);
      setToast({ message: `Upload failed: ${err.message}`, type: 'error' });
    }
  };

  const handleDelete = async (asset) => {
    if (!window.confirm(`Are you sure you want to delete "${asset.name}" permanently from both Storage and Database?`)) return;
    try {
      await mediaApi.deleteMedia(asset.id, asset.url);
      setToast({ message: 'Asset deleted successfully', type: 'info' });
      loadAssets();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete asset', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Media Vault</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            {loading ? 'Syncing...' : `${assets.length} assets stored in Supabase`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={loadAssets}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.65rem 1.25rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin-anim' : ''} /> Reload
          </button>
          
          <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
          <button className="premium-btn" onClick={() => fileRef.current.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={16} /> Upload Files
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'image', 'video'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.4rem 1rem', borderRadius: '20px',
            border: `1px solid ${filter === f ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
            background: filter === f ? 'rgba(34,197,94,0.08)' : 'transparent',
            color: filter === f ? 'var(--color-crops)' : 'var(--color-text-muted)',
            cursor: 'pointer', fontFamily: 'var(--font-headers)', fontSize: '0.85rem', textTransform: 'capitalize'
          }}>{f}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color: 'var(--color-text-muted)', padding: '4rem', textAlign: 'center' }}>Loading assets...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {filtered.map((asset, i) => (
            <div key={i} style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '12px', overflow: 'hidden', transition: 'var(--transition-fast)', position: 'relative' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.15)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-card-border)'}
            >
              {/* Delete Icon */}
              <button 
                onClick={() => handleDelete(asset)}
                style={{
                  position: 'absolute', top: '8px', right: '8px', zIndex: 5,
                  background: 'rgba(239, 68, 68, 0.85)', border: 'none', borderRadius: '6px',
                  width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', cursor: 'pointer', transition: 'var(--transition-fast)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.85)'}
                title="Delete Asset"
              >
                <Trash2 size={12} />
              </button>

              <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'; }} />
                ) : (
                  <Film size={28} style={{ color: 'rgba(255,255,255,0.2)' }} />
                )}
              </div>
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.6rem' }}>{asset.size}</div>
                <button onClick={() => copyUrl(asset.url)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.35rem', background: copied === asset.url ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${copied === asset.url ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '6px', color: copied === asset.url ? 'var(--color-crops)' : 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'var(--font-headers)' }}>
                  {copied === asset.url ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy URL</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <style>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
