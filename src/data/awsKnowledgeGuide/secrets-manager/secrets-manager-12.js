import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-secrets-manager",
  "topicTitle": "AWS Secrets Manager",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "secrets-manager-12",
  "title": "Secrets Manager Resource Policies",
  "plainEnglish": "A resource-based policy is a JSON permission document attached directly to one secret. It names the principals that may perform specified actions on that secret and is particularly useful when granting carefully controlled access to a role in another AWS account.",
  "whyItMatters": "Attaching permission at the secret makes its external access visible with the resource, but an overly broad principal can expose sensitive data. Policy validation, IAM Access Analyzer, and the BlockPublicPolicy protection help detect or prevent broad access.",
  "workplaceExample": "A security account owns a shared monitoring token. Its secret policy names one exact consuming role in the operations account and allows only GetSecretValue; the owner validates the policy, blocks public policy changes, and reviews Access Analyzer findings.",
  "examFocus": "Resource policies and identity policies are different policy layers, and explicit deny still wins. PutResourcePolicy with BlockPublicPolicy can reject policies that allow broad access; granting another principal PutResourcePolicy is highly sensitive because it can enable privilege escalation.",
  "keyPoints": [
    "A secret resource policy specifies principals, Secrets Manager actions, and access conditions.",
    "It can grant multiple principals or cross-account identities access to one secret.",
    "ValidateResourcePolicy uses automated reasoning to identify broad access.",
    "BlockPublicPolicy can prevent attachment of a resource policy that grants broad access.",
    "IAM Access Analyzer can help identify unintended public or cross-account reachability.",
    "Policies should name approved principals and must not use a wildcard principal for secret retrieval."
  ],
  "commonMistake": "Do not copy a permissive resource-policy example and leave its principal broad. Replace placeholders with the exact approved role, allow only needed actions, apply BlockPublicPolicy, and test an unapproved principal before production use.",
  "example": "On a test secret, draft a policy granting one named test role only GetSecretValue, run resource-policy validation, attach it with broad-access blocking enabled, confirm the named role succeeds and a different role fails, then review the result with Access Analyzer.",
  "sources": [
    {
      "title": "Resource-based policies for AWS Secrets Manager",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_resource-policies.html"
    },
    {
      "title": "AWS Secrets Manager best practices",
      "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#bp-access"
    }
  ]
});
