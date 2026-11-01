import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Download,
  Info,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Project } from '../types';

interface InteractiveCanvasProps {
  project: Project;
  onSelectLayer?: (layerName: string) => void;
}

export const InteractiveCanvasSimulator: React.FC<InteractiveCanvasProps> = ({
  project,
  onSelectLayer,
}) => {
  const [studioMode, setStudioMode] = useState<'interactive' | 'photopea'>('interactive');
  const [showGuides, setShowGuides] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLayer, setActiveLayer] = useState<string | null>('Headline_Text');

  // Layer group visibility states
  const [layerVisibility, setLayerVisibility] = useState({
    colorGrading: true,
    typography: true,
    depthEffects: true,
    heroSubject: true,
    background: true,
  });

  const toggleGroup = (key: keyof typeof layerVisibility) => {
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectLayer = (name: string) => {
    setActiveLayer(name);
    if (onSelectLayer) onSelectLayer(name);
  };

  const handleExportMock = () => {
    // Generate a downloadable canvas snapshot
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw background
      ctx.fillStyle = '#1E1B18';
      ctx.fillRect(0, 0, 1080, 1080);

      const rad = ctx.createRadialGradient(540, 540, 50, 540, 540, 600);
      rad.addColorStop(0, '#450A0A');
      rad.addColorStop(1, '#1A0808');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Draw dish plate circle
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(540, 580, 260, 0, Math.PI * 2);
      ctx.fill();

      // Draw Headline
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(project.brief?.facts?.businessName || 'KARACHI BIRYANI', 540, 200);

      // Draw Badge
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      ctx.arc(880, 240, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('20% OFF', 880, 245);

      // Draw CTA
      ctx.fillStyle = '#F59E0B';
      ctx.roundRect(340, 880, 400, 70, [35]);
      ctx.fill();
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('ORDER: 0300-1234567', 540, 925);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/\s+/g, '_')}_preview.png`;
      a.click();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Studio Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs gap-2">
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setStudioMode('interactive')}
              className={`px-2.5 py-1 rounded-md font-semibold transition ${
                studioMode === 'interactive'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Layers
            </button>
            <button
              onClick={() => setStudioMode('photopea')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1.5 ${
                studioMode === 'photopea'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Live Photopea</span>
              <span className="text-[9px] uppercase px-1 rounded bg-slate-900 text-sky-300 font-mono">
                Web
              </span>
            </button>
          </div>

          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[11px] border border-slate-700/60 hidden sm:inline">
            1080 x 1080 px • 300 DPI
          </span>
        </div>

        <div className="flex items-center gap-2">
          {studioMode === 'interactive' && (
            <>
              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition text-xs ${
                  showGuides
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Safe Guides (50px)</span>
              </button>

              <div className="flex items-center bg-slate-800 rounded-md border border-slate-700">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                  className="p-1 hover:text-white text-slate-400"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-[11px] font-mono text-slate-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                  className="p-1 hover:text-white text-slate-400"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {studioMode === 'photopea' && (
            <a
              href="https://www.photopea.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-md bg-slate-800 text-sky-300 hover:text-white flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </a>
          )}

          <button
            onClick={handleExportMock}
            className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold flex items-center gap-1 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 overflow-hidden min-h-[460px]">
        {studioMode === 'photopea' ? (
          <div className="w-full h-full min-h-[460px] flex flex-col rounded-xl overflow-hidden border border-slate-700 bg-black">
            <iframe
              src="https://www.photopea.com"
              title="Photopea Editor"
              className="w-full flex-1 border-0"
              allow="camera; microphone; clipboard-read; clipboard-write; display-capture"
            />
          </div>
        ) : (
          <>
            {/* Subtle grid pattern background */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* 1080x1080 Simulated Canvas viewport */}
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.15s ease-out',
                width: '420px',
                height: '420px',
              }}
              className="relative bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700 select-none cursor-default"
            >
          {/* Layer 5: Background Radial Glow */}
          {layerVisibility.background && (
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background:
                  'radial-gradient(circle at 50% 55%, #450A0A 0%, #1A0808 65%, #0B0404 100%)',
              }}
            >
              {/* Subtle texture particles */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    'radial-gradient(#F59E0B 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
            </div>
          )}

          {/* Layer 4: Food Hero Subject & Contact Shadow */}
          {layerVisibility.heroSubject && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Soft Grounding Shadow */}
              <div
                className="absolute w-64 h-16 rounded-[100%] bg-black/80 blur-md"
                style={{ top: '65%', transform: 'translateY(-50%)' }}
              />

              {/* Biryani Handi / Bowl Hero Graphic */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  selectLayer('Hero_Biryani_Bowl');
                }}
                className={`pointer-events-auto absolute w-60 h-60 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  activeLayer === 'Hero_Biryani_Bowl'
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black'
                    : 'hover:scale-[1.02]'
                }`}
                style={{ top: '35%', transform: 'translateY(-50%)' }}
              >
                {/* Photorealistic stylized dish visual representation */}
                <div className="relative w-52 h-52 rounded-full overflow-hidden shadow-2xl border-4 border-amber-800/60 bg-gradient-to-tr from-amber-900 via-amber-700 to-amber-950 p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 relative overflow-hidden flex items-center justify-center">
                    {/* Rice textures and saffron hues */}
                    <div className="absolute inset-0 opacity-80 mix-blend-overlay bg-amber-900" />
                    <div className="text-center text-amber-950 font-bold text-xs uppercase tracking-wider z-10 px-4 py-2 bg-amber-100/90 rounded-full shadow-lg backdrop-blur">
                      🍛 Authentic Dum Biryani
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layer 3: Atmospheric Depth & Steam */}
          {layerVisibility.depthEffects && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-32 bg-white/10 blur-xl rounded-full" />
              {/* Floating bay leaves and spice dust */}
              <div className="absolute top-8 left-6 w-8 h-8 rounded-full bg-amber-500/30 blur-sm animate-pulse" />
              <div className="absolute bottom-16 right-8 w-6 h-6 rounded-full bg-rose-500/40 blur-xs" />
            </div>
          )}

          {/* Layer 2: Typography & Badges */}
          {layerVisibility.typography && (
            <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
              {/* Top: Headline & Category Tag */}
              <div className="text-center pt-2 pointer-events-auto">
                <div
                  onClick={() => selectLayer('Headline_Text')}
                  className={`inline-block p-1 rounded transition cursor-pointer ${
                    activeLayer === 'Headline_Text'
                      ? 'bg-amber-500/20 ring-1 ring-amber-400'
                      : ''
                  }`}
                >
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-400 drop-shadow">
                    GRAND OPENING CELEBRATION
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-none mt-0.5">
                    {project.brief?.facts?.businessName || 'KARACHI BIRYANI'}
                  </h1>
                </div>
              </div>

              {/* Discount Offer Badge (Top Right) */}
              <div
                onClick={() => selectLayer('Offer_Badge')}
                className={`absolute top-10 right-6 pointer-events-auto cursor-pointer transition-transform hover:scale-105 ${
                  activeLayer === 'Offer_Badge'
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black rounded-full'
                    : ''
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-700 to-rose-500 text-white flex flex-col items-center justify-center shadow-2xl border-2 border-white rotate-6">
                  <span className="text-[9px] font-bold uppercase tracking-tighter">FLAT</span>
                  <span className="text-base font-black leading-none">20%</span>
                  <span className="text-[8px] font-semibold uppercase tracking-tighter">OFF</span>
                </div>
              </div>

              {/* Bottom: Call to Action & Address */}
              <div className="space-y-1.5 pb-2 text-center pointer-events-auto">
                {/* CTA Button */}
                <div
                  onClick={() => selectLayer('CTA_Group')}
                  className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.02] ${
                    activeLayer === 'CTA_Group'
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                      : ''
                  }`}
                >
                  <span>ORDER NOW:</span>
                  <span className="font-mono">{project.brief?.facts?.contactNumber || '0300-1234567'}</span>
                </div>

                {/* Footer Address */}
                <div
                  onClick={() => selectLayer('Address_Line')}
                  className={`text-[10px] text-slate-300 font-medium cursor-pointer ${
                    activeLayer === 'Address_Line' ? 'text-amber-300 font-bold' : ''
                  }`}
                >
                  {project.brief?.facts?.address || 'Main Clifton Road, Karachi'} • Opening 15th Nov
                </div>
              </div>
            </div>
          )}

          {/* Layer 1: Global Curves Color Grading */}
          {layerVisibility.colorGrading && (
            <div className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-20 bg-gradient-to-t from-transparent via-amber-900/30 to-rose-900/40" />
          )}

          {/* Interactive Safe Guides Overlay */}
          {showGuides && (
            <div className="absolute inset-0 pointer-events-none">
              {/* 50px Safe Margin Box */}
              <div className="absolute inset-[24px] border border-sky-400/70 border-dashed rounded-xs">
                <span className="absolute top-1 left-1 text-[8px] font-mono text-sky-300 bg-slate-950/80 px-1 rounded">
                  Safe Zone 5%
                </span>
              </div>
              {/* Center Crosshairs */}
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-sky-400/20" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-sky-400/20" />
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* Layer Group Quick Controls Footer */}
      <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Layers:</span>
          <button
            onClick={() => toggleGroup('colorGrading')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
              layerVisibility.colorGrading
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-slate-800 text-slate-500 line-through'
            }`}
          >
            {layerVisibility.colorGrading ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Color Grading
          </button>
          <button
            onClick={() => toggleGroup('typography')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
              layerVisibility.typography
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-500 line-through'
            }`}
          >
            {layerVisibility.typography ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Typography & Badges
          </button>
          <button
            onClick={() => toggleGroup('heroSubject')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
              layerVisibility.heroSubject
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-500 line-through'
            }`}
          >
            {layerVisibility.heroSubject ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Food Hero
          </button>
          <button
            onClick={() => toggleGroup('background')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
              layerVisibility.background
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-500 line-through'
            }`}
          >
            {layerVisibility.background ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            Background Glow
          </button>
        </div>

        {activeLayer && (
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-400">Selected:</span>
            <span className="font-mono text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {activeLayer}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
