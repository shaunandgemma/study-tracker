import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-14",
  "title": "Transit Gateway Integration",
  "plainEnglish": "Integrating AWS Network Firewall with AWS Transit Gateway enables centralized network traffic inspection across hundreds of Amazon VPCs and hybrid on-premises connections. By attaching a dedicated Inspection VPC (containing AWS Network Firewall endpoints) to the Transit Gateway and enabling Appliance Mode on that attachment, Transit Gateway routes inter-VPC and internet traffic symmetrically through the firewall before delivering packets to their destination.",
  "whyItMatters": "Without Transit Gateway integration, inspecting traffic between dozens of spoke VPCs requires complex full-mesh VPC peering or deploying independent firewalls in every individual VPC. Transit Gateway acts as a central cloud router that funnels all East-West (VPC-to-VPC) and North-South (Internet) traffic through a centralized inspection pipeline.",
  "workplaceExample": "A multinational enterprise connects 50 business-unit spoke VPCs to an AWS Transit Gateway. The centralized security team deploys an Inspection VPC with AWS Network Firewall endpoints in 3 AZs. The team enables Transit Gateway Appliance Mode on the Inspection VPC attachment, ensuring that any inter-VPC communication between Finance and Marketing VPCs is inspected for malware and unauthorized lateral movement by the central firewall.",
  "examFocus": "Understand the critical role of Transit Gateway Appliance Mode: (1) In a standard TGW attachment, return traffic from a destination AZ is routed to an attachment ENI in the same destination AZ, which causes asymmetric routing across firewalls. (2) Appliance Mode forces the Transit Gateway to route return packets back to the exact same Availability Zone where the flow originated, ensuring symmetric inspection for stateful firewalls. (3) TGW Route Tables: Spoke VPC route tables route `0.0.0.0/0` to the Inspection VPC; the Inspection VPC route table routes inspected traffic back to destination VPCs.",
  "keyPoints": [
    "Connects AWS Network Firewall in an Inspection VPC to multiple spoke VPCs via AWS Transit Gateway.",
    "Transit Gateway Appliance Mode is mandatory to maintain symmetric routing across stateful firewall endpoints.",
    "Appliance Mode guarantees that bidirectional flows in a connection traverse the firewall in the same Availability Zone.",
    "Supports East-West (spoke-to-spoke), North-South egress, and hybrid Direct Connect inspection.",
    "Uses Transit Gateway route tables to control traffic segmentation and isolation between security zones.",
    "Eliminates the operational overhead of deploying and maintaining firewalls in every individual spoke VPC."
  ],
  "commonMistake": "Deploying a centralized Transit Gateway inspection model without enabling Appliance Mode on the Inspection VPC attachment. Without Appliance Mode, asymmetric routing will send return packets to a different AZ firewall endpoint, causing the stateful engine to drop the connection.",
  "example": "Enable Appliance Mode on a Transit Gateway VPC attachment using the AWS CLI: aws ec2 modify-transit-gateway-vpc-attachment --transit-gateway-attachment-id tgw-attach-0123456789abcdef0 --options ApplianceModeSupport=enable.",
  "sources": [
    {
      "title": "Centralized Inspection with AWS Transit Gateway and Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/arch-tgw-centralized.html"
    },
    {
      "title": "AWS Transit Gateway Appliance Mode Overview",
      "url": "https://docs.aws.amazon.com/vpc/latest/tgw/transit-gateway-appliance-mode.html"
    }
  ]
});
