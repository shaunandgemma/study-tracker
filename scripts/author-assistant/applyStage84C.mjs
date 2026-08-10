import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  findLatestAuthorAssistantSession,
  getDefaultSessionRoot,
  saveAuthorAssistantStage84CCorrection
} from './authorAssistantCore.mjs';
import {
  buildStage84CLocalCorrection,
  STAGE_84C_CANONICAL_QUEUE_NAME,
  STAGE_84C_OLD_QUEUE_NAME
} from './authorAssistantStage84C.mjs';

const terminal = createInterface({ input, output });

try {
  output.write('\nAUTHOR ASSISTANT - STEP 84C LOCAL CONSISTENCY CORRECTION\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It does not write to Author, Supabase or AWS and does not begin Stage 7.\n');

  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const auditPath84B = path.join(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json');
  const sourceAmendmentAudit = JSON.parse(await readFile(auditPath84B, 'utf8'));

  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
  output.write(`Session ID: ${loaded.session.sessionId}\n`);
  output.write(`Queue-name correction: ${STAGE_84C_OLD_QUEUE_NAME} -> ${STAGE_84C_CANONICAL_QUEUE_NAME}\n`);
  output.write('The historical Region-source finding will be preserved and marked resolved.\n');
  output.write('The IAM warning will remain active.\n');

  const answer = (await terminal.question('\nApply the approved Step 84C local correction now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') {
    output.write('Step 84C was not applied. No files were changed.\n');
  } else {
    const corrected = buildStage84CLocalCorrection({
      session: loaded.session,
      acceptedSources: loaded.acceptedSources,
      blueprint: loaded.blueprint,
      instructions: loaded.stageSixInstructions,
      sourceAmendmentAudit
    });
    const saved = await saveAuthorAssistantStage84CCorrection({
      sessionRoot,
      existingSession: loaded.session,
      correctedSession: corrected.session,
      existingAcceptedSources: loaded.acceptedSources,
      correctedAcceptedSources: corrected.acceptedSources,
      existingInstructions: loaded.stageSixInstructions,
      correctedInstructions: corrected.instructions,
      audit: corrected.audit
    });
    output.write('\nStep 84C completed locally.\n');
    output.write(`Instructions: ${saved.instructionsPath}\n`);
    output.write(`Accepted-source record: ${saved.acceptedSourcesPath}\n`);
    output.write(`Audit: ${saved.auditPath}\n`);
    output.write('Stage 6 is still waiting for human acceptance.\n');
    output.write('Nothing was written to Author. Stage 7 has not started.\n');
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
