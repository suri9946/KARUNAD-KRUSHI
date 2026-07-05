import React from 'react';

export default function Input({ label, type = 'text', value, onChange, placeholder, required = false, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginBottom: '1.25rem', ...style }}>
      {label && (
        <label style={{
          fontFamily: 'var(--font-headers)',
          fontSize: '0.85rem',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          letterSpacing: '0.5px'
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          color: 'var(--color-text-primary)',
          fontSize: '0.95rem',
          fontFamily: 'var(--font-body)',
          outline: 'none',
          transition: 'var(--transition-fast)'
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--color-crops)';
          e.target.style.boxShadow = '0 0 8px rgba(34, 197, 94, 0.2)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
    </div>
  );
}
