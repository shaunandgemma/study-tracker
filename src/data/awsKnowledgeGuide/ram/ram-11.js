import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-ram",
  "topicTitle": "AWS RAM (Resource Access Manager)",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "ram-11",
  "title": "Sharing Transit Gateways",
  "plainEnglish": "Sharing Transit Gateways using AWS RAM allows a central network administrator account to share a central AWS Transit Gateway with multiple application accounts across an organization. Once shared, consumer accounts can create Transit Gateway VPC Attachments directly from their local accounts, linking their application VPCs to the central cloud hub-and-spoke network without managing their own transit router.",
  "whyItMatters": "Operating separate transit routers or maintaining full-mesh VPC peering across dozens of AWS accounts leads to exponential complexity and management overhead. Sharing a single Transit Gateway centralizes cloud routing, simplifies network policy enforcement, enables centralized firewall inspection, and reduces overall infrastructure costs.",
  "workplaceExample": "A central Network Services account deploys an AWS Transit Gateway in `us-east-1`. Using AWS RAM, the network team shares the Transit Gateway with the entire AWS Organization. When a finance development team creates a new VPC in their finance account, they immediately see the shared Transit Gateway in their VPC console and create a VPC attachment to connect their accounting microservices to the corporate network.",
  "examFocus": "Understand the division of responsibilities when sharing Transit Gateways: (1) Owner Account: Owns the Transit Gateway, configures TGW Route Tables, manages route propagation, and controls attachment associations. (2) Consumer Account: Creates the Transit Gateway VPC Attachment and configures local VPC Subnet Route Tables to point `0.0.0.0/0` or internal CIDRs to the Transit Gateway. (3) Auto-Acceptance: Transit Gateway can be configured to auto-accept cross-account attachments.",
  "keyPoints": [
    "Enables cross-account hub-and-spoke VPC connectivity using a centralized AWS Transit Gateway.",
    "Owner account retains full management of Transit Gateway route tables, associations, and propagations.",
    "Consumer accounts create local VPC attachments targeting the shared Transit Gateway ARN.",
    "Supports automatic attachment acceptance or manual review by the Transit Gateway owner.",
    "Consumer VPC route tables must be configured to route target CIDRs to the Transit Gateway attachment.",
    "Significantly reduces cloud networking costs compared to maintaining redundant network appliances."
  ],
  "commonMistake": "Expecting VPCs attached to a shared Transit Gateway to communicate automatically without configuring routing. Cross-account VPC communication requires both updating the local VPC route tables and configuring Transit Gateway route table associations and propagations in the owner account.",
  "example": "Share a Transit Gateway with an Organizational Unit using the AWS CLI: aws ram create-resource-share --name SharedTGW --resource-arns arn:aws:ec2:us-east-1:111122223333:transit-gateway/tgw-0123456789abcdef0 --principals arn:aws:organizations::111122223333:ou/o-abc123456/ou-apps123.",
  "sources": [
    {
      "title": "Sharing a Transit Gateway in AWS Transit Gateway",
      "url": "https://docs.aws.amazon.com/transit-gateway/latest/userguide/tgw-transit-gateways.html#tgw-sharing"
    },
    {
      "title": "Shareable AWS Resources in AWS RAM",
      "url": "https://docs.aws.amazon.com/ram/latest/userguide/shareable.html"
    }
  ]
});
