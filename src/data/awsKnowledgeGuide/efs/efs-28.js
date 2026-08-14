import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-efs",
  "topicTitle": "Amazon EFS (Elastic File System)",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "efs-28",
  "title": "EFS with AWS Lambda",
  "plainEnglish": "An AWS Lambda function can mount EFS at a local directory and use normal file operations on shared, persistent data. Lambda connects through an EFS access point over networking in an Amazon Virtual Private Cloud (VPC).",
  "whyItMatters": "Lambda execution environments are temporary, but some applications need durable files shared across concurrent function instances. EFS supplies that shared file system without putting data in a deployment package or temporary storage.",
  "workplaceExample": "An image-processing function mounts /mnt/models from an EFS access point. Many invocations read the same model files, while the access point confines the function to its application directory and user identity.",
  "examFocus": "For Lambda with EFS, look for VPC connectivity, an access point, mount targets in the Availability Zones used by the function, security groups allowing NFS on TCP 2049, and execution-role permissions when a custom IAM policy is used.",
  "keyPoints": [
    "Lambda mounts EFS to a local path that starts with /mnt/.",
    "The Lambda configuration selects an EFS access point, not just a file system ID.",
    "Subnets, routes, mount targets, and security groups must provide a working VPC path.",
    "Allow NFS traffic on TCP port 2049 between the function and mount-target security groups.",
    "With a custom EFS IAM policy, the execution role needs ClientMount and, for writes, ClientWrite.",
    "AWS recommends mount targets in every Availability Zone the function uses and at least two zones for resilience and performance."
  ],
  "commonMistake": "Adding EFS to Lambda without a reachable mount target and port 2049 security-group path causes mount failures. IAM permission alone does not create network connectivity.",
  "example": "Create a Regional file system with mount targets in two private subnets, an access point rooted at /functions/reporting, and TCP 2049 access from Lambda. Attach it at /mnt/reports and test concurrent access.",
  "sources": [
    {
      "title": "Configuring Amazon EFS file system access for Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-filesystem-efs.html"
    }
  ]
});
