/** Amazon EventBridge Tasks (SAA-C03) */
export const EVENTBRIDGE_TASKS = [
  {
    "id": "task-saa-eventbridge-event-orchestration-009",
    "examCode": "aws-saa-c03",
    "topicId": "topic-eventbridge",
    "title": "Event Orchestration",
    "slug": "event-orchestration",
    "service": "Amazon EventBridge",
    "feature": "Amazon EventBridge",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Construct an Amazon EventBridge tracking rule to catch real-time infrastructure state transformations and route events to a target compute unit.",
    "status": "published",
    "tags": [
      "Amazon EventBridge",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon EventBridge."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon EventBridge.",
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
    "costWarning": "Event ingestion, delivery, Scheduler, Pipes, archive and replay charges may apply. Complete cleanup promptly.",
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
        "note": "Identity check: sts:GetCallerIdentity EventBridge operations: events:PutRule, events:PutTargets, events:DeleteRule, events:RemoveTargets, lambda:InvokeFunction",
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
        "title": "Create the EventBridge monitoring rule",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the Amazon EventBridge console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select Buses → Rules and click Create rule."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For Name, enter catch-ec2-state-adjustments."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Keep Event bus set to default."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Select Rule with an event pattern and click Next."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Define EC2 State Change event pattern",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Under Event source, select AWS services."
          },
          {
            "id": "console-step-4-item-2",
            "text": "In the Event pattern dropdowns, choose EC2 as the AWS service."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Choose EC2 Instance State-change Notification as the Event type."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Click Next."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Attach Lambda execution target",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "On the Select target page, choose AWS service."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Select Lambda function from the target type dropdown."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Choose your saa-test-compute function."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Click Next through tags and click Create rule."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean up EventBridge rule",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Select the rule catch-ec2-state-adjustments."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Click Delete and confirm."
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
        "title": "Create EventBridge infrastructure state monitoring rule",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws events put-rule --name catch-ec2-state-adjustments --event-pattern '{\"source\":[\"aws.ec2\"],\"detail-type\":[\"EC2 Instance State-change Notification\"]}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Attach Lambda function target",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws events put-targets --rule catch-ec2-state-adjustments --targets '{\"Id\":\"1\",\"Arn\":\"<LAMBDA_ARN>\"}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Clean up EventBridge rule and target",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws events remove-targets --rule catch-ec2-state-adjustments --ids \"1\" && aws events delete-rule --name catch-ec2-state-adjustments"
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
        "text": "Amazon EventBridge configuration verified in Amazon EventBridge."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Remove all rule targets and delete the EventBridge rule."
      },
      {
        "id": "cleanup-2",
        "text": "Delete custom event buses, schedules, or DLQs if created for the lab."
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
        "text": "SAA-C03: Master Amazon EventBridge concepts and serverless integration patterns in Amazon EventBridge."
      }
    ],
    "memoryHook": "Remember that Amazon EventBridge is a core serverless component.",
    "flashcardSetId": null
  }
];
