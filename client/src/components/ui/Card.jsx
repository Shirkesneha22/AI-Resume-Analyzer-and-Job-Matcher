import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 transition-all duration-300 ${hover ? 'hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  );
};
