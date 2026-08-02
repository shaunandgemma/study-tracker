/** AWS DataSync Tasks (SAA-C03) */
export const DATASYNC_TASKS = [
  {
    "id": "task-saa-datasync-automated-online-file-migration-with-aws-datasync-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-datasync",
    "title": "Automated Online File Migration with AWS DataSync",
    "slug": "automated-online-file-migration-with-aws-datasync",
    "service": "AWS DataSync",
    "feature": "AWS DataSync",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Automate rapid online file transfer and ongoing synchronization between on-premises NFS/SMB shares and AWS storage (S3, EFS, FSx) using AWS DataSync.",
    "status": "published",
    "tags": [
      "AWS DataSync",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS DataSync Overview",
        "body": "An online data transfer service that automates and accelerates moving data between on-premises storage (NFS, SMB, HDFS) and AWS storage (S3, EFS, FSx) over the network."
      },
      {
        "id": "concept-2",
        "title": "DataSync Agent Appliance",
        "body": "A virtual machine deployed on-premises (VMware, KVM, Hyper-V, or EC2) that reads local files, compresses/encrypts data, and streams it to AWS at up to 10 Gbps."
      },
      {
        "id": "concept-3",
        "title": "DataSync vs DMS vs MGN",
        "body": "AWS DataSync: Online file/object storage migration (NFS, SMB, EFS, S3). AWS DMS: Database row-level schema & table replication. AWS MGN: Block-level host OS disk server rehosting."
      },
      {
        "id": "concept-4",
        "title": "Data Integrity & Verification",
        "body": "DataSync automatically calculates TLS checksums during transit and compares source vs destination file metadata to verify 100% data integrity."
      },
      {
        "id": "concept-5",
        "title": "AWS Migration Services Decision Matrix",
        "body": "Migration ServiceLayer / ProtocolPrimary SourcePrimary TargetKey FeatureAWS DataSyncFile & Object (NFS/SMB)On-prem NFS/SMB/S3Amazon S3, EFS, FSxFast online network sync up to 10 GbpsAWS MGNBlock Storage (OS Disks)Physical / Virtual ServersAmazon EC2 InstancesBlock-level host rehosting (Lift & Shift)AWS DMSDatabase Rows & TablesRelational / NoSQL DBsAmazon RDS, Aurora, DynamoDBRow-level DB migration + CDC replicationAWS Snowball EdgeOffline Bulk StorageOn-prem Datacenter (10TB+)Amazon S3 BucketsOffline physical appliance shipping"
      }
    ],
    "whyItMatters": "This matters because SAA-C03 exam questions frequently test choosing the exact right migration tool: DataSync for online file transfers, DMS for databases, and MGN for server rehosting.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Source Location",
        "value": "saa-datasync-source-[account-id] (S3 / NFS)"
      },
      {
        "label": "Target Location",
        "value": "saa-datasync-target-[account-id] (S3 / EFS)"
      },
      {
        "label": "Throttling Limit",
        "value": "10 MB/s (BytesPerSecond)"
      },
      {
        "label": "Verification Mode",
        "value": "POINT_IN_TIME_CONSISTENT"
      }
    ],
    "costWarning": "DataSync transfer, task, storage, network and connected-service charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity DataSync permissions: datasync:CreateLocationS3, datasync:CreateTask, datasync:StartTaskExecution, datasync:DescribeTask S3 permissions: s3:CreateBucket, s3:PutObject, s3:GetObject Cleanup: datasync:DeleteTask, datasync:DeleteLocation, s3:DeleteBucket",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Source and Target Amazon S3 Buckets",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon S3 -> Choose Create bucket."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create Source bucket: saa-datasync-source-[account-id] in us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Create Target bucket: saa-datasync-target-[account-id] in us-east-1."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Upload a sample file datasync-sample.txt into the Source bucket."
          }
        ],
        "note": "Using two S3 buckets allows simulating full DataSync online transfer tasks at $0 cost.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create DataSync Source Location",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open AWS DataSync Console -> Choose Locations -> Click Create location."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select Location type Amazon S3."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select Region us-east-1."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select S3 bucket saa-datasync-source-[account-id]."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Autogenerate IAM role (grants DataSync permission to read source objects)."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Choose Create location."
          }
        ],
        "note": "DataSync locations store connection configurations for on-prem NFS/SMB shares or AWS S3/EFS/FSx.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create DataSync Target Location",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In DataSync Locations, choose Create location."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select Location type Amazon S3."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select Region us-east-1."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select S3 bucket saa-datasync-target-[account-id]."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Choose Autogenerate IAM role (grants DataSync permission to write target objects)."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose Create location."
          }
        ],
        "note": "Target location points to the destination S3 bucket, EFS file system, or FSx share.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create DataSync Transfer Task with Bandwidth & Schedule Settings",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open DataSync -> Choose Tasks -> Click Create task."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select existing Source location saa-datasync-source-[account-id]."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select existing Target location saa-datasync-target-[account-id]."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Set Task name to saa-datasync-sync-task."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Under Task configuration, set Bandwidth limit to 10 MB/s (throttling control)."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Under Data verification, keep Verify only the data transferred selected."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Under Schedule, select Every day (or keep manual execution)."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Choose Create task."
          }
        ],
        "note": "Bandwidth limits prevent DataSync from consuming all available WAN upload capacity.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Execute DataSync Task and Verify Data Integrity",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select task saa-datasync-sync-task -> Click Start -> Choose Start with default settings."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Monitor Task execution status transitioning: Preparing → Transferring → Verifying → Success."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Open Amazon S3 Console -> Open target bucket saa-datasync-target-[account-id]."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Confirm datasync-sample.txt appears with matching metadata and checksums."
          }
        ],
        "note": "DataSync verifies object checksums in transit to guarantee 100% data integrity.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down lab resources in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Select DataSync task saa-datasync-sync-task -> Choose Actions -> Delete."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Select source and target DataSync locations -> Choose Actions -> Delete."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete test objects and delete both S3 buckets saa-datasync-source-[account-id] and saa-datasync-target-[account-id]."
          }
        ],
        "note": null,
        "warning": "Delete DataSync tasks and test S3 buckets when finished to prevent unnecessary storage charges.",
        "expectedResult": "Step 7 completed successfully."
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
            "text": "REGION=us-east-1\nACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)\nSRC_BUCKET=saa-datasync-source-$ACCOUNT_ID\nTGT_BUCKET=saa-datasync-target-$ACCOUNT_ID"
          }
        ],
        "note": "Sets CLI variable names for buckets and Region.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Source and Target S3 Buckets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket $SRC_BUCKET --region $REGION\naws s3api create-bucket --bucket $TGT_BUCKET --region $REGION"
          }
        ],
        "note": "Creates S3 source and target buckets.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create Source DataSync S3 Location",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws datasync create-location-s3 --s3-bucket-arn arn:aws:s3:::$SRC_BUCKET --s3-config '{\"BucketAccessRoleArn\":\"$ROLE_ARN\"}' --region $REGION"
          }
        ],
        "note": "Creates DataSync source location configuration.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create DataSync Task with Throttling and Verification",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws datasync create-task --source-location-arn $SRC_LOC_ARN --destination-location-arn $TGT_LOC_ARN --name saa-datasync-sync-task --options '{\"BytesPerSecond\":10485760,\"VerifyMode\":\"POINT_IN_TIME_CONSISTENT\"}' --region $REGION"
          }
        ],
        "note": "Creates DataSync task with 10 MB/s bandwidth limit and verification.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Start Task Execution and Monitor Progress",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws datasync start-task-execution --task-arn $TASK_ARN --region $REGION\naws datasync describe-task-execution --task-execution-arn $EXEC_ARN --region $REGION"
          }
        ],
        "note": "Executes online data replication and reports status.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down DataSync resources in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws datasync delete-task --task-arn $TASK_ARN --region $REGION\naws datasync delete-location --location-arn $SRC_LOC_ARN --region $REGION\naws s3 rb s3://$SRC_BUCKET --force\naws s3 rb s3://$TGT_BUCKET --force"
          }
        ],
        "note": "Deletes task, location, and S3 buckets.",
        "warning": "Destructive Command Warning: This command permanently deletes migration tasks, endpoints, replication instances, VPN connections, or Direct Connect VIFs.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS DataSync configuration verified in AWS DataSync."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Cancel active DataSync task executions and delete the task."
      },
      {
        "id": "cleanup-2",
        "text": "Delete source and destination location configurations and IAM roles."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS DataSync Overview",
        "body": "Accelerated online network file transfer service for NFS, SMB, HDFS to Amazon S3, EFS, and FSx up to 10 Gbps."
      },
      {
        "id": "cs-2",
        "title": "DataSync vs Storage Gateway",
        "body": "DataSync: Data migration and periodic batch sync tool. Storage Gateway: Continuous hybrid cloud storage bridge with local read/write caching."
      },
      {
        "id": "cs-3",
        "title": "DataSync vs Snowball",
        "body": "DataSync: Online network transfer over WAN. Snowball Edge: Offline physical appliance shipping when network bandwidth is too slow for 10+ TB."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "DataSync Agent Offline",
        "body": "Ensure outbound TCP port 443 (HTTPS) to AWS DataSync service endpoints is open on on-premises firewall."
      },
      {
        "id": "ts-2",
        "title": "Task Execution Failed: Access Denied",
        "body": "Check the DataSync S3 location IAM role permissions to ensure it grants `s3:Get*`, `s3:List*`, and `s3:Put*` access."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "DataSync vs DMS Usage",
        "body": "Do NOT select DataSync for database migrations. DataSync is for file systems (NFS/SMB/EFS/S3). Select AWS DMS for database tables."
      },
      {
        "id": "trap-2",
        "title": "DataSync vs MGN Usage",
        "body": "Do NOT select DataSync to migrate host OS boot volumes or rehost EC2 instances. Select AWS MGN for server rehosting."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS DataSync concepts and hybrid connectivity patterns in AWS DataSync."
      }
    ],
    "memoryHook": "DataSync = File & Object Sync | DMS = Database Sync | MGN = Server Disk Sync",
    "flashcardSetId": null
  }
];
