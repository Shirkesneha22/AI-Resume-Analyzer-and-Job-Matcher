import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { exportReportToPdf } from '../../utils/pdfExport';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export const ReportExporter = ({ candidateName, onReset }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await exportReportToPdf('analysis-report-content', candidateName);
    setDownloading(false);
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-20 z-40 bg-slate-900/90 shadow-xl">
      <div>
        <h4 className="text-sm font-bold text-white">Analysis Complete</h4>
        <p className="text-xs text-slate-400">Download printable PDF report or perform a new ATS evaluation.</p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button
          onClick={onReset}
          variant="secondary"
          size="md"
          className="w-full sm:w-auto gap-2 text-xs"
        >
          <RefreshCw className="w-4 h-4" />
          New Evaluation
        </Button>

        <Button
          onClick={handleDownload}
          disabled={downloading}
          variant="primary"
          size="md"
          className="w-full sm:w-auto gap-2 text-xs"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
