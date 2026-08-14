import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "datasync-6",
  "topicId": "topic-datasync",
  "topicTitle": "AWS DataSync",
  "objectiveCode": "Management",
  "title": "DataSync Locations",
  "status": "ready",
  "plainEnglish": "A DataSync Location defines the source or destination endpoint for a data transfer task. It encapsulates all necessary connection parameters, credentials, network paths, and protocol settings required to interact with a specific storage system. DataSync supports locations for Amazon S3 buckets, Amazon EFS file systems, Amazon FSx file systems (Windows File Server, Lustre, NetApp ONTAP, OpenZFS), Network File System (NFS) shares, Server Message Block (SMB) shares, Hadoop Distributed File System (HDFS), and third-party object storage.",
  "whyItMatters": "Locations modularize connection configurations. Once you define a source location (e.g. an on-premises NFS export) and a destination location (e.g. an Amazon S3 bucket prefix), you can reuse them across multiple transfer tasks, apply different filtering rules, or adjust scheduling without re-entering network paths and IAM roles.",
  "workplaceExample": "A systems engineer creates two DataSync locations: `loc-source-nas` pointing to `nfs://nas.corp.internal/exports/financials` associated with agent `agent-01`, and `loc-dest-s3` pointing to `s3://corp-archive-bucket/financials-2026/` configured with an IAM role.",
  "examFocus": "For SAA-C03, understand that every DataSync task requires exactly one Source Location and one Destination Location. For on-premises locations, the location must be associated with one or more active DataSync Agents. For AWS storage locations (S3/EFS/FSx), DataSync uses IAM roles and VPC subnets/security groups to access the storage securely.",
  "keyPoints": [
    "Represents an endpoint configuration for either source or destination data.",
    "Supports Amazon S3, Amazon EFS, Amazon FSx, NFS, SMB, HDFS, and Object Storage.",
    "On-premises locations bind to specific DataSync agent ARNs.",
    "AWS storage locations bind to IAM roles, VPC subnets, and security groups.",
    "Can be reused across multiple independent DataSync transfer tasks."
  ],
  "commonMistake": "Creating a destination S3 location without assigning an IAM role with `s3:PutObject` and `s3:ListBucket` permissions, causing task execution to fail during the transfer initialization phase.",
  "example": "# Create an S3 destination location:\naws datasync create-location-s3 \\\n  --s3-bucket-arn arn:aws:s3:::corporate-data-lake \\\n  --s3-storage-class STANDARD \\\n  --s3-config '{\"BucketAccessRoleArn\":\"arn:aws:iam::123456789012:role/DataSyncS3AccessRole\"}' \\\n  --subdirectory /incoming-raw-files",
  "sources": [
    {
      "title": "Working with Locations in AWS DataSync",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/working-with-locations.html"
    },
    {
      "title": "AWS DataSync Location Types",
      "url": "https://docs.aws.amazon.com/datasync/latest/userguide/working-with-locations.html#location-types"
    }
  ]
});
