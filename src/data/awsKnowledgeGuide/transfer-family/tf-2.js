import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-2",
  "topicId": "topic-transfer-family",
  "topicTitle": "AWS Transfer Family",
  "objectiveCode": "Management",
  "title": "Authentication Integration with Active Directory, Cognito, or Custom IdP",
  "status": "ready",
  "plainEnglish": "A Transfer Family server can authenticate against AWS Directory Service or a custom identity provider (IdP), depending on the protocol. A custom IdP is reached through AWS Lambda directly or through an Amazon API Gateway method backed by Lambda. Amazon Cognito can participate behind this custom integration; it is not selected as a native Transfer Family server identity-provider type.",
  "whyItMatters": "Integration lets employees or partners keep an existing identity source while Transfer Family receives the authorization details needed for the session. Authentication answers who the user is; the returned IAM role, optional session policy, home directory, logical mappings, and EFS POSIX profile determine what that user can access.",
  "workplaceExample": "A company validates SFTP passwords against an Amazon Cognito user pool through a reviewed Lambda custom IdP. After successful authentication, the function returns a narrowly scoped role and a logical home for that customer. A failed password returns no access, and a valid password never grants a broader prefix than the customer's approved location.",
  "examFocus": "Service-managed identities, AWS Directory Service, and custom IdPs are distinct options with different protocol and authentication support. AWS Managed Microsoft AD can support password authentication for SFTP, FTPS, and FTP; custom Lambda or API Gateway integrations can implement supported password or SFTP key flows. IAM users do not directly sign in as Transfer Family file-transfer users.",
  "keyPoints": [
    "AWS Directory Service integration uses supported directory credentials and delegated-access groups rather than Transfer Family service-managed SSH keys.",
    "A custom IdP can call an existing directory or user store through Lambda, or through an IAM-protected API Gateway method backed by Lambda.",
    "The custom IdP response must return the authorization properties required by the chosen S3 or EFS session.",
    "Amazon Cognito support is implemented through the Transfer Family custom IdP solution or another validated Lambda integration.",
    "SFTP custom IdPs can support key, password, or configured combined authentication flows; protocol compatibility must be checked.",
    "Transfer Family needs permission to invoke the Lambda function or API, but that invocation permission does not grant storage access.",
    "Never log supplied passwords, private keys, tokens, or full authorization responses containing sensitive customer paths."
  ],
  "commonMistake": "Do not treat successful directory or Cognito authentication as storage authorization. Validate the returned role, policy, home-directory mapping, and POSIX profile independently, and fail closed when the IdP response is incomplete or unexpected.",
  "example": "For a test user with no real credentials, trace one connection from client to Transfer Family, then to a Lambda custom IdP and finally to an isolated S3 prefix. Test a valid identity with allowed and denied paths, an invalid password, an unknown user, and a malformed IdP response; review redacted logs and confirm no default response grants broad access.",
  "sources": [
    {"title": "Configuring an SFTP, FTPS, or FTP server endpoint", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/sftp-for-transfer-family.html"},
    {"title": "Custom identity provider solution", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/custom-idp-toolkit.html"},
    {"title": "Using AWS Lambda to integrate your identity provider", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/custom-lambda-idp.html"}
  ]
});
