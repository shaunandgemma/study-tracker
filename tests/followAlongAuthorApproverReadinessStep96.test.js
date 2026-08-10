import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildAuthorReleaseSnapshot } from "../src/features/followAlongAuthor/authorApproval.js";
import {
  STEP_96_SQS_CANDIDATE_ID,
  buildAuthorApproverReadinessPreview,
  isStep96SqsCandidate,
} from "../src/features/followAlongAuthor/authorApproverReadiness.js";
import { STEP_94_SQS_DRAFT_ID } from "../src/features/followAlongAuthor/authorCandidateReadiness.js";

const authorId = "667ad4ce-312b-4f78-a3fa-366c8b669477";
const approverId = "00000000-0000-4000-8000-000000000096";
const canonicalSnapshotHash =
  "b56d599d5479a240c20ef83d8a513523701dc83941eea4c7c9e362caf1077ed0";
const protectedCandidateHash =
  "fb7bdd2366c460439b4035e73867009fb2340f671ff4317811e37f731a45038a";
const protectedDraftHash =
  "59c627b80f4e8959585eb8821f0aa176f1a02b01f2563bb20c06c7a18807f7c8";

function fixedHashCrypto(hash = canonicalSnapshotHash) {
  const bytes = Uint8Array.from(
    hash.match(/../g).map((pair) => Number.parseInt(pair, 16)),
  );
  return {
    subtle: {
      async digest() {
        return bytes.buffer.slice(0);
      },
    },
  };
}

function sqsDraft() {
  const phases = Array.from({ length: 5 }, (_, index) => ({
    id: `phase-${index + 1}`,
    phaseNumber: index + 1,
    title: `Phase ${index + 1}`,
    taskIds: index < 4 ? [`task-${index + 1}`] : ["task-5", "task-6"],
  }));
  const instructionCounts = [3, 5, 5, 6, 3, 2];
  const tasks = Array.from({ length: 6 }, (_, index) => ({
    id: `task-${index + 1}`,
    phaseId: index < 4 ? `phase-${index + 1}` : "phase-5",
    consoleSteps: [
      {
        id: `step-${index + 1}`,
        instructions: Array.from(
          { length: instructionCounts[index] },
          (__, instructionIndex) => ({
            id: `instruction-${index + 1}-${instructionIndex + 1}`,
            text: "Do one safe Console action.",
          }),
        ),
      },
    ],
    verification: Array.from(
      { length: index === 0 ? 2 : 1 },
      (__, verificationIndex) => ({
        id: `verification-${index + 1}-${verificationIndex + 1}`,
      }),
    ),
    cleanup: index < 3 ? [{ id: `cleanup-${index + 1}` }] : [],
  }));
  return {
    schema: { profile: "canonical-follow-along", version: "1.0.0" },
    draft: {
      draftId: STEP_94_SQS_DRAFT_ID,
      revision: 2,
      status: "ready_for_approval",
      createdAt: "2026-08-10T10:00:00.000Z",
      createdBy: authorId,
      updatedAt: "2026-08-10T11:00:00.000Z",
      updatedBy: authorId,
    },
    programme: {
      programmeId: "sqs-basic-message-queue-test",
      serviceSlug: "sqs",
      serviceName: "Amazon Simple Queue Service",
      displayName: "Amazon SQS: Basic Message Queue Test",
      publicationVisibility: "unpublished",
    },
    phases,
    tasks,
    sources: Array.from({ length: 11 }, (_, index) => ({
      id: `source-${index + 1}`,
    })),
    resources: { schema: [] },
    cleanup: { steps: [{ id: "programme-cleanup" }] },
    review: {
      reviewStatus: "ready_for_approval",
      approvalDecision: "pending",
    },
    publication: { publishStatus: "not_published" },
  };
}

function validInput(overrides = {}) {
  const draft = sqsDraft();
  const candidate = {
    candidate_id: STEP_96_SQS_CANDIDATE_ID,
    draft_id: STEP_94_SQS_DRAFT_ID,
    source_revision: 2,
    created_by: authorId,
    snapshot: buildAuthorReleaseSnapshot(draft),
    content_hash: protectedCandidateHash,
    draft_content_hash: protectedDraftHash,
    status: "awaiting_trusted_approval",
    approval_decision: "pending",
    approved_by: null,
    approved_at: null,
  };
  return {
    candidate,
    currentUser: {
      id: approverId,
      email: "approver@example.com",
      app_metadata: { role: "approver" },
    },
    draftResult: {
      success: true,
      draft,
      row: {
        draft_id: STEP_94_SQS_DRAFT_ID,
        owner_id: authorId,
        revision: 2,
        content_hash: protectedDraftHash,
      },
    },
    currentPublication: undefined,
    cryptoImpl: fixedHashCrypto(),
    ...overrides,
  };
}

