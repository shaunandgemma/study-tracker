import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-22',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS DB Subnet Groups',
  status: 'ready',
  plainEnglish: 'A DB Subnet Group is a collection of private subnets that you create in your VPC and designate for your Amazon RDS database instances. A DB Subnet Group MUST contain subnets spanning at least two distinct Availability Zones within the chosen AWS Region.',
  whyItMatters: 'RDS requires a multi-AZ subnet definition to provision Multi-AZ Standby instances or execute automatic failovers across Availability Zones. Defining a DB Subnet Group ensures RDS deploys database network interfaces strictly inside isolated private subnets.',
  workplaceExample: 'A DevOps engineer provisions a DB Subnet Group named `rds-private-subnet-group` containing `subnet-private-1a` and `subnet-private-1b`. When deploying a Multi-AZ MySQL database, RDS places the primary instance in 1a and the standby in 1b.',
  examFocus: 'SAA-C03 DB Subnet Group Requirements:\n- Multi-AZ Prerequisite: Must contain private subnets in at least TWO Availability Zones in the region.\n- Single VPC Limit: A DB Subnet Group belongs to a single VPC.\n- Private Subnet Isolation: Best practice requires adding ONLY private subnets (subnets with route tables pointing to NAT Gateways or local routes, not Internet Gateways).',
  keyPoints: [
    'Collection of subnets in a VPC designated for RDS DB instance placement.',
    'Must span at least two Availability Zones in the chosen AWS Region.',
    'Prerequisite for deploying Multi-AZ DB instances and Multi-AZ DB clusters.',
    'Ensures database Network Interfaces (ENIs) are provisioned inside isolated subnets.',
    'Should contain only private subnets without direct Internet Gateway routes.'
  ],
  commonMistake: 'Creating a DB Subnet Group with subnets in only 1 Availability Zone, preventing RDS from enabling Multi-AZ high availability or Read Replica creation.',
  example: 'Creating a DB Subnet Group via AWS CLI:\naws rds create-db-subnet-group --db-subnet-group-name rds-priv-subnets --db-subnet-group-description "Private subnets for RDS" --subnet-ids subnet-11111111 subnet-22222222',
  sources: [
    { title: 'Working with DB subnet groups in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html#USER_VPC.Subnets' }
  ]
});
