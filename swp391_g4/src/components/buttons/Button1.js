// src/components/ui/button.js
import React from 'react';

export const Button = ({ children, variant, className, disabled }) => {
  const variantClass = variant === 'outline' ? 'border-2 text-blue-500' : 'bg-blue-500 text-white';
  return (
    <button
      className={`px-4 py-2 rounded-lg ${variantClass} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
