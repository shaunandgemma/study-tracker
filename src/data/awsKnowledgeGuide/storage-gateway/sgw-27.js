import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-27',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Storage Gateway with AWS Backup',
  status: 'ready',
  plainEnglish: 'AWS Backup can centrally protect cached and stored Volume Gateway volumes. A backup plan can schedule recovery points, apply retention rules, and monitor backup and restore jobs. These backups are represented as Amazon EBS snapshots and can be restored as a new Storage Gateway volume or, when suitable, as an Amazon EBS volume. This integration is specifically about Volume Gateway volumes; it must not be confused with AWS Backup gateway, which connects AWS Backup to supported on-premises virtual machines.',
  whyItMatters: 'A cloud-backed volume is not a complete recovery plan by itself. AWS Backup adds central scheduling, retention, monitoring, and policy management across gateway volumes and other supported AWS resources. Restore testing remains essential because a successful backup job does not prove that applications, permissions, networking, and encryption keys will work during recovery.',
  workplaceExample: 'A manufacturer assigns its cached Volume Gateway volumes to an AWS Backup plan with daily recovery points and an approved retention period. The operations team monitors failed jobs centrally and regularly restores a recovery point to a test gateway, confirming the iSCSI target, KMS access, volume size, and application data before documenting the recovery procedure.',
  examFocus: 'SAA-C03 backup boundary:\n- Supported resource: AWS Backup protects cached and stored Volume Gateway volumes.\n- Central control: backup plans provide scheduling, retention, monitoring, and policy-based assignment.\n- Recovery choices: a recovery point can be restored as a gateway volume or an EBS volume.\n- IAM and KMS: AWS Backup requires an appropriate role, and encrypted recovery points require access to the relevant KMS key.\n- Do not confuse services: AWS Backup gateway protects supported virtual machines through a hypervisor connection; it is not the same as backing up a Storage Gateway volume.',
  keyPoints: [
    'AWS Backup supports backup and restore for both cached and stored Volume Gateway volumes.',
    'A backup plan can automate schedules, lifecycle or retention settings, assignments, and job monitoring.',
    'Storage Gateway volume recovery points created through AWS Backup are stored as Amazon EBS snapshots.',
    'A recovery point can be restored to a reachable Storage Gateway or restored as an Amazon EBS volume.',
    'The restore role, gateway state, target name, volume capacity or disk selection, and KMS access must be valid for recovery.',
    'AWS Backup gateway is a separate capability for discovering and protecting supported virtual machines on a connected hypervisor.'
  ],
  commonMistake: 'Assuming that AWS Backup protects every Storage Gateway type. The documented integration protects Volume Gateway volumes; S3 File Gateway files, FSx File Gateway data, and virtual tapes follow the protection model of their respective storage and backup systems.',
  example: 'A backup plan selects a tagged cached volume and creates scheduled recovery points. During a recovery exercise, the team restores one point to a test cached volume with at least the required capacity, supplies a new iSCSI target name, verifies KMS permissions, connects a test initiator, and checks the application data.',
  sources: [
    { title: 'Backing up Storage Gateway volumes', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/backing-up-volumes.html' },
    { title: 'Restore a Storage Gateway volume with AWS Backup', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/restoring-storage-gateway.html' }
  ]
});
