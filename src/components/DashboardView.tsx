import React from 'react';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2,
  Trash2,
  Compass,
  BookOpen,
} from 'lucide-react';
import { Project, Language } from '../types';
import { translations } from '../i18n/translations';

interface DashboardViewProps {
  projects: Project[];
  language: Language;
  onOpenProject: (projectId: string) => void;
  onNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  language,
  onOpenProject,
  onNewProject,
  onDeleteProject,
}) => {
  const t = translations[language];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Photoshop & Photopea Guided Workshop</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {t.dashboard.welcome}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.dashboard.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onNewProject}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>{t.dashboard.startNew}</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none" />
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            {t.dashboard.myProjects}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 p-8 space-y-4">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <p className="text-slate-300 font-semibold">{t.dashboard.noProjects}</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Turn your plain language idea into an approved design brief and full tutorial.
              </p>
            </div>
            <button
              onClick={onNewProject}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.dashboard.startNew}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const completedCount = project.steps?.filter((s) => s.status === 'done').length || 0;
              const totalSteps = project.steps?.length || 12;
              const percent = Math.round((completedCount / totalSteps) * 100);

              return (
                <div
                  key={project.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between space-y-4 shadow-lg group hover:shadow-amber-500/5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                        {project.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {project.ideaText || 'Custom design project.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    {/* Status & Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 capitalize">
                          {project.status.replace(/_/g, ' ')}
                        </span>
                        <span className="font-mono text-amber-400 font-bold">
                          {percent}% ({completedCount}/{totalSteps})
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenProject(project.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition border border-amber-500/20"
                      >
                        <span>{t.dashboard.resume}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
