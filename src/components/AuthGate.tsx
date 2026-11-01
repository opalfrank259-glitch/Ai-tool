import React, { FormEvent, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, requireSupabase } from '../lib/supabase';

type AuthMode = 'sign-in' | 'sign-up';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false);
      return;
    }
    const client = requireSupabase();
    let active = true;
    client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (active) setSession(nextSession);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const client = requireSupabase();
      if (mode === 'sign-up') {
        const { data, error: authError } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: displayName.trim() || email.split('@')[0] } },
        });
        if (authError) throw authError;
        if (data.session) {
          setSession(data.session);
        } else {
          setNotice('Account created. Check your email for the confirmation link, then sign in.');
        }
      } else {
        const { data, error: authError } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        setSession(data.session);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-6">
        <section className="w-full max-w-lg rounded-3xl border border-amber-500/30 bg-slate-900 p-8 space-y-4">
          <h1 className="text-2xl font-bold">Connect Supabase</h1>
          <p className="text-sm text-slate-300">Add the Supabase URL and publishable key to your local environment before opening the tutor.</p>
          <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-emerald-300">{'VITE_SUPABASE_URL=https://qjqgekxbknnrnuppfwag.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY'}</pre>
          <p className="text-xs text-slate-400">Use a publishable key only. Never expose the service-role or secret key in browser variables.</p>
        </section>
      </main>
    );
  }

  if (checking) {
    return <main className="min-h-screen bg-slate-950 text-slate-200 grid place-items-center">Loading secure session…</main>;
  }

  if (session) return (
    <>
      <div className="fixed right-3 top-3 z-[70] flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/95 px-3 py-2 shadow-lg">
        <span className="hidden max-w-[180px] truncate text-xs text-slate-400 sm:inline">{session.user.email}</span>
        <button
          type="button"
          onClick={async () => {
            const { error: signOutError } = await requireSupabase().auth.signOut();
            if (signOutError) setError(signOutError.message);
            else setSession(null);
          }}
          className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-5">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">AI Design Tutor & Creator</p>
          <h1 className="text-2xl font-bold">{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-sm text-slate-400">Sign in to securely save your projects, lessons, brand kits and credits.</p>
        </div>
        <div className="grid grid-cols-2 rounded-xl bg-slate-950 p-1 text-sm">
          <button type="button" onClick={() => { setMode('sign-in'); setError(''); setNotice(''); }} className={`rounded-lg py-2 ${mode === 'sign-in' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Sign in</button>
          <button type="button" onClick={() => { setMode('sign-up'); setError(''); setNotice(''); }} className={`rounded-lg py-2 ${mode === 'sign-up' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Sign up</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {mode === 'sign-up' && <label className="block space-y-1.5 text-sm"><span className="text-slate-300">Display name</span><input value={displayName} onChange={e => setDisplayName(e.target.value)} autoComplete="name" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-amber-500" placeholder="Your name" /></label>}
          <label className="block space-y-1.5 text-sm"><span className="text-slate-300">Email</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-amber-500" placeholder="you@example.com" /></label>
          <label className="block space-y-1.5 text-sm"><span className="text-slate-300">Password</span><input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 outline-none focus:border-amber-500" placeholder="At least 6 characters" /></label>
          {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
          {notice && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 disabled:opacity-60">{busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign in securely' : 'Create account'}</button>
        </form>
        <p className="text-xs leading-relaxed text-slate-500">Your account and saved work are protected by Supabase Row Level Security.</p>
      </section>
    </main>
  );
};
