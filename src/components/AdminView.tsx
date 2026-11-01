import React, { useEffect, useMemo, useState } from 'react';
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
import { requireSupabase } from '../lib/supabase';

interface AdminViewProps {
  language: Language;
}

export const AdminView: React.FC<AdminViewProps> = () => {
  const [modelRuns, setModelRuns] = useState<any[]>([]);
  const [knowledgeChunks, setKnowledgeChunks] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const db = requireSupabase() as any;
        const { data: authData, error: authError } = await db.auth.getUser();
        if (authError || !authData?.user) throw authError || new Error('Please sign in.');
        const { data: profile, error: profileError } = await db
          .from('profiles').select('role').eq('id', authData.user.id).single();
        if (profileError) throw profileError;
        if (profile?.role !== 'admin') {
          if (active) setIsAdmin(false);
          return;
        }
        const [runs, chunks] = await Promise.all([
          db.from('model_runs').select('id,function_name,model_name,input_tokens,output_tokens,thinking_level,latency_ms,estimated_cost_usd,status,created_at').order('created_at', { ascending: false }).limit(50),
          db.from('knowledge_chunks').select('id,topic,app_versions,content,reviewer').eq('review_status', 'approved').order('topic'),
        ]);
        if (runs.error) throw runs.error;
        if (chunks.error) throw chunks.error;
        if (active) {
          setIsAdmin(true);
          setModelRuns(runs.data || []);
          setKnowledgeChunks(chunks.data || []);
        }
      } catch (e) {
        if (active) setLoadError(e instanceof Error ? e.message : 'Unable to load admin data.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const totalCost = useMemo(
    () => modelRuns.reduce((sum, run) => sum + Number(run.estimated_cost_usd || 0), 0),
    [modelRuns]
  );
  const averageLatency = useMemo(() => {
    const values = modelRuns.map((run) => Number(run.latency_ms)).filter(Number.isFinite);
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  }, [modelRuns]);
  const activeModels = useMemo(
    () => [...new Set(modelRuns.map((run) => run.model_name).filter(Boolean))],
    [modelRuns]
  );


  if (loading) return <div className="max-w-6xl mx-auto p-8 text-slate-300">Loading admin data…</div>;
  if (loadError) return <div className="max-w-6xl mx-auto rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-200">{loadError}</div>;
  if (!isAdmin) return <div className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-300"><h2 className="font-bold text-white">Admin access required</h2><p className="mt-2 text-sm">Your signed-in account does not have the admin role. Ask an administrator to grant access.</p></div>;

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
          Live usage logs and reviewed knowledge content stored in Supabase.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Estimated Project Cost
          </span>
          <div className="text-2xl font-black text-white font-mono">${totalCost.toFixed(4)}</div>
          <p className="text-[10px] text-slate-500">{modelRuns.length} recorded AI runs</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-400" />
            Active Models
          </span>
          <div className="text-sm font-bold text-slate-200">{activeModels.length ? activeModels.join(", ") : "No recorded runs"}</div>
          <p className="text-[10px] text-purple-400 font-mono">From actual model_runs records</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-400" />
            Average Latency
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">{averageLatency}ms</div>
          <p className="text-[10px] text-slate-500">Average recorded latency</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-purple-400" />
            Reviewed Chunks
          </span>
          <div className="text-2xl font-black text-purple-300 font-mono">{knowledgeChunks.length}</div>
          <p className="text-[10px] text-slate-500">Approved knowledge chunks</p>
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
                  <td className="py-2.5 font-bold text-amber-300">{run.function_name}</td>
                  <td className="py-2.5 text-slate-400">{run.model_name}</td>
                  <td className="py-2.5">
                    {run.input_tokens} / {run.output_tokens}
                  </td>
                  <td className="py-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                      {run.thinking_level || 'standard'}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400">{run.latency_ms}ms</td>
                  <td className="py-2.5 font-bold text-emerald-400">{`${Number(run.estimated_cost_usd || 0).toFixed(4)}`}</td>
                  <td className="py-2.5">
                    <span className="text-emerald-400 font-sans font-bold">{run.status}</span>
                  </td>
                </tr>
              ))}
              {!modelRuns.length && <tr><td colSpan={7} className="py-6 text-center text-slate-500">No model runs have been recorded yet.</td></tr>}
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
              <p className="text-[10px] text-slate-500">{(c.app_versions || []).join(' / ')}</p>
              <div className="pt-2 border-t border-slate-900 text-[10px] text-emerald-400 font-semibold">
                {c.reviewer || 'Reviewed'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
