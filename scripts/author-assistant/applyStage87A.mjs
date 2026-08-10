import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStage87AAcceptance } from './authorAssistantCore.mjs';
import { buildStage87ALocalAcceptance, verifyStage87AAcceptanceFingerprint } from './authorAssistantStage87A.mjs';

const terminal = createInterface({ input, output });
const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);

try {
  output.write('\nAUTHOR ASSISTANT - STEP 87A LOCAL STAGE 9 ACCEPTANCE\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It does not write to Author, Supabase or AWS and does not begin Stage 10.\n');
  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
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
  const accepted = buildStage87ALocalAcceptance({ session: loaded.session, stageNine: loaded.stageNineAuthoringCheck, supportingRecords });
  if (!verifyStage87AAcceptanceFingerprint(accepted.stageNine, accepted.acceptance)) throw new Error('The Stage 9 fingerprint could not be verified.');
  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
  output.write(`Session ID: ${loaded.session.sessionId}\n`);
  output.write(`Authoring-check errors: ${accepted.acceptance.acceptedSummary.errorCount}\n`);
  output.write(`Tasks: ${accepted.acceptance.acceptedSummary.taskCount}\n`);
  output.write(`Separate editable checkboxes: ${accepted.acceptance.acceptedSummary.checkboxCount}\n`);
  output.write(`Verification checks: ${accepted.acceptance.acceptedSummary.verificationCheckCount}\n`);
  output.write(`Cleanup items: ${accepted.acceptance.acceptedSummary.cleanupItemCount}\n`);
  output.write(`SHA-256 fingerprint: ${accepted.acceptance.stageNineFingerprint.value}\n`);
  output.write('All accepted Stages 1-8 records will remain unchanged.\n');
  const answer = (await terminal.question('\nAccept the complete passed local Stage 9 Authoring Check now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') output.write('Step 87A was not applied. No files were changed.\n');
  else {
    const saved = await saveAuthorAssistantStage87AAcceptance({ sessionRoot, existingSession: loaded.session, acceptedSession: accepted.session, existingStageNine: loaded.stageNineAuthoringCheck, acceptedStageNine: accepted.stageNine, acceptance: accepted.acceptance });
    output.write('\nStep 87A completed locally.\n');
    output.write(`Accepted Stage 9 report: ${saved.stageNinePath}\n`);
    output.write(`Acceptance audit: ${saved.acceptancePath}\n`);
    output.write(`Verified fingerprint: ${accepted.acceptance.stageNineFingerprint.value}\n`);
    output.write('Nothing was written to Author, Supabase or AWS. Stage 10 has not started.\n');
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
