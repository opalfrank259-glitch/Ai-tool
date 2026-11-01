import React, { useState } from 'react';
import {
  Compass,
  Layers,
  Sparkles,
  Info,
  Type,
  Maximize2,
  Sliders,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Language, ReferenceAnalysis, ReferenceHotspot } from '../types';
import { SEED_REFERENCE_ANALYSIS } from '../services/api';

interface ReferenceAnalyzerProps {
  language: Language;
  onStartFromReference?: () => void;
}

export const ReferenceAnalyzerView: React.FC<ReferenceAnalyzerProps> = ({
  language,
  onStartFromReference,
}) => {
  const analysis = SEED_REFERENCE_ANALYSIS;
  const [selectedHotspot, setSelectedHotspot] = useState<ReferenceHotspot>(
    analysis.hotspots[0]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Reference Design Breakdown (Journey B)
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Click any interactive hotspot on the poster to learn the exact Photoshop techniques, typography traits, and layer structure.
          </p>
        </div>

        {onStartFromReference && (
          <button
            onClick={onStartFromReference}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <span>Learn & Recreate This Style</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Honest Estimate Notice (Mandatory per PRD) */}
      <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3 text-sky-200 text-xs">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sky-300">Honest Reverse-Engineering Notice: </span>
          <span>{analysis.estimateNotice}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Image with Hotspot Overlays (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="relative max-w-md w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700 select-none">
            {/* Poster Graphic Simulation */}
            <div
              className="w-full aspect-[4/5] relative p-6 flex flex-col justify-between"
              style={{
                background:
                  'radial-gradient(circle at 50% 45%, #1E293B 0%, #0F172A 70%, #020617 100%)',
              }}
            >
              {/* Graphic Elements */}
              <div className="text-center pt-2">
                <span className="text-[10px] tracking-widest text-amber-400 font-bold uppercase">
                  ARTISAN GOURMET
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase mt-0.5 drop-shadow-lg">
                  THE SMOKEHOUSE SPECIAL
                </h2>
              </div>

              {/* Burger cutout */}
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-amber-800 via-amber-600 to-amber-900 flex items-center justify-center shadow-2xl border-2 border-amber-500/30">
                <span className="text-4xl">🍔</span>
              </div>

              {/* Price badge */}
              <div className="absolute top-28 right-8 w-14 h-14 rounded-full bg-orange-600 border-2 border-white text-white flex flex-col items-center justify-center shadow-xl rotate-12">
                <span className="text-[8px] font-bold">ONLY</span>
                <span className="text-xs font-black leading-none">$9.99</span>
              </div>

              {/* Bottom CTA */}
              <div className="text-center space-y-1">
                <div className="inline-block px-5 py-1.5 rounded-full bg-orange-500 text-slate-950 font-bold text-xs shadow-lg">
                  ORDER NOW • DELIVERY APPS
                </div>
                <div className="text-[10px] text-slate-400">
                  123 Main Avenue • Open 11 AM - 11 PM
                </div>
              </div>

              {/* Hotspot Click Overlays */}
              {analysis.hotspots.map((hs) => {
                const isSelected = selectedHotspot?.id === hs.id;
                return (
                  <div
                    key={hs.id}
                    onClick={() => setSelectedHotspot(hs)}
                    style={{
                      left: `${hs.box.x}%`,
                      top: `${hs.box.y}%`,
                      width: `${hs.box.w}%`,
                      height: `${hs.box.h}%`,
                    }}
                    className={`absolute rounded-lg cursor-pointer transition-all flex items-center justify-center ${
                      isSelected
                        ? 'border-2 border-amber-400 bg-amber-400/25 ring-4 ring-amber-400/20'
                        : 'border border-sky-400/60 bg-sky-500/10 hover:bg-sky-500/25'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-950/80 text-sky-300'
                      }`}
                    >
                      {hs.id.replace('hs-', 'Hotspot ')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
            {analysis.hotspots.map((hs) => (
              <button
                key={hs.id}
                onClick={() => setSelectedHotspot(hs)}
                className={`px-3 py-1 rounded-lg transition font-medium ${
                  selectedHotspot?.id === hs.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {hs.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Hotspot Breakdown & Technique Details (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {selectedHotspot.role}
            </span>
            <h2 className="text-lg font-bold text-white">
              {selectedHotspot.label}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-sky-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Estimated Photoshop Technique:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedHotspot.techniques}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                Typography & Styling Traits:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedHotspot.typographyTraits}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Layer Stack Advice:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {selectedHotspot.layerAdvice}
              </p>
            </div>
          </div>

          {/* Palette in Reference */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <span className="font-bold text-slate-300">Extracted Reference Palette:</span>
            <div className="flex gap-2">
              {analysis.palette.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.hex }} />
                  <span className="text-[10px] font-mono text-slate-400">{p.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
