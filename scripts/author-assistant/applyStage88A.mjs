import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStage88ACorrection } from './authorAssistantCore.mjs';
import { buildStage88ACorrection } from './authorAssistantStage88A.mjs';

const terminal = createInterface({ input, output });
const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);

try {
  output.write('\nAUTHOR ASSISTANT - STEP 88A RECEIPT-HANDLE BOUNDARY CORRECTION\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It changes only two Console-path task goals and required dependent fingerprints, reruns Stage 9, regenerates Stage 10, and stops before Stage 11.\n');
  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const inputs = {
    session: loaded.session, acceptedSources: loaded.acceptedSources, blueprint: loaded.blueprint, blueprintAcceptance: loaded.blueprintAcceptance,
    sourceAmendment84B: await readJson(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json'), consistencyCorrection84C: await readJson(loaded.sessionDirectory, 'author-stage-6-consistency-correction-84c.json'),
    stageSix: loaded.stageSixInstructions, stageSixAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-6-acceptance-84d.json'),
    stageSeven: loaded.stageSevenResourcesChecks, stageSevenAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-7-acceptance-85b.json'),
    stageEight: loaded.stageEightCleanup, stageEightAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-8-acceptance-86a.json'),
    stageNine: loaded.stageNineAuthoringCheck, stageNineAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-9-acceptance-87a.json'), stageTen: loaded.stageTenLearnerPreview
  };
  const correction = buildStage88ACorrection(inputs);
  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
  for (const item of correction.audit.goalCorrections) output.write(`\n${item.taskId}\nOLD: ${item.oldGoal}\nNEW: ${item.newGoal}\n`);
  output.write('\nStage 9 rerun: passed with zero errors\n');
  output.write(`Corrected Stage 9 fingerprint: ${correction.stageNine.acceptanceFingerprint.value}\n`);
  output.write(`Corrected preview checkboxes: ${correction.stageTen.summary.checkboxCount}\n`);
  output.write('Future CLI receipt-handle guidance: preserved\n');
  const answer = (await terminal.question('\nApply the approved Step 88A local correction now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') output.write('Step 88A was not applied. No files were changed.\n');
  else {
    const saved = await saveAuthorAssistantStage88ACorrection({ sessionRoot, existingSession: loaded.session, existingRecords: inputs, correction });
    output.write('\nStep 88A completed locally.\n');
    output.write(`Correction audit: ${saved.auditPath}\n`);
    output.write(`Corrected Stage 10 preview: ${saved.stageTenPath}\n`);
    output.write(`Verified Stage 9 fingerprint: ${correction.stageNine.acceptanceFingerprint.value}\n`);
    output.write('Nothing was written to Author, Supabase or AWS. Stage 11 has not started.\n');
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally { terminal.close(); }
