import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { findLatestAuthorAssistantSession, getDefaultSessionRoot, saveAuthorAssistantStage89AAcceptance } from './authorAssistantCore.mjs';
import { buildStage89ALocalAcceptance, verifyStage89AAcceptanceFingerprint } from './authorAssistantStage89A.mjs';

const terminal = createInterface({ input, output }); const readJson = (directory, filename) => readFile(path.join(directory, filename), 'utf8').then(JSON.parse);
try {
  output.write('\nAUTHOR ASSISTANT - STEP 89A LOCAL STAGE 11 ACCEPTANCE\nThis command does not use AI or require an API key.\nIt accepts only the passed local Stage 11 review and does not begin Stage 12.\n');
  const sessionRoot = getDefaultSessionRoot(); const loaded = await findLatestAuthorAssistantSession(sessionRoot); if (!loaded) throw new Error('No saved Author Assistant session was found.');
  const accepted = buildStage89ALocalAcceptance({ session: loaded.session, stageTen: loaded.stageTenLearnerPreview, stageTenAcceptance: await readJson(loaded.sessionDirectory, 'author-stage-10-acceptance-88b.json'), stageEleven: loaded.stageElevenStructuredReview, correctionAudit: await readJson(loaded.sessionDirectory, 'author-stage-10-correction-88a.json') });
  if (!verifyStage89AAcceptanceFingerprint(accepted.stageEleven, accepted.acceptance)) throw new Error('The Stage 11 fingerprint could not be verified.');
  output.write(`\nSaved session: ${loaded.session.inputs.serviceName}\nPlanning, content and structured review: passed\nReview state: ${accepted.acceptance.reviewStatus}\nApproval decision: ${accepted.acceptance.approvalDecision}\nOpen blocking findings: 0\nOpen advisory findings: 1\nResolved findings: ${accepted.acceptance.resolvedFindingCount}\nSHA-256 fingerprint: ${accepted.acceptance.stageElevenFingerprint.value}\n`);
  const answer = (await terminal.question('\nAccept the complete passed local Stage 11 Structured Review now? (y/N): ')).trim().toLowerCase();
  if (answer !== 'y' && answer !== 'yes') output.write('Step 89A was not applied. No files were changed.\n');
  else { const saved = await saveAuthorAssistantStage89AAcceptance({ sessionRoot, existingSession: loaded.session, acceptedSession: accepted.session, existingStageEleven: loaded.stageElevenStructuredReview, acceptedStageEleven: accepted.stageEleven, acceptance: accepted.acceptance }); output.write(`\nStep 89A completed locally.\nAccepted Stage 11 review: ${saved.stageElevenPath}\nAcceptance audit: ${saved.acceptancePath}\nVerified fingerprint: ${accepted.acceptance.stageElevenFingerprint.value}\nNothing was written to Author, Supabase or AWS. Stage 12 has not started.\n`); }
} catch (error) { output.write(`\nAuthor Assistant stopped safely: ${error?.message || 'Unknown error'}\n`); process.exitCode = 1; } finally { terminal.close(); }
