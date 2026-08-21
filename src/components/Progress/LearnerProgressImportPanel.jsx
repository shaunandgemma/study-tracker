import React, { useState } from 'react';
import { CheckCircle2, Database, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth.js';
import { loadChecklistState, loadFlaggedState } from '../../utils/storage.js';
import { loadTroubleshootingProgress } from '../../features/troubleshooting/troubleshootingProgress.js';
import { supportsLearnerAccountProgress } from '../../services/learnerChecklistFlagProgress.js';
import { learnerProgressImportCoordinator } from '../../services/learnerProgressImport.js';
import { protectedTroubleshootingContentService } from '../../services/protectedTroubleshootingContentService.js';

function readBrowserSnapshot(examId) {
  return {
    checklist: loadChecklistState()[examId] || {},
    flagged: loadFlaggedState()[examId] || {},
    troubleshooting: loadTroubleshootingProgress()
  };
}

const Count = ({ label, value }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2">
    <p className="text-lg font-black text-white">{value}</p>
    <p className="text-[10px] font-bold text-slate-500">{label}</p>
  </div>
);

export const LearnerProgressImportPanel = ({ examId }) => {
  const { currentUser, isDemoAccount } = useAuth();
  const [preview, setPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!currentUser?.id || isDemoAccount || !supportsLearnerAccountProgress(examId)) return null;

  const loadVisibleChallengeIds = async () => {
    const result = await protectedTroubleshootingContentService.listForExam(examId);
    if (!result.success) throw new Error(result.error || 'Protected Troubleshooting Challenges are unavailable.');
    return result.challenges.map(challenge => challenge.id);
  };

  const createPreview = async () => {
    setLoading(true);
    setMessage('');
    setConfirmed(false);
    try {
      const challengeIds = await loadVisibleChallengeIds();
      const result = await learnerProgressImportCoordinator.preview({
        userId: currentUser.id,
        examId,
        browserSnapshot: readBrowserSnapshot(examId),
        challengeIds
      });
      if (!result.success) {
        setPreview(null);
        setMessage(result.error);
      } else {
        setPreview(result);
      }
    } catch (error) {
      setPreview(null);
      setMessage(error.message || 'The progress comparison could not be created.');
    } finally {
      setLoading(false);
    }
  };

  const importSafeChanges = async () => {
    if (!preview || !confirmed) return;
    setLoading(true);
    setMessage('');
    try {
      const challengeIds = await loadVisibleChallengeIds();
      const result = await learnerProgressImportCoordinator.importPreview({
        acceptedPreview: preview,
        userId: currentUser.id,
        examId,
        browserSnapshot: readBrowserSnapshot(examId),
        challengeIds
      });
      if (result.success) {
        const successMessage = result.noChanges
          ? 'No new browser progress needed importing.'
          : `${result.importedItems} browser progress item${result.importedItems === 1 ? '' : 's'} imported and verified. Your browser copy was kept.`;
        setConfirmed(false);
        const refreshed = await learnerProgressImportCoordinator.preview({
          userId: currentUser.id,
          examId,
          browserSnapshot: readBrowserSnapshot(examId),
          challengeIds
        });
        setPreview(refreshed.success ? refreshed : null);
        setMessage(refreshed.success ? successMessage : refreshed.error);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage(error.message || 'The controlled import could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-cyan-900/70 bg-slate-900/70 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-cyan-300"><Database className="h-5 w-5" /><h2 className="text-sm font-black text-white">Move existing browser progress to this account</h2></div>
          <p className="mt-2 text-xs leading-6 text-slate-400">Create a read-only comparison first. Nothing is imported until you confirm it. Browser progress is kept, and different Troubleshooting notebook text is always skipped.</p>
        </div>
        <button type="button" onClick={createPreview} disabled={loading} className="rounded-xl border border-cyan-800 bg-cyan-950/50 px-4 py-2.5 text-xs font-black text-cyan-200 transition hover:bg-cyan-900/60 disabled:opacity-50">
          {loading ? 'Checking...' : 'Compare Progress'}
        </button>
      </div>

      {preview && (
        <div className="mt-5 border-t border-slate-800 pt-5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Count label="Checklist changes" value={preview.counts.checklistChanges} />
            <Count label="Question flags" value={preview.counts.questionFlagChanges} />
            <Count label="Safe notebooks" value={preview.counts.troubleshootingImports} />
            <Count label="Matching items" value={preview.counts.matchingItems} />
            <Count label="Notebook conflicts" value={preview.counts.conflicts} />
            <Count label="Safe changes" value={preview.counts.safeChanges} />
          </div>

          {preview.counts.conflicts > 0 && (
            <div className="mt-4 flex gap-3 rounded-xl border border-amber-700/50 bg-amber-950/30 p-3 text-xs leading-5 text-amber-200">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{preview.counts.conflicts} Troubleshooting notebook conflict{preview.counts.conflicts === 1 ? '' : 's'} will be skipped. Neither the browser text nor account text will be changed.</p>
            </div>
          )}

          {(preview.safeActions.length > 0 || preview.conflicts.length > 0) && (
            <details className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <summary className="cursor-pointer text-xs font-black text-slate-300">Show exact comparison items</summary>
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-2 text-[11px]">
                {preview.safeActions.map(action => (
                  <p key={`${action.progressType}:${action.contentId}`} className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 px-3 py-2 text-emerald-200">
                    Safe import · {action.category.replaceAll('_', ' ')} · <code>{action.contentId}</code>
                  </p>
                ))}
                {preview.conflicts.map(conflict => (
                  <p key={`${conflict.progressType}:${conflict.contentId}`} className="rounded-lg border border-amber-900/50 bg-amber-950/20 px-3 py-2 text-amber-200">
                    Skipped conflict · Troubleshooting · <code>{conflict.contentId}</code>
                  </p>
                ))}
              </div>
            </details>
          )}

          {preview.alreadyImported ? (
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-300"><CheckCircle2 className="h-4 w-4" /> This exact import was already completed.</p>
          ) : preview.counts.safeChanges > 0 ? (
            <>
              <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/50 p-3 text-xs leading-5 text-slate-300">
                <input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} className="mt-1" />
                <span>I confirm these {preview.counts.safeChanges} safe browser change{preview.counts.safeChanges === 1 ? '' : 's'} should be copied to my signed-in account. Keep the browser copy and skip all notebook conflicts.</span>
              </label>
              <button type="button" onClick={importSafeChanges} disabled={!confirmed || loading} className="mt-3 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40">Import Confirmed Safe Changes</button>
            </>
          ) : (
            <p className="mt-4 text-xs font-bold text-emerald-300">No safe browser changes need importing.</p>
          )}

          <p className="mt-4 break-all text-[10px] text-slate-600">Comparison fingerprint: {preview.fingerprint}</p>
        </div>
      )}

      {message && <p className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-xs font-bold text-slate-300" role="status">{message}</p>}
    </section>
  );
};
