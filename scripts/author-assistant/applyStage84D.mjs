import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  findLatestAuthorAssistantSession,
  getDefaultSessionRoot,
  saveAuthorAssistantStage84DAcceptance
} from './authorAssistantCore.mjs';
import {
  buildStage84DLocalAcceptance,
  verifyStage84DAcceptanceFingerprint
} from './authorAssistantStage84D.mjs';

const terminal = createInterface({ input, output });

try {
  output.write('\nAUTHOR ASSISTANT - STEP 84D LOCAL STAGE 6 ACCEPTANCE\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It does not write to Author, Supabase or AWS and does not begin Stage 7.\n');

  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const sourceAmendmentAudit = JSON.parse(await readFile(path.join(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json'), 'utf8'));
  const consistencyAudit = JSON.parse(await readFile(path.join(loaded.sessionDirectory, 'author-stage-6-consistency-correction-84c.json'), 'utf8'));

  const accepted = buildStage84DLocalAcceptance({
    session: loaded.session,
    acceptedSources: loaded.acceptedSources,
    blueprint: loaded.blueprint,
    instructions: loaded.stageSixInstructions,
    blueprintAcceptance: loaded.blueprintAcceptance,
    sourceAmendmentAudit,
    consistencyAudit
  });
  if (!verifyStage84DAcceptanceFingerprint(accepted.instructions, accepted.acceptance)) {
    throw new Error('The Stage 6 fingerprint could not be verified.');
  }

  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
  output.write(`Session ID: ${loaded.session.sessionId}\n`);
  output.write(`Prepared tasks: ${accepted.acceptance.taskCount}\n`);
  output.write(`Separate editable checkboxes: ${accepted.acceptance.checkboxCount}\n`);
  output.write(`SHA-256 fingerprint: ${accepted.acceptance.instructionFingerprint.value}\n`);
  output.write('All supporting records will remain unchanged.\n');

  const answer = (await terminal.question('\nAccept the complete local Stage 6 instruction set now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') {
    output.write('Step 84D was not applied. No files were changed.\n');
  } else {
    const saved = await saveAuthorAssistantStage84DAcceptance({
      sessionRoot,
      existingSession: loaded.session,
      acceptedSession: accepted.session,
      existingInstructions: loaded.stageSixInstructions,
      acceptedInstructions: accepted.instructions,
      acceptance: accepted.acceptance
    });
    output.write('\nStep 84D completed locally.\n');
    output.write(`Accepted instructions: ${saved.instructionsPath}\n`);
    output.write(`Acceptance audit: ${saved.acceptancePath}\n`);
    output.write(`Verified fingerprint: ${accepted.acceptance.instructionFingerprint.value}\n`);
    output.write('Nothing was written to Author. Stage 7 has not started.\n');
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
