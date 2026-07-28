import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Code, 
  Award, 
  MessageSquare, 
  Map, 
  Compass,
  FileText
} from 'lucide-react';

export const DetailedFeedbackTabs = ({ results }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary & Formatting', icon: FileText },
    { id: 'strengths', label: 'Strengths & Weaknesses', icon: CheckCircle2 },
    { id: 'missing', label: 'Missing Skills & Keywords', icon: Lightbulb },
    { id: 'projects', label: 'Projects & Certifications', icon: Code },
    { id: 'interview', label: 'Interview Preparation', icon: MessageSquare },
    { id: 'roadmap', label: 'Roadmap & Career Advice', icon: Map },
  ];

  const {
    summary,
    suggestions = [],
    strengths = [],
    weaknesses = [],
    missing_skills = [],
    keyword_density = [],
    projects = [],
    certifications = [],
    interview_tips = [],
    roadmap = [],
    career_advice = '',
  } = results;

  return (
    <Card className="border border-slate-800 space-y-6">
      
      {/* Tabs Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">

        {/* Tab 1: Executive Summary & Formatting */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Gemini AI Executive Candidate Summary
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">{summary}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> ATS Formatting & Actionable Suggestions
              </h4>
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    <span className="p-1 rounded bg-indigo-500/20 text-indigo-400 font-bold text-[10px]">{i + 1}</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Strengths & Weaknesses */}
        {activeTab === 'strengths' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-emerald-500/20">
              <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Key Resume Strengths
              </h4>
              <ul className="space-y-2">
                {strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-rose-500/20">
              <h4 className="text-sm font-bold text-rose-400 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Identified Weaknesses / Gaps
              </h4>
              <ul className="space-y-2">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-rose-400 font-bold">✗</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Missing Skills & Keyword Density */}
        {activeTab === 'missing' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-rose-400 mb-3">Top Missing Competencies from Job Description</h4>
              <div className="flex flex-wrap gap-2">
                {missing_skills.map((sk, i) => (
                  <Badge key={i} variant="missing" className="py-1.5 px-3 text-xs">
                    + Add {sk}
                  </Badge>
                ))}
              </div>
            </div>

            {keyword_density.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-3">TF-IDF Keyword Density Matrix</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {keyword_density.map((kd, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      kd.status === 'matched' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span className="font-medium truncate">{kd.keyword}</span>
                      <span className="font-bold text-[10px]">{kd.status === 'matched' ? '✓ Present' : '✗ Missing'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Recommended Projects & Certifications */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-indigo-400 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" /> Recommended Portfolio Projects
              </h4>
              <ul className="space-y-3">
                {projects.map((p, i) => (
                  <li key={i} className="glass-card p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-indigo-400 block mb-1">Project Idea #{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" /> High-Value Industry Certifications
              </h4>
              <ul className="space-y-3">
                {certifications.map((c, i) => (
                  <li key={i} className="glass-card p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: Technical Interview Tips */}
        {activeTab === 'interview' && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4" /> Technical & Behavioral Interview Preparation Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interview_tips.map((tip, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-emerald-400">Prep Focus #{i + 1}</span>
                  <p className="leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Learning Roadmap & Career Advice */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2 mb-3">
                <Map className="w-4 h-4" /> 30-60-90 Day Upskilling Roadmap
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roadmap.map((step, i) => (
                  <div key={i} className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/20 text-xs space-y-1">
                    <span className="font-bold text-indigo-300 block">Phase {i + 1}</span>
                    <p className="text-slate-300 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {career_advice && (
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-purple-500/20">
                <h4 className="text-sm font-bold text-purple-400 flex items-center gap-2 mb-2">
                  <Compass className="w-4 h-4" /> Long-Term Senior Career Guidance
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">{career_advice}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </Card>
  );
};
