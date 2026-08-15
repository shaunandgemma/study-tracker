import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-4",
  "title": "Network Firewall Managed VPC Firewall",
  "plainEnglish": "AWS Network Firewall is a fully managed, stateful network firewall and intrusion detection and prevention service designed specifically for Amazon Virtual Private Cloud (VPC) perimeters. It provides network administrators with a managed appliance model where AWS manages the underlying compute infrastructure, scaling, patching, and high availability, while allowing customers to enforce comprehensive Layer 3 through Layer 7 traffic filtering across their VPCs.",
  "whyItMatters": "Before AWS Network Firewall, organizations had to deploy, scale, and manage complex third-party firewall EC2 virtual appliances (such as pfSense, Palo Alto, or Fortinet) behind load balancers. AWS Network Firewall replaces virtual appliance fleets with a native, managed service that automatically scales with VPC network traffic up to 100 Gbps per Availability Zone with zero server management.",
  "workplaceExample": "An enterprise migrates from a complex self-managed EC2 firewall cluster to AWS Network Firewall. They provision the firewall across 3 Availability Zones, attaching a central security policy with Suricata IPS signatures and domain filtering. The managed firewall automatically scales to absorb peak holiday network traffic surges without dropping connections or requiring manual EC2 capacity resizing.",
  "examFocus": "Understand the three core building blocks of AWS Network Firewall: (1) Rule Groups: Collections of stateless or stateful inspection rules. (2) Firewall Policy: Combines stateless and stateful rule groups, defines default actions, and sets stateful rule ordering (Strict vs Default action order). (3) Firewall: The managed AWS resource associated with a specific VPC and dedicated firewall subnets, creating zonal VPC endpoints (`vpce-xxxx`).",
  "keyPoints": [
    "Fully managed, scalable Layer 3 through Layer 7 network security service for Amazon VPCs.",
    "Composed of three core objects: Rule Groups, Firewall Policies, and the Firewall resource.",
    "Deploys dedicated VPC endpoint Elastic Network Interfaces (ENIs) inside designated firewall subnets.",
    "Scales automatically up to 100 Gbps per Availability Zone to handle dynamic traffic spikes.",
    "Integrated with AWS Firewall Manager for centralized multi-account security policy governance across AWS Organizations.",
    "Requires explicit VPC route table updates to direct ingress, egress, and east-west traffic through the firewall endpoints."
  ],
  "commonMistake": "Believing that creating an AWS Network Firewall automatically inspects VPC traffic. A newly created firewall does nothing until you update VPC Route Tables to route traffic through the firewall endpoint ENIs.",
  "example": "Create an AWS Network Firewall resource associated with a VPC and dedicated firewall subnets using the AWS CLI: aws network-firewall create-firewall --firewall-name perimeter-fw --firewall-policy-arn arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/main-policy --vpc-id vpc-01234567 --subnet-mappings SubnetId=subnet-fw-az1 SubnetId=subnet-fw-az2.",
  "sources": [
    {
      "title": "What is AWS Network Firewall?",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html"
    },
    {
      "title": "AWS Network Firewall Architecture and Components",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/architecture.html"
    }
  ]
});
