import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot } from './authorAssistantCore.mjs';
import { DEFAULT_AUTHOR_ASSISTANT_MODEL } from './authorAssistantResearch.mjs';
import { formatStageEightPreview, requestStageEightCleanup, saveStageEightCleanup, validateStage86Inputs } from './authorAssistantCleanup.mjs';

const terminal = createInterface({ input, output });
const cleanupBoundary = Object.freeze({
  taskId: 'task-sqs-review-queue-deletion-effects-006',
  targetType: 'Amazon SQS queue',
  targetName: 'sqs-beginner-test'
});

async function readJson(directory, filename) {
  return JSON.parse(await readFile(path.join(directory, filename), 'utf8'));
}

try {
  output.write('\nAUTHOR ASSISTANT - STEP 86 LOCAL MANUAL CLEANUP\n');
  output.write('This prepares only local Author Stage 8 manual Console cleanup.\n');
  output.write('It does not connect to AWS, Supabase or Author and it stops before Stage 9.\n');

  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  if (loaded.stageEightCleanup) {
    output.write('\nStage 8 cleanup already exists for this session. No duplicate was created.\n');
    output.write(`Stage 8 file: ${loaded.sessionDirectory}\\author-stage-8-cleanup.json\n`);
  } else {
    const stageSixAcceptance = await readJson(loaded.sessionDirectory, 'author-stage-6-acceptance-84d.json');
    const stageSevenAcceptance = await readJson(loaded.sessionDirectory, 'author-stage-7-acceptance-85b.json');
    const supportRecords = {
      blueprintAcceptance: loaded.blueprintAcceptance,
      sourceAmendment84B: await readJson(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json'),
      consistencyCorrection84C: await readJson(loaded.sessionDirectory, 'author-stage-6-consistency-correction-84c.json')
    };
    const inputs = {
      session: loaded.session,
      acceptedSources: loaded.acceptedSources,
      blueprint: loaded.blueprint,
      stageSixInstructions: loaded.stageSixInstructions,
      stageSixAcceptance,
      stageSeven: loaded.stageSevenResourcesChecks,
      stageSevenAcceptance,
      supportRecords,
      cleanupBoundary
    };
    validateStage86Inputs(inputs);
    output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
    output.write(`Session ID: ${loaded.session.sessionId}\n`);
    output.write(`Only approved cleanup target: ${cleanupBoundary.targetType} ${cleanupBoundary.targetName}\n`);
    output.write('Accepted Stages 1-7 fingerprints: verified\n');
    const answer = (await terminal.question('\nPrepare only local Stage 8 manual cleanup now? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y' && answer !== 'yes') {
      output.write('Step 86 was not run. No files were changed.\n');
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY is not configured. No Stage 8 request was made.');
      const model = process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL;
      output.write('\nPreparing local manual cleanup from accepted AWS Console sources only...\n');
      const document = await requestStageEightCleanup({ ...inputs, apiKey, model });
      const previewText = formatStageEightPreview(document);
      const saved = await saveStageEightCleanup({ sessionRoot, existingSession: loaded.session, document, previewText });
      output.write(`\n${previewText}`);
      output.write(`Stage 8 saved: ${saved.documentPath}\n`);
      output.write(`Short preview saved: ${saved.previewPath}\n`);
      output.write('Review these local files before continuing. Stage 8 was not accepted automatically.\n');
      output.write('Nothing was written to Author, Supabase or AWS. Stage 9 has not started.\n');
    }
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
