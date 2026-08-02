/** Amazon Kinesis / Amazon Data Firehose Analytics Tasks (SAA-C03) */
export const KINESIS_TASKS = [
  {
    "id": "task-saa-kinesis-deliver-records-to-s3-with-firehose-011",
    "examCode": "aws-saa-c03",
    "topicId": "topic-kinesis",
    "title": "Deliver Records to S3 with Amazon Data Firehose",
    "slug": "deliver-records-to-s3-with-firehose",
    "service": "Amazon Kinesis",
    "feature": "Amazon Data Firehose",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Create an Amazon Data Firehose delivery stream using Direct PUT as the source and Amazon S3 as the destination. Understand Firehose buffering, delivery semantics, and how it differs from Kinesis Data Streams for analytics ingestion.",
    "status": "published",
    "tags": [
      "Amazon Kinesis",
      "Amazon Data Firehose",
      "Analytics",
      "Streaming",
      "S3",
      "Medium",
      "aws-saa-c03"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon Data Firehose."
      },
      {
        "id": "concept-2",
        "title": "Resiliency Focus (Domain 2)",
        "body": "Learn how decoupling and managed event sources isolate errors and scale automatically."
      },
      {
        "id": "concept-3",
        "title": "Cost Optimization (Domain 4)",
        "body": "Identify billing traps, limit capacities, and cancel provisioned actions to maintain a $0 baseline."
      }
    ],
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon Data Firehose.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1 (N. Virginia) or us-west-2 (Oregon)"
      },
      {
        "label": "Billing Limit Policy",
        "value": "Canceled wizards and smallest default memory sizing"
      }
    ],
    "costWarning": "Data Firehose ingestion, format conversion, dynamic partitioning, transformation and destination-service charges may apply.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Use an IAM user or lab role with the permissions required for this task."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the service permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Firehose operations: firehose:CreateDeliveryStream, firehose:DeleteDeliveryStream, firehose:DescribeDeliveryStream, s3:CreateBucket, s3:DeleteBucket",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Start from AWS login",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use the Region eu-west-2 (Europe London) or your preferred standard Region for these labs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Confirm that your console theme is set to dark or standard preference."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create Firehose stream",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the Amazon Data Firehose console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click Create delivery stream."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Source: Direct PUT, Destination: Amazon S3."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name the stream analytics-lake-ingest."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Set up S3 Destination & buffering",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Under Destination settings, click Create bucket to create a unique target bucket (e.g. saa-analytics-sink-[account-id])."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select the bucket."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Expand the Buffer hints, compression and encryption accordion section."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Buffer interval to 60 seconds and Buffer size to 1 MiB."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Click Create delivery stream."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Clean up Firehose immediately",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Firehose does not have a traditional free tier and incurs continuous ingestion fees."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select analytics-lake-ingest delivery stream and click Delete."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Go to S3 console and delete the created bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create Data Firehose stream programmatically",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws firehose create-delivery-stream --delivery-stream-name analytics-lake-ingest --delivery-stream-type DirectPut --s3-destination-configuration '{\"RoleARN\":\"arn:aws:iam::YOUR_ACCOUNT_ID:role/firehose-s3-role\"}' --s3-destination-configuration '{\"BucketARN\":\"arn:aws:s3:::your-analytics-destination-bucket\"}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Delete Data Firehose stream to avoid charges",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws firehose delete-delivery-stream --delivery-stream-name analytics-lake-ingest"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes the Firehose delivery stream. Confirm the stream name before running.",
        "expectedResult": "CLI command step 3 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Confirm the Firehose delivery stream status shows Active in the Amazon Data Firehose console."
      },
      {
        "id": "verify-2",
        "text": "Confirm the S3 destination bucket has been created and the delivery stream is configured with the correct buffer interval and buffer size."
      },
      {
        "id": "verify-3",
        "text": "Confirm the delivery stream uses Direct PUT as the source and Amazon S3 as the destination."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Open the Amazon Data Firehose console and select the analytics-lake-ingest delivery stream."
      },
      {
        "id": "cleanup-2",
        "text": "Click Delete to remove the delivery stream. Confirm deletion. (Note: delete-delivery-stream is destructive and cannot be undone.)"
      },
      {
        "id": "cleanup-3",
        "text": "Open the Amazon S3 console, find the destination bucket (e.g. saa-analytics-sink-[account-id]), empty the bucket, then delete it."
      },
      {
        "id": "cleanup-4",
        "text": "If an IAM role was created solely for this lab, open the IAM console and delete the role and its inline policies."
      },
      {
        "id": "cleanup-5",
        "text": "If a CloudWatch log group was created for Firehose error logging, open CloudWatch Logs and delete the log group."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Domain 2: Resiliency",
        "body": "Decouple microservices using SQS Standard or SQS FIFO queues. Add DLQs and set visibility timeouts appropriately."
      },
      {
        "id": "cs-2",
        "title": "Domain 4: Cost Optimization",
        "body": "Configure pay-per-request (On-Demand) billing modes for DynamoDB tables and minimize memory footprint allocations on Lambda functions."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Validation Error",
        "body": "Verify that your IAM user has sufficient permissions and that the resource names are unique in your AWS account."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Billing Traps",
        "body": "Provisioned Concurrency and Kinesis Shards cost money immediately. NAT Gateways have high fixed hourly fees."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Amazon Data Firehose is a fully managed delivery service that buffers and loads streaming data to S3, Redshift, OpenSearch or HTTP endpoints. It is not a real-time multi-consumer event stream — use Kinesis Data Streams for that pattern."
      },
      {
        "id": "tip-2",
        "text": "SAA-C03: Firehose buffering (by size or time interval) introduces delivery latency. Choose Kinesis Data Streams when sub-second consumer latency is required."
      }
    ],
    "memoryHook": "Firehose = Fire and forget to a destination. It delivers, buffers and optionally transforms, but does not let multiple independent consumers replay the same records.",
    "flashcardSetId": null
  }
];
