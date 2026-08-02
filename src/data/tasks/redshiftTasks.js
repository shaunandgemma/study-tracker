/** Amazon Redshift Tasks (SAA-C03) */
export const REDSHIFT_TASKS = [
  {
    "id": "task-saa-redshift-create-an-amazon-redshift-workgroup-021",
    "examCode": "aws-saa-c03",
    "topicId": "topic-redshift",
    "title": "Create an Amazon Redshift Workgroup",
    "slug": "create-an-amazon-redshift-workgroup",
    "service": "Amazon Redshift",
    "feature": "Amazon Redshift",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Provision an Amazon Redshift Serverless workgroup, load sample data, run analytical OLAP query scripts, and review columnar storage behavior.",
    "status": "published",
    "tags": [
      "Amazon Redshift",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon Redshift Overview",
        "body": "Fully managed, petabyte-scale OLAP data warehouse service using columnar storage and Massively Parallel Processing (MPP) for high-performance complex SQL analytics."
      },
      {
        "id": "concept-2",
        "title": "OLAP vs OLTP",
        "body": "OLAP (Redshift): Complex analytical queries, large table scans, `SUM`/`AVG`/`COUNT` aggregations over millions of rows. OLTP (RDS/Aurora): Row-by-row transactional writes, fast single-record lookups, high transaction throughput."
      },
      {
        "id": "concept-3",
        "title": "Columnar Storage Architecture",
        "body": "Stores data sequentially in columns rather than rows, dramatically reducing I/O required for analytical queries evaluating specific attributes."
      },
      {
        "id": "concept-4",
        "title": "Redshift Serverless Workgroups & RPUs",
        "body": "Automatically provisions and scales compute capacity in Redshift Processing Units (RPUs) without cluster management."
      },
      {
        "id": "concept-5",
        "title": "OLAP (Redshift) vs OLTP (RDS) Decision Matrix",
        "body": "FeatureOLAP Data Warehouse (Amazon Redshift)OLTP Transactional DB (Amazon RDS / Aurora)Primary workloadBusiness Intelligence, analytics, complex SQL reportingE-commerce checkout, financial transactions, user accountsData layoutColumnar storage (Optimized for column scans & compression)Row-oriented storage (Optimized for full row CRUD)Query typeComplex aggregations (`GROUP BY`, `SUM`, `AVG`) on petabytesFast single-row `INSERT`, `UPDATE`, `SELECT` operationsData loadingBulk parallel load via `COPY` command from S3Row-by-row transactional SQL insertsScaling unitMPP Compute Nodes / Redshift Processing Units (RPUs)Multi-AZ Read Replicas & Instance scaling"
      }
    ],
    "whyItMatters": "This matters because OLAP data warehousing for complex SQL queries across petabytes of historical data vs. OLTP transactional databases is a core SAA-C03 topic.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Workgroup Name",
        "value": "saa-redshift-workgroup"
      },
      {
        "label": "Namespace Name",
        "value": "saa-redshift-namespace"
      },
      {
        "label": "Base Capacity",
        "value": "8 RPU (Redshift Processing Units)"
      },
      {
        "label": "Storage Engine",
        "value": "Columnar MPP Storage"
      }
    ],
    "costWarning": "Redshift compute, storage, data scanning, and related cluster charges apply. Delete clusters or workgroups promptly.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate database permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Redshift permissions: redshift-serverless:CreateWorkgroup, redshift-serverless:CreateNamespace, redshift-data:ExecuteStatement Cleanup: redshift-serverless:DeleteWorkgroup, redshift-serverless:DeleteNamespace",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Provision an Amazon Redshift Serverless Workgroup",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon Redshift Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Click Redshift Serverless in the left navigation sidebar."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Click Create workgroup."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Workgroup name to saa-redshift-workgroup."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Set Namespace name to saa-redshift-namespace."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Under Base RPU capacity, select 8 RPU."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Choose Create."
          },
          {
            "id": "console-step-2-item-9",
            "text": "Wait for Workgroup status to transition to Available."
          }
        ],
        "note": "Provisions serverless data warehouse compute capacity (RPUs).",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Execute Analytical OLAP Queries in Query Editor v2",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Click Query data to open Redshift Query Editor v2."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Connect to saa-redshift-namespace."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Run sample OLAP query: SELECT category, COUNT(*), AVG(price) FROM sample_data GROUP BY category;."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Review columnar storage execution metrics demonstrating fast column scan performance."
          }
        ],
        "note": "Columnar storage scans only the columns required for the query.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Tear down Redshift resources",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select workgroup saa-redshift-workgroup -> Choose Actions -> Delete."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select namespace saa-redshift-namespace -> Choose Actions -> Delete."
          }
        ],
        "note": null,
        "warning": "Delete Redshift workgroup and namespace to clean up serverless resources.",
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
        "title": "Set variables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "REGION=us-east-1\nWORKGROUP=saa-redshift-workgroup\nNAMESPACE=saa-redshift-namespace"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Redshift Serverless Namespace and Workgroup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws redshift-serverless create-namespace --namespace-name $NAMESPACE --region $REGION\naws redshift-serverless create-workgroup --workgroup-name $WORKGROUP --namespace-name $NAMESPACE --base-capacity 8 --region $REGION"
          }
        ],
        "note": "Creates serverless namespace and 8 RPU workgroup.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Delete Redshift Workgroup and Namespace",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws redshift-serverless delete-workgroup --workgroup-name $WORKGROUP --region $REGION\naws redshift-serverless delete-namespace --namespace-name $NAMESPACE --region $REGION"
          }
        ],
        "note": "Deletes workgroup and namespace.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon Redshift configuration verified in Amazon Redshift."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the Redshift workgroup or cluster."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Redshift namespace, IAM role, and test S3 data."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Amazon Redshift (OLAP)",
        "body": "Petabyte-scale data warehouse using columnar storage and MPP for complex SQL analytics over massive historical datasets."
      },
      {
        "id": "cs-2",
        "title": "COPY Command from S3",
        "body": "Redshift's primary fast bulk data ingestion mechanism. Loads data directly in parallel from Amazon S3 into columnar storage."
      },
      {
        "id": "cs-3",
        "title": "Redshift Serverless",
        "body": "Automatically provisions and scales data warehouse compute capacity (RPUs) without cluster management."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Slow Bulk Ingestion via INSERT",
        "body": "Do NOT use single SQL `INSERT` statements to load data into Redshift. Always use the parallel `COPY` command from S3 or Redshift Spectrum."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "OLTP vs OLAP Traps",
        "body": "If an exam question specifies complex SQL analytics over petabytes of historical data, do NOT select RDS or Aurora. Select Amazon Redshift."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon Redshift concepts and multi-AZ / replication design in Amazon Redshift."
      }
    ],
    "memoryHook": "Redshift = Petabyte OLAP Columnar Warehouse | COPY = Fast S3 Ingest",
    "flashcardSetId": null
  }
];
