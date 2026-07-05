import React, { useState, useEffect } from 'react';
import { scienceApi } from '../../services/scienceApi';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';

const empty = { title: '', slug: '', abstract: '', authors: '', category: 'Soil Biology', content: '' };

export default function ScienceManager() {
  const [papers, setPapers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPapers = () => {
    setLoading(true);
    scienceApi.getArticles()
      .then(data => {
        setPapers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({ ...p, content: p.content || p.body || '' }); setModal(true); };

  const handleSave = async () => {
    try {
      if (editing) {
        await scienceApi.updateArticle({ ...form, id: editing });
        setToast({ message: 'Paper updated!', type: 'success' });
      } else {
        await scienceApi.createArticle({ ...form, id: `sci-${Date.now()}`, created_at: new Date().toISOString() });
        setToast({ message: 'Paper added!', type: 'success' });
      }
      setModal(false);
      loadPapers();
    } catch (err) {
      setToast({ message: 'Save failed. Check values.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this paper?')) return;
    try {
      await scienceApi.deleteArticle(id);
      loadPapers();
      setToast({ message: 'Paper deleted', type: 'info' });
    } catch (err) {
      setToast({ message: 'Failed to delete paper', type: 'error' });
    }
  };

  const categories = ['Soil Biology', 'Mycorrhizal Research', 'Crop Yield Studies', 'Organic Carbon', 'Water Retention'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Science Papers</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{papers.length} publications</p>
        </div>
        <button className="premium-btn" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> Add Paper</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {papers.map(p => (
          <div key={p.id} style={{ background: 'rgba(0, 200, 200, 0.02)', border: '1px solid rgba(0, 200, 200, 0.08)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', background: 'rgba(0,200,200,0.1)', border: '1px solid rgba(0,200,200,0.15)', borderRadius: '12px', color: 'var(--color-science-glow)', display: 'inline-block', marginBottom: '0.75rem' }}>{p.category}</span>
              <h3 style={{ fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '0.4rem', lineHeight: '1.4' }}>{p.title}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-science-glow)', marginBottom: '0.5rem' }}>Authors: {p.authors}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.abstract}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(p)} style={{ padding: '0.6rem 0.8rem', background: 'rgba(0,200,200,0.07)', border: '1px solid rgba(0,200,200,0.12)', borderRadius: '8px', color: 'var(--color-science-glow)', cursor: 'pointer' }}><Edit size={14} /></button>
              <button onClick={() => handleDelete(p.id)} style={{ padding: '0.6rem 0.8rem', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Paper' : 'Add Paper'}>
        <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        <Input label="Authors" value={form.authors} onChange={e => setForm({ ...form, authors: e.target.value })} />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-headers)' }}>Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', outline: 'none', fontSize: '0.9rem' }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-headers)' }}>Abstract</label>
          <textarea rows={4} value={form.abstract} onChange={e => setForm({ ...form, abstract: e.target.value })}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none', fontSize: '0.9rem' }} />
        </div>
        <button className="premium-btn" onClick={handleSave} style={{ width: '100%', justifyContent: 'center' }}>{editing ? 'Save Changes' : 'Add Paper'}</button>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
