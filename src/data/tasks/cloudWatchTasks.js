/** Amazon CloudWatch Tasks (SAA-C03) */
export const CLOUDWATCH_TASKS = [
  {
    "id": "task-saa-cloudwatch-custom-system-metrics-with-cloudwatch-agent-ec2-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-cloudwatch",
    "title": "Custom System Metrics with CloudWatch Agent & EC2",
    "slug": "custom-system-metrics-with-cloudwatch-agent-ec2",
    "service": "Amazon CloudWatch",
    "feature": "Amazon CloudWatch",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Collect OS-level metrics (e.g., RAM memory utilization, disk space) that CloudWatch hypervisor metrics cannot see by default using the Unified CloudWatch Agent.",
    "status": "published",
    "tags": [
      "Amazon CloudWatch",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Hypervisor vs OS-Level Metrics",
        "body": "Hypervisor Metrics (Default): Collected from outside the VM without an agent (CPU utilization, Network I/O, Disk I/O). OS-Level Metrics (Custom): Collected inside the OS (RAM memory usage, swap space, mounted disk usage) requiring the CloudWatch Agent."
      },
      {
        "id": "concept-2",
        "title": "Unified CloudWatch Agent",
        "body": "Lightweight daemon installed inside EC2 instances or on-premises servers to collect system metrics and log files."
      },
      {
        "id": "concept-3",
        "title": "IAM Instance Profile Role",
        "body": "Grants the EC2 instance permissions to publish metric data to CloudWatch using the managed policy CloudWatchAgentServerPolicy."
      },
      {
        "id": "concept-4",
        "title": "CWAgent Custom Namespace",
        "body": "Metrics published by the CloudWatch Agent are stored under the custom metric namespace CWAgent in CloudWatch."
      },
      {
        "id": "concept-5",
        "title": "Hypervisor vs CloudWatch Agent Metrics Comparison Matrix",
        "body": "Metric CategoryHypervisor Metrics (Default / Free)CloudWatch Agent Metrics (Custom)Collection MechanismAgentless (Host Hypervisor level)Agent-based (Installed in OS)CPU UtilizationCollected nativelyCollected natively with per-core breakdownNetwork / Disk I/OCollected natively (Packets & bytes)Collected nativelyRAM / Memory UsageNOT AvailableCollected (mem_used_percent)Swap Space / Disk SpaceNOT AvailableCollected (disk_used_percent)On-Premises ServersNot supportedSupported (Hybrid Cloud metrics)"
      }
    ],
    "whyItMatters": "This matters because distinguishing between CloudWatch hypervisor metrics (CPU, Network, Disk I/O) vs. OS-level custom metrics (Memory/RAM utilization, swap usage, disk space) requiring the CloudWatch Agent is a classic SAA-C03 exam scenario.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "IAM Role Name",
        "value": "EC2-CloudWatchAgent-Role"
      },
      {
        "label": "Managed Policy",
        "value": "CloudWatchAgentServerPolicy"
      },
      {
        "label": "Metric Namespace",
        "value": "CWAgent"
      },
      {
        "label": "Target OS Metric",
        "value": "mem_used_percent"
      }
    ],
    "costWarning": "CloudWatch custom metrics, detailed monitoring, alarms, dashboards, Logs ingestion and storage, Logs Insights queries, Synthetics and connected-service charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity EC2 / IAM / CloudWatch permissions: ec2:RunInstances, iam:CreateRole, iam:AttachRolePolicy, cloudwatch:PutMetricData Cleanup: ec2:TerminateInstances, iam:DeleteRole",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create IAM Role for CloudWatch Agent",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open IAM Console -> Choose Roles -> Click Create role."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Select Trusted entity type AWS service -> Select Use case EC2."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Search for and attach managed policy CloudWatchAgentServerPolicy."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Role name to EC2-CloudWatchAgent-Role -> Click Create role."
          }
        ],
        "note": "Grants EC2 permissions to push metric data to CloudWatch.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Launch EC2 Instance and Attach IAM Role",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Amazon EC2 Console -> Click Launch instance."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set Name to saa-cwagent-demo and select Amazon Linux 2023 AMI."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select Instance type t2.micro (or t3.micro)."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Under Advanced details -> IAM instance profile, select EC2-CloudWatchAgent-Role."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Click Launch instance."
          }
        ],
        "note": "Attaching the instance profile authorizes the CloudWatch Agent daemon.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Install and Start CloudWatch Agent via EC2 User Data or SSM",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Connect to instance via EC2 Instance Connect."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Download CloudWatch Agent package: sudo yum install -y amazon-cloudwatch-agent."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Create minimal agent configuration file /opt/aws/amazon-cloudwatch-agent/bin/config.json enabling mem_used_percent and disk_used_percent."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Start CloudWatch Agent service: sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json -s."
          }
        ],
        "note": "Initializes agent daemon to collect OS-level memory and disk metrics.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify Custom Memory Metrics in CloudWatch Console",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Amazon CloudWatch Console -> Click Metrics in left navigation -> Choose All metrics."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Locate custom namespace CWAgent."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select metric mem_used_percent for instance saa-cwagent-demo."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Confirm RAM memory utilization graph renders in real time."
          }
        ],
        "note": "Validates that OS memory metrics appear under the CWAgent namespace.",
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
            "text": "Terminate EC2 instance saa-cwagent-demo."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete IAM role EC2-CloudWatchAgent-Role."
          }
        ],
        "note": null,
        "warning": "Terminate EC2 instances to stop compute billing.",
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
        "title": "List CloudWatch Custom Metrics",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws cloudwatch list-metrics --namespace CWAgent --region us-east-1"
          }
        ],
        "note": "Lists custom metrics collected by CloudWatch Agent.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon CloudWatch configuration verified in Amazon CloudWatch."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete test CloudWatch metric alarms and dashboards."
      },
      {
        "id": "cleanup-2",
        "text": "Delete custom CloudWatch log groups created for the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Hypervisor Metrics",
        "body": "CPU utilization, Network I/O, Disk I/O. Collected automatically without an agent."
      },
      {
        "id": "cs-2",
        "title": "CloudWatch Agent Metrics",
        "body": "RAM memory usage, swap utilization, mounted disk space. Requires installing CloudWatch Agent."
      },
      {
        "id": "cs-3",
        "title": "Managed IAM Policy",
        "body": "`CloudWatchAgentServerPolicy` provides required permissions for the agent daemon."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Memory Metrics Missing in CloudWatch",
        "body": "Verify that the EC2 instance has an IAM instance profile attached with `CloudWatchAgentServerPolicy` and that the agent service is running."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Memory Metric Default Trap",
        "body": "CloudWatch hypervisors do NOT collect RAM memory or disk space metrics by default. If an exam question asks to monitor RAM utilization, choose Install CloudWatch Agent."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon CloudWatch concepts and observability patterns in Amazon CloudWatch."
      }
    ],
    "memoryHook": "Hypervisor = CPU / Net / Disk I/O | CloudWatch Agent = RAM / Swap / Disk Space",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-cloudwatch-real-time-metric-filters-alarms-sns-notifications-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-cloudwatch",
    "title": "Real-time Metric Filters, Alarms & SNS Notifications",
    "slug": "real-time-metric-filters-alarms-sns-notifications",
    "service": "Amazon CloudWatch",
    "feature": "Amazon CloudWatch",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Monitor application log streams for specific error patterns and trigger automated notifications.",
    "status": "published",
    "tags": [
      "Amazon CloudWatch",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "CloudWatch Log Groups & Streams",
        "body": "Log Groups contain multiple Log Streams emitted by application components, EC2 instances, or Lambda functions."
      },
      {
        "id": "concept-2",
        "title": "Metric Filters",
        "body": "Scans log events in real time for specific text strings or JSON patterns (e.g. `ERROR`, `500`, `[status=500]`) and increments a custom numerical metric."
      },
      {
        "id": "concept-3",
        "title": "CloudWatch Alarms",
        "body": "Monitors metric thresholds over specified time windows. Evaluates three states: `OK`, `IN_ALARM`, and `INSUFFICIENT_DATA`."
      },
      {
        "id": "concept-4",
        "title": "Amazon SNS Email Notifications",
        "body": "Triggers automated email or SMS notifications when a CloudWatch Alarm transitions into the `IN_ALARM` state."
      },
      {
        "id": "concept-5",
        "title": "Log Monitoring & Notification Pipeline Matrix",
        "body": "Pipeline StageAWS Service / ResourceRole & Description1. Log CollectionCloudWatch Log GroupReceives raw log entries from application instances2. Pattern ExtractionCloudWatch Metric FilterParses log stream text and extracts custom numeric metrics3. Threshold EvaluationCloudWatch AlarmEvaluates metric values against static or anomaly thresholds4. Notification DispatchAmazon SNS TopicSends email, SMS, or webhook alert notifications to subscribers"
      }
    ],
    "whyItMatters": "This matters because the pattern of Log Metric Filters -> Custom Metric -> CloudWatch Alarm -> SNS Topic is a core SAA-C03 workflow.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Log Group Name",
        "value": "/aws/apps/saa-application-logs"
      },
      {
        "label": "Filter Pattern",
        "value": "ERROR"
      },
      {
        "label": "Custom Metric Name",
        "value": "MyAppMetrics / ErrorCount"
      },
      {
        "label": "SNS Topic Name",
        "value": "saa-error-alerts-topic"
      }
    ],
    "costWarning": "CloudWatch custom metrics, detailed monitoring, alarms, dashboards, Logs ingestion and storage, Logs Insights queries, Synthetics and connected-service charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity CloudWatch Logs / Alarms permissions: logs:CreateLogGroup, logs:PutMetricFilter, cloudwatch:PutMetricAlarm SNS permissions: sns:CreateTopic, sns:Subscribe Cleanup: logs:DeleteLogGroup, cloudwatch:DeleteAlarms, sns:DeleteTopic",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create CloudWatch Log Group and Stream Log Events",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon CloudWatch Console -> Click Log groups in left navigation -> Click Create log group."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Log group name to /aws/apps/saa-application-logs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Click Create."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Open log group details -> Choose Log streams tab -> Click Create log stream."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Log stream name to app-stream-1 -> Click Create."
          }
        ],
        "note": "Creates the target log group and stream for receiving application log events.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Define Log Metric Filter for Error Terms",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open /aws/apps/saa-application-logs -> Choose Metric filters tab -> Click Create metric filter."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Under Filter pattern, enter ERROR."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Next."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set Filter name to ErrorCountFilter."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set Metric namespace to MyAppMetrics and Metric name to ErrorCount."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Set Metric value to 1 -> Click Create metric filter."
          }
        ],
        "note": "Scans log events in real time and increments ErrorCount whenever ERROR appears.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create CloudWatch Alarm and Amazon SNS Topic",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select ErrorCountFilter -> Click Create alarm."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Threshold type to Static -> Whenever ErrorCount is Greater/Equal to 1 for 1 datapoint within 1 minute."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Click Next."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Under Alarm state trigger, select In alarm."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Select Create new topic -> Set Topic name to saa-error-alerts-topic."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Enter your Email address for notifications -> Click Create topic."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Set Alarm name to HighAppErrorRateAlarm -> Click Create alarm."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Open your email inbox and click Confirm subscription on the SNS confirmation email."
          }
        ],
        "note": "Connects metric threshold breach to SNS email delivery.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Simulate Application Error and Test SNS Notification",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open log stream app-stream-1 -> Click Actions -> Choose Create log event."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Paste test log entry: 2026-07-22 14:00:00 [ERROR] 500 Internal Server Error processing order #9941."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Click Create."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Monitor CloudWatch Alarm state transition from OK to In alarm."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Verify receipt of SNS alert email in your inbox."
          }
        ],
        "note": "Validates that log errors automatically fire alarms and send email alerts.",
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
            "text": "Delete CloudWatch Alarm HighAppErrorRateAlarm."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete SNS Topic saa-error-alerts-topic."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete Log Group /aws/apps/saa-application-logs."
          }
        ],
        "note": null,
        "warning": "Delete alarms and SNS topics to clean up account resources.",
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
        "title": "Create Log Group and Metric Filter via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws logs create-log-group --log-group-name /aws/apps/saa-application-logs --region us-east-1\naws logs put-metric-filter --log-group-name /aws/apps/saa-application-logs --filter-name ErrorCountFilter --filter-pattern ERROR --metric-transformations metricName=ErrorCount,metricNamespace=MyAppMetrics,metricValue=1 --region us-east-1"
          }
        ],
        "note": "Creates log group and attaches metric filter.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon CloudWatch configuration verified in Amazon CloudWatch."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete test CloudWatch metric alarms and dashboards."
      },
      {
        "id": "cleanup-2",
        "text": "Delete custom CloudWatch log groups created for the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Log Metric Filters",
        "body": "Scans log events in real time and turns log text occurrences into custom numeric CloudWatch metrics."
      },
      {
        "id": "cs-2",
        "title": "CloudWatch Alarms",
        "body": "Evaluates custom or system metrics against static or anomaly thresholds."
      },
      {
        "id": "cs-3",
        "title": "Amazon SNS Integration",
        "body": "Dispatches email, SMS, HTTP webhooks, or Lambda triggers when alarms breach thresholds."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Alarm Remains in INSUFFICIENT_DATA",
        "body": "Ensure test log events match the exact case of the metric filter pattern (e.g. `ERROR` vs `error`)."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Log Filter Notification Chain Trap",
        "body": "Metric filters do NOT send emails directly. Metric filters create custom metrics -> Alarms evaluate metrics -> SNS sends notifications."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon CloudWatch concepts and observability patterns in Amazon CloudWatch."
      }
    ],
    "memoryHook": "Log Stream -> Metric Filter -> Custom Metric -> Alarm -> SNS Notification",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-cloudwatch-network-traffic-analysis-with-vpc-flow-logs-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-cloudwatch",
    "title": "Network Traffic Analysis with VPC Flow Logs",
    "slug": "network-traffic-analysis-with-vpc-flow-logs",
    "service": "Amazon CloudWatch",
    "feature": "Amazon CloudWatch",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Capture and inspect IP traffic flowing to and from network interfaces in your VPC to troubleshoot Security Group and NACL rules.",
    "status": "published",
    "tags": [
      "Amazon CloudWatch",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "VPC Flow Logs Overview",
        "body": "Feature that captures IP traffic flowing to and from network interfaces (ENIs) in a VPC, subnet, or specific network interface."
      },
      {
        "id": "concept-2",
        "title": "ACCEPT vs REJECT Traffic Actions",
        "body": "ACCEPT: Traffic allowed by both Security Groups and Network ACLs. REJECT: Traffic dropped by either a Security Group ingress/egress rule or a Network ACL rule."
      },
      {
        "id": "concept-3",
        "title": "Storage Destination Targets",
        "body": "Amazon S3: Most cost-effective target for long-term archiving and Athena SQL queries. CloudWatch Logs: Ideal for real-time metric filtering and alarms. Kinesis Data Firehose: Ideal for streaming to third-party SIEM tools."
      },
      {
        "id": "concept-4",
        "title": "Flow Log Record Fields",
        "body": "Captures metadata including `version`, `account-id`, `interface-id`, `srcaddr`, `dstaddr`, `srcport`, `dstport`, `protocol`, `bytes`, `packets`, `action`, `log-status`."
      },
      {
        "id": "concept-5",
        "title": "VPC Flow Log Destination Comparison Matrix",
        "body": "Destination TargetPrimary Use CaseAnalysis ToolingCost ProfileAmazon S3 BucketLong-term audit archiving & complianceAmazon Athena SQL queriesLowest cost (Supports S3 Lifecycle to Glacier)CloudWatch LogsReal-time metric filtering & immediate alertingCloudWatch Logs InsightsModerate cost (Ingestion & indexing fees)Kinesis Data FirehoseStreaming to external SIEM / Security toolsDatadog, Splunk, ElasticSearchVariable based on stream volume"
      }
    ],
    "whyItMatters": "This matters because network troubleshooting (Security Group / NACL drops) using VPC Flow Logs and selecting cost-effective storage targets (S3 with Lifecycle rules vs CloudWatch Logs) is a core SAA-C03 topic.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Log Group Name",
        "value": "/aws/vpc/saa-flow-logs"
      },
      {
        "label": "IAM Role",
        "value": "VPCFlowLogs-CloudWatch-Role"
      },
      {
        "label": "Traffic Filter",
        "value": "ALL (ACCEPT & REJECT)"
      },
      {
        "label": "Primary Diagnostic",
        "value": "Security Group vs NACL drops"
      }
    ],
    "costWarning": "CloudWatch custom metrics, detailed monitoring, alarms, dashboards, Logs ingestion and storage, Logs Insights queries, Synthetics and connected-service charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity VPC / Flow Logs permissions: ec2:CreateFlowLogs, ec2:DescribeFlowLogs, iam:CreateRole CloudWatch permissions: logs:CreateLogGroup Cleanup: ec2:DeleteFlowLogs, logs:DeleteLogGroup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create CloudWatch Log Group for Flow Logs",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon CloudWatch Console -> Click Log groups -> Click Create log group."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Log group name to /aws/vpc/saa-flow-logs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Set Retention to 1 day -> Click Create."
          }
        ],
        "note": "Creates the target CloudWatch log group.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create IAM Role for VPC Flow Logs",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open IAM Console -> Create role for service VPC Flow Logs (or EC2)."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Attach trust policy allowing vpc-flow-logs.amazonaws.com to assume role."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Attach policy granting logs:CreateLogStream and logs:PutLogEvents."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name role VPCFlowLogs-CloudWatch-Role."
          }
        ],
        "note": "Authorizes VPC Flow Logs engine to deliver log records to CloudWatch.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Enable Flow Logs on VPC or Subnet",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Amazon VPC Console -> Select your lab VPC -> Choose Flow logs tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Click Create flow log."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Name to saa-vpc-flowlog."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Filter to All (or REJECT)."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Set Destination to Send to CloudWatch Logs."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Select Destination log group /aws/vpc/saa-flow-logs."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Select IAM role VPCFlowLogs-CloudWatch-Role."
          },
          {
            "id": "console-step-4-item-8",
            "text": "Click Create flow log."
          }
        ],
        "note": "Starts capturing all IP traffic for network interfaces in the VPC.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Inspect ACCEPT vs REJECT Traffic Logs",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Generate HTTP / SSH traffic to an EC2 instance in the VPC."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Open CloudWatch Log Group /aws/vpc/saa-flow-logs."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Inspect flow log fields: srcaddr, dstaddr, srcport, dstport, protocol, action (ACCEPT / REJECT)."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Identify Security Group drops (REJECT traffic with missing Security Group ingress rule) vs NACL drops."
          }
        ],
        "note": "REJECT entries highlight traffic blocked by firewall rules.",
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
            "text": "Delete VPC Flow Log saa-vpc-flowlog."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete Log Group /aws/vpc/saa-flow-logs."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Delete IAM role VPCFlowLogs-CloudWatch-Role."
          }
        ],
        "note": null,
        "warning": "Delete flow logs to stop ongoing log ingestion.",
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
        "title": "Describe VPC Flow Logs",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws ec2 describe-flow-logs --region us-east-1"
          }
        ],
        "note": "Lists active VPC Flow Logs.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon CloudWatch configuration verified in Amazon CloudWatch."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete test CloudWatch metric alarms and dashboards."
      },
      {
        "id": "cleanup-2",
        "text": "Delete custom CloudWatch log groups created for the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "VPC Flow Logs",
        "body": "Captures IP traffic metadata for VPC ENIs. Does NOT capture actual packet payloads."
      },
      {
        "id": "cs-2",
        "title": "REJECT Action",
        "body": "Indicates traffic blocked by either a Security Group rule or Network ACL rule."
      },
      {
        "id": "cs-3",
        "title": "S3 vs CloudWatch Destination",
        "body": "Choose Amazon S3 for cheap long-term archiving + Athena queries; choose CloudWatch for real-time metric alarms."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Flow Log Record Latency",
        "body": "VPC Flow Logs publish records in 1-minute or 10-minute aggregation intervals. Allow up to 5 minutes for logs to appear."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Packet Payload Misconception Trap",
        "body": "VPC Flow Logs do NOT inspect packet payloads (HTTP request text). For deep packet inspection, choose AWS Network Firewall or GWLB."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon CloudWatch concepts and observability patterns in Amazon CloudWatch."
      }
    ],
    "memoryHook": "VPC Flow Logs = IP Traffic Metadata | REJECT = Blocked by Firewall Rules",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-cloudwatch-distributed-microservice-tracing-with-aws-x-ray-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-cloudwatch",
    "title": "Distributed Microservice Tracing with AWS X-Ray",
    "slug": "distributed-microservice-tracing-with-aws-x-ray",
    "service": "Amazon CloudWatch",
    "feature": "Amazon CloudWatch",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Identify latency bottlenecks and service dependencies across distributed serverless or containerized microservices using AWS X-Ray Service Maps and Trace Timelines.",
    "status": "published",
    "tags": [
      "Amazon CloudWatch",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS X-Ray Overview",
        "body": "Distributed tracing service that collects data about requests served by microservices, providing a visual map of service dependencies and performance bottlenecks."
      },
      {
        "id": "concept-2",
        "title": "X-Ray Traces, Segments & Subsegments",
        "body": "Trace: Tracks an end-to-end request across all microservices. Segment: Data sent by a single compute component (e.g. API Gateway, Lambda, ECS). Subsegment: Detailed breakdown of downstream calls inside a segment (e.g., DynamoDB query time, HTTP API call duration)."
      },
      {
        "id": "concept-3",
        "title": "X-Ray Service Map",
        "body": "Visual node connection graph displaying service health, average latency, and call volumes across microservice architectures."
      },
      {
        "id": "concept-4",
        "title": "Trace Context Header (X-Amzn-Trace-Id)",
        "body": "HTTP header passed between microservices to propagate trace context across network boundaries."
      },
      {
        "id": "concept-5",
        "title": "X-Ray Tracing Components Matrix",
        "body": "X-Ray ComponentFunctionDeployment PointX-Ray SDKInstruments application code, intercepts HTTP/database callsApplication code / Lambda functionX-Ray DaemonListens for UDP trace segments and batches uploads to X-Ray serviceEC2 instance, ECS container, Elastic BeanstalkActive Tracing ToggleNative 1-click integration without code changesAWS Lambda, Amazon API Gateway, AWS App Runner"
      }
    ],
    "whyItMatters": "This matters because AWS X-Ray for distributed call tracing, performance bottlenecks, and service map visualization is a primary SAA-C03 exam topic.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Lambda Function",
        "value": "saa-xray-processor-fn"
      },
      {
        "label": "API Gateway",
        "value": "saa-xray-api"
      },
      {
        "label": "Tracing Mode",
        "value": "Active Tracing Enabled"
      },
      {
        "label": "Trace Header",
        "value": "X-Amzn-Trace-Id"
      }
    ],
    "costWarning": "CloudWatch custom metrics, detailed monitoring, alarms, dashboards, Logs ingestion and storage, Logs Insights queries, Synthetics and connected-service charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity Lambda / API Gateway / X-Ray permissions: lambda:CreateFunction, apigateway:POST, xray:PutTraceSegments Cleanup: lambda:DeleteFunction, apigateway:DELETE",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a Serverless Microservice (Lambda + API Gateway)",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open AWS Lambda Console -> Click Create function."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Set Name to saa-xray-processor-fn and Runtime Node.js 20.x (or Python 3.12)."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Attach basic execution role with AWSXRayDaemonWriteAccess policy."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Open Amazon API Gateway Console -> Create a REST API saa-xray-api with a GET method targeting saa-xray-processor-fn."
          }
        ],
        "note": "Creates a two-tier serverless microservice.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable Active Tracing in Lambda and API Gateway",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In Lambda Console -> Select saa-xray-processor-fn -> Choose Configuration tab -> Click Monitoring and operations tools."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click Edit -> Enable AWS X-Ray active tracing -> Click Save."
          },
          {
            "id": "console-step-3-item-3",
            "text": "In API Gateway Console -> Select stage prod -> Choose Logs/Tracing tab -> Check Enable X-Ray Tracing -> Click Save changes."
          }
        ],
        "note": "Activates automatic trace propagation and segment logging across both services.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Generate Microservice Requests and Trace Telemetry",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Send 10 test HTTP GET requests to the API Gateway invocation URL."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Add intentional sleep / latency in Lambda code to simulate backend database bottlenecks."
          }
        ],
        "note": "Generates trace data for analysis in the X-Ray console.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Inspect X-Ray Service Map and Segment Trace Timelines",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open AWS CloudWatch Console -> Under X-Ray traces in left navigation, click Service map."
          },
          {
            "id": "console-step-5-item-2",
            "text": "View visual node connection graph displaying client -> API Gateway -> Lambda -> downstream services."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Click Traces -> Select an individual trace -> Inspect the Segment timeline to isolate exact execution latency bottlenecks."
          }
        ],
        "note": "Pinpoints performance bottlenecks and latency spikes across distributed components.",
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
            "text": "Delete API Gateway REST API saa-xray-api."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete Lambda function saa-xray-processor-fn."
          }
        ],
        "note": null,
        "warning": "Delete API Gateway and Lambda functions after testing.",
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
        "title": "List X-Ray Traces",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws xray get-service-graph --start-time $(date -u -d '1 hour ago' +%s) --end-time $(date -u +%s) --region us-east-1"
          }
        ],
        "note": "Retrieves service graph data via CLI.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon CloudWatch configuration verified in Amazon CloudWatch."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete test CloudWatch metric alarms and dashboards."
      },
      {
        "id": "cleanup-2",
        "text": "Delete custom CloudWatch log groups created for the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS X-Ray",
        "body": "Distributed tracing service for microservice debugging, performance bottleneck analysis, and visual service maps."
      },
      {
        "id": "cs-2",
        "title": "X-Ray Service Map",
        "body": "Visual graph depicting call paths, latency, and error rates across all connected microservices."
      },
      {
        "id": "cs-3",
        "title": "Trace Context Header",
        "body": "`X-Amzn-Trace-Id` passes trace IDs across HTTP calls to link segments together."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Missing X-Ray Traces in Service Map",
        "body": "Ensure Lambda execution role has policy `AWSXRayDaemonWriteAccess` and that **Active Tracing** is toggled ON."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Distributed Tracing Trap",
        "body": "If an exam question asks to **debug latency bottlenecks and visualize call dependencies across microservices**, do NOT select CloudWatch Logs or CloudTrail. Select AWS X-Ray."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon CloudWatch concepts and observability patterns in Amazon CloudWatch."
      }
    ],
    "memoryHook": "AWS X-Ray = Distributed Microservice Tracing & Latency Bottlenecks",
    "flashcardSetId": null
  }
];
