import React from 'react';

export default function Card({ children, className = '', style = {}, onClick, ...props }) {
  return (
    <div
      className={`glass-card ${className}`}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
