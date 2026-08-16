import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {
  buildOfflineHandoff,
  defaultOfflineOutputRoot,
  normalizeOfflineManuscript
} from '../scripts/author-assistant/authorAssistantOfflineImport.mjs';
import { acceptSimpleHandoff } from '../scripts/author-assistant/authorAssistantSimple.mjs';
import { validateAuthorHandoffImportPreview } from '../src/features/followAlongAuthor/authorHandoffPreview.js';

const sourceUrl = 'https://developer.hashicorp.com/terraform/cloud-docs/workspaces';

function portableManuscript() {
  const taskIds = ['task-prepare', 'task-create', 'task-verify'];
  return {
    manuscriptVersion: '1.0',
    programme: {
      title: 'HCP Terraform Test Follow Along', suggestedProgrammeId: 'hcp-terraform-test-learning-path',
      topic: 'HCP Terraform', examWorkspace: 'HashiCorp Terraform Associate 004', learnerLevel: 'Beginner',
      outcome: 'Create and verify one temporary HCP Terraform workspace.', region: 'global plus AWS eu-west-2',
      resourcePrefix: 'fa-hcp-test', selfPaced: true
    },
    sources: [{ id: 'source-hcp', title: 'HCP Terraform workspaces', url: sourceUrl, publisher: 'HashiCorp', purpose: 'Supports workspace tasks.', taskIds }],
    phases: [
      { id: 'phase-prepare', title: 'Prepare', description: 'Prepare safely.' },
      { id: 'phase-create', title: 'Create', description: 'Create the workspace.' },
      { id: 'phase-verify', title: 'Verify', description: 'Verify the workspace.' },
      { id: 'phase-cleanup', title: 'Cleanup', description: 'Remove the workspace.' }
    ],
    tasks: taskIds.map((id, index) => ({
      id, phaseId: index === 0 ? 'phase-prepare' : index === 1 ? 'phase-create' : 'phase-verify',
      title: ['Prepare access', 'Create the workspace', 'Verify the workspace'][index], feature: 'HCP Terraform workspace',
      goal: 'Complete this task safely.', whyItMatters: 'It teaches the controlled workspace lifecycle.', difficulty: 'Easy',
      prerequisites: index ? [taskIds[index - 1]] : [], sourceIds: ['source-hcp'], createdResourceIds: index === 1 ? ['resource-workspace'] : [],
      consoleSteps: [{ title: 'Use the HCP browser', instructions: ['Open HCP Terraform.', `Complete learner action ${index + 1}.`], editableBlocks: index === 1 ? [{ title: 'main.tf', filename: 'main.tf', language: 'text', content: 'terraform {\n  cloud {}\n}', sourceIds: ['source-hcp'] }] : [], expectedResult: 'The expected HCP page is visible.', sourceIds: ['source-hcp'] }],
      cliSteps: [{ command: 'terraform version', explanation: 'Verify the Terraform CLI.', expectedResult: 'Terraform prints its version.', sourceIds: ['source-hcp'] }],
      verification: [{ title: 'Check the result', instruction: 'Inspect the visible workspace state.', expectedResult: 'The expected state is visible.', route: 'either' }], cleanup: []
    })),
    resources: [{ id: 'resource-workspace', type: 'HCP Terraform workspace', exactName: 'fa-hcp-test-workspace', createdByTaskId: 'task-create', dependsOn: [] }],
    programmeCleanup: [{ resourceId: 'resource-workspace', title: 'Delete the workspace', consoleInstructions: ['Select fa-hcp-test-workspace and choose Delete.'], cliCommands: ['terraform destroy'], verification: 'fa-hcp-test-workspace is absent.', sourceIds: ['source-hcp'] }],
    warnings: { cost: 'Review current pricing.', safety: 'Delete only the named workspace.', credentials: 'Never store credentials in the manuscript.', region: 'Use the stated scope.' },
    qualityReport: { unresolvedIssues: [] },
    boundaries: { appReady: false, fingerprinted: false, imported: false, published: false }
  };
}

