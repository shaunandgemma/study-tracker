import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-1",
  "title": "Cross-Account Sharing of Subnets, Transit Gateways, Route 53 Rules without duplicating infrastructure",
  "plainEnglish": "AWS Resource Access Manager (AWS RAM) is a secure multi-account service that enables you to share supported AWS resources—such as VPC subnets, AWS Transit Gateways, Amazon Route 53 Resolver rules, AWS License Manager configurations, and customer-managed prefix lists—across multiple AWS accounts or throughout your AWS Organization without creating duplicate copies of infrastructure.",
  "whyItMatters": "In multi-account enterprise architectures, duplicating resources (such as provisioning separate Transit Gateways, redundant DNS forwarders, or individual VPC subnets in every application account) dramatically increases management overhead, license expenses, and cloud infrastructure costs. AWS RAM enables a centralized governance model where central networking and platform accounts manage shared core resources while application accounts consume them securely.",
  "workplaceExample": "A centralized Cloud Networking account owns an AWS Transit Gateway and Route 53 Resolver forwarding rules for on-premises hybrid DNS. Using AWS RAM, the network engineering team shares the Transit Gateway and Resolver rules with 80 application member accounts across the organization. Application teams attach their VPCs to the shared Transit Gateway and inherit corporate DNS resolution instantly with zero duplicate infrastructure.",
  "examFocus": "Understand the multi-account resource sharing model: (1) Resource Owner: The central account that creates and manages the resource. (2) Resource Consumer (Participant): The member accounts that use the resource. (3) Ownership is NEVER transferred: The owner retains full control and billing of the shared resource. (4) Consumers create their own resources inside/against the shared resource (e.g., participants launch EC2 instances in a shared subnet and pay for their own EC2 compute).",
  "keyPoints": [
    "Enables centralized sharing of supported AWS resources across accounts and organizational units.",
    "Eliminates infrastructure duplication, reducing operational complexity and overall cloud costs.",
    "Resource ownership is retained by the sharing account; ownership is never transferred to consumers.",
    "Consumers can launch permitted resources (e.g., EC2 instances in shared subnets) subject to their own IAM policies.",
    "Integrates natively with AWS Organizations for automated sharing without requiring manual invitations.",
    "Supports fine-grained AWS RAM Managed Permissions to enforce least-privilege consumer actions."
  ],
  "commonMistake": "Believing that sharing a resource transfers ownership or billing responsibility for the underlying shared resource to consumer accounts. The resource owner always owns, manages, and pays for the core shared resource (such as the VPC, Transit Gateway, or IP prefix list).",
  "example": "Share a central Transit Gateway with an entire AWS Organization using the AWS CLI: aws ram create-resource-share --name Central-TGW-Share --resource-arns arn:aws:ec2:us-east-1:111122223333:transit-gateway/tgw-0123456789abcdef0 --principals arn:aws:organizations::111122223333:organization/o-abc123456.",
  "sources": [
    {
      "title": "What is AWS Resource Access Manager?",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/what-is.html"
    },
    {
      "title": "Shareable AWS Resources in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/shareable.html"
    }
  ]
});
