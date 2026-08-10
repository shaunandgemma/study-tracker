import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  AUTHOR_ASSISTANT_LEARNER_LEVELS,
  buildAuthorAssistantSession,
  buildAwsResearchRequest,
  findLatestAuthorAssistantSession,
  getDefaultSessionRoot,
  saveAuthorAssistantAcceptedSources,
  saveAuthorAssistantBlueprint,
  saveAuthorAssistantStageSixInstructions,
  saveAuthorAssistantStageSixRevision,
  saveAuthorAssistantStage84BRevision,
  saveAuthorAssistantResearchResult,
  saveAuthorAssistantSession,
  validateAuthorAssistantInput
} from './authorAssistantCore.mjs';
import {
  formatBlueprintPreview,
  requestStagesOneToFiveBlueprint
} from './authorAssistantBlueprint.mjs';
import {
  formatStageSixPreview,
  requestStageSixInstructions
} from './authorAssistantInstructions.mjs';
import {
  buildAcceptedSourcesDocument,
  DEFAULT_AUTHOR_ASSISTANT_MODEL,
  requestAwsDocumentationResearch
} from './authorAssistantResearch.mjs';
import {
  formatStage84APendingSources,
  loadApprovedStage84AAlignment
} from './authorAssistantStage84A.mjs';
import {
  buildStage84BAmendedInputs,
  formatStage84BSourceDecision,
  loadApprovedStage84BAmendment
} from './authorAssistantStage84B.mjs';

const sessionRoot = getDefaultSessionRoot();
const terminal = createInterface({ input, output });

async function askRequired(question) {
  while (true) {
    const answer = (await terminal.question(question)).trim();
    if (answer) return answer;
    output.write('Please enter an answer.\n');
  }
}

async function offerResume() {
  const latest = await findLatestAuthorAssistantSession(sessionRoot);
  if (!latest) return null;

  output.write(`\nSaved session found for ${latest.session.inputs.serviceName}.\n`);
  const answer = (await terminal.question('Resume this session? (Y/n): ')).trim().toLowerCase();
  if (answer && answer !== 'y' && answer !== 'yes') return null;

  output.write('\nSession resumed safely. No duplicate was created.\n');
  output.write(`Session ID: ${latest.session.sessionId}\n`);
  output.write(`Research request: ${latest.sessionDirectory}\\research-request.json\n`);
  return latest;
}

async function collectInput() {
  while (true) {
    const answers = {
      serviceName: await askRequired('1. Official AWS service name: '),
      shortName: await askRequired('2. Short service name: '),
      learnerLevel: await askRequired(`3. Learner level (${AUTHOR_ASSISTANT_LEARNER_LEVELS.join('/')}): `),
      buildOutcome: await askRequired('4. What should the learner build? '),
      preferredRegion: await askRequired('5. Preferred AWS Region (or global): ')
    };
    const checked = validateAuthorAssistantInput(answers);
    if (checked.valid) return checked.input;
    output.write(`\nPlease correct these answers:\n- ${checked.errors.join('\n- ')}\n\n`);
  }
}

async function acceptProposedSources(researchResult) {
  output.write(`\nResearch summary:\n${researchResult.summary}\n`);
  if (researchResult.manualReviewFindings.length) {
    output.write(`\nManual review findings:\n- ${researchResult.manualReviewFindings.join('\n- ')}\n`);
  }

  const acceptedUrls = [];
  for (let index = 0; index < researchResult.proposedSources.length; index += 1) {
    const source = researchResult.proposedSources[index];
    output.write(`\n${index + 1}. ${source.documentTitle}\n`);
    output.write(`Type: ${source.sourceType}\n`);
    output.write(`URL: ${source.url}\n`);
    output.write(`Why: ${source.whyThisSourceApplies}\n`);
    const answer = (await terminal.question('Keep this source? (Y/n): ')).trim().toLowerCase();
    if (!answer || answer === 'y' || answer === 'yes') acceptedUrls.push(source.url);
  }
  return acceptedUrls;
}

