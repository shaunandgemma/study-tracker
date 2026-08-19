import registeredTroubleshootingChallenges from './generatedChallengeCatalogue.js';

export const TROUBLESHOOTING_CHALLENGES = registeredTroubleshootingChallenges;

export const getTroubleshootingChallengesForExam = examId => TROUBLESHOOTING_CHALLENGES
  .filter(challenge => challenge.examId === examId)
  .sort((left, right) => left.order - right.order);

export const getTroubleshootingChallenge = challengeId => (
  TROUBLESHOOTING_CHALLENGES.find(challenge => challenge.id === challengeId) || null
);
