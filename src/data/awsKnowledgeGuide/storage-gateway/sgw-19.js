import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-19',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Tape Gateway Virtual Tape Library',
  status: 'ready',
  plainEnglish: 'The Virtual Tape Library (VTL) is the active tape storage layer in Tape Gateway. It presents virtual tape drives and a media changer to backup applications over iSCSI. Backup software writes data to virtual tapes inside the VTL exactly as it would to physical tapes. Virtual tapes in the VTL are stored in Amazon S3 and are immediately accessible for backup and restore operations.',
  whyItMatters: 'Enterprise backup environments are often built around tape workflows that have been refined over decades. The VTL lets organisations continue using these workflows, backup schedules, and retention policies without maintaining physical tape hardware.',
  workplaceExample: 'A hospital\'s Commvault backup server is configured to use a Tape Gateway VTL. Each night, Commvault writes patient-record backups to virtual tapes. Tapes remain in the VTL for 30 days for fast restore. After 30 days, the backup policy ejects them to archive storage.',
  examFocus: 'SAA-C03 VTL Components:\n- Virtual Tape Drives: iSCSI targets that emulate physical tape drives (up to 10 per gateway).\n- Media Changer: An iSCSI target that emulates a robotic tape changer for slot management.\n- Virtual Tapes: Data containers sized from 100 GB to 5 TB each.\n- S3 Backing: Active virtual tapes in the VTL are stored in Amazon S3.',
  keyPoints: [
    'Presents virtual tape drives and a media changer over iSCSI to backup software.',
    'Active virtual tapes in the VTL are stored in Amazon S3 for immediate access.',
    'Compatible with major backup applications (Veeam, NetBackup, Commvault, etc.).',
    'Individual virtual tapes can be sized from 100 GB to 5 TB.',
    'Eliminates physical tape procurement, handling, and off-site courier logistics.'
  ],
  commonMistake: 'Creating far more virtual tapes than needed upfront, incurring unnecessary S3 storage costs before any data is written to them.',
  example: 'VTL Backup Workflow:\n1. Backup software mounts a virtual tape from the VTL media changer.\n2. Backup job writes data to the virtual tape via iSCSI.\n3. Backup job completes and unmounts the tape.\n4. Tape remains in the VTL (S3) for fast restore access.',
  sources: [
    { title: 'Working with virtual tape libraries in Tape Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/tgw/managing-virtual-tapes-vtl.html' }
  ]
});
