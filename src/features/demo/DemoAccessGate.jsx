import React from 'react';
import { FlaskConical, LockKeyhole, ShieldCheck } from 'lucide-react';
import { AuthModal } from '../../components/Modals/AuthModal.jsx';

export const DemoAccessGate = ({ onSignIn = () => {}, onEnterDemo = () => {}, enteringDemo = false }) => (
  <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/35 to-slate-950 p-7 shadow-2xl sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-700/70 bg-indigo-950/70 px-3 py-1 text-xs font-bold text-indigo-200">
          <ShieldCheck className="h-4 w-4" /> Safe demonstration access
        </span>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">Explore LATT without touching live user data.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Use the isolated Demo Learner account to preview selected exam questions, checklist lessons, Follow Alongs and Troubleshooting Challenges. Demo progress is temporary, uses fake records and never writes to Supabase or AWS.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            ['Fake data', 'No real learner history is displayed.'],
            ['Curated preview', 'A small, consistent sample is available from each learning tool.'],
            ['Automatic reset', 'Demo progress clears when the session ends.']
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <strong className="text-sm text-white">{title}</strong>
              <p className="mt-1 text-xs leading-5 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <LockKeyhole className="h-8 w-8 text-indigo-300" />
        <h2 className="mt-4 text-xl font-bold text-white">Choose access</h2>
        <p className="mt-2 text-xs leading-6 text-slate-400">Registered learners and administrators sign in with their protected account. Visitors use the temporary demo account.</p>
        <div className="mt-6 space-y-3">
          <button type="button" onClick={onEnterDemo} disabled={enteringDemo} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">
            <FlaskConical className="h-4 w-4" /> {enteringDemo ? 'Preparing safe demo...' : 'Enter Demo Account'}
          </button>
          <button type="button" onClick={onSignIn} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 hover:border-indigo-500">
            Account Sign In
          </button>
        </div>
        <p className="mt-5 rounded-xl border border-amber-800/50 bg-amber-950/20 p-3 text-[11px] leading-5 text-amber-200">
          Demo access cannot open Author or Approvals, and it cannot change live application data.
        </p>
      </aside>
    </div>
    <AuthModal />
  </main>
);
