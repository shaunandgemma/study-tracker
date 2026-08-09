import React from 'react';
import { LockKeyhole, LogOut } from 'lucide-react';
import { AuthModal } from '../../components/Modals/AuthModal.jsx';
import { useAuth } from '../auth/useAuth.js';
import { canAccessFollowAlongApprovals, canAccessFollowAlongAuthor, isAuthorApprovalEntryRequested } from './authorAccess.js';
import { AuthorHome } from './AuthorHome.jsx';
import { AuthorApprovalQueue } from './AuthorApprovalQueue.jsx';
import { isAuthorSharedStorageEnabled, isAuthorTrustedApprovalEnabled } from './authorSharedStorageService.js';

function AccessMessage({ title, children, action }) {
  return <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4"><section className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-6 text-center shadow-xl"><LockKeyhole className="w-9 h-9 text-cyan-300 mx-auto mb-4" /><h1 className="text-xl font-extrabold text-white">{title}</h1><p className="text-sm text-slate-400 mt-2 mb-5">{children}</p>{action}</section></main>;
}

function AuthorAccountControls({ currentUser, onSignOut }) {
  return <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 p-2 shadow-xl"><span className="hidden max-w-52 truncate px-2 text-xs text-slate-300 sm:block">{currentUser.email}</span><button type="button" onClick={() => void onSignOut()} className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-white hover:bg-rose-950 hover:text-rose-200"><LogOut className="h-4 w-4" /> Sign Out / Switch Account</button></div>;
}

export const AuthorEntry = () => {
  const { currentUser, loadingAuth, openAuthModal, signOut } = useAuth();
  const approvalRequested = isAuthorApprovalEntryRequested();

  if (loadingAuth) return <AccessMessage title="Checking Author access">Please wait while your signed-in role is checked.</AccessMessage>;
  if (!currentUser) return <><AccessMessage title={approvalRequested ? 'Approver sign-in required' : 'Author sign-in required'} action={<button type="button" onClick={openAuthModal} className="w-full px-4 py-2.5 rounded-xl bg-cyan-600 text-sm font-bold text-white">Sign In</button>}>Sign in with an account that has the required server-managed role.</AccessMessage><AuthModal /></>;
  if (approvalRequested) {
    if (!isAuthorSharedStorageEnabled() || !isAuthorTrustedApprovalEnabled()) return <AccessMessage title="Trusted approval is disabled">The protected approval route has not been activated for this environment.</AccessMessage>;
    if (!canAccessFollowAlongApprovals(currentUser)) return <AccessMessage title="Approver access restricted" action={<button type="button" onClick={() => { globalThis.location.hash = ''; }} className="w-full px-4 py-2.5 rounded-xl bg-slate-800 text-sm font-bold text-white">Return to Study Tracker</button>}>This signed-in account does not have a server-managed Approver or Admin role.</AccessMessage>;
    return <><AuthorAccountControls currentUser={currentUser} onSignOut={signOut} /><AuthorApprovalQueue currentUser={currentUser} /></>;
  }
  if (!canAccessFollowAlongAuthor(currentUser)) return <AccessMessage title="Author access restricted" action={<button type="button" onClick={() => { globalThis.location.hash = ''; }} className="w-full px-4 py-2.5 rounded-xl bg-slate-800 text-sm font-bold text-white">Return to Study Tracker</button>}>This signed-in account does not have a server-managed Author or Admin role.</AccessMessage>;

  return <><AuthorAccountControls currentUser={currentUser} onSignOut={signOut} /><AuthorHome currentUser={currentUser} /></>;
};
