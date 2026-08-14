import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-9',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Automatic Failover',
  status: 'ready',
  plainEnglish: 'DocumentDB Automatic Failover is a self-healing mechanism that automatically detects when the Primary DB instance becomes unhealthy or unreachable. DocumentDB promotes an existing Read Replica to become the new Primary instance and automatically updates the Cluster Endpoint DNS entry so application traffic is seamlessly redirected to the new Primary.',
  whyItMatters: 'Manual database failover requires engineers to detect failures, promote standby servers, update DNS records, and restart applications—taking 30 to 60 minutes. Automatic failover completes in seconds with zero manual intervention.',
  workplaceExample: 'An enterprise application runs on DocumentDB. When the Primary instance host suffers a kernel panic, DocumentDB detects the loss of heartbeats within 15 seconds, promotes Read Replica 1 to Primary, and updates the Cluster Endpoint DNS. The application reconnects automatically after retrying.',
  examFocus: 'SAA-C03 Automatic Failover sequence:\n1. Primary instance fails.\n2. DocumentDB evaluates replica failover priorities (promotion tiers 0 to 15).\n3. Highest priority replica is promoted to Primary.\n4. Cluster Endpoint CNAME record is updated to point to the newly promoted Primary.\n5. Client applications reconnect automatically via connection retries.',
  keyPoints: [
    'Automated recovery promoting a Read Replica to Primary upon failure.',
    'Promotion priority is governed by Failover Tiers (0 to 15, tier 0 being highest priority).',
    'Cluster Endpoint CNAME dynamically updates to point to the new Primary.',
    'If no replicas exist, DocumentDB attempts to recreate a new Primary instance in the same AZ.',
    'Applications should implement standard connection retry logic.'
  ],
  commonMistake: 'Failing to implement connection retry logic in application database connection pools, causing applications to crash permanently on transient 15-second failover errors instead of automatically reconnecting.',
  example: 'Failover Promotion Tier Configuration:\nReplica 1 (AZ-b): Tier 0 (First choice for failover)\nReplica 2 (AZ-c): Tier 1 (Second choice for failover).',
  sources: [
    { title: 'Understanding Amazon DocumentDB Cluster Fault Tolerance', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/db-cluster-fault-tolerance.html' }
  ]
});
