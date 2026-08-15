import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-23",
  "title": "Route 53 Resolver Outbound Endpoints",
  "plainEnglish": "A Route 53 Resolver Outbound Endpoint is a managed network component in your Amazon VPC that allows Route 53 Resolver to forward DNS queries from your AWS workloads to external DNS servers (such as on-premises Active Directory or BIND servers) over AWS Direct Connect or Site-to-Site VPN. Outbound Endpoints work in tandem with Route 53 Resolver Forwarding Rules to route queries for specific corporate domains (e.g., `corp.internal`).",
  "whyItMatters": "Workloads migrating to AWS frequently need to authenticate against on-premises Active Directory domains, connect to legacy on-premises databases, or access internal enterprise tools. Outbound Endpoints bridge VPC DNS with on-premises DNS without installing third-party forwarding software or modifying individual EC2 operating system DNS settings.",
  "workplaceExample": "An EC2 application instance in AWS needs to connect to an on-premises database with hostname `oracle.datacenter.corp`. The cloud team creates a Route 53 Resolver Outbound Endpoint in 2 AZs and creates a Resolver Forwarding Rule: `For domain datacenter.corp -> forward queries to on-premises DNS server 192.168.10.50 via the outbound endpoint`. The EC2 instance queries the local .2 resolver, which forwards the request through the outbound endpoint to the data center.",
  "examFocus": "Understand Outbound Endpoint requirements: (1) Query Direction: AWS TO ON-PREMISES (Outbound from VPC). (2) Paired with Resolver Rules: An Outbound Endpoint does nothing on its own; you MUST create a Forwarding Rule that specifies target on-premises IP addresses and associates with your VPCs. (3) Multi-AZ: Requires deploying endpoint ENIs in at least two subnets across different AZs for high availability. (4) Security Groups: Must allow outbound UDP/TCP port 53 traffic to the on-premises DNS IP range.",
  "keyPoints": [
    "Enables AWS VPC workloads to resolve on-premises and external private domain names.",
    "Provisions dedicated ENIs with private IP addresses inside your VPC subnets.",
    "Must be paired with Route 53 Resolver Forwarding Rules to define matching domains and target DNS IPs.",
    "Requires multi-AZ deployment across at least two subnets for high availability.",
    "Operates across AWS Direct Connect, AWS Site-to-Site VPN, or AWS Transit Gateway paths.",
    "Security groups attached to outbound ENIs must allow outbound UDP and TCP port 53 traffic."
  ],
  "commonMistake": "Creating a Route 53 Resolver Outbound Endpoint and expecting DNS queries to start forwarding automatically without creating a Resolver Forwarding Rule. Outbound endpoints provide the physical network exit path, but Forwarding Rules specify WHICH domain names to forward and to WHAT target IP addresses.",
  "example": "Create an Outbound Resolver Endpoint using the AWS CLI: aws route53resolver create-resolver-endpoint --creator-request-id $(date +%s) --name Outbound-DNS --security-group-ids sg-outbound-dns --direction OUTBOUND --ip-addresses SubnetId=subnet-111 SubnetId=subnet-222.",
  "sources": [
    {
      "title": "Forwarding Outbound DNS Queries to Your Network in Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-forwarding-outbound-queries.html"
    },
    {
      "title": "Route 53 Resolver Endpoints Architecture",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-endpoints.html"
    }
  ]
});
