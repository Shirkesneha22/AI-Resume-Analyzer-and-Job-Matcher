import React from 'react';
import { LOADING_STEPS } from '../../hooks/useAnalyzer';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

export const ProgressStepper = ({ currentStepIndex }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-indigo-950/20 max-w-xl mx-auto text-center space-y-6">
      <div className="flex items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        <h3 className="text-xl font-bold text-white">AI ATS Processing Engine Active</h3>
      </div>

      <div className="space-y-3 text-left max-w-md mx-auto">
        {LOADING_STEPS.slice(0, -1).map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div 
              key={step.id} 
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isCurrent 
                  ? 'bg-indigo-600/20 border border-indigo-500/40 text-white scale-[1.02]' 
                  : isDone 
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 opacity-80' 
                  : 'text-slate-500 opacity-40'
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
                <div>
                  <div className="text-sm font-semibold">{step.label}</div>
                  <div className="text-xs text-slate-400 font-normal">{step.desc}</div>
                </div>
              </div>

              {isDone && <span className="text-xs font-semibold text-emerald-400">Complete</span>}
              {isCurrent && <span className="text-xs font-semibold text-indigo-400">Processing...</span>}
            </div>
          );
        })}
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2 transition-all duration-500"
          style={{ width: `${Math.min(100, ((currentStepIndex + 1) / (LOADING_STEPS.length - 1)) * 100)}%` }}
        />
      </div>
    </div>
  );
};
