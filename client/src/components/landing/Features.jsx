import React from 'react';
import { Card } from '../ui/Card';
import { Target, Activity, FileCheck, Layers, PieChart, Sparkles, Download, Shield } from 'lucide-react';

export const Features = () => {
  const featuresList = [
    {
      icon: Target,
      title: 'Weighted 5-Factor ATS Scoring',
      desc: 'Combines Skill Match (40%), Experience (20%), Education (10%), Keywords (20%), and Formatting (10%) for a realistic recruiter rating.',
      color: 'text-indigo-400',
    },
    {
      icon: Activity,
      title: 'ATS Keyword Heatmap',
      desc: 'Color-coded breakdown of Matched (Green), Partial (Yellow), and Missing (Red) keywords grouped by domain.',
      color: 'text-emerald-400',
    },
    {
      icon: FileCheck,
      title: 'Resume Health & Section Audit',
      desc: 'Automated 5-star health rating checking action verbs, metric counts, contact info, GitHub/Portfolio, and missing sections.',
      color: 'text-purple-400',
    },
    {
      icon: Sparkles,
      title: 'Gemini AI Career Reasoning',
      desc: 'Generates role-specific project recommendations, certification suggestions, technical interview prep tips, and a 30-60-90 day learning roadmap.',
      color: 'text-pink-400',
    },
    {
      icon: PieChart,
      title: 'Rich Interactive Recharts',
      desc: 'Visualize your candidacy via 5-axis Radar Charts, Matched vs Missing Skill Pie Charts, and Keyword Density distribution.',
      color: 'text-blue-400',
    },
    {
      icon: Download,
      title: 'One-Click PDF Report Exporter',
      desc: 'Export your comprehensive ATS evaluation report directly into a clean, printable PDF document.',
      color: 'text-amber-400',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-900/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Enterprise Features Built for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Modern Candidates
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Everything you need to beat ATS filters and land technical interview invitations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((f, i) => {
            const IconComponent = f.icon;
            return (
              <Card key={i} hover className="border border-slate-800">
                <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700 w-fit mb-4 ${f.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};
