import React, { useState } from 'react';
import { CloudUpload, ShieldCheck } from 'lucide-react';
import { AUTHOR_DRAFT_COPY_STATUS, AUTHOR_STORAGE_MODE } from './authorStorageCoordinator.js';

export const AuthorStorageMigrationPanel = ({ coordinator, featureEnabled, storageMode, onCopied }) => {
  const [preview, setPreview] = useState(null);
  const [confirmed, setConfirmed] = useState({});
  const [message, setMessage] = useState('');
  const [busyDraftId, setBusyDraftId] = useState('');

  if (!featureEnabled) return null;
  const isShared = storageMode === AUTHOR_STORAGE_MODE.SHARED;

  const runPreview = async () => {
    setMessage('Checking local and shared draft IDs...');
    const result = await coordinator.previewLocalDraftCopies();
    setPreview(result);
    setConfirmed({});
    setMessage(result.success
      ? `Preview complete. ${result.readyCount} drafts can be copied, ${result.updateReadyCount || 0} can update an existing Shared Draft, and ${result.conflictCount} need review.`
      : result.error);
  };

  const finish = async result => {
    setBusyDraftId('');
    setMessage(result.error || result.message);
    if (!result.success) return;
    await runPreview();
    if (typeof onCopied === 'function') await onCopied();
    setMessage(result.message);
  };

  const copyDraft = async item => {
    setBusyDraftId(item.draftId);
    await finish(await coordinator.copyLocalDraft({
      draftId: item.draftId,
      confirmedDraftId: confirmed[item.draftId] ? item.draftId : '',
      expectedLocalRevision: item.localRevision
    }));
  };

  const updateDraft = async item => {
    setBusyDraftId(item.draftId);
    await finish(await coordinator.updateSharedDraftFromLocal({
      localDraftId: item.draftId,
      sharedDraftId: item.remoteDraftId,
      confirmation: confirmed[item.draftId] ? `UPDATE ${item.remoteDraftId} FROM ${item.draftId}` : '',
      expectedLocalRevision: item.localRevision,
      expectedSharedRevision: item.remoteRevision,
      expectedLocalContentFingerprint: item.localContentFingerprint,
      expectedSharedContentFingerprint: item.remoteContentFingerprint
    }));
  };

  return <section className="rounded-2xl border border-amber-800/70 bg-amber-950/20 p-5 space-y-4">
    <div className="flex items-start gap-3"><ShieldCheck className="w-6 h-6 text-amber-300 shrink-0" /><div><span className="text-xs font-bold uppercase tracking-wider text-amber-300">Shared-storage preparation</span><h2 className="text-lg font-bold text-white mt-1">Preview local draft copies and updates</h2><p className="text-xs text-slate-300 mt-1">Every action requires confirmation. The private browser copy is never moved or deleted.</p></div></div>
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300"><strong>Selected storage:</strong> {isShared ? 'Shared Drafts' : 'Local Drafts'}</div>
    {!isShared && <p className="text-xs text-slate-400">Select Shared Drafts above before previewing local draft copies.</p>}
    <div className="flex flex-col sm:flex-row gap-3"><button type="button" disabled={!isShared} onClick={runPreview} className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white disabled:opacity-40 inline-flex items-center justify-center gap-2"><CloudUpload className="w-4 h-4" /> Preview Copies</button></div>
    {preview?.success && <div className="space-y-3">
      {preview.drafts.length === 0 ? <p className="text-xs text-slate-400">There are no local drafts to copy.</p> : preview.drafts.map(item => <article key={item.draftId} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <strong className="text-sm text-white">{item.title}</strong>
            <span className="block text-[11px] text-slate-400 mt-1">Local revision {item.localRevision} · Local copy will remain</span>
            {item.isVerifiedHandoff && <span className="mt-2 inline-flex rounded-full border border-emerald-800 bg-emerald-950/30 px-2 py-1 text-[10px] font-bold text-emerald-300">Verified Author Assistant handoff</span>}
            {item.status === AUTHOR_DRAFT_COPY_STATUS.CONFLICT && <span className="block text-xs text-amber-300 mt-2">A Shared Draft with this ID already exists at revision {item.remoteRevision}. Automatic copying is blocked.</span>}
            {item.status === AUTHOR_DRAFT_COPY_STATUS.CONFLICT && <span className={`block text-[10px] mt-1 ${item.remoteContentMatches ? 'text-emerald-300' : 'text-rose-300'}`}>{item.remoteContentMatches ? 'The existing Shared content exactly matches this Local Draft fingerprint.' : 'The existing Shared content differs from this Local Draft. Stop before Stage 12.'}</span>}
            {item.status === AUTHOR_DRAFT_COPY_STATUS.UPDATE_READY && <span className="block text-xs text-cyan-300 mt-2">One owned Shared Draft already represents this programme. Exact update available: Shared revision {item.remoteRevision} to {item.remoteRevision + 1}.</span>}
            {item.status === AUTHOR_DRAFT_COPY_STATUS.UPDATE_BLOCKED && <span className="block text-xs text-rose-300 mt-2">The programme-matched Shared Draft cannot be updated. {item.activeCandidateCount ? 'An active candidate must be resolved first.' : item.programmeMatchCount > 1 ? 'More than one Shared Draft matches this programme.' : 'Ownership or verified-handoff checks did not pass.'}</span>}
          </div>
          {item.canCopy && <div className="sm:max-w-xs space-y-2"><label className="flex items-start gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(confirmed[item.draftId])} onChange={event => setConfirmed(value => ({ ...value, [item.draftId]: event.target.checked }))} /> I confirm that I want to copy this exact {item.isVerifiedHandoff ? 'verified handoff ' : ''}draft. Keep my Local Draft.</label><button type="button" disabled={!confirmed[item.draftId] || busyDraftId === item.draftId} onClick={() => copyDraft(item)} className="w-full px-3 py-2 rounded-lg bg-cyan-700 text-xs font-bold text-white disabled:opacity-40">{busyDraftId === item.draftId ? 'Copying...' : 'Copy Confirmed Draft'}</button></div>}
          {item.canUpdateShared && <div className="sm:max-w-xs space-y-2"><label className="flex items-start gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(confirmed[item.draftId])} onChange={event => setConfirmed(value => ({ ...value, [item.draftId]: event.target.checked }))} /> I confirm Shared revision {item.remoteRevision} will become revision {item.remoteRevision + 1} using this exact verified Local Draft. Keep my Local Draft.</label><button type="button" disabled={!confirmed[item.draftId] || busyDraftId === item.draftId} onClick={() => updateDraft(item)} className="w-full px-3 py-2 rounded-lg bg-violet-700 text-xs font-bold text-white disabled:opacity-40">{busyDraftId === item.draftId ? 'Updating safely...' : 'Update Existing Shared Draft'}</button></div>}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 sm:grid-cols-6"><span>{item.counts.phaseCount} phases</span><span>{item.counts.taskCount} tasks</span><span>{item.counts.checkboxCount} checkboxes</span><span>{item.counts.verificationCheckCount} checks</span><span>{item.counts.cleanupItemCount} cleanup items</span><span>{item.counts.officialAwsSourceCount} AWS sources</span></div>
        <div className="space-y-1 text-[10px] text-slate-500"><span className="block">Local Draft ID: <code className="break-all text-slate-300">{item.draftId}</code></span>{item.remoteDraftId && <span className="block">Shared Draft ID: <code className="break-all text-violet-300">{item.remoteDraftId}</code></span>}{item.handoffFingerprint && <span className="block">Handoff SHA-256: <code className="break-all text-emerald-300">{item.handoffFingerprint}</code></span>}<span className="block">Local content SHA-256: <code className="break-all text-cyan-300">{item.localContentFingerprint}</code></span></div>
      </article>)}
    </div>}
    {message && <p role="status" className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300">{message}</p>}
  </section>;
};
