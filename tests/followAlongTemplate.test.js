import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildCompletionTransition,
  calculateFollowAlongMetrics,
  canCompleteCleanup,
  canNavigateAfterSave,
  interpolateFollowAlongVariables,
  normalizeFollowAlongCompletionStatus,
  removeSavedResourceBinding,
  validateFollowAlongConfig,
  validatePrerequisiteGraph
} from '../src/components/FollowAlongs/shared/followAlongContract.js';
import { mergeFollowAlongStates } from '../src/services/followAlongPersistenceService.js';

const task = (id, extra = {}) => ({
  id, title: id, goal: `Complete ${id}`, phaseId: 'phase-1', prerequisites: [], isOptional: false,
  createdResourceKeys: [],
  modeAvailability: { console: { status: 'supported' }, cli: { status: 'not_applicable', reason: 'No approved CLI content.' } },
  consoleSteps: [{ id: `${id}-step`, title: 'Do it', instructions: [{ id: `${id}-instruction`, text: 'Done' }], commands: [] }],
  cliSteps: [], ...extra
});

function config(overrides = {}) {
  const tasks = overrides.tasks || [task('required-1'), task('optional-1', { isOptional: true, prerequisites: ['required-1'] })];
  return {
    template: { profile: 'canonical-follow-along', version: '1.0.0' },
    identity: { serviceSlug: 'synthetic', serviceName: 'Synthetic', displayName: 'Synthetic Follow Along', programmeId: 'synthetic-learning-path', pathId: 'synthetic-learning-path', componentNamespace: 'Synthetic' },
    presentation: { accent: 'cyan', icon: 'Layers' },
    storage: { guestProgressKey: 'synthetic_progress', guestResourcesKey: 'synthetic_resources', storageNamespace: 'synthetic', remoteProgressTable: 'progress', remoteResourcesTable: 'resources' },
    progress: { initialTaskId: tasks[0].id, supportedModes: ['console', 'cli', 'both'], optionalTasksCountTowardsProgress: false, completionStatuses: ['in_progress', 'completed_retained', 'completed_cleaned'] },
    capabilities: {
      regionScope: { status: 'not_applicable', reason: 'This service is regionless.' }, resourceCapture: { status: 'not_applicable', reason: 'No resource identifiers are needed.' },
      chargeableResources: { status: 'not_applicable', reason: 'No chargeable resources are declared.' }, cleanup: { status: 'not_applicable', reason: 'No cleanup actions are declared.' },
      serviceValidation: { status: 'not_applicable', reason: 'No additional validation panel is approved.' }, taskModes: { status: 'supported' }, optionalPanels: { status: 'not_applicable', reason: 'No optional panels are approved.' }
    },
    phases: [{ id: 'phase-1', title: 'Foundation', description: '', taskIds: tasks.map(item => item.id) }], tasks,
    resources: { schema: [], interpolationAliases: {}, chargeableResourceKeys: [], variables: { region: 'global' } },
    warnings: { safety: 'Manual only.' }, cleanup: { steps: [], completionGate: 'acknowledgement', manualOnly: true, ordering: 'reverse_dependency' },
    extensions: { registrations: [] }, implementationRequirements: [], ...overrides
  };
}

test('complete regionless, resource-less, non-chargeable config is valid', () => {
  assert.deepEqual(validateFollowAlongConfig(config()), { valid: true, errors: [], warnings: [] });
});

test('every required configuration section is enforced', () => {
  for (const key of Object.keys(config())) {
    const candidate = config();
    delete candidate[key];
    assert.equal(validateFollowAlongConfig(candidate).valid, false, key);
  }
});

test('capabilities, not-applicable reasons, and extension registrations are strict', () => {
  const invalid = config();
  invalid.capabilities.cleanup = { status: 'unresolved' };
  assert.equal(validateFollowAlongConfig(invalid).valid, false);
  invalid.capabilities.cleanup = { status: 'not_applicable', reason: '' };
  assert.equal(validateFollowAlongConfig(invalid).valid, false);
  invalid.capabilities.cleanup = { status: 'extension', reason: 'Approved special panel.', extensionId: 'special', slot: 'unknown' };
  assert.equal(validateFollowAlongConfig(invalid).valid, false);
  invalid.capabilities.cleanup.slot = 'cleanup.beforeChecklist';
  invalid.extensions.registrations = [{ id: 'special', slot: 'cleanup.beforeChecklist', status: 'complete', reason: 'Approved special panel.', componentExport: 'SpecialPanel', requiredCapabilities: ['cleanup'] }];
  assert.equal(validateFollowAlongConfig(invalid).valid, true);
});

