const STORAGE_KEY = 'exampulse_troubleshooting_progress_v1';

export const createEmptyTroubleshootingProgress = () => ({
  observations: '',
  hypothesis: '',
  actions: '',
  pinnedEvidence: [],
  revealedHints: 0,
  answers: {},
  completed: false,
  solutionRevealed: false,
  score: null,
  updatedAt: null
});

export function loadTroubleshootingProgress() {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveTroubleshootingProgress(progress) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function calculateTroubleshootingScore(revealedHints = 0, solutionRevealed = false) {
  if (solutionRevealed) return 0;
  return Math.max(70, 100 - (Math.max(0, revealedHints) * 10));
}

export function buildRcaReport(challenge, progress) {
  const pinned = challenge.evidence
    .filter(item => progress.pinnedEvidence.includes(item.id))
    .map(item => `- ${item.title}`)
    .join('\n') || '- None recorded';

  return [
    `INCIDENT REPORT: ${challenge.title}`,
    '',
    'Scenario',
    challenge.scenario,
    '',
    'Evidence retained',
    pinned,
    '',
    'Observations',
    progress.observations || 'Not recorded',
    '',
    'Working hypothesis',
    progress.hypothesis || 'Not recorded',
    '',
    'Actions taken',
    progress.actions || 'Not recorded',
    '',
    'Outcome',
    progress.completed ? `Diagnosis validated. Score: ${progress.score}/100.` : 'Investigation still in progress.',
    '',
    'Root cause',
    progress.completed || progress.solutionRevealed ? challenge.solution.rootCause : 'Complete the diagnosis to reveal.',
    '',
    'Resolution',
    progress.completed || progress.solutionRevealed ? challenge.solution.fix : 'Complete the diagnosis to reveal.',
    '',
    'Prevention',
    progress.completed || progress.solutionRevealed ? challenge.solution.prevention : 'Complete the diagnosis to reveal.'
  ].join('\n');
}

export { STORAGE_KEY as TROUBLESHOOTING_PROGRESS_STORAGE_KEY };
