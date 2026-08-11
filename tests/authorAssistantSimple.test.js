import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import {
  acceptSimpleHandoff,
  buildAuthorDraftContent,
  buildBeginnerQualityReviewPayload,
  buildCompleteGenerationPayload,
  buildSimpleHandoff,
  findCleanupCoverageFindings,
  formatSimplePreview,
  reconcileProtectedSourceList,
  requestCompleteFollowAlong,
  SIMPLE_AUTHOR_ASSISTANT_MODE,
  validateCompleteProposal
} from '../scripts/author-assistant/authorAssistantSimple.mjs';
import {
  applyBeginnerQualityReview,
  buildBeginnerGoldStandardReference,
  findBeginnerQualityFindings,
  findReviewableProposalFindings,
  validateBeginnerQuality
} from '../scripts/author-assistant/authorAssistantBeginnerQuality.mjs';
import { loadPublishedFollowAlongCatalogue, parseAuthorAssistantEnv } from '../scripts/author-assistant/authorAssistantPublishedCatalogue.mjs';
import { validateAuthorHandoffImportPreview } from '../src/features/followAlongAuthor/authorHandoffPreview.js';
import { validateAuthorContent } from '../src/features/followAlongAuthor/authorContent.js';
import {
  AUTHOR_HANDOFF_UPDATE_CONFIRMATION,
  executeAuthorHandoffControlledUpdate,
  prepareAuthorHandoffControlledUpdate
} from '../src/features/followAlongAuthor/authorHandoffControlledUpdate.js';
import { buildPublishedProgrammeCard } from '../src/features/followAlongs/published/publishedFollowAlongService.js';

const inputs = { serviceName: 'Amazon Example Service', shortName: 'EX', learnerLevel: 'Beginner', buildOutcome: 'Create and test one example resource', preferredRegion: 'eu-west-2' };
const urls = [
  'https://docs.aws.amazon.com/example/latest/guide/start.html',
  'https://docs.aws.amazon.com/cli/latest/reference/example/create.html',
  'https://docs.aws.amazon.com/service-authorization/latest/reference/list_example.html'
];

function qualityReference() {
  return {
    kind: 'author_assistant_beginner_gold_standard', programmeId: 'rds-learning-path', displayName: 'RDS Gold Standard', sourceRevision: 9, contentHash: 'f'.repeat(64),
    useBoundary: 'Writing depth only.', requiredStandard: ['Explain exact Console navigation.'],
    completeConsoleAndCliReference: { phases: [], tasks: [{ title: 'Create a database', consoleSteps: [{ title: 'Open RDS', instructions: ['In the AWS Management Console search bar, enter RDS.', 'Under Services, choose RDS.'] }], cliSteps: [{ command: 'aws rds describe-db-instances', explanation: 'Inspect the database.', expectedResult: 'The database is listed.' }], verification: [], cleanup: [] }], finalCleanup: [], warnings: {} }
  };
}

function proposal() {
  return {
    programme: { displayName: 'Amazon Example: Safe Test', subtitle: 'Create and inspect one example resource', category: 'Testing', description: 'A short safe example Follow Along.', learningOutcome: 'Create and test one example resource.', difficulty: 'Beginner', regionScope: 'regional', estimatedMinutes: 30 },
    sources: urls.map((url, index) => ({ title: `Official AWS source ${index + 1}`, url, purpose: 'Supports the Console and CLI learner path.' })),
    phases: [
      { title: 'Prepare', description: 'Prepare the safe test.', isOptional: false },
      { title: 'Create and verify', description: 'Create and inspect the resource.', isOptional: false },
      { title: 'Finish', description: 'Finish and clean up the test.', isOptional: false },
      { title: 'Review', description: 'Review the completed learner journey.', isOptional: true }
    ],
    resourceInventory: [
      { resourceKey: 'example-resource', resourceType: 'other', resourceNameOrPlaceholder: 'example-training-resource', createdByTaskNumber: 2, dependsOnResourceKeys: [] }
    ],
    tasks: ['Prepare access', 'Create resource', 'Verify resource'].map((title, index) => ({
      phaseNumber: index + 1, title, feature: 'Example resources', goal: `${title} safely.`, whyItMatters: 'It keeps the learner journey safe and verifiable.', difficulty: 'Easy', estimatedMinutes: 10, isOptional: false,
      prerequisiteTaskNumbers: index ? [index] : [], sourceUrls: urls, createdResourceKeys: index === 1 ? ['example-resource'] : [],
      consoleSteps: [{ title, instructions: [`In the AWS Management Console search bar, enter Example, then under Services choose Example.`, `Choose ${title}, enter example-training-resource when a name is requested, and choose Confirm.`], jsonBlocks: [], expectedResult: `${title} is visibly complete.`, warning: '', sourceUrls: [urls[0]] }],
      cliSteps: [{ command: `aws example ${index ? 'describe-resource' : 'get-status'} --region eu-west-2`, explanation: `Use one documented command for ${title.toLowerCase()}.`, expectedResult: 'AWS returns the expected test result.', warning: '', sourceUrls: [urls[1]] }],
      verification: [{ title: `Check ${title}`, instruction: `Inspect the result of ${title.toLowerCase()}.`, expectedResult: 'The expected harmless test state is visible.', mode: 'either' }],
      cleanup: []
    })),
    finalCleanup: [{ resourceKey: 'example-resource', title: 'Remove the test resource', consoleInstructions: ['Select only example-training-resource.', 'Choose Delete and confirm the exact name.'], cliCommands: ['aws example delete-resource --resource-name example-training-resource --region eu-west-2'], verification: 'The example test resource is no longer listed.', sourceUrls: [urls[0]] }],
    warnings: { cost: 'Review current AWS pricing before starting.', safety: 'Delete only the named test resource during cleanup.', credentials: 'Never paste or save AWS credentials in the Follow Along.', region: 'Use eu-west-2 throughout this regional exercise.' },
    manualReviewFindings: []
  };
}

