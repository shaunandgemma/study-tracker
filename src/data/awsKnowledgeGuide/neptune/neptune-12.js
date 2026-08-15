import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'neptune-12',
  topicId: 'topic-neptune',
  topicTitle: 'Amazon Neptune',
  objectiveCode: 'Databases',
  title: 'Neptune Automatic Failover',
  status: 'ready',
  plainEnglish: 'Neptune Automatic Failover is the self-healing process where Amazon Neptune detects a Primary Writer instance failure (or AZ outage) and automatically promotes an existing Read Replica to become the new Primary Writer. During failover, Neptune updates the Cluster Endpoint DNS CNAME to point to the newly promoted Writer instance.',
  whyItMatters: 'Manual failover requires operators to get alerted, inspect logs, promote replicas, and update application connection strings. Automatic failover completes the entire promotion and DNS update in 30 to 120 seconds.',
  workplaceExample: 'During an unexpected hardware fault on the Primary Writer, Neptune initiates automatic failover. It promotes `neptune-replica-1` (in tier 0) to Primary Writer, flips the Cluster Endpoint DNS, and resumes graph write processing within 60 seconds.',
  examFocus: 'SAA-C03 Failover Mechanics & Client Resilience:\n- Promotion Rules: Promotes the Read Replica with the highest Promotion Tier (Tier 0 is highest priority; Tier 15 is lowest).\n- Connection Interruption: Existing TCP connections are dropped during failover.\n- Application Requirement: Applications MUST use the Cluster Endpoint and implement retry logic to handle temporary connection drops.\n- Zero Data Loss: Shared storage volume ensures zero data loss during compute instance failover.',
  keyPoints: [
    'Self-healing mechanism that promotes a Read Replica to Writer during an outage.',
    'Completes failover and updates Cluster Endpoint DNS in 30 to 120 seconds.',
    'Uses Promotion Tiers (0 to 15) to specify which Read Replica is promoted first.',
    'Guarantees zero storage data loss due to the underlying shared 6-way storage volume.',
    'Requires client applications to implement connection retry logic.'
  ],
  commonMistake: 'Hardcoding the specific DB Instance Endpoint (`neptune-writer-1.c123.us-east-1.neptune.amazonaws.com`) in application code instead of using the Cluster Endpoint CNAME.',
  example: 'Forcing a Manual Test Failover via AWS CLI:\naws neptune failover-db-cluster --db-cluster-identifier prod-neptune-cluster',
  sources: [
    { title: 'Fault tolerance for Neptune DB clusters', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview-fault-tolerance.html' }
  ]
});
