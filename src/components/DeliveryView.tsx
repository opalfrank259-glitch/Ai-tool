import React from 'react';
import {
  PackageCheck,
  Download,
  Printer,
  FileText,
  Share2,
  CheckCircle2,
  Layers,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Project, Language } from '../types';
import { translations } from '../i18n/translations';

interface DeliveryViewProps {
  project: Project;
  language: Language;
  onBackToDashboard: () => void;
}

export const DeliveryView: React.FC<DeliveryViewProps> = ({
  project,
  language,
  onBackToDashboard,
}) => {
  const t = translations[language];

  const handleDownloadSummary = () => {
    const summaryData = {
      product: 'AI Design Tutor & Creator',
      projectTitle: project.title,
      brief: project.brief,
      approvedConcept: project.concepts?.find((c) => c.approved),
      blueprint: project.blueprint,
      completedStepsCount: project.steps.filter((s) => s.status === 'done').length,
      totalSteps: project.steps.length,
      exportFormats: project.blueprint?.exportFormats,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_Summary.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PackageCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.delivery.title}
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.delivery.subtitle}
          </p>
        </div>

        <button
          onClick={handleDownloadSummary}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
        >
          <Download className="w-4 h-4" />
          <span>{t.delivery.downloadSummary}</span>
        </button>
      </div>

      {/* Celebration Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-2">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>{t.delivery.checklistComplete}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          {language === 'ur-roman'
            ? 'Mubarak ho! Aap ne poster ka brief, visual concept, technical blueprint, 12-step build aur QA review kamyabi se mukammal kar liya hai.'
            : 'Congratulations! You have completed the full journey from initial rough idea to validated production files.'}
        </p>
      </div>

      {/* Export Format Matrix */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          {t.delivery.exportGuide}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sky-400 text-sm">PNG (Digital)</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                1080x1080
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">
              For Instagram posts, WhatsApp Status, and website banners. Retains crisp text and rich sRGB colors.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              File: {project.title.replace(/\s+/g, '_')}_Digital.png
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-purple-400 text-sm">PDF (Print)</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                300 DPI
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">
              High Quality Print preset for panaflex printers, flyers, and shop front signboards.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              File: {project.title.replace(/\s+/g, '_')}_Print_A4.pdf
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-400 text-sm">PSD (Archive)</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                Master
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Layered source file with all Smart Objects, type layers, and curves intact for future price/phone updates.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              File: {project.title.replace(/\s+/g, '_')}_Master.psd
            </div>
          </div>
        </div>
      </div>

      {/* Print Shop Handoff Checklist */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Printer className="w-4 h-4 text-emerald-400" />
          {t.delivery.printNotes}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">Resolution Check:</span>
              <span className="text-slate-400 text-[11px]">Ensure 300 DPI is maintained. Do not stretch low-res 72 DPI graphics.</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">CMYK Color Mode:</span>
              <span className="text-slate-400 text-[11px]">Convert RGB to CMYK in Photoshop (Image &gt; Mode &gt; CMYK Color) for offset presses.</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">3mm Safe Bleed:</span>
              <span className="text-slate-400 text-[11px]">Extend background beyond cutting guides so no white border appears after guillotine trim.</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-200 block">Font Outlining:</span>
              <span className="text-slate-400 text-[11px]">Convert text to shapes (Type &gt; Convert to Shape) if the printer does not have your font.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Return to Dashboard */}
      <div className="flex justify-between items-center p-4">
        <button
          onClick={onBackToDashboard}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.delivery.backToDashboard}</span>
        </button>
      </div>
    </div>
  );
};
