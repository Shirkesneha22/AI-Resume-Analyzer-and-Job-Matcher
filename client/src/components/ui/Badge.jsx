import React from 'react';

export const Badge = ({ children, variant = 'matched', className = '' }) => {
  const variants = {
    matched: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    partial: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    missing: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
