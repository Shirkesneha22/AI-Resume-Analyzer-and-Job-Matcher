import React from 'react';
import { Upload, FileSearch, Sparkles, BarChart2 } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      icon: Upload,
      title: 'Upload PDF Resume',
      desc: 'Drag & drop your resume PDF. Text is extracted in-memory with pdfplumber and PyMuPDF fallback.',
    },
    {
      num: '02',
      icon: FileSearch,
      title: 'Select Role or Paste JD',
      desc: 'Choose from 17+ industry roles (AI Engineer, React Dev, SDE) to generate an AI JD, or paste your target job description.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'AI Analysis & Matching',
      desc: 'Google Gemini API analyzes skill taxonomy, keyword frequencies, section completeness, and missing competencies.',
    },
    {
      num: '04',
      icon: BarChart2,
      title: 'Inspect Report & Download',
      desc: 'Review your ATS score, radar chart, skill heatmap, project recommendations, and download a PDF report.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            How MatchCraft AI Works
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Simple 4-step workflow to audit and upgrade your resume in under 10 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-card rounded-2xl p-6 relative border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold text-indigo-500/40">{step.num}</span>
                  <div className="p-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
