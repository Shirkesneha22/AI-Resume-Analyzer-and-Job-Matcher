import React from 'react';
import { Card } from '../ui/Card';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const SectionAuditCard = ({ sectionsAudit }) => {
  const { present_sections = [], missing_sections = [] } = sectionsAudit;

  return (
    <Card className="border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          Resume Section Audit
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {present_sections.length} Present • {missing_sections.length} Missing
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Present Sections */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" /> Present Sections
          </div>
          <div className="flex flex-wrap gap-1.5">
            {present_sections.length > 0 ? (
              present_sections.map((sec, i) => (
                <Badge key={i} variant="matched">
                  ✓ {sec}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-500">None detected</span>
            )}
          </div>
        </div>

        {/* Missing Sections */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider mb-2">
            <XCircle className="w-4 h-4" /> Missing Sections
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missing_sections.length > 0 ? (
              missing_sections.map((sec, i) => (
                <Badge key={i} variant="missing">
                  ✗ {sec}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-emerald-400">All key sections present!</span>
            )}
          </div>
        </div>

      </div>
    </Card>
  );
};
