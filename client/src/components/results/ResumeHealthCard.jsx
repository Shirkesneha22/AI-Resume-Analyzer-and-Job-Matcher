import React from 'react';
import { Card } from '../ui/Card';
import { Star, Check, X, ShieldAlert, HeartPulse } from 'lucide-react';

export const ResumeHealthCard = ({ resumeHealth }) => {
  const { stars, checklist } = resumeHealth;

  const items = [
    { key: 'grammar', label: 'Grammar & Readability' },
    { key: 'formatting', label: 'Structured Layout' },
    { key: 'length', label: 'Optimal Length (250-850 words)' },
    { key: 'projects', label: 'Projects Section' },
    { key: 'achievements', label: 'Achievements Section' },
    { key: 'action_verbs', label: 'Action Verbs Used (Built, Led, Scaled)' },
    { key: 'numbers_used', label: 'Quantified Metrics (%, $, Numbers)' },
    { key: 'contact_details', label: 'Email & Phone Contact' },
    { key: 'linkedin', label: 'LinkedIn Profile' },
    { key: 'portfolio', label: 'Portfolio Link' },
    { key: 'github', label: 'GitHub Profile Link' },
  ];

  return (
    <Card className="border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-pink-400" />
          Resume Health Score
        </h3>

        {/* Star Rating Display */}
        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(stars) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-amber-400 ml-1">{stars} / 5.0</span>
        </div>
      </div>

      {/* Health Checklist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {items.map((item) => {
          const isPassed = checklist[item.key];
          return (
            <div
              key={item.key}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                isPassed 
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-300'
              }`}
            >
              <span>{item.label}</span>
              {isPassed ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
