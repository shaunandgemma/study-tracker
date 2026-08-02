/** Amazon Aurora Tasks (SAA-C03) */
export const AURORA_TASKS = [
  {
    "id": "task-saa-aurora-create-an-amazon-aurora-cluster-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-aurora",
    "title": "Create an Amazon Aurora Cluster",
    "slug": "create-an-amazon-aurora-cluster",
    "service": "Amazon Aurora",
    "feature": "Amazon Aurora",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Provision an Amazon Aurora relational database cluster featuring a shared storage architecture with a primary writer instance and a reader instance.",
    "status": "published",
    "tags": [
      "Amazon Aurora",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Shared Storage Architecture",
        "body": "Unlike traditional RDS, Aurora separates compute from storage. It maintains 6 copies of your data across 3 Availability Zones automatically, backed by a single shared cluster volume."
      },
      {
        "id": "concept-2",
        "title": "Cluster vs. Instance Endpoints",
        "body": "Aurora exposes a single Cluster Endpoint (Writer) for inserts/updates and a Reader Endpoint that load-balances read-only traffic automatically across all replicas."
      }
    ],
    "whyItMatters": "Aurora is AWS's flagship enterprise cloud-native database. Knowing how it delivers high performance, self-healing storage, and rapid failovers is a critical theme across modern AWS architectural design questions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Cluster Identifier",
        "value": "saa-db-task7-aurora-cluster"
      },
      {
        "label": "Database Engine",
        "value": "Amazon Aurora (MySQL Compatible)"
      },
      {
        "label": "IAM permissions needed",
        "value": "rds:CreateDBCluster, rds:CreateDBInstance, rds:DeleteDBCluster, rds:DeleteDBInstance, rds:DescribeDBClusters"
      }
    ],
    "costWarning": "Aurora cluster, database instance, storage, I/O, and backup charges apply. Complete cleanup promptly after testing.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with an administrator user or lab administrator role."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "In a real company, use least privilege permissions only."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Confirm the identity has the permissions listed in the chosen example values section."
          }
        ],
        "note": null,
        "warning": "Do not use your root user for normal labs. Use an IAM user, IAM role, or IAM Identity Center permission set.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Navigate to Amazon RDS",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "In the top search bar, look up RDS."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Select RDS from the services list to entry the console layout."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Select Amazon Aurora Engine Options",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Click the Create database action block."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose the Standard create configuration flow."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Under Engine options, choose Amazon Aurora."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Under Edition, select Amazon Aurora MySQL-Compatible Edition."
          },
          {
            "id": "console-step-3-item-5",
            "text": "In the templates interface, switch from Production to Dev/Test to reduce instance costs."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure Cluster Settings and Compute",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Set the DB cluster identifier name to saa-db-task7-aurora-cluster."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Under Credential settings, configure your master username and secure administrative password configuration."
          },
          {
            "id": "console-step-4-item-3",
            "text": "In the DB instance class menu, choose a small burstable instance class (e.g., db.t3.medium or db.t4g.medium)."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Under Availability & durability, ensure Create an Aurora Replica/Reader node is checked."
          }
        ],
        "note": "Aurora automatically structures this configuration as one core writer and a corresponding backup reader clone mapping.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Finalize Cluster Provisioning",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Leave remaining network, security, and storage specifications at default values."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Scroll down to the bottom and click Create database."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Wait a few minutes while both the cluster and the sub-instances transition from 'Creating' to 'Available'."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean Up Cluster Resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "You must delete reader instances before deleting the primary cluster volume layer."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select the Reader instance object row, click Actions, and pick Delete."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Next, select the remaining Writer instance, click Actions, and choose Delete."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Finally, select the parent DB Cluster row, click Actions, choose Delete, bypass final snapshot creation, and confirm the action."
          }
        ],
        "note": null,
        "warning": "Failing to delete database instances means ongoing operational hardware charges.",
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check the AWS CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and the IAM user or role being used for this lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and the IAM user or role being used for this lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create the Core Aurora DB Cluster",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-cluster --db-cluster-identifier saa-db-task7-aurora-cluster --engine aurora-mysql --engine-version 8.0.mysql_aurora.3.05.2 --master-username auroraadmin --master-user-password SuperSecurePass77 --region eu-west-2"
          }
        ],
        "note": "This command creates the logical cluster volume framework and shared layout across 3 AZs.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Add a Primary Compute Instance to Cluster",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-instance --db-instance-identifier saa-db-task7-instance-1 --db-cluster-identifier saa-db-task7-aurora-cluster --db-instance-class db.t3.medium --engine aurora-mysql --region eu-west-2"
          }
        ],
        "note": "The first compute instance added to an empty Aurora cluster automatically assumes the Writer role.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Verify Endpoint Configurations via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-clusters --db-cluster-identifier saa-db-task7-aurora-cluster --query \"DBClusters[*].[DBClusterIdentifier,Endpoint,ReaderEndpoint]\" --region eu-west-2"
          }
        ],
        "note": "Expected output: Returns the distinct Writer (Endpoint) and Reader connection strings.",
        "warning": null,
        "expectedResult": "Expected output: Returns the distinct Writer (Endpoint) and Reader connection strings."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean Up CLI Cluster Layout",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-instance --db-instance-identifier saa-db-task7-instance-1 --skip-final-snapshot --region eu-west-2 && aws rds delete-db-cluster --db-cluster-identifier saa-db-task7-aurora-cluster --skip-final-snapshot --region eu-west-2"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon Aurora configuration verified in Amazon Aurora."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Aurora Scaling Limits",
        "body": "An Aurora cluster can scale out up to 15 low-latency reader replicas to handle intense application read-query operations."
      },
      {
        "id": "cs-2",
        "title": "Storage Auto-Scaling",
        "body": "Aurora handles storage dynamically. It allocates blocks in 10 GB increments up to a total storage footprint boundary of 128 TiB without manual administrative manual overrides."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Engine Version Mismatches",
        "body": "Cause: Specifying an out-of-date or region-restricted version tag via the AWS CLI query execution format. Fix: Omit the explicit engine version attribute to automatically pull down the default stable image recommendation."
      },
      {
        "id": "ts-2",
        "title": "Subnet Group Configuration Requirements",
        "body": "Cause: Your default cluster network structure lack routes crossing multiple geographical boundaries. Fix: Ensure your target standard DB Subnet Group includes mapping IDs spanning at least two distinctive active regional Availability Zones."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "The Shared Storage Fallacy",
        "body": "The exam might trick you into thinking each Aurora read replica requires manual replication replication sync configuration or separate storage pricing provisioning. Remember: all instances within an Aurora cluster attach to the same shared, single virtual storage volume layer."
      },
      {
        "id": "trap-2",
        "title": "Endpoint Connection Swaps",
        "body": "Do not hardcode specific instance node strings into your applications. If a failover occurs, a reader promotes to a writer. Hardcoding instance endpoints breaks updates. Always connect using the master Cluster Endpoint for writes."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon Aurora concepts and multi-AZ / replication design in Amazon Aurora."
      }
    ],
    "memoryHook": "One Shared Storage Volume, Two Specialized Endpoints. Aurora uses one shared storage layer below, while giving you a Writer endpoint for changes and a Reader endpoint for queries above.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-aurora-configure-aurora-replicas-and-endpoints-008",
    "examCode": "aws-saa-c03",
    "topicId": "topic-aurora",
    "title": "Configure Aurora Replicas and Endpoints",
    "slug": "configure-aurora-replicas-and-endpoints",
    "service": "Amazon Aurora",
    "feature": "Amazon Aurora",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "eu-west-2",
    "goal": "Goal: Scale an existing Amazon Aurora database cluster by adding a secondary reader replica, and examine how application traffic splits using specialized writer and reader endpoints.",
    "status": "published",
    "tags": [
      "Amazon Aurora",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Cluster Endpoint (Writer)",
        "body": "A dynamic DNS entry that pointing directly to the primary DB instance. It handles all write traffic (INSERT, UPDATE, DELETE). If the primary instance fails, this endpoint updates instantly to point to the newly promoted master."
      },
      {
        "id": "concept-2",
        "title": "Reader Endpoint",
        "body": "A single DNS string that automatically load-balances incoming read requests (SELECT statements) across all available Aurora read replicas in the cluster."
      }
    ],
    "whyItMatters": "Separating read queries from write modifications ensures operational stability during sudden application traffic spikes. Configuring application pools to target distinct database endpoints is a baseline pattern for passing AWS architectural questions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Cluster Identifier",
        "value": "saa-db-task7-aurora-cluster"
      },
      {
        "label": "New Replica Name",
        "value": "saa-db-task8-replica-node"
      },
      {
        "label": "IAM permissions needed",
        "value": "rds:CreateDBInstance, rds:DescribeDBClusters, rds:DescribeDBInstances, rds:FailoverDBCluster, rds:DeleteDBInstance"
      }
    ],
    "costWarning": "Aurora cluster, database instance, storage, I/O, and backup charges apply. Complete cleanup promptly after testing.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with an administrator user or lab administrator role."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "In a real company, use least privilege permissions only."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Confirm the identity has the permissions listed in the chosen example values section."
          }
        ],
        "note": null,
        "warning": "Do not use your root user for normal labs. Use an IAM user, IAM role, or IAM Identity Center permission set.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Select Target Aurora Cluster",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Navigate to the RDS Dashboard and choose Databases from the navigation index."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Locate your running saa-db-task7-aurora-cluster item row."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Verify that the regional parent cluster is in an Available condition state."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add a New Aurora Reader Replica",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select the checkmark indicator button on the parent cluster row entry."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click the top Actions layout options drop-down menu and choose Add reader."
          },
          {
            "id": "console-step-3-item-3",
            "text": "In the DB instance identifier block field, provide the tag string: saa-db-task8-replica-node."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Match the DB instance class allocation choice with your existing cluster sizing parameters (e.g., db.t3.medium)."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Scroll to the bottom structure interface and hit the Add reader submission button."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Analyze Cluster Endpoint Mapping Strings",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Click directly into the parent row identifier named saa-db-task7-aurora-cluster to show detail views."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Under the Connectivity & security data section, map the row item values under the Endpoint column header."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Locate the string item marked as type Writer; this string receives application transactional writing operations."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Locate the string item marked as type Reader; this uniform address shares read requests across all secondary replicas."
          }
        ],
        "note": "Notice that separate single instances inside the cluster have individual endpoint values, but apps should use the shared Cluster and Reader endpoints instead.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Simulate a Cluster Failover",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select the primary database instance (marked with the Writer role type label)."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Click the upper Actions control button and trigger Failover."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Confirm the command action. Observe that the original Writer node moves to a 'Rebooting' state, while a reader replica converts automatically to fill the Writer position role."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean Up Allocated Database Compute Nodes",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select your newly created node instance saa-db-task8-replica-node."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Click Actions, click Delete, bypass final configuration snapshot flags, and submit confirmation."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Repeat the structural deletion workflow for any remaining node assets in the cluster view to avoid ongoing charges."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Check the AWS CLI identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see the AWS account ID and the IAM user or role being used for this lab.",
        "warning": null,
        "expectedResult": "Expected: you see the AWS account ID and the IAM user or role being used for this lab."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Provision an Aurora Replica Node via CLI",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-instance --db-instance-identifier saa-db-task8-replica-node --db-cluster-identifier saa-db-task7-aurora-cluster --db-instance-class db.t3.medium --engine aurora-mysql --region eu-west-2"
          }
        ],
        "note": "Because this instance points to an existing active cluster identifier parent, RDS builds it as an asynchronous read replica automatically.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Query Cluster Endpoint DNS Configuration Blocks",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-clusters --db-cluster-identifier saa-db-task7-aurora-cluster --query \"DBClusters[*].[Endpoint,ReaderEndpoint]\" --region eu-west-2"
          }
        ],
        "note": "Expected output: Returns an array mapping showing the master cluster entry point next to the balanced Reader string.",
        "warning": null,
        "expectedResult": "Expected output: Returns an array mapping showing the master cluster entry point next to the balanced Reader string."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Trigger an Aurora Cluster Failover Execution",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws rds failover-db-cluster --db-cluster-identifier saa-db-task7-aurora-cluster --region eu-west-2"
          }
        ],
        "note": "This forces an outage simulation. The cluster promotes one of the available low-latency reader replicas to the master writer tier.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Clean Up Secondary CLI Replica Assets",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws rds delete-db-instance --db-instance-identifier saa-db-task8-replica-node --skip-final-snapshot --region eu-west-2"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 5 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon Aurora configuration verified in Amazon Aurora."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Endpoint Abstract DNS Advantages",
        "body": "Using abstract cluster endpoint connections keeps your application free from hardcoded instance references. When a server goes down or rolls over, the virtual endpoint updates behind the scenes to keep your app running smoothly."
      },
      {
        "id": "cs-2",
        "title": "Reader Load Balancing Mechanics",
        "body": "The Reader Endpoint alternates connections across your entire fleet of replica nodes using a basic round-robin DNS pattern. For advanced or heavy connection management, use custom target proxy mechanisms."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Stale DNS Cache Errors",
        "body": "Cause: Local application runtime code or client setups cache the underlying IP addresses of endpoint records too tightly during a failover sequence. Fix: Adjust your database connection pool properties to use a low Time-To-Live (TTL) value of less than 30 seconds."
      },
      {
        "id": "ts-2",
        "title": "Replica Lag Violations",
        "body": "Cause: Extreme mass transaction bursts on the primary writer node outrun the underlying storage engine synchronization context speeds. Fix: Scale up compute specs to match node sizing options, or check your local thread pool saturation levels."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Hardcoding Node Endpoints",
        "body": "Watch out for scenario options that recommend connecting application servers to the individual backend compute node names (e.g., instance-1.xxxx.region.rds.amazonaws.com). If a failover occurs, that node will change roles or reboot, causing write operations to fail. Always connect using the top-level Cluster Endpoint for writes."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon Aurora concepts and multi-AZ / replication design in Amazon Aurora."
      }
    ],
    "memoryHook": "Writers take edits; Readers share queries. The Writer endpoint routes data modifications to the master node, while the Reader endpoint automatically distributes read queries across your replica fleet.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-aurora-compare-aurora-serverless-vs-provisioned-aurora-009",
    "examCode": "aws-saa-c03",
    "topicId": "topic-aurora",
    "title": "Compare Aurora Serverless vs provisioned Aurora",
    "slug": "compare-aurora-serverless-vs-provisioned-aurora",
    "service": "Amazon Aurora",
    "feature": "Amazon Aurora",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Compare Aurora Serverless v2 and provisioned Aurora so you know when each one is the better database choice.",
    "status": "published",
    "tags": [
      "Amazon Aurora",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Aurora cluster",
        "body": "An Aurora cluster has shared storage and one or more DB instances. The storage is separate from the compute."
      },
      {
        "id": "concept-2",
        "title": "Provisioned Aurora",
        "body": "Provisioned Aurora uses fixed DB instance classes, such as db.r6g.large. You choose the size before the database runs."
      },
      {
        "id": "concept-3",
        "title": "Aurora Serverless v2",
        "body": "Aurora Serverless v2 uses Aurora Capacity Units, also called ACUs. It scales database compute up and down inside the range you choose."
      },
      {
        "id": "concept-4",
        "title": "ACU",
        "body": "An ACU is a unit of Aurora Serverless capacity. Each ACU includes memory, CPU, and networking capacity."
      },
      {
        "id": "concept-5",
        "title": "IAM permissions needed",
        "body": "For this comparison lab, you need permission to view RDS and Aurora settings. For a personal lab account, an admin user is okay. In a company, use least privilege."
      }
    ],
    "whyItMatters": "AWS exams often ask you to choose between steady predictable database capacity and automatic scaling for changing database demand.",
    "values": [
      {
        "label": "AWS Region",
        "value": "eu-west-2"
      },
      {
        "label": "Engine family",
        "value": "Amazon Aurora MySQL-Compatible Edition"
      },
      {
        "label": "Comparison option 1",
        "value": "Aurora Serverless v2"
      },
      {
        "label": "Comparison option 2",
        "value": "Provisioned Aurora"
      },
      {
        "label": "Serverless example range",
        "value": "0.5 ACU minimum to 4 ACU maximum"
      },
      {
        "label": "Provisioned example size",
        "value": "db.r6g.large"
      },
      {
        "label": "IAM for personal lab",
        "value": "AdministratorAccess is acceptable in a personal sandbox"
      },
      {
        "label": "IAM for real company",
        "value": "Use least privilege RDS read and create permissions only if creation is required"
      }
    ],
    "costWarning": "Aurora cluster, database instance, storage, I/O, and backup charges apply. Complete cleanup promptly after testing.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Open Amazon RDS",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-1-item-2",
            "text": "In the search bar, type RDS."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Open Amazon RDS."
          },
          {
            "id": "console-step-1-item-4",
            "text": "Check the Region in the top-right corner."
          },
          {
            "id": "console-step-1-item-5",
            "text": "Use Europe (London) eu-west-2 for this lab."
          }
        ],
        "note": "This lab is a comparison task. Do not create a database unless you want to test it and accept the cost.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Start the Aurora create flow",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "In the left menu, choose Databases."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Create database."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Standard create."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Under Engine options, choose Amazon Aurora."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Choose an Aurora edition, such as Aurora MySQL-Compatible Edition."
          }
        ],
        "note": null,
        "warning": "Do not choose Create database at the end. You are only reviewing the options.",
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Review the provisioned option",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Find the capacity or instance configuration section."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose a provisioned DB instance option if shown."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Notice that provisioned Aurora asks you to pick a DB instance class."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Example: db.r6g.large."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Remember: provisioned Aurora is best when load is steady and predictable."
          }
        ],
        "note": "Provisioned Aurora gives you fixed compute until you resize or add replicas.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review the Aurora Serverless v2 option",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Find the option for Aurora Serverless v2 or serverless capacity."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Notice that it asks for a minimum and maximum capacity range."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Use this example range only for learning: 0.5 ACU minimum and 4 ACU maximum."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Remember: Aurora Serverless v2 is best when load changes and you want automatic capacity scaling."
          }
        ],
        "note": "Aurora Serverless v2 scales within your chosen range. It does not mean the database has no limits.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Compare the exam decision",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Choose provisioned Aurora for steady, known, always-on workloads."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Aurora Serverless v2 for changing, spiky, or hard-to-predict workloads."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose provisioned Aurora with replicas when the question focuses on read scaling with predictable traffic."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Choose Aurora Serverless v2 when the question says capacity should adjust automatically."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Cancel the create flow",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Do not create the database."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Choose Cancel."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Confirm that no new Aurora cluster was created."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Return to the Databases page."
          }
        ],
        "note": "This keeps the lab free.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "If you only reviewed the settings, there is nothing to delete."
          },
          {
            "id": "console-step-7-item-2",
            "text": "If you created a test cluster by mistake, select the cluster."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete DB instances first if the console asks."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Delete the Aurora cluster."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Delete final snapshots only if you do not need them."
          },
          {
            "id": "console-step-7-item-6",
            "text": "Check the Databases page until the test resources are gone."
          }
        ],
        "note": null,
        "warning": "Do not delete real company databases.",
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
        "note": "Expected: your AWS account ID and ARN are shown.",
        "warning": null,
        "expectedResult": "Expected: your AWS account ID and ARN are shown."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Check the configured Region",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws configure get region"
          }
        ],
        "note": "Expected: eu-west-2, or the Region you use for your labs.",
        "warning": null,
        "expectedResult": "Expected: eu-west-2, or the Region you use for your labs."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "List existing Aurora clusters",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-clusters --query \"DBClusters[?Engine=='aurora-mysql' || Engine=='aurora-postgresql'].[DBClusterIdentifier,Engine,Status]\" --output table"
          }
        ],
        "note": "Expected: a table of Aurora clusters, or an empty result if you have none.",
        "warning": null,
        "expectedResult": "Expected: a table of Aurora clusters, or an empty result if you have none."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "List DB instance classes in existing clusters",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-instances --query \"DBInstances[?Engine=='aurora-mysql' || Engine=='aurora-postgresql'].[DBInstanceIdentifier,DBInstanceClass,Engine,DBInstanceStatus]\" --output table"
          }
        ],
        "note": "Provisioned instances show normal DB classes like db.r6g.large. Serverless v2 instances use db.serverless.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "View the CLI shape for Aurora Serverless v2",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws rds create-db-cluster help"
          }
        ],
        "note": "Look for ServerlessV2ScalingConfiguration. This is where minimum and maximum ACUs are set.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Compare the create settings without running them",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "echo \"Provisioned Aurora: choose a fixed DB instance class, for example db.r6g.large\""
          },
          {
            "id": "cli-step-6-cmd-2",
            "language": "bash",
            "text": "echo \"Aurora Serverless v2: choose db.serverless and a min/max ACU range\""
          }
        ],
        "note": "This step prints the comparison only. It does not create anything.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon Aurora configuration verified in Amazon Aurora."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Provisioned Aurora",
        "body": "Provisioned Aurora uses fixed DB instance classes. Pick it for steady and predictable workloads."
      },
      {
        "id": "cs-2",
        "title": "Aurora Serverless v2",
        "body": "Aurora Serverless v2 uses ACUs. Pick it when database demand changes."
      },
      {
        "id": "cs-3",
        "title": "Scaling difference",
        "body": "Provisioned Aurora scales when you resize or add replicas. Aurora Serverless v2 scales capacity automatically within your range."
      },
      {
        "id": "cs-4",
        "title": "Cost idea",
        "body": "Provisioned Aurora is easier to predict. Serverless v2 can help avoid over-provisioning for uneven traffic."
      },
      {
        "id": "cs-5",
        "title": "Exam wording",
        "body": "If the question says unpredictable, variable, or spiky traffic, think Aurora Serverless v2."
      },
      {
        "id": "cs-6",
        "title": "Not the same as Lambda",
        "body": "Serverless Aurora still runs a relational database. It is not a stateless compute service."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "You cannot see Aurora options",
        "body": "Check that you are in Amazon RDS and using Standard create. Some options change by engine version and Region."
      },
      {
        "id": "ts-2",
        "title": "CLI AccessDenied",
        "body": "Your IAM user or role does not have RDS permissions. Use a lab admin role or add least-privilege RDS permissions."
      },
      {
        "id": "ts-3",
        "title": "Region looks wrong",
        "body": "Run aws configure get region. Use --region eu-west-2 if needed."
      },
      {
        "id": "ts-4",
        "title": "A test database was created",
        "body": "Delete the test DB instances and cluster from the RDS console. Do not leave Aurora running after practice."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Serverless does not mean unlimited",
        "body": "Aurora Serverless v2 scales only between the minimum and maximum capacity values you set."
      },
      {
        "id": "trap-2",
        "title": "Provisioned can still scale reads",
        "body": "Provisioned Aurora can use Aurora Replicas for read scaling. Do not confuse this with Serverless v2 compute scaling."
      },
      {
        "id": "trap-3",
        "title": "Wrong choice for steady load",
        "body": "For steady and predictable workloads, provisioned Aurora can be the better and simpler answer."
      },
      {
        "id": "trap-4",
        "title": "Wrong choice for spiky load",
        "body": "For changing or unpredictable workloads, Aurora Serverless v2 is usually the better exam answer."
      },
      {
        "id": "trap-5",
        "title": "Storage is still Aurora storage",
        "body": "Both options use Aurora shared cluster storage. The main comparison is compute capacity."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon Aurora concepts and multi-AZ / replication design in Amazon Aurora."
      }
    ],
    "memoryHook": "Steady = provisioned. Spiky = serverless. Provisioned is fixed size. Serverless v2 changes capacity inside your chosen range.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-aurora-compare-rds-vs-aurora-vs-dynamodb-018",
    "examCode": "aws-saa-c03",
    "topicId": "topic-aurora",
    "title": "Compare RDS vs Aurora vs DynamoDB",
    "slug": "compare-rds-vs-aurora-vs-dynamodb",
    "service": "Amazon Aurora",
    "feature": "Amazon Aurora",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "us-east-1",
    "goal": "Goal: Architectural matrix evaluation guide comparing relational SQL engines (RDS/Aurora) against key-value NoSQL (DynamoDB).",
    "status": "published",
    "tags": [
      "Amazon Aurora",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon RDS Overview",
        "body": "Managed relational database service supporting MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server with Multi-AZ failover and Read Replicas."
      },
      {
        "id": "concept-2",
        "title": "Amazon Aurora Overview",
        "body": "Cloud-native relational database (MySQL & PostgreSQL compatible) with 6-way 3-AZ storage replication, up to 15 Read Replicas, and sub-second failover."
      },
      {
        "id": "concept-3",
        "title": "Amazon DynamoDB Overview",
        "body": "Fully managed, serverless, key-value NoSQL database delivering single-digit millisecond latency at any scale with automatic horizontal partitioning."
      },
      {
        "id": "concept-4",
        "title": "SQL vs NoSQL Architectural Choice",
        "body": "Relational SQL (RDS/Aurora): Complex table JOINs, ACID transactions, structured schema. NoSQL (DynamoDB): Simple key-value lookups, high-throughput writes, schema flexibility."
      },
      {
        "id": "concept-5",
        "title": "RDS vs Aurora vs DynamoDB Comparison Matrix",
        "body": "FeatureAmazon RDSAmazon AuroraAmazon DynamoDBData modelRelational SQL (Tables & Schema)Relational SQL (MySQL / Postgres)Key-Value & Document NoSQLStorage architectureEBS Volume (Single instance or Multi-AZ)Auto-scaling 6-way 3-AZ shared storageFully managed SSD horizontal partitionsScaling modelVertical instance scaling + Read ReplicasVertical scaling + Auto-scale storage to 128TBAutomatic horizontal partition scalingHigh availabilityMulti-AZ synchronous standby (Failover: ~60s)Multi-AZ 6 copies (Failover: Multi-AZ automatic built-in (99.999% SLA)Multi-Region modelCross-Region Read ReplicasAurora Global Database (Active-Passive)DynamoDB Global Tables (Active-Active)Read latencyMillisecondsSub-millisecond / MillisecondsSingle-digit milliseconds ("
      }
    ],
    "whyItMatters": "This matters because choosing database engines based on query complexity (ACID / complex joins vs. single-digit millisecond latency at scale) is heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Amazon RDS",
        "value": "Managed SQL (MySQL, Postgres, Oracle, SQL Server)"
      },
      {
        "label": "Amazon Aurora",
        "value": "Cloud-Native SQL (5x MySQL / 3x Postgres performance)"
      },
      {
        "label": "Amazon DynamoDB",
        "value": "Serverless NoSQL (Key-Value & Document)"
      },
      {
        "label": "Primary Selection Rule",
        "value": "Query complexity & latency requirements"
      }
    ],
    "costWarning": "Aurora cluster, database instance, storage, I/O, and backup charges apply. Complete cleanup promptly after testing.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Review IAM Database Administration Permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Ensure your identity has permissions to describe RDS DB instances (rds:DescribeDBInstances) and DynamoDB tables (dynamodb:DescribeTable)."
          }
        ],
        "note": "Read-only access is sufficient for evaluating database engine parameters.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Evaluate Data Model and Schema Flexibility",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Use Amazon RDS or Aurora when your application requires complex SQL queries, multi-table `JOIN` operations, or strict relational ACID compliance."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use Amazon DynamoDB when your application requires flexible JSON schemas, simple key-value lookups, or document storage without relational constraints."
          }
        ],
        "note": "DynamoDB does not support native multi-table SQL JOIN operations.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Evaluate Scaling and Latency Requirements",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Use DynamoDB when read/write latency MUST remain under 10 milliseconds regardless of data volume or traffic growth."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Use Aurora when you need maximum relational SQL throughput (up to 15 Read Replicas with sub-10ms replication lag)."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Use RDS for standard corporate relational database engines requiring moderate scaling."
          }
        ],
        "note": "DynamoDB scales horizontally automatically across SSD partitions.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Evaluate Multi-Region Availability Strategy",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Choose DynamoDB Global Tables for multi-Region Active-Active read/write capabilities."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Choose Aurora Global Database for multi-Region Active-Passive relational disaster recovery (< 1 second cross-region replication lag)."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose RDS Cross-Region Replicas for standard asynchronous relational backup read replicas."
          }
        ],
        "note": "Global Tables provide active multi-Region writing; Aurora Global Database provides single-writer multi-region reads.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Evaluate High Availability and Storage Architecture",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Review Aurora 6-way replication: Aurora replicates data 6 ways across 3 Availability Zones, tolerating loss of 2 copies without affecting write availability."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Review RDS Multi-AZ: Synchronous physical EBS block replication to a standby instance in a second Availability Zone."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Review DynamoDB Multi-AZ: Built-in multi-AZ synchronous storage replication."
          }
        ],
        "note": "Aurora's storage engine is decoupled from compute nodes.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Review SAA-C03 Database Decision Matrix",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Identify the primary question constraints: SQL vs NoSQL, Latency, Throughput, and Scaling mode."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Verify your engine selection matches all exam criteria."
          }
        ],
        "note": "Matching workload constraints to database capabilities is key for SAA-C03.",
        "warning": null,
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
        "title": "Describe RDS Engine Options",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws rds describe-db-engine-versions --engine mysql --query \"DBEngineVersions[0].Engine\""
          }
        ],
        "note": "Displays RDS MySQL engine details.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Describe DynamoDB Service Endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb list-tables --region us-east-1"
          }
        ],
        "note": "Lists active DynamoDB tables.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon Aurora configuration verified in Amazon Aurora."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any read replicas or RDS Proxy instances created during the lab."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DB instance or cluster (choosing not to retain final snapshot for test labs)."
      },
      {
        "id": "cleanup-3",
        "text": "Delete custom parameter groups, subnet groups, and security groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Amazon RDS",
        "body": "Managed relational database (MySQL, Postgres, Oracle, SQL Server). Supports Multi-AZ and Read Replicas."
      },
      {
        "id": "cs-2",
        "title": "Amazon Aurora",
        "body": "Cloud-native MySQL/Postgres. 5x performance of RDS MySQL. 6-way 3-AZ storage, up to 15 Read Replicas, sub-second failover."
      },
      {
        "id": "cs-3",
        "title": "Amazon DynamoDB",
        "body": "Fully managed NoSQL key-value database. Single-digit millisecond latency at any scale. Active-Active Global Tables."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Wrong Database Selection on Exam",
        "body": "If a scenario mentions `SQL JOINs` or `ACID transactions across multiple tables`, do NOT select DynamoDB. Choose **Amazon RDS** or **Amazon Aurora**."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "SQL JOINs in DynamoDB Trap",
        "body": "DynamoDB does NOT support complex SQL JOINs or multi-table relational foreign keys. Always choose RDS/Aurora for complex relational queries."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon Aurora concepts and multi-AZ / replication design in Amazon Aurora."
      }
    ],
    "memoryHook": "RDS = Standard SQL | Aurora = Supercharged Cloud SQL | DynamoDB = Fast NoSQL",
    "flashcardSetId": null
  }
];
