import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStageTenPreview } from './authorAssistantCore.mjs';
import { buildStageTenLearnerPreview, formatStageTenPreview } from './authorAssistantLearnerPreview.mjs';

const terminal = createInterface({ input, output });
const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);

try {
  output.write('\nAUTHOR ASSISTANT - STEP 88 LOCAL LEARNER PREVIEW\n');
  output.write('This prepares only a learner-facing local preview from accepted Stages 1-9.\n');
  output.write('It does not use AI, connect to Author, Supabase or AWS, and it stops before Stage 11.\n');
  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  if (loaded.stageTenLearnerPreview) {
    output.write('\nStage 10 learner preview already exists. No duplicate was created.\n');
    output.write(`Stage 10 file: ${loaded.sessionDirectory}\\author-stage-10-learner-preview.json\n`);
  } else {
    const supportingRecords = {
      acceptedSources: loaded.acceptedSources,
      blueprint: loaded.blueprint,
      blueprintAcceptance: loaded.blueprintAcceptance,
      sourceAmendment84B: await readJson(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json'),
      consistencyCorrection84C: await readJson(loaded.sessionDirectory, 'author-stage-6-consistency-correction-84c.json'),
      stageSix: loaded.stageSixInstructions,
      stageSixAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-6-acceptance-84d.json'),
      stageSeven: loaded.stageSevenResourcesChecks,
      stageSevenAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-7-acceptance-85b.json'),
      stageEight: loaded.stageEightCleanup,
      stageEightAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-8-acceptance-86a.json')
    };
    const inputs = {
      session: loaded.session,
      acceptedSources: loaded.acceptedSources,
      blueprint: loaded.blueprint,
      stageSix: loaded.stageSixInstructions,
      stageSeven: loaded.stageSevenResourcesChecks,
      stageEight: loaded.stageEightCleanup,
      stageNine: loaded.stageNineAuthoringCheck,
      stageNineAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-9-acceptance-87a.json'),
      supportingRecords
    };
    output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
    output.write(`Session ID: ${loaded.session.sessionId}\n`);
    output.write('Accepted Stages 1-9 fingerprints and learner-only privacy boundary will be verified.\n');
    const document = buildStageTenLearnerPreview(inputs);
    const previewText = formatStageTenPreview(document);
    output.write(`Tasks: ${document.summary.taskCount}\n`);
    output.write(`Separate editable checkboxes: ${document.summary.checkboxCount}\n`);
    output.write(`Verification checks: ${document.summary.verificationCheckCount}\n`);
    output.write(`Cleanup items: ${document.summary.cleanupItemCount}\n`);
    output.write(`Official AWS references: ${document.summary.officialAwsReferenceCount}\n`);
    const answer = (await terminal.question('\nPrepare and save only the local Stage 10 Learner Preview now? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y' && answer !== 'yes') output.write('Step 88 was not run. No files were changed.\n');
    else {
      const saved = await saveAuthorAssistantStageTenPreview({ sessionRoot, existingSession: loaded.session, document, previewText });
      output.write(`\n${previewText}`);
      output.write(`Stage 10 saved: ${saved.documentPath}\n`);
      output.write(`Short preview saved: ${saved.previewPath}\n`);
      output.write('Review the learner preview before accepting it.\n');
      output.write('Nothing was written to Author, Supabase or AWS. Stage 11 has not started.\n');
    }
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
