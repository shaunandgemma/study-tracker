import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-13",
  "title": "Centralized Inspection Architecture",
  "plainEnglish": "A Centralized Inspection Architecture in AWS Network Firewall uses an AWS Transit Gateway to route all network traffic across multiple spoke VPCs, on-premises networks, and the public internet through a single, dedicated Inspection VPC hosting AWS Network Firewall endpoints. This model centralizes network security policy enforcement, threat inspection, and compliance logging into a unified hub-and-spoke topology.",
  "whyItMatters": "In large enterprise environments with dozens or hundreds of AWS accounts and VPCs, deploying individual firewalls in every spoke VPC (Distributed Architecture) increases operational complexity and firewall endpoint licensing costs. A Centralized Inspection VPC simplifies firewall policy management, reduces endpoint costs, and ensures uniform security inspection across all VPC-to-VPC (East-West) and Internet (North-South) traffic flows.",
  "workplaceExample": "An enterprise with 40 spoke VPCs attaches all VPCs to an AWS Transit Gateway. They deploy an Inspection VPC containing AWS Network Firewall endpoints and NAT Gateways across 3 Availability Zones. Transit Gateway route tables route all outbound internet traffic from the 40 spoke VPCs through the Inspection VPC firewall before exiting to the internet, and route inter-VPC traffic through the firewall before reaching target spoke VPCs.",
  "examFocus": "Understand Centralized Inspection architecture requirements: (1) AWS Transit Gateway Appliance Mode: MUST be enabled on the Transit Gateway attachment to the Inspection VPC to ensure symmetric bidirectional traffic routing through the same AZ firewall endpoint. (2) Traffic Patterns Inspected: East-West (VPC-to-VPC), North-South Egress (VPC-to-Internet), North-South Ingress (Internet-to-VPC), and Hybrid (Direct Connect/VPN-to-VPC). (3) Trade-off vs Distributed: Centralized lowers cost and simplifies management; Distributed avoids Transit Gateway data processing fees and cross-VPC latency.",
  "keyPoints": [
    "Uses AWS Transit Gateway to route traffic from multiple spoke VPCs through a centralized Inspection VPC.",
    "Inspects East-West (VPC-to-VPC), North-South (Internet Ingress/Egress), and Hybrid on-premises traffic.",
    "Requires Transit Gateway Appliance Mode enabled on the Inspection VPC attachment for symmetric stateful inspection.",
    "Centralizes security logging, rule management, and compliance auditing in a single dedicated security account.",
    "Reduces total firewall endpoint hourly costs compared to deploying firewalls in every individual spoke VPC.",
    "Transit Gateway route tables direct inter-VPC and default 0.0.0.0/0 traffic to the Inspection VPC attachment."
  ],
  "commonMistake": "Forgetting to enable Transit Gateway Appliance Mode on the Inspection VPC attachment. Without Appliance Mode, the Transit Gateway may route forward packets through the firewall in AZ-a and return packets through the firewall in AZ-b (asymmetric routing), causing the stateful firewall engine to drop connections.",
  "example": "Enable Appliance Mode on the Transit Gateway attachment for the Inspection VPC using the AWS CLI: aws ec2 modify-transit-gateway-vpc-attachment --transit-gateway-attachment-id tgw-attach-0123456789abcdef0 --options ApplianceModeSupport=enable.",
  "sources": [
    {
      "title": "Centralized Inspection Architecture with AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/arch-tgw-centralized.html"
    },
    {
      "title": "Deployment Models for AWS Network Firewall (AWS Whitepapers)",
      "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-network-firewall-architectures/centralized-deployment-models.html"
    }
  ]
});
