import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-8',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Multi-AZ Deployments',
  status: 'ready',
  plainEnglish: 'RDS Multi-AZ Deployment is a high-availability architecture that automatically provisions and maintains a synchronous Standby replica in a different Availability Zone within the same AWS Region. All database writes are synchronously replicated to the standby storage. If the primary instance fails or the AZ experiences an outage, RDS performs automatic failover to the standby in 60 to 120 seconds.',
  whyItMatters: 'A single-instance database in a single Availability Zone represents a critical single point of failure. Multi-AZ deployment guarantees high availability (99.95% SLA) and data durability across physical datacenter outages.',
  workplaceExample: 'A banking application runs RDS PostgreSQL in Multi-AZ mode (`Primary` in `us-east-1a`, `Standby` in `us-east-1b`). When a lightning storm damages `us-east-1a`, RDS automatically promotes `us-east-1b` to Primary and flips the database DNS endpoint without manual intervention.',
  examFocus: 'SAA-C03 Multi-AZ High Availability Mechanics:\n- Synchronous Storage Replication: Data writes are confirmed on BOTH primary and standby storage before returning success.\n- Passive Standby: In traditional Multi-AZ DB Instance mode, the Standby instance is PASSIVE and CANNOT serve read or write queries!\n- Failover Time: Automatic failover typically completes in 60 to 120 seconds by updating DNS CNAME record.\n- Application Requirement: Applications must handle temporary connection drops and reconnect using the same DB Endpoint DNS.',
  keyPoints: [
    'Provides high availability and automatic failover across 2 Availability Zones.',
    'Uses synchronous physical block-level storage replication.',
    'Passive Standby instance CANNOT accept read or write connections.',
    'Automatic failover completes in 60-120 seconds by updating the DB Endpoint DNS CNAME.',
    'Required for production workloads to qualify for the Amazon RDS SLA.'
  ],
  commonMistake: 'Attempting to execute SQL `SELECT` queries against a traditional Multi-AZ passive Standby instance to scale read traffic. Use Read Replicas for read scaling.',
  example: 'Enabling Multi-AZ on an RDS DB Instance via AWS CLI:\naws rds modify-db-instance --db-instance-identifier prod-db --multi-az --apply-immediately',
  sources: [
    { title: 'Amazon RDS Multi-AZ deployments', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' }
  ]
});
