import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-9',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'Tape Gateway',
  status: 'ready',
  plainEnglish: 'Tape Gateway presents a virtual tape library (VTL) to on-premises backup applications over iSCSI, replacing physical tape drives and tape libraries with virtual tapes stored in AWS. Backup software (such as Veeam, Veritas NetBackup, or Commvault) writes to virtual tapes as if they were physical tapes. Completed tapes can be archived to cost-effective S3 Glacier or S3 Glacier Deep Archive storage classes.',
  whyItMatters: 'Physical tape infrastructure is expensive, fragile, and requires off-site tape rotation. Tape Gateway eliminates physical media handling while preserving existing backup software workflows and policies that organisations have built over years.',
  workplaceExample: 'A law firm uses Veritas NetBackup to back up case files nightly. They replace their physical tape autoloader with a Tape Gateway. NetBackup writes to virtual tapes via the iSCSI VTL interface. Completed tapes are ejected to S3 Glacier for long-term retention.',
  examFocus: 'SAA-C03 Tape Gateway Architecture:\n- Virtual Tape Library (VTL): Active virtual tapes accessible by backup software over iSCSI.\n- Virtual Tape Shelf (VTS): Archived (ejected) tapes stored in S3 Glacier or S3 Glacier Deep Archive.\n- Tape Lifecycle: Create virtual tape → backup writes data → eject tape → tape archived to Glacier → retrieve when needed.\n- Compatible with major backup applications (Veeam, NetBackup, Commvault, etc.).',
  keyPoints: [
    'Replaces physical tape drives and libraries with a cloud-backed virtual tape library.',
    'Presents an iSCSI VTL interface compatible with existing backup software.',
    'Active virtual tapes are stored in Amazon S3; archived tapes move to S3 Glacier classes.',
    'Eliminates physical tape procurement, rotation, and off-site courier costs.',
    'Supports major enterprise backup applications without modifying backup policies.'
  ],
  commonMistake: 'Expecting Tape Gateway to behave like a mounted file system. Tape Gateway exposes an iSCSI virtual tape library for backup applications, not a general-purpose NFS or SMB file share.',
  example: 'Tape Gateway Lifecycle:\n1. Create a virtual tape in the VTL.\n2. Backup software writes data to the tape via iSCSI.\n3. Backup software ejects the tape.\n4. The tape is archived to S3 Glacier (Virtual Tape Shelf).\n5. Retrieve the tape from Glacier when restoration is needed.',
  sources: [
    { title: 'Using Tape Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/tgw/WhatIsStorageGateway.html' }
  ]
});
