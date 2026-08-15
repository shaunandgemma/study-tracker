import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-5",
  "title": "Firewall Endpoints",
  "plainEnglish": "A Firewall Endpoint in AWS Network Firewall is a managed VPC endpoint (represented by an Elastic Network Interface, or ENI) that AWS provisions inside each dedicated firewall subnet you specify during firewall creation. Network traffic is inspected by configuring your VPC route tables to use these firewall endpoint IDs (e.g., `vpce-0123456789abcdef0`) as the target hop for incoming or outgoing traffic.",
  "whyItMatters": "Firewall endpoints are the physical network entry and exit points for traffic inspection within each Availability Zone. Understanding how firewall endpoints operate within VPC routing architecture ensures you direct traffic symmetrically through the correct zonal endpoint, preventing dropped connections and ensuring thorough packet inspection.",
  "workplaceExample": "A network architect provisions an AWS Network Firewall across two Availability Zones (AZ-a and AZ-b). AWS creates two firewall endpoints: `vpce-aaaa` in subnet-fw-az1 and `vpce-bbbb` in subnet-fw-az2. The architect configures the workload subnet in AZ-a to route `0.0.0.0/0` to `vpce-aaaa`, and the workload subnet in AZ-b to route `0.0.0.0/0` to `vpce-bbbb`, ensuring traffic in each AZ is inspected locally by its respective zonal endpoint.",
  "examFocus": "Understand firewall endpoint routing and symmetry: (1) One endpoint is created per specified Availability Zone. (2) Endpoints are referenced as target `vpce-xxxx` IDs in VPC route tables. (3) Symmetric Routing: Outbound and return packets MUST traverse the same zonal firewall endpoint; routing asymmetric paths across different AZ endpoints causes stateful connection drops. (4) Dedicated Subnet: Each firewall endpoint requires a dedicated subnet containing no other workloads.",
  "keyPoints": [
    "AWS automatically creates a managed VPC endpoint ENI (`vpce-xxxx`) in each designated firewall subnet.",
    "Used as the target hop in VPC route tables to direct network traffic through the inspection engine.",
    "Firewall endpoints are zonal; each endpoint processes traffic within its specific Availability Zone.",
    "Requires strict Symmetric Routing so forward and return packets traverse the identical zonal endpoint.",
    "Asymmetric routing breaks TCP state tracking in the stateful engine, resulting in dropped sessions.",
    "Queryable via the AWS CLI using `describe-firewall` to retrieve endpoint IDs for route table automation."
  ],
  "commonMistake": "Routing traffic from an EC2 instance in AZ-a through a firewall endpoint located in AZ-b. Cross-AZ firewall routing introduces cross-AZ latency, unnecessary data transfer charges, and risks asymmetric routing failures.",
  "example": "Retrieve the firewall endpoint IDs from an active firewall using the AWS CLI: aws network-firewall describe-firewall --firewall-name perimeter-fw --query 'FirewallStatus.SyncStates.*.Attachment.EndpointId'.",
  "sources": [
    {
      "title": "Managing AWS Network Firewall Firewalls and Endpoints",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewalls.html"
    },
    {
      "title": "Routing VPC Traffic Through AWS Network Firewall Endpoints",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/route-tables.html"
    }
  ]
});
