import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-9",
  "title": "Secret Versions",
  "plainEnglish": "Updating a secret value normally creates a new immutable version with its own version ID. Movable staging labels describe each version's role: AWSCURRENT is returned by default, AWSPREVIOUS commonly marks the former current value, and AWSPENDING marks a version being processed during rotation.",
  "whyItMatters": "Version IDs provide exact identity, while staging labels let applications follow the approved credential without code changes. Understanding both makes rotation, incident diagnosis, and a controlled rollback much safer.",
  "workplaceExample": "After a database rotation, an operator sees that application authentication fails with AWSCURRENT but succeeds with the preceding tested version. Following an incident procedure, the operator moves the labels to roll back and investigates the target-system update rather than copying passwords between versions.",
  "examFocus": "Staging labels are movable pointers, not immutable version IDs. Only one version of a secret can carry a given staging label, and retrieving without a version selector returns AWSCURRENT. AWSPENDING is not safe for normal application use until testing succeeds.",
  "keyPoints": [
    "Each stored secret-value version has a unique version ID.",
    "AWSCURRENT normally identifies the version applications should retrieve.",
    "AWSPREVIOUS usually points to the prior current version after an update or completed rotation.",
    "AWSPENDING identifies a candidate version during supported rotation workflows.",
    "A staging label can move between versions and therefore is not a permanent version identifier.",
    "Moving AWSCURRENT during an approved rollback changes which value default retrieval returns."
  ],
  "commonMistake": "Pinning production code to a version ID prevents it from following successful rotations. Retrieve AWSCURRENT by default unless a controlled diagnostic or recovery workflow explicitly needs another version.",
  "example": "Create a harmless test secret, record its initial version ID, update the test value to create another version, inspect VersionIdsToStages without printing either value, retrieve AWSCURRENT, and practice a documented label-based rollback before scheduling safe deletion of the test secret.",
  "sources": [
    {
      "title": "What's in a Secrets Manager secret?",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/whats-in-a-secret.html"
    },
    {
      "title": "Roll back a secret to a previous version",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/roll-back-secret.html"
    }
  ]
});
