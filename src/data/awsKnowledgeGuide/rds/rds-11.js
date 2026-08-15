import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'rds-11',
  topicId: 'topic-rds',
  topicTitle: 'Amazon RDS',
  objectiveCode: 'Databases',
  title: 'RDS Cross-Region Read Replicas',
  status: 'ready',
  plainEnglish: 'RDS Cross-Region Read Replicas allow creating asynchronously replicated read-only DB instances in a different AWS Region from the primary database. Cross-Region Read Replicas serve two key operational goals: serving low-latency local read traffic to users in different geographical regions, and acting as a cross-region Disaster Recovery (DR) solution.',
  whyItMatters: 'If a regional disaster impacts your primary AWS Region (e.g. `us-east-1`), a Cross-Region Read Replica in `eu-west-1` can be promoted to a standalone primary database, recovering business operations in minutes.',
  workplaceExample: 'A global SaaS firm hosts its primary database in `us-east-1` (N. Virginia). They provision a Cross-Region Read Replica in `ap-southeast-1` (Singapore) to serve low-latency queries to Asian customers while establishing a cross-region DR baseline.',
  examFocus: 'SAA-C03 Cross-Region Read Replica Mechanics:\n- Cross-Region DR RTO/RPO: Can be promoted to an independent read/write database during a regional disaster.\n- Encryption: Requires configuring KMS keys in the destination region for encrypted primary databases.\n- Network Cost: Incurs AWS inter-region data transfer charges for streaming transaction logs between regions.',
  keyPoints: [
    'Asynchronously replicates database updates to a secondary AWS Region.',
    'Reduces read latency for international users by serving queries locally.',
    'Provides multi-region Disaster Recovery (DR) capabilities via replica promotion.',
    'Incurs inter-region network data transfer charges for transaction log streaming.',
    'Encrypted primary databases require destination-region KMS key configuration.'
  ],
  commonMistake: 'Expecting Cross-Region Read Replicas to automatically fail over and update application connection endpoints across regions without explicit promotion scripts.',
  example: 'Creating a Cross-Region Read Replica via AWS CLI:\naws rds create-db-instance-read-replica --db-instance-identifier dr-replica-eu --source-db-instance-identifier arn:aws:rds:us-east-1:123456789012:db:prod-db --region eu-west-1 --db-instance-class db.r6g.large',
  sources: [
    { title: 'Creating a Read Replica in another AWS Region', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.XRconn.html' }
  ]
});
