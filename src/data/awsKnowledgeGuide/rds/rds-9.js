import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-9',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Multi-AZ DB Clusters',
  status: 'ready',
  plainEnglish: 'An RDS Multi-AZ DB Cluster is an advanced deployment option (supported for PostgreSQL and MySQL) that provisions 1 Primary Writer DB instance and 2 Readable Standby DB instances across 3 separate Availability Zones. Unlike traditional Multi-AZ (where the standby is passive), Multi-AZ DB Clusters feature READABLE standbys that serve read queries and deliver faster failover (under 35 seconds).',
  whyItMatters: 'Traditional Multi-AZ deployment keeps standby compute instances idle. Multi-AZ DB Clusters utilize all 3 provisioned instances—offloading read traffic to readable standbys while lowering failover times using NVMe SSD transaction log replication.',
  workplaceExample: 'An e-commerce platform deploys a Multi-AZ DB Cluster across 3 AZs. The primary instance processes orders, while 2 readable standby instances serve product search queries and reduce failover duration to under 30 seconds during an AZ outage.',
  examFocus: 'SAA-C03 Multi-AZ DB Cluster Architecture:\n- Cluster Topology: 1 Writer DB Instance + 2 Readable Standby DB Instances deployed across 3 AZs.\n- Readable Standbys: Standby instances CAN serve read queries, combining High Availability and Read Scaling.\n- Faster Failover: Typically fails over in under 35 seconds (vs 60-120 seconds for standard Multi-AZ).\n- Transaction Log Storage: Uses local NVMe SSD storage for low-latency transaction log replication.',
  keyPoints: [
    'Deploys 1 Writer and 2 Readable Standby DB instances across 3 Availability Zones.',
    'Standby instances ARE readable, providing built-in read scaling.',
    'Provides faster automatic failover (typically under 35 seconds).',
    'Uses local NVMe SSD storage for low-latency transaction log replication.',
    'Supported for RDS PostgreSQL and RDS MySQL engines.'
  ],
  commonMistake: 'Confusing traditional Multi-AZ DB Instances (passive standby in 2 AZs, unreadable) with Multi-AZ DB Clusters (readable standbys in 3 AZs, faster failover).',
  example: 'Creating a Multi-AZ DB Cluster via AWS CLI:\naws rds create-db-cluster --db-cluster-identifier prod-cluster --engine postgres --engine-version 15.4 --allocated-storage 200 --master-username dbadmin --master-user-password "SecurePass123!" --storage-type io1 --iops 10000',
  sources: [
    { title: 'Multi-AZ DB cluster deployments for Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html' }
  ]
});