test('DAG rejects cycles, missing prerequisites, and required-to-optional dependencies', () => {
  assert.equal(validatePrerequisiteGraph([task('a', { prerequisites: ['b'] }), task('b', { prerequisites: ['a'] })]).valid, false);
  assert.equal(validatePrerequisiteGraph([task('a', { prerequisites: ['missing'] })]).valid, false);
  assert.equal(validatePrerequisiteGraph([task('optional', { isOptional: true }), task('required', { prerequisites: ['optional'] })]).valid, false);
});

test('resource schema, aliases, and chargeable keys are validated', () => {
  const candidate = config();
  candidate.resources = { schema: [{ key: 'thing', type: 'resource', label: 'Thing', validator: { kind: 'bad' } }], interpolationAliases: { alias: 'missing' }, chargeableResourceKeys: ['missing'], variables: {} };
  const result = validateFollowAlongConfig(candidate);
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /validator|alias|Chargeable/);
});

test('optional progress policy changes the denominator explicitly', () => {
  assert.equal(calculateFollowAlongMetrics(config(), ['required-1']).percentComplete, 100);
  const includingOptional = config();
  includingOptional.progress.optionalTasksCountTowardsProgress = true;
  assert.equal(calculateFollowAlongMetrics(includingOptional, ['required-1']).percentComplete, 50);
});

test('completion, autosave, interpolation, cleanup gate, and binding reducers are ordered and pure', () => {
  assert.equal(normalizeFollowAlongCompletionStatus('resources_retained'), 'completed_retained');
  assert.equal(normalizeFollowAlongCompletionStatus('anything'), 'in_progress');
  assert.equal(canNavigateAfterSave({ success: false }), false);
  assert.equal(canNavigateAfterSave({ success: true }), true);
  assert.equal(interpolateFollowAlongVariables('{{alias}}', { resource: { providerId: 'abc' } }, {}, { alias: 'resource' }), 'abc');
  assert.deepEqual(removeSavedResourceBinding({ one: { value: '1' }, two: { value: '2' } }, 'one'), { two: { value: '2' } });
  const transition = buildCompletionTransition({ completedTaskIds: [], resourceDecisions: {} }, 'a', 'retained', 'b');
  assert.deepEqual(transition, { completedTaskIds: ['a'], resourceDecisions: { a: 'retained' }, currentTaskId: 'b' });
  const cleanupConfig = config({ cleanup: { steps: [{ id: 'one' }, { id: 'two' }], completionGate: 'all_items', manualOnly: true } });
  assert.equal(canCompleteCleanup(cleanupConfig, ['one'], false, 'completed_cleaned'), false);
  assert.equal(canCompleteCleanup(cleanupConfig, ['one', 'two'], false, 'completed_cleaned'), true);
  assert.equal(canCompleteCleanup(config(), [], false, 'completed_cleaned'), false);
  assert.equal(canCompleteCleanup(config(), [], true, 'completed_cleaned'), true);
});

test('guest and remote persistence merge by timestamp without losing completion', () => {
  const merged = mergeFollowAlongStates(
    { progress: { updatedAt: '2026-01-01T00:00:00Z', completedTaskIds: ['required-1'] }, resources: { guest: { value: 'g' } } },
    { progress: { updatedAt: '2026-02-01T00:00:00Z', completedTaskIds: ['optional-1'], currentTaskId: 'optional-1' }, resources: { remote: { value: 'r' } } }, config()
  );
  assert.equal(merged.progress.currentTaskId, 'optional-1');
  assert.deepEqual(new Set(merged.progress.completedTaskIds), new Set(['required-1', 'optional-1']));
  assert.deepEqual(Object.keys(merged.resources).sort(), ['guest', 'remote']);
});

test('shared runtime contains no service or provider hardcoding', () => {
  const files = fs.readdirSync('src/components/FollowAlongs/shared').map(name => path.join('src/components/FollowAlongs/shared', name));
  files.push('src/services/followAlongPersistenceService.js');
  const forbidden = /\b(vpc|dynamodb|ec2|iam|s3|aws)\b/i;
  for (const file of files) assert.equal(forbidden.test(fs.readFileSync(file, 'utf8')), false, file);
});
