import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-11", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Custom Identity Providers", "status": "ready",
  "plainEnglish": "A custom identity provider lets Transfer Family ask existing authentication logic about a login. Transfer Family invokes AWS Lambda directly or calls an IAM-protected Amazon API Gateway method, which commonly invokes Lambda. The response confirms success by returning a user role and supplies the session's home directory, optional policy, public keys, and EFS POSIX profile as required.",
  "whyItMatters": "A custom IdP can preserve corporate or partner identities and calculate access at login time, but it becomes part of every connection. Its availability, validation, permissions, latency, response format, logging, and secure handling of supplied passwords directly affect both access and security.",
  "workplaceExample": "An SFTP client presents a username and key. Transfer Family invokes a Lambda IdP, which validates the server ID, username, source IP, protocol, and key against an approved store. It returns a customer-specific role and logical mapping; an unknown combination returns no role and therefore fails authentication.",
  "examFocus": "Lambda and API Gateway are integration mechanisms, not storage authorization by themselves. A valid custom response includes the role and protocol/storage-specific fields. API Gateway is useful for a RESTful integration and optional AWS WAF controls; direct Lambda supports configurations for which the API Gateway pattern's public endpoint constraints are unsuitable.",
  "keyPoints": [
    "Validate the server ID, protocol, username, and source context instead of authenticating on a username alone.",
    "Grant Transfer Family narrowly scoped permission to invoke the selected Lambda function or API Gateway method.",
    "For S3, the response can contain a role, session policy, and directory mapping; for EFS it also needs an appropriate POSIX profile.",
    "SFTP public-key and password requests have different input and response requirements, especially in combined authentication modes.",
    "Return an empty or otherwise documented failure response when authentication fails; never fall back to a broad default role.",
    "Redact passwords, tokens, SSH material, and sensitive paths from function, API, and troubleshooting logs.",
    "Test timeouts, dependency failure, malformed attributes, disabled users, and access revocation as well as successful login."
  ],
  "commonMistake": "Do not return a shared powerful role whenever the external identity store says a password is valid. Authentication and authorization are separate: construct and validate the least-privilege role, policy, home mapping, and POSIX identity for that exact session.",
  "example": "Use a synthetic user record and test the IdP through its supported test path. Check valid login, wrong secret, unknown user, wrong server, disallowed source, missing Role, invalid logical mapping, and unavailable dependency. Confirm failures disclose no credential data and that a valid response reaches only an isolated storage path.",
  "sources": [
    {"title": "Working with custom identity providers", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/custom-idp-intro.html"},
    {"title": "Using AWS Lambda to integrate your identity provider", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/custom-lambda-idp.html"},
    {"title": "Using Amazon API Gateway to integrate your identity provider", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/authentication-api-gateway.html"}
  ]
});
