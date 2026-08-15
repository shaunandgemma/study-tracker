import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-17',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'iSCSI Block Storage',
  status: 'ready',
  plainEnglish: 'iSCSI (Internet Small Computer Systems Interface) is the block-storage protocol used by Volume Gateway and Tape Gateway to present storage targets to on-premises servers. iSCSI sends SCSI commands over standard TCP/IP networks, allowing servers to treat remote storage devices as if they were locally attached disks or tape drives.',
  whyItMatters: 'Enterprise servers, databases, and backup software expect block-level storage access. iSCSI lets Volume Gateway present cloud-backed block volumes and Tape Gateway present a virtual tape library using a well-established standard that requires no specialised storage networking hardware.',
  workplaceExample: 'A database administrator configures an on-premises SQL Server to use an iSCSI target from a Volume Gateway. The server\'s iSCSI initiator connects to the gateway\'s IP address on port 3260. Windows Disk Manager shows the gateway volume as a new disk that can be formatted with NTFS.',
  examFocus: 'SAA-C03 iSCSI with Storage Gateway:\n- Volume Gateway: Presents iSCSI block volumes (cached or stored) to servers for database and application storage.\n- Tape Gateway: Presents iSCSI virtual tape library (VTL) targets to backup applications.\n- Protocol Details: Runs over standard TCP/IP networks (port 3260). No Fibre Channel hardware required.\n- CHAP Authentication: Supports Challenge-Handshake Authentication Protocol to authenticate iSCSI connections.',
  keyPoints: [
    'Block-storage protocol that sends SCSI commands over standard TCP/IP networks.',
    'Used by Volume Gateway for block volumes and Tape Gateway for virtual tape targets.',
    'Runs on port 3260 using standard Ethernet networking (no Fibre Channel required).',
    'Supports CHAP authentication to secure iSCSI initiator-target connections.',
    'Servers see gateway volumes and tapes as locally attached block devices.'
  ],
  commonMistake: 'Forgetting to configure CHAP authentication on iSCSI targets, leaving the gateway\'s block storage accessible to any host on the network that can reach port 3260.',
  example: 'Connecting a Windows Server to a Volume Gateway iSCSI Target:\n1. Open Windows iSCSI Initiator.\n2. Enter the gateway IP address as the target portal.\n3. Discover the target volume.\n4. Configure CHAP credentials.\n5. Connect. The volume appears in Disk Manager.',
  sources: [
    { title: 'Connecting iSCSI initiators to Storage Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/vgw/initiator-connection-common.html' }
  ]
});
