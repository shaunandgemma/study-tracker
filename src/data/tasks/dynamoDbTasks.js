/** Amazon DynamoDB Tasks (SAA-C03) */
export const DYNAMODB_TASKS = [
  {
    "id": "task-saa-dynamodb-create-a-dynamodb-table-with-a-partition-key-010",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Create a DynamoDB Table with a Partition Key",
    "slug": "create-a-dynamodb-table-with-a-partition-key",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "us-east-1",
    "goal": "Goal: Create a basic NoSQL table using a Partition Key (PK), set initial throughput settings, insert items with varying JSON attributes, and perform basic key-based item lookups.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Partition Key (Hash Attribute)",
        "body": "Single primary key attribute value hashed by DynamoDB to determine the exact physical storage partition for an item."
      },
      {
        "id": "concept-2",
        "title": "Schema-less NoSQL Items",
        "body": "Unlike relational databases, every item in a DynamoDB table can have distinct JSON attributes without pre-defining table columns."
      },
      {
        "id": "concept-3",
        "title": "GetItem Operation",
        "body": "Direct key-based lookup returning single-item attribute data in low single-digit milliseconds regardless of table size."
      },
      {
        "id": "concept-4",
        "title": "DynamoDB Free Tier Perimeter",
        "body": "Provides 25 WCU, 25 RCU, and 25 GB of storage free per month indefinitely under AWS Free Tier."
      },
      {
        "id": "concept-5",
        "title": "DynamoDB Key & Schema Architecture Plan",
        "body": "ComponentLab valuePurposeTable namesaa-db-task10-usersNoSQL user profile storePartition key (PK)UserId (String)Hashes item to physical partitionSort key (SK)None (Simple Primary Key)Single-attribute primary keyItem 1 schemaUserId, Name, EmailStandard user attributesItem 2 schemaUserId, Name, Age, IsVIPSchema-less custom attributes"
      }
    ],
    "whyItMatters": "This matters because key-value store architecture, partition distribution, and non-relational item schema flexibility are fundamental SAA-C03 exam topics.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Table Name",
        "value": "saa-db-task10-users"
      },
      {
        "label": "Partition Key",
        "value": "UserId (String)"
      },
      {
        "label": "Capacity Mode",
        "value": "On-Demand / Provisioned (5 WCU / 5 RCU)"
      },
      {
        "label": "Sample Item",
        "value": "UserId: user_101, Name: Shaun, Role: Admin"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:PutItem, dynamodb:GetItem, dynamodb:DescribeTable Cleanup: dynamodb:DeleteTable",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a DynamoDB Table with a Partition Key",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "In the left navigation sidebar, click Tables -> Choose Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task10-users."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Partition key to UserId -> Select Type String."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Keep default table settings (On-Demand or Provisioned) -> Choose Create table."
          }
        ],
        "note": "The Partition Key is hashed by DynamoDB to route read/write requests to physical storage partitions.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Explore Schema-less Item Creation",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task10-users -> Click Explore items -> Choose Create item."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Set UserId value to user_101."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Add new attribute -> Choose String -> Set attribute name Name and value Shaun."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Click Add new attribute -> Choose String -> Set attribute name Email and value shaun@example.com."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose Create item."
          }
        ],
        "note": "Attributes besides the Partition Key do not need to be predefined during table creation.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Insert a Second Item with Varying Attributes",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Click Create item."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set UserId value to user_102."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Add attribute Name = Gemma."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Add attribute Age (Number) = 28."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Add attribute IsVIP (Boolean) = true."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Choose Create item."
          }
        ],
        "note": "DynamoDB items within the same table can store completely different JSON attribute structures.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Perform Key-Based GetItem Lookup",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "In Explore items, select Scan or query items -> Choose Query."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Set UserId (Partition key) to user_101."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose Run."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Inspect returned item attributes and execution latency."
          }
        ],
        "note": "GetItem and Query lookups by Partition Key return data in single-digit milliseconds.",
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
            "text": "Select table saa-db-task10-users -> Choose Delete."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Type delete to confirm and click Delete table."
          }
        ],
        "note": null,
        "warning": "Delete test tables when finished to clean up your account.",
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
            "text": "REGION=us-east-1\nTABLE=saa-db-task10-users"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create DynamoDB Table with Partition Key",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=UserId,AttributeType=S --key-schema AttributeName=UserId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $REGION"
          }
        ],
        "note": "Creates DynamoDB table with UserId string partition key.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Insert JSON Items with Distinct Attributes",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb put-item --table-name $TABLE --item '{\"UserId\":{\"S\":\"user_101\"},\"Name\":{\"S\":\"Shaun\"},\"Email\":{\"S\":\"shaun@example.com\"}}' --region $REGION\naws dynamodb put-item --table-name $TABLE --item '{\"UserId\":{\"S\":\"user_102\"},\"Name\":{\"S\":\"Gemma\"},\"Age\":{\"N\":\"28\"},\"IsVIP\":{\"BOOL\":true}}' --region $REGION"
          }
        ],
        "note": "Inserts items with flexible attribute structures.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Execute GetItem Key-Based Lookup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb get-item --table-name $TABLE --key '{\"UserId\":{\"S\":\"user_101\"}}' --region $REGION"
          }
        ],
        "note": "Retrieves item attributes by Partition Key.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb delete-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Deletes table and all contained items.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Partition Key (HASH)",
        "body": "Single primary key value hashed by DynamoDB to distribute items across physical SSD storage partitions."
      },
      {
        "id": "cs-2",
        "title": "Schema Flexibility",
        "body": "Only primary key attributes are required during table creation. Items can store any number of unique attributes."
      },
      {
        "id": "cs-3",
        "title": "GetItem vs Scan",
        "body": "GetItem: Fast direct key lookup. Scan: Reads every item in table sequentially (high cost & slow)."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "ValidationException: Missing Partition Key",
        "body": "Ensure every `put-item` request includes the exact Partition Key attribute name (`UserId`) defined during table creation."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Hot Partitions",
        "body": "If a Partition Key has low cardinality (e.g. `Status` or `Gender`), all traffic hits a single physical partition creating a Hot Partition throttle. Use high-cardinality keys like `UserId` or `UUID`."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "Partition Key = Hash location | High Cardinality = No Hot Partitions | GetItem = Fast Lookup",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-add-a-sort-key-query-dynamodb-data-011",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Add a Sort Key & Query DynamoDB Data",
    "slug": "add-a-sort-key-query-dynamodb-data",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Easy",
    "estimatedMinutes": 20,
    "region": "us-east-1",
    "goal": "Goal: Create a table with a Composite Primary Key (Partition Key + Sort Key), load item collections, and run Query vs. Scan operations using comparison operators on the sort key.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Easy"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Composite Primary Key (PK + SK)",
        "body": "Combines a Partition Key (PK) and Sort Key (SK). Items sharing the same PK form an Item Collection sorted physically by SK."
      },
      {
        "id": "concept-2",
        "title": "Query Operation",
        "body": "Finds items matching a specific Partition Key and optionally filters by Sort Key conditions (e.g. OrderDate >= 2026-03-01). Highly efficient and low RCU."
      },
      {
        "id": "concept-3",
        "title": "Scan Operation",
        "body": "Reads every item in the entire table sequentially. Consumes high RCU throughput, scales poorly, and should be avoided in production."
      },
      {
        "id": "concept-4",
        "title": "Sort Key Comparison Operators",
        "body": "DynamoDB Queries support begins_with, between, >, , >=, and on Sort Key values."
      },
      {
        "id": "concept-5",
        "title": "Query vs Scan Comparison Decision Matrix",
        "body": "OperationTarget ScopeRCU ConsumptionPerformanceSAA-C03 RecommendationQuerySingle Partition Key (Item Collection)Low (Only matches read)Fast (Primary choice for application lookupsScanEntire Table (All Partitions)High (Evaluates all items)Slow (Linear degradation)Avoid except for small maintenance audits"
      }
    ],
    "whyItMatters": "This matters because the difference between inefficient table-wide Scan calls and efficient targeted Query operations is heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Table Name",
        "value": "saa-db-task11-orders"
      },
      {
        "label": "Partition Key",
        "value": "CustomerId (String)"
      },
      {
        "label": "Sort Key",
        "value": "OrderDate (String)"
      },
      {
        "label": "Sample Customer",
        "value": "cust_500"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:PutItem, dynamodb:Query, dynamodb:Scan Cleanup: dynamodb:DeleteTable",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a DynamoDB Table with Composite Primary Key",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Tables -> Click Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task11-orders."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Partition key to CustomerId (String)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Set Sort key to OrderDate (String)."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Choose Create table."
          }
        ],
        "note": "Items sharing the same CustomerId are stored in a contiguous item collection ordered by OrderDate.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Load Item Collection Data",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task11-orders -> Click Explore items -> Choose Create item."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Insert Item 1: CustomerId = cust_500, OrderDate = 2026-01-10, Amount = 49.99."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Insert Item 2: CustomerId = cust_500, OrderDate = 2026-03-15, Amount = 120.00."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Insert Item 3: CustomerId = cust_500, OrderDate = 2026-06-01, Amount = 85.50."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Insert Item 4: CustomerId = cust_700, OrderDate = 2026-02-20, Amount = 15.00."
          }
        ],
        "note": "Items 1, 2, and 3 belong to the same item collection (`cust_500`).",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Execute a Targeted DynamoDB Query Operation",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In Explore items, select Scan or query items -> Choose Query."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Partition key CustomerId to cust_500."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set Sort key condition to Greater than or equal to (>=) -> Value 2026-03-01."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Run."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Verify that only 2 items (`2026-03-15` and `2026-06-01`) are returned."
          }
        ],
        "note": "Query reads only the specific partition items matching the sort key expression.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Execute a DynamoDB Scan Operation & Compare RCU",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "In Explore items, change operation to Scan."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Click Run."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Notice that Scan returns all items across all partitions (`cust_500` and `cust_700`)."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Review RCU throughput metrics: Scan evaluates 100% of table items regardless of filters."
          }
        ],
        "note": "Scan consumes RCU for every item in the table, making it inefficient for application lookups.",
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
            "text": "Select table saa-db-task11-orders -> Choose Delete."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Confirm deletion and click Delete table."
          }
        ],
        "note": null,
        "warning": "Delete test tables to clean up your account.",
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
            "text": "REGION=us-east-1\nTABLE=saa-db-task11-orders"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Table with Composite Key (PK + SK)",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=CustomerId,AttributeType=S AttributeName=OrderDate,AttributeType=S --key-schema AttributeName=CustomerId,KeyType=HASH AttributeName=OrderDate,KeyType=RANGE --billing-mode PAY_PER_REQUEST --region $REGION"
          }
        ],
        "note": "Creates table with Partition Key CustomerId and Sort Key OrderDate.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Load Item Collection Data",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb put-item --table-name $TABLE --item '{\"CustomerId\":{\"S\":\"cust_500\"},\"OrderDate\":{\"S\":\"2026-01-10\"},\"Amount\":{\"N\":\"49.99\"}}' --region $REGION\naws dynamodb put-item --table-name $TABLE --item '{\"CustomerId\":{\"S\":\"cust_500\"},\"OrderDate\":{\"S\":\"2026-03-15\"},\"Amount\":{\"N\":\"120.00\"}}' --region $REGION\naws dynamodb put-item --table-name $TABLE --item '{\"CustomerId\":{\"S\":\"cust_500\"},\"OrderDate\":{\"S\":\"2026-06-01\"},\"Amount\":{\"N\":\"85.50\"}}' --region $REGION"
          }
        ],
        "note": "Loads multiple items into the cust_500 item collection.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Execute Targeted Query with Sort Key Filter",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb query --table-name $TABLE --key-condition-expression \"CustomerId = :c AND OrderDate >= :d\" --expression-attribute-values '{\":c\":{\"S\":\"cust_500\"},\":d\":{\"S\":\"2026-03-01\"}}' --region $REGION"
          }
        ],
        "note": "Executes fast, targeted Query filtering by Sort Key.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb delete-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Deletes composite key table.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Composite Key (PK + SK)",
        "body": "Partition Key groups items into physical partitions; Sort Key orders items within the item collection."
      },
      {
        "id": "cs-2",
        "title": "Query Operation",
        "body": "Requires Partition Key. Reads only matching items within the partition collection. Fast and cost-efficient."
      },
      {
        "id": "cs-3",
        "title": "Scan Operation",
        "body": "Reads entire table partition by partition. Expensive, slow, and consumes RCU heavily."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Query Error: Missing Partition Key",
        "body": "A DynamoDB Query MUST specify an exact equality condition (`=`) for the Partition Key."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Query vs Scan Performance Traps",
        "body": "If an exam scenario describes high latency or throttled read throughput during lookups, replace Scan calls with Query calls."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "Query = Targeted & Cheap | Scan = Table-Wide & Expensive | Sort Key = Order & Range",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-configure-dynamodb-on-demand-vs-provisioned-capacity-012",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Configure DynamoDB On-Demand vs Provisioned Capacity",
    "slug": "configure-dynamodb-on-demand-vs-provisioned-capacity",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Switch table capacity modes between Provisioned (setting Read/Write Capacity Units - RCUs/WCUs with Auto Scaling) and On-Demand capacity modes.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Provisioned Capacity Mode",
        "body": "Specify fixed Read Capacity Units (RCUs) and Write Capacity Units (WCUs). Best for predictable traffic; supports Auto Scaling and Reserved Capacity discounts."
      },
      {
        "id": "concept-2",
        "title": "On-Demand Capacity Mode (PAY_PER_REQUEST)",
        "body": "Instantly accommodates spiky, unpredictable workloads without capacity planning. Pay only per read/write request."
      },
      {
        "id": "concept-3",
        "title": "Read Capacity Unit (RCU)",
        "body": "1 RCU = 1 strongly consistent read/sec (or 2 eventually consistent reads/sec) for items up to 4 KB."
      },
      {
        "id": "concept-4",
        "title": "Write Capacity Unit (WCU)",
        "body": "1 WCU = 1 write/sec for items up to 1 KB."
      },
      {
        "id": "concept-5",
        "title": "Provisioned vs On-Demand Capacity Decision Matrix",
        "body": "FeatureProvisioned Capacity ModeOn-Demand Capacity ModeWorkload typePredictable, steady-state continuous trafficUnpredictable, spiky, or brand-new workloadsCapacity planningRequired (Specify RCUs & WCUs)None required (Instant auto-scale)Billing modelHourly fee per allocated RCU / WCUPay-per-request (per 1M reads/writes)Auto ScalingOptional (Target tracking scaling rules)Built-in automatic instant scalingCost optimizationCheaper for high-volume steady trafficCheaper for low-volume or unknown traffic"
      }
    ],
    "whyItMatters": "This matters because cost optimization for predictable continuous workloads (Provisioned) vs. unpredictable/spiky workloads (On-Demand) is heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Table Name",
        "value": "saa-db-task12-capacity"
      },
      {
        "label": "Initial Mode",
        "value": "Provisioned (5 RCU / 5 WCU + Auto Scaling)"
      },
      {
        "label": "Target Mode",
        "value": "On-Demand (PAY_PER_REQUEST)"
      },
      {
        "label": "Auto Scaling Target",
        "value": "Target tracking 70% utilization"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:UpdateTable, dynamodb:DescribeTable Cleanup: dynamodb:DeleteTable",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a DynamoDB Table in Provisioned Capacity Mode",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Tables -> Click Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task12-capacity -> Partition key to Id (String)."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Under Table settings, select Customize settings."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Under Read/write capacity settings, select Provisioned."
          },
          {
            "id": "console-step-2-item-7",
            "text": "Set Read capacity to 5 RCU and Write capacity to 5 WCU."
          },
          {
            "id": "console-step-2-item-8",
            "text": "Keep Auto scaling enabled (Target tracking 70%) -> Choose Create table."
          }
        ],
        "note": "Provisioned capacity allocates dedicated throughput for steady-state workloads.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Inspect Provisioned RCU/WCU Settings and Auto Scaling",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task12-capacity -> Choose Additional settings tab."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Locate Read/write capacity card."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Verify Provisioned capacity metrics: 5 RCUs, 5 WCUs, and active Auto Scaling target tracking rules."
          }
        ],
        "note": "Auto Scaling dynamically adjusts RCUs/WCUs within specified min/max boundaries.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Switch Capacity Mode to On-Demand (PAY_PER_REQUEST)",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In Additional settings tab, click Edit next to Read/write capacity."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select On-demand capacity mode."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Review capacity mode change details (you can switch between On-demand and Provisioned once per 24 hours)."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Save changes."
          }
        ],
        "note": "On-demand mode eliminates RCU/WCU management and handles instant traffic spikes.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify On-Demand Billing Mode Status",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Monitor Table status transitioning from UPDATING to ACTIVE."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Confirm Capacity mode displays On-Demand (Pay-per-request)."
          }
        ],
        "note": "In On-Demand mode, DynamoDB scales reads and writes instantly up to double the previous peak traffic.",
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
            "text": "Select table saa-db-task12-capacity -> Choose Delete."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Confirm deletion and click Delete table."
          }
        ],
        "note": null,
        "warning": "Delete test tables to clean up your account.",
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
            "text": "REGION=us-east-1\nTABLE=saa-db-task12-capacity"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Provisioned Mode Table (5 RCU / 5 WCU)",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=Id,AttributeType=S --key-schema AttributeName=Id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region $REGION"
          }
        ],
        "note": "Creates table in Provisioned capacity mode.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Describe Table Capacity Settings",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb describe-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Displays provisioned RCU and WCU values.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Switch Billing Mode to On-Demand (PAY_PER_REQUEST)",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb update-table --table-name $TABLE --billing-mode PAY_PER_REQUEST --region $REGION"
          }
        ],
        "note": "Switches capacity mode to On-Demand.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb delete-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Deletes table.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Provisioned Capacity",
        "body": "Best for predictable traffic patterns. Lower cost when utilized steadily; supports Reserved Capacity."
      },
      {
        "id": "cs-2",
        "title": "On-Demand Capacity",
        "body": "Best for unpredictable, spiky, or unknown workloads. Zero capacity planning; pay per request."
      },
      {
        "id": "cs-3",
        "title": "Capacity Conversion",
        "body": "Tables can switch between Provisioned and On-Demand capacity modes once per 24 hours."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "ProvisionedThroughputExceededException",
        "body": "Occurs when traffic exceeds provisioned RCUs/WCUs. Solution: Enable DynamoDB Auto Scaling or switch to On-Demand capacity mode."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Spiky Traffic Cost Optimization",
        "body": "If traffic is highly unpredictable with sudden burst spikes, choose On-Demand capacity to prevent throttling. If traffic is steady 24/7, choose Provisioned capacity for lower cost."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "Provisioned = Steady & Cheap | On-Demand = Spiky & Automatic",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-create-a-dynamodb-global-secondary-index-gsi-013",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Create a DynamoDB Global Secondary Index (GSI)",
    "slug": "create-a-dynamodb-global-secondary-index-gsi",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Add a Global Secondary Index (GSI) with an alternate partition/sort key on an existing table, select projected attributes, and execute queries against the index.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Global Secondary Index (GSI)",
        "body": "An index with a Partition Key and optional Sort Key that can be different from those on the base table. Can be created or deleted anytime."
      },
      {
        "id": "concept-2",
        "title": "Local Secondary Index (LSI) vs GSI",
        "body": "GSI: Alternate PK & SK; can be created anytime; uses dedicated GSI throughput. LSI: Same PK, alternate SK; MUST be created at table creation time."
      },
      {
        "id": "concept-3",
        "title": "Attribute Projections",
        "body": "Specifies which attributes are copied from the base table into the index: KEYS_ONLY, INCLUDE, or ALL."
      },
      {
        "id": "concept-4",
        "title": "GSI Consistency & Write Throttling",
        "body": "GSIs are always eventually consistent. If write capacity on a GSI is insufficient, writes to the base table will be throttled."
      },
      {
        "id": "concept-5",
        "title": "GSI vs LSI Architectural Decision Matrix",
        "body": "FeatureGlobal Secondary Index (GSI)Local Secondary Index (LSI)Partition Key (PK)Can be different from base table PKMust be SAME as base table PKCreation timeAnytime (During or after table creation)Table creation time ONLYRead consistencyEventually consistent ONLYStrongly or eventually consistentThroughput capacityDedicated RCU / WCU per indexShares base table RCU / WCUSize limitNo size limit per partition10 GB limit per partition key item collection"
      }
    ],
    "whyItMatters": "This matters because querying non-primary key attributes without full table scans, understanding GSI eventual consistency, and managing write throughput throttling are heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Table Name",
        "value": "saa-db-task13-orders"
      },
      {
        "label": "Base Table PK",
        "value": "OrderId (String)"
      },
      {
        "label": "GSI PK / SK",
        "value": "CustomerEmail (PK) / OrderDate (SK)"
      },
      {
        "label": "GSI Projections",
        "value": "ALL"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:UpdateTable, dynamodb:Query, dynamodb:DescribeTable Cleanup: dynamodb:DeleteTable",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create a Base DynamoDB Table",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Tables -> Click Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task13-orders."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Partition key to OrderId (String)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create table."
          }
        ],
        "note": "The base table uses OrderId as its primary key.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Add a Global Secondary Index (GSI)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task13-orders -> Choose Indexes tab."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click Create index."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Set Partition key to CustomerEmail (String)."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Set Sort key to OrderDate (String)."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set Index name to CustomerEmail-OrderDate-index."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Set Attribute projections to All."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Choose Create index."
          }
        ],
        "note": "GSIs allow querying non-primary key attributes like CustomerEmail without running full table scans.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Wait for GSI Status to Become Active",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Monitor Index status transitioning from CREATING to ACTIVE."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Note that DynamoDB automatically backfills existing table items into the new index asynchronously."
          }
        ],
        "note": "Backfilling occurs in the background without blocking base table read/write operations.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Populate Sample Order Items",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select table saa-db-task13-orders -> Click Explore items -> Choose Create item."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Insert Item 1: OrderId = ord_1001, CustomerEmail = alice@example.com, OrderDate = 2026-04-01, Total = 99.00."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Insert Item 2: OrderId = ord_1002, CustomerEmail = alice@example.com, OrderDate = 2026-05-10, Total = 150.00."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Insert Item 3: OrderId = ord_1003, CustomerEmail = bob@example.com, OrderDate = 2026-05-12, Total = 25.00."
          }
        ],
        "note": "Items will be indexed under both OrderId (base table) and CustomerEmail (GSI).",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Execute Query Against the Global Secondary Index",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "In Explore items, select Scan or query items -> Choose Query."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select Index CustomerEmail-OrderDate-index."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Set CustomerEmail to alice@example.com."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Run."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Verify that only Alice's 2 orders are returned instantly without scanning Bob's order."
          }
        ],
        "note": "Querying the GSI returns results in single-digit milliseconds by CustomerEmail.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down lab resources",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Select table saa-db-task13-orders -> Choose Delete."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Confirm deletion and click Delete table."
          }
        ],
        "note": null,
        "warning": "Delete test tables to clean up your account.",
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
            "text": "REGION=us-east-1\nTABLE=saa-db-task13-orders"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Base Table with OrderId PK",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=OrderId,AttributeType=S --key-schema AttributeName=OrderId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $REGION"
          }
        ],
        "note": "Creates base table.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Add Global Secondary Index (GSI) via Update Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb update-table --table-name $TABLE --attribute-definitions AttributeName=CustomerEmail,AttributeType=S AttributeName=OrderDate,AttributeType=S --global-secondary-index-updates '[{\"Create\":{\"IndexName\":\"CustomerEmail-OrderDate-index\",\"KeySchema\":[{\"AttributeName\":\"CustomerEmail\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"OrderDate\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}}]' --region $REGION"
          }
        ],
        "note": "Adds GSI with CustomerEmail PK and OrderDate SK.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Query Global Secondary Index",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb query --table-name $TABLE --index-name CustomerEmail-OrderDate-index --key-condition-expression \"CustomerEmail = :e\" --expression-attribute-values '{\":e\":{\"S\":\"alice@example.com\"}}' --region $REGION"
          }
        ],
        "note": "Executes query against the GSI.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb delete-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Deletes base table and attached GSI.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Global Secondary Index (GSI)",
        "body": "Alternate PK and optional SK. Can be added or deleted at any time. Always eventually consistent."
      },
      {
        "id": "cs-2",
        "title": "GSI Write Throttling",
        "body": "Base table writes are throttled if GSI write capacity is exceeded. Ensure sufficient GSI WCUs."
      },
      {
        "id": "cs-3",
        "title": "Attribute Projection",
        "body": "KEYS_ONLY, INCLUDE, or ALL. Projecting fewer attributes reduces GSI storage and RCU costs."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "ProvisionedThroughputExceededException on GSI",
        "body": "Occurs when GSI write throughput is lower than base table write throughput. Solution: Increase GSI WCUs or enable Auto Scaling."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "GSI vs LSI Creation Time Traps",
        "body": "If an exam question asks to add an index to an existing table, choose GSI (LSIs can only be created at table creation time)."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "GSI = Anytime & Any Key | LSI = Creation Only & Same Partition Key",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-enable-dynamodb-streams-014",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Enable DynamoDB Streams",
    "slug": "enable-dynamodb-streams",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Enable DynamoDB Streams with NEW_AND_OLD_IMAGES, and hook up a simple CloudWatch/Lambda trigger simulation to process real-time item updates.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "DynamoDB Streams Overview",
        "body": "Captures a time-ordered sequence of item-level modifications (inserts, updates, deletes) in a DynamoDB table and stores logs for 24 hours."
      },
      {
        "id": "concept-2",
        "title": "Stream View Types",
        "body": "KEYS_ONLY: Key attributes only. NEW_IMAGE: Entire item after modification. OLD_IMAGE: Entire item before modification. NEW_AND_OLD_IMAGES: Both new and old item states."
      },
      {
        "id": "concept-3",
        "title": "Change Data Capture (CDC)",
        "body": "Enables event-driven architectures by asynchronously triggering AWS Lambda functions, EventBridge Pipes, or Kinesis Data Streams upon database changes."
      },
      {
        "id": "concept-4",
        "title": "24-Hour Log Retention",
        "body": "Stream data records are retained for exactly 24 hours and automatically purged thereafter."
      },
      {
        "id": "concept-5",
        "title": "DynamoDB Streams vs Kinesis Data Streams Matrix",
        "body": "FeatureDynamoDB StreamsKinesis Data Streams for DynamoDBRetention period24 hours (Fixed)Up to 1 year (Configurable)Target use caseEvent-driven Lambda triggers, Global TablesLong-term auditing, multi-subscriber analyticsOrdering guaranteeStrictly ordered per item keyStrictly ordered per shard partition keyMultiple consumersUp to 2 concurrent consumersMultiple independent applications & Firehose"
      }
    ],
    "whyItMatters": "This matters because event-driven architecture, CDC (Change Data Capture) logging, and asynchronous Lambda triggering from DynamoDB are heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Table Name",
        "value": "saa-db-task14-inventory"
      },
      {
        "label": "Partition Key",
        "value": "ItemId (String)"
      },
      {
        "label": "Stream View Type",
        "value": "NEW_AND_OLD_IMAGES"
      },
      {
        "label": "Stream Retention",
        "value": "24 hours"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:UpdateTable, dynamodb:DescribeStream, dynamodb:GetRecords Cleanup: dynamodb:DeleteTable",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Base DynamoDB Table",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Tables -> Click Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task14-inventory."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Partition key to ItemId (String)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create table."
          }
        ],
        "note": "Creates the inventory table.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable DynamoDB Streams with NEW_AND_OLD_IMAGES",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task14-inventory -> Choose Exports and streams tab."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Locate DynamoDB stream details card -> Click Turn on."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select View type New and old images."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Click Turn on stream."
          }
        ],
        "note": "NEW_AND_OLD_IMAGES records both the previous and modified attributes for every item modification.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Copy Stream ARN and Verify Status",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In Exports and streams tab, locate the Latest stream ARN (e.g. arn:aws:dynamodb:us-east-1:123456789012:table/saa-db-task14-inventory/stream/...)."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Confirm Stream status displays Enabled."
          }
        ],
        "note": "The Stream ARN is used by AWS Lambda triggers or Kinesis Event Source Mappings.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Insert and Modify Table Items to Generate Stream Events",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Click Explore items -> Choose Create item."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Insert Item: ItemId = item_99, StockQuantity = 100, Status = InStock."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select item_99 -> Click Actions -> Choose Edit item."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Update StockQuantity to 45 and click Save."
          }
        ],
        "note": "This modification creates a stream record containing both the old image (100) and new image (45).",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Simulate Asynchronous Lambda Trigger Processing",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Review how AWS Lambda polls the stream using the Stream ARN."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Verify that stream records order events chronologically per item key."
          }
        ],
        "note": "Lambda automatically scales pollers to process stream shards asynchronously.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down lab resources",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Select table saa-db-task14-inventory -> Choose Delete."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Confirm deletion and click Delete table."
          }
        ],
        "note": null,
        "warning": "Deleting the table automatically removes its associated stream.",
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
            "text": "REGION=us-east-1\nTABLE=saa-db-task14-inventory"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Table with DynamoDB Streams Enabled",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=ItemId,AttributeType=S --key-schema AttributeName=ItemId,KeyType=HASH --billing-mode PAY_PER_REQUEST --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES --region $REGION"
          }
        ],
        "note": "Creates table with NEW_AND_OLD_IMAGES stream enabled.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Describe Stream Specification and Stream ARN",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb describe-table --table-name $TABLE --query \"Table.LatestStreamArn\" --region $REGION"
          }
        ],
        "note": "Returns the active Stream ARN.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Put and Update Item to Trigger Stream Record",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb put-item --table-name $TABLE --item '{\"ItemId\":{\"S\":\"item_99\"},\"StockQuantity\":{\"N\":\"100\"}}' --region $REGION\naws dynamodb update-item --table-name $TABLE --key '{\"ItemId\":{\"S\":\"item_99\"}}' --update-expression \"SET StockQuantity = :q\" --expression-attribute-values '{\":q\":{\"N\":\"45\"}}' --region $REGION"
          }
        ],
        "note": "Generates insert and update events in the stream.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb delete-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Deletes table and stream.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "DynamoDB Streams",
        "body": "24-hour time-ordered log of item-level changes (insert, update, delete) for event-driven Lambda triggering."
      },
      {
        "id": "cs-2",
        "title": "NEW_AND_OLD_IMAGES",
        "body": "Captures both previous state and updated state of the modified item in the stream record."
      },
      {
        "id": "cs-3",
        "title": "Global Tables Dependency",
        "body": "DynamoDB Global Tables require DynamoDB Streams (`NEW_AND_OLD_IMAGES`) to replicate changes across Regions."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Lambda Not Triggering on Stream",
        "body": "Ensure the Lambda Execution Role has `dynamodb:GetRecords`, `dynamodb:GetShardIterator`, and `dynamodb:DescribeStream` permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Retention Period Limit",
        "body": "DynamoDB Streams retain records for exactly 24 hours (cannot be extended). If you need up to 1 year retention, use Kinesis Data Streams for DynamoDB."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "Streams = 24-Hour Change Log | NEW_AND_OLD = Before & After Images",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-enable-dynamodb-time-to-live-ttl-015",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Enable DynamoDB Time-To-Live (TTL)",
    "slug": "enable-dynamodb-time-to-live-ttl",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Configure a TTL attribute (Unix timestamp), insert sample items with past timestamps, and observe background deletion of expired records at zero additional cost.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "DynamoDB Time-To-Live (TTL)",
        "body": "Automated background process that deletes expired items from tables based on a designated Unix timestamp attribute."
      },
      {
        "id": "concept-2",
        "title": "Unix Epoch Timestamp Format",
        "body": "TTL attributes MUST be stored as a Number data type representing time in seconds since January 1, 1970 UTC (e.g. 1700000000)."
      },
      {
        "id": "concept-3",
        "title": "Zero Capacity Consumption",
        "body": "TTL deletions run automatically in the background and do NOT consume any Read Capacity Units (RCUs) or Write Capacity Units (WCUs)."
      },
      {
        "id": "concept-4",
        "title": "Deletion Timeline & Streams Integration",
        "body": "Expired items are deleted within 48 hours. If DynamoDB Streams is enabled, TTL deletions emit a delete event with principalId: dynamodb.amazonaws.com."
      },
      {
        "id": "concept-5",
        "title": "DynamoDB TTL Architectural Benefits Plan",
        "body": "BenefitHow It WorksExam SignificanceCost optimizationAutomatically purges obsolete session data & logsEliminates unnecessary storage feesZero WCU impactDeletions executed by internal background scannerNo write capacity throttling during purgeZero code maintenanceAWS manages background expiration scanningMinimizes operational overheadStream integrationEmits delete events to DynamoDB StreamsTriggers downstream archive to S3 Glacier"
      }
    ],
    "whyItMatters": "This matters because storage cost optimization and automated data retention enforcement without compute or WCU overhead are heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Table Name",
        "value": "saa-db-task15-sessions"
      },
      {
        "label": "Partition Key",
        "value": "SessionId (String)"
      },
      {
        "label": "TTL Attribute Name",
        "value": "ExpirationTime (Number)"
      },
      {
        "label": "Timestamp Format",
        "value": "Unix seconds (Epoch)"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:UpdateTimeToLive, dynamodb:DescribeTimeToLive Cleanup: dynamodb:DeleteTable",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Session Table",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Tables -> Click Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task15-sessions."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Partition key to SessionId (String)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create table."
          }
        ],
        "note": "Creates session table.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable Time-To-Live (TTL) on ExpirationTime Attribute",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task15-sessions -> Choose Additional settings tab."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Locate Time to Live (TTL) card -> Click Turn on."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Set TTL attribute name to ExpirationTime."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Click Turn on TTL."
          }
        ],
        "note": "DynamoDB will scan ExpirationTime attributes to identify expired records.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Verify TTL Status Displays Enabled",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Monitor TTL status transitioning from ENABLING to ENABLED."
          }
        ],
        "note": "TTL background scanning is now active.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Insert Session Items with Expired Unix Timestamps",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Click Explore items -> Choose Create item."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Insert Item 1: SessionId = sess_active_01, ExpirationTime (Number) = 1893456000 (Future timestamp)."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Insert Item 2: SessionId = sess_expired_02, ExpirationTime (Number) = 1600000000 (Past timestamp)."
          }
        ],
        "note": "Item 2 has a timestamp in the past and is eligible for background TTL purge.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Observe Background TTL Deletion",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Note that DynamoDB automatically marks expired items for background deletion without consuming write throughput capacity."
          }
        ],
        "note": "Items are typically purged within 48 hours of expiration.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down lab resources",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Select table saa-db-task15-sessions -> Choose Delete."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Confirm deletion and click Delete table."
          }
        ],
        "note": null,
        "warning": "Delete test tables when finished to clean up your account.",
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
            "text": "REGION=us-east-1\nTABLE=saa-db-task15-sessions"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=SessionId,AttributeType=S --key-schema AttributeName=SessionId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $REGION"
          }
        ],
        "note": "Creates base table.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Enable Time-To-Live (TTL) on ExpirationTime Attribute",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb update-time-to-live --table-name $TABLE --time-to-live-specification Enabled=true,AttributeName=ExpirationTime --region $REGION"
          }
        ],
        "note": "Enables TTL on ExpirationTime attribute.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Describe TTL Status",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb describe-time-to-live --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Verifies TTL status is ENABLED.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Delete DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb delete-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Deletes table.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "DynamoDB TTL",
        "body": "Automated background deletion of expired items based on a Unix epoch timestamp attribute."
      },
      {
        "id": "cs-2",
        "title": "Zero WCU Impact",
        "body": "TTL background purges do NOT consume Read Capacity Units (RCUs) or Write Capacity Units (WCUs)."
      },
      {
        "id": "cs-3",
        "title": "Attribute Format Requirement",
        "body": "TTL attribute MUST be stored as a Number representing time in seconds since Unix epoch."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "TTL Not Deleting Item Immediately",
        "body": "TTL background deletion is asynchronous and can take up to 48 hours after timestamp expiration to purge items."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "TTL Format Traps",
        "body": "If an exam question asks why TTL is not working, check if the timestamp is formatted as an ISO string (`2026-05-01`). TTL ONLY accepts Unix epoch timestamps in seconds (Number)."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "TTL = Unix Seconds Number | Zero WCU = Free Deletion | Auto Purge = Clean Storage",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-enable-dynamodb-global-tables-016",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Enable DynamoDB Global Tables",
    "slug": "enable-dynamodb-global-tables",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1 & eu-west-1",
    "goal": "Goal: Convert a single-Region table into a multi-Region Global Table across us-east-1 and eu-west-1, test active-active multi-Region replication.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "DynamoDB Global Tables Overview",
        "body": "Fully managed, multi-Region, active-active database replication solution providing low-latency local read/write access to globally distributed applications."
      },
      {
        "id": "concept-2",
        "title": "Active-Active Multi-Master Writes",
        "body": "Applications can read and write to any replica table in any Region. Changes are replicated automatically across all replica Regions."
      },
      {
        "id": "concept-3",
        "title": "Conflict Resolution (Last-Writer-Wins)",
        "body": "DynamoDB uses a Last-Writer-Wins strategy based on timestamps to resolve concurrent write conflicts across Regions."
      },
      {
        "id": "concept-4",
        "title": "Streams Dependency & Capacity Rules",
        "body": "Global Tables require DynamoDB Streams enabled (NEW_AND_OLD_IMAGES). On-Demand capacity or identical Provisioned WCU/RCU settings are recommended."
      },
      {
        "id": "concept-5",
        "title": "Multi-Region Replication Strategy Plan",
        "body": "SettingPrimary Region (us-east-1)Replica Region (eu-west-1)Table namesaa-db-task16-userssaa-db-task16-usersRead / Write capabilityActive Read / Active WriteActive Read / Active WriteReplication mechanismDynamoDB Streams (Sub-second)DynamoDB Streams (Sub-second)Capacity modeOn-Demand (PAY_PER_REQUEST)On-Demand (PAY_PER_REQUEST)Failover modelAutomatic local client failoverAutomatic local client failover"
      }
    ],
    "whyItMatters": "This matters because designing disaster-resilient, low-latency multi-region architectures with active-active write capability is a major focus on SAA-C03.",
    "values": [
      {
        "label": "Primary Region",
        "value": "us-east-1"
      },
      {
        "label": "Replica Region",
        "value": "eu-west-1 (or eu-west-2)"
      },
      {
        "label": "Table Name",
        "value": "saa-db-task16-users"
      },
      {
        "label": "Capacity Mode",
        "value": "On-Demand (PAY_PER_REQUEST)"
      },
      {
        "label": "Replication Protocol",
        "value": "Active-Active Multi-Region Streams"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:CreateGlobalTable, dynamodb:UpdateGlobalTable, dynamodb:DescribeTable Cleanup: dynamodb:DeleteTable",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Primary DynamoDB Table in us-east-1",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Tables -> Click Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task16-users -> Partition key to UserId (String)."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Select Table settings: On-demand capacity mode -> Choose Create table."
          }
        ],
        "note": "On-Demand capacity mode ensures both replica regions scale throughput automatically.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable DynamoDB Streams with NEW_AND_OLD_IMAGES",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task16-users -> Choose Exports and streams tab."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Under DynamoDB stream details, click Turn on."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select View type New and old images -> Click Turn on stream."
          }
        ],
        "note": "Global Tables require Streams enabled to replicate item changes across Regions.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create Multi-Region Replica in eu-west-1",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Select table saa-db-task16-users -> Choose Global tables tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Click Create replica."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select AWS Region eu-west-1 (Europe Ireland) or eu-west-2 (London)."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Create replica."
          }
        ],
        "note": "DynamoDB provisions a matching replica table in the target Region and initiates replication.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Verify Replication Status Across Regions",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Monitor Replica status transitioning from CREATING to ACTIVE."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Confirm Global Table status displays Active in both Regions."
          }
        ],
        "note": "Active-Active replication ensures local sub-second writes in both Regions.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test Active-Active Multi-Region Data Write",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "In us-east-1, insert Item: UserId = user_us_100, RegionOrigin = us-east-1."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Switch console Region to eu-west-1 -> Open table saa-db-task16-users -> Explore items."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Verify that user_us_100 appears automatically via sub-second active-active replication."
          }
        ],
        "note": "Sub-second active-active replication keeps data synchronized worldwide.",
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
            "text": "In Global tables tab, select eu-west-1 replica -> Click Delete replica."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Select primary table saa-db-task16-users in us-east-1 -> Choose Delete."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Confirm deletion and click Delete table."
          }
        ],
        "note": null,
        "warning": "Delete replica tables in both Regions to prevent ongoing cross-Region storage charges.",
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
            "text": "REGION1=us-east-1\nREGION2=eu-west-1\nTABLE=saa-db-task16-users"
          }
        ],
        "note": "Sets CLI variable names for both Regions.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create Primary Table with Streams Enabled in us-east-1",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=UserId,AttributeType=S --key-schema AttributeName=UserId,KeyType=HASH --billing-mode PAY_PER_REQUEST --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES --region $REGION1"
          }
        ],
        "note": "Creates primary table in us-east-1.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create Global Table Replica in eu-west-1",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb update-table --table-name $TABLE --replica-updates '[{\"Create\":{\"RegionName\":\"'$REGION2'\"}}]' --region $REGION1"
          }
        ],
        "note": "Adds replica table in eu-west-1.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Describe Global Table Replication Status",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb describe-table --table-name $TABLE --region $REGION1"
          }
        ],
        "note": "Verifies active-active replication status.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Tear down Replica and Primary Tables",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb update-table --table-name $TABLE --replica-updates '[{\"Delete\":{\"RegionName\":\"'$REGION2'\"}}]' --region $REGION1\naws dynamodb delete-table --table-name $TABLE --region $REGION1"
          }
        ],
        "note": "Deletes replica in eu-west-1 and primary table in us-east-1.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "DynamoDB Global Tables",
        "body": "Fully managed active-active multi-Region replication solution providing low-latency local read/write access globally."
      },
      {
        "id": "cs-2",
        "title": "Active-Active Writes",
        "body": "Applications read and write locally to nearest AWS Region. Conflicts resolved using Last-Writer-Wins (LWW)."
      },
      {
        "id": "cs-3",
        "title": "Prerequisite Requirement",
        "body": "DynamoDB Streams (`NEW_AND_OLD_IMAGES`) MUST be enabled before converting to Global Tables."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Global Table Creation Error: Streams Disabled",
        "body": "Verify that DynamoDB Streams is enabled with view type `NEW_AND_OLD_IMAGES` before creating replicas."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Active-Active vs Active-Passive",
        "body": "DynamoDB Global Tables provide Active-Active multi-Region writes. Aurora Global Database provides Active-Passive (single writer Region, multiple read Regions)."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "Global Tables = Active-Active Multi-Region | Streams = Replication Engine",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-configure-dynamodb-backup-restore-017",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Configure DynamoDB Backup & Restore",
    "slug": "configure-dynamodb-backup-restore",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Enable Point-In-Time Recovery (PITR), perform on-demand snapshots, and simulate a table restore to a new table.",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Point-In-Time Recovery (PITR)",
        "body": "Continuous automatic backups providing per-second restore granularity to any second in the past 35 days without performance impact."
      },
      {
        "id": "concept-2",
        "title": "On-Demand Backup Snapshots",
        "body": "Full manual table backups preserved long-term until explicitly deleted. Ideal for compliance archiving before major schema updates."
      },
      {
        "id": "concept-3",
        "title": "Restoring to a New Table",
        "body": "Restores from PITR or on-demand backups ALWAYS create a brand-new DynamoDB table (cannot overwrite existing tables)."
      },
      {
        "id": "concept-4",
        "title": "Zero Performance Overhead",
        "body": "Continuous PITR backups and manual snapshot creations execute in the background with 0% impact on table RCU/WCU performance."
      },
      {
        "id": "concept-5",
        "title": "PITR vs On-Demand Backup Comparison Matrix",
        "body": "Backup TypePoint-In-Time Recovery (PITR)On-Demand BackupBackup frequencyContinuous automatic per-second backupsManual trigger on demandRetention period35 days (Fixed window)Indefinite (Until manually deleted)Restore granularityAny second in the last 35 daysExact point of snapshot creationPrimary use caseProtection against accidental deletes / updatesCompliance archiving & pre-deployment backup"
      }
    ],
    "whyItMatters": "This matters because continuous data recovery (PITR up to 35 days) vs. manual long-term backup snapshots are heavily tested on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Primary Table",
        "value": "saa-db-task17-catalog"
      },
      {
        "label": "Restored Table",
        "value": "saa-db-task17-catalog-restored"
      },
      {
        "label": "PITR Retention Window",
        "value": "35 days (Per-second granularity)"
      },
      {
        "label": "Backup Snapshot Name",
        "value": "saa-db-task17-snapshot"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
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
        "note": "Identity check: sts:GetCallerIdentity DynamoDB permissions: dynamodb:CreateTable, dynamodb:UpdateContinuousBackups, dynamodb:CreateBackup, dynamodb:RestoreTableFromBackup Cleanup: dynamodb:DeleteTable, dynamodb:DeleteBackup",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create Base Product Catalog Table",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Amazon DynamoDB Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Choose Region us-east-1."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Tables -> Click Create table."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Set Table name to saa-db-task17-catalog."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Partition key to ProductId (String)."
          },
          {
            "id": "console-step-2-item-6",
            "text": "Choose Create table."
          }
        ],
        "note": "Creates base catalog table.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Enable Point-In-Time Recovery (PITR)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select table saa-db-task17-catalog -> Choose Backups tab."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Locate Point-in-time recovery (PITR) card -> Click Edit."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Toggle Point-in-time recovery to Enabled."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Save changes."
          }
        ],
        "note": "PITR continuously backs up table data for 35 days with per-second restore precision.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create Manual On-Demand Backup Snapshot",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In Backups tab, locate On-demand backups card -> Click Create backup."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Backup name to saa-db-task17-snapshot."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose Create backup."
          }
        ],
        "note": "On-demand backups create an immutable full snapshot preserved long-term.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Simulate Table Data Modification",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Click Explore items -> Choose Create item."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Insert Item: ProductId = prod_55, Name = Cloud Appliance, Price = 299.99."
          }
        ],
        "note": "Modifying data allows verifying restore state accuracy.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Restore Snapshot to a New Table",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open Backups in left sidebar -> Select saa-db-task17-snapshot."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Click Restore."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Set Target table name to saa-db-task17-catalog-restored."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Choose Restore table."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Wait for restored table status to transition to Active."
          }
        ],
        "note": "Restores always write to a brand-new table name.",
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down lab resources",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Delete restored table saa-db-task17-catalog-restored."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete base table saa-db-task17-catalog."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Delete on-demand snapshot saa-db-task17-snapshot."
          }
        ],
        "note": null,
        "warning": "Delete restored and primary tables to clean up account storage.",
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
            "text": "REGION=us-east-1\nTABLE=saa-db-task17-catalog\nRESTORED_TABLE=saa-db-task17-catalog-restored"
          }
        ],
        "note": "Sets CLI variable names.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create DynamoDB Table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name $TABLE --attribute-definitions AttributeName=ProductId,AttributeType=S --key-schema AttributeName=ProductId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $REGION"
          }
        ],
        "note": "Creates base catalog table.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Enable Point-In-Time Recovery (PITR)",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws dynamodb update-continuous-backups --table-name $TABLE --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true --region $REGION"
          }
        ],
        "note": "Enables continuous 35-day PITR.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Create On-Demand Backup Snapshot",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-backup --table-name $TABLE --backup-name saa-db-task17-snapshot --region $REGION"
          }
        ],
        "note": "Creates on-demand snapshot.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Tear down Base Table and Backup",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws dynamodb delete-table --table-name $TABLE --region $REGION"
          }
        ],
        "note": "Deletes table.",
        "warning": "Destructive Command Warning: This command permanently deletes database instances, clusters, tables, or snapshots.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Point-In-Time Recovery (PITR)",
        "body": "Continuous automatic backups for 35 days with per-second restore granularity and 0% performance impact."
      },
      {
        "id": "cs-2",
        "title": "On-Demand Backup",
        "body": "Full manual snapshots preserved indefinitely until explicitly deleted. Great for compliance archiving."
      },
      {
        "id": "cs-3",
        "title": "Restores Create New Tables",
        "body": "Restoring from PITR or on-demand backups ALWAYS creates a new table; it never overwrites an existing table."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Restore Error: Table Name Exists",
        "body": "Restores require a unique, non-existent target table name. Specify a new table identifier."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "In-Place Restore Trap",
        "body": "DynamoDB does NOT support in-place table restores. Restores always generate a brand-new table."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "PITR = 35 Days Per-Second | On-Demand = Long-Term Snapshot | Restore = New Table",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-dynamodb-compare-redshift-vs-rds-vs-dynamodb-022",
    "examCode": "aws-saa-c03",
    "topicId": "topic-dynamodb",
    "title": "Compare Redshift vs RDS vs DynamoDB",
    "slug": "compare-redshift-vs-rds-vs-dynamodb",
    "service": "Amazon DynamoDB",
    "feature": "Amazon DynamoDB",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "us-east-1",
    "goal": "Goal: Decision matrix mapping OLAP analytics (Redshift) vs. OLTP relational (RDS) vs. Key-Value NoSQL (DynamoDB).",
    "status": "published",
    "tags": [
      "Amazon DynamoDB",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Amazon Redshift (OLAP)",
        "body": "Petabyte data warehouse optimized for complex SQL analytics, columnar storage, and business intelligence reporting over historical datasets."
      },
      {
        "id": "concept-2",
        "title": "Amazon RDS / Aurora (OLTP)",
        "body": "Relational transactional database optimized for row-by-row CRUD operations, multi-table SQL `JOIN` queries, and ACID compliance."
      },
      {
        "id": "concept-3",
        "title": "Amazon DynamoDB (NoSQL)",
        "body": "Serverless key-value NoSQL database optimized for ultra-fast single-digit millisecond reads and writes at massive scale."
      },
      {
        "id": "concept-4",
        "title": "Data Ingestion Patterns",
        "body": "Redshift: Bulk parallel `COPY` from S3. RDS: Relational SQL `INSERT`/`UPDATE` transactions. DynamoDB: `PutItem` / `BatchWriteItem` API calls."
      },
      {
        "id": "concept-5",
        "title": "Redshift vs RDS vs DynamoDB Decision Matrix",
        "body": "FeatureAmazon RedshiftAmazon RDS / AuroraAmazon DynamoDBWorkload classificationOLAP Data WarehouseOLTP Transactional DatabaseKey-Value / Document NoSQLData layoutColumnar storageRow-oriented storageKey-Value SSD partitionsPrimary query pattern`SUM`, `COUNT`, `AVG`, `GROUP BY` aggregations`SELECT`, `INSERT`, `UPDATE` with multi-table `JOIN`s`GetItem` and `Query` by Partition KeyData scaleTerabytes to PetabytesGigabytes to Terabytes (Aurora up to 128TB)Virtually unlimited (Auto-partitioned)Latency profileSeconds to minutes (Complex queries)MillisecondsSingle-digit milliseconds (Primary ingestionParallel `COPY` from S3SQL `INSERT` transactions`PutItem` API calls"
      }
    ],
    "whyItMatters": "This matters because exam scenario questions requiring high-throughput data warehousing vs. online transactions are a constant focus on SAA-C03.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Amazon Redshift",
        "value": "OLAP Petabyte Columnar Analytics"
      },
      {
        "label": "Amazon RDS / Aurora",
        "value": "OLTP Relational SQL Transactions"
      },
      {
        "label": "Amazon DynamoDB",
        "value": "Single-Digit MS Key-Value NoSQL"
      },
      {
        "label": "Selection Driver",
        "value": "Workload type, query complexity, and scale"
      }
    ],
    "costWarning": "DynamoDB capacity, storage, backup, Streams, Global Tables, and data-transfer charges may apply depending on configuration.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Review IAM Administration Permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Ensure your identity has permissions to view RDS, Redshift, and DynamoDB resources."
          }
        ],
        "note": "Read-only access is sufficient for evaluation.",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Evaluate OLAP Analytics vs OLTP Processing",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Select Amazon Redshift for business intelligence, data warehousing, and complex SQL reporting over petabytes."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Understand that Redshift columnar storage reads only query-relevant columns, dramatically reducing I/O during aggregations."
          }
        ],
        "note": "Redshift is designed for analytical aggregation.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Evaluate Relational SQL vs Key-Value NoSQL",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Select Amazon RDS / Aurora for transactional application databases requiring ACID compliance and table `JOIN`s."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select Amazon DynamoDB for high-throughput, single-digit millisecond key-value storage at any scale."
          }
        ],
        "note": "RDS/Aurora provide full relational SQL; DynamoDB provides ultra-fast NoSQL.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Master SAA-C03 Database Decision Matrix",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Use parallel `COPY` command from S3 for Redshift bulk data loading."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Use SQL `INSERT` transactions for RDS/Aurora."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Use `PutItem` / `BatchWriteItem` API calls for DynamoDB."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Match scenario keywords (OLAP, OLTP, NoSQL) to their corresponding AWS database service."
          }
        ],
        "note": "Keyword matching ensures fast, accurate exam responses.",
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
        "title": "Describe Active Redshift Clusters",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws redshift describe-clusters --region us-east-1"
          }
        ],
        "note": "Lists Redshift data warehouse clusters.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon DynamoDB configuration verified in Amazon DynamoDB."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any Global Table replicas or secondary indexes if applicable."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the DynamoDB table and associated CloudWatch alarms."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Amazon Redshift",
        "body": "Petabyte OLAP data warehouse. Columnar storage, MPP SQL analytics, COPY from S3."
      },
      {
        "id": "cs-2",
        "title": "Amazon RDS / Aurora",
        "body": "OLTP relational SQL databases. Multi-table JOINs, ACID transactions, row-oriented storage."
      },
      {
        "id": "cs-3",
        "title": "Amazon DynamoDB",
        "body": "Serverless key-value NoSQL. Single-digit millisecond latency, auto-scaling horizontal partitions."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Choosing RDS for Petabyte Analytics",
        "body": "Do NOT select RDS for petabyte-scale analytical queries. RDS will suffer severe I/O degradation. Choose **Amazon Redshift**."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Data Warehouse vs Transactional DB",
        "body": "If a scenario asks for business intelligence reporting on historical data, choose Redshift. If it asks for e-commerce order processing, choose RDS/Aurora."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon DynamoDB concepts and multi-AZ / replication design in Amazon DynamoDB."
      }
    ],
    "memoryHook": "Redshift = Analytics & Columnar | RDS = Transactions & Rows | DynamoDB = Fast Key-Value",
    "flashcardSetId": null
  }
];
