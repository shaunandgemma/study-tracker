import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-efs",
  "topicTitle": "Amazon EFS (Elastic File System)",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "efs-32",
  "title": "EFS vs Amazon FSx",
  "plainEnglish": "Amazon EFS provides serverless, elastic Network File System (NFS) storage for Linux workloads. Amazon FSx is a family of managed file services for Windows File Server, Lustre, NetApp ONTAP, and OpenZFS. Choose according to the protocol, operating system, features, and performance the application expects.",
  "whyItMatters": "Both provide managed file storage, but they are not interchangeable. Matching an existing application can avoid protocol changes, preserve familiar administration features, and meet specialized performance requirements.",
  "workplaceExample": "A Linux web platform uses EFS for a shared directory that expands automatically. A Windows department share uses FSx for Windows File Server because it needs Server Message Block (SMB), Microsoft Active Directory, and Windows file features.",
  "examFocus": "Choose EFS for elastic, shared NFS storage without managing file servers. Choose the relevant FSx option when a question names Windows or SMB, Lustre high-performance computing, NetApp ONTAP features, or OpenZFS compatibility. FSx is a service family, not one generic file system.",
  "keyPoints": [
    "EFS uses NFS and is intended for Linux-compatible workloads.",
    "EFS is serverless and automatically grows and shrinks as files change.",
    "FSx for Windows File Server supplies Windows-native file storage and SMB access.",
    "FSx for Lustre targets high-performance workloads such as machine learning and high-performance computing.",
    "FSx for NetApp ONTAP and FSx for OpenZFS support applications that need those ecosystems and features.",
    "Compare protocol, client systems, availability options, performance, management features, and cost before choosing."
  ],
  "commonMistake": "Choosing EFS merely because a requirement says file storage misses key clues. A need for SMB, Windows integration, Lustre, ONTAP, or OpenZFS points to the corresponding FSx service.",
  "example": "Use EFS for Linux application servers sharing ordinary NFS files with automatic capacity scaling. Use FSx for Windows File Server for a domain-joined Windows share, or FSx for Lustre for a compute-intensive parallel workload.",
  "sources": [
    {
      "title": "Choosing an AWS storage service",
      "url": "https://docs.aws.amazon.com/decision-guides/latest/storage-on-aws-how-to-choose/choosing-aws-storage-service.html"
    },
    {
      "title": "Features of Amazon EFS",
      "url": "https://docs.aws.amazon.com/efs/latest/ug/features.html"
    }
  ]
});
