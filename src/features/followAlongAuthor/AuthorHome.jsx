import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Cloud, FilePlus2, FolderOpen, HardDrive, ShieldCheck, Trash2 } from 'lucide-react';
import { createAuthorDraft } from './authorDraftService.js';
import { AuthorDraftEditor } from './AuthorDraftEditor.jsx';
import { AuthorHandoffImportPreview } from './AuthorHandoffImportPreview.jsx';
import { executeAuthorHandoffControlledImport } from './authorHandoffControlledImport.js';
import { executeAuthorHandoffControlledUpdate } from './authorHandoffControlledUpdate.js';
import { AuthorStorageMigrationPanel } from './AuthorStorageMigrationPanel.jsx';
import { AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from './authorStorageCoordinator.js';
import { isAuthorSharedStorageEnabled } from './authorSharedStorageService.js';

const emptyForm = { serviceName: '', shortName: '', displayName: '', description: '' };

function AuthorDraftRow({ draft, storageLabel, isLive, liveStatusKnown, onOpen, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const deletionProtected = isLive || !liveStatusKnown;
  const remove = async () => {
    setDeleting(true);
    const result = await onDelete(draft);
    setDeleting(false);
    if (result?.success) setConfirmingDelete(false);
  };
  return <div className={`p-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${deletionProtected ? 'bg-slate-950/70 text-slate-500' : ''}`}>
    <div><div className="flex items-center gap-2"><strong className={deletionProtected ? 'text-slate-300' : 'text-white'}>{draft.programme.displayName}</strong>{isLive && <span className="inline-flex items-center gap-1 rounded-full border border-emerald-800 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" />Live</span>}</div><span className="mt-1 block text-xs text-slate-400">{draft.programme.serviceName || 'Service not named'} · Revision {draft.draft.revision} · {draft.draft.status.replaceAll('_', ' ')}</span><span className="mt-1 block text-[11px] text-slate-500">Storage: {storageLabel} · Learner visibility: {isLive ? 'live production version protected' : 'hidden'}</span></div>
    <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => onOpen(draft)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700"><FolderOpen className="h-4 w-4" />Continue Draft</button>{!deletionProtected && !confirmingDelete && <button type="button" onClick={() => setConfirmingDelete(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-800 bg-rose-950/30 px-4 py-2.5 text-xs font-bold text-rose-200"><Trash2 className="h-4 w-4" />Delete Draft</button>}{deletionProtected && <span className="rounded-lg border border-slate-700 px-3 py-2 text-[10px] font-semibold text-slate-500">{isLive ? 'Deletion disabled' : 'Live status unavailable · deletion disabled'}</span>}</div>
    {confirmingDelete && <div className="w-full rounded-xl border border-rose-800 bg-rose-950/30 p-3 text-xs text-rose-100"><strong className="block">Delete this unwanted draft permanently?</strong><span className="mt-1 block text-rose-200/80">This is allowed only when no release candidate or live publication is connected to it.</span><div className="mt-3 flex gap-2"><button type="button" disabled={deleting} onClick={() => void remove()} className="rounded-lg bg-rose-700 px-3 py-2 font-bold text-white disabled:opacity-50">{deleting ? 'Deleting safely...' : 'Confirm Delete Draft'}</button><button type="button" disabled={deleting} onClick={() => setConfirmingDelete(false)} className="rounded-lg bg-slate-800 px-3 py-2 font-bold text-slate-200">Cancel</button></div></div>}
  </div>;
}

export const AuthorHome = ({ currentUser }) => {
  const sharedFeatureEnabled = isAuthorSharedStorageEnabled();
  const coordinator = useMemo(() => createAuthorStorageCoordinator({ userId: currentUser.id, enabled: sharedFeatureEnabled }), [currentUser.id, sharedFeatureEnabled]);
  const [storageMode, setStorageMode] = useState(AUTHOR_STORAGE_MODE.LOCAL);
  const [drafts, setDrafts] = useState([]);
  const [activeDraft, setActiveDraft] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [publishedDraftIds, setPublishedDraftIds] = useState(new Set());
  const [liveStatusKnown, setLiveStatusKnown] = useState(false);
  const [releaseCandidates, setReleaseCandidates] = useState([]);

  const refresh = useCallback(async () => {
    setLoadingDrafts(true);
    const [result, published, candidates] = await Promise.all([
      coordinator.listDrafts(), coordinator.listPublishedDrafts(), coordinator.listReleaseCandidates()
    ]);
    setDrafts(result.drafts || []);
    setPublishedDraftIds(new Set(published.publishedDraftIds || []));
    setLiveStatusKnown(published.success === true);
    setReleaseCandidates(candidates.candidates || []);
    setError(!result.success ? result.error : !published.success ? published.error : !candidates.success ? candidates.error : '');
    setLoadingDrafts(false);
  }, [coordinator]);

  useEffect(() => { void refresh(); }, [refresh]);

  const chooseMode = mode => {
    const result = mode === AUTHOR_STORAGE_MODE.SHARED ? coordinator.selectSharedMode() : coordinator.returnToLocalMode();
    setStorageMode(result.storageMode);
    setDrafts([]);
    setActiveDraft(null);
    setError(result.success ? '' : result.error);
    void refresh();
  };

  const createDraft = async event => {
    event.preventDefault();
    if (!form.serviceName.trim()) { setError('Enter the official AWS service name.'); return; }
    const draft = createAuthorDraft({ userId: currentUser.id, input: form });
    const result = await coordinator.storeNewDraft(draft);
    if (!result.success) { setError(result.error); return; }
    setDrafts(current => [...current, result.draft]);
    setForm(emptyForm);
    setShowCreate(false);
    setActiveDraft(result.draft);
    setError('');
  };

  const openDraft = async selectedDraft => {
    setError('');
    const result = await coordinator.loadDraft(selectedDraft.draft.draftId);
    if (!result.success) { setError(result.error); return; }
    setActiveDraft(result.draft);
  };

  const deleteDraft = async selectedDraft => {
    const draftId = selectedDraft?.draft?.draftId;
    if (coordinator.getMode() === AUTHOR_STORAGE_MODE.SHARED && !liveStatusKnown) {
      const result = { success: false, error: 'Live production status could not be verified, so deletion remains disabled.' };
      setError(result.error);
      return result;
    }
    if (publishedDraftIds.has(draftId)) {
      const result = { success: false, error: 'This exact draft is live in production and cannot be deleted.' };
      setError(result.error);
      return result;
    }
    const result = await coordinator.deleteDraft({ draftId, expectedRevision: selectedDraft.draft.revision, confirmation: `DELETE ${draftId}` });
    setError(result.success ? '' : result.error);
    if (result.success) await refresh();
    return result;
  };

  const importPrivateHandoffDraft = useCallback(async values => {
    if (storageMode !== AUTHOR_STORAGE_MODE.LOCAL || coordinator.getMode() !== AUTHOR_STORAGE_MODE.LOCAL) {
      return { success: false, wrongStorageMode: true, error: 'Select Local Drafts before importing this package.' };
    }
    const result = await executeAuthorHandoffControlledImport({
      ...values,
      currentUser: { id: currentUser.id, email: currentUser.email },
      storageMode,
      listDrafts: () => coordinator.listDrafts(),
      storeDraft: draft => coordinator.storeNewDraft(draft),
      saveDraft: valuesToSave => coordinator.saveDraft(valuesToSave)
    });
    if (result.success) await refresh();
    return result;
  }, [coordinator, currentUser.email, currentUser.id, refresh, storageMode]);

  const updateSharedHandoffDraft = useCallback(async values => {
    if (storageMode !== AUTHOR_STORAGE_MODE.SHARED || coordinator.getMode() !== AUTHOR_STORAGE_MODE.SHARED) {
      return { success: false, wrongStorageMode: true, error: 'Select Shared Drafts before applying this update.' };
    }
    const result = await executeAuthorHandoffControlledUpdate({
      ...values,
      currentUser: { id: currentUser.id, email: currentUser.email },
      storageMode,
      listDrafts: () => coordinator.listDrafts(),
      listReleaseCandidates: () => coordinator.listReleaseCandidates(),
      saveDraft: valuesToSave => coordinator.saveDraft(valuesToSave)
    });
    if (result.success) await refresh();
    return result;
  }, [coordinator, currentUser.email, currentUser.id, refresh, storageMode]);

  if (activeDraft) return <AuthorDraftEditor initialDraft={activeDraft} userId={currentUser.id} authorEmail={currentUser.email} storageMode={storageMode} onSaveDraft={values => coordinator.saveDraft(values)} onPreviewCandidateReadiness={values => coordinator.previewReleaseCandidateReadiness(values)} onStoreReleaseCandidate={candidate => coordinator.storeReleaseCandidate(candidate)} onCancel={() => { setActiveDraft(null); void refresh(); }} onSavedAndExit={() => { setActiveDraft(null); void refresh(); }} />;

  const isShared = storageMode === AUTHOR_STORAGE_MODE.SHARED;
  const storageLabel = isShared ? 'Shared Drafts' : 'Local Drafts';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
          <div className="flex items-start gap-3"><div className="rounded-xl bg-cyan-950 border border-cyan-800 p-2.5"><ShieldCheck className="w-6 h-6 text-cyan-300" /></div><div><span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Author Version 1</span><h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Follow Along Author</h1><p className="text-sm text-slate-400 mt-2">Create and continue unpublished drafts. Publishing is not available.</p></div></div>
        </header>

        {sharedFeatureEnabled && <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3"><div><span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Choose draft storage</span><p className="text-xs text-slate-400 mt-1">Local Drafts is always the starting mode. Shared Drafts must be selected deliberately for this session.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><button type="button" onClick={() => chooseMode(AUTHOR_STORAGE_MODE.LOCAL)} className={`rounded-xl border p-4 text-left ${!isShared ? 'border-cyan-600 bg-cyan-950/30' : 'border-slate-800 bg-slate-950/40'}`}><HardDrive className="w-5 h-5 text-cyan-300 mb-2" /><strong className="block text-sm text-white">Local Drafts</strong><span className="block text-[11px] text-slate-400 mt-1">Private browser storage on this device.</span></button><button type="button" onClick={() => chooseMode(AUTHOR_STORAGE_MODE.SHARED)} className={`rounded-xl border p-4 text-left ${isShared ? 'border-amber-600 bg-amber-950/30' : 'border-slate-800 bg-slate-950/40'}`}><Cloud className="w-5 h-5 text-amber-300 mb-2" /><strong className="block text-sm text-white">Shared Drafts</strong><span className="block text-[11px] text-slate-400 mt-1">Private server drafts protected by Author ownership and revision checks.</span></button></div></section>}

        {error && <p role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-3 text-xs text-rose-200">{error}</p>}

        <AuthorStorageMigrationPanel
          coordinator={coordinator}
          featureEnabled={sharedFeatureEnabled}
          storageMode={storageMode}
          onCopied={refresh}
        />

        <AuthorHandoffImportPreview
          currentUser={currentUser}
          storageMode={storageMode}
          existingDrafts={drafts}
          releaseCandidates={releaseCandidates}
          onCreatePrivateDraft={importPrivateHandoffDraft}
          onUpdateLocalDraft={importPrivateHandoffDraft}
          onUpdateSharedDraft={updateSharedHandoffDraft}
        />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button type="button" onClick={() => setShowCreate(value => !value)} className="text-left rounded-2xl border border-cyan-800/70 bg-cyan-950/20 p-5 hover:bg-cyan-950/35"><FilePlus2 className="w-6 h-6 text-cyan-300 mb-3" /><strong className="block text-white">Create New Follow Along</strong><span className="block text-xs text-slate-400 mt-1">Create an unpublished draft in {storageLabel}.</span></button>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><FolderOpen className="w-6 h-6 text-blue-300 mb-3" /><strong className="block text-white">Continue {storageLabel}</strong><span className="block text-xs text-slate-400 mt-1">{drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} available in this mode.</span></div>
        </section>

        {showCreate && <form onSubmit={createDraft} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4"><h2 className="text-lg font-bold text-white">Create in {storageLabel}</h2><label className="block"><span className="block text-xs font-semibold text-slate-300 mb-1.5">Official AWS service name</span><input autoFocus value={form.serviceName} onChange={event => setForm(value => ({ ...value, serviceName: event.target.value }))} placeholder="Amazon VPC" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" /></label><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label><span className="block text-xs font-semibold text-slate-300 mb-1.5">Short name</span><input value={form.shortName} onChange={event => setForm(value => ({ ...value, shortName: event.target.value }))} placeholder="VPC" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" /></label><label><span className="block text-xs font-semibold text-slate-300 mb-1.5">Programme title</span><input value={form.displayName} onChange={event => setForm(value => ({ ...value, displayName: event.target.value }))} placeholder="VPC Follow Along" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" /></label></div><div className="flex justify-end gap-3"><button type="button" onClick={() => { setShowCreate(false); setForm(emptyForm); }} className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">Cancel</button><button type="submit" className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white">Create Unpublished Draft</button></div></form>}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800"><h2 className="font-bold text-white">{storageLabel}</h2><span className="text-[11px] text-slate-500">Learner visibility: hidden</span></div>
          {loadingDrafts ? <p className="p-6 text-sm text-slate-400">Loading {storageLabel.toLowerCase()}...</p> : drafts.length === 0 ? <p className="p-6 text-sm text-slate-400">No drafts in this mode.</p> : <div className="divide-y divide-slate-800">{drafts.map(draft => <AuthorDraftRow key={draft.draft.draftId} draft={draft} storageLabel={storageLabel} isLive={publishedDraftIds.has(draft.draft.draftId)} liveStatusKnown={!isShared || liveStatusKnown} onOpen={openDraft} onDelete={deleteDraft} />)}</div>}
        </section>
      </div>
    </main>
  );
};
