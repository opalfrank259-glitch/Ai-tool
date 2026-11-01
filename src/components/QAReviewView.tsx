import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ListOrdered,
  FileCheck2,
  Loader2,
} from 'lucide-react';
import { Project, Language, QAReview } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface QAReviewViewProps {
  project: Project;
  language: Language;
  onProceedToDelivery: () => void;
}

export const QAReviewView: React.FC<QAReviewViewProps> = ({
  project,
  language,
  onProceedToDelivery,
}) => {
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'important' | 'polish'>('all');

  const qa = project.qaReview;

  const handleRunQA = async () => {
    setLoading(true);
    try {
      await api.runQAReview(project.id);
      const updated = await api.getProject(project.id);
      if (updated?.qaReview) {
        project.qaReview = updated.qaReview;
      }
    } catch (err: any) {
      alert(err?.message || 'QA Review failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredFindings = qa?.findings.filter((f) => {
    if (activeTab === 'all') return true;
    return f.severity === activeTab;
  }) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.review.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.review.subtitle}
          </p>
        </div>

        <button
          onClick={onProceedToDelivery}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          <span>{t.review.proceedToDelivery}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {!qa ? (
        <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <p className="text-sm text-slate-300">
            No QA Review generated yet. Run the comprehensive design rubric to check technical and aesthetic compliance.
          </p>
          <button
            onClick={handleRunQA}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-purple-900/30 transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Run Final Design QA Review (Cost: 3 Credits)</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Executive Review Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{qa.summary}</p>
          </div>

          {/* Top 3 Prioritized Fixes */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <ListOrdered className="w-4 h-4" />
              Highest-Impact Recommended Fixes:
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {qa.topFixes.map((fix, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/30 text-amber-300 font-bold font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{fix}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Findings Filter Tabs */}
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Findings ({qa.findings.length})
            </button>
            <button
              onClick={() => setActiveTab('critical')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical (
              {qa.findings.filter((f) => f.severity === 'critical').length})
            </button>
            <button
              onClick={() => setActiveTab('important')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'important'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Important (
              {qa.findings.filter((f) => f.severity === 'important').length})
            </button>
            <button
              onClick={() => setActiveTab('polish')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'polish'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Polish ({qa.findings.filter((f) => f.severity === 'polish').length})
            </button>
          </div>

          {/* Findings Cards */}
          <div className="space-y-3">
            {filteredFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        finding.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : finding.severity === 'important'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {finding.severity}
                    </span>
                    <span className="font-bold text-white">{finding.category}</span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {finding.kind === 'objective' ? 'Technical (Objective)' : 'Aesthetic (Subjective)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Location:</span>
                    <span className="font-medium text-slate-200">{finding.where}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Why It Matters:</span>
                    <span className="text-slate-400">{finding.why}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-emerald-300">
                  <span className="font-bold block text-[11px] mb-1">Fix Instructions:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {finding.fix.map((fx, i) => (
                      <li key={i}>{fx}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
