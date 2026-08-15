import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-10", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Service-Managed Users", "status": "ready",
  "plainEnglish": "With Transfer Family service-managed users, AWS stores each SFTP username and its SSH public keys as part of the server configuration. The user keeps the matching private key. The administrator also assigns a storage access role, home-directory configuration, and, for EFS, a POSIX profile.",
  "whyItMatters": "This is the simplest identity option for a limited set of SFTP partners that use public-key authentication and do not need an external directory. It avoids building an identity-provider integration while still requiring lifecycle ownership for keys, users, roles, mappings, and removal of expired partner access.",
  "workplaceExample": "A small vendor receives an SFTP user whose public key is registered with the server. A logical root hides the S3 bucket name and maps only the vendor's inbound prefix, while a role and optional session policy enforce the same boundary. Offboarding deletes the user and reviews retained objects without ever collecting the vendor's private key.",
  "examFocus": "Service-managed users are for SFTP and public-key authentication; they are not the password store for FTPS or FTP. The public key authenticates the user, while the mapped role, session policy or EFS POSIX profile, and home directory authorize file access.",
  "keyPoints": [
    "Store only SSH public keys for a service-managed user; the user's private key stays outside Transfer Family.",
    "Each username is unique within its server and should have an accountable owner and offboarding date.",
    "An S3 user receives an IAM role and can use a session policy to reduce that role's effective permissions.",
    "An EFS user needs a role plus a POSIX profile and existing directories with suitable filesystem permissions.",
    "A PATH home directory sets a landing path, while LOGICAL mappings can hide backend names and present a virtual root.",
    "Logical mappings do not replace least-privilege storage permissions because both controls protect against configuration mistakes.",
    "Key rotation should add and verify the replacement public key before retiring the old one through an approved process."
  ],
  "commonMistake": "Do not paste a private SSH key into the service-managed user's public-key field or store it in a guide, ticket, or log. Transfer Family needs the public half; the user must protect the private half.",
  "example": "Generate a disposable key pair locally, register only its public key for a test SFTP user, map that user to an isolated home and least-privilege role, connect with the private key, test a permitted and denied path, add a second test public key to rehearse rotation, then remove both keys and the user through approved cleanup.",
  "sources": [
    {"title": "Working with service-managed users", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/service-managed-users.html"},
    {"title": "Managing users for server endpoints", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-user.html"},
    {"title": "Create an IAM role and policy", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/requirements-roles.html"}
  ]
});
