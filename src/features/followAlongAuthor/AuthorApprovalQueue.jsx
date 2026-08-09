import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import {
  AUTHOR_APPROVAL_STORAGE_AUTHORITY,
  canApproveAuthorRelease,
} from "./authorApproval.js";
import {
  CONTROLLED_PUBLISHING_CONFIRMATION,
  CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID,
  createAuthorSharedStorageService,
} from "./authorSharedStorageService.js";
import { createPublishedFollowAlongService } from "../followAlongs/published/publishedFollowAlongService.js";

function title(candidate) {
  return (
    candidate?.snapshot?.programme?.displayName ||
    candidate?.draft_id ||
    "Untitled Follow Along"
  );
}

function ControlledPublishingPanel({
  candidate,
  service,
  published,
  onPublished,
}) {
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const phaseCount = candidate.snapshot?.phases?.length || 0;
  const taskCount = candidate.snapshot?.tasks?.length || 0;

  if (
    !service.publishingEnabled ||
    candidate.candidate_id !== CONTROLLED_PUBLISHING_PILOT_CANDIDATE_ID
  )
    return null;
  if (published)
    return (
      <section className="rounded-xl border border-cyan-800 bg-cyan-950/20 p-4 text-xs text-cyan-100">
        <strong>Published safely.</strong> The approved Lambda trial is now
        available through the Follow Along page.
      </section>
    );

  const publish = async () => {
    setBusy(true);
    setMessage("");
    const result = await service.publishReleaseCandidate(
      candidate.candidate_id,
      confirmation,
    );
    setBusy(false);
    if (!result.success) {
      setMessage(result.error);
      return;
    }
    setConfirmation("");
    setMessage(
      "Lambda published. No existing Follow Along or learner progress was changed.",
    );
    await onPublished();
  };

  return (
    <section className="rounded-xl border border-cyan-800 bg-cyan-950/20 p-4 space-y-4">
      <div>
        <strong className="text-sm text-cyan-100">
          Step 54 controlled publishing
        </strong>
        <p className="mt-1 text-xs text-slate-300">
          This is a separate action from approval.
        </p>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-xs text-slate-300">
        <strong className="text-white">Exact change summary</strong>
        <ol className="mt-3 space-y-1.5">
          <li>1. Add one learner programme: Lambda.</li>
          <li>
            2. Publish {phaseCount} phases and {taskCount} approved tasks from
            revision {candidate.source_revision}.
          </li>
          <li>3. Keep every approved task instruction unchanged.</li>
          <li>4. Leave all existing Follow Alongs unchanged.</li>
          <li>5. Leave all existing learner progress unchanged.</li>
          <li>6. Add no Generator or Hands On dependency.</li>
        </ol>
        <div className="mt-3">
          <span className="block text-slate-500">Approved fingerprint</span>
          <code className="text-cyan-200 break-all">
            {candidate.content_hash}
          </code>
        </div>
      </div>
      <label className="block text-xs font-semibold text-slate-300">
        Enter{" "}
        <code className="text-cyan-200">
          {CONTROLLED_PUBLISHING_CONFIRMATION}
        </code>{" "}
        exactly
        <input
          aria-label="Controlled publishing confirmation"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        />
      </label>
      <button
        type="button"
        disabled={busy || confirmation !== CONTROLLED_PUBLISHING_CONFIRMATION}
        onClick={() => void publish()}
        className="px-4 py-2.5 rounded-xl bg-cyan-700 disabled:opacity-40 text-xs font-bold text-white inline-flex items-center gap-2"
      >
        <UploadCloud className="w-4 h-4" />{" "}
        {busy ? "Publishing…" : "Publish only Lambda"}
      </button>
      {message && (
        <p role="status" className="text-xs text-cyan-100">
          {message}
        </p>
      )}
    </section>
  );
}

