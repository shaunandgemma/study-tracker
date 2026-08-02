/** Amazon Macie Tasks (SAA-C03) */
export const MACIE_TASKS = [
  {
    "id": "task-saa-macie-pii-scanning-sensitive-data-discovery-with-amazon-macie-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-macie",
    "title": "PII Scanning & Sensitive Data Discovery with Amazon Macie",
    "slug": "pii-scanning-sensitive-data-discovery-with-amazon-macie",
    "service": "Amazon Macie",
    "feature": "Amazon Macie",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Automatically scan S3 buckets to discover exposed Personally Identifiable Information (PII) and credit card data using Amazon Macie.",
    "status": "published",
    "tags": [
      "Amazon Macie",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon Macie Overview",
        "body": "Data security and privacy service that uses machine learning and pattern matching to discover, classify, and protect sensitive data stored in Amazon S3."
      },
      {
        "id": "concept-2",
        "title": "Sensitive Data Discovery Jobs",
        "body": "Automated or on-demand scanning jobs targeting specified S3 buckets to inspect file contents (CSV, JSON, PDF, DOCX) for PII."
      },
      {
        "id": "concept-3",
        "title": "Types of Detectable PII Data",
        "body": "Social Security Numbers (SSN), Credit Card Numbers, Driver's License Numbers, Passport Numbers, Bank Account Details, and custom regex data types."
      },
      {
        "id": "concept-4",
        "title": "EventBridge Alert Integration",
        "body": "Macie publishes classification findings to Amazon EventBridge, allowing automated alerts or Lambda remediation functions to restrict bucket access."
      },
      {
        "id": "concept-5",
        "title": "Macie vs GuardDuty vs Inspector Comparison Matrix",
        "body": "Security ServicePrimary TargetDetection CapabilitiesAmazon MacieAmazon S3 BucketsDiscovers PII & sensitive data (SSNs, Credit Cards) stored in S3Amazon GuardDutyAWS Account / VPC / EKSDiscovers threats & malicious behavior (Compromised keys, C2 traffic)Amazon InspectorEC2 Instances, ECR Images, LambdaDiscovers software vulnerabilities (CVEs) & network exposure"
      }
    ],
    "whyItMatters": "This matters because using Amazon Macie to discover exposed PII and sensitive data stored in S3 vs. GuardDuty for threat detection vs. Inspector for software CVEs is a high-frequency SAA-C03 question.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Target S3 Bucket",
        "value": "saa-macie-scan-bucket-[account-id]"
      },
      {
        "label": "Job Type",
        "value": "One-Time Sensitive Data Discovery Job"
      },
      {
        "label": "Managed Identifiers",
        "value": "Credit Card Numbers & SSNs"
      },
      {
        "label": "Finding Event",
        "value": "Macie Finding via EventBridge"
      }
    ],
    "costWarning": "Macie inventory, automated discovery and sensitive-data inspection charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity Macie / S3 permissions: macie2:EnableMacie, macie2:CreateClassificationJob, s3:CreateBucket, s3:PutObject Cleanup: macie2:DisableMacie, s3:DeleteBucket",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create S3 Bucket and Upload Sample PII Test File",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3 Console -> Click Create bucket."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Bucket name to saa-macie-scan-bucket-[account-id] in us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Click Create bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Create sample CSV file customers.csv containing mock customer names, credit card numbers, and SSNs."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Upload customers.csv into the bucket."
          }
        ],
        "note": "Provides target data payload for sensitive data discovery.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable Amazon Macie Service",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Amazon Macie Console -> Click Get started."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click Enable Macie."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Review S3 bucket inventory dashboard evaluating public and unencrypted bucket summary."
          }
        ],
        "note": "Initializes Macie service and scans S3 bucket inventory.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create Sensitive Data Discovery Job",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In Macie left navigation, click Discovery jobs -> Click Create job."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select target bucket saa-macie-scan-bucket-[account-id] -> Click Next."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select Job type One-time job -> Click Next."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Under Managed data identifiers, select All (or specifically SSN and Credit Card numbers)."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Set Job name to saa-pii-scan-job -> Click Submit."
          }
        ],
        "note": "Executes machine learning classification across objects in the target bucket.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Analyze Macie Findings and Review EventBridge Alerting",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Monitor Job status until Complete."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Click Findings -> Inspect finding details highlighting discovered Personal Data (Credit Card numbers / SSN count)."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Review EventBridge integration for routing Macie findings to Security Hub or SNS."
          }
        ],
        "note": "Identifies exposed sensitive data categories for compliance action.",
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
            "text": "Empty and delete S3 bucket saa-macie-scan-bucket-[account-id]."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Disable Amazon Macie service in settings."
          }
        ],
        "note": null,
        "warning": "Disable Macie after testing to prevent ongoing evaluation billing.",
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
        "title": "List Macie Findings via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws macie2 list-findings --region us-east-1"
          }
        ],
        "note": "Lists active Macie findings.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon Macie configuration verified in Amazon Macie."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete sensitive data discovery jobs and custom data identifiers created for the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Disable Amazon Macie if enabled solely for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Amazon Macie",
        "body": "Machine learning service designed specifically for discovering PII and sensitive data in Amazon S3 buckets."
      },
      {
        "id": "cs-2",
        "title": "GuardDuty vs Inspector vs Macie",
        "body": "Macie = S3 PII; GuardDuty = Threat Detection / Malicious API; Inspector = EC2 / ECR Vulnerabilities."
      },
      {
        "id": "cs-3",
        "title": "Managed Data Identifiers",
        "body": "Pre-built regex and ML patterns detecting SSNs, Credit Cards, Financial Data, and Passport Numbers."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Macie Job Yields Zero Findings",
        "body": "Ensure test files contain realistic mock PII strings that pass Luhn algorithm checks (for credit cards) or standard SSN formatting."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Macie vs GuardDuty Keyword Trap",
        "body": "If an exam question asks to discover Personally Identifiable Information (PII) or credit cards in S3, do NOT select GuardDuty or Inspector. Select Amazon Macie."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon Macie concepts and data security patterns in Amazon Macie."
      }
    ],
    "memoryHook": "Amazon Macie = S3 PII & Credit Card Scanner",
    "flashcardSetId": null
  }
];
