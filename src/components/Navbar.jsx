import React, { useState } from 'react';
import { Database, Home, LogOut, Menu, Moon, Sparkles, Sun, User, X } from 'lucide-react';
import { useExam } from '../context/ExamContext';
import { useAuth } from '../features/auth/useAuth.js';

export const Navbar = ({ onGoHome = () => {}, onOpenBackupModal = () => {} }) => {
  const { theme, toggleTheme } = useExam();
  const { currentUser, openAuthModal, signOut: signOutUser, canManageContent, isDemoAccount } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 text-slate-100 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onGoHome} className="flex shrink-0 items-center gap-2.5" aria-label="Open ExamPulse home">
          <span className="rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-slate-950 sm:h-10 sm:w-10">
              <Sparkles className="h-4 w-4 text-indigo-400 sm:h-5 sm:w-5" />
            </span>
          </span>
          <span className="text-lg font-bold tracking-tight text-white sm:text-xl">ExamPulse</span>
          <span className="hidden rounded-full border border-indigo-800/50 bg-indigo-950/80 px-2 py-0.5 text-xs font-semibold text-indigo-300 sm:inline-block">Prep AI</span>
          {isDemoAccount && <span className="rounded-full border border-cyan-700 bg-cyan-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyan-200">Safe Demo</span>}
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={onGoHome} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-300 transition hover:text-white">
            <Home className="h-4 w-4 text-indigo-400" /> Exams
          </button>
          {currentUser ? (
            <>
              <span className="hidden max-w-48 truncate rounded-lg border border-indigo-800/60 bg-indigo-950/80 px-2.5 py-1.5 text-xs font-medium text-indigo-300 lg:inline-block">{currentUser.email}</span>
              <button type="button" onClick={signOutUser} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-800 hover:text-rose-300">Sign Out</button>
            </>
          ) : (
            <button type="button" onClick={() => openAuthModal()} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-indigo-500">Sign In</button>
          )}
          {canManageContent && <button type="button" onClick={onOpenBackupModal} className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-300" title="Backup / Restore JSON Data"><Database className="h-4 w-4" /></button>}
          <button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-slate-300" title="Toggle Theme">
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
          </button>
        </div>

        <button type="button" onClick={() => setIsMobileDrawerOpen(true)} className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-indigo-300 md:hidden" aria-label="Open mobile menu"><Menu className="h-5 w-5" /></button>
      </div>

      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <button type="button" aria-label="Close mobile menu" className="fixed inset-0 bg-slate-950/80" onClick={() => setIsMobileDrawerOpen(false)} />
          <div className="relative flex h-full w-full max-w-xs flex-col bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="font-bold text-white">Menu & Settings</span>
              <button type="button" onClick={() => setIsMobileDrawerOpen(false)} className="rounded-lg bg-slate-800 p-1.5 text-slate-300"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-2 py-5">
              <button type="button" onClick={() => { setIsMobileDrawerOpen(false); onGoHome(); }} className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-xs font-bold text-slate-200"><Home className="h-4 w-4 text-indigo-400" /> Choose an exam</button>
              {canManageContent && <button type="button" onClick={() => { setIsMobileDrawerOpen(false); onOpenBackupModal(); }} className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-xs font-bold text-slate-200"><Database className="h-4 w-4 text-indigo-400" /> Backup / Restore</button>}
              <button type="button" onClick={toggleTheme} className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-xs font-bold text-slate-200">{theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />} Toggle theme</button>
            </div>
            {currentUser ? (
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <div className="flex items-center gap-2 rounded-xl bg-slate-950/70 px-3 py-2 text-xs text-slate-300"><User className="h-4 w-4 text-indigo-400" /><span className="truncate">{currentUser.email}</span></div>
                <button type="button" onClick={() => { setIsMobileDrawerOpen(false); signOutUser(); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-800/60 bg-rose-950/50 px-3 py-2.5 text-xs font-bold text-rose-300"><LogOut className="h-4 w-4" /> Sign Out</button>
              </div>
            ) : (
              <button type="button" onClick={() => { setIsMobileDrawerOpen(false); openAuthModal(); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white"><User className="h-4 w-4" /> Sign In / Create Account</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