export function AuthorApprovalQueue({ currentUser }) {
  const service = useMemo(
    () => createAuthorSharedStorageService(undefined, { enabled: true }),
    [],
  );
  const publishedService = useMemo(
    () => createPublishedFollowAlongService(),
    [],
  );
  const [candidates, setCandidates] = useState([]);
  const [publishedCandidateIds, setPublishedCandidateIds] = useState(new Set());
  const [confirmations, setConfirmations] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [result, publishedResult] = await Promise.all([
      service.listReleaseCandidates(),
      publishedService.listPublishedProgrammes(),
    ]);
    setCandidates(result.candidates || []);
    setPublishedCandidateIds(
      new Set((publishedResult.rows || []).map((row) => row.candidate_id)),
    );
    setMessage(result.success ? "" : result.error);
    setLoading(false);
  }, [publishedService, service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const approve = async (candidate) => {
    const access = canApproveAuthorRelease({
      user: currentUser,
      createdBy: candidate.created_by,
      storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER,
    });
    if (!access.allowed) {
      setMessage(access.reason);
      return;
    }
    if (confirmations[candidate.candidate_id] !== candidate.candidate_id) {
      setMessage("Enter the exact candidate ID before approval.");
      return;
    }
    const result = await service.approveReleaseCandidate(
      candidate.candidate_id,
    );
    if (!result.success) {
      setMessage(result.error);
      return;
    }
    setMessage(
      "Release candidate approved. It remains unpublished until the separate controlled publishing confirmation is completed.",
    );
    setConfirmations((values) => ({ ...values, [candidate.candidate_id]: "" }));
    await refresh();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="rounded-2xl border border-emerald-800 bg-emerald-950/20 p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-300 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Separate trusted role
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">
                Follow Along Approval Queue
              </h1>
              <p className="text-sm text-slate-300 mt-2">
                Approve immutable shared candidates, then use the separately
                protected publishing action only when it is enabled.
              </p>
            </div>
          </div>
        </header>
        {message && (
          <p
            role="status"
            className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-200"
          >
            {message}
          </p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void refresh()}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh queue
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-slate-400">
            Loading the private approval queue...
          </p>
        ) : candidates.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            No release candidates are waiting.
          </p>
        ) : (
          <section className="space-y-4">
            {candidates.map((candidate) => {
              const pending =
                candidate.status === "awaiting_trusted_approval" &&
                candidate.approval_decision === "pending";
              const approved =
                candidate.status === "approved_release_candidate" &&
                candidate.approval_decision === "approved";
              const access = canApproveAuthorRelease({
                user: currentUser,
                createdBy: candidate.created_by,
                storageAuthority:
                  AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER,
              });
              return (
                <article
                  key={candidate.candidate_id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4"
                >
                  <div>
                    <strong className="text-lg text-white">
                      {title(candidate)}
                    </strong>
                    <span className="block text-[11px] text-slate-500 mt-1 break-all">
                      {candidate.candidate_id}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="block text-slate-500">
                        Source revision
                      </span>
                      <strong>{candidate.source_revision}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-500">Decision</span>
                      <strong
                        className={
                          pending ? "text-amber-300" : "text-emerald-300"
                        }
                      >
                        {candidate.approval_decision}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-slate-500">Publication</span>
                      <strong>
                        {publishedCandidateIds.has(candidate.candidate_id)
                          ? "Published"
                          : "Not published"}
                      </strong>
                    </div>
                    <div className="sm:col-span-3">
                      <span className="block text-slate-500">
                        Server fingerprint
                      </span>
                      <code className="text-cyan-200 break-all">
                        {candidate.content_hash}
                      </code>
                    </div>
                  </div>
                  {pending && access.allowed && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Enter the exact candidate ID to confirm approval
                        <input
                          value={confirmations[candidate.candidate_id] || ""}
                          onChange={(event) =>
                            setConfirmations((values) => ({
                              ...values,
                              [candidate.candidate_id]: event.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={
                          confirmations[candidate.candidate_id] !==
                          candidate.candidate_id
                        }
                        onClick={() => void approve(candidate)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-700 disabled:opacity-40 text-xs font-bold text-white inline-flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve release
                        candidate
                      </button>
                    </div>
                  )}
                  {pending && !access.allowed && (
                    <p className="rounded-xl border border-rose-900 bg-rose-950/20 p-3 text-xs text-rose-200">
                      {access.reason}
                    </p>
                  )}
                  {approved && (
                    <p className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-3 text-xs text-emerald-200">
                      Approved by a separate trusted account.
                    </p>
                  )}
                  {approved && (
                    <ControlledPublishingPanel
                      candidate={candidate}
                      service={service}
                      published={publishedCandidateIds.has(candidate.candidate_id)}
                      onPublished={refresh}
                    />
                  )}
                </article>
              );
            })}
          </section>
        )}
        <section className="rounded-2xl border border-amber-900 bg-amber-950/20 p-4 text-xs text-amber-100">
          <strong>Safety boundary:</strong> publication is restricted to the
          one approved Lambda pilot candidate and requires the exact named
          confirmation. Normal publishing has no delete action.
        </section>
      </div>
    </main>
  );
}
