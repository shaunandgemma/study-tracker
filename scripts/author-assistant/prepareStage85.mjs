import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot } from './authorAssistantCore.mjs';
import { DEFAULT_AUTHOR_ASSISTANT_MODEL } from './authorAssistantResearch.mjs';
import {
  formatStageSevenPreview,
  requestStageSevenResourcesChecks,
  saveStageSevenResourcesChecks,
  validateStage85Inputs
} from './authorAssistantResourcesChecks.mjs';

const terminal = createInterface({ input, output });

async function readJson(directory, filename) {
  return JSON.parse(await readFile(path.join(directory, filename), 'utf8'));
}

try {
  output.write('\nAUTHOR ASSISTANT - STEP 85 LOCAL RESOURCES AND CHECKS\n');
  output.write('This prepares only local Author Stage 7 content from the accepted Stages 1-6 package and accepted AWS sources.\n');
  output.write('It does not connect to AWS, Supabase or Author and it does not prepare Stage 8 cleanup.\n');

  const sessionRoot = getDefaultSessionRoot();
  const loaded = await findLatestAuthorAssistantSession(sessionRoot);
  if (!loaded) throw new Error('No saved Author Assistant session was found.');
  if (loaded.stageSevenResourcesChecks) {
    output.write('\nStage 7 resources and checks already exist for this session. No duplicate was created.\n');
    output.write(`Stage 7 file: ${loaded.sessionDirectory}\\author-stage-7-resources-checks.json\n`);
  } else {
    const acceptance = await readJson(loaded.sessionDirectory, 'author-stage-6-acceptance-84d.json');
    const supportRecords = {
      acceptedSources: loaded.acceptedSources,
      blueprint: loaded.blueprint,
      blueprintAcceptance: loaded.blueprintAcceptance,
      sourceAmendment84B: await readJson(loaded.sessionDirectory, 'author-stage-6-source-amendment-84b.json'),
      consistencyCorrection84C: await readJson(loaded.sessionDirectory, 'author-stage-6-consistency-correction-84c.json')
    };
    validateStage85Inputs({ session: loaded.session, acceptedSources: loaded.acceptedSources, blueprint: loaded.blueprint, instructions: loaded.stageSixInstructions, acceptance, supportRecords });
    output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\n`);
    output.write(`Session ID: ${loaded.session.sessionId}\n`);
    output.write('Accepted Stage 6 fingerprint and all five supporting records: verified\n');
    const answer = (await terminal.question('\nPrepare only local Stage 7 Resources and Checks now? (y/N): ')).trim().toLowerCase();
    if (answer !== 'y' && answer !== 'yes') {
      output.write('Step 85 was not run. No files were changed.\n');
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OPENAI_API_KEY is not configured. No Stage 7 request was made.');
      const model = process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL;
      output.write('\nPreparing local Resources and Checks from accepted AWS sources only...\n');
      const document = await requestStageSevenResourcesChecks({
        session: loaded.session,
        acceptedSources: loaded.acceptedSources,
        blueprint: loaded.blueprint,
        instructions: loaded.stageSixInstructions,
        acceptance,
        supportRecords,
        apiKey,
        model
      });
      const previewText = formatStageSevenPreview(document);
      const saved = await saveStageSevenResourcesChecks({ sessionRoot, existingSession: loaded.session, document, previewText });
      output.write(`\n${previewText}`);
      output.write(`Stage 7 saved: ${saved.documentPath}\n`);
      output.write(`Short preview saved: ${saved.previewPath}\n`);
      output.write('Review these local files before continuing. Stage 7 was not accepted automatically.\n');
      output.write('Nothing was written to Author. Stage 8 has not started.\n');
    }
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
