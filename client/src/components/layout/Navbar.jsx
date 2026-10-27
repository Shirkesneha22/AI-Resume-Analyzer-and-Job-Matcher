import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Sun, Moon, Github, FileSearch } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="/logo.png" 
            alt="MatchCraft AI Logo" 
            className="w-9 h-9 rounded-xl object-contain bg-white/10 p-0.5 border border-indigo-500/30 group-hover:scale-105 transition-transform" 
          />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            MatchCraft AI
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link 
            to="/" 
            className={`hover:text-indigo-400 transition-colors ${location.pathname === '/' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/analyzer" 
            className={`hover:text-indigo-400 transition-colors ${location.pathname === '/analyzer' ? 'text-indigo-400 font-semibold' : ''}`}
          >
            ATS Analyzer
          </Link>
          <a href="#features" className="hover:text-indigo-400 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">
            Workflow
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          <a
            href="https://github.com/Shirkesneha22/AI-Resume-Analyzer-and-Job-Matcher"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub Repository
          </a>

          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all"
          >
            <FileSearch className="w-4 h-4" />
            Launch Analyzer
          </Link>
        </div>
      </div>
    </header>
  );
};
