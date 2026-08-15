import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'mgn-8',
  topicId: 'topic-mgn',
  topicTitle: 'AWS MGN (Application Migration Service)',
  objectiveCode: 'Management',
  title: 'Replication Servers',
  status: 'ready',
  plainEnglish: 'AWS MGN Replication Servers are lightweight Amazon EC2 instances automatically provisioned and managed by MGN in your staging subnet. Their sole function is to receive encrypted block-level data streams from AWS Replication Agents on port 1500 and write those blocks directly to compressed, encrypted staging Amazon EBS volumes.',
  whyItMatters: 'Replication Servers handle background data ingestion without manual server management. MGN automatically scales and consolidates multiple source disk replications onto a single Replication Server (up to 15 source disks per server), reducing monthly staging infrastructure costs.',
  workplaceExample: 'An MGN deployment migrates 5 source servers with 12 total disks. MGN automatically provisions 1 `t3.small` Replication Server in the staging subnet. The single Replication Server manages all 12 attached staging EBS volumes until cutover testing.',
  examFocus: 'SAA-C03 Replication Server Operation:\n- Automatic Management: Provisioned, updated, and terminated automatically by AWS MGN.\n- Ratio: A single Replication Server can handle up to 15 replicated source disks.\n- Security Group: Automatically configured with inbound TCP 1500 allowed from source servers.\n- Lifespan: Temporary infrastructure that exists only while continuous replication is active.',
  keyPoints: [
    'Lightweight EC2 instances automatically provisioned by MGN in the staging subnet.',
    'Receives incoming block replication traffic on TCP 1500 from source agents.',
    'Writes replicated block data directly to staging EBS volumes.',
    'Consolidates up to 15 source disks per Replication Server for cost efficiency.',
    'Managed entirely by AWS MGN and terminated when migration is finalized.'
  ],
  commonMistake: 'Manually terminating or modifying Replication Servers in the EC2 Console, disrupting active source server replication.',
  example: 'Viewing Active Replication Servers via AWS CLI:\naws ec2 describe-instances --filters "Name=tag:aws:mgn:created-by,Values=AWS Application Migration Service"',
  sources: [
    { title: 'Replication server options', url: 'https://docs.aws.amazon.com/mgn/latest/ug/staging-area.html#replication-servers' }
  ]
});
