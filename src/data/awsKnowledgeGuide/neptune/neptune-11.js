import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-11',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Multi-AZ High Availability',
  status: 'ready',
  plainEnglish: 'Neptune Multi-AZ High Availability is an enterprise deployment model where the Primary Writer instance and one or more Read Replica instances are placed in different Availability Zones within an AWS Region. Combined with 6-way storage replication across 3 AZs, Multi-AZ deployments guarantee automatic instance failover and data durability.',
  whyItMatters: 'If a physical datacenter (AZ) experiences a power outage or network disruption, a Multi-AZ Neptune deployment maintains continuous graph availability by promoting a Read Replica in another AZ to Primary Writer automatically.',
  workplaceExample: 'A bank deploys a Multi-AZ Neptune cluster with Writer in `us-east-1a` and Replica in `us-east-1b`. When `us-east-1a` fails, AWS automatically promotes the `1b` replica to Writer and updates DNS within 30-120 seconds.',
  examFocus: 'SAA-C03 Multi-AZ High Availability:\n- Deployment Requirement: Create at least 1 Read Replica in a different Availability Zone from the Primary Writer.\n- Automatic Promotion: AWS automatically promotes the highest-priority Read Replica to Primary Writer during an outage.\n- Shared Storage: Data is already present on the shared 6-way replicated storage volume; no storage resync required.\n- SLA: Required to qualify for the Amazon Neptune Service Level Agreement (SLA).',
  keyPoints: [
    'Deploys Writer and Read Replica DB instances across separate Availability Zones.',
    'Combines DB instance redundancy with 6-way storage volume replication.',
    'Enables automatic, unattended failover if the primary AZ or Writer instance fails.',
    'No storage resync required during failover because storage is shared across AZs.',
    'Required for production cluster SLA eligibility on AWS.'
  ],
  commonMistake: 'Deploying a single DB instance cluster in one AZ and expecting high availability during a datacenter facility outage.',
  example: 'Creating a Multi-AZ Neptune Cluster with Replica in secondary AZ via AWS CLI:\naws neptune create-db-instance --db-instance-identifier neptune-writer --db-cluster-identifier prod-cluster --db-instance-class db.r6g.xlarge --availability-zone us-east-1a --engine neptune\naws neptune create-db-instance --db-instance-identifier neptune-replica-az2 --db-cluster-identifier prod-cluster --db-instance-class db.r6g.xlarge --availability-zone us-east-1b --engine neptune',
  sources: [
    { title: 'Amazon Neptune high availability', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview.html#feature-overview-ha' }
  ]
});
