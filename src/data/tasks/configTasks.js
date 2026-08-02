/** AWS Config Tasks (SAA-C03) */
export const CONFIG_TASKS = [
  {
    "id": "task-saa-config-automated-compliance-remediation-with-aws-config-eventbridge-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-config",
    "title": "Automated Compliance & Remediation with AWS Config & EventBridge",
    "slug": "automated-compliance-remediation-with-aws-config-eventbridge",
    "service": "AWS Config",
    "feature": "AWS Config",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Automatically detect non-compliant resource configurations and trigger automated remediation using AWS Config, EventBridge, and SSM Automation.",
    "status": "published",
    "tags": [
      "AWS Config",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS Config Overview",
        "body": "Service that continually assesses, audits, and evaluates resource configurations across your AWS account against compliance rules."
      },
      {
        "id": "concept-2",
        "title": "Config Managed Rules",
        "body": "Pre-built compliance definitions (e.g. s3-bucket-public-read-prohibited, encrypted-volumes) that evaluate resource settings continuously."
      },
      {
        "id": "concept-3",
        "title": "Compliance Drift & Resource History",
        "body": "Tracks historical configuration changes over time, recording exact timestamps when resources drifted into or out of compliance."
      },
      {
        "id": "concept-4",
        "title": "Automated Remediation",
        "body": "Pairs AWS Config compliance events with Systems Manager (SSM) Automation documents or EventBridge rules to automatically remediate non-compliant resources (e.g., auto-enabling S3 Block Public Access)."
      },
      {
        "id": "concept-5",
        "title": "AWS Config vs CloudTrail vs GuardDuty Decision Matrix",
        "body": "AWS Governance ServicePrimary FunctionFocus AreaAWS ConfigResource Configuration History & Compliance DriftState evaluation (e.g. Is bucket public? Is disk encrypted?)AWS CloudTrailAPI Call Auditing & Governance LogAction evaluation (e.g. Who deleted the DB? When was instance stopped?)Amazon GuardDutyIntelligent Threat Detection & Anomaly AnalysisThreat detection (e.g. Malicious IP communication, compromised credentials)"
      }
    ],
    "whyItMatters": "This matters because distinguishing AWS Config (resource configuration history and compliance drift) vs CloudTrail (API governance) vs GuardDuty (threat detection) is heavily tested on SAA-C03. Note: AWS Config evaluates resource compliance and records configuration changes, but does not prevent changes by itself without automated remediation actions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Managed Rule",
        "value": "s3-bucket-public-read-prohibited"
      },
      {
        "label": "Remediation Target",
        "value": "SSM Automation / EventBridge"
      },
      {
        "label": "Evaluation Trigger",
        "value": "Configuration Changes"
      },
      {
        "label": "Compliance State",
        "value": "COMPLIANT / NON_COMPLIANT"
      }
    ],
    "costWarning": "AWS Config configuration items, rule evaluations, conformance packs, aggregators, remediation and connected-service charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity AWS Config / EventBridge permissions: config:PutConfigurationRecorder, config:PutConfigRule, events:PutRule Cleanup: config:DeleteConfigRule, events:DeleteRule",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Enable AWS Config Recording",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS Config Console -> Click Get started."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Under Resource types to record, select Record all current and future resource types."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Set Storage location to Create a bucket."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set IAM role to Use an existing AWS Config service-linked role."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Click Next."
          }
        ],
        "note": "Starts recording resource configuration changes across your account.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add Managed Compliance Rule (s3-bucket-public-read-prohibited)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Under Rules, click Add rule -> Search for s3-bucket-public-read-prohibited."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select managed rule -> Click Next -> Click Save."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Wait for AWS Config to evaluate S3 bucket compliance across your account."
          }
        ],
        "note": "Evaluates whether S3 buckets permit public read access.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Simulate Non-Compliant Resource and View Compliance Drift",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Create a test S3 bucket saa-non-compliant-bucket-[account-id]."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Disable Block Public Access on the test bucket."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Return to AWS Config -> Trigger rule evaluation."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Verify rule status transitions to Non-compliant."
          }
        ],
        "note": "Confirms AWS Config detects configuration drift into non-compliant state.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Configure EventBridge Rule for Automated Remediation Notification",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Amazon EventBridge Console -> Click Rules -> Click Create rule."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Set Name to saa-config-noncompliant-rule."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Set Event pattern: Service Config, Event type Config Rules Compliance Change, Detail {\"newEvaluationResult\":{\"complianceType\":[\"NON_COMPLIANT\"]}}."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Attach Target: Select SNS Topic saa-error-alerts-topic."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Click Create rule."
          }
        ],
        "note": "Routes compliance state changes to automated notification or SSM remediation.",
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
            "text": "Delete test S3 bucket saa-non-compliant-bucket-[account-id]."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete EventBridge rule saa-config-noncompliant-rule."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Turn off AWS Config recorder and delete managed rule."
          }
        ],
        "note": null,
        "warning": "Turn off AWS Config recorder to prevent ongoing evaluation billing.",
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
        "title": "Describe AWS Config Compliance Rules",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws configservice describe-config-rules --region us-east-1"
          }
        ],
        "note": "Lists active Config compliance rules.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Config configuration verified in AWS Config."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete custom and managed AWS Config rules created for the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Stop the configuration recorder and delete the delivery channel."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS Config",
        "body": "Assesses and audits resource configuration state and historical compliance drift over time."
      },
      {
        "id": "cs-2",
        "title": "Automated Remediation",
        "body": "Uses SSM Automation documents triggered directly by Config rules or EventBridge compliance events."
      },
      {
        "id": "cs-3",
        "title": "Config vs CloudTrail",
        "body": "Config tracks **resource configuration state**; CloudTrail logs **API call actions**."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Rule Evaluation Delayed",
        "body": "AWS Config rule evaluations run periodically or upon configuration changes. Click **Re-evaluate** in the Config console to force immediate evaluation."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "AWS Config vs CloudTrail Traps",
        "body": "If an exam question asks to track **resource configuration drift and history**, do NOT select CloudTrail. Select AWS Config."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Config concepts and observability patterns in AWS Config."
      }
    ],
    "memoryHook": "AWS Config = Configuration State & Compliance | SSM / EventBridge = Auto-Remediation",
    "flashcardSetId": null
  }
];
