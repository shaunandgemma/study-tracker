import terraformSyntaxValidation from './terraform/terraformSyntaxValidation.js';
import terraformUnwantedReplacement from './terraform/terraformUnwantedReplacement.js';
import terraformStateDrift from './terraform/terraformStateDrift.js';
import privateSubnetConnectivity from './aws/privateSubnetConnectivity.js';
import albUnhealthyTargets from './aws/albUnhealthyTargets.js';
import iamAccessDenied from './aws/iamAccessDenied.js';

export const TROUBLESHOOTING_CHALLENGES = Object.freeze([
  terraformSyntaxValidation,
  terraformUnwantedReplacement,
  terraformStateDrift,
  privateSubnetConnectivity,
  albUnhealthyTargets,
  iamAccessDenied
]);

export const getTroubleshootingChallengesForExam = examId => TROUBLESHOOTING_CHALLENGES
  .filter(challenge => challenge.examId === examId)
  .sort((left, right) => left.order - right.order);

export const getTroubleshootingChallenge = challengeId => (
  TROUBLESHOOTING_CHALLENGES.find(challenge => challenge.id === challengeId) || null
);
