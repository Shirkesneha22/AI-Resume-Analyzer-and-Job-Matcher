import React from 'react';
import { Card } from '../ui/Card';
import { Award, Zap, CheckCircle, Percent } from 'lucide-react';

export const ScoreOverview = ({ results }) => {
  const { 
    score, 
    skill_score, 
    experience_score, 
    education_score, 
    keyword_score, 
    formatting_score,
    ats_compatibility_meter,
    job_readiness_meter
  } = results;

  // Determine color status based on score range
  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (val >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreStroke = (val) => {
    if (val >= 80) return '#10b981';
    if (val >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  // Circle circumference calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Main Circular ATS Score + Meters */}
      <Card className="border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Main Gauge SVG */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke={getScoreStroke(score)}
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">Overall ATS Match</span>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getScoreColor(score)}">
              <Award className="w-4 h-4" />
              {score >= 80 ? 'High ATS Match' : score >= 60 ? 'Moderate Match' : 'Needs Optimization'}
            </div>
          </div>

          {/* Bonus Meters */}
          <div className="lg:col-span-2 space-y-5 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-8 pt-6 lg:pt-0">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold mb-2">
                <span className="text-slate-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" /> ATS Compatibility Meter
                </span>
                <span className="text-indigo-400 font-bold">{ats_compatibility_meter}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${ats_compatibility_meter}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm font-semibold mb-2">
                <span className="text-slate-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Job Readiness Meter
                </span>
                <span className="text-emerald-400 font-bold">{job_readiness_meter}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${job_readiness_meter}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed italic pt-2">
              Formula: 0.4×Skills + 0.2×Experience + 0.1×Education + 0.2×Keywords + 0.1×Formatting Quality.
            </p>
          </div>

        </div>
      </Card>

      {/* 5-Factor Break-down Sub-Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Skills Match</div>
          <div className="text-2xl font-bold text-indigo-400">{skill_score}%</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Weight: 40%</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Experience</div>
          <div className="text-2xl font-bold text-purple-400">{experience_score}%</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Weight: 20%</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Education</div>
          <div className="text-2xl font-bold text-blue-400">{education_score}%</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Weight: 10%</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Keywords</div>
          <div className="text-2xl font-bold text-emerald-400">{keyword_score}%</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Weight: 20%</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center col-span-2 sm:col-span-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Formatting</div>
          <div className="text-2xl font-bold text-pink-400">{formatting_score}%</div>
          <div className="text-[10px] text-slate-500 font-medium mt-1">Weight: 10%</div>
        </div>

      </div>

    </div>
  );
};
