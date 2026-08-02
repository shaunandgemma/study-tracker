/** AWS Step Functions Tasks (SAA-C03) */
export const STEP_FUNCTIONS_TASKS = [
  {
    "id": "task-saa-step-functions-state-machine-design-010",
    "examCode": "aws-saa-c03",
    "topicId": "topic-step-functions",
    "title": "State Machine Design",
    "slug": "state-machine-design",
    "service": "AWS Step Functions",
    "feature": "AWS Step Functions",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Build an AWS Step Functions visual state machine workflow blueprint using standard orchestration and retry handling logic.",
    "status": "published",
    "tags": [
      "AWS Step Functions",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for AWS Step Functions."
      },
      {
        "id": "concept-2",
        "title": "Resiliency Focus (Domain 2)",
        "body": "Learn how decoupling and managed event sources isolate errors and scale automatically."
      },
      {
        "id": "concept-3",
        "title": "Cost Optimization (Domain 4)",
        "body": "Identify billing traps, limit capacities, and cancel provisioned actions to maintain a $0 baseline."
      }
    ],
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like AWS Step Functions.",
    "values": [
      {
        "label": "AWS Region",
        "value": "us-east-1 (N. Virginia) or us-west-2 (Oregon)"
      },
      {
        "label": "Billing Limit Policy",
        "value": "Canceled wizards and smallest default memory sizing"
      }
    ],
    "costWarning": "Workflow state-transition or execution-duration charges may apply depending on workflow type. Delete state machines after testing.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Set up the lab user and permissions",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with an IAM user, IAM role, or IAM Identity Center permission set."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate serverless permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate serverless permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the service permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Step Functions operations: states:CreateStateMachine, states:StartExecution, states:DeleteStateMachine, states:DescribeStateMachine, lambda:InvokeFunction",
        "warning": null,
        "expectedResult": "Step 1 completed successfully."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Start from AWS login",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Sign in to the AWS Management Console."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use the Region eu-west-2 (Europe London) or your preferred standard Region for these labs."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Confirm that your console theme is set to dark or standard preference."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 2 completed successfully."
      },
      {
        "id": "console-step-3",
        "number": 3,
        "title": "Create State Machine in Workflow Studio",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Navigate to AWS Step Functions console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click Create state machine."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Choose Design your workflow visually (Workflow Studio)."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep Type set to Standard and click Next."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Drag Lambda Invoke task",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "In the left Actions list, search for Lambda Invoke."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Drag the Lambda Invoke block directly into the visual workflow timeline."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select the task and choose your saa-test-compute function in the configuration sidebar."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Configure Catch & Retry error handling",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select the Error handling tab in the task configuration panel."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Review the default Retry and Catch settings designed for fault tolerance."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Click Create at the top right, accept IAM policy generation, and click Create state machine."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean up State Machine",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select the created state machine and click Delete."
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
        "title": "Check your AWS identity",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          }
        ],
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create Step Functions State Machine workflow",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws stepfunctions create-state-machine --name serverless-workflow-core --definition '{\"StartAt\":\"InvokeLambda\",\"States\":{\"InvokeLambda\":{\"Type\":\"Task\",\"Resource\":\"arn:aws:lambda:...\",\"End\":true}}}' --role-arn <ROLE_ARN>"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Delete State Machine and clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws stepfunctions delete-state-machine --state-machine-arn <SM_ARN>"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes serverless functions, APIs, state machines, rules, queues, or topics.",
        "expectedResult": "CLI command step 3 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Step Functions configuration verified in AWS Step Functions."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Stop any running state machine test executions."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Step Functions state machine and associated IAM role."
      }
    ],
    "cheatSheet": [
      {
        "id": "cs-1",
        "title": "Domain 2: Resiliency",
        "body": "Decouple microservices using SQS Standard or SQS FIFO queues. Add DLQs and set visibility timeouts appropriately."
      },
      {
        "id": "cs-2",
        "title": "Domain 4: Cost Optimization",
        "body": "Configure pay-per-request (On-Demand) billing modes for DynamoDB tables and minimize memory footprint allocations on Lambda functions."
      }
    ],
    "troubleshooting": [
      {
        "id": "ts-1",
        "title": "Validation Error",
        "body": "Verify that your IAM user has sufficient permissions and that the resource names are unique in your AWS account."
      }
    ],
    "examTraps": [
      {
        "id": "trap-1",
        "title": "Billing Traps",
        "body": "Provisioned Concurrency and Kinesis Shards cost money immediately. NAT Gateways have high fixed hourly fees."
      }
    ],
    "examTips": [
      {
        "id": "tip-1",
        "text": "SAA-C03: Master AWS Step Functions concepts and serverless integration patterns in AWS Step Functions."
      }
    ],
    "memoryHook": "Remember that AWS Step Functions is a core serverless component.",
    "flashcardSetId": null
  }
];
