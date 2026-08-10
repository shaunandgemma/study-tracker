import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStage86AAcceptance } from './authorAssistantCore.mjs';
import { buildStage86ALocalAcceptance, verifyStage86AAcceptanceFingerprint } from './authorAssistantStage86A.mjs';

const terminal = createInterface({ input, output });

async function readJson(directory, filename) {
  return JSON.parse(await readFile(path.join(directory, filename), 'utf8'));
}

try {
  output.write('\nAUTHOR ASSISTANT - STEP 86A LOCAL STAGE 8 ACCEPTANCE\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It does not write to Author, Supabase or AWS and does not begin Stage 9.\n');
  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const stageSixAcceptance = await readJson(loaded.sessionDirectory, 'author-stage-6-acceptance-84d.json');
  const stageSevenAcceptance = await readJson(loaded.sessionDirectory, 'author-stage-7-acceptance-85b.json');
  const supportRecords = {
    acceptedSources: loaded.acceptedSources,
    blueprint: loaded.blueprint,
    blueprintAcceptance: loaded.blueprintAcceptance,
    sourceAmendment84B: await readJson(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json'),
    consistencyCorrection84C: await readJson(loaded.sessionDirectory, 'author-stage-6-consistency-correction-84c.json')
  };
  const accepted = buildStage86ALocalAcceptance({
    session: loaded.session,
    stageEight: loaded.stageEightCleanup,
    stageSeven: loaded.stageSevenResourcesChecks,
    stageSevenAcceptance,
    stageSixInstructions: loaded.stageSixInstructions,
    stageSixAcceptance,
    supportRecords
  });
  if (!verifyStage86AAcceptanceFingerprint(accepted.stageEight, accepted.acceptance)) throw new Error('The Stage 8 fingerprint could not be verified.');
  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
  output.write(`Session ID: ${loaded.session.sessionId}\n`);
  output.write(`Only approved cleanup target: ${accepted.acceptance.approvedCleanupTarget.targetName}\n`);
  output.write(`Separate task cleanup steps: ${accepted.acceptance.taskCleanupStepCount}\n`);
  output.write(`Final programme acknowledgements: ${accepted.acceptance.programmeAcknowledgementCount}\n`);
  output.write(`SHA-256 fingerprint: ${accepted.acceptance.stageEightFingerprint.value}\n`);
  output.write('All accepted Stages 1-7 records will remain unchanged.\n');
  const answer = (await terminal.question('\nAccept the complete local Stage 8 manual cleanup package now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') {
    output.write('Step 86A was not applied. No files were changed.\n');
  } else {
    const saved = await saveAuthorAssistantStage86AAcceptance({
      sessionRoot,
      existingSession: loaded.session,
      acceptedSession: accepted.session,
      existingStageEight: loaded.stageEightCleanup,
      acceptedStageEight: accepted.stageEight,
      acceptance: accepted.acceptance
    });
    output.write('\nStep 86A completed locally.\n');
    output.write(`Accepted Stage 8 package: ${saved.stageEightPath}\n`);
    output.write(`Acceptance audit: ${saved.acceptancePath}\n`);
    output.write(`Verified fingerprint: ${accepted.acceptance.stageEightFingerprint.value}\n`);
    output.write('Nothing was written to Author, Supabase or AWS. Stage 9 has not started.\n');
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
