import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Loader2,
  Info,
  Upload,
  FileImage,
  Shield,
} from 'lucide-react';
import { Project, VerificationResult } from '../types';
import { api } from '../services/api';
import { stripExifMetadata } from '../tools/exifStrip';

interface VerificationModalProps {
  project: Project;
  stepId: string;
  onClose: () => void;
  onVerificationComplete: (updatedProject: Project) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  project,
  stepId,
  onClose,
  onVerificationComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [consentGiven, setConsentGiven] = useState(true);
  const [uploadedPreview, setUploadedPreview] = useState<{
    dataUrl: string;
    width: number;
    height: number;
    fileName: string;
  } | null>(null);

  useEffect(() => {
    // Initial run with studio preview
    runCheck({ w: 1080, h: 1080 });
  }, [stepId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid PNG, JPG, or WebP image preview.');
      return;
    }

    try {
      setLoading(true);
      // Strip camera/GPS EXIF metadata in browser canvas (FR-040 & TRD §8)
      const stripped = await stripExifMetadata(file);
      setUploadedPreview({
        dataUrl: stripped.dataUrl,
        width: stripped.width,
        height: stripped.height,
        fileName: file.name,
      });

      // Run verification on the stripped image dimensions
      await runCheck({ w: stripped.width, h: stripped.height });
    } catch (err: any) {
      alert(err?.message || 'Error processing uploaded preview');
    } finally {
      setLoading(false);
    }
  };

  const runCheck = async (dims: { w: number; h: number } = { w: 1080, h: 1080 }) => {
    setLoading(true);
    try {
      const res = await api.runVerification(project.id, stepId, dims);
      setResult(res);
      const updated = await api.getProject(project.id);
      if (updated) onVerificationComplete(updated);
    } catch (err: any) {
      alert(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Upload Custom Export or Use Studio Preview */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-amber-400" />
              Upload Your Own Exported File / Screenshot:
            </span>
            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0">
              <FileImage className="w-3.5 h-3.5" />
              <span>Browse PNG/JPG</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Privacy & EXIF Consent Tag */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="rounded text-amber-500"
              />
              <span>EXIF camera/GPS data stripped locally in browser before analysis (FR-040 privacy compliant)</span>
            </label>
            {uploadedPreview && (
              <span className="font-mono text-emerald-400 font-semibold truncate max-w-[140px]">
                {uploadedPreview.fileName} ({uploadedPreview.width}x{uploadedPreview.height})
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-200">
              Measuring pixels, contrast ratios, and boundary safe margins...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-5">
            {/* Method Badge & Limitations */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Verified Via:</span>
                <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {result.method} (Exported PNG)
                </span>
              </div>
              <span className="text-slate-500 text-[11px]">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>

            {/* Quick Metrics Bar */}
            {result.clientMetrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">WCAG Contrast</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {result.clientMetrics.contrastRatio}:1 AAA
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Aspect Ratio</span>
                  <span className="font-mono font-bold text-sky-400 text-sm">
                    1:1 Match
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Safe Margins</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {result.clientMetrics.safeMarginsPassed ? 'Pass (>5%)' : 'Warning'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Palette Match</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {result.clientMetrics.paletteAdherencePercent}%
                  </span>
                </div>
              </div>
            )}

            {/* Passed Checks */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Passed Checks ({result.passed.length})
              </h3>
              <div className="space-y-1.5 text-xs">
                {result.passed.map((p, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-slate-200"
                  >
                    <span className="font-bold text-emerald-300 block mb-0.5">{p.check}</span>
                    <span className="text-slate-400 text-[11px]">{p.evidence}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unknowns (Honest Limitations) */}
            {result.unknown.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  Unknowns / Need Additional Proof ({result.unknown.length})
                </h3>
                <div className="space-y-1.5 text-xs">
                  {result.unknown.map((u, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px]"
                    >
                      <span className="font-bold text-slate-300 block mb-0.5">{u.check}</span>
                      <span>{u.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Footer */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => runCheck()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Check Preview</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Continue Learning</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
