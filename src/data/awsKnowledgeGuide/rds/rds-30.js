import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-30',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Multi-AZ vs Read Replicas',
  status: 'ready',
  plainEnglish: 'Amazon RDS Multi-AZ and Read Replicas address fundamentally different database operational goals:\n- Multi-AZ Deployment: High Availability (HA) & Disaster Recovery mechanism within a Region. Uses synchronous storage replication to a passive standby in a 2nd AZ. Standby instance CANNOT serve read queries.\n- Read Replicas: High Scalability (Read Performance) mechanism. Uses asynchronous engine replication (up to 15 replicas). Replicas CAN serve read queries.',
  whyItMatters: 'Confusing Multi-AZ and Read Replicas is a top architectural mistake. Using Read Replicas for HA leaves you vulnerable to data loss during failure (due to asynchronous lag); using Multi-AZ for read scaling fails because standby instances reject read connections.',
  workplaceExample: 'A high-traffic web application combines BOTH features: They configure Multi-AZ on the primary instance for 99.95% HA automatic failover, and add 3 Read Replicas to handle heavy web analytics read traffic.',
  examFocus: 'SAA-C03 Decision Matrix (Multi-AZ vs Read Replicas):\n- Primary Goal: High Availability / Failover -> Multi-AZ. Read Performance / Scalability -> Read Replicas.\n- Replication Sync: Multi-AZ is Synchronous. Read Replicas are Asynchronous.\n- Read Access: Multi-AZ Standby is Unreadable (traditional). Read Replicas are Readable.\n- Scope: Multi-AZ is Single Region (2 AZs). Read Replicas can be Cross-Region.',
  keyPoints: [
    'Multi-AZ provides High Availability (HA) via synchronous replication to a passive standby.',
    'Read Replicas provide Read Scalability via asynchronous engine replication (up to 15).',
    'Multi-AZ Standby instances cannot serve read or write SQL connections (traditional).',
    'Read Replicas actively serve read-only (`SELECT`) SQL query workloads.',
    'Best practice combines BOTH Multi-AZ (for HA) and Read Replicas (for Read Scaling).'
  ],
  commonMistake: 'Relying on a single Read Replica as a High Availability failover solution without Multi-AZ, risking data loss during failover due to asynchronous replication lag.',
  example: 'Comparison Summary:\n- Synchronous + Passive + 2 AZs + Auto-Failover = Multi-AZ (HA)\n- Asynchronous + Active Read + Up to 15 Instances + Cross-Region = Read Replicas (Scalability)',
  sources: [
    { title: 'Amazon RDS Multi-AZ deployments vs Read Replicas', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' }
  ]
});
