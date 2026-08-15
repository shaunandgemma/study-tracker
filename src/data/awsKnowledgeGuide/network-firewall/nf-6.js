import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-network-firewall",
  "topicTitle": "AWS Network Firewall",
  "objectiveCode": "Security",
  "status": "ready",
  "id": "nf-6",
  "title": "Dedicated Firewall Subnets",
  "plainEnglish": "A Dedicated Firewall Subnet in AWS Network Firewall is a VPC subnet created exclusively to host the AWS Network Firewall endpoint ENI in a specific Availability Zone. Best practices and AWS architectural requirements dictate that no other EC2 instances, NAT Gateways, Application Load Balancers, or workloads should ever be deployed inside these dedicated firewall subnets.",
  "whyItMatters": "Deploying firewall endpoints into dedicated subnets with isolated route tables is required to construct clean, loop-free routing topologies. If workloads or NAT Gateways share the same subnet as the firewall endpoint, VPC local route tables cannot distinguish between un-inspected source traffic and post-inspection forwarded traffic, causing routing loops or traffic bypassing the firewall.",
  "workplaceExample": "A network team designs a three-tier VPC in `us-east-1` across 2 AZs: (1) Workload Subnets (for application EC2 instances and containers), (2) Firewall Subnets (containing ONLY the `vpce-xxxx` firewall endpoints), and (3) Public NAT Gateway Subnets (containing NAT Gateways and Internet Gateways). Traffic flows sequentially: Workload Subnet -> Firewall Subnet -> NAT Subnet -> Internet Gateway, ensuring complete inspection isolation.",
  "examFocus": "Understand dedicated firewall subnet design rules: (1) One dedicated subnet per Availability Zone where the firewall operates. (2) Minimum recommended subnet mask is `/28` (providing sufficient private IP addresses for the firewall endpoint and AWS networking management). (3) The firewall subnet route table routes post-inspection traffic to the next destination (e.g., to the NAT Gateway or Internet Gateway). (4) Never place application workloads inside firewall subnets.",
  "keyPoints": [
    "Subnets created exclusively for hosting the AWS Network Firewall endpoint ENI.",
    "Must not contain any other resources (no EC2 instances, NAT Gateways, or load balancers).",
    "Requires a minimum subnet size of at least /28 (16 IP addresses) per Availability Zone.",
    "Enables clean separation of routing concerns between pre-inspection and post-inspection traffic.",
    "The firewall subnet route table defines the next downstream hop (e.g., NAT Gateway for egress, or Workload Subnet for ingress).",
    "Prevents routing loops and ensures no network traffic can bypass firewall inspection."
  ],
  "commonMistake": "Deploying EC2 application instances or NAT Gateways directly inside the dedicated firewall subnet. Placing other resources in the firewall subnet causes routing conflicts and prevents the creation of dedicated pre- and post-inspection route tables.",
  "example": "Create a dedicated /28 firewall subnet in AZ-a using the AWS CLI: aws ec2 create-subnet --vpc-id vpc-01234567 --cidr-block 10.0.0.32/28 --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=Firewall-Subnet-AZ1}]'.",
  "sources": [
    {
      "title": "Subnet Requirements for AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/firewall-subnets.html"
    },
    {
      "title": "Routing Examples and Subnet Configurations in AWS Network Firewall",
      "url": "https://docs.aws.amazon.com/network-firewall/latest/developerguide/route-tables.html"
    }
  ]
});
