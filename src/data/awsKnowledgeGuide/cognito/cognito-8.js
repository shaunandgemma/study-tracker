import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cognito-8',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Cognito Hosted UI',
  status: 'ready',
  plainEnglish: 'The Cognito Hosted UI (Managed Login) is an out-of-the-box, customizable web sign-in page provided by Amazon Cognito. Once you configure a domain name for your User Pool, Cognito hosts a secure browser sign-in screen that handles user sign-up, sign-in, password resets, MFA prompts, and social/enterprise identity provider buttons without requiring you to write custom frontend login components.',
  whyItMatters: 'Using the Hosted UI accelerates application development and ensures compliance with OAuth 2.0 / OpenID Connect (OIDC) standards. It handles OAuth redirects and authorization code exchanges securely in the browser.',
  workplaceExample: 'A startup launches a new SaaS product. Instead of building custom React sign-in forms, they configure the Cognito Hosted UI. Users click "Sign In", get redirected to `https://auth.mysaas.com/login`, sign in, and are redirected back to `https://app.mysaas.com/callback` with authentication tokens.',
  examFocus: 'SAA-C03 Hosted UI Requirements:\n- Requires configuring a User Pool Domain (Amazon Cognito domain or custom domain with ACM certificate).\n- Requires defining Allowed Callback URLs and Allowed Sign-out URLs in App Client settings.\n- Supports OAuth 2.0 Authorization Code Grant and Implicit Grant flows.',
  keyPoints: [
    'Built-in, fully managed browser sign-in page provided by Cognito.',
    'Requires setting up a User Pool domain name.',
    'Handles sign-up, sign-in, password reset, MFA, and social federation buttons.',
    'Redirects users to registered Callback URLs upon successful authentication.',
    'Complies with OAuth 2.0 and OpenID Connect (OIDC) standards.'
  ],
  commonMistake: 'Registering wildcard callback URLs (e.g., `https://example.com/*`). Cognito requires exact HTTPS callback URLs to prevent OAuth authorization code interception attacks.',
  example: 'Hosted UI Authorization URL:\n`https://my-domain.auth.us-east-1.amazoncognito.com/login?client_id=1h2j3k...&response_type=code&scope=email+openid&redirect_uri=https://myapp.com/callback`',
  sources: [
    { title: 'Authentication with Amazon Cognito user pools', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/authentication.html' }
  ]
});
