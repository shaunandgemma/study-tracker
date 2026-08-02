/** Amazon ECS Tasks (SAA-C03) */
export const ECS_TASKS = [
  {
    "id": "task-saa-ecs-iam-task-roles-vs-task-execution-roles-in-amazon-ecs-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-ecs",
    "title": "IAM Task Roles vs Task Execution Roles in Amazon ECS",
    "slug": "iam-task-roles-vs-task-execution-roles-in-amazon-ecs",
    "service": "Amazon ECS",
    "feature": "Amazon ECS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "us-east-1",
    "goal": "Goal: Implement secure access control in Amazon ECS by distinguishing between infrastructure-level execution roles and application-level task roles.",
    "status": "published",
    "tags": [
      "Amazon ECS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "ECS Task Execution Role (executionRoleArn)",
        "body": "Grants the ECS Container Agent permission to pull container images from ECR, retrieve parameters from Secrets Manager, and stream logs to CloudWatch."
      },
      {
        "id": "concept-2",
        "title": "ECS Task Role (taskRoleArn)",
        "body": "Grants the Container Application Code inside the container permission to call AWS APIs (e.g. read S3 objects, write to DynamoDB tables)."
      },
      {
        "id": "concept-3",
        "title": "Least Privilege Role Isolation",
        "body": "Separating agent permissions from application code permissions prevents containers from exploiting ECS infrastructure privileges."
      },
      {
        "id": "concept-4",
        "title": "ECS Task Execution Role vs Task Role Comparison",
        "body": "Role AttributeTask Execution Role (executionRoleArn)Task Role (taskRoleArn)Used byECS Container Agent (Infrastructure)Container Application Code (App Level)Primary purposePull ECR images, write CloudWatch logs, fetch Secrets Manager secretsCall AWS SDK APIs (Read S3, write DynamoDB, publish SQS)Managed policyAmazonECSTaskExecutionRolePolicyCustom policy (e.g. AmazonS3ReadOnlyAccess)Trust policy principalecs-tasks.amazonaws.comecs-tasks.amazonaws.comKey exam question keywordECR image pull / CloudWatch log stream errorApplication AWS SDK permission denied error"
      }
    ],
    "whyItMatters": "This matters because SAA-C03 heavily tests the distinction between executionRoleArn (infrastructure level for agent operations) and taskRoleArn (application code level for container AWS API calls).",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1"
      },
      {
        "label": "Execution Role",
        "value": "ecsTaskExecutionRole"
      },
      {
        "label": "Task Role",
        "value": "saa-ecs-app-task-role"
      },
      {
        "label": "Test S3 Bucket",
        "value": "saa-ecs-app-data-[account-id]"
      },
      {
        "label": "Log Group",
        "value": "/ecs/saa-task-role-lab"
      }
    ],
    "costWarning": "ECS container instances, Fargate tasks, load balancers, NAT Gateways, logs and data-transfer charges may apply.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate container service permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate container service permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the grouped permissions below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity IAM permissions: iam:CreateRole, iam:AttachRolePolicy, iam:PassRole ECS permissions: ecs:RegisterTaskDefinition, ecs:RunTask Cleanup: iam:DetachRolePolicy, iam:DeleteRole, s3:DeleteBucket",
        "warning": "Do not leave broad admin access or long-term access keys in real company accounts.",
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Create the ECS Task Execution Role (executionRoleArn)",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open IAM Console -> Choose Roles -> Click Create role."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Select Trusted entity type AWS service -> Use case Elastic Container Service -> Select Elastic Container Service Task."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Choose Next."
          },
          {
            "id": "console-step-2-item-4",
            "text": "Search for and attach managed policy AmazonECSTaskExecutionRolePolicy."
          },
          {
            "id": "console-step-2-item-5",
            "text": "Set Role name to ecsTaskExecutionRole -> Choose Create role."
          }
        ],
        "note": "This role allows the ECS Container Agent to pull images from ECR and send logs to CloudWatch.",
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create the ECS Task Role (taskRoleArn)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In IAM Roles, click Create role."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select Trusted entity type AWS service -> Select Elastic Container Service Task."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Next."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Search for and attach managed policy AmazonS3ReadOnlyAccess."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Set Role name to saa-ecs-app-task-role -> Choose Create role."
          }
        ],
        "note": "This role grants container application code permission to read objects from S3.",
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create Test S3 Data Bucket",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open Amazon S3 -> Choose Create bucket."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set Bucket name to saa-ecs-app-data-[account-id] in us-east-1."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Upload a sample test file app-data.json into the bucket."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Choose Create bucket."
          }
        ],
        "note": "This S3 bucket will be accessed by the container application code via Task Role credentials.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Register ECS Task Definition Mapping Both Roles",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open Amazon ECS -> Click Task definitions -> Choose Create new task definition."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Set Task definition family to saa-roles-task-def."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select Launch type AWS Fargate -> Set Network mode to awsvpc."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Set Task execution role to ecsTaskExecutionRole."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Set Task role to saa-ecs-app-task-role."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Add Container: Name aws-cli-app -> Image amazon/aws-cli:latest -> Command s3,ls,s3://saa-ecs-app-data-[account-id]."
          },
          {
            "id": "console-step-5-item-7",
            "text": "Under Logging: Enable CloudWatch logs under log group /ecs/saa-task-role-lab."
          },
          {
            "id": "console-step-5-item-8",
            "text": "Choose Create."
          }
        ],
        "note": "Mapping both roles demonstrates the clear boundary between executionRoleArn and taskRoleArn.",
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Run ECS Task and Verify Log Streaming and S3 Access",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Open Amazon ECS -> Select your cluster -> Choose Run new task."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select Task definition saa-roles-task-def -> Launch type Fargate."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Select your VPC and public subnet -> Choose Create."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Wait for task execution status to reach Stopped (completed)."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Open CloudWatch Console -> Open Log group /ecs/saa-task-role-lab."
          },
          {
            "id": "console-step-6-item-6",
            "text": "Verify log stream displays successful output from aws s3 ls."
          }
        ],
        "note": "The task execution role handled log creation; the task role handled the S3 list API request.",
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
            "text": "Deregister Task definition saa-roles-task-def."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Delete test S3 bucket saa-ecs-app-data-[account-id]."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Open IAM Roles -> Delete saa-ecs-app-task-role and ecsTaskExecutionRole (if created for lab)."
          }
        ],
        "note": null,
        "warning": "Delete test S3 buckets and task definitions to clean up your workspace.",
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
            "text": "REGION=us-east-1\nEXEC_ROLE=ecsTaskExecutionRole\nTASK_ROLE=saa-ecs-app-task-role"
          }
        ],
        "note": "Sets CLI variable names for IAM roles.",
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Create ECS Task Execution Role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws iam create-role --role-name $EXEC_ROLE --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"ecs-tasks.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}'\naws iam attach-role-policy --role-name $EXEC_ROLE --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
          }
        ],
        "note": "Creates execution role for container agent infrastructure tasks.",
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create ECS Task Role for S3 Application Access",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws iam create-role --role-name $TASK_ROLE --assume-role-policy-document '{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"ecs-tasks.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}'\naws iam attach-role-policy --role-name $TASK_ROLE --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
          }
        ],
        "note": "Creates task role for container application code AWS API access.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Register ECS Task Definition with Both Roles",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws ecs register-task-definition --family saa-roles-task-def --execution-role-arn arn:aws:iam::ACCOUNT_ID:role/$EXEC_ROLE --task-role-arn arn:aws:iam::ACCOUNT_ID:role/$TASK_ROLE --network-mode awsvpc --requires-compatibilities FARGATE --cpu 256 --memory 512 --container-definitions '[{\"name\":\"app\",\"image\":\"amazon/aws-cli:latest\",\"command\":[\"s3\",\"ls\"]}]' --region $REGION"
          }
        ],
        "note": "Maps executionRoleArn and taskRoleArn in Task Definition.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Tear down IAM roles and Task Definition",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws iam detach-role-policy --role-name $EXEC_ROLE --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy\naws iam delete-role --role-name $EXEC_ROLE\naws iam detach-role-policy --role-name $TASK_ROLE --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess\naws iam delete-role --role-name $TASK_ROLE"
          }
        ],
        "note": "Detaches policies and deletes IAM roles.",
        "warning": null,
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon ECS configuration verified in Amazon ECS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Scale the ECS service desired count to 0 and delete the service."
      },
      {
        "id": "cleanup-2",
        "text": "Deregister task definition revisions and delete the ECS cluster."
      },
      {
        "id": "cleanup-3",
        "text": "Delete IAM task roles, execution roles, and CloudWatch Log Groups."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Task Execution Role (executionRoleArn)",
        "body": "Used by ECS Agent to pull ECR images, fetch Secrets Manager parameters, and stream logs to CloudWatch."
      },
      {
        "id": "cs-2",
        "title": "Task Role (taskRoleArn)",
        "body": "Used by Container Application Code to call AWS SDK APIs (S3, DynamoDB, SQS, Kinesis)."
      },
      {
        "id": "cs-3",
        "title": "Least Privilege Security",
        "body": "Always grant container applications their own isolated Task Role instead of using EC2 instance profiles."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Unable to Pull Image from ECR",
        "body": "Verify that `executionRoleArn` is attached and contains `AmazonECSTaskExecutionRolePolicy` permissions."
      },
      {
        "id": "ts-2",
        "title": "Application Code S3 Access Denied",
        "body": "Verify that `taskRoleArn` is attached to the task definition and contains S3 permissions."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "executionRoleArn vs taskRoleArn Traps",
        "body": "If an app running inside a container gets `AccessDenied` reading S3, updating `executionRoleArn` will NOT fix it. You MUST update `taskRoleArn`."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master Amazon ECS concepts and container orchestration patterns in Amazon ECS."
      }
    ],
    "memoryHook": "Execution Role = Agent pulls images & logs | Task Role = Application reads S3 & DBs",
    "flashcardSetId": null
  }
];
