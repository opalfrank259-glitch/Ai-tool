import React, { useState } from 'react';
import {
  Compass,
  Maximize,
  CheckCircle2,
  Palette,
  Type,
  FolderTree,
  ArrowRight,
  Sparkles,
  Printer,
  Sliders,
  Layers,
} from 'lucide-react';
import { Project, Language, Blueprint } from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';

interface BlueprintViewProps {
  project: Project;
  language: Language;
  onStartLearning: () => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  project,
  language,
  onStartLearning,
}) => {
  const t = translations[language];
  const blueprint = project.blueprint;
  const [selectedPreset, setSelectedPreset] = useState('1080x1080');

  if (!blueprint) {
    return (
      <div className="p-8 text-center text-slate-400">
        No blueprint generated yet. Please approve a concept first.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.blueprint.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.blueprint.subtitle}
          </p>
        </div>

        <button
          onClick={onStartLearning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.blueprint.startLearning}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Canvas Specifications Card */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Maximize className="w-4 h-4 text-sky-400" />
            {t.blueprint.canvasSpecs}
          </h3>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Preset:</span>
              <span className="text-slate-200 font-semibold">{blueprint.canvas.presetName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dimensions:</span>
              <span className="text-amber-400 font-mono font-bold">
                {blueprint.canvas.widthPx} × {blueprint.canvas.heightPx} px
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Resolution:</span>
              <span className="text-emerald-400 font-mono font-semibold">{blueprint.canvas.dpi} DPI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Color Mode:</span>
              <span className="text-slate-200">{blueprint.canvas.colorMode}</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 text-xs">
            <span className="text-slate-400 font-medium">Standard Presets:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedPreset('1080x1080')}
                className={`p-2 rounded-lg border text-left transition ${
                  selectedPreset === '1080x1080'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Instagram 1:1 (1080x1080)
              </button>
              <button
                onClick={() => setSelectedPreset('1080x1920')}
                className={`p-2 rounded-lg border text-left transition ${
                  selectedPreset === '1080x1920'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Story 9:16 (1080x1920)
              </button>
              <button
                onClick={() => setSelectedPreset('a4')}
                className={`p-2 rounded-lg border text-left transition ${
                  selectedPreset === 'a4'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                A4 Print (2480x3508)
              </button>
              <button
                onClick={() => setSelectedPreset('card')}
                className={`p-2 rounded-lg border text-left transition ${
                  selectedPreset === 'card'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Visiting Card (3.5x2 in)
              </button>
            </div>
          </div>
        </div>

        {/* Content Checklist */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {t.blueprint.contentChecklist}
          </h3>
          <ul className="space-y-2 text-xs">
            {blueprint.contentChecklist.map((item, idx) => (
              <li
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <span className="text-slate-300">{item.item}</span>
                <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Approved Palette */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            {t.blueprint.palette}
          </h3>
          <div className="space-y-2">
            {blueprint.palette.map((swatch, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="text-slate-300 font-medium">{swatch.name}</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">{swatch.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typography Hierarchy & Layer Architecture (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Typography Roles */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-400" />
            {t.blueprint.typography}
          </h3>
          <div className="space-y-3 text-xs">
            {blueprint.typographyHierarchy.map((ty, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-300">{ty.role}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{ty.sizePt} • {ty.weight}</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">Font: </span>
                  <span className="font-medium text-white">{ty.recommendedFont}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  <span>Fallback: {ty.fallback}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer Group Plan */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            {t.blueprint.layerPlan}
          </h3>
          <div className="space-y-2 text-xs">
            {blueprint.layerGroups.map((group, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-400">{group.groupName}</span>
                  <span className="text-slate-400 text-[11px]">— {group.purpose}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {group.layers.map((layer, lIdx) => (
                    <span
                      key={lIdx}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-mono border border-slate-800"
                    >
                      {layer}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button Footer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-base">
            Ready to Build in Photoshop or Photopea?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            The tutor will guide you through 12 manageable, non-destructive steps.
          </p>
        </div>
        <button
          onClick={onStartLearning}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.blueprint.startLearning}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
