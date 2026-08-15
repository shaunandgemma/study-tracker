import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-18',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Volume Gateway EBS Snapshots',
  status: 'ready',
  plainEnglish: 'Volume Gateway EBS Snapshots are point-in-time backups of gateway volumes stored in Amazon S3. Both cached volumes and stored volumes support creating EBS-compatible snapshots. These snapshots can be used to create EBS volumes that attach to EC2 instances, enabling disaster recovery or migration of on-premises block-storage workloads to AWS.',
  whyItMatters: 'If an on-premises server or data centre fails, EBS snapshots allow the workload to be restored on EC2 within minutes. Snapshots are incremental (only changed blocks are stored), making them storage-efficient and cost-effective for frequent backups.',
  workplaceExample: 'A company takes nightly snapshots of their on-premises ERP database running on a Volume Gateway cached volume. When a regional power outage takes the data centre offline, the DR team creates an EBS volume from the latest snapshot and launches the ERP application on an EC2 instance.',
  examFocus: 'SAA-C03 Volume Gateway Snapshot Features:\n- Incremental: Only blocks changed since the last snapshot are stored, reducing cost and time.\n- EBS Compatible: Snapshots can be restored as standard EBS volumes attachable to EC2 instances.\n- Schedule: Snapshots can be automated through the Storage Gateway console or AWS Backup.\n- Clone Volumes: A snapshot can be used to create a new gateway volume, enabling data cloning.',
  keyPoints: [
    'Point-in-time backups of gateway volumes stored durably in Amazon S3.',
    'Incremental snapshots store only changed blocks since the previous snapshot.',
    'EBS-compatible: restore snapshots as EBS volumes attachable to EC2 instances.',
    'Can be scheduled through the Storage Gateway console or AWS Backup.',
    'Enable disaster recovery by allowing cloud-based restoration of on-premises workloads.'
  ],
  commonMistake: 'Assuming a Volume Gateway snapshot is application-consistent by default. Without quiescing the application or filesystem before snapshotting, the snapshot is crash-consistent only.',
  example: 'Disaster Recovery with Volume Gateway Snapshots:\n1. Schedule nightly snapshots of the on-premises volume.\n2. On-premises failure occurs.\n3. Create an EBS volume from the latest snapshot.\n4. Launch an EC2 instance and attach the EBS volume.\n5. Resume the application in AWS.',
  sources: [
    { title: 'Creating snapshots of Volume Gateway volumes', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/backing-up-volumes.html' }
  ]
});
