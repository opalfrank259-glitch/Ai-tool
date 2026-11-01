import React from 'react';
import {
  Sparkles,
  Layers,
  Globe,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Language, Project } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  credits: number;
  activeProject: Project | null;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
  credits,
  activeProject,
  onOpenSettings,
}) => {
  const t = translations[language];

  // Stage progression helper
  const stages = [
    { id: 'brief', label: t.stages.brief, view: 'brief', unlocked: true },
    { id: 'concepts', label: t.stages.concepts, view: 'concepts', unlocked: activeProject?.status !== 'draft' },
    { id: 'blueprint', label: t.stages.blueprint, view: 'blueprint', unlocked: !!activeProject?.approvedConceptId },
    { id: 'learn', label: t.stages.learn, view: 'learn', unlocked: !!activeProject?.blueprint },
    { id: 'review', label: t.stages.review, view: 'review', unlocked: !!activeProject?.steps?.some(s => s.status === 'done') },
    { id: 'delivery', label: t.stages.delivery, view: 'delivery', unlocked: !!activeProject?.qaReview || activeProject?.status === 'delivered' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-200 via-white to-slate-200 bg-clip-text text-transparent">
                {t.appName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Photoshop & Photopea
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-sm">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'landing'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Intro & Tour</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentView === 'dashboard'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.nav.dashboard}
          </button>
          <button
            onClick={() => onNavigate('reference-analyzer')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'reference-analyzer'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-sky-400" />
            {t.nav.referenceAnalyzer}
          </button>
          <button
            onClick={() => onNavigate('practice')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'practice'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            {t.nav.practice}
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            {t.nav.admin}
          </button>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-3">
          {/* Credits chip */}
          <div
            title="Free Signup Grant: 50 credits (used for AI brief, concepts, blueprint, tutor & QA)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{credits}</span>
            <span className="text-[11px] text-amber-400/70 hidden sm:inline">{t.nav.credits}</span>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-slate-800 text-slate-200 text-xs font-medium pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ur-roman">Roman Urdu</option>
              <option value="en">English</option>
              <option value="ur">اردو (Urdu)</option>
            </select>
          </div>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title={t.nav.settings}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Project Stage Flow Breadcrumb / Tracker (when inside a project) */}
      {activeProject && (
        <div className="bg-slate-950/80 border-t border-slate-800/60 px-4 sm:px-8 py-2 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-2 min-w-max">
            <div className="flex items-center gap-2 text-slate-400 font-medium mr-4">
              <span className="text-slate-300 font-semibold truncate max-w-[200px]">
                {activeProject.title}
              </span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {activeProject.appName}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {stages.map((st, idx) => {
                const isActive = currentView === st.view;
                return (
                  <React.Fragment key={st.id}>
                    <button
                      onClick={() => st.unlocked && onNavigate(st.view)}
                      disabled={!st.unlocked}
                      className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
                          : st.unlocked
                          ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                          : 'text-slate-600 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isActive && <Sparkles className="w-3 h-3 text-amber-400" />}
                      {!isActive && st.unlocked && (
                        <CheckCircle2 className="w-3 h-3 text-slate-500" />
                      )}
                      <span>{st.label}</span>
                    </button>
                    {idx < stages.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-700" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
