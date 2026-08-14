import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cog-3',
  topicId: 'topic-cognito',
  topicTitle: 'Amazon Cognito',
  objectiveCode: 'Security',
  title: 'Cognito Lambda Triggers (Pre-sign up, Post-confirmation, Custom Message customization)',
  status: 'ready',
  plainEnglish: 'Amazon Cognito Lambda Triggers allow you to execute custom AWS Lambda functions at specific stages of the user authentication lifecycle—such as before a user signs up (Pre Sign-up), after email confirmation (Post Confirmation), or when generating authentication emails and SMS codes (Custom Message). The Lambda function receives an event payload from Cognito, performs custom business logic, and returns a response back to Cognito.',
  whyItMatters: 'Default authentication flows cannot handle complex enterprise business logic—such as validating email domain allowlists, auto-verifying user attributes, integrating with legacy CRM systems, or customizing branding on verification emails. Lambda triggers extend Cognito with serverless custom code.',
  workplaceExample: 'A corporate web application attaches a Pre Sign-up Lambda trigger to its Cognito User Pool. When a user tries to register with `user@gmail.com`, the Lambda trigger checks the email domain and rejects registration if the email domain is not on the approved corporate domain list (e.g., `@corporate.com`).',
  examFocus: 'SAA-C03 Lambda Trigger types to recognize:\n- Pre Sign-up: Validate user attributes or block registration from unauthorized email domains.\n- Post Confirmation: Automatically send a welcome email, create a user profile in DynamoDB, or assign default groups after account activation.\n- Custom Message: Dynamically customize email/SMS verification codes and links with corporate branding.\n- Pre Authentication / Post Authentication: Add custom fraud checks or log login IP addresses.',
  keyPoints: [
    'Executes custom AWS Lambda functions at key authentication lifecycle events.',
    'Pre Sign-up: Validates user data or blocks registration based on custom business rules.',
    'Post Confirmation: Provisions user profiles in database or assigns IAM user groups upon confirmation.',
    'Custom Message: Personalizes verification email and SMS challenge messages.',
    'Lambda functions must respond within 5 seconds or Cognito returns a timeout error.'
  ],
  commonMistake: 'Writing slow third-party API calls inside a Pre Sign-up Lambda trigger. If the Lambda execution takes longer than 5 seconds, Cognito times out and blocks user registration.',
  example: 'Pre Sign-up Lambda Event Handler (Node.js):\n`exports.handler = async (event) => {`\n`  const email = event.request.userAttributes.email;`\n`  if (!email.endsWith("@company.com")) { throw new Error("Registration restricted to company domain."); }`\n`  return event;`\n`};`',
  sources: [
    { title: 'Customizing user pool workflows with Lambda triggers', url: 'https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-working-with-lambda-triggers.html' }
  ]
});
