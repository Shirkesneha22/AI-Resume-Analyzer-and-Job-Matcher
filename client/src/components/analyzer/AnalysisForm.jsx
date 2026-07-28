import React from 'react';
import { UploadZone } from './UploadZone';
import { RoleSelector } from './RoleSelector';
import { ProgressStepper } from './ProgressStepper';
import { Button } from '../ui/Button';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const AnalysisForm = ({ analyzerHook }) => {
  const {
    file,
    setFile,
    inputMode,
    setInputMode,
    selectedRole,
    setSelectedRole,
    customJd,
    setCustomJd,
    loading,
    currentStepIndex,
    error,
    handleAnalyze,
  } = analyzerHook;

  if (loading) {
    return <ProgressStepper currentStepIndex={currentStepIndex} />;
  }

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl max-w-3xl mx-auto space-y-8">
      
      <div className="border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Resume ATS Match Evaluator
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Upload candidate resume and select target role for instant AI analysis.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-medium">
          <ShieldCheck className="w-4 h-4" /> 100% In-Memory
        </div>
      </div>

      {/* Form Elements */}
      <div className="space-y-6">
        <UploadZone file={file} setFile={setFile} error={error} />
        
        <RoleSelector
          inputMode={inputMode}
          setInputMode={setInputMode}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          customJd={customJd}
          setCustomJd={setCustomJd}
        />
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-slate-800">
        <Button
          onClick={handleAnalyze}
          size="lg"
          className="w-full gap-2 text-base font-bold py-4 animate-pulse-slow shadow-xl shadow-indigo-600/30"
          disabled={!file}
        >
          <span>Calculate Weighted ATS Match & Generate Advice</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

    </div>
  );
};
