import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'redshift-23',
  topicId: 'topic-redshift',
  topicTitle: 'Amazon Redshift',
  objectiveCode: 'Databases',
  title: 'Redshift Cross-Region Snapshot Copy',
  status: 'ready',
  plainEnglish: 'Cross-Region Snapshot Copy automatically replicates Amazon Redshift automated or manual cluster snapshots to a secondary destination AWS Region. This provides multi-region disaster recovery (DR) capabilities, allowing you to restore a fully functional data warehouse in a secondary region if the primary region suffers a catastrophic outage.',
  whyItMatters: 'A regional disaster (like a hurricane or major fiber outage in `us-east-1`) can render local backups inaccessible. Cross-Region Snapshot Copy ensures that fresh cluster backups are safely stored in `us-west-2` for rapid DR recovery.',
  workplaceExample: 'A financial services firm runs a primary Redshift cluster in `us-east-1`. They configure Cross-Region Snapshot Copy to replicate automated snapshots to `us-west-2`, retaining 14 daily snapshots for disaster recovery compliance.',
  examFocus: 'SAA-C03 Cross-Region Snapshot Copy Mechanics:\n- Automated Replication: Automatically copies automated and manual snapshots to a secondary target AWS Region.\n- Snapshot Copy Grants: Requires configuring a Snapshot Copy Grant in the destination region to re-encrypt snapshots with a destination KMS key.\n- Retention Configuration: Set separate snapshot retention periods for the primary region and the destination region.\n- Disaster Recovery RTO/RPO: Delivers low Recovery Point Objective (RPO) for multi-region business continuity.',
  keyPoints: [
    'Automatically replicates automated and manual snapshots to a secondary AWS Region.',
    'Provides multi-region disaster recovery (DR) and business continuity capabilities.',
    'Requires a Snapshot Copy Grant to re-encrypt snapshots with a target KMS key.',
    'Allows setting independent snapshot retention rules in the destination region.',
    'Enables restoring a functional Redshift cluster in a secondary region during an outage.'
  ],
  commonMistake: 'Configuring Cross-Region Snapshot Copy for encrypted clusters without creating a KMS Snapshot Copy Grant in the destination region, causing snapshot replication failures.',
  example: 'Configuring Cross-Region Snapshot Copy via AWS CLI:\naws redshift enable-snapshot-copy --cluster-identifier prod-cluster --destination-region us-west-2 --retention-period 14 --snapshot-copy-grant-name uswest2-copy-grant',
  sources: [
    { title: 'Copying Redshift snapshots to another AWS Region', url: 'https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html#cross-region-snapshot-copy' }
  ]
});
