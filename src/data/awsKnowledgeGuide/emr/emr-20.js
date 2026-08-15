import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-emr",
  "topicTitle": "Amazon EMR",
  "objectiveCode": "Analytics",
  "status": "ready",
  "id": "emr-20",
  "title": "EMR Security and IAM Roles",
  "plainEnglish": "Amazon EMR provides an enterprise-grade security framework that encompasses Identity and Access Management (IAM) roles, EC2 instance profiles, security configurations, network isolation in Amazon VPC, encryption at rest and in transit, and Kerberos authentication.",
  "whyItMatters": "Big-data environments often process sensitive customer, healthcare, or financial data across hundreds of EC2 nodes. A layered security model ensures that cluster nodes, applications, and end users operate under least-privilege access, data in S3 and local storage is encrypted with KMS keys, and inter-node network communications are secured with TLS.",
  "workplaceExample": "A healthcare analytics platform processes HIPAA-compliant electronic health records on EMR. They configure an EMR Security Configuration enforcing AWS KMS SSE-KMS encryption for S3 (EMRFS), EBS volume encryption with customer managed keys, in-transit TLS encryption across all Hadoop nodes, and scoped IAM runtime roles for each Spark job.",
  "examFocus": "Distinguish between the EMR Service Role (assumed by EMR to provision and manage AWS resources like EC2 instances and security groups), the EC2 Instance Profile (assumed by the EC2 instances in the cluster to access S3, Glue, and KMS), and EMR Runtime Roles (scoped IAM roles assigned to specific steps or users). Understand Security Configurations for encryption at rest/in transit.",
  "keyPoints": [
    "EMR Service Role (e.g., EMR_DefaultRole): Used by the EMR service to provision, manage, and terminate AWS infrastructure (EC2, VPC, security groups).",
    "EC2 Instance Profile (e.g., EMR_EC2_DefaultRole): Assigned to the EC2 instances in the cluster, granting applications permission to access AWS services like Amazon S3, AWS Glue, and AWS KMS.",
    "Runtime Roles: Allow assigning distinct IAM roles to individual Spark jobs or EMR Studio users, enforcing granular least-privilege access on shared clusters.",
    "EMR Security Configurations: Centralized templates specifying encryption settings: at rest (S3 via EMRFS, local EBS/HDFS) and in transit (TLS/SSL, Spark internal encryption).",
    "VPC Isolation: Deploy clusters in private subnets with VPC endpoints (S3, Glue, KMS, CloudWatch) to prevent public internet exposure.",
    "Kerberos Authentication: Enables strong user and service authentication for Hadoop ecosystem daemons in multi-user enterprise environments."
  ],
  "commonMistake": "Confusing the EMR Service Role with the EC2 Instance Profile. Granting S3 bucket permissions to the EMR Service Role will not allow Spark or Hive jobs running on EC2 nodes to read S3 data; data access policies must be attached to the EC2 Instance Profile or Runtime Role.",
  "example": "Create an EMR security configuration enabling EBS encryption with KMS and apply it to a new cluster: aws emr create-security-configuration --name 'HIPAA-KMS-SecConfig' --security-configuration file://sec-config.json, then pass --security-configuration 'HIPAA-KMS-SecConfig' when creating the cluster.",
  "sources": [
    {
      "title": "Configure IAM Roles for Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-iam-roles.html"
    },
    {
      "title": "Create a Security Configuration in Amazon EMR",
      "url": "https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-security-configurations.html"
    }
  ]
});
