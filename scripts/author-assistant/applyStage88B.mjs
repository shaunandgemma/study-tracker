import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStage88BAcceptance } from './authorAssistantCore.mjs';
import { buildStage88BLocalAcceptance, verifyStage88BAcceptanceFingerprint } from './authorAssistantStage88B.mjs';

const terminal = createInterface({ input, output });
const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);

try {
  output.write('\nAUTHOR ASSISTANT - STEP 88B LOCAL STAGE 10 ACCEPTANCE\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It accepts only the corrected learner-only Stage 10 preview and does not begin Stage 11.\n');
  const sessionRoot = getDefaultSessionRoot(); const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const accepted = buildStage88BLocalAcceptance({ session: loaded.session, stageNine: loaded.stageNineAuthoringCheck, stageNineAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-9-acceptance-87a.json'), stageTen: loaded.stageTenLearnerPreview, correctionAudit: await readJson(loaded.sessionDirectory, 'author-stage-10-correction-88a.json') });
  if (!verifyStage88BAcceptanceFingerprint(accepted.stageTen, accepted.acceptance)) throw new Error('The Stage 10 fingerprint could not be verified.');
  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
  output.write(`Tasks: ${accepted.acceptance.taskCount}\nSeparate editable checkboxes: ${accepted.acceptance.checkboxCount}\nVerification checks: ${accepted.acceptance.verificationCheckCount}\nCleanup items: ${accepted.acceptance.cleanupItemCount}\n`);
  output.write('Receipt handles excluded from Console goals: yes\nFuture CLI receipt-handle guidance preserved by Step 88A: yes\n');
  output.write(`SHA-256 fingerprint: ${accepted.acceptance.stageTenFingerprint.value}\n`);
  const answer = (await terminal.question('\nAccept the corrected local Stage 10 Learner Preview now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') output.write('Step 88B was not applied. No files were changed.\n');
  else {
    const saved = await saveAuthorAssistantStage88BAcceptance({ sessionRoot, existingSession: loaded.session, acceptedSession: accepted.session, existingStageTen: loaded.stageTenLearnerPreview, acceptedStageTen: accepted.stageTen, acceptance: accepted.acceptance });
    output.write('\nStep 88B completed locally.\n'); output.write(`Accepted Stage 10 preview: ${saved.stageTenPath}\nAcceptance audit: ${saved.acceptancePath}\nVerified fingerprint: ${accepted.acceptance.stageTenFingerprint.value}\n`);
    output.write('Nothing was written to Author, Supabase or AWS. Stage 11 has not started.\n');
  }
} catch (error) { output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`); process.exitCode = 1; } finally { terminal.close(); }
