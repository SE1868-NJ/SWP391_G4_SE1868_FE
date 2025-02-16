// src/components/ui/tabs.js
import React from 'react';

export const Tabs = ({ children, defaultValue }) => {
  return <div className="tabs-container">{children}</div>;
};

export const TabsList = ({ children, className }) => {
  return <div className={`tabs-list ${className}`}>{children}</div>;
};

export const TabsTrigger = ({ children, value, onClick }) => {
  return (
    <button
      className="tab-trigger"
      onClick={() => onClick(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value }) => {
  return <div className="tab-content">{children}</div>;
};
