import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-15",
  "title": "RAM vs VPC Peering",
  "plainEnglish": "AWS RAM (Resource Access Manager) and VPC Peering represent two completely different architectural models for multi-account networking in AWS. AWS RAM enables VPC Sharing, where multiple AWS accounts deploy their compute workloads into the exact same shared VPC subnets without any inter-VPC routing. VPC Peering is a Layer 3 routing connection between two separate, distinct VPCs that allows instances in different VPC networks to communicate over private IP routes.",
  "whyItMatters": "Choosing between VPC Sharing (via RAM) and VPC Peering defines your network boundaries, IP address architecture, and cross-account data transfer costs. VPC Sharing provides low-latency local subnet communication with zero inter-VPC data transfer fees and unified IP management. VPC Peering maintains separate VPC boundaries with isolated network management, requiring distinct non-overlapping CIDRs and individual route table entries.",
  "workplaceExample": "An enterprise compares options for multi-account microservices: For high-throughput internal microservices that exchange hundreds of terabytes monthly, they use AWS RAM to share private subnets from a central networking account to application accounts, eliminating inter-VPC data transfer costs entirely. For a standalone third-party security inspection VPC with independent network controls, they connect via VPC Peering or Transit Gateway.",
  "examFocus": "Compare VPC Sharing (via RAM) vs VPC Peering for AWS certification exams: (1) Architecture: VPC Sharing = Single shared VPC, multiple accounts deploy into same subnets; VPC Peering = Two distinct VPCs joined by a routing connection. (2) Cost: VPC Sharing has ZERO inter-VPC data transfer fees for resources in the same AZ; VPC Peering incurs inter-VPC/cross-AZ data transfer fees. (3) Security Boundaries: VPC Sharing shares subnets and network ACLs (security groups remain isolated); VPC Peering maintains separate VPCs, subnets, and route tables. (4) Trust: VPC Sharing is restricted strictly to accounts within the SAME AWS Organization.",
  "keyPoints": [
    "VPC Sharing (via RAM) deploys multiple accounts into the same shared subnets; VPC Peering routes between separate VPCs.",
    "VPC Sharing eliminates inter-VPC routing complexity and inter-VPC data transfer charges.",
    "VPC Peering requires non-overlapping CIDR blocks and bidirectional route table updates in both VPCs.",
    "VPC Sharing is restricted strictly to accounts within the same AWS Organization; VPC Peering can connect external accounts.",
    "In VPC Sharing, participants manage their own security groups but share the VPC's route tables and Network ACLs.",
    "Choose VPC Sharing for tightly integrated microservices; choose VPC Peering for autonomous, isolated VPC networks."
  ],
  "commonMistake": "Attempting to use VPC Sharing (via RAM) across accounts that belong to different AWS Organizations. VPC Subnet Sharing is strictly supported only between accounts in the same AWS Organization; for cross-organization private connectivity, use VPC Peering, AWS Transit Gateway, or AWS PrivateLink.",
  "example": "Choose VPC Sharing via AWS RAM when multiple microservice accounts in the same organization need high-speed, zero-data-transfer-fee communication within a single core VPC; choose VPC Peering when connecting two distinct VPCs with independent routing domains.",
  "sources": [
    {
      "title": "VPC Sharing: Share Your VPC with Other Accounts",
      "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-sharing.html"
    },
    {
      "title": "What is VPC Peering in Amazon VPC?",
      "url": "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html"
    }
  ]
});
