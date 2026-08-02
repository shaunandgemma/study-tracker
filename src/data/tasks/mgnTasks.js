/** AWS MGN Tasks (SAA-C03) */
export const MGN_TASKS = [
  {
    "id": "task-saa-mgn-rehost-a-server-with-aws-mgn-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-mgn",
    "title": "Rehost a Server with AWS MGN",
    "slug": "rehost-a-server-with-aws-mgn",
    "service": "AWS Application Migration Service",
    "feature": "AWS Application Migration Service",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Rehost an on-premises host server to AWS EC2 using AWS Application Migration Service (MGN) continuous block replication.",
    "status": "published",
    "tags": [
      "AWS Application Migration Service",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Rehosting (Lift-and-Shift)",
        "body": "Moving servers to AWS EC2 without altering application code or architecture."
      },
      {
        "id": "concept-2",
        "title": "AWS MGN",
        "body": "Primary AWS service for continuous block-level server replication and automated migrations."
      },
      {
        "id": "concept-3",
        "title": "Staging Subnet",
        "body": "A private subnet where lightweight MGN replication servers receive continuous disk block updates."
      }
    ],
    "whyItMatters": "This matters because AWS MGN is the primary exam answer for automated, low-downtime server migrations to AWS EC2.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Staging Subnet",
        "value": "10.0.1.0/24 (Private)"
      },
      {
        "label": "Replication Server",
        "value": "t3.small (gp3 EBS)"
      },
      {
        "label": "Installer Policy",
        "value": "AWSApplicationMigrationAgentInstallationPolicy"
      }
    ],
    "costWarning": "Application Migration Service replication infrastructure, staging resources, EC2 instances, EBS volumes, snapshots and data-transfer charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity MGN setup: mgn:InitializeService, mgn:CreateReplicationConfigurationTemplate, mgn:DescribeSourceServers Teardown: ec2:TerminateInstances, iam:DeleteUser",
        "warning": "Do not leave long-term admin credentials in real accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Initialize AWS Application Migration Service",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Application Migration Service."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Get started."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Select your lab VPC and private staging subnet."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Save replication template."
          }
        ],
        "note": "Initializes service-linked roles and default staging subnet settings.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create installer IAM user and credentials",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open IAM."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Users -> Create user."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name user mgn-agent-installer."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Attach policy AWSApplicationMigrationAgentInstallationPolicy."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Open Security credentials -> Create access key -> Choose CLI."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Copy Access Key ID and Secret Access Key."
          }
        ],
        "note": "Allows the agent to register the source server with MGN.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Install AWS Replication Agent on source server",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Connect to your source server (Linux or Windows)."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Download installer: wget https://aws-application-migration-service-us-east-1.s3.amazonaws.com/latest/linux/aws-replication-installer-init.py."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Run script: sudo python3 aws-replication-installer-init.py."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Enter Region us-east-1, Access Key ID, and Secret Access Key."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Confirm default disk selection."
          }
        ],
        "note": "Starts continuous block-level disk replication.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Monitor replication and launch test instance",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open MGN -> Source servers."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select your registered server hostname."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm replication status displays Healthy and Ready for testing."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Test and cutover -> Launch test instances."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Verify test EC2 instance in the EC2 console."
          }
        ],
        "note": "Testing does not interrupt continuous replication.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Perform cutover and tear down resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select source server in MGN."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Test and cutover -> Mark as ready for cutover."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Choose Test and cutover -> Launch cutover instances."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Finalize cutover."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Terminate test/cutover EC2 instances and delete mgn-agent-installer IAM user."
          }
        ],
        "note": null,
        "warning": "Terminate test instances and delete server record when finished to avoid charges.",
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
        "title": "Set variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=us-east-1\nSERVER_ID=s-replace"
          }
        ],
        "note": "Replace SERVER_ID with your source server ID.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Describe replication configuration templates",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws mgn describe-replication-configuration-templates --region $REGION"
          }
        ],
        "note": "Returns default staging subnet and volume settings.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "List registered source servers",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws mgn describe-source-servers --region $REGION"
          }
        ],
        "note": "Displays server IDs and replication status.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Launch test instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws mgn start-test --source-server-ids $SERVER_ID --region $REGION"
          }
        ],
        "note": "Launches a test EC2 instance.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Finalize cutover and clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws mgn start-cutover --source-server-ids $SERVER_ID --region $REGION\naws mgn finalize-cutover --source-server-id $SERVER_ID --region $REGION"
          }
        ],
        "note": "Finalizes cutover and stops replication servers.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Application Migration Service configuration verified in AWS Application Migration Service."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Terminate test launched EC2 instances and disconnect test replication servers."
      },
      {
        "id": "cleanup-2",
        "text": "Delete EC2 launch templates and security groups created solely for the lab."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "6 R's of Migration",
        "body": "Rehost (Lift-and-Shift), Replatform, Refactor, Repurchase, Retire, Retain."
      },
      {
        "id": "cs-2",
        "title": "AWS MGN vs DMS",
        "body": "MGN: Migrates physical/virtual host servers and OS block storage to EC2. DMS: Migrates databases."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Agent Connection Timeout",
        "body": "Verify outbound TCP port 443 (HTTPS) and TCP port 1500 (Replication) are open on host firewall."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "AWS SMS Deprecated",
        "body": "SMS is deprecated. On SAA-C03, choose AWS MGN for server rehosting."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Application Migration Service concepts and hybrid connectivity patterns in AWS Application Migration Service."
      }
    ],
    "memoryHook": "MGN = Machine Disks to EC2; DMS = Database Data to Cloud DBs",
    "flashcardSetId": null
  }
];
