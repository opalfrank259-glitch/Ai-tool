import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Compass,
  FileCheck2,
  BookOpen,
  ArrowRight,
  Layers,
  Send,
} from 'lucide-react';
import { ProjectMode, Language } from '../types';

interface NewProjectModalProps {
  language: Language;
  onClose: () => void;
  onCreateProject: (ideaText: string, mode: ProjectMode) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  language,
  onClose,
  onCreateProject,
}) => {
  const [selectedMode, setSelectedMode] = useState<ProjectMode>('idea_to_final');
  const [ideaText, setIdeaText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;
    onCreateProject(ideaText, selectedMode);
  };

  const sampleIdeas = [
    'Lahori Chargha restaurant opening poster for Instagram & flex banner with 20% discount',
    'Eid-ul-Fitr designer lawn clothing collection announcement with gold typography',
    'Tech startup mobile app launch post with dark glassmorphism aesthetic',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Create a New Design Project
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Choose your learning mode to get tailored step-by-step guidance.
          </p>
        </div>

        {/* 4 Modes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setSelectedMode('idea_to_final')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              selectedMode === 'idea_to_final'
                ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-white">Start with an Idea</span>
            </div>
            <p className="text-xs text-slate-400">
              Full Journey: Idea → Brief → Concepts → Blueprint → 12-Step Build → Export.
            </p>
          </div>

          <div
            onClick={() => setSelectedMode('reference')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              selectedMode === 'reference'
                ? 'bg-sky-500/10 border-sky-500/60 ring-1 ring-sky-500/30'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Compass className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-sm text-white">Learn from Reference</span>
            </div>
            <p className="text-xs text-slate-400">
              Inspect interactive hotspots on existing posters to deconstruct layer plans.
            </p>
          </div>

          <div
            onClick={() => setSelectedMode('improve')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              selectedMode === 'improve'
                ? 'bg-purple-500/10 border-purple-500/60 ring-1 ring-purple-500/30'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <FileCheck2 className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-sm text-white">Improve Existing Design</span>
            </div>
            <p className="text-xs text-slate-400">
              Run automated contrast, bleed, safe margins, and QA rubric on your draft.
            </p>
          </div>

          <div
            onClick={() => setSelectedMode('practice')}
            className={`p-4 rounded-2xl border cursor-pointer transition ${
              selectedMode === 'practice'
                ? 'bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm text-white">Practice Challenge</span>
            </div>
            <p className="text-xs text-slate-400">
              Solve timed design briefs using progressive hint ladders.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Describe your idea in Roman Urdu, Urdu or English:
            </label>
            <textarea
              rows={3}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. Peshawar Chappal store opening discount banner with phone number and social media links..."
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 text-xs sm:text-sm p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Quick Idea Starters */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-500">Quick Starters:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleIdeas.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIdeaText(idea)}
                  className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition line-clamp-1"
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!ideaText.trim()}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Create Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