test('offline Follow Along importer creates a genuine browser-compatible local handoff without AI', async t => {
  await t.test('portable manuscript is converted, validated and fingerprinted', async () => {
    const result = buildOfflineHandoff(portableManuscript(), { now: () => new Date('2026-08-16T12:00:00Z') });
    assert.equal(result.handoffPackage.summary.phaseCount, 4);
    assert.equal(result.handoffPackage.summary.taskCount, 3);
    assert.equal(result.handoffPackage.summary.checkboxCount, 6);
    assert.equal(result.handoffPackage.summary.officialTerraformSourceCount, 1);
    assert.equal(result.handoffPackage.summary.officialAwsSourceCount, 0);
    assert.equal(result.handoffPackage.authorDraftContent.programme.examId, 'terraform-associate-004');
    assert.equal(result.handoffPackage.authorDraftContent.sources[0].publisher, 'HashiCorp');
    assert.equal(result.handoffPackage.authorDraftContent.tasks[1].consoleSteps[0].jsonBlocks[0].language, 'text');
    const acceptance = acceptSimpleHandoff(result.session, result.handoffPackage, { now: () => new Date('2026-08-16T12:01:00Z') });
    const preview = await validateAuthorHandoffImportPreview({ handoffPackage: result.handoffPackage, acceptance, currentUser: { id: 'author-id', email: 'author@example.com' }, cryptoImpl: webcrypto });
    assert.equal(preview.valid, true);
    assert.equal(preview.summary.taskCount, 3);
  });

  await t.test('downloaded external artifact variant is translated without summarising its routes', () => {
    const base = portableManuscript();
    const external = {
      artifactType: 'offline-follow-along-manuscript', artifactVersion: '1.0',
      status: { state: 'offline_unvalidated', localStudyTrackerValidationPerformed: false, imported: false, published: false, sha256FingerprintCreated: false },
      programme: { id: base.programme.suggestedProgrammeId, name: base.programme.title, learnerLevel: 'Beginner', examWorkspace: base.programme.examWorkspace, requiredOutcome: base.programme.outcome, regions: { hcp: 'global', aws: 'eu-west-2' }, trainingResourcePrefix: base.programme.resourcePrefix },
      sources: base.sources.map(source => ({ ...source, usedByTaskIds: source.taskIds })),
      phases: base.phases.map((phase, index) => ({ id: phase.id, sequence: index + 1, title: phase.title, goal: phase.description })),
      tasks: base.tasks.map(task => ({
        id: task.id, phaseId: task.phaseId, title: task.title, feature: task.feature, goal: task.goal, whyItMatters: task.whyItMatters,
        difficulty: task.difficulty, prerequisites: task.prerequisites, sourceIds: task.sourceIds,
        browserRoute: task.consoleSteps[0].instructions.map((instruction, index) => ({ step: index + 1, instruction })),
        cliRoute: [{ id: `${task.id}-cli`, title: 'CLI route', language: 'text', content: task.cliSteps[0].command }],
        codeBlocks: task.consoleSteps[0].editableBlocks,
        expectedResults: [task.consoleSteps[0].expectedResult],
        verificationChecks: task.verification.map((check, index) => ({ id: `${task.id}-check-${index + 1}`, check: check.instruction }))
      })),
      resourceInventory: base.resources.map(resource => ({ id: resource.id, type: resource.type, name: resource.exactName, createdByTaskId: resource.createdByTaskId, cleanupTaskId: 'task-verify' })),
      cleanup: { steps: [{ sequence: 1, id: 'cleanup-1', resource: 'fa-hcp-test-workspace', action: 'Delete only the named workspace.', verification: 'The workspace is absent.', taskId: 'task-verify' }] },
      warnings: Object.fromEntries(Object.entries(base.warnings).map(([key, value]) => [key, { title: key, text: value }])),
      boundaries: {}
    };
    const normalized = normalizeOfflineManuscript(external);
    assert.equal(normalized.proposal.tasks[0].consoleSteps[0].instructions.length, 2);
    assert.equal(normalized.proposal.tasks[1].consoleSteps[0].jsonBlocks[0].content, 'terraform {\n  cloud {}\n}');
    assert.equal(normalized.proposal.sources[0].publisher, 'HashiCorp');
  });

  await t.test('unsafe boundaries and credential-like content are rejected', () => {
    const imported = portableManuscript();
    imported.boundaries.imported = true;
    assert.throws(() => normalizeOfflineManuscript(imported), /boundaries\.imported must be false/);
    const credential = portableManuscript();
    credential.tasks[0].consoleSteps[0].instructions.push('aws_secret_access_key=unsafe-example');
    assert.throws(() => normalizeOfflineManuscript(credential), /Credential-like content was rejected/);
  });

  await t.test('local package exposes the reusable no-API command', async () => {
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.equal(packageJson.scripts['author-assistant:import-offline'], 'node scripts/author-assistant/importOfflineFollowAlong.mjs');
    assert.equal(defaultOfflineOutputRoot(), path.resolve('docs/author-assistant/handoffs'));
  });
});
