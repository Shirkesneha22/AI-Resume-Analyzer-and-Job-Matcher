import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const UploadZone = ({ file, setFile, error }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-200 mb-2">
        Upload Candidate Resume (PDF) <span className="text-rose-400">*</span>
      </label>

      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' 
              : 'border-slate-700 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-800/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <div className="p-4 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-base font-semibold text-white mb-1">
              {isDragActive ? 'Drop PDF resume here...' : 'Click to upload or drag & drop PDF'}
            </p>
            <p className="text-xs text-slate-400">PDF files up to 10MB (In-Memory Processing)</p>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{file.name}</p>
              <p className="text-xs text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for ATS Analysis
              </p>
            </div>
          </div>

          <button
            onClick={() => setFile(null)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
            title="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
