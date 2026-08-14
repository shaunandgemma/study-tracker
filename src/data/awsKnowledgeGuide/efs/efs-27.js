import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-efs",
  "topicTitle": "Amazon EFS (Elastic File System)",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "efs-27",
  "title": "EFS File System Policies",
  "plainEnglish": "An EFS file system policy is a resource-based AWS Identity and Access Management (IAM) policy attached to the file system. It controls which principals can mount, write, or use the root user. EFS evaluates it with relevant identity policies when a client uses IAM authorization.",
  "whyItMatters": "Network reachability alone should not decide who may use sensitive shared files. A file system policy can require encrypted connections, restrict access to approved roles or access points, and grant only the client actions an application needs.",
  "workplaceExample": "A company lets its reporting role mount an EFS file system read-only through one access point. The policy requires Transport Layer Security (TLS) and denies connections that do not use a mount target.",
  "examFocus": "Separate network controls from authorization. Security groups control whether Network File System (NFS) traffic reaches a mount target; policies control IAM-authorized client actions. Recognize ClientMount, ClientWrite, ClientRootAccess, SecureTransport, and AccessPointArn.",
  "keyPoints": [
    "A file system policy is an IAM resource policy attached to an EFS file system.",
    "ClientMount grants read-only access, ClientWrite permits writes, and ClientRootAccess permits root use.",
    "Conditions can require TLS with aws:SecureTransport or restrict clients to an EFS access point ARN.",
    "IAM client authorization requires the EFS mount helper and evaluates applicable identity and file system policies.",
    "Without a user-configured policy, the default grants full access to anonymous clients that can connect through a mount target.",
    "Policies do not replace security groups, routes, or Portable Operating System Interface (POSIX) permissions."
  ],
  "commonMistake": "Treating a file system policy as a firewall is a mistake. The client still needs TCP port 2049 network access and the correct IAM and file permissions.",
  "example": "Allow an application role ClientMount and ClientWrite only when SecureTransport is true and AccessPointArn matches its access point. Mount with the EFS helper and IAM option, then confirm an unapproved role is rejected.",
  "sources": [
    {
      "title": "Using IAM to control access to EFS file systems",
      "url": "https://docs.aws.amazon.com/efs/latest/ug/iam-access-control-nfs-efs.html"
    }
  ]
});
