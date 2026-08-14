import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-15',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB VPC and Security Groups',
  status: 'ready',
  plainEnglish: 'Amazon DocumentDB clusters run strictly inside your Amazon Virtual Private Cloud (VPC). DocumentDB endpoints are assigned private IP addresses within your VPC subnets and CANNOT be publicly accessed directly over the internet. Access to the DocumentDB port (default TCP 27017) is controlled by VPC Security Groups attached to the DocumentDB cluster.',
  whyItMatters: 'Enforcing VPC-only network isolation prevents internet-facing database exposure. Restricting security group access to specific application tiers (like EC2 web servers or ECS tasks) creates a robust defense-in-depth network boundary.',
  workplaceExample: 'A company deploys DocumentDB into private database subnets across 3 AZs. They attach a security group (`docdb-sg`) allowing inbound TCP port 27017 ONLY from the web application security group (`web-app-sg`). Direct access from the internet or unauthorized subnets is completely blocked.',
  examFocus: 'SAA-C03 DocumentDB Networking rules:\n- DocumentDB clusters are VPC-bound (no public IP addresses on DB instances).\n- Default port: TCP 27017.\n- Use Security Group Chaining: Inbound rule on `docdb-sg` allows port 27017 with Source set to `web-app-sg` ID.\n- To access DocumentDB from outside the VPC: Use an SSH Bastion host, AWS Client VPN, or VPC Peering / Transit Gateway.',
  keyPoints: [
    'Clusters reside strictly inside a VPC (no public IP endpoints).',
    'Uses Subnet Groups spanning at least 2 or 3 Availability Zones.',
    'Default database port is TCP 27017.',
    'Security Groups control inbound network access at the ENI level.',
    'Access from outside the VPC requires VPN, Transit Gateway, or SSH Bastion.'
  ],
  commonMistake: 'Attempting to assign a public IP address to a DocumentDB instance for direct home internet debugging. DocumentDB does not support public IPs; connect via AWS VPN or an SSH bastion host inside the VPC.',
  example: 'Security Group Inbound Rule for DocumentDB:\nType: Custom TCP Rule | Port Range: 27017 | Source: `sg-0123456789abcdef0` (Web Server SG).',
  sources: [
    { title: 'Amazon DocumentDB Cluster Security Groups', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/db-cluster-fault-tolerance.html' }
  ]
});
