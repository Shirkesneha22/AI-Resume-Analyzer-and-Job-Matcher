import { useState } from 'react';
import { analyzeResumeApi } from '../services/api';

export const LOADING_STEPS = [
  { id: 1, label: '📄 Extracting Resume...', desc: 'Parsing PDF structure and contact info' },
  { id: 2, label: '🧠 Understanding Resume...', desc: 'Extracting candidate skill taxonomy' },
  { id: 3, label: '📋 Creating Job Description...', desc: 'Generating role requirements with Gemini' },
  { id: 4, label: '🔍 Comparing Skills...', desc: 'Building ATS keyword heatmap' },
  { id: 5, label: '📊 Calculating ATS Score...', desc: 'Applying 5-factor weighted formula' },
  { id: 6, label: '💡 Generating Suggestions...', desc: 'Synthesizing career roadmap & interview tips' },
  { id: 7, label: '✅ Done', desc: 'Analysis ready' }
];

export const useAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [inputMode, setInputMode] = useState('role'); // 'role' or 'custom_jd'
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [customJd, setCustomJd] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const simulateStepProgress = () => {
    setCurrentStepIndex(0);
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 2) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1200);
    return interval;
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a PDF resume first.');
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);

    const progressTimer = simulateStepProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (inputMode === 'custom_jd' && customJd.trim()) {
        formData.append('job_description', customJd.trim());
      } else {
        formData.append('role', selectedRole);
      }

      const data = await analyzeResumeApi(formData);

      clearInterval(progressTimer);
      setCurrentStepIndex(LOADING_STEPS.length - 1);
      
      setTimeout(() => {
        setResults(data);
        setLoading(false);
      }, 600);

    } catch (err) {
      clearInterval(progressTimer);
      setLoading(false);
      const msg = err.response?.data?.detail || err.message || 'Analysis failed. Please try again.';
      setError(msg);
    }
  };

  const resetAnalysis = () => {
    setResults(null);
    setError(null);
    setLoading(false);
    setCurrentStepIndex(0);
  };

  return {
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
    results,
    error,
    handleAnalyze,
    resetAnalysis,
  };
};
