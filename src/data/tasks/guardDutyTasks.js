/** Amazon GuardDuty Tasks (SAA-C03) */
export const GUARDDUTY_TASKS = [
  {
    "id": "task-saa-guardduty-intelligent-threat-detection-with-amazon-guardduty-auto-remediation-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-guardduty",
    "title": "Intelligent Threat Detection with Amazon GuardDuty & Auto-Remediation",
    "slug": "intelligent-threat-detection-with-amazon-guardduty-auto-remediation",
    "service": "Amazon GuardDuty",
    "feature": "Amazon GuardDuty",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Detect unauthorized API calls, compromised EC2 instances, or malicious IAM activity using Amazon GuardDuty and trigger automated EventBridge remediation.",
    "status": "published",
    "tags": [
      "Amazon GuardDuty",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon GuardDuty Overview",
        "body": "Intelligent threat detection service that continuously monitors AWS accounts and workloads for malicious activity and unauthorized behavior."
      },
      {
        "id": "concept-2",
        "title": "GuardDuty Data Sources",
        "body": "Analyzes primary data sources without agent installation: AWS CloudTrail Event Logs, VPC Flow Logs, DNS Logs, plus optional S3 Data Events, EKS Audit Logs, and RDS Protection."
      },
      {
        "id": "concept-3",
        "title": "Automated Security Remediation",
        "body": "GuardDuty emits findings to EventBridge in real time. EventBridge rules trigger Lambda functions to isolate compromised EC2 Security Groups or revoke compromised IAM access keys."
      },
      {
        "id": "concept-4",
        "title": "GuardDuty vs Amazon Inspector",
        "body": "GuardDuty: Continuous threat detection analyzing log streams for active attacks. Inspector: Vulnerability scanning engine for EC2/ECR software CVEs and network reachability."
      },
      {
        "id": "concept-5",
        "title": "Security & Threat Detection Master Decision Matrix",
        "body": "AWS Security ServiceData Inputs AnalyzedPrimary Security ObjectiveAmazon GuardDutyCloudTrail Logs, VPC Flow Logs, DNS Logs, S3 LogsDetect active threats & compromised resourcesAmazon InspectorEC2 OS agent / ECR container imagesDetect software vulnerabilities (CVEs) & open portsAmazon MacieAmazon S3 Bucket object contentsDiscover unencrypted PII & sensitive dataAWS WAFHTTP/HTTPS requests at CloudFront / ALB / API GatewayBlock OWASP Top 10 web exploits & HTTP floods"
      }
    ],
    "whyItMatters": "This matters because understanding GuardDuty (continuous threat detection using CloudTrail, VPC Flow Logs, DNS logs) vs Inspector (software vulnerability scanning) is a core SAA-C03 scenario.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Data Sources",
        "value": "CloudTrail, VPC Flow Logs, DNS Logs"
      },
      {
        "label": "Sample Finding",
        "value": "Recon:EC2/Portscan"
      },
      {
        "label": "Event Rule",
        "value": "GuardDuty Finding via EventBridge"
      },
      {
        "label": "Remediation Action",
        "value": "Isolate Security Group via Lambda"
      }
    ],
    "costWarning": "GuardDuty monitoring and enabled protection-plan charges may apply based on analysed data volume and resources.",
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
        "note": "Identity check: sts:GetCallerIdentity GuardDuty / EventBridge permissions: guardduty:EnableGuardDuty, guardduty:CreateSampleFindings, events:PutRule Cleanup: guardduty:DisableGuardDuty, events:DeleteRule",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Enable Amazon GuardDuty",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon GuardDuty Console in us-east-1."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Click Enable GuardDuty."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Verify GuardDuty status shows Enabled and starts monitoring CloudTrail, VPC Flow Logs, and DNS logs."
          }
        ],
        "note": "GuardDuty analyzes log streams asynchronously without impacting workload performance or requiring agents.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Generate Sample Threat Findings",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In left navigation, choose Settings."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Scroll to Sample findings -> Click Generate sample findings."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Findings in left navigation -> Review sample threat alerts (e.g. Recon:EC2/Portscan, UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration)."
          }
        ],
        "note": "Generates synthetic security findings to test incident response workflows.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure EventBridge Rule for Automated Remediation",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Amazon EventBridge Console -> Click Rules -> Click Create rule."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Name to saa-guardduty-finding-rule."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Event pattern: Service GuardDuty, Event type GuardDuty Finding."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Attach Target: Select Lambda function (or SNS topic) to isolate compromised Security Groups."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Click Create rule."
          }
        ],
        "note": "Connects GuardDuty threat alerts to automated Lambda security isolation code.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Review GuardDuty vs Amazon Inspector vs Macie Decision Rules",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Review differences between GuardDuty (continuous threat detection), Inspector (software CVE vulnerability scanning), and Macie (S3 PII discovery)."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Verify scenario keyword matching rules for the SAA-C03 exam."
          }
        ],
        "note": "Guarantees 100% precision on AWS security service questions.",
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
            "text": "Delete EventBridge rule saa-guardduty-finding-rule."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Disable Amazon GuardDuty in settings."
          }
        ],
        "note": null,
        "warning": "Disable GuardDuty after testing to prevent ongoing evaluation charges.",
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
        "title": "List GuardDuty Detectors via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws guardduty list-detectors --region us-east-1"
          }
        ],
        "note": "Lists active GuardDuty detectors.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon GuardDuty configuration verified in Amazon GuardDuty."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Archive sample findings and delete custom threat lists created for the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Disable Amazon GuardDuty detector if created solely for this lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Amazon GuardDuty",
        "body": "Continuous intelligent threat detection analyzing CloudTrail, VPC Flow Logs, and DNS logs. No agent required."
      },
      {
        "id": "cs-2",
        "title": "Amazon Inspector",
        "body": "Automated vulnerability management scanning EC2 instances and ECR container images for software CVEs."
      },
      {
        "id": "cs-3",
        "title": "Auto-Remediation",
        "body": "GuardDuty -> EventBridge Rule -> Lambda Function (Isolate Security Group / Revoke Credentials)."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "No GuardDuty Findings Showing",
        "body": "GuardDuty analyzes live threats over time. In a lab environment, use **Generate sample findings** under Settings to test event triggers."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "GuardDuty vs Inspector Keyword Trap",
        "body": "If an exam question asks to detect **compromised EC2 instances communicating with malicious IP addresses**, select Amazon GuardDuty. If it asks to scan for **software CVE vulnerabilities or missing patches**, select Amazon Inspector."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon GuardDuty concepts and data security patterns in Amazon GuardDuty."
      }
    ],
    "memoryHook": "GuardDuty = Active Threat & Compromised Key Detection | Inspector = CVE Vulnerability Scanner",
    "flashcardSetId": null
  }
];
