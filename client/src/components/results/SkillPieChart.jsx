import React from 'react';
import { Card } from '../ui/Card';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export const SkillPieChart = ({ matchedSkillsCount, missingSkillsCount }) => {
  const data = [
    { name: 'Matched Skills', value: matchedSkillsCount, color: '#10b981' },
    { name: 'Missing Skills', value: missingSkillsCount, color: '#f43f5e' },
  ];

  return (
    <Card className="border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-indigo-400" />
          Skill Ratio Breakdown
        </h3>
        <span className="text-xs text-slate-400 font-medium">Matched vs Missing</span>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-around text-center pt-2 border-t border-slate-800">
        <div>
          <div className="text-sm font-bold text-emerald-400">{matchedSkillsCount}</div>
          <div className="text-[10px] text-slate-400">Matched</div>
        </div>
        <div>
          <div className="text-sm font-bold text-rose-400">{missingSkillsCount}</div>
          <div className="text-[10px] text-slate-400">Missing</div>
        </div>
      </div>
    </Card>
  );
};
