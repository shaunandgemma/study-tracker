import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-8",
  "title": "Rotation with AWS Lambda",
  "plainEnglish": "For Lambda-based rotation, Secrets Manager invokes the same rotation function for four logical steps. createSecret prepares an AWSPENDING version, setSecret changes the credential in the protected system, testSecret proves the pending value works, and finishSecret moves AWSCURRENT to the tested version.",
  "whyItMatters": "The four-step contract prevents an untested value from becoming the credential applications use. Because AWS can retry steps, each handler must be idempotent—repeating it with the same rotation token must lead to the same safe result rather than another unrelated change.",
  "workplaceExample": "A team rotates a credential for a private vendor appliance with a custom function. The function reads only the named secret, reaches the appliance through controlled networking, changes the account password, performs a harmless authenticated health check, and promotes the version only after that check succeeds.",
  "examFocus": "Memorize the purpose and order of createSecret, setSecret, testSecret, and finishSecret. AWSPENDING identifies the in-progress version; finishSecret moves AWSCURRENT and Secrets Manager assigns AWSPREVIOUS to the former current version.",
  "keyPoints": [
    "Secrets Manager passes a step name, secret identifier, and client request token to the rotation function.",
    "createSecret safely creates or reuses the token's AWSPENDING version.",
    "setSecret updates the database or external service to match the pending value.",
    "testSecret authenticates with AWSPENDING and performs an appropriate low-risk test.",
    "finishSecret promotes the tested version by moving the AWSCURRENT staging label.",
    "The function role, Lambda resource policy, KMS permissions, and network path all need least-privilege configuration."
  ],
  "commonMistake": "A rotation handler that creates a different password every time a retried step runs is not idempotent. Use the client request token as the version ID, detect completed work, and never log either current or pending values while debugging.",
  "example": "Start with the documented template closest to the test system, restrict the execution role, configure VPC access if required, implement all four idempotent stages, simulate a retry at each stage, confirm failed tests do not move AWSCURRENT, and monitor function and rotation errors without logging values.",
  "sources": [
    {
      "title": "Lambda rotation functions",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_lambda-functions.html"
    },
    {
      "title": "Rotation by Lambda function",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_lambda.html"
    }
  ]
});
