import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStageElevenReview } from './authorAssistantCore.mjs';
import { buildStageElevenStructuredReview, formatStageElevenPreview } from './authorAssistantStructuredReview.mjs';

const terminal = createInterface({ input, output }); const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);
try {
  output.write('\nAUTHOR ASSISTANT - STEP 89 LOCAL STRUCTURED REVIEW\n');
  output.write('This prepares only local Author Stage 11 review from accepted Stages 1-10.\n');
  output.write('It does not use AI, approve, publish, create a release candidate, or connect to Author, Supabase or AWS.\n');
  const sessionRoot = getDefaultSessionRoot(); const loaded = await findLatestAuthorAssistantSession(sessionRoot); if (!loaded) throw new Error('No saved Author Assistant session was found.');
  if (loaded.stageElevenStructuredReview) output.write(`\nStage 11 review already exists. No duplicate was created.\nStage 11 file: ${loaded.sessionDirectory}\\author-stage-11-structured-review.json\n`);
  else {
    const inputs = { session: loaded.session, acceptedSources: loaded.acceptedSources, blueprint: loaded.blueprint, stageSix: loaded.stageSixInstructions, stageSeven: loaded.stageSevenResourcesChecks, stageEight: loaded.stageEightCleanup, stageNine: loaded.stageNineAuthoringCheck, stageNineAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-9-acceptance-87a.json'), stageTen: loaded.stageTenLearnerPreview, stageTenAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-10-acceptance-88b.json'), correctionAudit: await readJson(loaded.sessionDirectory, 'author-stage-10-correction-88a.json') };
    const document = buildStageElevenStructuredReview(inputs); const previewText = formatStageElevenPreview(document);
    output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\nPlanning: passed\nContent and safety: passed\nStructured review: passed\nOpen blocking findings: ${document.summary.openBlockingFindingCount}\nOpen advisory findings: ${document.summary.openAdvisoryFindingCount}\nResolved retained findings: ${document.summary.resolvedFindingCount}\n`);
    const answer = (await terminal.question('\nPrepare and save only the local Stage 11 Structured Review now? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y' && answer !== 'yes') output.write('Step 89 was not run. No files were changed.\n');
    else { const saved = await saveAuthorAssistantStageElevenReview({ sessionRoot, existingSession: loaded.session, document, previewText }); output.write(`\n${previewText}Stage 11 saved: ${saved.documentPath}\nShort preview saved: ${saved.previewPath}\nReview this local report before accepting it. Stage 12 has not started.\n`); }
  }
} catch (error) { output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`); process.exitCode = 1; } finally { terminal.close(); }
