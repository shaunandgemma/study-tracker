/** AWS DMS Tasks (SAA-C03) */
export const DMS_TASKS = [
  {
    "id": "task-saa-dms-database-migration-schema-conversion-with-aws-dms-sct-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dms",
    "title": "Database Migration & Schema Conversion with AWS DMS & SCT",
    "slug": "database-migration-schema-conversion-with-aws-dms-sct",
    "service": "AWS Database Migration Service",
    "feature": "AWS Database Migration Service",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Migrate an on-premises database (e.g. MySQL or PostgreSQL) to Amazon RDS/Aurora with minimal downtime using AWS DMS and SCT.",
    "status": "published",
    "tags": [
      "AWS Database Migration Service",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS DMS (Database Migration Service)",
        "body": "Migrates relational databases, NoSQL databases, and data warehouses to AWS with minimal application downtime."
      },
      {
        "id": "concept-2",
        "title": "AWS SCT (Schema Conversion Tool)",
        "body": "Converts source database schemas, views, and stored procedures to match heterogeneous target database engines (e.g., Oracle to Aurora PostgreSQL)."
      },
      {
        "id": "concept-3",
        "title": "Homogeneous vs Heterogeneous Migration",
        "body": "Homogeneous: Same source and target engine (e.g. MySQL to RDS MySQL). SCT not required. Heterogeneous: Different engines (e.g. Oracle to PostgreSQL). SCT converts schema first."
      },
      {
        "id": "concept-4",
        "title": "Full Load + CDC (Change Data Capture)",
        "body": "Full Load copies existing table records. CDC continuously captures ongoing transaction binlogs until cutover."
      },
      {
        "id": "concept-5",
        "title": "DMS Migration Setup Plan",
        "body": "ComponentLab valuePurposeReplication instancesaa-dms-instance (dms.t3.micro)Runs migration engineSource endpointsaa-source-db (MySQL 3306)Points to source databaseTarget endpointsaa-target-db (Amazon RDS MySQL 3306)Points to target RDS databaseMigration task typeFull load + CDCInitial load + ongoing changesFree Tier emulationEC2 Single-AZ MySQL + Single-AZ RDS MySQLZero cost under Free Tier"
      }
    ],
    "whyItMatters": "This matters because AWS DMS combined with SCT allows database migrations with virtually zero application downtime and is a major topic on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Replication Instance",
        "value": "saa-dms-instance (dms.t3.micro)"
      },
      {
        "label": "Source DB Engine",
        "value": "MySQL (Port 3306)"
      },
      {
        "label": "Target DB Engine",
        "value": "Amazon RDS MySQL (Port 3306)"
      },
      {
        "label": "Migration Task Type",
        "value": "Full Load + CDC"
      }
    ],
    "costWarning": "DMS replication resources, serverless capacity, logging, storage, database and data-transfer charges may apply.",
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
        "note": "Identity check: sts:GetCallerIdentity DMS setup: dms:CreateReplicationInstance, dms:CreateEndpoint, dms:CreateReplicationTask, dms:TestConnection RDS setup: rds:CreateDBInstance, rds:DescribeDBInstances Cleanup: dms:DeleteReplicationTask, dms:DeleteEndpoint, dms:DeleteReplicationInstance, rds:DeleteDBInstance",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Provision Source and Target Databases (Free Tier Emulation)",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon RDS -> Choose Create database."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Select MySQL engine -> Choose Free tier template."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Set DB instance identifier to saa-dms-target-db, master username to admin, and password."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Instance class to db.t3.micro (Free Tier eligible) and choose Create database."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Emulate the source database by running MySQL on a free t3.micro EC2 instance (or local container)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Ensure binary logging is enabled on source MySQL (binlog_format=ROW) to allow CDC transaction capture."
          }
        ],
        "note": "Binary logging (binlog) is required on source databases for DMS Change Data Capture (CDC).",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Convert schema using AWS Schema Conversion Tool (SCT)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "For Homogeneous migrations (e.g. MySQL to RDS MySQL): Use native mysqldump or pg_dump to export and import schema directly."
          },
          {
            "id": "console-step-3-item-2",
            "text": "For Heterogeneous migrations (e.g. Oracle / SQL Server to PostgreSQL / Aurora): Download and launch AWS SCT."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Create a new SCT project -> Connect to Source DB -> Connect to Target RDS DB."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Convert Schema -> Review Schema Transformation Report -> Choose Apply to database."
          }
        ],
        "note": "SCT converts DDL statements, indexes, views, and stored procedures across different engine dialects.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create AWS DMS Replication Instance",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Database Migration Service (DMS)."
          },
          {
            "id": "console-step-4-item-2",
            "text": "In the left sidebar, click Replication instances -> Choose Create replication instance."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Name to saa-dms-instance."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Set Replication instance class to dms.t3.micro (Free Tier eligible)."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Select your VPC and replication subnet group."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Keep Multi-AZ set to Single-AZ to avoid extra charges."
          },
          {
            "id": "console-step-4-item-7",
            "text": "Choose Create replication instance."
          }
        ],
        "note": "The replication instance runs the DMS engine that reads source logs and writes to the target.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create Source and Target DMS Endpoints",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open DMS -> Endpoints -> Choose Create endpoint."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Source Endpoint: Choose Source endpoint -> Set Identifier saa-source-endpoint -> Engine MySQL -> Input Source IP/DNS, Port 3306, username, and password -> Choose Test endpoint connection."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Target Endpoint: Choose Target endpoint -> Set Identifier saa-target-endpoint -> Check Select RDS DB instance -> Choose saa-dms-target-db -> Input password -> Choose Test endpoint connection."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Ensure both endpoint connections display successful."
          }
        ],
        "note": "Endpoints store connection parameters and credentials for DMS to communicate with databases.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Create and execute Full Load + CDC Replication Task",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open DMS -> Database migration tasks -> Choose Create task."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Set Task identifier to saa-dms-migration-task."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Select Replication instance saa-dms-instance, Source endpoint saa-source-endpoint, and Target endpoint saa-target-endpoint."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Under Migration type, select Migrate existing data and replicate ongoing changes (Full load + CDC)."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Under Table mappings, choose Wizard -> Add selection rule -> Schema % -> Table % -> Action Include."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Choose Create task."
          },
          {
            "id": "console-step-6-item-7",
            "text": "Monitor Task status transitioning: Starting → Full load complete → Replication ongoing."
          },
          {
            "id": "console-step-6-item-8",
            "text": "Perform cutover once CDC latency drops to 0 seconds."
          }
        ],
        "note": "Full load copies initial table contents; CDC streams live binlog transactions continuously.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down resources in dependency order",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Select saa-dms-migration-task -> Choose Actions -> Stop -> then Delete."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Select source and target endpoints -> Choose Delete."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Select saa-dms-instance -> Choose Delete."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Open RDS -> Select saa-dms-target-db -> Choose Actions -> Delete (uncheck final snapshot for lab cleanup)."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Terminate any source EC2 instance used for emulation."
          }
        ],
        "note": null,
        "warning": "Delete the DMS replication instance and RDS database when finished to prevent continuous hourly charges.",
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
            "text": "REGION=us-east-1\nREP_ID=saa-dms-instance\nSRC_EP=saa-source-endpoint\nTGT_EP=saa-target-endpoint\nTASK_ID=saa-dms-migration-task"
          }
        ],
        "note": "Defines CLI variable names for DMS resources.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create DMS Replication Instance",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dms create-replication-instance --replication-instance-identifier $REP_ID --replication-instance-class dms.t3.micro --allocated-storage 20 --region $REGION"
          }
        ],
        "note": "Provisions a Single-AZ dms.t3.micro replication instance.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create Source and Target Endpoints",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dms create-endpoint --endpoint-identifier $SRC_EP --endpoint-type source --engine-name mysql --username admin --password Password123! --server-name source-db-ip --port 3306 --region $REGION\naws dms create-endpoint --endpoint-identifier $TGT_EP --endpoint-type target --engine-name mysql --username admin --password Password123! --server-name target-rds-dns --port 3306 --region $REGION"
          }
        ],
        "note": "Creates source and target database endpoint configurations.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create Full Load + CDC Migration Task",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dms create-replication-task --replication-task-identifier $TASK_ID --source-endpoint-arn $SRC_ARN --target-endpoint-arn $TGT_ARN --replication-instance-arn $REP_ARN --migration-type full-load-and-cdc --table-mappings '{\"rules\":[{\"rule-type\":\"selection\",\"rule-id\":\"1\",\"rule-name\":\"1\",\"object-locator\":{\"schema-name\":\"%\",\"table-name\":\"%\"},\"rule-action\":\"include\"}]}' --region $REGION"
          }
        ],
        "note": "Configures a full load + CDC replication task.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Start Migration Task and Monitor Status",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dms start-replication-task --replication-task-arn $TASK_ARN --start-replication-task-type start-replication --region $REGION\naws dms describe-replication-tasks --filters Name=replication-task-id,Values=$TASK_ID --region $REGION"
          }
        ],
        "note": "Starts initial data load and continuous CDC streaming.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      },
      {
        "id": "cli-step-7",
        "number": 7,
        "title": "Tear down DMS resources in dependency order",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-7-cmd-1",
            "language": "bash",
            "text": "aws dms delete-replication-task --replication-task-arn $TASK_ARN --region $REGION\naws dms delete-endpoint --endpoint-arn $SRC_ARN --region $REGION\naws dms delete-endpoint --endpoint-arn $TGT_ARN --region $REGION\naws dms delete-replication-instance --replication-instance-arn $REP_ARN --region $REGION"
          }
        ],
        "note": "Deletes task, endpoints, and replication instance.",
        "warning": "Destructive Command Warning: This command permanently deletes migration tasks, endpoints, replication instances, VPN connections, or Direct Connect VIFs.",
        "expectedResult": "CLI command step 7 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Database Migration Service configuration verified in AWS Database Migration Service."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Stop and delete DMS replication tasks."
      },
      {
        "id": "cleanup-2",
        "text": "Delete DMS endpoints and replication instances."
      },
      {
        "id": "cleanup-3",
        "text": "Delete temporary test target databases and log groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS DMS (Database Migration)",
        "body": "Migrates databases (homogeneous or heterogeneous) with minimal downtime. Requires a Replication Instance, Source Endpoint, and Target Endpoint."
      },
      {
        "id": "cs-2",
        "title": "AWS SCT (Schema Conversion)",
        "body": "Converts source DB schema (tables, views, stored procedures) to target engine dialect during heterogeneous migrations."
      },
      {
        "id": "cs-3",
        "title": "Full Load vs CDC",
        "body": "Full Load: Copies existing data snapshot. CDC (Change Data Capture): Continuously streams ongoing binlog updates."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "CDC Replication Failing",
        "body": "Verify binary logging (`binlog_format=ROW`) is enabled on the source MySQL database and that the DMS IAM user has `REPLICATION CLIENT` privileges."
      },
      {
        "id": "ts-2",
        "title": "Endpoint Test Connection Failed",
        "body": "Check Security Group rules. Ensure the DMS Replication Instance security group allows outbound traffic to source and target DB ports (3306)."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "SCT vs DMS Usage",
        "body": "DMS does not convert schema definitions for heterogeneous migrations. You MUST use AWS SCT to convert schema before running DMS."
      },
      {
        "id": "trap-2",
        "title": "Homogeneous Migration Shortcuts",
        "body": "For homogeneous migrations (e.g. MySQL to RDS MySQL), SCT is NOT required. You can use native DB tools (e.g. `mysqldump`) or DMS alone."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Database Migration Service concepts and hybrid connectivity patterns in AWS Database Migration Service."
      }
    ],
    "memoryHook": "SCT converts the Schema; DMS moves the Data!",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dms-conceptual-guide-023",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dms",
    "title": "AWS Database Migration Service (DMS) Conceptual Guide",
    "slug": "aws-database-migration-service-dms-conceptual-guide",
    "service": "AWS Database Migration Service",
    "feature": "Amazon RDS",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "us-east-1",
    "goal": "Goal: Step-by-step walkthrough detailing DMS Replication Instances, Source/Target Endpoints, and CDC (Change Data Capture) configuration for minimal downtime migrations.",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "AWS DMS Replication Instance",
        "body": "Managed EC2 instance running AWS DMS migration software that connects to source/target endpoints, extracts data, and loads records."
      },
      {
        "id": "concept-2",
        "title": "DMS Endpoints",
        "body": "Connection definitions holding IP address, port, engine type, and credentials for source and target databases."
      },
      {
        "id": "concept-3",
        "title": "Full Load + CDC (Change Data Capture)",
        "body": "Full Load migrates existing table records. CDC continuously streams ongoing binary log changes until application cutover."
      },
      {
        "id": "concept-4",
        "title": "Homogeneous vs Heterogeneous",
        "body": "DMS natively migrates homogeneous databases (e.g. MySQL to RDS MySQL). Heterogeneous migrations (e.g. Oracle to Aurora) require AWS SCT for schema conversion."
      },
      {
        "id": "concept-5",
        "title": "DMS Migration Architecture Plan",
        "body": "DMS ComponentFunctionKey RequirementReplication InstanceExecutes data extraction & loadingNeeds network connectivity to source & targetSource EndpointReads source database records & binlogsRequires binlog/CDC privileges on source DBTarget EndpointWrites records to destination DBRequires target schema tables pre-createdMigration TaskDefines task type & table mapping rulesSelect Full Load + CDC for minimal downtime"
      }
    ],
    "whyItMatters": "This matters because continuous database replication with minimal application downtime is a major scenario topic on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Replication Instance",
        "value": "dms.t3.micro"
      },
      {
        "label": "Migration Type",
        "value": "Full Load + CDC"
      },
      {
        "label": "Replication Lag",
        "value": "0 seconds (at cutover)"
      },
      {
        "label": "Downtime Requirement",
        "value": "Near-zero downtime"
      }
    ],
    "costWarning": "DMS replication resources, serverless capacity, logging, storage, database and data-transfer charges may apply.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Review AWS DMS Administration Permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Ensure your identity has permissions for DMS replication instances and endpoints."
          }
        ],
        "note": "Read-only access is sufficient for evaluation.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Provision DMS Replication Instance and Endpoints",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Database Migration Service (DMS) Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Provision a DMS Replication Instance (e.g. dms.t3.micro)."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Configure Source Database Endpoint with source DB IP, port, and credentials."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Configure Target Database Endpoint pointing to Amazon RDS or Aurora."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose Test connection to verify network connectivity between endpoints."
          }
        ],
        "note": "Sets up the core DMS replication infrastructure.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Configure and Execute Full Load + CDC Migration Task",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Create a Migration Task selecting Full load + CDC (Change Data Capture)."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Configure Table Mapping selection rules (Schema %, Table %)."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Start task and monitor initial Full Load completion."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Monitor continuous CDC binary log replication until replication latency reaches 0 seconds."
          }
        ],
        "note": "Enables initial data snapshot followed by continuous change streaming.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Perform Zero-Downtime Application Cutover",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Redirect application traffic to target database."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Stop and delete the DMS task and replication instance."
          }
        ],
        "note": null,
        "warning": "Delete the replication instance after cutover to stop hourly charges.",
        "expectedResult": "Step 4 completed successfully."
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
        "title": "Describe DMS Replication Instances",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws dms describe-replication-instances --region us-east-1"
          }
        ],
        "note": "Lists DMS replication instances.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Stop and delete DMS replication tasks."
      },
      {
        "id": "cleanup-2",
        "text": "Delete DMS endpoints and replication instances."
      },
      {
        "id": "cleanup-3",
        "text": "Delete temporary test target databases and log groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "AWS DMS",
        "body": "Migrates databases to AWS with minimal downtime. Supports relational, NoSQL, and data warehouse targets."
      },
      {
        "id": "cs-2",
        "title": "Change Data Capture (CDC)",
        "body": "Continuously streams ongoing binlog modifications to target database during migration."
      },
      {
        "id": "cs-3",
        "title": "Homogeneous vs Heterogeneous",
        "body": "Homogeneous migrations use DMS alone. Heterogeneous migrations require AWS SCT for schema conversion first."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "CDC Replication Failing on Source",
        "body": "Ensure binary logging (`binlog_format=ROW`) is enabled on the source database and DMS user has replication privileges."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "DMS Schema Conversion Trap",
        "body": "AWS DMS does NOT convert database schemas between different engines. You MUST use AWS SCT to convert schema before running DMS."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "DMS = Data Migration Service | CDC = Continuous Change Capture | SCT = Schema Converter",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dms-homogeneous-vs-heterogeneous-migration-024",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dms",
    "title": "Homogeneous vs Heterogeneous Database Migration",
    "slug": "homogeneous-vs-heterogeneous-database-migration",
    "service": "AWS Database Migration Service",
    "feature": "Amazon RDS",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "us-east-1",
    "goal": "Goal: Operational workflow comparing same-engine migrations (DMS alone) vs. engine changes (Oracle/SQL Server to Postgres/Aurora requiring AWS Schema Conversion Tool).",
    "status": "published",
    "tags": [
      "Amazon RDS",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Homogeneous Migration",
        "body": "Source and target database engines are identical (e.g. MySQL to RDS MySQL, Oracle to RDS Oracle). Schemas match natively; AWS SCT is NOT required."
      },
      {
        "id": "concept-2",
        "title": "Heterogeneous Migration",
        "body": "Source and target database engines are different (e.g. Oracle to Aurora PostgreSQL, SQL Server to MySQL). Schemas and SQL dialects MUST be converted using AWS SCT."
      },
      {
        "id": "concept-3",
        "title": "AWS Schema Conversion Tool (SCT)",
        "body": "Converts source database schemas, views, indexes, stored procedures, and DDL statements into the target engine dialect automatically."
      },
      {
        "id": "concept-4",
        "title": "SCT Assessment Report",
        "body": "Generates a detailed report identifying code items that require manual conversion assistance (e.g., complex stored procedures or proprietary functions)."
      },
      {
        "id": "concept-5",
        "title": "Homogeneous vs Heterogeneous Decision Matrix",
        "body": "FeatureHomogeneous MigrationHeterogeneous MigrationEngine alignmentSame source and target (e.g. Postgres -> RDS Postgres)Different source and target (e.g. SQL Server -> Aurora)Schema tool needed?No (Schemas match natively)YES — AWS SCT RequiredData migration toolAWS DMS or native backup tools (`pg_dump`/`mysqldump`)AWS DMS (Data migration after SCT schema conversion)Stored procedure conversionAutomatic (Identical dialect)AWS SCT converts or flags for manual review"
      }
    ],
    "whyItMatters": "This matters because knowing exactly when AWS SCT is required alongside AWS DMS is a classic SAA-C03 exam scenario.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Homogeneous Tooling",
        "value": "AWS DMS alone or native DB dump tools"
      },
      {
        "label": "Heterogeneous Tooling",
        "value": "AWS SCT (Schema) + AWS DMS (Data)"
      },
      {
        "label": "Primary Selection Rule",
        "value": "Source vs Target database engine alignment"
      }
    ],
    "costWarning": "DMS replication resources, serverless capacity, logging, storage, database and data-transfer charges may apply.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Review AWS DMS and AWS SCT Administration Permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Ensure your identity has permissions to manage DMS resources."
          }
        ],
        "note": "Read-only access is sufficient for evaluation.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Evaluate Homogeneous Migration Path (DMS Alone)",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Select Homogeneous Migration when source and target database engines are identical (e.g. MySQL to RDS MySQL)."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use native database tools (`mysqldump`, `pg_dump`) or AWS DMS alone."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Note that AWS SCT is NOT required for homogeneous migrations."
          }
        ],
        "note": "Schemas match natively across identical engines.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Evaluate Heterogeneous Migration Path (AWS SCT + DMS)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select Heterogeneous Migration when source and target database engines differ (e.g. Oracle to Aurora PostgreSQL)."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Download and launch AWS Schema Conversion Tool (SCT)."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Connect SCT to Source DB and Target RDS DB."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Generate SCT Schema Transformation Assessment Report."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Convert DDL statements, tables, views, and stored procedures to target dialect."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Apply converted schema to target database."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Run AWS DMS to migrate data records into target schema."
          }
        ],
        "note": "SCT converts schema first; DMS migrates data records after.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Master SAA-C03 Migration Scenario Rules",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Verify your tool choice: SCT for schema conversion; DMS for data migration."
          }
        ],
        "note": "Guarantees correct exam scenario responses.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
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
        "title": "List Available DMS Endpoint Types",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws dms describe-endpoint-types --region us-east-1"
          }
        ],
        "note": "Lists supported DMS database engines.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon RDS configuration verified in Amazon RDS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Stop and delete DMS replication tasks."
      },
      {
        "id": "cleanup-2",
        "text": "Delete DMS endpoints and replication instances."
      },
      {
        "id": "cleanup-3",
        "text": "Delete temporary test target databases and log groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Homogeneous Migration",
        "body": "Same engine (e.g. MySQL to RDS MySQL). Schemas match. AWS SCT is NOT required; use DMS alone."
      },
      {
        "id": "cs-2",
        "title": "Heterogeneous Migration",
        "body": "Different engine (e.g. Oracle to Aurora Postgres). MUST use **AWS SCT** for schema conversion before running **AWS DMS** for data."
      },
      {
        "id": "cs-3",
        "title": "AWS SCT",
        "body": "Converts source schema DDL, views, indexes, and stored procedures to target database engine dialect."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Target Table Missing for DMS",
        "body": "DMS does not create complex schemas for heterogeneous migrations. Run AWS SCT first to create target tables before starting DMS."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "AWS SCT for Homogeneous Trap",
        "body": "If an exam question describes a homogeneous migration (e.g. PostgreSQL to RDS PostgreSQL), do NOT select AWS SCT. SCT is only for heterogeneous migrations."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon RDS concepts and multi-AZ / replication design in Amazon RDS."
      }
    ],
    "memoryHook": "Homogeneous = DMS Alone | Heterogeneous = SCT Schema + DMS Data",
    "flashcardSetId": null
  }
];
