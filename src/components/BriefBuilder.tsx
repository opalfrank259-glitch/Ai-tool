import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  PackageCheck,
  Send,
  Loader2,
  Lock,
} from 'lucide-react';
import { Project, Language } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface BriefBuilderProps {
  project: Project;
  language: Language;
  onBriefApproved: (updatedProject: Project) => void;
  onProceedToConcepts: () => void;
}

export const BriefBuilder: React.FC<BriefBuilderProps> = ({
  project,
  language,
  onBriefApproved,
  onProceedToConcepts,
}) => {
  const t = translations[language];
  const [ideaInput, setIdeaInput] = useState(project.ideaText || '');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const brief = project.brief;

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaInput.trim()) return;
    setLoading(true);
    try {
      await api.runIntake(project.id, ideaInput);
      const updated = await api.getProject(project.id);
      if (updated) onBriefApproved(updated);
    } catch (err: any) {
      alert(err?.message || 'Failed to generate brief');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const updated = await api.approveBrief(project.id, answers);
      onBriefApproved(updated);
    } catch (err: any) {
      alert(err?.message || 'Failed to approve brief');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.brief.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.brief.subtitle}
          </p>
        </div>

        {brief?.approved && (
          <button
            onClick={onProceedToConcepts}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.brief.generateConcepts}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Idea Intake Input Bar */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
        <label className="block text-sm font-semibold text-slate-200">
          {language === 'ur-roman' ? 'Apna Design Idea Likhein:' : 'Describe Your Design Idea:'}
        </label>
        <form onSubmit={handleGenerateBrief} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            disabled={brief?.approved}
            placeholder={t.brief.ideaInputPlaceholder}
            className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || brief?.approved || !ideaInput.trim()}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{t.brief.submitIdea}</span>
          </button>
        </form>
      </div>

      {/* Structured Brief Breakdown Card */}
      {brief && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confirmed Facts */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {t.brief.confirmedFacts}
              </h3>
              <div className="space-y-2 text-xs">
                {Object.entries(brief.facts).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-start py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-slate-100 font-semibold text-right max-w-xs">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Placeholders & Warnings */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t.brief.placeholders}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ur-roman'
                  ? 'AI ne koi jhooti phone number ya deal invent nahi ki. Yeh details user se approve karwani hain:'
                  : 'No facts were artificially invented. The following items require user approval:'}
              </p>
              <ul className="space-y-2 text-xs">
                {brief.placeholders.map((p, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Essential Missing Details (Interactive Q&A) */}
          {brief.missingRequiredFacts?.length > 0 && (
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">
                  {t.brief.essentialQuestions} (Max 3 questions per round)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brief.missingRequiredFacts.map((q) => (
                  <div key={q.key} className="space-y-1.5">
                    <label className="block text-xs font-medium text-slate-300">
                      {language === 'ur' || language === 'ur-roman' ? q.questionUrdu || q.question : q.question}
                    </label>
                    <input
                      type="text"
                      disabled={brief.approved}
                      value={answers[q.key] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                      placeholder={language === 'ur-roman' ? 'Yahan jawab likhein...' : 'Type answer here...'}
                      className="w-full bg-slate-950 text-slate-100 placeholder-slate-600 text-xs px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Deliverables Package */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-purple-400" />
              Recommended Deliverable Package (Seed Template)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {brief.deliverables?.map((d, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    d.selected
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{d.kind}</span>
                    {d.isOptional && (
                      <span className="text-[10px] text-slate-400 uppercase">Optional</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{d.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Action Footer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {brief.approved ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  {t.brief.approvedNotice}
                </span>
              ) : (
                <span>
                  {language === 'ur-roman'
                    ? 'Brief approve karne ke baad visual concepts generate honge.'
                    : 'Approving this brief unlocks visual concept generation.'}
                </span>
              )}
            </div>

            {!brief.approved ? (
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{t.brief.approveBrief}</span>
              </button>
            ) : (
              <button
                onClick={onProceedToConcepts}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.brief.generateConcepts}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
