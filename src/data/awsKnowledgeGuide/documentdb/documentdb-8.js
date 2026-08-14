import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'documentdb-8',
  topicId: 'topic-documentdb',
  topicTitle: 'Amazon DocumentDB',
  objectiveCode: 'Databases',
  title: 'DocumentDB Multi-AZ High Availability',
  status: 'ready',
  plainEnglish: 'DocumentDB Multi-AZ High Availability ensures continuous database availability by deploying compute DB instances (Primary and Read Replicas) across multiple Availability Zones in an AWS Region. Because the cluster storage volume automatically replicates data 6-ways across 3 AZs, an AZ or server hardware outage does not cause data loss or extended downtime.',
  whyItMatters: 'Datacenter power outages or network disruptions happen. Multi-AZ deployment ensures your production database automatically survives physical facility failures without operator intervention.',
  workplaceExample: 'An online banking service deploys a Multi-AZ DocumentDB cluster with a Primary in `us-east-1a` and Read Replicas in `us-east-1b` and `us-east-1c`. When `us-east-1a` experiences a power failure, DocumentDB automatically promotes the replica in `us-east-1b` to Primary in under 30 seconds.',
  examFocus: 'SAA-C03 Multi-AZ resilience:\n- Storage is ALWAYS Multi-AZ (replicated 6 ways across 3 AZs by default).\n- Compute Multi-AZ is achieved by provisioning at least one Read Replica in a different AZ from the Primary.\n- Failover is automatic: DocumentDB promotes a replica in another AZ to Primary.',
  keyPoints: [
    'Combines 6-way storage replication across 3 AZs with Multi-AZ compute instance placement.',
    'Protects against instance failures, host hardware failures, and AZ outages.',
    'Automatic failover promotes a Read Replica in another AZ to Primary.',
    'Cluster Endpoint DNS updates automatically to point to the new Primary.',
    'Downtime during failover is typically 30 seconds or less.'
  ],
  commonMistake: 'Deploying a DocumentDB cluster with only a single Primary instance in 1 AZ and expecting instant Multi-AZ failover. To enable fast automatic failover, you MUST provision at least one Read Replica in a second AZ.',
  example: 'Multi-AZ Instance Distribution:\n- Primary: `docdb-instance-1` in `us-east-1a`\n- Replica 1: `docdb-instance-2` in `us-east-1b`\n- Replica 2: `docdb-instance-3` in `us-east-1c`',
  sources: [
    { title: 'Amazon DocumentDB High Availability and Replication', url: 'https://docs.aws.amazon.com/documentdb/latest/devguide/replication.html' }
  ]
});
