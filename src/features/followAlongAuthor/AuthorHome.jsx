import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Cloud, FilePlus2, FolderOpen, HardDrive, ShieldCheck } from 'lucide-react';
import { createAuthorDraft } from './authorDraftService.js';
import { AuthorDraftEditor } from './AuthorDraftEditor.jsx';
import { AuthorStorageMigrationPanel } from './AuthorStorageMigrationPanel.jsx';
import { AUTHOR_STORAGE_MODE, createAuthorStorageCoordinator } from './authorStorageCoordinator.js';
import { isAuthorSharedStorageEnabled } from './authorSharedStorageService.js';

const emptyForm = { serviceName: '', shortName: '', displayName: '', description: '' };

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

  const refresh = useCallback(async () => {
    setLoadingDrafts(true);
    const result = await coordinator.listDrafts();
    setDrafts(result.drafts || []);
    setError(result.success ? '' : result.error);
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

  if (activeDraft) return <AuthorDraftEditor initialDraft={activeDraft} userId={currentUser.id} storageMode={storageMode} onSaveDraft={values => coordinator.saveDraft(values)} onStoreReleaseCandidate={candidate => coordinator.storeReleaseCandidate(candidate)} onCancel={() => { setActiveDraft(null); void refresh(); }} onSavedAndExit={() => { setActiveDraft(null); void refresh(); }} />;

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
        />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button type="button" onClick={() => setShowCreate(value => !value)} className="text-left rounded-2xl border border-cyan-800/70 bg-cyan-950/20 p-5 hover:bg-cyan-950/35"><FilePlus2 className="w-6 h-6 text-cyan-300 mb-3" /><strong className="block text-white">Create New Follow Along</strong><span className="block text-xs text-slate-400 mt-1">Create an unpublished draft in {storageLabel}.</span></button>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><FolderOpen className="w-6 h-6 text-blue-300 mb-3" /><strong className="block text-white">Continue {storageLabel}</strong><span className="block text-xs text-slate-400 mt-1">{drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'} available in this mode.</span></div>
        </section>

        {showCreate && <form onSubmit={createDraft} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4"><h2 className="text-lg font-bold text-white">Create in {storageLabel}</h2><label className="block"><span className="block text-xs font-semibold text-slate-300 mb-1.5">Official AWS service name</span><input autoFocus value={form.serviceName} onChange={event => setForm(value => ({ ...value, serviceName: event.target.value }))} placeholder="Amazon VPC" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" /></label><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label><span className="block text-xs font-semibold text-slate-300 mb-1.5">Short name</span><input value={form.shortName} onChange={event => setForm(value => ({ ...value, shortName: event.target.value }))} placeholder="VPC" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" /></label><label><span className="block text-xs font-semibold text-slate-300 mb-1.5">Programme title</span><input value={form.displayName} onChange={event => setForm(value => ({ ...value, displayName: event.target.value }))} placeholder="VPC Follow Along" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" /></label></div><div className="flex justify-end gap-3"><button type="button" onClick={() => { setShowCreate(false); setForm(emptyForm); }} className="px-4 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">Cancel</button><button type="submit" className="px-4 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white">Create Unpublished Draft</button></div></form>}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800"><h2 className="font-bold text-white">{storageLabel}</h2><span className="text-[11px] text-slate-500">Learner visibility: hidden</span></div>
          {loadingDrafts ? <p className="p-6 text-sm text-slate-400">Loading {storageLabel.toLowerCase()}...</p> : drafts.length === 0 ? <p className="p-6 text-sm text-slate-400">No drafts in this mode.</p> : <div className="divide-y divide-slate-800">{drafts.map(draft => <div key={draft.draft.draftId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><strong className="text-sm text-white">{draft.programme.displayName}</strong><span className="block text-xs text-slate-400 mt-1">{draft.programme.serviceName || 'Service not named'} · Revision {draft.draft.revision} · {draft.draft.status.replaceAll('_', ' ')}</span><span className="block text-[11px] text-slate-500 mt-1">Storage: {storageLabel} · Learner visibility: hidden</span></div><button type="button" onClick={() => openDraft(draft)} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white inline-flex items-center justify-center gap-2"><FolderOpen className="w-4 h-4" /> Continue Draft</button></div>)}</div>}
        </section>
      </div>
    </main>
  );
};
