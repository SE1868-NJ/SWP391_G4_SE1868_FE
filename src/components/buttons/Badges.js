// src/components/ui/badge.js
import React from 'react';

export const Badge = ({ children, variant, className }) => {
  const variantClass = variant === 'warning' ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <span className={`badge ${variantClass} text-white p-1 rounded ${className}`}>
      {children}
    </span>
  );
};
