import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  DollarSign,
  AlertOctagon,
  FileCode,
  Activity,
  Layers,
} from 'lucide-react';
import { Language } from '../types';

interface AdminViewProps {
  language: Language;
}

export const AdminView: React.FC<AdminViewProps> = () => {
  const modelRuns = [
    {
      id: 1,
      fn: 'ai-intake',
      model: 'gemini-3.8-flash',
      inputTokens: 412,
      outputTokens: 380,
      thinking: 'low',
      latencyMs: 620,
      estCost: '$0.0017',
      status: 'ok',
      time: '10 mins ago',
    },
    {
      id: 2,
      fn: 'ai-concepts',
      model: 'gemini-3.8-flash',
      inputTokens: 940,
      outputTokens: 710,
      thinking: 'medium',
      latencyMs: 1140,
      estCost: '$0.0033',
      status: 'ok',
      time: '9 mins ago',
    },
    {
      id: 3,
      fn: 'ai-blueprint',
      model: 'gemini-3.8-flash',
      inputTokens: 1120,
      outputTokens: 840,
      thinking: 'medium',
      latencyMs: 1420,
      estCost: '$0.0039',
      status: 'ok',
      time: '7 mins ago',
    },
    {
      id: 4,
      fn: 'ai-mentor',
      model: 'gemini-4-argon',
      inputTokens: 680,
      outputTokens: 520,
      thinking: 'HIGH (Reasoning)',
      latencyMs: 1890,
      estCost: '$0.0042',
      status: 'ok',
      time: '2 mins ago',
    },
  ];

  const knowledgeChunks = [
    {
      id: 'chunk-canvas-01',
      topic: 'Canvas & Rulers',
      app: 'photoshop-2024 / photopea',
      content: 'Ctrl+N opens New Document. Resolution must be 300 DPI for print. Ctrl+R enables rulers.',
      reviewer: 'Lead Educator (Verified)',
    },
    {
      id: 'chunk-mask-07',
      topic: 'Non-destructive Layer Masking',
      app: 'photoshop / photopea',
      content: 'Never use eraser (E) on subject layers. Always add Layer Mask; black hides, white reveals.',
      reviewer: 'Senior Retoucher (Verified)',
    },
    {
      id: 'chunk-shadow-09',
      topic: 'Ambient Occlusion Shadows',
      app: 'photoshop / photopea',
      content: 'Ground food with soft brush in Multiply mode. Dark burgundy #1A0808 rather than pure black #000000.',
      reviewer: 'Art Director (Verified)',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Admin Console & AI Cost Observability
          </h1>
        </div>
        <p className="text-sm text-slate-400 max-w-2xl">
          Track token usage, estimated costs ($0.75 in / $3.75 out per 1M tokens), and verified knowledge chunks.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Estimated Project Cost
          </span>
          <div className="text-2xl font-black text-white font-mono">$0.34</div>
          <p className="text-[10px] text-slate-500">Within the target $0.50 budget</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            Active Models
          </span>
          <div className="text-sm font-bold text-slate-200">gemini-3.8-flash</div>
          <p className="text-[10px] text-purple-400 font-mono">High Thinking: gemini-4-argon</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            Average Latency
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">1.2s</div>
          <p className="text-[10px] text-slate-500">Fast streaming SSE pipeline</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-purple-400" />
            Reviewed Chunks
          </span>
          <div className="text-2xl font-black text-purple-300 font-mono">28</div>
          <p className="text-[10px] text-slate-500">Photoshop & Photopea verified</p>
        </div>
      </div>

      {/* Model Runs Table */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCode className="w-4 h-4 text-sky-400" />
          Recent Model Execution Logs (`model_runs`)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 font-semibold">Function</th>
                <th className="py-2 font-semibold">Model</th>
                <th className="py-2 font-semibold">Tokens (In / Out)</th>
                <th className="py-2 font-semibold">Thinking</th>
                <th className="py-2 font-semibold">Latency</th>
                <th className="py-2 font-semibold">Est. Cost</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {modelRuns.map((run) => (
                <tr key={run.id} className="text-slate-300">
                  <td className="py-2.5 font-bold text-amber-300">{run.fn}</td>
                  <td className="py-2.5 text-slate-400">{run.model}</td>
                  <td className="py-2.5">
                    {run.inputTokens} / {run.outputTokens}
                  </td>
                  <td className="py-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                      {run.thinking}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400">{run.latencyMs}ms</td>
                  <td className="py-2.5 font-bold text-emerald-400">{run.estCost}</td>
                  <td className="py-2.5">
                    <span className="text-emerald-400 font-sans font-bold">✓ {run.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviewed Knowledge Base */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          Reviewed Knowledge Chunks (Strict Instruction Grounding)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {knowledgeChunks.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-amber-300">{c.topic}</span>
                <span className="text-[10px] font-mono text-slate-500">{c.id}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{c.content}</p>
              <div className="pt-2 border-t border-slate-900 text-[10px] text-emerald-400 font-semibold">
                ✓ {c.reviewer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
