import React, { useEffect, useState } from "react";
import { CheckCircle2, Eye, ShieldCheck, XCircle } from "lucide-react";
import { isStep96SqsCandidate } from "./authorApproverReadiness.js";

export function AuthorApproverReadinessPreview({
  candidate,
  currentUser,
  currentPublication,
  onPreview,
  onReadinessChange,
  setMessage,
}) {
  const [preview, setPreview] = useState(null);
  const [working, setWorking] = useState(false);
  const applies = isStep96SqsCandidate(candidate);

  useEffect(() => {
    setPreview(null);
  }, [
    candidate?.candidate_id,
    candidate?.status,
    candidate?.approval_decision,
  ]);

  if (!applies) return null;

  const runPreview = async () => {
    setWorking(true);
    setMessage(
      "Checking the SQS candidate without approving, rejecting or publishing it...",
    );
    try {
      const result = await onPreview?.({
        candidate,
        currentUser,
        currentPublication,
      });
      if (!result?.success) {
        setPreview(null);
        onReadinessChange?.(false);
        setMessage(
          result?.error ||
            "The read-only Approver preview could not be completed.",
        );
        return;
      }
      setPreview(result);
      onReadinessChange?.(result.readyForManualApproval);
      setMessage(
        result.readyForManualApproval
          ? "Read-only Approver preview passed. No decision was recorded."
          : "Approver readiness is blocked. No decision was recorded.",
      );
    } catch (error) {
      setPreview(null);
      onReadinessChange?.(false);
      setMessage(
        error?.message ||
          "The read-only Approver preview could not be completed.",
      );
    } finally {
      setWorking(false);
    }
  };

  return (
    <section
      aria-label="Read-only SQS Approver readiness"
      className="rounded-xl border border-violet-800 bg-violet-950/20 p-4 space-y-4"
    >
      <div className="flex items-start gap-3">
        <Eye className="w-5 h-5 text-violet-300 shrink-0" />
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
            Step 96 - Read-only preview
          </span>
          <strong className="block text-sm text-white mt-1">
            Check this exact SQS approval request
          </strong>
          <p className="text-xs text-slate-300 mt-1">
            This reads the current Shared Draft and verifies the separate
            Approver. It records no decision.
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled={working}
        onClick={() => void runPreview()}
        className="px-4 py-2.5 rounded-xl bg-violet-700 disabled:opacity-50 text-xs font-bold text-white inline-flex items-center gap-2"
      >
        <ShieldCheck className="w-4 h-4" />
        {working
          ? "Checking Approver Readiness..."
          : "Preview Approval Readiness"}
      </button>
      {preview && (
        <div className="space-y-4">
          <div
            className={`rounded-xl border p-3 text-xs ${
              preview.readyForManualApproval
                ? "border-emerald-800 bg-emerald-950/20 text-emerald-200"
                : "border-rose-800 bg-rose-950/20 text-rose-200"
            }`}
          >
            <strong>
              {preview.readyForManualApproval
                ? "READY FOR THE LATER MANUAL APPROVAL STEP"
                : "NOT READY FOR APPROVAL"}
            </strong>
            <span className="block mt-1">
              Approvals: 0 - Rejections: 0 - Publications: 0 - Database writes:
              0
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <span>
              <span className="block text-slate-500">Signed-in Approver</span>
              <strong className="text-white break-all">
                {preview.approver.email || preview.approver.id}
              </strong>
            </span>
            <span>
              <span className="block text-slate-500">Candidate Author ID</span>
              <strong className="text-white break-all">
                {preview.authorId}
              </strong>
            </span>
            <span>
              <span className="block text-slate-500">Source revision</span>
              <strong className="text-white">{preview.sourceRevision}</strong>
            </span>
            <span>
              <span className="block text-slate-500">Publication</span>
              <strong className="text-white">
                {preview.publicationStatus.replaceAll("_", " ")}
              </strong>
            </span>
          </div>
          <code className="block rounded-lg border border-violet-900 bg-slate-950 p-3 text-xs text-violet-100 break-all select-all">
            {preview.candidateId}
          </code>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-300">
            <span>{preview.counts.phaseCount} phases</span>
            <span>{preview.counts.taskCount} tasks</span>
            <span>{preview.counts.checkboxCount} checkboxes</span>
            <span>{preview.counts.verificationCheckCount} checks</span>
            <span>{preview.counts.cleanupItemCount} cleanup items</span>
            <span>{preview.counts.officialAwsSourceCount} AWS sources</span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 space-y-2 text-[10px] text-slate-400">
            <span className="block">
              Candidate key snapshot SHA-256:{" "}
              <code className="text-cyan-200 break-all">
                {preview.candidateVerification.clientSnapshotHash}
              </code>
            </span>
            <span className="block">
              Protected candidate SHA-256:{" "}
              <code className="text-violet-200 break-all">
                {preview.candidateVerification.contentHash}
              </code>
            </span>
            <span className="block">
              Protected saved-draft SHA-256:{" "}
              <code className="text-emerald-200 break-all">
                {preview.candidateVerification.draftContentHash}
              </code>
            </span>
          </div>
          <ol className="space-y-2">
            {preview.checks.map((item, index) => (
              <li
                key={item.id}
                className={`rounded-lg border p-3 text-xs flex items-start gap-2 ${
                  item.passed
                    ? "border-emerald-900 bg-emerald-950/10 text-emerald-200"
                    : "border-rose-900 bg-rose-950/20 text-rose-200"
                }`}
              >
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0" />
                )}
                <span>
                  <strong>
                    {index + 1}. {item.label}
                  </strong>
                  <span className="block mt-1 text-slate-400">
                    {item.detail}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
