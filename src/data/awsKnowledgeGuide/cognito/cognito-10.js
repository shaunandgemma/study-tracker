import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-10',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Multi-Factor Authentication',
  status: 'ready',
  plainEnglish: 'Amazon Cognito Multi-Factor Authentication (MFA) adds a second layer of security to user sign-in by requiring a secondary verification factor in addition to a password. Cognito supports two MFA methods:\n1. Time-based One-Time Password (TOTP): Authenticator apps such as Google Authenticator, Authy, or 1Password.\n2. SMS Text Message: Sending a 6-digit passcode to the user\'s verified phone number via Amazon SNS.',
  whyItMatters: 'Passwords alone are vulnerable to phishing, credential stuffing, and dictionary attacks. MFA drastically reduces account compromise risks by requiring physical possession of a mobile device or authenticator app.',
  workplaceExample: 'A healthcare portal configures Cognito User Pools with Required MFA. When a doctor logs in with their password, Cognito prompts for a 6-digit TOTP code from their Google Authenticator app before issuing JWT tokens.',
  examFocus: 'SAA-C03 MFA Configuration modes:\n- OFF: MFA is disabled.\n- OPTIONAL: Users can choose whether to enable MFA on their individual profiles.\n- REQUIRED: All users MUST configure and use MFA to sign in.\n- Supported factors: TOTP software tokens and SMS text messages.',
  keyPoints: [
    'Provides multi-factor authentication for enhanced account security.',
    'Supports TOTP authenticator apps (Google Authenticator, Authy) and SMS text messages.',
    'MFA modes: OFF, OPTIONAL, or REQUIRED for all users.',
    'Uses Amazon SNS under the hood for SMS message delivery.',
    'Required for strict regulatory compliance (PCI-DSS, HIPAA, SOC 2).'
  ],
  commonMistake: 'Configuring SMS MFA without allocating sufficient Amazon SNS spending limits for international SMS delivery, causing MFA SMS messages to fail during peak user sign-ins.',
  example: 'MFA Challenge Response during Sign-In:\n`ChallengeName: "SOFTWARE_TOKEN_MFA"`\n`ChallengeResponses: { "USERNAME": "doctor1", "SOFTWARE_TOKEN_MFA_CODE": "654321" }`',
  sources: [
    { title: 'Adding multi-factor authentication (MFA) to a user pool', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-mfa.html' }
  ]
});
