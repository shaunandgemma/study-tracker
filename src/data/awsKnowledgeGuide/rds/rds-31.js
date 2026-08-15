import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-31',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS High Availability vs Read Scaling',
  status: 'ready',
  plainEnglish: 'Database system architecture requires distinguishing High Availability (resiliency against infrastructure failure) from Read Scaling (handling increasing query volume):\n- High Availability (HA): Achieved via RDS Multi-AZ deployments with automatic DNS failover, zero data loss synchronous storage replication, and multi-datacenter redundancy.\n- Read Scaling: Achieved via RDS Read Replicas (or Aurora Readers) by splitting application read and write traffic across multiple active database instances.',
  whyItMatters: 'Designing a database for scalability without HA creates an environment vulnerable to single-AZ datacenter outages. Designing for HA without read scaling creates a database that crashes when user traffic spikes.',
  workplaceExample: 'An enterprise healthcare platform deploys a Multi-AZ primary database to guarantee 99.95% uptime SLA for patient updates. To support 50,000 clinic workers generating daily reports, they attach 4 Read Replicas dedicated to report generation.',
  examFocus: 'SAA-C03 Architectural Trade-Offs:\n- Scaling Limits: Vertical scaling (modifying instance class) scales write capacity; Read Replicas scale read capacity horizontally.\n- Data Consistency: HA (Multi-AZ) guarantees strong synchronous consistency; Read Scaling relies on eventual consistency due to asynchronous replication lag.\n- Connection Routing: Use separate application connection pools for Write Endpoints (Primary/Multi-AZ) and Read Endpoints (Read Replicas).',
  keyPoints: [
    'HA protects database uptime against hardware and Availability Zone failures.',
    'Read Scaling distributes SQL read workloads across multiple compute instances.',
    'Multi-AZ synchronous replication guarantees strong data consistency for HA.',
    'Read Replicas use eventual consistency due to asynchronous replication lag.',
    'Enterprise architectures combine Multi-AZ (HA) with Read Replicas (Read Scaling).'
  ],
  commonMistake: 'Attempting to scale SQL `INSERT`/`UPDATE` write capacity by adding Read Replicas. Relational writes MUST execute on the Primary database instance.',
  example: 'Application Connection Pool Separation:\n- Primary Write Connection: prod-db.c123.us-east-1.rds.amazonaws.com:5432 (Multi-AZ HA)\n- Reporting Read Connection: prod-db-replica-1.c123.us-east-1.rds.amazonaws.com:5432 (Read Scaling)',
  sources: [
    { title: 'High availability and read scaling in Amazon RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' }
  ]
});
