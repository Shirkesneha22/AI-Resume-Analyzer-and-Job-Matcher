import React from 'react';
import { Card } from '../ui/Card';

export const TechStack = () => {
  const stack = [
    { category: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'React Dropzone', 'Axios'] },
    { category: 'Backend', items: ['Python 3.11', 'FastAPI', 'Uvicorn', 'scikit-learn (TF-IDF)', 'spaCy', 'pydantic'] },
    { category: 'AI & Processing', items: ['Google Gemini API', 'pdfplumber', 'PyMuPDF (fitz)', 'In-Memory Stream Parsing'] },
  ];

  return (
    <section className="py-16 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl font-bold text-white">Production Technical Architecture</h3>
          <p className="text-slate-400 text-sm mt-1">Built with modular clean code standards for technical interview review.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stack.map((s, idx) => (
            <Card key={idx} className="border border-slate-800">
              <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4">{s.category}</h4>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
