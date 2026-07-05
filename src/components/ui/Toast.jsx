import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: 'hsl(30, 8%, 14%)',
      border: `1px solid ${isSuccess ? 'var(--color-crops)' : 'var(--color-crisis)'}`,
      borderRadius: '8px',
      padding: '1rem 1.25rem',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      minWidth: '280px',
      maxWidth: '400px',
      color: 'var(--color-text-primary)',
      fontFamily: 'var(--font-body)',
      fontSize: '0.9rem',
      animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ color: isSuccess ? 'var(--color-crops)' : 'var(--color-crisis)', display: 'flex' }}>
        {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      <div style={{ flex: 1, lineHeight: '1.4' }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          display: 'flex',
          padding: '2px'
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateY(20px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
