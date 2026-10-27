import React from 'react';
import { Sparkles, Heart, ShieldCheck, Cpu } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white mb-3">
            <img 
              src="/logo.png" 
              alt="MatchCraft AI Logo" 
              className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5 border border-indigo-500/30" 
            />
            <span>MatchCraft AI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm mb-4">
            Production-grade AI Resume Analyzer & Job Matcher. Built with 100% in-memory security, TF-IDF NLP keyword heatmaps, multi-factor ATS scoring, and Google Gemini API integration.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
            <ShieldCheck className="w-4 h-4" /> Zero Database & Private In-Memory Processing
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Features</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-indigo-400 cursor-pointer">Weighted ATS Score (5 Factors)</li>
            <li className="hover:text-indigo-400 cursor-pointer">ATS Keyword Heatmap</li>
            <li className="hover:text-indigo-400 cursor-pointer">Resume Section Audit</li>
            <li className="hover:text-indigo-400 cursor-pointer">Resume Health Checklist</li>
            <li className="hover:text-indigo-400 cursor-pointer">PDF Report Export</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">Tech Stack</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> FastAPI & Python 3.11</li>
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-purple-400" /> React 18 & Vite</li>
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-pink-400" /> Gemini API & spaCy</li>
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-400" /> Tailwind CSS & Recharts</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 AI Resume Analyzer & Job Matcher. Open Source for Interview Showcase.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Senior AI Engineer Portfolio
        </p>
      </div>
    </footer>
  );
};
