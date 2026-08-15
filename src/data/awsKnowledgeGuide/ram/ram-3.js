import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-3",
  "title": "RAM Resource Sharing",
  "plainEnglish": "RAM Resource Sharing is the core capability in AWS Resource Access Manager that connects a resource owner (the AWS account that created a resource) with one or more resource consumers (target AWS accounts, OUs, or IAM principals). Through a centralized sharing workflow, resource sharing grants consumers read or operational permissions on supported cloud resources while strictly maintaining data boundary isolation and central ownership.",
  "whyItMatters": "Resource sharing enforces cloud infrastructure efficiency and centralized security governance. Rather than allowing decentralized development teams to create unmanaged, standalone network gateways, DNS forwarders, or VPC peering links, resource sharing allows central platform teams to maintain standardized, compliant, and cost-effective shared infrastructure.",
  "workplaceExample": "A cybersecurity engineering team in a central security account creates a customer-managed Prefix List containing all approved corporate corporate firewall IP ranges. Using AWS RAM Resource Sharing, they share this Prefix List with all application accounts in the company. Application developers reference this shared prefix list in their VPC Security Groups, ensuring that all firewall rules automatically update whenever the security team modifies the central prefix list.",
  "examFocus": "Understand the three structural components of a RAM share: (1) Resources: Supported AWS resources identified by their Amazon Resource Names (ARNs). (2) Principals: Authorized target entities (AWS Account IDs, IAM roles/users, OUs, or Organizations). (3) Permissions: Managed or customer-managed RAM permissions specifying exact permitted API actions on the shared resource.",
  "keyPoints": [
    "Connects resource owners with authorized resource consumers across AWS accounts.",
    "Composed of three fundamental elements: Resources (ARNs), Principals (consumers), and RAM Permissions.",
    "Supports sharing dozens of AWS resource types including Subnets, Transit Gateways, Prefix Lists, and Resolver Rules.",
    "Maintains strict resource boundary isolation; consumers cannot modify or delete the shared parent resource.",
    "Supports regional resources (e.g., VPC subnets in us-east-1) and global resources (e.g., Route 53 Profiles).",
    "Monitored via AWS CloudTrail events (e.g., `CreateResourceShare`, `AssociateResourceShare`)."
  ],
  "commonMistake": "Assuming that any AWS resource type can be shared with AWS RAM. RAM supports an explicit, curated list of shareable AWS resource types; unsupported resources (such as standard IAM roles or EBS volumes) cannot be shared via RAM.",
  "example": "Inspect all resources shared by your account using the AWS CLI: aws ram list-resources --resource-owner SELF.",
  "sources": [
    {
      "title": "Working with Resource Shares in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/working-with-shares.html"
    },
    {
      "title": "Key Concepts in AWS Resource Access Manager",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/concepts.html"
    }
  ]
});
