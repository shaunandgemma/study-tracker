import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStageNineCheck } from './authorAssistantCore.mjs';
import { buildStageNineAuthoringCheck, formatStageNinePreview } from './authorAssistantAuthoringCheck.mjs';

const terminal = createInterface({ input, output });
const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);

try {
  output.write('\nAUTHOR ASSISTANT - STEP 87 LOCAL AUTHORING CHECK\n');
  output.write('This checks the accepted local Stages 1-8 package with the Author planning and content rules.\n');
  output.write('It does not use AI, connect to Author, Supabase or AWS, and it stops before Stage 10.\n');
  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  if (loaded.stageNineAuthoringCheck) {
    output.write('\nStage 9 authoring check already exists. No duplicate was created.\n');
    output.write(`Stage 9 file: ${loaded.sessionDirectory}\\author-stage-9-authoring-check.json\n`);
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
      stageEightAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-8-acceptance-86a.json')
    };
    output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
    output.write(`Session ID: ${loaded.session.sessionId}\n`);
    output.write('Accepted Stages 1-8 fingerprints will be verified before the check is saved.\n');
    const answer = (await terminal.question('\nRun and save only the local Stage 9 Authoring Check now? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y' && answer !== 'yes') output.write('Step 87 was not run. No files were changed.\n');
    else {
      const document = buildStageNineAuthoringCheck(inputs);
      const previewText = formatStageNinePreview(document);
      const saved = await saveAuthorAssistantStageNineCheck({ sessionRoot, existingSession: loaded.session, document, previewText });
      output.write(`\n${previewText}`);
      output.write(`Stage 9 saved: ${saved.documentPath}\n`);
      output.write(`Short preview saved: ${saved.previewPath}\n`);
      output.write('Review the reported result before any correction or acceptance step.\n');
      output.write('Nothing was written to Author, Supabase or AWS. Stage 10 has not started.\n');
    }
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
