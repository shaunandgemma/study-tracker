import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-14",
  "title": "Cross-Account Resource Ownership",
  "plainEnglish": "Cross-Account Resource Ownership in AWS RAM defines the strict separation between the resource owner (the account that created and pays for the underlying shared resource) and resource consumers (the participant accounts authorized to use that resource). In AWS RAM, sharing a resource NEVER transfers its ownership; the owner maintains exclusive control over resource configuration, sharing policies, and deletion, while consumers only manage child resources they create inside or against the shared infrastructure.",
  "whyItMatters": "Clear ownership boundaries prevent security conflicts and unauthorized modifications in multi-tenant enterprise cloud environments. For example, in a shared VPC model, a participant cannot alter subnet CIDRs, modify default route tables, or delete the VPC. If an account leaves the organization or access is revoked, the owner retains full control over the central infrastructure while consumer access is cleanly dissolved.",
  "workplaceExample": "In an enterprise multi-account environment, Account 1111 (Network Services) owns a shared VPC and subnets. Account 2222 (Marketing App) launches 10 EC2 instances into the shared subnets. Account 1111 pays for the VPC NAT Gateways and manages routing. Account 2222 pays for the EC2 compute hours and EBS storage. If Account 1111 removes Account 2222 from the resource share, Account 2222's existing EC2 instances continue running until deleted, but Account 2222 cannot launch new instances into the subnets.",
  "examFocus": "Understand ownership vs consumption rules for certification exams: (1) Ownership: The creator account retains 100% ownership and lifecycle control of the shared resource. (2) Child Resources: Resources created by consumers inside a shared resource (e.g., an EC2 instance in a shared subnet or an attachment to a shared TGW) are owned and billed to the consumer account. (3) Deletion: Deleting a RAM share does NOT delete the owner's underlying resource.",
  "keyPoints": [
    "Sharing an AWS resource via AWS RAM never transfers ownership to consumer accounts.",
    "The resource owner retains exclusive authority to modify, share, or delete the parent resource.",
    "Consumers own and pay for child resources they create inside or against the shared resource.",
    "Billing is cleanly separated: parent infrastructure bills to owner; consumed compute/storage bills to participant.",
    "Removing a principal from a share revokes access to create new child resources immediately.",
    "Owner accounts can view all active cross-account associations and consumer usage via AWS CloudTrail."
  ],
  "commonMistake": "Assuming that a resource consumer can delete or reconfigure a shared resource (such as changing a shared subnet's route table or deleting a shared Transit Gateway). Consumers have zero administrative rights over the shared parent resource.",
  "example": "View the ownership and association details of a resource share using the AWS CLI: aws ram get-resource-shares --resource-owner SELF --resource-share-arns arn:aws:ram:us-east-1:111122223333:resource-share/abcd-1234.",
  "sources": [
    {
      "title": "AWS RAM Key Concepts: Resource Owner and Consumer",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/concepts.html"
    },
    {
      "title": "Managing Shared Resources in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-shares.html"
    }
  ]
});
