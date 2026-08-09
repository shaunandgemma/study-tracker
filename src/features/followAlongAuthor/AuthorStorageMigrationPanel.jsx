import React, { useState } from 'react';
import { CloudUpload, ShieldCheck } from 'lucide-react';
import { AUTHOR_DRAFT_COPY_STATUS, AUTHOR_STORAGE_MODE } from './authorStorageCoordinator.js';

export const AuthorStorageMigrationPanel = ({ coordinator, featureEnabled, storageMode }) => {
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
    setMessage(result.success ? `Preview complete. ${result.readyCount} drafts can be copied and ${result.conflictCount} need review.` : result.error);
  };

  const copyDraft = async item => {
    setBusyDraftId(item.draftId);
    const result = await coordinator.copyLocalDraft({
      draftId: item.draftId,
      confirmedDraftId: confirmed[item.draftId] ? item.draftId : '',
      expectedLocalRevision: item.localRevision
    });
    setBusyDraftId('');
    setMessage(result.error || result.message);
    if (result.success) {
      await runPreview();
      setMessage(result.message);
    }
  };

  return <section className="rounded-2xl border border-amber-800/70 bg-amber-950/20 p-5 space-y-4">
    <div className="flex items-start gap-3"><ShieldCheck className="w-6 h-6 text-amber-300 shrink-0" /><div><span className="text-xs font-bold uppercase tracking-wider text-amber-300">Shared-storage preparation</span><h2 className="text-lg font-bold text-white mt-1">Preview local draft copies</h2><p className="text-xs text-slate-300 mt-1">This copies only confirmed drafts. It never moves or deletes the private browser copy.</p></div></div>
    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300"><strong>Selected storage:</strong> {isShared ? 'Shared Drafts' : 'Local Drafts'}</div>
    {!isShared && <p className="text-xs text-slate-400">Select Shared Drafts above before previewing local draft copies.</p>}
    <div className="flex flex-col sm:flex-row gap-3"><button type="button" disabled={!isShared} onClick={runPreview} className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white disabled:opacity-40 inline-flex items-center justify-center gap-2"><CloudUpload className="w-4 h-4" /> Preview Copies</button></div>
    {preview?.success && <div className="space-y-3">{preview.drafts.length === 0 ? <p className="text-xs text-slate-400">There are no local drafts to copy.</p> : preview.drafts.map(item => <article key={item.draftId} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"><div><strong className="text-sm text-white">{item.title}</strong><span className="block text-[11px] text-slate-400 mt-1">Local revision {item.localRevision} · Local copy will remain</span>{item.status === AUTHOR_DRAFT_COPY_STATUS.CONFLICT && <span className="block text-xs text-amber-300 mt-2">A shared draft with this ID already exists at revision {item.remoteRevision}. Automatic copying is blocked.</span>}</div>{item.canCopy && <div className="sm:max-w-xs space-y-2"><label className="flex items-start gap-2 text-xs text-slate-300"><input type="checkbox" checked={Boolean(confirmed[item.draftId])} onChange={event => setConfirmed(value => ({ ...value, [item.draftId]: event.target.checked }))} /> I confirm that I want to copy this exact draft. Keep my local draft.</label><button type="button" disabled={!confirmed[item.draftId] || busyDraftId === item.draftId} onClick={() => copyDraft(item)} className="w-full px-3 py-2 rounded-lg bg-cyan-700 text-xs font-bold text-white disabled:opacity-40">{busyDraftId === item.draftId ? 'Copying...' : 'Copy Confirmed Draft'}</button></div>}</div></article>)}</div>}
    {message && <p role="status" className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300">{message}</p>}
  </section>;
};
