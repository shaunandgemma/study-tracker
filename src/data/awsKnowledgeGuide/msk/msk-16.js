import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-msk",
  "topicTitle": "Amazon MSK (Managed Streaming for Apache Kafka)",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "msk-16",
  "title": "VPC Networking",
  "plainEnglish": "VPC Networking in Amazon MSK controls how Kafka brokers and client applications securely communicate inside your Amazon Virtual Private Cloud (VPC). When you create an MSK cluster, Amazon MSK attaches dedicated Elastic Network Interfaces (ENIs) to your chosen private subnets across two or three Availability Zones, placing your brokers inside your private VPC network boundary with private IP addresses.",
  "whyItMatters": "Streaming architectures handle critical business data that must not be exposed to the public internet. Deploying MSK within private subnets protects brokers behind VPC Security Groups, while networking features like VPC Peering, AWS Transit Gateway, and Multi-VPC Private Connectivity (AWS PrivateLink) allow clients across multiple VPCs or accounts to stream data privately and securely.",
  "workplaceExample": "An enterprise runs microservices across 5 different AWS accounts and VPCs. The centralized data engineering team deploys a shared Amazon MSK cluster inside a dedicated core VPC. Using MSK Multi-VPC Private Connectivity (powered by AWS PrivateLink), microservices in the other 4 VPCs connect privately to the MSK cluster without configuring complex VPC peering meshes or managing transit gateways.",
  "examFocus": "Understand MSK VPC networking concepts: (1) Broker Subnets: Brokers must reside in private subnets across 2 or 3 AZs with sufficient available IP addresses. (2) Security Groups: Must allow inbound TCP traffic from clients on the relevant Kafka ports (9092 for plaintext, 9094 for TLS, 9096 for SASL/SCRAM, 9098 for IAM). (3) Multi-VPC connectivity: Uses AWS PrivateLink to allow cross-VPC and cross-account client connections. (4) Public Access: Supported optionally on provisioned clusters with TLS and SASL/SCRAM or IAM auth.",
  "keyPoints": [
    "Brokers attach dedicated Elastic Network Interfaces (ENIs) to private subnets across 2 or 3 Availability Zones.",
    "Network security is controlled via VPC Security Groups attached to the MSK broker ENIs.",
    "Security groups must open inbound ports: 9092 (Plaintext), 9094 (TLS/mTLS), 9096 (SASL/SCRAM), 9098 (IAM).",
    "Supports cross-VPC connectivity via VPC Peering, AWS Transit Gateway, and MSK Multi-VPC Private Connectivity (AWS PrivateLink).",
    "Public access can be enabled optionally for provisioned clusters over TLS and requires public subnets and authentication.",
    "Subnets must have at least 2 available IP addresses per broker per AZ to support maintenance and broker replacements."
  ],
  "commonMistake": "Forgetting to configure inbound security group rules for the specific Kafka authentication port on the MSK cluster's security group. If port 9098 (IAM) or 9094 (TLS) is blocked, clients will time out attempting to connect to bootstrap brokers.",
  "example": "Configure a Security Group rule allowing inbound IAM-authenticated traffic on port 9098 from a client subnet: aws ec2 authorize-security-group-ingress --group-id sg-msk-brokers --protocol tcp --port 9098 --cidr 10.0.0.0/16.",
  "sources": [
    {
      "title": "Amazon MSK VPC Connectivity and Networking",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/vpc-connectivity.html"
    },
    {
      "title": "Multi-VPC Private Connectivity in Amazon MSK",
      "url": "https://docs.aws.amazon.com/msk/latest/developerguide/multi-vpc.html"
    }
  ]
});
