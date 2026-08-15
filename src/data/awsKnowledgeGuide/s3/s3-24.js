import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-24",
  "title": "S3 Access Points",
  "plainEnglish": "Amazon S3 Access Points are named network endpoints attached directly to an S3 bucket that simplify data access management for shared datasets and multi-tenant data lakes. Instead of managing a single, monolithic, complex bucket policy with hundreds of lines of JSON, you create separate Access Points for each application, team, or department. Each Access Point has its own unique hostname, custom IAM policy, and network origin restrictions (Internet vs VPC-only).",
  "whyItMatters": "In large enterprise data lakes where dozens of microservices, analytics teams, and machine learning models share a single central bucket, a single bucket policy quickly hits JSON size limits (20 KB) and becomes dangerous to update. S3 Access Points decompose access control into modular, independent policies, preventing one team from accidentally breaking another team's permissions.",
  "workplaceExample": "A centralized customer analytics bucket (`analytics-lake`) is shared between three teams: Finance, Data Science, and Marketing. The data platform team creates three dedicated Access Points: (1) `finance-ap` (restricted strictly to the corporate VPC with read-only access to `finance/`), (2) `datascience-ap` (restricted to the ML training VPC with read/write to `models/`), and (3) `marketing-ap` (with access to `marketing/`). Each team connects to its own Access Point ARN.",
  "examFocus": "Understand S3 Access Point features and constraints: (1) Modular Permissions: Each Access Point has a dedicated resource-based Access Point Policy. (2) Network Origin: Can be configured as 'Internet' (accessible publicly or via IAM) or 'VPC' (accessible strictly from a specific VPC ID). (3) Block Public Access: Each Access Point has its own independent Block Public Access settings. (4) Access Point Alias: S3 automatically generates a unique DNS alias for use anywhere an S3 bucket name is accepted.",
  "keyPoints": [
    "Named network endpoints with dedicated access policies attached to a single S3 bucket.",
    "Simplifies access management for large, multi-tenant datasets and enterprise data lakes.",
    "Eliminates the complexity and 20 KB size limits of managing a single monolithic bucket policy.",
    "Supports restricting access to specific Amazon Virtual Private Clouds (VPC-only access points).",
    "Each access point maintains independent S3 Block Public Access settings.",
    "Generates unique Access Point Aliases that can be used directly as bucket names in S3 APIs and SDKs."
  ],
  "commonMistake": "Creating a VPC-only Access Point but attempting to connect to it over the public internet. A VPC-only Access Point completely rejects any traffic that does not originate from the specific VPC ID specified during creation.",
  "example": "Create an S3 Access Point restricted strictly to a corporate VPC using the AWS CLI: aws s3control create-access-point --account-id 123456789012 --bucket central-datalake --name finance-vpc-ap --vpc-configuration VpcId=vpc-01234567.",
  "sources": [
    {
      "title": "Managing Data Access with Amazon S3 Access Points",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-access-points.html"
    },
    {
      "title": "Configuring IAM Policies for S3 Access Points",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points-policies.html"
    }
  ]
});
