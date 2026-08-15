import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-12",
  "title": "Route Table Integration",
  "plainEnglish": "Route Table Integration is the foundational networking configuration in your Amazon Virtual Private Cloud (VPC) that directs traffic into and out of AWS Network Firewall endpoints. AWS Network Firewall is an inline service, meaning you must modify VPC Route Tables (including Ingress route tables on Internet Gateways, workload subnet route tables, and firewall subnet route tables) to force all packets through the firewall endpoint (`vpce-xxxx`) before reaching their destination.",
  "whyItMatters": "Simply creating a firewall resource does not inspect any network traffic. Security enforcement is entirely governed by VPC route tables. Incorrect routing leads to uninspected traffic bypassing the firewall, routing loops, or asymmetric routing failures where forward and return packets take different paths and get dropped by stateful inspection.",
  "workplaceExample": "A cloud engineer configures egress traffic inspection for an application subnet in `us-east-1a`: (1) Workload Subnet Route Table: `0.0.0.0/0` -> Target: `vpce-az1` (Firewall Endpoint), (2) Firewall Subnet Route Table: `0.0.0.0/0` -> Target: `nat-01234` (NAT Gateway), (3) Public NAT Subnet Route Table: `0.0.0.0/0` -> Target: `igw-01234` (Internet Gateway), and (4) Return routing matches the reverse path symmetrically.",
  "examFocus": "Understand the three route tables required for distributed internet egress inspection: (1) Workload Subnet Route Table: Default route `0.0.0.0/0` points to the zonal Firewall Endpoint (`vpce-xxxx`). (2) Firewall Subnet Route Table: Default route `0.0.0.0/0` points to the zonal NAT Gateway (`nat-xxxx`). (3) Public Subnet Route Table: Default route `0.0.0.0/0` points to the Internet Gateway (`igw-xxxx`). For ingress inspection, an Edge Ingress Route Table attached to the Internet Gateway routes workload subnet CIDRs to the firewall endpoint.",
  "keyPoints": [
    "AWS Network Firewall requires explicit VPC Route Table configuration to inspect network traffic.",
    "Firewall endpoints (`vpce-xxxx`) serve as the next-hop target in VPC route tables.",
    "Egress inspection requires distinct route tables for Workload, Firewall, and Public/NAT subnets.",
    "Ingress inspection requires an Edge Ingress Route Table associated with the Internet Gateway (Gateway Route Table).",
    "Requires strict Symmetric Routing: Outbound and return packets must traverse the same zonal firewall endpoint.",
    "Always validate route table configuration with test traffic before activating blocking drop rules."
  ],
  "commonMistake": "Pointing the default route `0.0.0.0/0` in the Firewall Subnet's route table back to the firewall endpoint `vpce-xxxx`. This creates an infinite routing loop; the firewall subnet route table must point to the NAT Gateway or Internet Gateway.",
  "example": "Configure a route in the workload subnet route table targeting the firewall endpoint using the AWS CLI: aws ec2 create-route --route-table-id rtb-workload --destination-cidr-block 0.0.0.0/0 --vpc-endpoint-id vpce-0123456789abcdef0.",
  "sources": [
    {
      "title": "Routing VPC Traffic Through AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/route-tables.html"
    },
    {
      "title": "Architecture with Internet Gateway and NAT Gateway",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/arch-igw-ngw.html"
    }
  ]
});
