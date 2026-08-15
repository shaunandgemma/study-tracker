import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-7",
  "title": "External Account Invitations",
  "plainEnglish": "An External Account Invitation in AWS RAM is a formal handshake process required when sharing AWS resources with an AWS account located outside the resource owner's AWS Organization. When an external account ID is added to a resource share configured with `allowExternalPrincipals=true`, AWS RAM generates a pending invitation that must be explicitly accepted by an administrator in the consumer account before the shared resource becomes accessible.",
  "whyItMatters": "Unrestricted, silent sharing across unrelated corporate boundaries could create serious compliance and security liabilities. The invitation mechanism ensures that the external consumer organization has full visibility, control, and explicit decision-making authority over whether to accept external shared resources into their account environment.",
  "workplaceExample": "A software consulting firm in Account `111122223333` builds a custom machine learning model in an Amazon SageMaker Model Registry for a client in Account `999988887777` (an external organization). The consulting team creates a RAM share with `allowExternalPrincipals=true` and invites the client's account ID. The client's cloud administrator receives the invitation in AWS RAM, reviews the resource ARN and permissions, and clicks 'Accept Resource Share', enabling their internal developers to access the model.",
  "examFocus": "Understand external invitation rules: (1) Setting Required: The resource share MUST have `allowExternalPrincipals` enabled. (2) Expiration Window: Invitations expire automatically if not accepted within 12 hours (43,200 seconds). (3) States: `PENDING` -> `ACCEPTED` (or `REJECTED` / `EXPIRED`). (4) Acceptance Action: The consumer account must call `AcceptResourceShareInvitation` or accept in the AWS RAM console.",
  "keyPoints": [
    "Generated automatically when sharing resources with an AWS account outside your AWS Organization.",
    "Requires `allowExternalPrincipals=true` configured on the resource share.",
    "Must be explicitly accepted by the consumer account before resources become visible or usable.",
    "Invitations have a strict expiration window of 12 hours from generation.",
    "The consumer account can choose to accept or reject the invitation.",
    "Consumer accounts can view pending invitations in the AWS RAM console or via `get-resource-share-invitations`."
  ],
  "commonMistake": "Expecting an external AWS account to immediately see a shared resource without accepting the invitation. External shares remain in `PENDING` status and cannot be used until the consumer account explicitly accepts the invitation within 12 hours.",
  "example": "Accept an incoming resource share invitation in the consumer account using the AWS CLI: aws ram accept-resource-share-invitation --resource-share-invitation-arn arn:aws:ram:us-east-1:111122223333:resource-share-invitation/abcd-1234.",
  "sources": [
    {
      "title": "Working with Resource Share Invitations in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-invitations.html"
    },
    {
      "title": "Accepting and Rejecting Resource Share Invitations",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-invitations-accept.html"
    }
  ]
});
