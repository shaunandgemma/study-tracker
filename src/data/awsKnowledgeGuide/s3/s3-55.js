import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-s3",
  "topicTitle": "Amazon S3",
  "objectiveCode": "Storage",
  "status": "ready",
  "id": "s3-55",
  "title": "S3 Batch Operations",
  "plainEnglish": "Amazon S3 Batch Operations is a fully managed cloud service that allows you to execute large-scale, automated batch actions across billions of S3 objects containing petabytes of data with a single request. By supplying an object manifest (such as an Amazon S3 Inventory report or a custom CSV file), S3 Batch Operations automatically manages retries, scales parallel workers, tracks execution progress, sends notifications, and generates a comprehensive completion report without requiring custom distributed compute infrastructure.",
  "whyItMatters": "Performing operations across billions of objects—such as migrating storage classes, replacing object tags, applying Object Lock retention dates, or invoking AWS Lambda functions—would normally require provisioning, scaling, and managing large fleets of EC2 instances running custom worker scripts for weeks. S3 Batch Operations handles petabyte-scale execution natively, saving hundreds of engineering hours.",
  "workplaceExample": "A cybersecurity mandate requires adding an S3 Object Lock legal hold to 80 million historical customer contract PDFs across 12 buckets. The platform engineering team generates an S3 Inventory report in Parquet format, creates an S3 Batch Operations job with operation `SetObjectLegalHold`, and executes the job. S3 Batch Operations applies the legal hold across all 80 million files within 4 hours and outputs a detailed CSV completion audit report.",
  "examFocus": "Understand S3 Batch Operations capabilities and supported actions: (1) Input Manifest: Amazon S3 Inventory report (CSV/Parquet/ORC) OR a custom CSV file (listing Bucket, Key, and optional VersionId). (2) Supported Batch Operations: S3 Batch Replication (replicating existing objects), Copy Object (re-encrypting, changing storage class), Replace Object Tags, Replace Access Control Lists (ACLs), Restore from Glacier, Set Object Retention/Legal Hold, and Invoke AWS Lambda function. (3) Completion Report: Generates detailed task-level success/failure audit logs.",
  "keyPoints": [
    "Fully managed service to execute batch operations across billions of objects.",
    "Eliminates the need to write, host, and scale custom distributed batch processing scripts.",
    "Uses Amazon S3 Inventory reports or custom CSV files as input manifests.",
    "Supports Copy, Tagging, ACL replacement, Glacier Restore, Object Lock, Lambda invocation, and Batch Replication.",
    "Manages parallel execution scaling, automatic retries, and rate limiting natively.",
    "Outputs detailed completion reports capturing success and failure statuses for auditing."
  ],
  "commonMistake": "Writing custom multi-threaded Python scripts on EC2 to copy or tag millions of existing S3 objects. S3 Batch Operations performs these operations natively in parallel with built-in progress tracking, retry management, and completion reporting at a fraction of the cost.",
  "example": "Create an S3 Batch Operations job to restore archived objects from Glacier using the AWS CLI: aws s3control create-job --account-id 123456789012 --operation '{\"S3InitiateRestoreObject\":{\"ExpirationInDays\":7,\"GlacierJobParameters\":{\"Tier\":\"Standard\"}}}' --manifest '{\"Spec\":{\"Format\":\"S3InventoryReport_CSV_20161130\",\"Fields\":[\"Bucket\",\"Key\"]},\"Location\":{\"ObjectArn\":\"arn:aws:s3:::manifest-bucket/inventory.csv\",\"ETag\":\"abcd1234\"}}' --report '{\"Bucket\":\"arn:aws:s3:::report-bucket\",\"Format\":\"Report_CSV_20180820\",\"Enabled\":true,\"ReportScope\":\"AllTasks\"}' --priority 10 --role-arn arn:aws:iam::123456789012:role/s3-batch-role.",
  "sources": [
    {
      "title": "Performing Large-Scale Batch Operations in Amazon S3",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops.html"
    },
    {
      "title": "Supported S3 Batch Operations and Actions",
      "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops-operations.html"
    }
  ]
});
