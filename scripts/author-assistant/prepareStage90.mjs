import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  findLatestAuthorAssistantSession,
  getDefaultSessionRoot,
  saveAuthorAssistantHandoffPackage
} from './authorAssistantCore.mjs';
import {
  buildAuthorHandoffPackage,
  formatAuthorHandoffPreview,
  verifyAuthorHandoffPackageFingerprint
} from './authorAssistantHandoff.mjs';

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
  output.write('\nAUTHOR ASSISTANT - STEP 90 LOCAL AUTHOR HANDOFF PACKAGE\n');
  output.write('This prepares and tests only a local handoff package from accepted Stages 1-11.\n');
  output.write('It does not use AI, bind an Author account, write a draft, connect to Supabase or AWS, create a candidate, or begin publishing.\n');

  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const existing = await readOptionalJson(loaded.sessionDirectory, 'author-local-handoff-package.json');
  if (existing) {
    if (!verifyAuthorHandoffPackageFingerprint(existing)) throw new Error('The existing local handoff package fingerprint no longer matches.');
    output.write(`\nA verified local handoff package already exists. No duplicate was created.\nPackage: ${path.join(loaded.sessionDirectory, 'author-local-handoff-package.json')}\nFingerprint: ${existing.handoffFingerprint.value}\nStage 12 has not started.\n`);
  } else {
    const inputs = {
      session: loaded.session,
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
      stageEightAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-8-acceptance-86a.json'),
      stageNine: loaded.stageNineAuthoringCheck,
      stageNineAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-9-acceptance-87a.json'),
      correctionAudit88A: await readJson(loaded.sessionDirectory, 'author-stage-10-correction-88a.json'),
      stageTen: loaded.stageTenLearnerPreview,
      stageTenAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-10-acceptance-88b.json'),
      stageEleven: loaded.stageElevenStructuredReview,
      stageElevenAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-11-acceptance-89a.json')
    };
    const handoffPackage = buildAuthorHandoffPackage(inputs);
    const previewText = formatAuthorHandoffPreview(handoffPackage);
    output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\nAccepted Stages 1-11 fingerprints: verified\nTasks: ${handoffPackage.summary.taskCount}\nSeparate editable checkboxes: ${handoffPackage.summary.checkboxCount}\nVerification checks: ${handoffPackage.summary.verificationCheckCount}\nCleanup items: ${handoffPackage.summary.cleanupItemCount}\nAuthor identity: not bound\n`);
    const answer = (await terminal.question('\nPrepare and save only the local Author handoff package now? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y' && answer !== 'yes') {
      output.write('Step 90 was not run. No files were changed.\n');
    } else {
      const saved = await saveAuthorAssistantHandoffPackage({
        sessionRoot,
        existingSession: loaded.session,
        handoffPackage,
        previewText
      });
      output.write(`\n${previewText}Handoff package saved: ${saved.packagePath}\nShort preview saved: ${saved.previewPath}\nReview these local files before any Author write is considered. Stage 12 has not started.\n`);
    }
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
