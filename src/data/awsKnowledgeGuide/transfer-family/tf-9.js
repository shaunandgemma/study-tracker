import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-9", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Amazon EFS Storage Backend", "status": "ready",
  "plainEnglish": "Amazon Elastic File System (Amazon EFS) gives Transfer Family users a shared hierarchical filesystem with Portable Operating System Interface (POSIX) ownership and permissions. A user session carries a POSIX profile containing a user ID (UID), primary group ID (GID), and optional secondary groups, and EFS evaluates those identities against existing file and directory permissions.",
  "whyItMatters": "EFS is appropriate when transferred files must be shared with applications through filesystem semantics such as real directories, ownership, and permissions. Access requires both IAM permission for the Transfer Family role and POSIX permission on the path, so either layer can correctly deny a user who authenticated successfully.",
  "workplaceExample": "An engineering partner connects over SFTP and works in an EFS project directory also used by internal Linux processing hosts. The Transfer Family user maps to the project's UID and GID, the directory already has suitable owner and group modes, and the role can mount and write through EFS without granting root access.",
  "examFocus": "Transfer Family servers and their EFS filesystems must be in the same Region. EFS authorization combines an IAM user role or filesystem policy with POSIX UID/GID and directory permissions. Transfer Family uses user POSIX profiles and does not use EFS access points to set those permissions.",
  "keyPoints": [
    "Create the user's home directory and assign correct ownership and permissions before expecting the session to use it.",
    "The PosixProfile UID, GID, and secondary GIDs determine filesystem identity; EFS does not use S3-style session policies or object-prefix permissions.",
    "The mapped IAM role needs applicable EFS client permissions, and a cross-account filesystem policy must explicitly trust it.",
    "Transfer Family accesses the configured EFS integration without requiring the external SFTP, FTPS, or FTP client to mount NFS.",
    "Administrators may mount EFS through its VPC mount targets to create and inspect directories, which requires normal NFS routing and security-group access for that administrative client.",
    "The server and EFS filesystem must be in the same AWS Region even when cross-account access is configured.",
    "Avoid long-lived UID 0 access; root can bypass normal POSIX checks and change ownership or permissions."
  ],
  "commonMistake": "Do not grant ClientWrite in IAM and assume the user can write everywhere. EFS still evaluates the session's POSIX identity against each directory, and a missing execute permission on a parent directory can block traversal even when the final directory appears writable.",
  "example": "Choose unused test UID and GID values, create an isolated EFS directory through an approved administrative mount, set deliberate ownership and modes, map a test Transfer Family user and role, verify allowed create/read/rename actions, confirm a neighboring directory is denied, and review both IAM and POSIX layers before cleanup.",
  "sources": [
    {"title": "Configure storage to use with AWS Transfer Family servers", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/configure-storage.html"},
    {"title": "Using AWS Transfer Family to transfer data in Amazon EFS", "url": "https://docs.aws.amazon.com/efs/latest/ug/using-aws-transfer-integration.html"},
    {"title": "Using logical directories", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/logical-dir-mappings.html"}
  ]
});
