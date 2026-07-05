import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../services/productApi';
import Toast from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import { Save, ArrowLeft, Plus, Trash2, Package } from 'lucide-react';

const emptyVariant = { weight: '', price: '', stock: 10 };

const emptyProduct = {
  name: '',
  slug: '',
  short_description: '',
  main_image_url: '',
  ingredients: '',
  application_guide: '',
  scientific_backing: '',
  variants: []
};

function Section({ title, children }) {
  return (
    <div style={{
      background: 'var(--color-card-bg)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--color-card-border)',
      borderRadius: '16px',
      padding: '1.75rem',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{
        fontFamily: 'var(--font-headers)',
        fontWeight: 700,
        fontSize: '1rem',
        color: 'var(--color-text-primary)',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--color-card-border)'
      }}>{title}</h3>
      {children}
    </div>
  );
}

export default function ProductForm() {
  const { id } = useParams(); // If id present, we're in edit mode
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyProduct);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  // Load existing product data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      productApi.getProducts()
        .then(products => {
          const existing = products.find(p => p.id === id);
          if (existing) {
            setForm({
              ...existing,
              ingredients: Array.isArray(existing.ingredients)
                ? existing.ingredients.join(', ')
                : existing.ingredients || ''
            });
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const autoSlug = (name) => {
    const slug = name.toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
    setForm(prev => ({ ...prev, name, slug }));
  };

  // Variant management
  const addVariant = () => setForm(prev => ({
    ...prev,
    variants: [...(prev.variants || []), { ...emptyVariant, id: `var-${Date.now()}` }]
  }));

  const updateVariant = (idx, field, value) => {
    const updated = [...(form.variants || [])];
    updated[idx] = { ...updated[idx], [field]: field === 'price' || field === 'stock' ? Number(value) : value };
    setForm(prev => ({ ...prev, variants: updated }));
  };

  const removeVariant = (idx) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setToast({ message: 'Product name is required', type: 'error' });
      return;
    }
    if (!form.slug.trim()) {
      setToast({ message: 'URL slug is required', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients
          ? form.ingredients.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };

      if (isEditing) {
        await productApi.updateProduct({ ...payload, id });
        setToast({ message: 'Product updated successfully!', type: 'success' });
      } else {
        await productApi.createProduct({
          ...payload,
          id: `prod-${Date.now()}`,
          created_at: new Date().toISOString()
        });
        setToast({ message: 'Product created!', type: 'success' });
      }

      setTimeout(() => navigate('/admin/products'), 1200);
    } catch (err) {
      setToast({ message: 'Save failed. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)' }}>
        <div className="pulse" style={{ fontSize: '1.25rem' }}>Loading Product Details...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/admin/products')}
          style={{
            background: 'none', border: 'none', color: 'var(--color-text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.85rem', padding: '0.5rem', borderRadius: '8px',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(34, 197, 94, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Package size={18} style={{ color: 'var(--color-crops)' }} />
            </div>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-headers)', fontWeight: 700,
                fontSize: '1.5rem', color: 'var(--color-text-primary)'
              }}>
                {isEditing ? 'Edit Product' : 'New Product'}
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                {isEditing ? `Editing: ${form.name}` : 'Add a new product to the catalog'}
              </p>
            </div>
          </div>
        </div>

        <button
          id="save-product-btn"
          onClick={handleSave}
          disabled={saving}
          className="premium-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: saving ? 0.7 : 1 }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
        </button>
      </div>

      {/* Basic Information */}
      <Section title="Basic Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <Input
              label="Product Name *"
              value={form.name}
              onChange={e => autoSlug(e.target.value)}
              placeholder="e.g. BioBlend Pro 1kg"
            />
          </div>
          <div>
            <Input
              label="URL Slug *"
              value={form.slug}
              onChange={e => setField('slug', e.target.value)}
              placeholder="e.g. bioblend-pro-1kg"
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Auto-generated from name. Used in product URL.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{
            display: 'block', fontSize: '0.85rem', fontWeight: 500,
            color: 'var(--color-text-muted)', marginBottom: '0.5rem',
            fontFamily: 'var(--font-headers)'
          }}>
            Short Description
          </label>
          <textarea
            rows={3}
            value={form.short_description}
            onChange={e => setField('short_description', e.target.value)}
            placeholder="Brief 1-2 sentence product summary shown on listing cards..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '0.75rem', color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)', resize: 'vertical',
              outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box'
            }}
          />
        </div>
      </Section>

      {/* Media */}
      <Section title="Product Image">
        <Input
          label="Main Image URL"
          value={form.main_image_url}
          onChange={e => setField('main_image_url', e.target.value)}
          placeholder="https://... or /assets/products/product.png"
        />
        {form.main_image_url && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <img
              src={form.main_image_url}
              alt="Preview"
              style={{
                maxHeight: '160px', maxWidth: '100%', objectFit: 'contain',
                border: '1px solid var(--color-card-border)', borderRadius: '12px',
                padding: '1rem', background: 'rgba(255,255,255,0.02)'
              }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </Section>

      {/* Variants / Pricing */}
      <Section title="Variants & Pricing">
        {(form.variants || []).length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            No variants yet. Add weight/pack sizes with pricing.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {(form.variants || []).map((variant, idx) => (
            <div key={variant.id || idx} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '0.75rem', alignItems: 'end',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', padding: '1rem'
            }}>
              <Input
                label="Weight / Pack Size"
                value={variant.weight}
                onChange={e => updateVariant(idx, 'weight', e.target.value)}
                placeholder="e.g. 1 kg"
              />
              <Input
                label="Price (₹)"
                value={variant.price}
                type="number"
                onChange={e => updateVariant(idx, 'price', e.target.value)}
                placeholder="e.g. 699"
              />
              <Input
                label="Stock"
                value={variant.stock}
                type="number"
                onChange={e => updateVariant(idx, 'stock', e.target.value)}
                placeholder="e.g. 50"
              />
              <button
                onClick={() => removeVariant(idx)}
                style={{
                  background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: '8px', padding: '0.6rem', color: '#ef4444',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '0', alignSelf: 'end',
                  height: '42px'
                }}
                title="Remove variant"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addVariant}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(34, 197, 94, 0.06)', border: '1px dashed rgba(34, 197, 94, 0.25)',
            borderRadius: '10px', padding: '0.7rem 1.25rem',
            color: 'var(--color-crops)', cursor: 'pointer',
            fontFamily: 'var(--font-headers)', fontWeight: 600, fontSize: '0.85rem',
            transition: 'var(--transition-fast)', width: '100%', justifyContent: 'center'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.06)'}
        >
          <Plus size={16} /> Add Variant
        </button>
      </Section>

      {/* Product Details */}
      <Section title="Product Details">
        <div style={{ marginBottom: '1rem' }}>
          <Input
            label="Ingredients / Components (comma-separated)"
            value={form.ingredients}
            onChange={e => setField('ingredients', e.target.value)}
            placeholder="e.g. Trichoderma, Mycorrhiza, Bacillus subtilis"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block', fontSize: '0.85rem', fontWeight: 500,
            color: 'var(--color-text-muted)', marginBottom: '0.5rem',
            fontFamily: 'var(--font-headers)'
          }}>Application Guide</label>
          <textarea
            rows={4}
            value={form.application_guide}
            onChange={e => setField('application_guide', e.target.value)}
            placeholder="Step-by-step instructions for applying the product..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '0.75rem', color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)', resize: 'vertical',
              outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block', fontSize: '0.85rem', fontWeight: 500,
            color: 'var(--color-text-muted)', marginBottom: '0.5rem',
            fontFamily: 'var(--font-headers)'
          }}>Scientific Backing / Research Notes</label>
          <textarea
            rows={4}
            value={form.scientific_backing}
            onChange={e => setField('scientific_backing', e.target.value)}
            placeholder="Cite relevant research, studies, or scientific rationale..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              padding: '0.75rem', color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-body)', resize: 'vertical',
              outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box'
            }}
          />
        </div>
      </Section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
