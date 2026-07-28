import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "Is my resume stored or saved on any database?",
      a: "No. The application processes resumes 100% in-memory using byte streams. There is no database attached and no resume data is persisted on disk or server."
    },
    {
      q: "How does the weighted ATS score formula work?",
      a: "The final ATS score uses a realistic weighted formula: 40% Skills Match, 20% Experience Relevance, 10% Education Match, 20% Keyword Density, and 10% Resume Quality/Formatting."
    },
    {
      q: "What happens if I don't have a specific Job Description?",
      a: "Simply select your target role (e.g. AI Engineer, React Developer, Backend Engineer) from the dropdown. The FastAPI backend automatically generates a comprehensive industry-standard Job Description using Gemini API."
    },
    {
      q: "What file formats are supported for resume upload?",
      a: "PDF files up to 10MB are supported. We use pdfplumber with PyMuPDF (fitz) fallback to ensure text extraction even for complex layouts."
    },
    {
      q: "Can I download the analysis report?",
      a: "Yes! Click the 'Download PDF Report' button in the results section to export a clean report containing all scores, heatmaps, and AI recommendations."
    }
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-4 h-4" /> Got Questions?
          </div>
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div 
                key={i} 
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-white hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-300 border-t border-slate-800/60 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