async function continueReadOnlyResearch(loaded) {
  if (loaded.acceptedSources?.status === 'accepted') {
    output.write('\nAWS documentation sources have already been accepted for this session.\n');
    output.write(`Accepted sources: ${loaded.sessionDirectory}\\accepted-sources.json\n`);
    output.write('No Author draft changes have been made.\n');
    return loaded;
  }

  let researchResult = loaded.researchResult;
  let session = loaded.session;
  if (!researchResult) {
    const begin = (await terminal.question('\nStart read-only AWS Docs research now? (y/N): ')).trim().toLowerCase();
    if (begin !== 'y' && begin !== 'yes') {
      output.write('Research was not started. Your session remains saved.\n');
      return loaded;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      output.write('\nOPENAI_API_KEY is not configured. No AI request was made.\n');
      output.write('Keep the key outside the browser and run this command again after it is configured.\n');
      return loaded;
    }

    const model = process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL;
    output.write('\nSearching only official AWS documentation...\n');
    researchResult = await requestAwsDocumentationResearch({
      researchRequest: loaded.researchRequest,
      apiKey,
      model
    });
    const savedResearch = await saveAuthorAssistantResearchResult({ sessionRoot, session, researchResult });
    session = savedResearch.session;
    output.write(`Research result saved: ${savedResearch.researchResultPath}\n`);
  } else {
    output.write('\nResuming the saved source review. No new AI request was made.\n');
  }

  const acceptedUrls = await acceptProposedSources(researchResult);
  const acceptedSources = buildAcceptedSourcesDocument(researchResult, acceptedUrls);
  const savedAcceptance = await saveAuthorAssistantAcceptedSources({ sessionRoot, session, acceptedSources });
  output.write(`\nAccepted ${acceptedSources.sources.length} of ${researchResult.proposedSources.length} sources.\n`);
  output.write(`Source decision saved: ${savedAcceptance.acceptedSourcesPath}\n`);
  output.write('No Author draft changes have been made.\n');
  return {
    ...loaded,
    session: savedAcceptance.session,
    researchResult,
    acceptedSources
  };
}

async function continueLocalBlueprint(loaded) {
  if (loaded.blueprint) {
    const accepted = loaded.blueprint.status === 'human_accepted' && loaded.blueprintAcceptance?.status === 'accepted';
    output.write(accepted
      ? '\nThe local Author Stages 1-5 blueprint has been human accepted.\n'
      : '\nA local Author Stages 1-5 blueprint already exists and is waiting for human review.\n');
    output.write(`Blueprint: ${loaded.sessionDirectory}\\author-stages-1-5-blueprint.json\n`);
    output.write(`Short preview: ${loaded.sessionDirectory}\\author-stages-1-5-blueprint.txt\n`);
    if (accepted) output.write(`Acceptance record: ${loaded.sessionDirectory}\\author-stages-1-5-acceptance.json\n`);
    output.write('Nothing was written to Author. Stage 6 has not started.\n');
    return loaded;
  }
  if (loaded.acceptedSources?.status !== 'accepted') return loaded;

  const begin = (await terminal.question('\nPrepare a local Author Stages 1-5 blueprint now? (y/N): ')).trim().toLowerCase();
  if (begin !== 'y' && begin !== 'yes') {
    output.write('The blueprint was not prepared. Accepted sources remain saved.\n');
    return loaded;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    output.write('\nOPENAI_API_KEY is not configured. No blueprint request was made.\n');
    return loaded;
  }
  const model = process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL;
  output.write('\nPreparing a service-independent local blueprint from accepted sources only...\n');
  const blueprint = await requestStagesOneToFiveBlueprint({
    session: loaded.session,
    acceptedSources: loaded.acceptedSources,
    apiKey,
    model
  });
  const previewText = formatBlueprintPreview(blueprint);
  const saved = await saveAuthorAssistantBlueprint({
    sessionRoot,
    session: loaded.session,
    blueprint,
    previewText
  });
  output.write(`\n${previewText}`);
  output.write(`Blueprint saved: ${saved.blueprintPath}\n`);
  output.write(`Short preview saved: ${saved.previewPath}\n`);
  output.write('Review these local files before continuing. Nothing was written to Author.\n');
  output.write('Stage 6 has not started.\n');
  return { ...loaded, session: saved.session, blueprint };
}