test("Step 96 read-only SQS Approver readiness preview", async (t) => {
  await t.test(
    "1. the exact pending SQS candidate passes for a separate server-managed Approver",
    async () => {
      const input = validInput();
      assert.equal(isStep96SqsCandidate(input.candidate), true);
      const preview = await buildAuthorApproverReadinessPreview(input);
      assert.equal(preview.success, true);
      assert.equal(preview.previewOnly, true);
      assert.equal(preview.readyForManualApproval, true);
      assert.equal(preview.candidateId, STEP_96_SQS_CANDIDATE_ID);
      assert.equal(preview.approver.id, approverId);
      assert.equal(preview.authorId, authorId);
      assert.notEqual(preview.approver.id, preview.authorId);
      assert.equal(preview.sourceRevision, 2);
      assert.equal(preview.approvalDecision, "pending");
      assert.equal(preview.publicationStatus, "not_published");
      assert.equal(preview.checks.length, 14);
      assert.equal(preview.checks.every((item) => item.passed), true);
      assert.deepEqual(preview.counts, {
        phaseCount: 5,
        taskCount: 6,
        checkboxCount: 24,
        verificationCheckCount: 7,
        cleanupItemCount: 4,
        officialAwsSourceCount: 11,
      });
      assert.deepEqual(preview.boundaries, {
        databaseReadsOnly: true,
        databaseWrites: 0,
        approvalPerformed: false,
        rejectionPerformed: false,
        publicationPerformed: false,
      });
    },
  );

  await t.test(
    "2. an Author identity or a browser-supplied role cannot pass the separate Approver check",
    async () => {
      const sameIdentity = validInput({
        currentUser: {
          id: authorId,
          email: "author@example.com",
          app_metadata: { role: "approver" },
        },
      });
      const samePreview = await buildAuthorApproverReadinessPreview(
        sameIdentity,
      );
      assert.equal(samePreview.readyForManualApproval, false);
      assert.equal(
        samePreview.checks.find((item) => item.id === "separate_identity")
          .passed,
        false,
      );

      const noServerRole = validInput({
        currentUser: {
          id: approverId,
          email: "approver@example.com",
          user_metadata: { role: "approver" },
        },
      });
      const rolePreview = await buildAuthorApproverReadinessPreview(
        noServerRole,
      );
      assert.equal(rolePreview.readyForManualApproval, false);
      assert.equal(
        rolePreview.checks.find((item) => item.id === "server_approver_role")
          .passed,
        false,
      );
    },
  );

  await t.test(
    "3. revision, saved fingerprint or candidate snapshot changes block readiness",
    async () => {
      const revisionInput = validInput();
      revisionInput.draftResult.row.revision = 3;
      const revisionPreview = await buildAuthorApproverReadinessPreview(
        revisionInput,
      );
      assert.equal(revisionPreview.readyForManualApproval, false);
      assert.equal(
        revisionPreview.checks.find((item) => item.id === "source_revision")
          .passed,
        false,
      );

      const fingerprintInput = validInput();
      fingerprintInput.draftResult.row.content_hash = "0".repeat(64);
      const fingerprintPreview = await buildAuthorApproverReadinessPreview(
        fingerprintInput,
      );
      assert.equal(fingerprintPreview.readyForManualApproval, false);
      assert.equal(
        fingerprintPreview.checks.find((item) => item.id === "saved_draft_hash")
          .passed,
        false,
      );

      const snapshotInput = validInput({
        cryptoImpl: fixedHashCrypto("0".repeat(64)),
      });
      const snapshotPreview = await buildAuthorApproverReadinessPreview(
        snapshotInput,
      );
      assert.equal(snapshotPreview.readyForManualApproval, false);
      assert.equal(
        snapshotPreview.checks.find((item) => item.id === "candidate_key_hash")
          .passed,
        false,
      );
    },
  );

  await t.test(
    "4. a decided or published candidate cannot pass the read-only preview",
    async () => {
      const decidedInput = validInput();
      decidedInput.candidate.status = "approved_release_candidate";
      decidedInput.candidate.approval_decision = "approved";
      decidedInput.candidate.approved_by = approverId;
      decidedInput.candidate.approved_at = "2026-08-10T12:00:00.000Z";
      const decidedPreview = await buildAuthorApproverReadinessPreview(
        decidedInput,
      );
      assert.equal(decidedPreview.readyForManualApproval, false);
      assert.equal(
        decidedPreview.checks.find((item) => item.id === "pending_state")
          .passed,
        false,
      );

      const publishedInput = validInput();
      publishedInput.currentPublication = {
        candidate_id: STEP_96_SQS_CANDIDATE_ID,
      };
      const publishedPreview = await buildAuthorApproverReadinessPreview(
        publishedInput,
      );
      assert.equal(publishedPreview.readyForManualApproval, false);
      assert.equal(
        publishedPreview.checks.find((item) => item.id === "unpublished_state")
          .passed,
        false,
      );
    },
  );

  await t.test(
    "5. only the exact Step 95 SQS key receives the Step 96 gate",
    () => {
      const input = validInput();
      assert.equal(isStep96SqsCandidate(input.candidate), true);
      assert.equal(
        isStep96SqsCandidate({
          ...input.candidate,
          candidate_id: `${input.candidate.candidate_id}-other`,
        }),
        false,
      );
      assert.equal(
        isStep96SqsCandidate({ ...input.candidate, source_revision: 3 }),
        false,
      );
    },
  );

  await t.test(
    "6. the panel is read-only and both decision buttons are readiness-gated",
    async () => {
      const panel = await readFile(
        new URL(
          "../src/features/followAlongAuthor/AuthorApproverReadinessPreview.jsx",
          import.meta.url,
        ),
        "utf8",
      );
      const logic = await readFile(
        new URL(
          "../src/features/followAlongAuthor/authorApproverReadiness.js",
          import.meta.url,
        ),
        "utf8",
      );
      const queue = await readFile(
        new URL(
          "../src/features/followAlongAuthor/AuthorApprovalQueue.jsx",
          import.meta.url,
        ),
        "utf8",
      );
      assert.match(panel, /Step 96 - Read-only preview/);
      assert.match(panel, /Preview Approval Readiness/);
      assert.match(panel, /Approvals: 0 - Rejections: 0 - Publications: 0/);
      assert.doesNotMatch(
        `${panel}\n${logic}`,
        /approveReleaseCandidate|rejectReleaseCandidate|publishReleaseCandidate/,
      );
      assert.match(queue, /service\.loadDraft/);
      assert.match(queue, /requiresReadiness && !readinessPassed/g);
      assert.match(queue, /AuthorApproverReadinessPreview/);
    },
  );
});
