import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "tf-1",
  "topicId": "topic-transfer-family",
  "topicTitle": "AWS Transfer Family",
  "objectiveCode": "Management",
  "title": "Managed SFTP, FTPS, and FTP File Transfers directly to S3 and EFS",
  "status": "ready",
  "plainEnglish": "AWS Transfer Family can provide managed server endpoints for Secure Shell File Transfer Protocol (SFTP), File Transfer Protocol Secure (FTPS), and File Transfer Protocol (FTP). Existing file-transfer clients connect to the endpoint, the configured identity provider authenticates the user, and Transfer Family performs authorized file operations against Amazon Simple Storage Service (Amazon S3) or Amazon Elastic File System (Amazon EFS).",
  "whyItMatters": "A company can retain partner-facing file-transfer protocols without maintaining operating systems and transfer-server software. The managed endpoint does not replace identity, network, or storage design: each user still needs a limited role or POSIX profile, a correct home-directory mapping, and permission to only the intended data.",
  "workplaceExample": "A supplier continues using an SFTP client while a Transfer Family endpoint stores uploads under one supplier-specific S3 prefix. The supplier's public SSH key proves identity, a user role and logical-directory mapping limit visible objects, and CloudWatch logs help the operations team investigate login and transfer failures.",
  "examFocus": "Choose Transfer Family when existing clients or partners require managed SFTP, FTPS, or FTP access to supported AWS storage. Do not confuse it with DataSync for dataset transfer, Storage Gateway for hybrid storage interfaces, or S3 presigned URLs for temporary object access without a protocol server.",
  "keyPoints": [
    "SFTP uses SSH, FTPS uses FTP with TLS, and plain FTP sends credentials and data without protocol encryption.",
    "The client connects to a Transfer Family server endpoint before authentication and storage authorization are evaluated.",
    "Amazon S3 stores objects whose key prefixes can appear as directories; it is not a POSIX file system.",
    "Amazon EFS provides hierarchical file-system semantics and enforces POSIX user, group, and directory permissions.",
    "IAM roles, session policies, logical directories, bucket policies, EFS permissions, and KMS policies remain separate controls where applicable.",
    "Protocol support depends on endpoint type and identity provider, so the entire compatibility path must be checked before migration.",
    "CloudWatch logging and metrics support operations, while CloudTrail records supported control-plane API activity rather than transferred file contents."
  ],
  "commonMistake": "Do not assume that selecting a storage backend automatically grants a user access. Authentication can succeed while listing or uploading fails because the user role, session policy, S3 prefix, EFS POSIX identity, directory permissions, or KMS permissions are wrong.",
  "example": "Design a non-production SFTP route for a fictional partner: select the endpoint and S3 backend, define a logical home mapped to one test prefix, register only a test public key, give the user a least-privilege role, publish the endpoint host key through an approved channel, transfer harmless files, inspect logs and object ownership, and remove the test configuration without creating public access.",
  "sources": [
    {"title": "What is AWS Transfer Family?", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html"},
    {"title": "Configuring an SFTP, FTPS, or FTP server endpoint", "url": "https://docs.aws.amazon.com/transfer/latest/userguide/sftp-for-transfer-family.html"}
  ]
});
