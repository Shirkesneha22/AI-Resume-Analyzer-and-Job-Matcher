import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2, ArrowRight, Shield, Zap, Target } from 'lucide-react';
import { Button } from '../ui/Button';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-medium mb-6"
        >
          <img src="/logo.png" alt="MatchCraft AI" className="w-5 h-5 rounded-md object-contain" />
          <span>Next-Gen Enterprise ATS Engine & Gemini AI Integration</span>
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]"
        >
          Optimize Your Resume for{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            ATS & Top Tech Roles
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Upload your resume PDF, match against custom Job Descriptions or pre-set engineering roles, and receive weighted ATS scores, skill heatmaps, and AI career advice.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/analyzer">
            <Button size="lg" className="w-full sm:w-auto gap-2 group text-base">
              Analyze Resume Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
              View How It Works
            </Button>
          </a>
        </motion.div>

        {/* Key Feature Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mb-1">5-Factor</div>
            <div className="text-xs text-slate-400 font-medium">Weighted ATS Scoring</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mb-1">100%</div>
            <div className="text-xs text-slate-400 font-medium">In-Memory Privacy</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-pink-400 mb-1">17+</div>
            <div className="text-xs text-slate-400 font-medium">Tech Role Generators</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mb-1">PDF Export</div>
            <div className="text-xs text-slate-400 font-medium">Downloadable Reports</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
