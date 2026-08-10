import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  findLatestAuthorAssistantSession,
  getDefaultSessionRoot,
  saveAuthorAssistantStage90AAcceptance
} from './authorAssistantCore.mjs';
import {
  buildStage90ALocalAcceptance,
  verifyStage90AAcceptance
} from './authorAssistantStage90A.mjs';

const terminal = createInterface({ input, output });
const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);

async function readOptionalJson(directory, filename) {
  try {
    return await readJson(directory, filename);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

try {
  output.write('\nAUTHOR ASSISTANT - STEP 90A LOCAL HANDOFF ACCEPTANCE\n');
  output.write('This command does not use AI or require an API key.\n');
  output.write('It records only local human acceptance of the verified handoff package and does not begin Stage 12.\n');

  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const handoffPackage = await readJson(loaded.sessionDirectory, 'author-local-handoff-package.json');
  const existingAcceptance = await readOptionalJson(loaded.sessionDirectory, 'author-local-handoff-acceptance-90a.json');
  if (existingAcceptance) {
    if (!verifyStage90AAcceptance(handoffPackage, existingAcceptance)) throw new Error('The existing Step 90A acceptance audit no longer matches the handoff package.');
    output.write(`\nThis verified handoff package is already human accepted. No duplicate audit was created.\nAcceptance audit: ${path.join(loaded.sessionDirectory, 'author-local-handoff-acceptance-90a.json')}\nHandoff fingerprint: ${existingAcceptance.handoffFingerprint.value}\nStage 12 has not started.\n`);
  } else {
    const acceptance = buildStage90ALocalAcceptance({ session: loaded.session, handoffPackage });
    output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\nProgramme: ${handoffPackage.authorDraftContent.programme.displayName}\nTasks: ${handoffPackage.summary.taskCount}\nSeparate editable checkboxes: ${handoffPackage.summary.checkboxCount}\nVerification checks: ${handoffPackage.summary.verificationCheckCount}\nCleanup items: ${handoffPackage.summary.cleanupItemCount}\nHandoff fingerprint: ${acceptance.handoffFingerprint.value}\nAuthor identity: not bound\n`);
    const answer = (await terminal.question('\nAccept this exact local handoff package now? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y' && answer !== 'yes') {
      output.write('Step 90A was not applied. No files were changed.\n');
    } else {
      const saved = await saveAuthorAssistantStage90AAcceptance({
        sessionRoot,
        existingSession: loaded.session,
        handoffPackage,
        acceptance
      });
      output.write(`\nStep 90A completed locally.\nUnchanged handoff package: ${saved.packagePath}\nHuman-acceptance audit: ${saved.acceptancePath}\nVerified handoff fingerprint: ${acceptance.handoffFingerprint.value}\nNothing was written to Author, Supabase or AWS. Stage 12 has not started.\n`);
    }
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
