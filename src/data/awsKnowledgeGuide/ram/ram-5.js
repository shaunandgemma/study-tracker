import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-5",
  "title": "Sharing Resources Across AWS Accounts",
  "plainEnglish": "Sharing Resources Across AWS Accounts is the operational process of granting another independent AWS account access to utilize an AWS resource created in your account. By creating a Resource Share and specifying the 12-digit AWS Account ID of the target account, the resource owner grants the consumer account permission to view and operate the shared resource according to the attached RAM permission policy.",
  "whyItMatters": "Modern enterprise cloud architectures segment workloads into dedicated AWS accounts for billing isolation, security compartmentalization, and team autonomy. Sharing resources across accounts enables cross-account collaboration (such as sharing centralized core VPC subnets or transit gateways) without granting broad cross-account IAM administrative access or creating security backdoors.",
  "workplaceExample": "Account A (a central analytics team) creates an Amazon SageMaker Model Registry and a customer-managed Prefix List. Account B (a marketing data science team) needs to access these machine learning models and network rules. The platform team in Account A creates an AWS RAM share, specifies Account B's 12-digit ID (`222233334444`), and assigns read-only permissions. Account B's data scientists can immediately discover and deploy the models inside their own account.",
  "examFocus": "Understand cross-account sharing workflow: (1) Same Organization vs External Account: If the target account is in the same AWS Organization with Trusted Access enabled, sharing is instant. If the target account is outside the organization, an invitation is generated and MUST be accepted by the consumer account within 12 hours. (2) IAM Permissions on Consumer: The consumer IAM user/role must have identity-based IAM permissions to interact with the shared resource type in addition to the RAM share.",
  "keyPoints": [
    "Grants external or internal AWS accounts operational access to supported resources using 12-digit Account IDs.",
    "Eliminates the need for cross-account IAM role assumption to access shared infrastructure.",
    "Internal organizational sharing is automatic; external account sharing requires explicit invitation acceptance.",
    "Consumer identity policies (IAM) must permit interactions with the shared resource service.",
    "Resource actions are constrained by the least-privilege RAM permission attached to the share.",
    "All cross-account resource activities are fully auditable in both owner and consumer AWS CloudTrail logs."
  ],
  "commonMistake": "Assuming that sharing a resource via RAM automatically grants every IAM user in the consumer account permission to use it. The consumer account's IAM administrator must still grant their local IAM roles/users the necessary identity permissions to interact with the shared resource.",
  "example": "Share a custom prefix list with a specific external AWS account using the AWS CLI: aws ram create-resource-share --name SharedPrefixList --resource-arns arn:aws:ec2:us-east-1:111122223333:prefix-list/pl-01234567 --principals 222233334444 --allow-external-principals.",
  "sources": [
    {
      "title": "Working with Principals in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-principals.html"
    },
    {
      "title": "Sharing AWS Resources with AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/share-resources.html"
    }
  ]
});
