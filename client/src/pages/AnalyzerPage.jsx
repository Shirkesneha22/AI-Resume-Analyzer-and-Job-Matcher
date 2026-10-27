import React from 'react';
import { useAnalyzer } from '../hooks/useAnalyzer';
import { AnalysisForm } from '../components/analyzer/AnalysisForm';
import { ScoreOverview } from '../components/results/ScoreOverview';
import { RadarChartCard } from '../components/results/RadarChartCard';
import { SkillPieChart } from '../components/results/SkillPieChart';
import { ResumeHealthCard } from '../components/results/ResumeHealthCard';
import { SectionAuditCard } from '../components/results/SectionAuditCard';
import { SkillHeatmap } from '../components/results/SkillHeatmap';
import { DetailedFeedbackTabs } from '../components/results/DetailedFeedbackTabs';
import { ReportExporter } from '../components/results/ReportExporter';

export const AnalyzerPage = () => {
  const analyzerHook = useAnalyzer();
  const { results, resetAnalysis } = analyzerHook;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 min-h-[80vh]">
      
      {!results ? (
        <div className="pt-4">
          <AnalysisForm analyzerHook={analyzerHook} />
        </div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Action Bar / Exporter Header */}
          <ReportExporter
            candidateName={results.parsed_contact_info?.name || 'Candidate'}
            onReset={resetAnalysis}
          />

          {/* Printable Report Wrapper */}
          <div id="analysis-report-content" className="space-y-8 p-4 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800">
            
            {/* Candidate Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 text-slate-300 text-xs sm:text-sm gap-2">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="MatchCraft AI Logo" 
                  className="w-10 h-10 rounded-xl object-contain bg-white/10 p-0.5 border border-indigo-500/30 flex-shrink-0" 
                />
                <div>
                  <span className="font-bold text-white text-lg block">
                    {results.parsed_contact_info?.name || 'Uploaded Candidate Resume'}
                  </span>
                  <span className="text-slate-400">
                    {results.parsed_contact_info?.email && `Email: ${results.parsed_contact_info.email}`}
                    {results.parsed_contact_info?.phone && ` • Phone: ${results.parsed_contact_info.phone}`}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-xl font-semibold">
                  Evaluated with Gemini AI & MatchCraft Engine
                </span>
              </div>
            </div>

            {/* Overall Score & Sub-Factors */}
            <ScoreOverview results={results} />

            {/* Recharts Grid: Radar Chart + Skill Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RadarChartCard results={results} />
              <SkillPieChart
                matchedSkillsCount={results.matched_skills.length}
                missingSkillsCount={results.missing_skills.length}
              />
            </div>

            {/* Health Checklist & Section Audit Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResumeHealthCard resumeHealth={results.resume_health} />
              <SectionAuditCard sectionsAudit={results.sections_audit} />
            </div>

            {/* Categorized Skill Heatmap */}
            <SkillHeatmap
              skillHeatmap={results.skill_heatmap}
              skillCategories={results.skill_categories}
            />

            {/* Detailed AI Feedback Tabs */}
            <DetailedFeedbackTabs results={results} />

          </div>

        </div>
      )}

    </div>
  );
};
