import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Language, PracticeAssignment } from '../types';
import { SEED_PRACTICE_ASSIGNMENTS } from '../services/api';

interface PracticeModeProps {
  language: Language;
}

export const PracticeModeView: React.FC<PracticeModeProps> = ({ language }) => {
  const assignments = SEED_PRACTICE_ASSIGNMENTS;
  const [selectedId, setSelectedId] = useState(assignments[0].id);
  const [unlockedHintIndex, setUnlockedHintIndex] = useState(0);

  const selected = assignments.find((a) => a.id === selectedId) || assignments[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Design Practice Challenges (Journey D)
          </h1>
        </div>
        <p className="text-sm text-slate-400 max-w-2xl">
          Build without a full solution. Use the progressive Hint Ladder (Nudge → Partial → Targeted → Full Step → Worked Example) only when stuck!
        </p>
      </div>

      {/* Assignment Chooser Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assignments.map((as) => (
          <div
            key={as.id}
            onClick={() => {
              setSelectedId(as.id);
              setUnlockedHintIndex(0);
            }}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              selected.id === as.id
                ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                {as.difficulty}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {as.timeEstimate}
              </span>
            </div>
            <h3 className="font-bold text-white text-base">{as.title}</h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{as.scenario}</p>
          </div>
        ))}
      </div>

      {/* Selected Challenge Workspace */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Learning Objective:
          </span>
          <p className="text-sm text-slate-200 font-medium">{selected.objective}</p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-white block mb-1">Scenario:</span>
            {selected.scenario}
          </div>
        </div>

        {/* Rubric Criteria */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Evaluation Rubric:
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {selected.rubric.map((r, i) => (
              <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Progressive Hint Ladder */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Progressive Hint Ladder (Staged Guidance):
            </span>
            <span className="text-[11px] text-slate-500">
              Unlocked {Math.min(unlockedHintIndex + 1, selected.hintLadder.length)} of {selected.hintLadder.length}
            </span>
          </div>

          <div className="space-y-2">
            {selected.hintLadder.map((hint, idx) => {
              const isUnlocked = idx <= unlockedHintIndex;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs transition ${
                    isUnlocked
                      ? 'bg-slate-950 border-purple-500/30 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isUnlocked
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      Level {idx + 1}: {hint.level}
                    </span>
                    {!isUnlocked && (
                      <span className="text-[10px] text-slate-500">Locked</span>
                    )}
                  </div>
                  {isUnlocked ? (
                    <p className="text-slate-300 text-[11px] leading-relaxed pt-1">
                      {hint.hint}
                    </p>
                  ) : (
                    <p className="text-slate-600 italic text-[11px]">
                      Try solving with earlier clues before revealing this level.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {unlockedHintIndex < selected.hintLadder.length - 1 && (
            <button
              onClick={() => setUnlockedHintIndex((i) => i + 1)}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 underline pt-1"
            >
              Reveal Next Clue Level ({selected.hintLadder[unlockedHintIndex + 1].level}) →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
