/** AWS Lambda Tasks (SAA-C03) */
export const LAMBDA_TASKS = [
  {
    "id": "task-saa-lambda-function-basics-001",
    "examCode": "aws-saa-c03",
    "topicId": "topic-lambda",
    "title": "Function Basics",
    "slug": "function-basics",
    "service": "AWS Lambda",
    "feature": "AWS Lambda",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Create an AWS Lambda function from scratch, evaluate memory scaling limits, write an ephemeral return string, and execute a manual mock event invocation.",
    "status": "published",
    "tags": [
      "AWS Lambda",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for AWS Lambda."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like AWS Lambda.",
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
    "costWarning": "Lambda request, duration, provisioned-concurrency, networking and connected-service charges may apply. Complete cleanup promptly after testing.",
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
        "note": "Identity check: sts:GetCallerIdentity Lambda operations: lambda:CreateFunction, lambda:InvokeFunction, lambda:GetFunction, lambda:UpdateFunctionCode, lambda:UpdateFunctionConfiguration, lambda:DeleteFunction IAM setup: iam:CreateRole, iam:PassRole",
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
        "title": "Create the Lambda function",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the search bar at the top, type Lambda and select it from the services list."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Choose Create function."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Keep the default selection: Author from scratch."
          },
          {
            "id": "console-step-3-item-4",
            "text": "For Function name, enter saa-test-compute."
          },
          {
            "id": "console-step-3-item-5",
            "text": "For Runtime, choose the latest stable version of Python 3.11."
          },
          {
            "id": "console-step-3-item-6",
            "text": "Keep Architecture set to x86_64."
          },
          {
            "id": "console-step-3-item-7",
            "text": "Expand the Change default execution role section."
          },
          {
            "id": "console-step-3-item-8",
            "text": "Select Create a new role with basic Lambda permissions."
          },
          {
            "id": "console-step-3-item-9",
            "text": "Choose Create function at the bottom of the page."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Modify and deploy the function code",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Locate the Code source file tree pane inside the function overview tab."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Double-click the main handler file (e.g., lambda_function.py) to open it."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Replace the default return payload message with: 'Invocations running at zero cost under Free Tier'."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Click the Deploy button above the file tree to save and publish your modifications."
          }
        ],
        "note": "Always click Deploy to make your code changes active. Saving the file is not enough.",
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Configure a mock test event",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Click the Test tab next to the Code panel."
          },
          {
            "id": "console-step-5-item-2",
            "text": "For Event action, keep Create new event selected."
          },
          {
            "id": "console-step-5-item-3",
            "text": "For Event name, enter mockClickstreamEvent."
          },
          {
            "id": "console-step-5-item-4",
            "text": "For Template, keep hello-world selected."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Leave the default dummy JSON payload intact."
          },
          {
            "id": "console-step-5-item-6",
            "text": "Choose Save at the top right of the Test configuration panel."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Execute and verify the mock invocation",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "With your newly created mockClickstreamEvent selected, click the orange Test button."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Wait for the execution to complete and locate the Execution result panel."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Expand the result details dropdown to view logs and execution metrics."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Verify that the status is Succeeded and the response body displays your custom string."
          },
          {
            "id": "console-step-6-item-5",
            "text": "Analyze the billing metrics, noting the Duration, Billed Duration, Memory Size (128 MB), and Max Memory Used."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 6 completed successfully."
      },
      {
        "id": "console-step-7",
        "number": 7,
        "title": "Tear down resources",
        "instructions": [
          {
            "id": "console-step-7-item-1",
            "text": "Go back to the top of your function's configuration page."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Choose Actions → Delete function."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Type delete to confirm deletion."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Choose Delete."
          },
          {
            "id": "console-step-7-item-5",
            "text": "Open the IAM Console, navigate to Roles, and delete the execution role that Lambda created for your function."
          }
        ],
        "note": null,
        "warning": "Do not delete active company roles. Verify the role name matches the lambda-basic-execution role generated during function creation.",
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Create execution IAM role",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws iam create-role --role-name lambda-basic-execution --assume-role-policy-document '{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Principal\": {\n        \"Service\": \"lambda.amazonaws.com\"\n      },\n      \"Action\": \"sts:AssumeRole\"\n    }\n  ]\n}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Attach execution role policy",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws iam attach-role-policy --role-name lambda-basic-execution --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Create Lambda function",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws lambda create-function --function-name saa-test-compute --runtime python3.11 --role <YOUR_ROLE_ARN> --handler lambda_function.lambda_handler --zip-file fileb://function.zip"
          }
        ],
        "note": "Replace with the role ARN from Step 1. Ensure function.zip contains your code.",
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      },
      {
        "id": "cli-step-5",
        "number": 5,
        "title": "Invoke the function",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-5-cmd-1",
            "language": "bash",
            "text": "aws lambda invoke --function-name saa-test-compute --payload '{}' output.json"
          }
        ],
        "note": "Verify output.json contains 'Invocations running at zero cost under Free Tier'.",
        "warning": null,
        "expectedResult": "CLI command step 5 executed successfully."
      },
      {
        "id": "cli-step-6",
        "number": 6,
        "title": "Clean up resources",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-6-cmd-1",
            "language": "bash",
            "text": "aws lambda delete-function --function-name saa-test-compute\naws iam detach-role-policy --role-name lambda-basic-execution --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole\naws iam delete-role --role-name lambda-basic-execution"
          }
        ],
        "note": null,
        "warning": "Destructive Command Warning: This command permanently deletes serverless functions, APIs, state machines, rules, queues, or topics.",
        "expectedResult": "CLI command step 6 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Lambda configuration verified in AWS Lambda."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any event-source mappings, triggers, or alias routing configurations."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the AWS Lambda function and associated CloudWatch Log Group."
      },
      {
        "id": "cleanup-3",
        "text": "Delete the IAM execution role and attached policies created for the lab."
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
        "text": "SAA-C03: Master AWS Lambda concepts and serverless integration patterns in AWS Lambda."
      }
    ],
    "memoryHook": "Remember that AWS Lambda is a core serverless component.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-lambda-concurrency-tuning-003",
    "examCode": "aws-saa-c03",
    "topicId": "topic-lambda",
    "title": "Concurrency Tuning",
    "slug": "concurrency-tuning",
    "service": "AWS Lambda",
    "feature": "AWS Lambda",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Configure Reserved Concurrency to protect backend resources from spike starvation while evaluating the pricing boundaries of Provisioned Concurrency.",
    "status": "published",
    "tags": [
      "AWS Lambda",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for AWS Lambda."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like AWS Lambda.",
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
    "costWarning": "Lambda request, duration, provisioned-concurrency, networking and connected-service charges may apply. Complete cleanup promptly after testing.",
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
        "note": "Identity check: sts:GetCallerIdentity Lambda operations: lambda:CreateFunction, lambda:InvokeFunction, lambda:GetFunction, lambda:UpdateFunctionCode, lambda:UpdateFunctionConfiguration, lambda:DeleteFunction IAM setup: iam:CreateRole, iam:PassRole",
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
        "title": "Navigate to Concurrency settings",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open the AWS Lambda console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Select your saa-test-compute function."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Select the Configuration tab below the function header."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Choose Concurrency from the left-hand configuration sidebar."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure Reserved Concurrency",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Under the Concurrency configuration card, locate Reserved concurrency."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Click the Edit button."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select the Reserve concurrency option."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Input an explicit value of 5."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Note that this reserve decreases the remaining unreserved concurrency pool for other regional functions."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Click Save to apply the changes."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Test Provisioned Concurrency limit warning",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Under the Provisioned concurrency section, click Add configuration."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Choose Alias or Version as the qualifier (e.g., Version 1)."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Enter a provisioned concurrency value of 2."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Carefully read the pricing prompt showing that Provisioned Concurrency starts charging hourly fees immediately."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Choose Cancel to abort and protect your $0 Free Tier sandbox perimeter."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Reset concurrency limits",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Go back to the Reserved concurrency section and click Edit."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Select Use unreserved account concurrency."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Click Save to release the reserved execution threads."
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
        "title": "Update Lambda reserved concurrency settings",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws lambda put-function-concurrency --function-name saa-test-compute --reserved-concurrent-executions 5"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Verify current concurrency details",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws lambda get-function-concurrency --function-name saa-test-compute"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Clean up concurrency settings",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws lambda delete-function-concurrency --function-name saa-test-compute"
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
        "text": "AWS Lambda configuration verified in AWS Lambda."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any event-source mappings, triggers, or alias routing configurations."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the AWS Lambda function and associated CloudWatch Log Group."
      },
      {
        "id": "cleanup-3",
        "text": "Delete the IAM execution role and attached policies created for the lab."
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
        "text": "SAA-C03: Master AWS Lambda concepts and serverless integration patterns in AWS Lambda."
      }
    ],
    "memoryHook": "Remember that AWS Lambda is a core serverless component.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-lambda-canary-routing-004",
    "examCode": "aws-saa-c03",
    "topicId": "topic-lambda",
    "title": "Canary Routing",
    "slug": "canary-routing",
    "service": "AWS Lambda",
    "feature": "AWS Lambda",
    "difficulty": "Hard",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Goal: Publish immutable static code versions and implement weighted traffic routing via functional Lambda Aliases.",
    "status": "published",
    "tags": [
      "AWS Lambda",
      "Hard"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for AWS Lambda."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like AWS Lambda.",
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
    "costWarning": "Lambda request, duration, provisioned-concurrency, networking and connected-service charges may apply. Complete cleanup promptly after testing.",
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
        "note": "Identity check: sts:GetCallerIdentity Lambda operations: lambda:CreateFunction, lambda:InvokeFunction, lambda:GetFunction, lambda:UpdateFunctionCode, lambda:UpdateFunctionConfiguration, lambda:DeleteFunction IAM setup: iam:CreateRole, iam:PassRole",
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
        "title": "Modify code and publish Version 2",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open your Lambda function code source editor."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Modify the return string in the code editor (e.g. change 'Invocations...' to 'Canary version v2')."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Deploy to save your changes."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Navigate to the Versions tab and click Publish new version."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Enter a description like v2-canary-candidate and click Publish."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Create Canary routing alias",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Navigate to the Aliases tab and click Create alias."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Name the alias prod."
          },
          {
            "id": "console-step-4-item-3",
            "text": "For Version, select 1 (stable v1)."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Expand the Routing configuration accordion panel."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Select Version 2 as the additional version."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Set the Weight (%) to 10 to route 10% of traffic to the canary."
          },
          {
            "id": "console-step-4-item-7",
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
        "title": "Clean up alias and versions",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Select your prod alias and click Delete."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Navigate to the Versions tab, select Version 1 and Version 2, and delete them to restore regional deployment storage limits."
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
        "title": "Publish new Lambda function version",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws lambda publish-version --function-name saa-test-compute"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Configure alias canary routing weight",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws lambda create-alias --function-name saa-test-compute --name prod --function-version 1 --routing-config '{\"AdditionalVersionWeights\": {\"2\": 0.1}}'"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Delete Canary routing alias",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws lambda delete-alias --function-name saa-test-compute --name prod"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 4 executed successfully."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "AWS Lambda configuration verified in AWS Lambda."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any event-source mappings, triggers, or alias routing configurations."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the AWS Lambda function and associated CloudWatch Log Group."
      },
      {
        "id": "cleanup-3",
        "text": "Delete the IAM execution role and attached policies created for the lab."
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
        "text": "SAA-C03: Master AWS Lambda concepts and serverless integration patterns in AWS Lambda."
      }
    ],
    "memoryHook": "Remember that AWS Lambda is a core serverless component.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-lambda-vpc-subnet-networking-015",
    "examCode": "aws-saa-c03",
    "topicId": "topic-lambda",
    "title": "VPC Subnet Networking",
    "slug": "vpc-subnet-networking",
    "service": "AWS Lambda",
    "feature": "AWS Lambda",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Inspect the architectural configuration steps and permission mechanics required to place a Lambda function inside an isolated private VPC subnet.",
    "status": "published",
    "tags": [
      "AWS Lambda",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for AWS Lambda."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like AWS Lambda.",
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
    "costWarning": "Lambda request, duration, provisioned-concurrency, networking and connected-service charges may apply. Complete cleanup promptly after testing.",
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
        "note": "Identity check: sts:GetCallerIdentity Lambda operations: lambda:CreateFunction, lambda:InvokeFunction, lambda:GetFunction, lambda:UpdateFunctionCode, lambda:UpdateFunctionConfiguration, lambda:DeleteFunction IAM setup: iam:CreateRole, iam:PassRole",
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
        "title": "Configure Lambda VPC settings",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Open Lambda console and select saa-test-compute."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Navigate to Configuration -> VPC."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Edit."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Select your default VPC."
          },
          {
            "id": "console-step-3-item-5",
            "text": "Choose two private subnets and assign a security group."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Cancel modifications to protect Free Tier",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Verify that connecting to a VPC subnet requires a NAT Gateway or VPC Endpoints for external internet access."
          },
          {
            "id": "console-step-4-item-2",
            "text": "NAT Gateways cost money (~$32/month) immediately. Click Cancel to safely protect the Free Tier perimeter."
          }
        ],
        "note": null,
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
        "note": "Expected: you see your AWS account ID and ARN.",
        "warning": null,
        "expectedResult": "Expected: you see your AWS account ID and ARN."
      },
      {
        "id": "cli-step-2",
        "number": 2,
        "title": "Configure Lambda function VPC subnet routing enclaves",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws lambda update-function-configuration --function-name saa-test-compute --vpc-config SubnetIds=subnet-123,subnet-456,SecurityGroupIds=sg-123"
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
        "text": "AWS Lambda configuration verified in AWS Lambda."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any event-source mappings, triggers, or alias routing configurations."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the AWS Lambda function and associated CloudWatch Log Group."
      },
      {
        "id": "cleanup-3",
        "text": "Delete the IAM execution role and attached policies created for the lab."
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
        "text": "SAA-C03: Master AWS Lambda concepts and serverless integration patterns in AWS Lambda."
      }
    ],
    "memoryHook": "Remember that AWS Lambda is a core serverless component.",
    "flashcardSetId": null
  },
  {
    "id": "task-saa-lambda-streaming-topologies-016",
    "examCode": "aws-saa-c03",
    "topicId": "topic-lambda",
    "title": "Streaming Topologies",
    "slug": "streaming-topologies",
    "service": "AWS Lambda",
    "feature": "AWS Lambda",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Walk through the creation interface of Amazon Kinesis Data Streams to evaluate sharding and capacity models side-by-side with Firehose.",
    "status": "published",
    "tags": [
      "AWS Lambda",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon Kinesis."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon Kinesis.",
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
    "costWarning": "Lambda request, duration, provisioned-concurrency, networking and connected-service charges may apply. Complete cleanup promptly after testing.",
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
        "note": "Identity check: sts:GetCallerIdentity Kinesis operations: kinesis:CreateStream, kinesis:DeleteStream, kinesis:DescribeStream",
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
        "title": "Initialize Kinesis Data Stream creation",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Navigate to Amazon Kinesis console."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Under Data Streams, click Create data stream."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Name the stream realtime-clickstream-bus."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Review Shard capacity billing models",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Under Capacity mode, select Provisioned."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Set the Provisioned shards counter to 1."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Review the pricing breakdown displaying active hourly shard costs."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Cancel creation to keep Free Tier",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Kinesis provisioned shards run an active hourly cost. Click Cancel to avoid any charges."
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
        "title": "Create Kinesis Data Stream with provisioned shard allocation",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws kinesis create-stream --stream-name realtime-clickstream-bus --shard-count 1"
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
        "text": "AWS Lambda configuration verified in AWS Lambda."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete any event-source mappings, triggers, or alias routing configurations."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the AWS Lambda function and associated CloudWatch Log Group."
      },
      {
        "id": "cleanup-3",
        "text": "Delete the IAM execution role and attached policies created for the lab."
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
        "text": "SAA-C03: Master AWS Lambda concepts and serverless integration patterns in AWS Lambda."
      }
    ],
    "memoryHook": "Remember that Amazon Kinesis is a core serverless component.",
    "flashcardSetId": null
  }
];
