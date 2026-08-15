import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-route53",
  "topicTitle": "Amazon Route 53",
  "objectiveCode": "Networking",
  "status": "ready",
  "id": "route53-22",
  "title": "Route 53 Resolver Inbound Endpoints",
  "plainEnglish": "A Route 53 Resolver Inbound Endpoint is a managed network interface inside your Amazon VPC that allows on-premises DNS servers (like Microsoft Active Directory DNS or BIND) to send DNS queries into AWS over Direct Connect or Site-to-Site VPN to resolve Route 53 Private Hosted Zones and internal AWS service domain names.",
  "whyItMatters": "Before Inbound Endpoints, on-premises corporate servers could not resolve AWS private domain names (like `aurora-db.aws.corp` or S3 interface endpoints) without deploying and managing dedicated EC2 BIND/DNS proxy instances. Inbound Endpoints replace self-managed DNS forwarders with a fully managed, multi-AZ DNS listening service.",
  "workplaceExample": "An on-premises mainframe application needs to call a microservice hosted in an AWS VPC. The cloud engineer deploys a Route 53 Resolver Inbound Endpoint across two subnets, receiving private IP addresses `10.0.1.53` and `10.0.2.53`. On the on-premises Active Directory DNS servers, the network team creates a conditional forwarder rule: `For domain aws.company.internal -> forward queries to 10.0.1.53 and 10.0.2.53`. The mainframe resolves AWS services directly.",
  "examFocus": "Understand Inbound Endpoint architecture: (1) Query Direction: ON-PREMISES TO AWS (Inbound into VPC). (2) Endpoint ENIs: AWS provisions dedicated Elastic Network Interfaces (ENIs) with private IP addresses in at least two VPC subnets across distinct Availability Zones. (3) Security Groups: Attached to the inbound ENIs; must permit inbound UDP and TCP port 53 traffic from the on-premises DNS server CIDR blocks.",
  "keyPoints": [
    "Enables on-premises DNS servers to query Route 53 Private Hosted Zones in AWS.",
    "Provisions dedicated ENIs with private IP addresses inside your VPC subnets.",
    "Requires deployment across at least two subnets in different Availability Zones for high availability.",
    "Operates over AWS Direct Connect, AWS Site-to-Site VPN, or Transit Gateway connections.",
    "Controlled via attached VPC Security Groups permitting inbound UDP/TCP port 53 traffic.",
    "On-premises DNS servers configure conditional forwarding rules pointing to the Inbound Endpoint IP addresses."
  ],
  "commonMistake": "Confusing Inbound Endpoints with Outbound Endpoints. Inbound Endpoints allow ON-PREMISES to query AWS; Outbound Endpoints allow AWS to query ON-PREMISES.",
  "example": "Create a Route 53 Resolver Inbound Endpoint across two subnets using the AWS CLI: aws route53resolver create-resolver-endpoint --creator-request-id $(date +%s) --name Inbound-DNS --security-group-ids sg-inbound-dns --direction INBOUND --ip-addresses SubnetId=subnet-111 SubnetId=subnet-222.",
  "sources": [
    {
      "title": "Forwarding Inbound DNS Queries to Your VPCs in Route 53",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-forwarding-inbound-queries.html"
    },
    {
      "title": "Route 53 Resolver Endpoints Overview",
      "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-endpoints.html"
    }
  ]
});