async function continueLocalStageSix(loaded) {
  if (loaded.stageSixInstructions) {
    const amendment84B = await loadApprovedStage84BAmendment({
      session: loaded.session,
      acceptedSources: loaded.acceptedSources,
      blueprint: loaded.blueprint,
      existingInstructions: loaded.stageSixInstructions
    });
    if (amendment84B) {
      output.write(`\n${formatStage84BSourceDecision(amendment84B)}\n`);
      const beginRevision = (await terminal.question('\nApply the approved Step 84B source amendment and regenerate only task 1 now? (y/N): ')).trim().toLowerCase();
      if (beginRevision !== 'y' && beginRevision !== 'yes') {
        output.write('Step 84B was not applied. The saved source and instruction files remain unchanged.\n');
        output.write('Nothing was written to Author. Stage 7 has not started.\n');
        return loaded;
      }
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        output.write('\nOPENAI_API_KEY is not configured. No Step 84B request was made.\n');
        return loaded;
      }
      const model = process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL;
      const amended = buildStage84BAmendedInputs({
        acceptedSources: loaded.acceptedSources,
        blueprint: loaded.blueprint,
        amendment: amendment84B
      });
      output.write('\nPreparing only the safe-scope/access task from the two newly approved AWS sources...\n');
      const instructions = await requestStageSixInstructions({
        session: loaded.session,
        acceptedSources: amended.acceptedSources,
        blueprint: amended.blueprint,
        existingInstructions: loaded.stageSixInstructions,
        alignment: amendment84B,
        apiKey,
        model
      });
      const previewText = formatStageSixPreview(instructions);
      const saved = await saveAuthorAssistantStage84BRevision({
        sessionRoot,
        session: loaded.session,
        existingAcceptedSources: loaded.acceptedSources,
        amendedAcceptedSources: amended.acceptedSources,
        existingBlueprint: loaded.blueprint,
        amendedBlueprint: amended.blueprint,
        existingInstructions: loaded.stageSixInstructions,
        revisedInstructions: instructions,
        amendment: amendment84B,
        previewText
      });
      output.write(`\n${previewText}`);
      output.write(`Accepted sources saved: ${saved.acceptedSourcesPath}\n`);
      output.write(`Amended blueprint saved: ${saved.blueprintPath}\n`);
      output.write(`Revised instructions saved: ${saved.instructionsPath}\n`);
      output.write(`Source amendment audit saved: ${saved.auditPath}\n`);
      output.write('The five previously prepared tasks were preserved exactly.\n');
      output.write('No IAM policy was created or recommended.\n');
      output.write('Nothing was written to Author. Stage 7 has not started.\n');
      return { ...loaded, session: saved.session, acceptedSources: amended.acceptedSources, blueprint: amended.blueprint, stageSixInstructions: instructions };
    }
    const alignment = await loadApprovedStage84AAlignment({
      session: loaded.session,
      blueprint: loaded.blueprint,
      existingInstructions: loaded.stageSixInstructions
    });
    if (alignment) {
      output.write(`\n${formatStage84APendingSources(alignment)}\n`);
      output.write('\nThese source candidates have not been accepted or used.\n');
      const beginRevision = (await terminal.question('\nApply the approved Step 84A correction to only the three affected local SQS tasks now? (y/N): ')).trim().toLowerCase();
      if (beginRevision !== 'y' && beginRevision !== 'yes') {
        output.write('Step 84A was not applied. The existing local Stage 6 file remains unchanged.\n');
        output.write('Nothing was written to Author. Stage 7 has not started.\n');
        return loaded;
      }
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        output.write('\nOPENAI_API_KEY is not configured. No Step 84A request was made.\n');
        return loaded;
      }
      const model = process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL;
      output.write('\nRepreparing only the three affected local SQS tasks from already accepted AWS sources...\n');
      const instructions = await requestStageSixInstructions({
        session: loaded.session,
        acceptedSources: loaded.acceptedSources,
        blueprint: loaded.blueprint,
        existingInstructions: loaded.stageSixInstructions,
        alignment,
        apiKey,
        model
      });
      const previewText = formatStageSixPreview(instructions);
      const saved = await saveAuthorAssistantStageSixRevision({
        sessionRoot,
        session: loaded.session,
        existingInstructions: loaded.stageSixInstructions,
        revisedInstructions: instructions,
        previewText
      });
      output.write(`\n${previewText}`);
      output.write(`Revised instructions saved: ${saved.instructionsPath}\n`);
      output.write(`Revised short preview saved: ${saved.previewPath}\n`);
      output.write('The two previously prepared tasks were preserved exactly.\n');
      output.write('Pending source candidates remain unaccepted and unused.\n');
      output.write('Nothing was written to Author. Stage 7 has not started.\n');
      return { ...loaded, session: saved.session, stageSixInstructions: instructions };
    }
    output.write('\nLocal Author Stage 6 instructions already exist for this session.\n');
    output.write(`Instructions: ${loaded.sessionDirectory}\\author-stage-6-instructions.json\n`);
    output.write(`Short preview: ${loaded.sessionDirectory}\\author-stage-6-instructions.txt\n`);
    output.write('Nothing was written to Author. Stage 7 has not started.\n');
    return loaded;
  }
  if (loaded.blueprint?.status !== 'human_accepted' || loaded.blueprintAcceptance?.status !== 'accepted') return loaded;

  const begin = (await terminal.question('\nPrepare local Author Stage 6 checkbox instructions now? (y/N): ')).trim().toLowerCase();
  if (begin !== 'y' && begin !== 'yes') {
    output.write('Stage 6 was not prepared. The accepted blueprint remains saved.\n');
    return loaded;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    output.write('\nOPENAI_API_KEY is not configured. No Stage 6 request was made.\n');
    return loaded;
  }
  const model = process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL;
  output.write('\nPreparing separate editable checkbox instructions from accepted AWS sources only...\n');
  const instructions = await requestStageSixInstructions({
    session: loaded.session,
    acceptedSources: loaded.acceptedSources,
    blueprint: loaded.blueprint,
    apiKey,
    model
  });
  const previewText = formatStageSixPreview(instructions);
  const saved = await saveAuthorAssistantStageSixInstructions({
    sessionRoot,
    session: loaded.session,
    instructions,
    previewText
  });
  output.write(`\n${previewText}`);
  output.write(`Instructions saved: ${saved.instructionsPath}\n`);
  output.write(`Short preview saved: ${saved.previewPath}\n`);
  output.write('Review these local files before continuing. Nothing was written to Author.\n');
  output.write('Stage 7 has not started.\n');
  return { ...loaded, session: saved.session, stageSixInstructions: instructions };
}

try {
  output.write('\nAUTHOR ASSISTANT - STEPS 80 TO 84B\n');
  output.write('This version researches official AWS documentation and prepares local Author Stages 1-6 content.\n');
  output.write('It does not connect to AWS, Supabase, approval or publishing.\n');

  let loaded = await offerResume();
  if (!loaded) {
    const answers = await collectInput();
    const session = buildAuthorAssistantSession(answers);
    const researchRequest = buildAwsResearchRequest(session);
    const saved = await saveAuthorAssistantSession({ sessionRoot, session, researchRequest });
    loaded = { session, researchRequest, researchResult: null, acceptedSources: null, sessionDirectory: saved.sessionDirectory };

    output.write('\nStep 80 completed safely.\n');
    output.write(`Session ID: ${session.sessionId}\n`);
    output.write(`Research request: ${saved.researchRequestPath}\n`);
    output.write('AI research has not started. Author stages have not been changed.\n');
  }
  loaded = await continueReadOnlyResearch(loaded);
  loaded = await continueLocalBlueprint(loaded);
  await continueLocalStageSix(loaded);
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
