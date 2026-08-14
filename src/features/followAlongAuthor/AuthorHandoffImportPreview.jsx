import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, ShieldCheck, Upload, X } from 'lucide-react';
import {
  AUTHOR_HANDOFF_IMPORT_CONFIRMATION,
  AUTHOR_HANDOFF_LOCAL_UPDATE_CONFIRMATION,
  prepareAuthorHandoffControlledImport
} from './authorHandoffControlledImport.js';
import {
  AUTHOR_HANDOFF_UPDATE_CONFIRMATION,
  prepareAuthorHandoffControlledUpdate
} from './authorHandoffControlledUpdate.js';
import { readAuthorHandoffJsonFile } from './authorHandoffPreview.js';

const inputClass = 'block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white';

export function AuthorHandoffImportPreview({
  currentUser,
  storageMode,
  existingDrafts = [],
  releaseCandidates = [],
  onCreatePrivateDraft,
  onUpdateLocalDraft,
  onUpdateSharedDraft
}) {
  const [documents, setDocuments] = useState({ handoffPackage: null, acceptance: null });
  const [names, setNames] = useState({ handoffPackage: '', acceptance: '' });
  const [preview, setPreview] = useState(null);
  const [importPlan, setImportPlan] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [importing, setImporting] = useState(false);
  const [inputVersion, setInputVersion] = useState(0);

  const loadFile = async (key, file) => {
    setPreview(null);
    setImportPlan(null);
    setImportResult(null);
    setConfirmed(false);
    setError('');
    if (!file) {
      setDocuments(value => ({ ...value, [key]: null }));
      setNames(value => ({ ...value, [key]: '' }));
      return;
    }
    try {
      const document = await readAuthorHandoffJsonFile(file);
      setDocuments(value => ({ ...value, [key]: document }));
      setNames(value => ({ ...value, [key]: file.name }));
    } catch (fileError) {
      setDocuments(value => ({ ...value, [key]: null }));
      setNames(value => ({ ...value, [key]: '' }));
      setError(fileError.message);
    }
  };

  const validate = async () => {
    if (!documents.handoffPackage || !documents.acceptance) {
      setError('Choose both the Step 90 package and Step 90A acceptance audit.');
      return;
    }
    setChecking(true);
    setError('');
    setPreview(null);
    setImportPlan(null);
    setImportResult(null);
    setConfirmed(false);
    try {
      const preparingUpdate = documents.handoffPackage?.generationMode === 'update_existing';
      const prepare = preparingUpdate ? prepareAuthorHandoffControlledUpdate : prepareAuthorHandoffControlledImport;
      const plan = await prepare({
        ...documents,
        currentUser,
        existingDrafts,
        releaseCandidates,
        storageMode
      });
      setPreview(plan.preview);
      setImportPlan(plan);
    } catch (validationError) {
      setError(validationError.message);
    } finally {
      setChecking(false);
    }
  };

  const clear = () => {
    setDocuments({ handoffPackage: null, acceptance: null });
    setNames({ handoffPackage: '', acceptance: '' });
    setPreview(null);
    setImportPlan(null);
    setImportResult(null);
    setConfirmed(false);
    setError('');
    setInputVersion(value => value + 1);
  };

  const applyControlledPackage = async () => {
    if (!importPlan || !confirmed) {
      setError('Review the exact comparison and confirm the controlled draft action.');
      return;
    }
    const updatingShared = importPlan.operation === 'update_existing';
    const updatingLocal = importPlan.operation === 'update_existing_local';
    const action = updatingShared ? onUpdateSharedDraft : updatingLocal ? onUpdateLocalDraft : onCreatePrivateDraft;
    if (typeof action !== 'function') {
      setError(updatingShared ? 'Shared Draft updating is unavailable.' : updatingLocal ? 'Local Draft updating is unavailable.' : 'Private Author draft creation is unavailable.');
      return;
    }
    setImporting(true);
    setError('');
    setImportResult(null);
    try {
      const result = await action({
        ...documents,
        preparedPlan: importPlan,
        confirmation: updatingShared ? AUTHOR_HANDOFF_UPDATE_CONFIRMATION : updatingLocal ? AUTHOR_HANDOFF_LOCAL_UPDATE_CONFIRMATION : AUTHOR_HANDOFF_IMPORT_CONFIRMATION
      });
      if (!result?.success) {
        setError(result?.error || 'The controlled import stopped safely.');
        return;
      }
      setImportResult(result);
      setConfirmed(false);
    } catch (importError) {
      setError(importError?.message || 'The controlled import stopped safely.');
    } finally {
      setImporting(false);
    }
  };

  return <section className="rounded-2xl border border-violet-800/70 bg-violet-950/15 p-5 space-y-4" aria-labelledby="author-handoff-preview-title">
    <div className="flex items-start gap-3">
      <div className="rounded-xl border border-violet-700 bg-violet-950 p-2.5"><FileCheck2 className="h-5 w-5 text-violet-300" /></div>
      <div><span className="text-xs font-bold uppercase tracking-wider text-violet-300">Step 91 · Read-only handoff preview</span><h2 id="author-handoff-preview-title" className="mt-1 text-lg font-extrabold text-white">Preview an accepted Author Assistant package</h2><p className="mt-1 text-xs leading-relaxed text-slate-400">Select the local Step 90 package and Step 90A audit. The browser checks them without creating or saving a draft.</p></div>
    </div>

    <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-3 text-xs text-emerald-200 flex items-start gap-2"><ShieldCheck className="h-4 w-4 shrink-0" /><span><strong>Preview only.</strong> No identity binding, local draft save, Supabase write, AWS connection, candidate, approval or publishing action is available here.</span></div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">1. Step 90 handoff package</span><input key={`package-${inputVersion}`} type="file" accept="application/json,.json" onChange={event => void loadFile('handoffPackage', event.target.files?.[0])} className={inputClass} /><span className="mt-1 block truncate text-[11px] text-slate-500">{names.handoffPackage || 'No package selected'}</span></label>
      <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">2. Step 90A acceptance audit</span><input key={`acceptance-${inputVersion}`} type="file" accept="application/json,.json" onChange={event => void loadFile('acceptance', event.target.files?.[0])} className={inputClass} /><span className="mt-1 block truncate text-[11px] text-slate-500">{names.acceptance || 'No audit selected'}</span></label>
    </div>

    <div className="flex flex-wrap gap-2"><button type="button" disabled={checking} onClick={() => void validate()} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Upload className="h-4 w-4" /> {checking ? 'Checking fingerprints...' : 'Validate Read-Only Preview'}</button><button type="button" onClick={clear} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200"><X className="h-4 w-4" /> Clear</button></div>

    {error && <p role="alert" className="rounded-xl border border-rose-800 bg-rose-950/30 p-3 text-xs text-rose-200">{error}</p>}

    {preview && <div role="status" className="rounded-xl border border-emerald-700 bg-emerald-950/20 p-4 space-y-4">
      <div className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" /><div><strong className="text-sm text-white">Fingerprints verified — read-only preview ready</strong><p className="mt-1 text-xs text-slate-400">{preview.programme.displayName}</p></div></div>
      <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4"><div><span className="block text-slate-500">Phases</span><strong className="text-white">{preview.summary.phaseCount}</strong></div><div><span className="block text-slate-500">Tasks</span><strong className="text-white">{preview.summary.taskCount}</strong></div><div><span className="block text-slate-500">Checkboxes</span><strong className="text-white">{preview.summary.checkboxCount}</strong></div><div><span className="block text-slate-500">Verification checks</span><strong className="text-white">{preview.summary.verificationCheckCount}</strong></div><div><span className="block text-slate-500">Cleanup items</span><strong className="text-white">{preview.summary.cleanupItemCount}</strong></div><div><span className="block text-slate-500">Resource values</span><strong className="text-white">{preview.summary.learnerResourceValueCount}</strong></div><div><span className="block text-slate-500">AWS sources</span><strong className="text-white">{preview.summary.officialAwsSourceCount}</strong></div><div><span className="block text-slate-500">Stage 12</span><strong className="text-emerald-300">Not started</strong></div></div>
      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs"><span className="block text-slate-500">Intended future draft owner — not yet bound</span><strong className="mt-1 block text-white">{preview.intendedAuthor.email}</strong><code className="mt-1 block break-all text-[10px] text-slate-500">{preview.intendedAuthor.id}</code></div>
      <div className="text-[10px] text-slate-500"><span className="block">Handoff SHA-256</span><code className="break-all text-violet-200">{preview.handoffFingerprint}</code></div>
    </div>}

    {importPlan && <div className="rounded-xl border border-cyan-700 bg-cyan-950/20 p-4 space-y-4" aria-label="Exact controlled draft comparison">
      <div className="flex items-start gap-2"><LockKeyhole className="h-5 w-5 shrink-0 text-cyan-300" /><div><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{importPlan.operation === 'update_existing' ? 'Controlled existing Follow Along update' : importPlan.operation === 'update_existing_local' ? 'Controlled revised package import' : 'Step 92 - Controlled private draft import'}</span><h3 className="mt-1 text-sm font-bold text-white">Exact pre-import comparison</h3><p className="mt-1 text-xs text-slate-400">{importPlan.operation === 'update_existing' ? 'The selected owned Shared Draft will move forward by exactly one revision. No new draft is created.' : importPlan.operation === 'update_existing_local' ? 'The existing Local Draft from this Author Assistant session will move forward by exactly one revision. Shared Drafts are not changed.' : 'Accepted Stages 1-11 are copied unchanged. Only the private draft identity and import audit are added.'}</p></div></div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-center">
        <div><span className="block text-[10px] uppercase tracking-wide text-slate-500">Before</span><strong className="text-xl text-white">{importPlan.operation === 'update_existing' || importPlan.operation === 'update_existing_local' ? importPlan.beforeRevision ?? '-' : importPlan.beforeDraftCount}</strong><span className="block text-[10px] text-slate-500">{importPlan.operation === 'update_existing' ? 'Shared revision' : importPlan.operation === 'update_existing_local' ? 'Local revision' : 'Local drafts'}</span></div>
        <ArrowRight className="h-5 w-5 text-cyan-400" />
        <div><span className="block text-[10px] uppercase tracking-wide text-slate-500">After</span><strong className="text-xl text-white">{importPlan.operation === 'update_existing' || importPlan.operation === 'update_existing_local' ? importPlan.afterRevision ?? '-' : importPlan.afterDraftCount}</strong><span className="block text-[10px] text-slate-500">{importPlan.operation === 'update_existing' ? 'Shared revision' : importPlan.operation === 'update_existing_local' ? 'Local revision' : 'Local drafts'}</span></div>
      </div>

      <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"><dt className="text-slate-500">Programme</dt><dd className="mt-1 font-semibold text-white">{preview.programme.displayName}</dd></div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"><dt className="text-slate-500">Storage</dt><dd className="mt-1 font-semibold text-white">{importPlan.storageLabel}</dd></div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"><dt className="text-slate-500">Owner to bind</dt><dd className="mt-1 break-all font-semibold text-white">{preview.intendedAuthor.email}</dd></div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3"><dt className="text-slate-500">Draft action</dt><dd className="mt-1 text-white">{importPlan.operation === 'update_existing' || importPlan.operation === 'update_existing_local' ? `Existing draft to revision ${importPlan.afterRevision ?? '-'}` : 'New draft - Revision 1'}</dd></div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 sm:col-span-2"><dt className="text-slate-500">Draft ID</dt><dd className="mt-1 break-all font-mono text-[10px] text-cyan-200">{importPlan.operation === 'update_existing' || importPlan.operation === 'update_existing_local' ? importPlan.existingDraft?.draft?.draftId || 'Not found' : importPlan.identity.draftId}</dd></div>
      </dl>

      <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4"><span className="rounded-lg bg-slate-950/50 p-2 text-slate-300">{preview.summary.phaseCount} phases</span><span className="rounded-lg bg-slate-950/50 p-2 text-slate-300">{preview.summary.taskCount} tasks</span><span className="rounded-lg bg-slate-950/50 p-2 text-slate-300">{preview.summary.checkboxCount} checkboxes</span><span className="rounded-lg bg-slate-950/50 p-2 text-slate-300">{preview.summary.verificationCheckCount} checks</span><span className="rounded-lg bg-slate-950/50 p-2 text-slate-300">{preview.summary.cleanupItemCount} cleanup items</span><span className="rounded-lg bg-slate-950/50 p-2 text-slate-300">{preview.summary.officialAwsSourceCount} AWS sources</span><span className="rounded-lg bg-slate-950/50 p-2 text-emerald-300">Content unchanged</span><span className="rounded-lg bg-slate-950/50 p-2 text-emerald-300">Stage 12 not started</span></div>

      <div className="text-[10px] text-slate-500"><span className="block">Prepared private draft SHA-256</span><code className="break-all text-cyan-200">{importPlan.draftFingerprint}</code></div>

      {importPlan.blockedReason && <p role="alert" className="rounded-lg border border-amber-800 bg-amber-950/30 p-3 text-xs text-amber-200">{importPlan.blockedReason}{importPlan.duplicateDraftId ? ` Existing draft: ${importPlan.duplicateDraftId}` : ''}</p>}

      {(importPlan.canCreate || importPlan.canUpdate || importPlan.canUpdateLocal) && !importResult && <div className="rounded-lg border border-cyan-800 bg-slate-950/50 p-3 space-y-3"><label className="flex items-start gap-2 text-xs text-slate-200"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-0.5" /><span>{importPlan.operation === 'update_existing' ? <>I confirm this exact comparison and want to update exactly one existing Shared Draft owned by <strong>{preview.intendedAuthor.email}</strong>.</> : importPlan.operation === 'update_existing_local' ? <>I confirm this exact comparison and want to update exactly one existing Local Draft owned by <strong>{preview.intendedAuthor.email}</strong>. Shared Drafts will not change.</> : <>I confirm this exact comparison and want to create exactly one private Local Draft owned by <strong>{preview.intendedAuthor.email}</strong>.</>}</span></label><button type="button" disabled={!confirmed || importing} onClick={() => void applyControlledPackage()} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-40"><LockKeyhole className="h-4 w-4" />{importing ? (importPlan.operation === 'update_existing' ? 'Updating one Shared Draft...' : importPlan.operation === 'update_existing_local' ? 'Updating one Local Draft...' : 'Creating one private draft...') : (importPlan.operation === 'update_existing' ? 'Update This Existing Follow Along' : importPlan.operation === 'update_existing_local' ? 'Update This Existing Local Draft' : 'Create One Private Author Draft')}</button></div>}

      {importResult && <div role="status" className="rounded-lg border border-emerald-700 bg-emerald-950/25 p-3 text-xs text-emerald-200"><strong className="block">{importPlan.operation === 'update_existing' ? 'Exactly one existing Shared Draft updated' : importPlan.operation === 'update_existing_local' ? 'Exactly one existing Local Draft updated' : 'Exactly one private Author draft created'}</strong><span className="mt-1 block">{importResult.draftId} - Revision {importResult.revision}</span><span className="mt-1 block">No candidate, approval or publication action occurred.</span></div>}
    </div>}
  </section>;
}
