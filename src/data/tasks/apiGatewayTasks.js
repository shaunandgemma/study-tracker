/** Amazon API Gateway Tasks (SAA-C03) */
export const API_GATEWAY_TASKS = [
  {
    "id": "task-saa-api-gateway-api-ingress-proxy-002",
    "examCode": "aws-saa-c03",
    "topicId": "topic-api-gateway",
    "title": "API Ingress Proxy",
    "slug": "api-ingress-proxy",
    "service": "Amazon API Gateway",
    "feature": "Amazon API Gateway",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Provision an API Gateway HTTP API, implement a catch-all path routing asynchronously via Lambda Proxy integration, and analyze CORS boundaries.",
    "status": "published",
    "tags": [
      "Amazon API Gateway",
      "Medium"
    ],
    "flow": [],
    "concepts": [
      {
        "id": "concept-1",
        "title": "Serverless Architecture",
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon API Gateway."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon API Gateway.",
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
    "costWarning": "API requests, data transfer, caching, logging and connected-service charges may apply. Complete cleanup promptly.",
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
        "note": "Identity check: sts:GetCallerIdentity API Gateway operations: apigateway:GET, apigateway:POST, apigateway:DELETE, apigateway:PUT, lambda:InvokeFunction",
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
        "title": "Create the HTTP API",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "In the search bar at the top, type API Gateway and select it from the services list."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Locate the HTTP API option card and click Build."
          },
          {
            "id": "console-step-3-item-3",
            "text": "For API name, enter clickstream-ingress-api."
          },
          {
            "id": "console-step-3-item-4",
            "text": "Click Next to proceed."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure the Lambda integration",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Click Add integration."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Select Lambda from the integration type dropdown."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Select your target AWS Region."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Select the saa-test-compute Lambda function created in Task 1."
          },
          {
            "id": "console-step-4-item-5",
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
        "title": "Configure routes and stages",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "On the Configure routes page, set the Method to ANY."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Set the Resource path to exactly /{proxy+} to handle all catch-all path routes."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Click Next."
          },
          {
            "id": "console-step-5-item-4",
            "text": "Keep the Stage name set to the default $default stage with Auto-deploy active."
          },
          {
            "id": "console-step-5-item-5",
            "text": "Click Next, then click Create."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Test the API Gateway proxy",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "In the API details dashboard, locate and copy the Invoke URL."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Open a new browser window or tab."
          },
          {
            "id": "console-step-6-item-3",
            "text": "Paste the Invoke URL and append a test path (e.g. /hello-world)."
          },
          {
            "id": "console-step-6-item-4",
            "text": "Press Enter and verify that the returned JSON payload matches the string returned by your Lambda function."
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
            "text": "Go to the APIs index list."
          },
          {
            "id": "console-step-7-item-2",
            "text": "Select the checkbox next to clickstream-ingress-api."
          },
          {
            "id": "console-step-7-item-3",
            "text": "Choose Actions → Delete."
          },
          {
            "id": "console-step-7-item-4",
            "text": "Type delete to confirm and choose Delete."
          }
        ],
        "note": null,
        "warning": null,
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
        "title": "Create API Gateway HTTP endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws apigatewayv2 create-api --name clickstream-ingress-api --protocol-type HTTP --target <LAMBDA_ARN>"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 2 executed successfully."
      },
      {
        "id": "cli-step-3",
        "number": 3,
        "title": "Grant integration permission to Lambda",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-3-cmd-1",
            "language": "bash",
            "text": "aws lambda add-permission --function-name saa-test-compute --statement-id apigateway-access --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn <API_ARN>/*"
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "CLI command step 3 executed successfully."
      },
      {
        "id": "cli-step-4",
        "number": 4,
        "title": "Clean up API Gateway endpoint",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-4-cmd-1",
            "language": "bash",
            "text": "aws apigatewayv2 delete-api --api-id <API_ID>"
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
        "text": "Amazon API Gateway configuration verified in Amazon API Gateway."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete the API Gateway stage deployment and API instance."
      },
      {
        "id": "cleanup-2",
        "text": "Delete associated CloudWatch Log Groups and Lambda permissions."
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
        "text": "SAA-C03: Master Amazon API Gateway concepts and serverless integration patterns in Amazon API Gateway."
      }
    ],
    "memoryHook": "Remember that Amazon API Gateway is a core serverless component.",
    "flashcardSetId": null
  }
];
