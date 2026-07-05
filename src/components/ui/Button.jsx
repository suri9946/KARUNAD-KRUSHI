import React from 'react';

export default function Button({ children, onClick, type = 'button', variant = 'primary', style = {}, ...props }) {
  const isSecondary = variant === 'secondary';
  const buttonStyle = isSecondary ? 'premium-btn-secondary' : 'premium-btn';

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyle}
      style={{ ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
