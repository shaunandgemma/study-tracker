import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-12", "topicId": "topic-transfer-family", "topicTitle": "AWS Transfer Family", "objectiveCode": "Management", "title": "Active Directory Integration", "status": "ready",
  "plainEnglish": "Transfer Family can use AWS Directory Service for Microsoft Active Directory as a server identity provider. Users authenticate with directory credentials, but they receive file-transfer access only when an administrator grants a supported directory group access and maps that access to a storage role, home directory, and any required EFS POSIX profile.",
  "whyItMatters": "Directory integration centralizes password lifecycle and group membership for workforce or established partner identities. It does not mean every directory user can transfer files, and the same directory group must not automatically imply broad access to all S3 objects or EFS directories.",
  "workplaceExample": "Members directly assigned to an approved finance-transfer group may use an internal FTPS endpoint. The group's Transfer Family access entry maps to one EFS directory and POSIX profile, while another group maps to an S3 reporting prefix. Removing direct group membership revokes the associated server access.",
  "examFocus": "AWS Managed Microsoft AD supports Transfer Family authentication for SFTP, FTPS, and FTP with S3 or EFS. Administrators grant access to directory groups, and users must be direct members of the granted group; nested group membership does not provide the documented access behavior.",
  "keyPoints": [
    "The directory verifies user credentials, while a Transfer Family access entry for a group supplies the storage authorization configuration.",
    "Only explicitly granted groups can use the server, and direct membership should be tested rather than relying on nested groups.",
    "FTPS additionally needs an ACM server certificate, and FTP remains an internal, unencrypted protocol despite directory authentication.",
    "S3 group access uses IAM roles and optional policies; EFS group access also requires suitable POSIX identities and directory permissions.",
    "Directory network reachability, DNS, trust relationships, server Region, and Directory Service permissions are operational dependencies.",
    "Cross-account and shared-directory support has documented restrictions that must be checked before selecting the design.",
    "Monitor directory authentication failures separately from successful logins that later fail storage authorization."
  ],
  "commonMistake": "Do not grant a broad directory group and expect nested membership or storage permissions to behave automatically. Test a direct member, verify the mapped role and home, and confirm an ungranted user is denied at the authentication boundary.",
  "example": "Create a non-production direct-membership group and map it to one isolated storage path. Test an approved direct member, a user only in a nested group, and an ungranted user; then test permitted and forbidden file operations for the authenticated account, review redacted logs, and remove the temporary access mapping.",
  "sources": [
    {"title": "Using AWS Directory Service for Microsoft Active Directory", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/directory-services-users.html"},
    {"title": "Managing users for server endpoints", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/create-user.html"},
    {"title": "Configuring an SFTP, FTPS, or FTP server endpoint", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/sftp-for-transfer-family.html"}
  ]
});