test('simplified Author Assistant creates one import-ready Console and CLI package', async t => {
  await t.test('1. request is restricted to official AWS Docs and asks for both modes', () => {
    const payload = buildCompleteGenerationPayload(inputs, { qualityReference: qualityReference() });
    assert.deepEqual(payload.tools[0].filters.allowed_domains, ['docs.aws.amazon.com']);
    assert.match(payload.instructions, /both AWS Console checkbox instructions and separate AWS CLI commands/i);
    assert.equal(payload.store, false);
    assert.match(payload.instructions, /RDS COMPLETE CONSOLE AND CLI GOLD STANDARD REFERENCE/);
    assert.match(payload.instructions, /Assume there is no existing learner infrastructure/);
  });

  await t.test('1A. the whole published RDS Console and CLI programme becomes the service-independent gold standard', () => {
    const reference = buildBeginnerGoldStandardReference({
      programmeId: 'rds-learning-path', displayName: 'Perfected RDS Follow Along', sourceRevision: 12, contentHash: 'a'.repeat(64),
      runtimeContent: { tasks: [
        { title: 'Create the database', consoleSteps: [{ title: 'Open RDS and create the database', instructions: [{ text: 'In the AWS Management Console search bar, enter RDS.' }, { text: 'Under Services, choose RDS.' }, { text: 'Choose Create database.' }], jsonBlocks: [], expectedResult: 'The database creation page is visible.', warning: '' }], cliSteps: [{ command: 'aws rds create-db-instance --db-instance-identifier training', explanation: 'Create the training database.', expectedResult: 'The database enters creating state.', warning: '' }], verification: [], cleanup: [] },
        { title: 'Inspect the database', consoleSteps: [{ title: 'Inspect RDS', instructions: [{ text: 'Choose Databases.' }], jsonBlocks: [], expectedResult: 'The database is listed.', warning: '' }], cliSteps: [{ command: 'aws rds describe-db-instances', explanation: 'Inspect the database.', expectedResult: 'The database is returned.', warning: '' }], verification: [], cleanup: [] }
      ] }
    });
    assert.equal(reference.sourceRevision, 12);
    assert.equal(reference.completeConsoleAndCliReference.tasks.length, 2);
    assert.equal(reference.completeConsoleAndCliReference.tasks[0].consoleSteps[0].instructions[1], 'Under Services, choose RDS.');
    assert.equal(reference.completeConsoleAndCliReference.tasks[0].cliSteps[0].command, 'aws rds create-db-instance --db-instance-identifier training');
    assert.match(reference.useBoundary, /Never copy RDS resources/);
    assert.throws(() => buildBeginnerGoldStandardReference({ programmeId: 'other-learning-path' }), /gold-standard Follow Along is unavailable/);
    assert.throws(() => buildBeginnerGoldStandardReference({ programmeId: 'rds-learning-path', runtimeContent: { tasks: [{ consoleSteps: [], cliSteps: [] }] } }), /complete Console and CLI task content/);
  });

  await t.test('1B. vague beginner instructions are blocked and the AI review can replace only weak tasks', () => {
    const weak = proposal();
    weak.tasks[0].consoleSteps[0].instructions = ['Open Users.', 'Choose a suitable existing user.'];
    assert.ok(findBeginnerQualityFindings(weak).length >= 2);
    assert.throws(() => validateBeginnerQuality(weak), /beginner-quality review did not resolve/);
    const correctedTask = structuredClone(proposal().tasks[0]);
    const taskReviews = weak.tasks.map((task, index) => ({ taskNumber: index + 1, passed: index !== 0, findings: index === 0 ? ['Navigation was vague.'] : [], revisedTask: index === 0 ? correctedTask : null }));
    const corrected = applyBeginnerQualityReview(weak, { passed: false, taskReviews });
    assert.equal(validateBeginnerQuality(corrected), corrected);
    const reviewPayload = buildBeginnerQualityReviewPayload(inputs, weak, urls.map(url => ({ url })), qualityReference());
    assert.match(reviewPayload.instructions, /final beginner-quality reviewer/);
    assert.equal(reviewPayload.text.format.schema.properties.taskReviews.items.properties.revisedTask.anyOf[0].properties.consoleSteps.minItems, 1);
    assert.equal(Object.hasOwn(reviewPayload.text.format.schema.properties.taskReviews, 'minItems'), false);
    assert.equal(reviewPayload.text.format.schema.properties.taskReviews.maxItems, weak.tasks.length);
    assert.deepEqual(reviewPayload.text.format.schema.properties.taskReviews.items.properties.taskNumber.enum, [1, 2, 3]);
  });

  await t.test('1C. generation always completes a separate beginner-quality AI review before returning content', async () => {
    const generated = proposal();
    const review = { passed: true, taskReviews: generated.tasks.map((_task, index) => ({ taskNumber: index + 1, passed: true, findings: [], revisedTask: null })) };
    const responses = [
      { output: [{ type: 'web_search_call', action: { sources: urls.map(url => ({ url, title: 'AWS source' })) } }, { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(generated) }] }] },
      { output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(review) }] }] }
    ];
    const requests = [];
    const result = await requestCompleteFollowAlong({
      inputs, apiKey: 'test-key', qualityReference: qualityReference(),
      fetchImpl: async (_url, options) => {
        requests.push(JSON.parse(options.body));
        return { ok: true, json: async () => responses.shift() };
      }
    });
    assert.equal(result.tasks.length, 3);
    assert.equal(requests.length, 2);
    assert.equal(requests[0].tools[0].type, 'web_search');
    assert.equal(requests[1].tools, undefined);
    assert.match(requests[1].instructions, /Review every task/);
  });

  await t.test('1D. a chained generated command reaches the reviewer and is replaced with separate safe CLI steps', async () => {
    const generated = proposal();
    generated.tasks[1].cliSteps[0].command = 'aws example get-status --region eu-west-2 | ConvertFrom-Json';
    const correctedTask = structuredClone(generated.tasks[1]);
    correctedTask.cliSteps = [
      { ...correctedTask.cliSteps[0], command: 'aws example get-status --region eu-west-2', explanation: 'Return the documented status without a shell pipeline.' },
      { ...correctedTask.cliSteps[0], command: 'aws example describe-resource --region eu-west-2', explanation: 'Inspect the resource with a separate documented AWS command.' }
    ];
    const review = { passed: false, taskReviews: generated.tasks.map((_task, index) => ({ taskNumber: index + 1, passed: index !== 1, findings: index === 1 ? ['Split the shell pipeline.'] : [], revisedTask: index === 1 ? correctedTask : null })) };
    const responses = [
      { output: [{ type: 'web_search_call', action: { sources: urls.map(url => ({ url })) } }, { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(generated) }] }] },
      { output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(review) }] }] }
    ];
    const requests = [];
    const result = await requestCompleteFollowAlong({
      inputs, apiKey: 'test-key', qualityReference: qualityReference(),
      fetchImpl: async (_url, options) => { requests.push(JSON.parse(options.body)); return { ok: true, json: async () => responses.shift() }; }
    });
    assert.equal(findReviewableProposalFindings(result).length, 0);
    assert.equal(result.tasks[1].cliSteps.length, 2);
    assert.match(requests[1].input, /Task 2 CLI step 1 contains more than one shell operation/);
  });

  await t.test('1E. an incomplete reviewer response preserves unreviewed tasks as manual findings without another API request', async () => {
    const generated = proposal();
    generated.resourceInventory[0].resourceNameOrPlaceholder = 'exact-resource-name-not-returned-by-cleanup';
    const incomplete = { passed: true, taskReviews: [{ taskNumber: 1, passed: true, findings: [], revisedTask: null }] };
    const responses = [
      { output: [{ type: 'web_search_call', action: { sources: urls.map(url => ({ url })) } }, { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(generated) }] }] },
      { output: [{ type: 'message', content: [{ type: 'output_text', text: JSON.stringify(incomplete) }] }] }
    ];
    const requests = [];
    const progress = [];
    const result = await requestCompleteFollowAlong({
      inputs, apiKey: 'test-key', qualityReference: qualityReference(), onProgress: message => progress.push(message),
      fetchImpl: async (_url, options) => { requests.push(JSON.parse(options.body)); return { ok: true, json: async () => responses.shift() }; }
    });
    assert.equal(result.tasks.length, 3);
    assert.equal(requests.length, 2);
    assert.equal(requests.filter(item => item.tools?.[0]?.type === 'web_search').length, 1);
    assert.ok(result.manualReviewFindings.some(message => /task number\(s\): 2, 3/i.test(message)));
    assert.ok(result.manualReviewFindings.some(message => /Cleanup for resource example-resource does not name its exact target/i.test(message)));
    assert.deepEqual(result.tasks[1], generated.tasks[1]);
    assert.equal(progress.some(message => /initial generation will not be repeated/i.test(message)), false);
  });

  await t.test('2. protected sources, unchained commands, and both modes are required', () => {
    const returned = urls.map(url => ({ url }));
    assert.equal(validateCompleteProposal(proposal(), returned).tasks.length, 3);
    const outside = proposal();
    outside.sources[0].url = 'https://example.com/not-aws';
    assert.throws(() => validateCompleteProposal(outside, returned), /protected AWS Docs search/);
    const chained = proposal();
    chained.tasks[0].cliSteps[0].command += ' && echo unsafe';
    assert.throws(() => validateCompleteProposal(chained, returned), /command chaining/);
  });

  await t.test('2AA. every created resource has one reverse-dependency cleanup with Console and CLI teardown', () => {
    const complete = proposal();
    complete.resourceInventory = [
      { resourceKey: 'parent-vpc', resourceType: 'network', resourceNameOrPlaceholder: 'example-vpc', createdByTaskNumber: 1, dependsOnResourceKeys: [] },
      { resourceKey: 'child-subnet', resourceType: 'network', resourceNameOrPlaceholder: 'example-subnet', createdByTaskNumber: 2, dependsOnResourceKeys: ['parent-vpc'] }
    ];
    complete.tasks[0].createdResourceKeys = ['parent-vpc'];
    complete.tasks[1].createdResourceKeys = ['child-subnet'];
    complete.finalCleanup = [
      { resourceKey: 'child-subnet', title: 'Delete subnet', consoleInstructions: ['Select example-subnet.', 'Choose Delete subnet.'], cliCommands: ['aws ec2 delete-subnet --subnet-id example-subnet --region eu-west-2'], verification: 'The subnet is absent.', sourceUrls: [urls[0]] },
      { resourceKey: 'parent-vpc', title: 'Delete VPC', consoleInstructions: ['Select example-vpc.', 'Choose Delete VPC.'], cliCommands: ['aws ec2 delete-vpc --vpc-id example-vpc --region eu-west-2'], verification: 'The VPC is absent.', sourceUrls: [urls[0]] }
    ];
    assert.deepEqual(findCleanupCoverageFindings(complete), []);
    assert.equal(validateCompleteProposal(complete, urls.map(url => ({ url }))), complete);
    const missing = structuredClone(complete);
    missing.finalCleanup.shift();
    assert.ok(findCleanupCoverageFindings(missing).some(finding => /child-subnet must have exactly one final cleanup/i.test(finding)));
    const wrongOrder = structuredClone(complete);
    wrongOrder.finalCleanup.reverse();
    assert.ok(findCleanupCoverageFindings(wrongOrder).some(finding => /child-subnet must be removed before dependency parent-vpc/i.test(finding)));
    const chainedCleanup = structuredClone(complete);
    chainedCleanup.finalCleanup[0].cliCommands = ['aws ec2 delete-subnet --subnet-id example-subnet && echo done'];
    assert.ok(findCleanupCoverageFindings(chainedCleanup).some(finding => /command chaining/i.test(finding)));
    const vagueTarget = structuredClone(complete);
    vagueTarget.finalCleanup[0].consoleInstructions = ['Select the subnet.', 'Choose Delete subnet.'];
    vagueTarget.finalCleanup[0].cliCommands = ['aws ec2 delete-subnet --subnet-id [SUBNET_ID] --region eu-west-2'];
    vagueTarget.finalCleanup[0].verification = 'The subnet is absent.';
    assert.ok(findCleanupCoverageFindings(vagueTarget).some(finding => /does not name its exact target example-subnet/i.test(finding)));
    assert.throws(() => validateCompleteProposal(vagueTarget, urls.map(url => ({ url }))), /final Delete stage is incomplete/i);
    assert.equal(validateCompleteProposal(vagueTarget, urls.map(url => ({ url })), { allowReviewableQuality: true }), vagueTarget);
    const payload = buildCompleteGenerationPayload(inputs, { qualityReference: qualityReference() });
    assert.match(payload.instructions, /exactly one finalCleanup entry for every resourceInventory key/i);
    assert.match(payload.instructions, /strict reverse dependency order/i);
  });

  await t.test('2B. durations are optional while deferred Console and CLI content is rejected', () => {
    const returned = urls.map(url => ({ url }));
    const selfPaced = proposal();
    selfPaced.programme.estimatedMinutes = null;
    selfPaced.tasks.forEach(task => { task.estimatedMinutes = null; });
    selfPaced.tasks[0].cliSteps[0].command += ' --resource-id <resource-id>';
    assert.equal(validateCompleteProposal(selfPaced, returned).tasks.length, 3);
    const built = buildAuthorDraftContent(inputs, selfPaced);
    assert.equal(built.content.programme.estimatedMinutes, null);
    assert.ok(built.content.tasks.every(task => task.estimatedMinutes === null));
    const { handoffPackage } = buildSimpleHandoff({ inputs, proposal: selfPaced, authorDraftContent: built.content, sessionId: 'author-assistant-self-paced' });
    assert.match(formatSimplePreview(handoffPackage), /Estimated time: Self-paced/);

    const deferredConsole = proposal();
    deferredConsole.tasks[0].consoleSteps[0].instructions = ['Defer detailed Console instructions until the catalogue is approved.'];
    assert.throws(() => validateCompleteProposal(deferredConsole, returned), /placeholder or deferred content/);
    const deferredCli = proposal();
    deferredCli.tasks[0].cliSteps[0].command = 'TBD';
    assert.throws(() => validateCompleteProposal(deferredCli, returned), /placeholder or deferred content/);
    const blankConsole = proposal();
    blankConsole.tasks[0].consoleSteps[0].instructions = ['   '];
    assert.throws(() => validateCompleteProposal(blankConsole, returned), /is incomplete/);

    const browserContent = structuredClone(built.content);
    browserContent.tasks[0].consoleSteps[0].instructions[0].text = 'Console instructions will be added later.';
    assert.ok(validateAuthorContent(browserContent).errors.some(error => /placeholder or deferred content/.test(error.message)));
  });

  await t.test('2C. generation allows sourced IAM policy JSON but keeps real credentials blocked', () => {
    const payload = buildCompleteGenerationPayload(inputs);
    assert.match(payload.instructions, /IAM policy JSON is allowed/i);
    assert.match(payload.instructions, /Never include real access key IDs/i);
    assert.doesNotMatch(payload.instructions, /Never include credentials or propose an IAM policy/);
    assert.match(payload.instructions, /durations are optional/i);
    assert.match(payload.instructions, /Never return catalogue-only, placeholder, deferred/i);
    assert.deepEqual(payload.text.format.schema.properties.programme.properties.estimatedMinutes.type, ['integer', 'null']);
    assert.deepEqual(payload.text.format.schema.properties.tasks.items.properties.estimatedMinutes.type, ['integer', 'null']);
    assert.equal(payload.text.format.schema.properties.tasks.items.properties.consoleSteps.items.properties.jsonBlocks.type, 'array');
  });

  await t.test('2F. valid IAM policy JSON is preserved, imperfect examples remain reviewable, and credentials are rejected', () => {
    const returned = urls.map(url => ({ url }));
    const withPolicy = proposal();
    withPolicy.tasks[0].consoleSteps[0].jsonBlocks = [{
      title: 'Read-only RDS policy example',
      content: JSON.stringify({ Version: '2012-10-17', Statement: [{ Effect: 'Allow', Action: ['rds:DescribeDBInstances'], Resource: '*' }] }, null, 2),
      sourceUrls: [urls[2]]
    }];
    assert.equal(validateCompleteProposal(withPolicy, returned).tasks.length, 3);
    const built = buildAuthorDraftContent(inputs, withPolicy);
    assert.equal(built.content.tasks[0].consoleSteps[0].jsonBlocks[0].language, 'json');
    assert.match(built.content.tasks[0].consoleSteps[0].jsonBlocks[0].content, /rds:DescribeDBInstances/);

    const malformed = structuredClone(withPolicy);
    malformed.tasks[0].consoleSteps[0].jsonBlocks[0].content = '{ not valid JSON }';
    assert.equal(validateCompleteProposal(malformed, returned).tasks.length, 3);
    const reviewable = buildAuthorDraftContent(inputs, malformed);
    assert.equal(reviewable.content.tasks[0].consoleSteps[0].jsonBlocks[0].language, 'text');
    assert.equal(reviewable.checks.content.errors.length, 0);
    assert.ok(reviewable.checks.content.warnings.some(item => /editable JSON-shaped guidance/i.test(item.message)));
    const credential = structuredClone(withPolicy);
    credential.tasks[0].consoleSteps[0].jsonBlocks[0].content = JSON.stringify({ unsafeExample: 'aws_secret_access_key=unsafe' });
    assert.throws(() => validateCompleteProposal(credential, returned), /Credential-like/);
  });

  await t.test('2D. generation has no fixed maximum for phases or tasks', () => {
    const schema = buildCompleteGenerationPayload(inputs).text.format.schema;
    assert.equal(Object.hasOwn(schema.properties.phases, 'maxItems'), false);
    assert.equal(Object.hasOwn(schema.properties.tasks, 'maxItems'), false);
    assert.equal(schema.properties.phases.minItems, 4);
    assert.equal(schema.properties.tasks.minItems, 3);
    assert.match(buildCompleteGenerationPayload(inputs).instructions, /no fixed maximum number of phases or tasks/i);
  });

  await t.test('2E. detailed task content has minimums but no fixed maximums', () => {
    const schema = buildCompleteGenerationPayload(inputs).text.format.schema;
    const task = schema.properties.tasks.items.properties;
    const consoleStep = task.consoleSteps.items.properties;
    for (const value of [task.consoleSteps, consoleStep.instructions, task.cliSteps, task.verification, task.cleanup, schema.properties.finalCleanup]) {
      assert.equal(Object.hasOwn(value, 'maxItems'), false);
    }
    assert.equal(task.consoleSteps.minItems, 1);
    assert.equal(consoleStep.instructions.minItems, 1);
    assert.equal(task.cliSteps.minItems, 1);
    assert.equal(task.verification.minItems, 1);
    assert.equal(schema.properties.finalCleanup.minItems, 1);

    const detailed = proposal();
    const consoleStepValue = structuredClone(detailed.tasks[0].consoleSteps[0]);
    const cliStepValue = structuredClone(detailed.tasks[0].cliSteps[0]);
    const verificationValue = structuredClone(detailed.tasks[0].verification[0]);
    detailed.tasks[0].consoleSteps = Array.from({ length: 10 }, (_, index) => ({ ...structuredClone(consoleStepValue), title: `Console action ${index + 1}` }));
    detailed.tasks[0].consoleSteps[0].instructions = Array.from({ length: 10 }, (_, index) => `Complete detailed Console action ${index + 1}.`);
    detailed.tasks[0].cliSteps = Array.from({ length: 10 }, (_, index) => ({ ...structuredClone(cliStepValue), command: `aws example get-status --item ${index + 1} --region eu-west-2` }));
    detailed.tasks[0].verification = Array.from({ length: 10 }, (_, index) => ({ ...structuredClone(verificationValue), title: `Verification ${index + 1}` }));
    detailed.tasks[0].cleanup = Array.from({ length: 10 }, (_, index) => ({ title: `Cleanup ${index + 1}`, instruction: `Remove test item ${index + 1}.`, verification: `Test item ${index + 1} is absent.`, sourceUrls: [urls[0]] }));
    detailed.resourceInventory = Array.from({ length: 10 }, (_, index) => ({ resourceKey: `resource-${index + 1}`, resourceType: 'other', resourceNameOrPlaceholder: `example-resource-${index + 1}`, createdByTaskNumber: 1, dependsOnResourceKeys: [] }));
    detailed.tasks[0].createdResourceKeys = detailed.resourceInventory.map(item => item.resourceKey);
    detailed.tasks[1].createdResourceKeys = [];
    detailed.finalCleanup = detailed.resourceInventory.map((item, index) => ({ resourceKey: item.resourceKey, title: `Final cleanup ${index + 1}`, consoleInstructions: [`Select example-resource-${index + 1}.`, 'Choose Delete.'], cliCommands: [`aws example delete-resource --resource-name example-resource-${index + 1} --region eu-west-2`], verification: `Cleanup item ${index + 1} is complete.`, sourceUrls: [urls[0]] }));
    assert.equal(validateCompleteProposal(detailed, urls.map(url => ({ url }))).tasks[0].consoleSteps.length, 10);
  });

  await t.test('2A. a protected cited page omitted from the summary list is added safely', () => {
    const missing = proposal();
    missing.sources = missing.sources.slice(0, 2);
    const reconciled = reconcileProtectedSourceList(missing, urls.map((url, index) => ({ url, title: `Protected source ${index + 1}` })));
    assert.equal(reconciled.sources.length, 3);
    assert.equal(reconciled.sources[2].url, urls[2]);
    assert.equal(validateCompleteProposal(reconciled, urls.map(url => ({ url }))).tasks.length, 3);
  });

  await t.test('3. generated content passes current Author checks and contains visible CLI commands', () => {
    const built = buildAuthorDraftContent(inputs, proposal());
    assert.ok(Object.values(built.checks).every(check => check.valid));
    assert.equal(built.content.programme.supportedModes.join(','), 'console,cli,both');
    assert.equal(built.content.tasks.length, 3);
    assert.ok(built.content.tasks.every(task => task.consoleSteps.length && task.cliSteps.length));
  });

  await t.test('4. one accepted preview produces files compatible with the existing browser import', async () => {
    const { content } = buildAuthorDraftContent(inputs, proposal());
    const now = () => new Date('2026-08-10T16:00:00.000Z');
    const { session, handoffPackage } = buildSimpleHandoff({ inputs, proposal: proposal(), authorDraftContent: content, sessionId: 'author-assistant-example-test', now });
    const acceptance = acceptSimpleHandoff(session, handoffPackage, { now });
    const preview = await validateAuthorHandoffImportPreview({ handoffPackage, acceptance, currentUser: { id: 'author-id', email: 'author@example.com' }, cryptoImpl: webcrypto });
    assert.equal(preview.valid, true);
    assert.equal(preview.summary.taskCount, 3);
    assert.match(formatSimplePreview(handoffPackage), /CLI commands: 3/);
  });

  await t.test('5. published card modes come from real task content, not stale programme metadata', () => {
    const row = { runtime_content: { programme: { programmeId: 'example-learning-path', serviceSlug: 'example', displayName: 'Example', shortName: 'EX', supportedModes: ['console', 'cli', 'both'] }, phases: [{}], tasks: [{ modeAvailability: { console: { status: 'available' }, cli: { status: 'not_applicable' } }, consoleSteps: [{}], cliSteps: [] }] } };
    assert.deepEqual(buildPublishedProgrammeCard(row).supportedModes, ['console']);
  });

  await t.test('6. primary command uses the simplified launcher and keeps the old workflow clearly labelled legacy', async () => {
    const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    assert.match(packageJson.scripts['author-assistant:secure'], /startSimpleAuthorAssistant/);
    assert.match(packageJson.scripts['author-assistant:legacy:secure'], /startAuthorAssistant/);
  });

  await t.test('7. update catalogue uses only the publishable read path and preserves exact names', async () => {
    assert.deepEqual(parseAuthorAssistantEnv('VITE_SUPABASE_URL="https://example.supabase.co"\n# ignored\nVITE_SUPABASE_PUBLISHABLE_KEY=test-key\n'), {
      VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'test-key'
    });
    let request;
    const programmes = await loadPublishedFollowAlongCatalogue({
      environment: { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'public-key' },
      fetchImpl: async (url, options) => {
        request = { url, options };
        return { ok: true, json: async () => [{ programme_id: 'example-learning-path', candidate_id: 'candidate', source_revision: 2, content_hash: 'a'.repeat(64), published_at: '2026-08-10T00:00:00Z', runtime_content: { programme: { programmeId: 'example-learning-path', displayName: 'Exact Existing Name', serviceName: 'Amazon Example Service', shortName: 'EX', serviceSlug: 'example' } } }] };
      }
    });
    assert.equal(programmes[0].displayName, 'Exact Existing Name');
    assert.equal(programmes[0].sourceRevision, 2);
    assert.equal(request.options.headers.apikey, 'public-key');
    assert.doesNotMatch(JSON.stringify(request), /service_role|secret/i);
  });

  await t.test('8. update generation preserves the selected programme identity', () => {
    const updateInputs = {
      ...inputs,
      generationMode: SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE,
      updateRequest: 'Improve the verification wording.',
      updateTarget: {
        programmeId: 'example-learning-path', displayName: 'Existing Example', serviceName: inputs.serviceName,
        shortName: inputs.shortName, serviceSlug: 'example', sourceRevision: 2, candidateId: 'release-existing-shared-draft-r2-aaaaaaaaaaaa',
        contentHash: 'b'.repeat(64), publishedAt: '2026-08-10T00:00:00Z', runtimeContent: { programme: { programmeId: 'example-learning-path' } }
      }
    };
    const payload = buildCompleteGenerationPayload(updateInputs);
    assert.match(payload.instructions, /Preserve its exact AWS service identity and programme identity/);
    assert.match(payload.input, /Exact target programme ID: example-learning-path/);
    const { content } = buildAuthorDraftContent(updateInputs, proposal());
    assert.equal(content.programme.programmeId, 'example-learning-path');
    assert.equal(content.programme.serviceSlug, 'example');
  });

  await t.test('9. controlled update advances exactly one owned Shared Draft revision and cannot be replayed', async () => {
    const currentUser = { id: 'author-id', email: 'author@example.com' };
    const updateInputs = {
      ...inputs,
      generationMode: SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE,
      updateRequest: 'Improve the verification wording.',
      updateTarget: {
        programmeId: 'example-learning-path', displayName: 'Existing Example', serviceName: inputs.serviceName,
        shortName: inputs.shortName, serviceSlug: 'example', sourceRevision: 2, candidateId: 'release-existing-shared-draft-r2-aaaaaaaaaaaa',
        contentHash: 'b'.repeat(64), publishedAt: '2026-08-10T00:00:00Z', runtimeContent: { programme: { programmeId: 'example-learning-path' } }
      }
    };
    const { content } = buildAuthorDraftContent(updateInputs, proposal());
    const now = () => new Date('2026-08-10T18:00:00.000Z');
    const { session, handoffPackage } = buildSimpleHandoff({ inputs: updateInputs, proposal: proposal(), authorDraftContent: content, sessionId: 'author-assistant-example-update', now });
    const acceptance = acceptSimpleHandoff(session, handoffPackage, { now });
    let sharedDraft = {
      ...structuredClone(content),
      draft: { draftId: 'existing-shared-draft', revision: 87, status: 'ready_for_approval', createdAt: '2026-08-09T00:00:00Z', createdBy: currentUser.id, updatedAt: '2026-08-09T01:00:00Z', updatedBy: currentUser.id, importedFrom: { type: 'author_assistant_handoff' } }
    };
    const publishedSnapshot = structuredClone(sharedDraft);
    publishedSnapshot.draft.revision = 2;
    const releaseCandidates = [{ candidate_id: updateInputs.updateTarget.candidateId, draft_id: 'existing-shared-draft', source_revision: 2, snapshot: publishedSnapshot }];
    const preparedPlan = await prepareAuthorHandoffControlledUpdate({ handoffPackage, acceptance, currentUser, existingDrafts: [sharedDraft], releaseCandidates, now, cryptoImpl: webcrypto });
    assert.equal(preparedPlan.canUpdate, true);
    assert.equal(preparedPlan.beforeRevision, 87);
    assert.equal(preparedPlan.afterRevision, 88);
    assert.equal(preparedPlan.baseContentMatches, true);
    const result = await executeAuthorHandoffControlledUpdate({
      handoffPackage, acceptance, currentUser, preparedPlan, confirmation: AUTHOR_HANDOFF_UPDATE_CONFIRMATION,
      listDrafts: async () => ({ success: true, drafts: [sharedDraft] }),
      listReleaseCandidates: async () => ({ success: true, candidates: releaseCandidates }),
      saveDraft: async ({ draft, expectedRevision }) => {
        assert.equal(expectedRevision, 87);
        sharedDraft = { ...draft, draft: { ...draft.draft, revision: 88 } };
        return { success: true, draft: sharedDraft };
      },
      cryptoImpl: webcrypto
    });
    assert.equal(result.success, true);
    assert.equal(result.revision, 88);
    const replay = await prepareAuthorHandoffControlledUpdate({ handoffPackage, acceptance, currentUser, existingDrafts: [sharedDraft], releaseCandidates, now, cryptoImpl: webcrypto });
    assert.equal(replay.canUpdate, false);
    assert.match(replay.blockedReason, /already been applied/);
  });
});
