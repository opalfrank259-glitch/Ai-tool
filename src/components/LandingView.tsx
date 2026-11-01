import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Compass,
  FileCheck2,
  BookOpen,
  Monitor,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface LandingViewProps {
  language: Language;
  onStartProject: () => void;
  onExploreDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  language,
  onStartProject,
  onExploreDemo,
}) => {
  const t = translations[language];

  const stepsFlow = [
    {
      num: '01',
      title: 'Idea to Brief',
      desc: 'Describe your design in Roman Urdu, Urdu, or English. AI structure facts without inventing false details.',
    },
    {
      num: '02',
      title: 'Compare Visual Concepts',
      desc: 'Evaluate 2-3 distinct visual directions with color swatches & typography roles before touching software.',
    },
    {
      num: '03',
      title: '12-Step Guided Build',
      desc: 'Learn exact menu paths, shortcuts, layer masks, and grounding shadows with live canvas visualizer.',
    },
    {
      num: '04',
      title: 'Automated Pre-Flight Check',
      desc: 'Real browser calculations for WCAG contrast (AAA), safe 5% margins, and aspect ratio compliance.',
    },
    {
      num: '05',
      title: 'Delivery & Print Shop Pack',
      desc: 'Export sRGB PNG for social media and 300 DPI CMYK-ready PDF for outdoor flex printers.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-6">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Photoshop & Photopea Guided Creation Workshop</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Turn your plain idea into a design you{' '}
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-amber-200 bg-clip-text text-transparent">
            understand & build
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {language === 'ur-roman'
            ? 'Photoshop aur Photopea step-by-step seekhein. Sirf AI generation nahi, balki asal software ke tools, shortcuts aur design theory samjhein.'
            : 'A calm, confidence-building tutor that teaches you why and how to use design tools instead of silently spitting out flat images.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartProject}
            className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.03]"
          >
            <span>Start Your First Poster</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreDemo}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 flex items-center gap-2 transition"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Explore Karachi Biryani Demo</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-4">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>50 Free Signup Credits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Roman Urdu, English & Urdu RTL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Live Photopea & Photoshop Ready</span>
          </div>
        </div>
      </div>

      {/* The 5-Stage Guided Learning Loop */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
            The Learning & Creation Loop
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Understand → Plan → Teach → Verify → Export
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stepsFlow.map((st, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 relative overflow-hidden"
            >
              <span className="text-2xl font-black font-mono text-slate-700">
                {st.num}
              </span>
              <h3 className="font-bold text-white text-sm">{st.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Monitor className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Integrated Canvas & Live Photopea</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Switch between interactive layers with safe guides or work directly inside embedded Photopea right in your browser.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Deep AI Design Mentor</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Equipped with High Thinking Mode for intricate typography pairings, curves adjustments, and step-by-step Roman Urdu explanations.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Honest Verification Badges</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every review clearly identifies whether evidence was verified via editor, exported preview, or screenshot, with zero false claims.
          </p>
        </div>
      </div>

      {/* Call to action footer */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Start your first promotional poster now</h3>
          <p className="text-xs text-slate-400">
            Free 50 credits grant included automatically. No API key setup required.
          </p>
        </div>
        <button
          onClick={onStartProject}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shrink-0 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
        >
          <span>Open Design Workshop</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
