import React from 'react';
import { PRESET_ROLES } from '../../constants/roles';
import { Sparkles, FileCode, Briefcase } from 'lucide-react';

export const RoleSelector = ({ inputMode, setInputMode, selectedRole, setSelectedRole, customJd, setCustomJd }) => {
  return (
    <div className="w-full space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200">
          Target Evaluation Context
        </label>

        <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setInputMode('role')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              inputMode === 'role' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Select Role Dropdown
          </button>
          <button
            type="button"
            onClick={() => setInputMode('custom_jd')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              inputMode === 'custom_jd' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Custom JD
          </button>
        </div>
      </div>

      {inputMode === 'role' ? (
        <div>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-900/90 text-white border border-slate-700 rounded-xl px-4 py-3.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
            >
              {PRESET_ROLES.map((role, idx) => (
                <option key={idx} value={role} className="bg-slate-900 text-white py-2">
                  {role}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="mt-2 text-xs text-indigo-400/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini API will automatically generate a professional Job Description for this role.
          </p>
        </div>
      ) : (
        <div>
          <textarea
            value={customJd}
            onChange={(e) => setCustomJd(e.target.value)}
            placeholder="Paste complete job description requirements here (skills, qualifications, responsibilities)..."
            rows={5}
            className="w-full bg-slate-900/90 text-slate-100 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-500 resize-none"
          />
          <p className="mt-1 text-xs text-slate-400">
            Paste the raw text of the target position to compare keyword density.
          </p>
        </div>
      )}
    </div>
  );
};
