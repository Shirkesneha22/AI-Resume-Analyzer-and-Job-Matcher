import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Cpu, Check, AlertTriangle, X } from 'lucide-react';

export const SkillHeatmap = ({ skillHeatmap, skillCategories }) => {
  // Group heatmap items by category
  const categories = {};

  skillHeatmap.forEach((item) => {
    const cat = item.category || 'General';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  return (
    <Card className="border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            ATS Categorized Skill Heatmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Green (✓ Matched), Yellow (⚡ Partial/Candidate), Red (✗ Missing from JD)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.keys(categories).length > 0 ? (
          Object.entries(categories).map(([category, items]) => (
            <div key={category} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
                {category} Domain
              </h4>
              <div className="flex flex-wrap gap-2">
                {items.map((sk, idx) => {
                  const variant = sk.status === 'matched' ? 'matched' : sk.status === 'partial' ? 'partial' : 'missing';
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        variant === 'matched'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : variant === 'partial'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {variant === 'matched' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      {variant === 'partial' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      {variant === 'missing' && <X className="w-3.5 h-3.5 text-rose-400" />}
                      {sk.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No skill categories extracted.</p>
        )}
      </div>
    </Card>
  );
};
