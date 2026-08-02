/** Amazon SNS Tasks (SAA-C03) */
export const SNS_TASKS = [
  {
    "id": "task-saa-sns-pub-sub-messaging-007",
    "examCode": "aws-saa-c03",
    "topicId": "topic-sns",
    "title": "Pub/Sub Messaging",
    "slug": "pub-sub-messaging",
    "service": "Amazon SNS",
    "feature": "Amazon SNS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Design an Amazon SNS topic and attach an SQS queue subscription utilizing custom subscription filter policies to drop irrelevant data payloads at the edge.",
    "status": "published",
    "tags": [
      "Amazon SNS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon SNS."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon SNS.",
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
    "costWarning": "Request, data-transfer, delivery and connected-service charges may apply. Delete topics, queues, and subscriptions promptly.",
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
        "note": "Identity check: sts:GetCallerIdentity SNS operations: sns:CreateTopic, sns:Subscribe, sns:Publish, sns:DeleteTopic, sqs:CreateQueue",
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
        "title": "Create the SNS Standard topic",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the search bar, type SNS and select Simple Notification Service."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Navigate to Topics and click Create topic."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select Standard type."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Name the topic broadcast-events."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Click Create topic."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Subscribe SQS queue target",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Inside the broadcast-events topic dashboard, click Create subscription."
          },
          {
            "id": "console-step-4-item-2",
            "text": "For Protocol, select Amazon SQS."
          },
          {
            "id": "console-step-4-item-3",
            "text": "In the Endpoint field, paste the ARN of your SQS Standard queue from Task 5."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Configure SNS message filter policy",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Expand the Subscription filter policy accordion section."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Enable the policy."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Enter the JSON matching policy: {\"transaction_type\": [\"premium\"]}."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Click Create subscription."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean up SNS resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select the subscription in the list and click Delete."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select the topic broadcast-events and click Delete."
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
        "title": "Create SNS Topic",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws sns create-topic --name broadcast-events"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Subscribe SQS Queue to SNS Topic with filter policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws sns subscribe --topic-arn <SNS_ARN> --protocol sqs --notification-endpoint <SQS_ARN> --attributes '{\"FilterPolicy\": \"{\\\"transaction_type\\\":[\\\"premium\\\"]}\"}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Delete SNS Topic and clean up",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws sns delete-topic --topic-arn <SNS_ARN>"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes serverless functions, APIs, state machines, rules, queues, or topics.",
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon SNS configuration verified in Amazon SNS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete all SNS topic subscriptions."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the SNS topic and associated SQS queue or policy."
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
        "text": "SAA-C03: Master Amazon SNS concepts and serverless integration patterns in Amazon SNS."
      }
    ],
    "memoryHook": "Remember that Amazon SNS is a core serverless component.",
    "flashcardSetId": null
  }
];
