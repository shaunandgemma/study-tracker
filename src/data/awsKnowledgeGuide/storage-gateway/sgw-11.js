import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'sgw-11',
  topicId: 'topic-storage-gateway',
  topicTitle: 'AWS Storage Gateway',
  objectiveCode: 'Storage',
  title: 'File Gateway SMB Access',
  status: 'ready',
  plainEnglish: 'S3 File Gateway SMB Access allows Windows clients and applications to access file shares using the Server Message Block (SMB) protocol (versions 2 and 3). Windows users connect to gateway SMB shares through Windows Explorer, mapped network drives, or UNC paths. The gateway stores files as S3 objects while supporting Windows-compatible authentication via Active Directory or guest access.',
  whyItMatters: 'Most enterprise environments run Windows desktops and servers. SMB access allows Windows-based teams to use S3-backed storage through familiar mapped drives without learning cloud APIs or changing application workflows.',
  workplaceExample: 'An accounting department maps a network drive (`\\\\gateway-server\\finance-share`) backed by an S3 File Gateway. Staff save spreadsheets and reports to the drive. Files are stored as S3 objects with S3 lifecycle policies moving old reports to S3 Glacier.',
  examFocus: 'SAA-C03 SMB File Share Authentication:\n- Active Directory: Gateway joins an Active Directory domain. Share access is controlled by AD user and group permissions.\n- Guest Access: An alternative for environments without AD. A guest password is set on the gateway.\n- Security Consideration: Guest access grants identical permissions to all users and should be avoided for sensitive data.\n- Windows ACL Support: SMB shares can map Windows NTFS-style ACLs to S3 object metadata.',
  keyPoints: [
    'Provides SMB v2 and v3 file share access for Windows clients and applications.',
    'Supports Active Directory integration for user-level and group-level access control.',
    'Supports guest-password access as a simpler alternative (not recommended for sensitive data).',
    'Files written via SMB are stored as individual objects in Amazon S3.',
    'Windows users access shares through mapped drives, UNC paths, or Windows Explorer.'
  ],
  commonMistake: 'Using guest access for an SMB share containing sensitive business data. Guest access provides identical permissions to everyone who knows the password; use Active Directory for granular access control.',
  example: 'Connecting to an S3 File Gateway SMB Share from Windows:\nnet use Z: \\\\192.168.1.100\\finance-share /user:DOMAIN\\username',
  sources: [
    { title: 'Creating an SMB file share on S3 File Gateway', url: 'https://docs.aws.amazon.com/storagegateway/latest/userguide/GettingStartedCreateFileShare.html' }
  ]
});
