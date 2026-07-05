import React, { useState, useEffect } from 'react';
import { blogApi } from '../../services/blogApi';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2 } from 'lucide-react';

const empty = { title: '', slug: '', excerpt: '', content: '', tags: '', author_name: 'Karunad Krushi', cover_image_url: '', read_time: '5 min read', status: 'published' };

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPosts = () => {
    setLoading(true);
    blogApi.getBlogs()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (p) => { 
    setEditing(p.id); 
    setForm({ 
      ...p, 
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
      content: p.content || p.body || ''
    }); 
    setModal(true); 
  };

  const handleSave = async () => {
    const payload = { 
      ...form, 
      tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      content: form.content || form.body || ''
    };
    try {
      if (editing) {
        await blogApi.updateBlog({ ...payload, id: editing });
        setToast({ message: 'Post updated!', type: 'success' });
      } else {
        await blogApi.createBlog({ ...payload, id: `blog-${Date.now()}`, created_at: new Date().toISOString() });
        setToast({ message: 'Post created!', type: 'success' });
      }
      setModal(false);
      loadPosts();
    } catch (err) {
      setToast({ message: 'Save failed. Check values.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await blogApi.deleteBlog(id);
      loadPosts();
      setToast({ message: 'Post deleted', type: 'info' });
    } catch (err) {
      setToast({ message: 'Failed to delete post', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-headers)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>Blog Posts</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{posts.length} articles</p>
        </div>
        <button className="premium-btn" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={16} /> New Post</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {p.cover_image_url && <img src={p.cover_image_url} alt={p.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-primary)', marginBottom: '0.3rem' }}>{p.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{p.excerpt?.substring(0, 120)}...</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {p.tags?.map(tg => <span key={tg} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: '8px', color: 'var(--color-roots-glow)' }}>{tg}</span>)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => openEdit(p)} style={{ padding: '0.6rem 0.8rem', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: '8px', color: 'var(--color-roots-glow)', cursor: 'pointer' }}><Edit size={14} /></button>
              <button onClick={() => handleDelete(p.id)} style={{ padding: '0.6rem 0.8rem', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Post' : 'New Post'}>
        <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Input label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        <Input label="Author" value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} />
        <Input label="Cover Image URL" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} />
        <Input label="Read Time" value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })} />
        <Input label="Tags (comma-separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-headers)' }}>Excerpt</label>
          <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none', fontSize: '0.9rem' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.5rem', fontFamily: 'var(--font-headers)' }}>Body Content</label>
          <textarea rows={6} value={form.content || form.body || ''} onChange={e => setForm({ ...form, content: e.target.value, body: e.target.value })}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem', color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none', fontSize: '0.9rem' }} />
        </div>
        <button className="premium-btn" onClick={handleSave} style={{ width: '100%', justifyContent: 'center' }}>{editing ? 'Save Changes' : 'Publish Post'}</button>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
