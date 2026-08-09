import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, FileLock2, ShieldAlert } from 'lucide-react';
import { compareAuthorReleaseCandidate, createAuthorReleaseCandidate, serializeAuthorReleaseCandidate, verifyAuthorReleaseCandidate } from './authorApproval.js';

function downloadCandidate(candidate) {
  if (!globalThis.document || !globalThis.Blob || !globalThis.URL?.createObjectURL) return false;
  const blob = new Blob([serializeAuthorReleaseCandidate(candidate)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${candidate.candidateId}.json`;
  link.click();
  URL.revokeObjectURL(url);
  return true;
}

export function AuthorApprovalStage({ draft, userId, planningValidation, contentValidation, reviewValidation, setMessage }) {
  const [candidate, setCandidate] = useState(null);
  const [integrity, setIntegrity] = useState(null);
  const [working, setWorking] = useState(false);

  const prepare = async () => {
    setWorking(true);
    const result = await createAuthorReleaseCandidate({ draft, userId, planningValidation, contentValidation, reviewValidation });
    setWorking(false);
    if (!result.success) { setMessage(result.error); return; }
    setCandidate(result.candidate);
    setIntegrity({ valid: true, matches: true });
    setMessage('Immutable local release candidate prepared. It is still awaiting trusted approval and is not published.');
  };

  const check = async () => {
    if (!candidate) return;
    setWorking(true);
    const verified = await verifyAuthorReleaseCandidate(candidate);
    const compared = await compareAuthorReleaseCandidate(candidate, draft);
    setWorking(false);
    setIntegrity({ valid: verified.valid, matches: compared.matches });
    setMessage(verified.valid && compared.matches ? 'Release candidate integrity and draft revision match.' : 'The release candidate or current draft changed. Prepare a new candidate after review.');
  };

  return <div className="space-y-5"><div><h2 className="text-xl font-extrabold text-white">Release candidate and approval boundary</h2><p className="text-sm text-slate-400 mt-1">Freeze the reviewed draft into a tamper-evident package for a future trusted approver.</p></div><section className="rounded-2xl border border-amber-800 bg-amber-950/20 p-5"><div className="flex items-start gap-3"><ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" /><div><strong className="text-sm text-amber-200">Final approval is disabled</strong><p className="text-xs text-slate-300 mt-2 leading-relaxed">Drafts currently live only in the author's browser. That is not trusted shared storage, so this screen cannot honestly prove a separate person approved the package. A secure server-backed approval store must be added before the Approve action is enabled.</p></div></div></section><section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4"><div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"><div><span className="text-slate-500 block">Review state</span><strong className={draft.review?.reviewStatus === 'ready_for_approval' ? 'text-emerald-300' : 'text-amber-300'}>{draft.review?.reviewStatus || 'in_review'}</strong></div><div><span className="text-slate-500 block">Approval decision</span><strong className="text-white">Pending</strong></div><div><span className="text-slate-500 block">Publication</span><strong className="text-white">Not published</strong></div></div><button type="button" disabled={working} onClick={prepare} className="px-4 py-2.5 rounded-xl bg-cyan-600 disabled:opacity-50 text-xs font-bold text-white inline-flex items-center gap-2"><FileLock2 className="w-4 h-4" /> {working ? 'Checking...' : candidate ? 'Prepare New Candidate' : 'Prepare Release Candidate'}</button></section>{candidate && <section className="rounded-2xl border border-cyan-800 bg-cyan-950/20 p-5 space-y-4"><div className="flex items-start gap-3"><FileLock2 className="w-6 h-6 text-cyan-300 shrink-0" /><div className="min-w-0"><strong className="text-sm text-white">Immutable local candidate prepared</strong><span className="block text-[11px] text-slate-400 mt-1 break-all">{candidate.candidateId}</span></div></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"><div><span className="text-slate-500 block">Source revision</span><strong className="text-white">{candidate.sourceRevision}</strong></div><div><span className="text-slate-500 block">Status</span><strong className="text-amber-300">Awaiting trusted approval</strong></div><div className="sm:col-span-2"><span className="text-slate-500 block">SHA-256 content fingerprint</span><code className="text-[11px] text-cyan-200 break-all">{candidate.contentHash}</code></div></div>{integrity && <div className={`rounded-xl border p-3 text-xs flex items-start gap-2 ${integrity.valid && integrity.matches ? 'border-emerald-800 bg-emerald-950/20 text-emerald-200' : 'border-rose-800 bg-rose-950/20 text-rose-200'}`}>{integrity.valid && integrity.matches ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}<span>{integrity.valid && integrity.matches ? 'Candidate content and current draft revision match.' : 'Candidate integrity or revision does not match. Do not approve this package.'}</span></div>}<div className="flex flex-wrap gap-2"><button type="button" disabled={working} onClick={check} className="px-4 py-2 rounded-xl bg-slate-700 text-xs font-bold text-white">Check Integrity</button><button type="button" onClick={() => { if (!downloadCandidate(candidate)) setMessage('The browser could not download the local candidate.'); }} className="px-4 py-2 rounded-xl bg-slate-700 text-xs font-bold text-white inline-flex items-center gap-2"><Download className="w-4 h-4" /> Download JSON Package</button></div></section>}<section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5"><h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Rules reserved for the trusted approval service</h3><ol className="mt-3 space-y-2 text-xs text-slate-400"><li>1. Approver must have a server-managed admin or approver role.</li><li>2. The draft author cannot approve their own candidate.</li><li>3. Candidate fingerprint and current revision must match.</li><li>4. Every validation is run again at approval time.</li><li>5. Approver identity, time, revision and fingerprint are recorded.</li><li>6. Approval still does not publish the programme.</li></ol></section><p className="text-xs text-slate-500">The downloaded JSON package contains the private programme content. Store and share it carefully. It contains no AWS credentials and performs no application changes.</p></div>;
}
