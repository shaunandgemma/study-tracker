/** AWS CloudTrail Tasks (SAA-C03) */
export const CLOUDTRAIL_TASKS = [
  {
    "id": "task-saa-cloudtrail-api-activity-auditing-with-aws-cloudtrail-log-validation-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-cloudtrail",
    "title": "API Activity Auditing with AWS CloudTrail & Log Validation",
    "slug": "api-activity-auditing-with-aws-cloudtrail-log-validation",
    "service": "AWS CloudTrail",
    "feature": "AWS CloudTrail",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Audit user and API actions across all regions, enable log integrity validation, and detect anomalous API patterns with CloudTrail Insights.",
    "status": "published",
    "tags": [
      "AWS CloudTrail",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Management Events vs Data Events",
        "body": "Management Events: Control plane operations (e.g. `RunInstances`, `CreateBucket`, `CreateUser`). Enabled by default. Data Events: High-volume resource operations (e.g. `s3:GetObject`, `s3:PutObject`, `lambda:Invoke`). Disabled by default due to log volume."
      },
      {
        "id": "concept-2",
        "title": "Log File Integrity Validation",
        "body": "CloudTrail signs delivered log files using SHA-256 hashing and digital signatures. Allows auditing whether log files were modified or deleted after delivery."
      },
      {
        "id": "concept-3",
        "title": "CloudTrail Insights",
        "body": "Analyzes baseline management event patterns and automatically flags unusual spikes in API call volume (e.g. sudden spike in `IAM:CreateUser` calls)."
      },
      {
        "id": "concept-4",
        "title": "Multi-Region Trails",
        "body": "A single trail configuration that captures API calls across ALL AWS Regions automatically and consolidates logs into one S3 bucket."
      },
      {
        "id": "concept-5",
        "title": "CloudTrail Event Types & Validation Matrix",
        "body": "CloudTrail Event TypeScope & DescriptionDefault StatusCost ImplicationsManagement EventsControl plane operations (`Create`, `Modify`, `Delete` infrastructure)Enabled on first trailFirst copy free; additional trails $2 per 100k eventsData EventsData plane operations (`S3 GetObject`, `Lambda Invoke`)Disabled by defaultBilled at $0.10 per 100k eventsInsights EventsAutomated anomaly detection on API call volume spikesDisabled by defaultBilled at $0.35 per 100k analyzed events"
      }
    ],
    "whyItMatters": "This matters because CloudTrail Management Events vs. Data Events (e.g., S3 object-level calls or Lambda executions) and enabling Digest Validation for compliance auditing are heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Trail Name",
        "value": "saa-organization-trail"
      },
      {
        "label": "S3 Storage Bucket",
        "value": "saa-cloudtrail-logs-[account-id]"
      },
      {
        "label": "Log Integrity",
        "value": "Digest Validation Enabled"
      },
      {
        "label": "Coverage",
        "value": "Multi-Region (All AWS Regions)"
      }
    ],
    "costWarning": "CloudTrail additional event copies, data events, Insights, CloudTrail Lake, S3 storage, CloudWatch Logs and KMS charges may apply.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity CloudTrail permissions: cloudtrail:CreateTrail, cloudtrail:StartLogging, cloudtrail:GetTrailStatus S3 permissions: s3:CreateBucket, s3:PutBucketPolicy Cleanup: cloudtrail:DeleteTrail, s3:DeleteBucket",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a Multi-Region CloudTrail Trail",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS CloudTrail Console -> Click Trails in left navigation -> Click Create trail."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Trail name to saa-organization-trail."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Select Apply trail to all regions (Multi-Region Trail)."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Under Storage location, select Create new S3 bucket."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Bucket name to saa-cloudtrail-logs-[account-id]."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Check Enable log file validation."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Click Next."
          }
        ],
        "note": "Captures API calls across all AWS Regions into a single target S3 bucket with digest validation.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Configure Management Events, Data Events, and Insights",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select Event type Management events (Read and Write operations)."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select Additional event types CloudTrail Insights events (Detect API call volume anomalies)."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Next -> Choose Create trail."
          }
        ],
        "note": "Management events track control plane operations while Insights detects unusual API spikes.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Verify Log File Integrity Digest Validation",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Amazon S3 Console -> Select bucket saa-cloudtrail-logs-[account-id]."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Verify that CloudTrail generates periodic .json.gz log files and .digest files."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Open terminal and validate digest hashes: aws cloudtrail validate-logs --trail-arn arn:aws:cloudtrail:us-east-1:[account-id]:trail/saa-organization-trail --start-time 2026-07-22T00:00:00Z."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Confirm CLI output reports Valid logs found: 100% digest signature verified."
          }
        ],
        "note": "Digest validation mathematically proves log files have not been modified or tampered with.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Inspect Event History and CloudTrail Insights",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open CloudTrail Console -> Click Event history."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Filter by Event name ConsoleLogin or TerminateInstances to audit historical API activity."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Review Management Events vs Data Events vs Insights comparison rules."
          }
        ],
        "note": "Provides 90-day search history for control plane API calls.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Tear down lab resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete CloudTrail trail saa-organization-trail."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Empty and delete S3 bucket saa-cloudtrail-logs-[account-id]."
          }
        ],
        "note": null,
        "warning": "Delete trails and S3 buckets to clean up account resources.",
        "expectedResult": "Step 6 completed successfully."
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
        "note": "Expected: account ID and IAM user/role ARN.",
        "warning": null,
        "expectedResult": "Expected: account ID and IAM user/role ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Validate CloudTrail Log Digest Hashes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws cloudtrail validate-logs --trail-arn arn:aws:cloudtrail:us-east-1:123456789012:trail/saa-organization-trail --start-time 2026-07-22T00:00:00Z --region us-east-1"
          }
        ],
        "note": "Verifies log file integrity digest signature.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS CloudTrail configuration verified in AWS CloudTrail."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Stop logging and delete the test CloudTrail trail."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the S3 bucket created for CloudTrail logs and associated log groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Management Events",
        "body": "Captures control plane operations (e.g. creating EC2 instances, modifying IAM roles). Enabled by default."
      },
      {
        "id": "cs-2",
        "title": "Data Events",
        "body": "Captures high-volume resource operations (e.g. S3 object reads/writes, Lambda invocations). Disabled by default."
      },
      {
        "id": "cs-3",
        "title": "Log File Validation",
        "body": "Uses cryptographic SHA-256 hashing and RSA signatures to prove log files haven't been tampered with."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "S3 Object Level Calls Missing in CloudTrail",
        "body": "CloudTrail management events do NOT log S3 object downloads/uploads. You must explicitly enable **CloudTrail Data Events** for S3."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "S3 Data Events vs Management Events Trap",
        "body": "If an exam scenario asks to audit S3 GetObject or PutObject API calls, do NOT rely on default CloudTrail settings. Select Enable CloudTrail Data Events."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS CloudTrail concepts and observability patterns in AWS CloudTrail."
      }
    ],
    "memoryHook": "CloudTrail = Who Did What API Call | Digest Validation = Log Anti-Tamper Check",
    "flashcardSetId": null
  }
];
