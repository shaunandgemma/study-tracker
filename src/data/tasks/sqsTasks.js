/** Amazon SQS Tasks (SAA-C03) */
export const SQS_TASKS = [
  {
    "id": "task-saa-sqs-asynchronous-buffering-005",
    "examCode": "aws-saa-c03",
    "topicId": "topic-sqs",
    "title": "Asynchronous Buffering",
    "slug": "asynchronous-buffering",
    "service": "Amazon SQS",
    "feature": "Amazon SQS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Provision an asynchronous Amazon SQS Standard queue, evaluate processing windows by adjusting Visibility Timeout boundaries, and evaluate it as an elastic buffer.",
    "status": "published",
    "tags": [
      "Amazon SQS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon SQS."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon SQS.",
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
        "note": "Identity check: sts:GetCallerIdentity SQS operations: sqs:CreateQueue, sqs:SendMessage, sqs:ReceiveMessage, sqs:DeleteMessage, sqs:SetQueueAttributes, sqs:DeleteQueue",
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
        "title": "Create the SQS Standard queue",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the search bar, type SQS and select Simple Queue Service."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Click Create queue."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep Type set to the default: Standard."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For Name, enter order-ingestion-buffer."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Adjust the Visibility Timeout",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Scroll to the Configuration panel."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Locate Visibility Timeout and change the value from 30 seconds to 90 seconds."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Keep all other settings (Retention, Delivery delay) at their defaults."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Click Create queue at the bottom of the page."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Transmit and test message Visibility",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "In the SQS details dashboard, click Send and receive messages."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Type a dummy message string into the message body input area."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Click Send message."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Verify that the Messages available metric in the queue overview displays 1."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean up SQS resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Return to the main SQS queues list."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select the checkbox for order-ingestion-buffer."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Click Delete and confirm deletion."
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
        "title": "Create SQS Standard Queue with visibility configuration",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws sqs create-queue --queue-name order-ingestion-buffer --attributes VisibilityTimeout=90"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Clean up SQS queue",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws sqs delete-queue --queue-url <QUEUE_URL>"
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
        "text": "Amazon SQS configuration verified in Amazon SQS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the SQS queue and associated Dead-Letter Queue (DLQ)."
      },
      {
        "id": "cleanup-2",
        "text": "Delete related Lambda event-source mappings and queue policies."
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
        "text": "SAA-C03: Master Amazon SQS concepts and serverless integration patterns in Amazon SQS."
      }
    ],
    "memoryHook": "Remember that Amazon SQS is a core serverless component.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-sqs-sequential-processing-006",
    "examCode": "aws-saa-c03",
    "topicId": "topic-sqs",
    "title": "Sequential Processing",
    "slug": "sequential-processing",
    "service": "Amazon SQS",
    "feature": "Amazon SQS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Build an SQS FIFO queue enforcing exact single-consumer ordered transactions and configure message deduplication settings.",
    "status": "published",
    "tags": [
      "Amazon SQS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon SQS."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon SQS.",
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
        "note": "Identity check: sts:GetCallerIdentity SQS operations: sqs:CreateQueue, sqs:SendMessage, sqs:ReceiveMessage, sqs:DeleteMessage, sqs:SetQueueAttributes, sqs:DeleteQueue",
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
        "title": "Create the SQS FIFO queue",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the Amazon SQS console and click Create queue."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select FIFO as the queue type."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For Name, enter order-pipeline.fifo (note that SQS enforces the .fifo suffix)."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure Deduplication settings",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Locate the Content-based deduplication toggle switch."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Turn it on to auto-hash message payloads using SHA-256 for 5-minute deduplication windows."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Click Create queue."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Review the queue details page, noting the specific Message Group ID and Message Deduplication ID constraints required for FIFO delivery."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Clean up FIFO queue",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select order-pipeline.fifo from the SQS queue list."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Click Delete, type delete, and confirm."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
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
        "title": "Create SQS FIFO Queue with content-based deduplication",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws sqs create-queue --queue-name order-pipeline.fifo --attributes FifoQueue=true,ContentBasedDeduplication=true"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Clean up FIFO SQS queue",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws sqs delete-queue --queue-url <QUEUE_URL>"
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
        "text": "Amazon SQS configuration verified in Amazon SQS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the SQS queue and associated Dead-Letter Queue (DLQ)."
      },
      {
        "id": "cleanup-2",
        "text": "Delete related Lambda event-source mappings and queue policies."
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
        "text": "SAA-C03: Master Amazon SQS concepts and serverless integration patterns in Amazon SQS."
      }
    ],
    "memoryHook": "Remember that Amazon SQS is a core serverless component.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-sqs-fault-isolation-008",
    "examCode": "aws-saa-c03",
    "topicId": "topic-sqs",
    "title": "Fault Isolation",
    "slug": "fault-isolation",
    "service": "Amazon SQS",
    "feature": "Amazon SQS",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Set up a dedicated SQS Dead-Letter Queue (DLQ) to isolate message exceptions and map it as a target using an explicit max receive count metric.",
    "status": "published",
    "tags": [
      "Amazon SQS",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon SQS."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon SQS.",
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
        "note": "Identity check: sts:GetCallerIdentity SQS operations: sqs:CreateQueue, sqs:SendMessage, sqs:ReceiveMessage, sqs:DeleteMessage, sqs:SetQueueAttributes, sqs:DeleteQueue",
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
        "title": "Create SQS Dead-Letter Queue (DLQ)",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the Amazon SQS console and click Create queue."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Keep type set to Standard."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name the queue poison-pill-deadletter."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Click Create queue."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Assign DLQ Redrive policy to main queue",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Go back to SQS queues index and select your primary order-ingestion-buffer queue."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Click Edit."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Scroll to the Dead-letter queue section and toggle it to Enabled."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select your newly created poison-pill-deadletter queue as the DLQ target."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Set the Maximum receives threshold to 3."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Click Save."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Clean up queues",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Edit the main queue to disable the Dead-letter queue mapping."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Delete both the main queue and the DLQ queue."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
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
        "title": "Create SQS Dead-Letter Queue",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws sqs create-queue --queue-name poison-pill-deadletter"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Assign DLQ Redrive Policy parameters",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws sqs set-queue-attributes --queue-url <MAIN_QUEUE_URL> --attributes '{\"RedrivePolicy\":\"{\\\"deadLetterTargetArn\\\":\\\"<DLQ_ARN>\\\",\\\"maxReceiveCount\\\":\\\"3\\\"}\"}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Clean up queues programmatically",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws sqs delete-queue --queue-url <QUEUE_URL>"
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
        "text": "Amazon SQS configuration verified in Amazon SQS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the SQS queue and associated Dead-Letter Queue (DLQ)."
      },
      {
        "id": "cleanup-2",
        "text": "Delete related Lambda event-source mappings and queue policies."
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
        "text": "SAA-C03: Master Amazon SQS concepts and serverless integration patterns in Amazon SQS."
      }
    ],
    "memoryHook": "Remember that Amazon SQS is a core serverless component.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-sqs-payload-management-014",
    "examCode": "aws-saa-c03",
    "topicId": "topic-sqs",
    "title": "Payload Management",
    "slug": "payload-management",
    "service": "Amazon SQS",
    "feature": "Amazon SQS",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Walk through the architectural design mechanics of the Amazon SQS Extended Client Library pattern to overcome hard messaging payload capacity limitations.",
    "status": "published",
    "tags": [
      "Amazon SQS",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon SQS."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon SQS.",
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
        "note": "Identity check: sts:GetCallerIdentity SQS operations: sqs:CreateQueue, sqs:SendMessage, sqs:ReceiveMessage, sqs:DeleteMessage, sqs:SetQueueAttributes, sqs:DeleteQueue",
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
        "title": "Create S3 Payload vault",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open S3 console and click Create bucket."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Name the bucket with a unique prefix (e.g. saa-payload-vault-[account-id])."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Create bucket."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Verify SQS message size limits",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Open the SQS console and choose your order-ingestion-buffer queue."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Review the maximum message size parameter, noting it is hard-capped at 256 KB."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Understand pointer mapping architecture",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "To send payloads larger than 256 KB, the client library uploads the raw payload to S3 first."
          },
          {
            "id": "console-step-5-item-2",
            "text": "The client library then sends an SQS message containing only the S3 bucket name and key path pointer."
          },
          {
            "id": "console-step-5-item-3",
            "text": "The receiver client automatically pulls the S3 pointer, retrieves the payload from S3, and processes it."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean up resources",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete the S3 payload bucket and standard queue."
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
        "title": "Create S3 Payload Vault Bucket for SQS extended client reference",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws s3 mb s3://saa-payload-vault-<YOUR_ACCOUNT_ID>"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "Amazon SQS configuration verified in Amazon SQS."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the SQS queue and associated Dead-Letter Queue (DLQ)."
      },
      {
        "id": "cleanup-2",
        "text": "Delete related Lambda event-source mappings and queue policies."
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
        "text": "SAA-C03: Master Amazon SQS concepts and serverless integration patterns in Amazon SQS."
      }
    ],
    "memoryHook": "Remember that Amazon SQS is a core serverless component.",
    "flashcardSetId": null
  }
];
