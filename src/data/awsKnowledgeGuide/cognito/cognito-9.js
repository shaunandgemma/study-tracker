import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-9',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'User Sign-Up and Sign-In',
  status: 'ready',
  plainEnglish: 'User Sign-Up and Sign-In are the core workflow processes in Cognito User Pools:\n- Sign-Up: Registers a new user account by accepting attributes (email, phone, password), creating the user record in an UNCONFIRMED state, and sending a verification code via email or SMS.\n- Confirmation: Verifies ownership of the email/phone using the verification code, transitioning the account status to CONFIRMED.\n- Sign-In: Authenticates the confirmed user and returns JWT tokens upon success.',
  whyItMatters: 'Structuring registration, email verification, and authentication into distinct, managed API steps ensures that unauthorized or unverified users cannot gain access to application resources.',
  workplaceExample: 'A customer signs up on a retail website. Cognito sends a 6-digit confirmation code to their email. Until the customer enters the code, their account status remains UNCONFIRMED and sign-in attempts are rejected.',
  examFocus: 'SAA-C03 Sign-Up & Sign-In rules:\n- Unconfirmed users CANNOT sign in until confirmed via email/SMS code or admin confirmation (`AdminConfirmSignUp`).\n- Sign-in supports multiple authentication flows (USER_SRP_AUTH, REFRESH_TOKEN_AUTH, CUSTOM_AUTH).\n- Lambda triggers (Pre Sign-up, Post Confirmation) can alter or automate user confirmation.',
  keyPoints: [
    'Sign-up creates a user account in UNCONFIRMED state.',
    'Confirmation via email/SMS code or admin action transitions user to CONFIRMED.',
    'Sign-in validates credentials and returns JWT tokens for confirmed users.',
    'Supports custom attributes (e.g., department, membership_tier).',
    'Supports self-service account recovery and password reset flows.'
  ],
  commonMistake: 'Assuming a user can sign in immediately after calling `signUp`. Unless auto-verification or admin confirmation is configured, the user remains UNCONFIRMED and sign-in will fail.',
  example: 'Confirming Sign-Up via AWS CLI:\n`aws cognito-idp confirm-sign-up --client-id 1h2j3k... --username user@example.com --confirmation-code 123456`',
  sources: [
    { title: 'Authentication with Amazon Cognito user pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/authentication.html' }
  ]
});
