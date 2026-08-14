import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-11',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Password Policies',
  status: 'ready',
  plainEnglish: 'Cognito Password Policies enforce security rules on user passwords created in a User Pool. You can set minimum password length (between 6 and 99 characters) and require combinations of uppercase letters, lowercase letters, numbers, and special characters. You can also specify temporary password expiration times for admin-created users.',
  whyItMatters: 'Weak passwords (like `123456` or `password`) are easily cracked by automated brute-force scripts. Enforcing robust password complexity requirements protects user accounts from unauthorized access.',
  workplaceExample: 'An enterprise security team configures its User Pool password policy: Minimum length 12 characters, requiring at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol (`!@#$%^&*`). User registration attempts with weak passwords are automatically rejected by Cognito.',
  examFocus: 'SAA-C03 Password Policy parameters:\n- Minimum length: 6 to 99 characters.\n- Character requirements: Require Uppercase, Require Lowercase, Require Numbers, Require Symbols.\n- Temporary password validity period: Configurable in days (default 7 days).\n- Advanced Security Features: Adds compromised credential checking and adaptive risk-based authentication.',
  keyPoints: [
    'Enforces minimum length (6-99 characters) and character complexity rules.',
    'Protects accounts against brute-force and dictionary attacks.',
    'Configures temporary password expiration windows for new users.',
    'Integrates with Advanced Security Features for compromised credential detection.',
    'Evaluated automatically by Cognito during user sign-up and password reset.'
  ],
  commonMistake: 'Relying solely on frontend Javascript password checks without configuring Cognito Password Policies. Clients can bypass frontend validation, so Cognito server-side policies are mandatory.',
  example: 'User Pool Password Policy Config:\n`PasswordPolicy: { MinimumLength: 12, RequireUppercase: true, RequireLowercase: true, RequireNumbers: true, RequireSymbols: true, TemporaryPasswordValidityDays: 3 }`',
  sources: [
    { title: 'Adding user pool password requirements', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-policies.html' }
  ]
});
