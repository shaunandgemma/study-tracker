import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
  XCircle,
} from "lucide-react";
import {
  AUTHOR_APPROVAL_STORAGE_AUTHORITY,
  canApproveAuthorRelease,
} from "./authorApproval.js";
import {
  createAuthorSharedStorageService,
  getControlledPublishingConfirmation,
} from "./authorSharedStorageService.js";
import { AuthorApproverReadinessPreview } from "./AuthorApproverReadinessPreview.jsx";
import {
  buildAuthorApproverReadinessPreview,
  isStep96SqsCandidate,
} from "./authorApproverReadiness.js";

const PUBLISHING_TIMEOUT_MS = 15000;
const QUEUE_TIMEOUT_MS = 15000;

async function withQueueTimeout(operation, label) {
  let timeoutId;
  try {
    return await Promise.race([
      operation,
      new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(`${label} did not respond within 15 seconds.`)),
          QUEUE_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function withPublishingTimeout(operation) {
  let timeoutId;
  try {
    return await Promise.race([
      operation,
      new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("Publishing did not respond within 15 seconds. Refresh the queue before trying again.")),
          PUBLISHING_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

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
  currentPublication,
  onPublished,
}) {
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const phaseCount = candidate.snapshot?.phases?.length || 0;
  const taskCount = candidate.snapshot?.tasks?.length || 0;
  const programme = candidate.snapshot?.programme || {};
  const programmeId = programme.programmeId;
  const serviceName = programme.shortName || programme.serviceName || programme.serviceSlug || "service";
  const requiredConfirmation = getControlledPublishingConfirmation(candidate);
  const published = currentPublication?.candidate_id === candidate.candidate_id;
  const olderThanPublished = Number(candidate.source_revision) <= Number(currentPublication?.source_revision || 0);

  if (!service.publishingEnabled || !programmeId || !requiredConfirmation) return null;
  if (published)
    return (
      <section className="rounded-xl border border-cyan-800 bg-cyan-950/20 p-4 text-xs text-cyan-100">
        <strong>Published safely.</strong> The approved {serviceName} Follow Along is now
        available through the Follow Along page.
      </section>
    );
  if (olderThanPublished)
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-xs text-slate-300">
        This approved revision is older than the currently published {serviceName} revision {currentPublication.source_revision}. It cannot be published again.
      </section>
    );

  const publish = async () => {
    setBusy(true);
    setMessage("");
    try {
      const draftResult = await withPublishingTimeout(service.loadDraft(candidate.draft_id));
      if (!draftResult.success) {
        setMessage(draftResult.error);
        return;
      }
      const currentRevision = Number(draftResult.row?.revision);
      const candidateRevision = Number(candidate.source_revision);
      const fingerprintsMatch = draftResult.row?.content_hash === candidate.draft_content_hash;
      if (currentRevision !== candidateRevision || !fingerprintsMatch) {
        setMessage(`This approved key is for revision ${candidateRevision}, but the draft is now revision ${currentRevision}. Return to Author and prepare a new candidate key for the latest saved draft.`);
        return;
      }
      const result = await withPublishingTimeout(service.publishReleaseCandidate(candidate.candidate_id, confirmation));
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setConfirmation("");
      setMessage(`${serviceName} published. Existing learner progress was not changed.`);
      void onPublished();
    } catch (error) {
      setMessage(error?.message || "Controlled publication failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-cyan-800 bg-cyan-950/20 p-4 space-y-4">
      <div>
        <strong className="text-sm text-cyan-100">
          Controlled {serviceName} publishing
        </strong>
        <p className="mt-1 text-xs text-slate-300">
          This is a separate action from approval.
        </p>
      </div>
      <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-xs text-slate-300">
        <strong className="text-white">Exact change summary</strong>
        <ol className="mt-3 space-y-1.5">
          <li>1. Publish only the learner programme: {serviceName}.</li>
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
          {requiredConfirmation}
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
        disabled={busy || confirmation !== requiredConfirmation}
        onClick={() => void publish()}
        className="px-4 py-2.5 rounded-xl bg-cyan-700 disabled:opacity-40 text-xs font-bold text-white inline-flex items-center gap-2"
      >
        <UploadCloud className="w-4 h-4" />{" "}
        {busy ? "Publishing..." : `Publish ${serviceName}`}
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
  const [candidates, setCandidates] = useState([]);
  const [publishedProgrammes, setPublishedProgrammes] = useState(new Map());
  const [confirmations, setConfirmations] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [approvalReadiness, setApprovalReadiness] = useState({});
  const [queueView, setQueueView] = useState("waiting");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [queueAction, setQueueAction] = useState(null);
  const queueActionRef = useRef(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setApprovalReadiness({});
    try {
      const result = await withQueueTimeout(
        service.listReleaseCandidates(),
        "The private approval queue",
      );
      setCandidates(result.candidates || []);
      if (!result.success) setMessage(result.error);
    } catch (error) {
      setCandidates([]);
      setMessage(error?.message || "Unable to load the private approval queue.");
    } finally {
      setLoading(false);
    }

    try {
      const publishedResult = await withQueueTimeout(
        service.listPublishedDrafts(),
        "Published Follow Along history",
      );
      if (publishedResult.success) {
        setPublishedProgrammes(new Map((publishedResult.publications || []).map((row) => [row.programme_id, row])));
      } else if (!publishedResult.disabled) {
        setMessage((current) => current || publishedResult.error);
      }
    } catch (error) {
      setMessage((current) => current || error?.message || "Unable to load published Follow Along history.");
    }
  }, [service]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const previewApprovalReadiness = useCallback(
    async ({ candidate, currentUser: previewUser, currentPublication }) => {
      const draftResult = await service.loadDraft(candidate.draft_id);
      if (!draftResult.success) {
        return {
          success: false,
          previewOnly: true,
          error: draftResult.error || "The protected Shared Draft could not be read.",
        };
      }
      return buildAuthorApproverReadinessPreview({
        candidate,
        currentUser: previewUser,
        draftResult,
        currentPublication,
      });
    },
    [service],
  );

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
    if (queueActionRef.current) {
      setMessage("An approval or rejection request is already in progress. Wait for it to finish before trying again.");
      return;
    }
    const action = { candidateId: candidate.candidate_id, type: "approve" };
    queueActionRef.current = action;
    setQueueAction(action);
    setMessage("Approval request sent once. Waiting for the protected database decision...");
    try {
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
    } finally {
      queueActionRef.current = null;
      setQueueAction(null);
    }
  };

  const reject = async (candidate) => {
    const access = canApproveAuthorRelease({
      user: currentUser,
      createdBy: candidate.created_by,
      storageAuthority: AUTHOR_APPROVAL_STORAGE_AUTHORITY.TRUSTED_SERVER,
    });
    if (!access.allowed) {
      setMessage(access.reason);
      return;
    }
    const reason = String(rejectionReasons[candidate.candidate_id] || "").trim();
    if (reason.length < 5) {
      setMessage("Enter a short reason before rejecting this request.");
      return;
    }
    if (queueActionRef.current) {
      setMessage("An approval or rejection request is already in progress. Wait for it to finish before trying again.");
      return;
    }
    const action = { candidateId: candidate.candidate_id, type: "reject" };
    queueActionRef.current = action;
    setQueueAction(action);
    setMessage("Rejection request sent once. Waiting for the protected database decision...");
    try {
      const result = await service.rejectReleaseCandidate(candidate.candidate_id, reason);
      if (!result.success) {
        setMessage(result.error);
        return;
      }
      setMessage("Release candidate rejected and moved to Rejects. No record was deleted.");
      setRejectionReasons((values) => ({ ...values, [candidate.candidate_id]: "" }));
      setCandidates((values) => values.map((item) => item.candidate_id === candidate.candidate_id ? result.candidate : item));
      await refresh();
    } finally {
      queueActionRef.current = null;
      setQueueAction(null);
    }
  };

  const waitingCandidates = candidates.filter(
    (candidate) => candidate.status === "awaiting_trusted_approval" && candidate.approval_decision === "pending"
  );
  const historyCandidates = candidates.filter(
    (candidate) => candidate.status === "approved_release_candidate" && candidate.approval_decision === "approved"
  );
  const rejectedCandidates = candidates.filter(
    (candidate) => candidate.status === "superseded"
  );

  const visibleCandidates =
    queueView === "history"
      ? historyCandidates
      : queueView === "rejects"
      ? rejectedCandidates
      : waitingCandidates;

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQueueView("waiting")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                queueView === "waiting"
                  ? "bg-cyan-700 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Waiting ({waitingCandidates.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueView("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                queueView === "history"
                  ? "bg-cyan-700 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              History ({historyCandidates.length})
            </button>
            <button
              type="button"
              onClick={() => setQueueView("rejects")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                queueView === "rejects"
                  ? "bg-rose-800 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Rejects ({rejectedCandidates.length})
            </button>
          </div>
          <button
            type="button"
            disabled={loading || Boolean(queueAction)}
            onClick={() => void refresh()}
            className="px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-white inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh queue
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-slate-400">
            Loading the private approval queue...
          </p>
        ) : visibleCandidates.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-400">
            {queueView === "rejects"
              ? "No rejected requests."
              : queueView === "history"
              ? "No approved requests."
              : "No release candidates are waiting."}
          </p>
        ) : (
          <section className="space-y-4">
            {visibleCandidates.map((candidate) => {
              const pending =
                candidate.status === "awaiting_trusted_approval" &&
                candidate.approval_decision === "pending";
              const approved =
                candidate.status === "approved_release_candidate" &&
                candidate.approval_decision === "approved";
              const rejected = candidate.status === "superseded";
              const requiresReadiness = isStep96SqsCandidate(candidate);
              const readinessPassed = Boolean(
                approvalReadiness[candidate.candidate_id],
              );
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
                        className={pending ? "text-amber-300" : rejected ? "text-rose-300" : "text-emerald-300"}
                      >
                        {rejected ? "rejected" : candidate.approval_decision}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-slate-500">Publication</span>
                      <strong>
                        {publishedProgrammes.get(candidate.snapshot?.programme?.programmeId)?.candidate_id === candidate.candidate_id
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
                  {pending && access.allowed && requiresReadiness && (
                    <AuthorApproverReadinessPreview
                      candidate={candidate}
                      currentUser={currentUser}
                      currentPublication={publishedProgrammes.get(
                        candidate.snapshot?.programme?.programmeId,
                      )}
                      onPreview={previewApprovalReadiness}
                      onReadinessChange={(ready) =>
                        setApprovalReadiness((values) => ({
                          ...values,
                          [candidate.candidate_id]: ready,
                        }))
                      }
                      setMessage={setMessage}
                    />
                  )}
                  {pending && access.allowed && (
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-300">
                        Enter the exact candidate ID to confirm approval
                        <input
                          disabled={Boolean(queueAction)}
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
                          Boolean(queueAction) ||
                          (requiresReadiness && !readinessPassed) ||
                          confirmations[candidate.candidate_id] !==
                          candidate.candidate_id
                        }
                        onClick={() => void approve(candidate)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-700 disabled:opacity-40 text-xs font-bold text-white inline-flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />{" "}
                        {queueAction?.candidateId === candidate.candidate_id && queueAction.type === "approve"
                          ? "Approving once..."
                          : "Approve release candidate"}
                      </button>
                      <label className="block text-xs font-semibold text-slate-300 pt-3">
                        Reason for rejection
                        <textarea
                          disabled={Boolean(queueAction)}
                          value={rejectionReasons[candidate.candidate_id] || ""}
                          onChange={(event) => setRejectionReasons((values) => ({ ...values, [candidate.candidate_id]: event.target.value }))}
                          placeholder="Example: Duplicate request"
                          maxLength={500}
                          rows={2}
                          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                        />
                      </label>
                      <button
                        type="button"
                        disabled={
                          Boolean(queueAction) ||
                          (requiresReadiness && !readinessPassed) ||
                          (rejectionReasons[candidate.candidate_id] || "").trim()
                            .length < 5
                        }
                        onClick={() => void reject(candidate)}
                        className="px-4 py-2.5 rounded-xl bg-rose-800 disabled:opacity-40 text-xs font-bold text-white inline-flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />{" "}
                        {queueAction?.candidateId === candidate.candidate_id && queueAction.type === "reject"
                          ? "Rejecting once..."
                          : "Reject request"}
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
                  {rejected && (
                    <p className="rounded-xl border border-rose-900 bg-rose-950/20 p-3 text-xs text-rose-200">
                      Rejected: {candidate.rejection_reason || "No reason recorded."}
                    </p>
                  )}
                  {approved && (
                    <ControlledPublishingPanel
                      candidate={candidate}
                      service={service}
                      currentPublication={publishedProgrammes.get(candidate.snapshot?.programme?.programmeId)}
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
