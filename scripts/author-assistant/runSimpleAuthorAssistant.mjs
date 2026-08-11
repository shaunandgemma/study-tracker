import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  acceptSimpleHandoff,
  buildAuthorDraftContent,
  buildSimpleHandoff,
  formatSimplePreview,
  requestCompleteFollowAlong,
  saveSimpleHandoff,
  SIMPLE_AUTHOR_ASSISTANT_MODE
} from './authorAssistantSimple.mjs';
import { DEFAULT_AUTHOR_ASSISTANT_MODEL } from './authorAssistantResearch.mjs';
import { loadPublishedFollowAlongCatalogue } from './authorAssistantPublishedCatalogue.mjs';
import { buildBeginnerGoldStandardReference, RDS_GOLD_STANDARD_PROGRAMME_ID } from './authorAssistantBeginnerQuality.mjs';

const terminal = createInterface({ input, output });

async function required(question) {
  while (true) {
    const answer = (await terminal.question(question)).trim();
    if (answer) return answer;
    output.write('Please enter an answer.\n');
  }
}

async function numberedChoice(question, options) {
  output.write(`${question}\n`);
  options.forEach((option, index) => output.write(`${index + 1}. ${option}\n`));
  while (true) {
    const answer = Number((await terminal.question('Select a number: ')).trim());
    if (Number.isInteger(answer) && answer >= 1 && answer <= options.length) return answer - 1;
    output.write(`Choose a number from 1 to ${options.length}.\n`);
  }
}

async function requiredWithDefault(question, defaultValue) {
  const answer = (await terminal.question(`${question} [${defaultValue}]: `)).trim();
  return answer || defaultValue;
}

try {
  output.write('\nAUTHOR ASSISTANT - COMPLETE FOLLOW ALONG\n');
  output.write('One run creates a complete Console and CLI preview from official AWS Docs.\n');
  output.write('A second AI request reviews every task against the complete published RDS Console and CLI standard and rewrites only weak tasks.\n');
  output.write('It performs only a read-only published-list check and does not write to AWS, Supabase or Author. It cannot publish.\n\n');
  const modeIndex = await numberedChoice('What do you want to do?', ['New Follow Along', 'Update Existing Follow Along']);
  let inputs;
  let programmes = null;
  if (modeIndex === 0) {
    inputs = {
      generationMode: SIMPLE_AUTHOR_ASSISTANT_MODE.NEW,
      serviceName: await required('1. Official AWS service name: '),
      shortName: await required('2. Short service name: '),
      learnerLevel: await required('3. Learner level: '),
      buildOutcome: await required('4. What should the learner build? '),
      preferredRegion: await required('5. Preferred AWS Region (or global): ')
    };
  } else {
    output.write('\nLoading updateable Follow Alongs from the controlled published list...\n');
    programmes = await loadPublishedFollowAlongCatalogue();
    const selectedIndex = await numberedChoice('Which Follow Along do you want to update?', programmes.map(item => `${item.displayName} (${item.programmeId}, published revision ${item.sourceRevision})`));
    const selected = programmes[selectedIndex];
    const learnerLevel = selected.runtimeContent?.programme?.difficulty || 'Beginner';
    const preferredRegion = selected.runtimeContent?.programme?.defaultRegion || 'eu-west-2';
    const updateRequest = await required('Describe exactly what should change: ');
    inputs = {
      generationMode: SIMPLE_AUTHOR_ASSISTANT_MODE.UPDATE,
      updateTarget: selected,
      serviceName: selected.serviceName,
      shortName: selected.shortName,
      learnerLevel: await requiredWithDefault('Learner level', learnerLevel),
      buildOutcome: updateRequest,
      updateRequest,
      preferredRegion: await requiredWithDefault('Preferred AWS Region (or global)', preferredRegion)
    };
    output.write(`\nSelected exact update target: ${selected.displayName}\nProgramme ID: ${selected.programmeId}\nBase published revision: ${selected.sourceRevision}\n`);
  }
  const proceed = (await terminal.question('\nGenerate the complete local Follow Along now? (y/N): ')).trim().toLowerCase();
  if (!['y', 'yes'].includes(proceed)) {
    output.write('Nothing was generated or changed.\n');
  } else {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured. No AI request was made.');
    if (!programmes) {
      output.write('\nLoading the complete published RDS Console and CLI Golden Standard...\n');
      programmes = await loadPublishedFollowAlongCatalogue();
    }
    const qualityReference = buildBeginnerGoldStandardReference(programmes.find(item => item.programmeId === RDS_GOLD_STANDARD_PROGRAMME_ID));
    output.write(`Using the complete Console and CLI content from ${qualityReference.displayName}, published revision ${qualityReference.sourceRevision}, as the Golden Standard.\n`);
    output.write('\nResearching official AWS Docs and preparing Console, CLI, checks and cleanup...\n');
    const proposal = await requestCompleteFollowAlong({
      inputs,
      apiKey,
      qualityReference,
      model: process.env.AUTHOR_ASSISTANT_MODEL || DEFAULT_AUTHOR_ASSISTANT_MODEL,
      onProgress: message => output.write(`${message}\n`)
    });
    const { content } = buildAuthorDraftContent(inputs, proposal);
    const { session, handoffPackage } = buildSimpleHandoff({ inputs, proposal, authorDraftContent: content });
    const previewText = formatSimplePreview(handoffPackage);
    const files = await saveSimpleHandoff({ session, handoffPackage, previewText });
    output.write(`\n${previewText}`);
    output.write(`Preview saved: ${files.previewPath}\n`);
    output.write(`Package saved: ${files.packagePath}\n`);
    const accept = (await terminal.question('\nAccept this complete preview for controlled Author import? (y/N): ')).trim().toLowerCase();
    if (['y', 'yes'].includes(accept)) {
      const acceptance = acceptSimpleHandoff(session, handoffPackage);
      await saveSimpleHandoff({ session, handoffPackage, acceptance, previewText });
      output.write(`Acceptance file saved: ${files.acceptancePath}\n`);
      output.write('\nUse the package and acceptance files in the signed-in Author import panel.\n');
    } else {
      output.write('\nPreview saved but not accepted. Do not import it yet.\n');
    }
    output.write('Nothing was written to Author, Supabase or AWS. No commands were executed.\n');
  }
} catch (error) {
  output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`);
  process.exitCode = 1;
} finally {
  terminal.close();
}
