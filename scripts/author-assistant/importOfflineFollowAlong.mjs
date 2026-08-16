import { access, copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  acceptSimpleHandoff,
  saveSimpleHandoff
} from './authorAssistantSimple.mjs';
import {
  buildOfflineHandoff,
  defaultOfflineOutputRoot,
  OFFLINE_MANUSCRIPT_FILENAME,
  OFFLINE_PREVIEW_FILENAME
} from './authorAssistantOfflineImport.mjs';
import { verifyStage90AAcceptance } from './authorAssistantStage90A.mjs';

const terminal = createInterface({ input, output });
const commandArguments = process.argv.slice(2);

async function exists(filePath) {
  try { await access(filePath); return true; } catch { return false; }
}

async function requiredPath() {
  const supplied = commandArguments.find(argument => !argument.startsWith('--'));
  if (supplied) return path.resolve(supplied);
  while (true) {
    const answer = (await terminal.question(`Full path to ${OFFLINE_MANUSCRIPT_FILENAME}: `)).trim().replace(/^"|"$/g, '');
    if (answer) return path.resolve(answer);
    output.write('Please enter the full file path.\n');
  }
}

try {
  output.write('\nAUTHOR ASSISTANT - OFFLINE FOLLOW ALONG IMPORT\n');
  output.write('This command uses no AI or API key. It does not connect to Author, Supabase or AWS.\n');
  output.write('It validates the downloaded manuscript, creates a local handoff and stops at human fingerprint acceptance.\n\n');
  const manuscriptPath = await requiredPath();
  const previewPath = path.join(path.dirname(manuscriptPath), OFFLINE_PREVIEW_FILENAME);
  if (path.basename(manuscriptPath).toLowerCase() !== OFFLINE_MANUSCRIPT_FILENAME) throw new Error(`Choose the file named ${OFFLINE_MANUSCRIPT_FILENAME}.`);
  if (!(await exists(previewPath))) throw new Error(`The matching ${OFFLINE_PREVIEW_FILENAME} file is missing from the same folder.`);
  let manuscript;
  try { manuscript = JSON.parse((await readFile(manuscriptPath, 'utf8')).replace(/^\uFEFF/, '')); }
  catch { throw new Error('The offline manuscript is not valid UTF-8 JSON.'); }
  const readablePreview = await readFile(previewPath, 'utf8');
  if (!readablePreview.trim()) throw new Error('The offline readable preview is empty.');

  const result = buildOfflineHandoff(manuscript);
  const outputRoot = defaultOfflineOutputRoot();
  const sessionDirectory = path.join(outputRoot, result.session.sessionId);
  const acceptancePath = path.join(sessionDirectory, 'author-local-handoff-acceptance-90a.json');
  const packagePath = path.join(sessionDirectory, 'author-local-handoff-package.json');
  const sessionPath = path.join(sessionDirectory, 'session.json');
  let session = result.session;
  let handoffPackage = result.handoffPackage;

  if (await exists(packagePath)) {
    session = JSON.parse(await readFile(sessionPath, 'utf8'));
    handoffPackage = JSON.parse(await readFile(packagePath, 'utf8'));
    if (handoffPackage.offlineImport?.manuscriptFingerprint?.value !== result.manuscriptFingerprint) {
      throw new Error('The existing deterministic offline-import folder contains a different manuscript. Nothing was overwritten.');
    }
    output.write('This exact offline manuscript has already been converted. Existing files were preserved.\n');
  } else {
    await saveSimpleHandoff({ session, handoffPackage, previewText: result.previewText, root: outputRoot });
    await copyFile(manuscriptPath, path.join(sessionDirectory, OFFLINE_MANUSCRIPT_FILENAME));
    await copyFile(previewPath, path.join(sessionDirectory, OFFLINE_PREVIEW_FILENAME));
  }

  output.write(`\n${result.previewText}`);
  output.write(`Local session folder: ${sessionDirectory}\n`);
  output.write(`Handoff package: ${packagePath}\n`);
  output.write(`SHA-256 fingerprint: ${handoffPackage.handoffFingerprint.value}\n`);
  output.write('Nothing was imported, approved or published.\n');

  if (await exists(acceptancePath)) {
    const acceptance = JSON.parse(await readFile(acceptancePath, 'utf8'));
    if (!verifyStage90AAcceptance(handoffPackage, acceptance)) throw new Error('The existing Step 90A acceptance no longer matches the handoff package.');
    output.write(`\nThis exact fingerprint is already human accepted.\nAcceptance audit: ${acceptancePath}\n`);
  } else {
    const answer = commandArguments.includes('--accept')
      ? 'yes'
      : commandArguments.includes('--no-accept')
        ? 'no'
        : (await terminal.question('\nAccept this exact fingerprint and create only the local Step 90A audit? (y/N): ')).trim().toLowerCase();
    if (['y', 'yes'].includes(answer)) {
      const acceptance = acceptSimpleHandoff(session, handoffPackage);
      const files = await saveSimpleHandoff({ session, handoffPackage, acceptance, previewText: result.previewText, root: outputRoot });
      output.write(`\nAccepted safely.\nAcceptance audit: ${files.acceptancePath}\n`);
      output.write('Use the handoff package and acceptance audit in the signed-in local Author page.\n');
    } else {
      output.write('\nThe handoff remains unaccepted. Review the local preview and rerun this same command when ready.\n');
    }
  }
  output.write('No AI, API, Author, Supabase or AWS operation was performed.\n');
} catch (error) {
  output.write(`\nOffline import stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
