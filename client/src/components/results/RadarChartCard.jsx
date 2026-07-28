import React from 'react';
import { Card } from '../ui/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

export const RadarChartCard = ({ results }) => {
  const data = [
    { subject: 'Skills Match', score: results.skill_score, fullMark: 100 },
    { subject: 'Experience', score: results.experience_score, fullMark: 100 },
    { subject: 'Education', score: results.education_score, fullMark: 100 },
    { subject: 'Keywords', score: results.keyword_score, fullMark: 100 },
    { subject: 'Formatting', score: results.formatting_score, fullMark: 100 },
  ];

  return (
    <Card className="border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          5-Axis ATS Radar Chart
        </h3>
        <span className="text-xs text-slate-400 font-medium">Competency Web</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
            <Radar
              name="Resume Match"
              dataKey="score"
              stroke="#818cf8"
              fill="#6366f1"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-400 text-center mt-2">
        Radar visualization highlights strengths and weak areas across ATS parameters.
      </p>
    </Card>
  );
};
