import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-16',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune VPC Deployment',
  status: 'ready',
  plainEnglish: 'Amazon Neptune database clusters must run inside an Amazon Virtual Private Cloud (VPC) in private subnets across at least two Availability Zones. Neptune endpoints are assigned private IP addresses within your VPC, restricting database access to authorized applications via VPC Security Groups, Network ACLs, and IAM Database Authentication.',
  whyItMatters: 'Graph databases store core relationship networks (user social connections, financial transactions). Running Neptune inside private VPC subnets ensures database endpoints are isolated from internet access.',
  workplaceExample: 'An enterprise provisions a Neptune cluster in private subnets (`subnet-priv-1a`, `subnet-priv-1b`). A Security Group (`sg-neptune`) permits inbound TCP port 8182 strictly from the App Server Security Group (`sg-app`). The database cannot be reached from the public internet.',
  examFocus: 'SAA-C03 VPC Networking Architecture:\n- Mandatory VPC Isolation: Neptune MUST run inside a VPC; public IP endpoints are NOT supported.\n- Subnet Group: Requires a Neptune DB Subnet Group spanning at least 2 Availability Zones.\n- Security Groups: Restrict inbound TCP traffic on port 8182 to specific application security groups.\n- IAM DB Authentication: Optional IAM Signature Version 4 (SigV4) signing for database connections.\n- VPC Endpoints: Use S3 VPC Gateway Endpoints to allow Neptune to bulk load data from Amazon S3 privately.',
  keyPoints: [
    'Neptune clusters run exclusively inside an Amazon VPC in private subnets.',
    'Requires a DB Subnet Group spanning at least 2 Availability Zones.',
    'Neptune endpoints have private IP addresses and are not publicly accessible.',
    'Security Groups control inbound access on default graph port 8182.',
    'Integrates with S3 Gateway VPC Endpoints for private bulk data loading.'
  ],
  commonMistake: 'Attempting to assign a public IP address to a Neptune cluster endpoint. Neptune is strictly a VPC-private database service.',
  example: 'Creating a Neptune DB Subnet Group via AWS CLI:\naws neptune create-db-subnet-group --db-subnet-group-name neptune-private-subnets --db-subnet-group-description "Private subnets for Neptune" --subnet-ids subnet-11111111 subnet-22222222',
  sources: [
    { title: 'Amazon Neptune VPC security', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/vpc-intro.html' }
  ]
});
