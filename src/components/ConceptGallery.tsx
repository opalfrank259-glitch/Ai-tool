import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Palette,
  Type,
  Layout,
  Info,
  Edit3,
  Loader2,
} from 'lucide-react';
import { Project, Language, ConceptDirection } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface ConceptGalleryProps {
  project: Project;
  language: Language;
  onConceptApproved: (updatedProject: Project) => void;
  onProceedToBlueprint: () => void;
}

export const ConceptGallery: React.FC<ConceptGalleryProps> = ({
  project,
  language,
  onConceptApproved,
  onProceedToBlueprint,
}) => {
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [activeRevisionId, setActiveRevisionId] = useState<string | null>(null);

  const concepts = project.concepts || [];
  const approvedConcept = concepts.find((c) => c.approved);

  const handleSelectConcept = async (conceptId: string) => {
    setLoading(true);
    try {
      const updated = await api.approveConcept(project.id, conceptId);
      onConceptApproved(updated);
    } catch (err: any) {
      alert(err?.message || 'Failed to approve concept');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRevision = async (conceptId: string) => {
    if (!revisionNote.trim()) return;
    const projectCopy = { ...project };
    if (projectCopy.concepts) {
      projectCopy.concepts = projectCopy.concepts.map((c) =>
        c.id === conceptId ? { ...c, revisionNote } : c
      );
      await api.updateProject(projectCopy);
      onConceptApproved(projectCopy);
      setActiveRevisionId(null);
      setRevisionNote('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.concepts.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.concepts.subtitle}
          </p>
        </div>

        {approvedConcept && (
          <button
            onClick={onProceedToBlueprint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <span>{t.concepts.proceedToBlueprint}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Honest Disclaimer Banner (Mandatory per PRD) */}
      <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3 text-sky-200 text-xs">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sky-300">Honest AI Preview Disclaimer: </span>
          <span>{t.concepts.disclaimer}</span>
        </div>
      </div>

      {/* Concept Directions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {concepts.map((concept) => {
          const isApproved = concept.approved;

          return (
            <div
              key={concept.id}
              className={`bg-slate-900 rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                isApproved
                  ? 'border-amber-500/80 ring-2 ring-amber-500/20 shadow-xl shadow-amber-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-6 space-y-5">
                {/* Visual Preview Swatch Banner */}
                <div
                  className="w-full h-44 rounded-xl relative overflow-hidden flex items-center justify-center p-4 border border-slate-700/60 shadow-inner"
                  style={{ background: concept.previewSvgBg }}
                >
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-500/30">
                      {concept.mood}
                    </span>
                    <h3 className="text-lg font-black text-white drop-shadow-md">
                      {concept.title}
                    </h3>
                  </div>

                  {isApproved && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.concepts.approved}</span>
                    </div>
                  )}
                </div>

                {/* One line summary */}
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {concept.oneLineIdea}
                </p>

                {/* Palette */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    Color Palette (4-6 Colors):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {concept.palette.map((swatch, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-[11px]"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-slate-300 font-medium">{swatch.name}</span>
                        <span className="text-slate-500 font-mono text-[10px]">{swatch.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography & Layout Directions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Type className="w-3 h-3 text-sky-400" />
                      Typography:
                    </span>
                    <p className="text-slate-300 text-[11px]">{concept.typographyDirection}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-400 flex items-center gap-1">
                      <Layout className="w-3 h-3 text-purple-400" />
                      Layout:
                    </span>
                    <p className="text-slate-300 text-[11px]">{concept.layoutDirection}</p>
                  </div>
                </div>

                {/* Pros and Limitations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="space-y-1">
                    <span className="font-semibold text-emerald-400">Pros:</span>
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5">
                      {concept.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-amber-400">Limitations:</span>
                    <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                      {concept.limitations.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Revision Note Box if active */}
                {activeRevisionId === concept.id && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <label className="font-semibold text-slate-300">
                      Add Revision Request Note:
                    </label>
                    <textarea
                      rows={2}
                      value={revisionNote}
                      onChange={(e) => setRevisionNote(e.target.value)}
                      placeholder="e.g. Make background darker, add gold borders, make discount text larger..."
                      className="w-full bg-slate-900 text-slate-100 p-2 rounded-lg border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveRevisionId(null)}
                        className="px-2.5 py-1 rounded text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveRevision(concept.id)}
                        className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setActiveRevisionId(activeRevisionId === concept.id ? null : concept.id);
                    setRevisionNote(concept.revisionNote || '');
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{concept.revisionNote ? 'Edit Revision' : t.concepts.reviseWithNote}</span>
                </button>

                <button
                  onClick={() => handleSelectConcept(concept.id)}
                  disabled={loading || isApproved}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    isApproved
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{isApproved ? t.concepts.approved : t.concepts.approve}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
