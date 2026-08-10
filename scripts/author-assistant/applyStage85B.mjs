import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  findLatestAuthorAssistantSession,
  getDefaultSessionRoot,
  saveAuthorAssistantStage85BAcceptance
} from './authorAssistantCore.mjs';
import {
  buildStage85BLocalAcceptance,
  verifyStage85BAcceptanceFingerprint
} from './authorAssistantStage85B.mjs';

const terminal = createInterface({ input, output });

async function readJson(directory, filename) {
  return JSON.parse(await readFile(path.join(directory, filename), 'utf8'));
}

try {
  output.write('\nAUTHOR ASSISTANT - STEP 85B LOCAL STAGE 7 ACCEPTANCE\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It does not write to Author, Supabase or AWS and does not begin Stage 8.\n');

  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const stageSixAcceptance = await readJson(loaded.sessionDirectory, 'author-stage-6-acceptance-84d.json');
  const supportRecords = {
    acceptedSources: loaded.acceptedSources,
    blueprint: loaded.blueprint,
    blueprintAcceptance: loaded.blueprintAcceptance,
    sourceAmendment84B: await readJson(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json'),
    consistencyCorrection84C: await readJson(loaded.sessionDirectory, 'author-stage-6-consistency-correction-84c.json')
  };
  const accepted = buildStage85BLocalAcceptance({
    session: loaded.session,
    stageSeven: loaded.stageSevenResourcesChecks,
    stageSixInstructions: loaded.stageSixInstructions,
    stageSixAcceptance,
    supportRecords
  });
  if (!verifyStage85BAcceptanceFingerprint(accepted.stageSeven, accepted.acceptance)) {
    throw new Error('The Stage 7 fingerprint could not be verified.');
  }

  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
  output.write(`Session ID: ${loaded.session.sessionId}\n`);
  output.write(`Prepared tasks: ${accepted.acceptance.taskCount}\n`);
  output.write(`Separate editable verification checks: ${accepted.acceptance.verificationCount}\n`);
  output.write(`Learner resource values: ${accepted.acceptance.resourceCount}\n`);
  output.write(`SHA-256 fingerprint: ${accepted.acceptance.stageSevenFingerprint.value}\n`);
  output.write('All accepted Stages 1-6 records will remain unchanged.\n');

  const answer = (await terminal.question('\nAccept the complete local Stage 7 Resources and Checks package now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') {
    output.write('Step 85B was not applied. No files were changed.\n');
  } else {
    const saved = await saveAuthorAssistantStage85BAcceptance({
      sessionRoot,
      existingSession: loaded.session,
      acceptedSession: accepted.session,
      existingStageSeven: loaded.stageSevenResourcesChecks,
      acceptedStageSeven: accepted.stageSeven,
      acceptance: accepted.acceptance
    });
    output.write('\nStep 85B completed locally.\n');
    output.write(`Accepted Stage 7 package: ${saved.stageSevenPath}\n`);
    output.write(`Acceptance audit: ${saved.acceptancePath}\n`);
    output.write(`Verified fingerprint: ${accepted.acceptance.stageSevenFingerprint.value}\n`);
    output.write('Nothing was written to Author, Supabase or AWS. Stage 8 has not started.\n');
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
