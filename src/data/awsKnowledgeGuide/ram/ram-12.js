import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-12",
  "title": "VPC Subnet Sharing",
  "plainEnglish": "VPC Subnet Sharing (often called VPC Sharing) is a capability in AWS RAM that allows a central networking account (the VPC Owner) to share specific VPC subnets with other member accounts (Participants) within the same AWS Organization. Participant accounts can launch application resources (such as Amazon EC2 instances, Amazon RDS databases, and Amazon ECS tasks) directly into the shared subnets, enabling seamless multi-account microservice communication within a single unified IP address space.",
  "whyItMatters": "Before VPC Subnet Sharing, multi-account architectures required each account to maintain its own separate VPC, leading to complex VPC peering meshes, multiple NAT Gateways, transit gateway data processing costs, and fragmented IP address management. VPC Sharing centralizes networking topology and IP allocation while maintaining account-level IAM and billing boundaries for application teams.",
  "workplaceExample": "A centralized Network Services account creates a core VPC (`10.100.0.0/16`) with public and private subnets across 3 AZs. Using AWS RAM, the network team shares the private subnets with Account A (Billing Service) and Account B (Order Service). Developers in Account A launch their EC2 instances into the shared subnets and manage their own security groups. Compute instances in Account A can connect directly to databases in Account B using low-latency local VPC routing with zero data transfer fees.",
  "examFocus": "Understand the division of responsibilities in VPC Subnet Sharing: (1) VPC Owner: Owns the VPC, subnets, route tables, Network ACLs, Internet Gateways, NAT Gateways, and VPC peering connections. (2) Participants: Can launch, describe, and delete their own compute resources (EC2, RDS, Lambda, etc.) in shared subnets. (3) Security Groups: Participants create and own their own security groups; participants cannot see or modify other participants' security groups (though they can reference another participant's security group ID in rules).",
  "keyPoints": [
    "Allows multiple AWS accounts in an organization to deploy compute resources into shared VPC subnets.",
    "Owner account owns and manages the VPC, subnets, route tables, Network ACLs, NAT Gateways, and IGWs.",
    "Participant accounts launch and manage their own resources (EC2, RDS, ECS, Lambda) inside the shared subnets.",
    "Participants create and manage their own Security Groups; security groups cannot be viewed or edited by other participants.",
    "Enables local high-speed communication between cross-account resources without inter-VPC routing or peering fees.",
    "Only accounts within the same AWS Organization can participate in VPC Subnet Sharing (external sharing is prohibited)."
  ],
  "commonMistake": "Believing that participant accounts can modify VPC route tables, create internet gateways, or view other participants' security groups. Participants only control their own compute workloads and security groups; all network infrastructure management belongs exclusively to the VPC owner.",
  "example": "Share private application subnets with an entire organization using the AWS CLI: aws ram create-resource-share --name SharedAppSubnets --no-allow-external-principals --resource-arns arn:aws:ec2:us-east-1:111122223333:subnet/subnet-01234567 arn:aws:ec2:us-east-1:111122223333:subnet/subnet-89abcdef --principals arn:aws:organizations::111122223333:organization/o-abc123456.",
  "sources": [
    {
      "title": "VPC Sharing: Share Your VPC with Other Accounts",
      "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-sharing.html"
    },
    {
      "title": "Shareable AWS Resources in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/shareable.html"
    }
  ]
});
