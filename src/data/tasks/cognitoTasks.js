/** Amazon Cognito Tasks (SAA-C03) */
export const COGNITO_TASKS = [
  {
    "id": "task-saa-cognito-serverless-security-012",
    "examCode": "aws-saa-c03",
    "topicId": "topic-cognito",
    "title": "Serverless Security",
    "slug": "serverless-security",
    "service": "Amazon Cognito",
    "feature": "Amazon API Gateway",
    "difficulty": "Medium",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Goal: Set up a serverless identity management pool directory and configure a secure backend route access authorizer inside API Gateway.",
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
        "body": "This lab covers the essential Solutions Architect - Associate configuration requirements for Amazon Cognito."
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
    "whyItMatters": "AWS exams test your ability to balance cost, performance, and resilience using managed serverless integrations like Amazon Cognito.",
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
    "costWarning": "Cognito offers an exceptionally generous free tier footprint of 50,000 Monthly Active Users (MAUs), making it 100% safe for architectural validation and hands-on preparation.",
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
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate permissions."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Sign in to the AWS Management Console using an IAM user or lab role with appropriate permissions."
          },
          {
            "id": "console-step-1-item-4",
            "text": "For least privilege, use the service permissions listed below."
          }
        ],
        "note": "Identity check: sts:GetCallerIdentity Cognito operations: cognito-idp:CreateUserPool, cognito-idp:DeleteUserPool, cognito-idp:DescribeUserPool, apigateway:GET, apigateway:POST",
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
        "title": "Create User Pool",
        "instructions": [
          {
            "id": "console-step-3-item-1",
            "text": "Navigate to Cognito console and click Create user pool."
          },
          {
            "id": "console-step-3-item-2",
            "text": "Under Cognito User Pool sign-in options, check the box for Email."
          },
          {
            "id": "console-step-3-item-3",
            "text": "Click Next."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 3 completed successfully."
      },
      {
        "id": "console-step-4",
        "number": 4,
        "title": "Configure client and settings",
        "instructions": [
          {
            "id": "console-step-4-item-1",
            "text": "Keep the default security settings (Password strength, MFA) to minimize setup complexity."
          },
          {
            "id": "console-step-4-item-2",
            "text": "Click Next through messaging and integration."
          },
          {
            "id": "console-step-4-item-3",
            "text": "Set User pool name to app-student-directory."
          },
          {
            "id": "console-step-4-item-4",
            "text": "Under App client type, select Public client."
          },
          {
            "id": "console-step-4-item-5",
            "text": "Name it web-client-interface."
          },
          {
            "id": "console-step-4-item-6",
            "text": "Click Create user pool."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 4 completed successfully."
      },
      {
        "id": "console-step-5",
        "number": 5,
        "title": "Create API Gateway Authorizer",
        "instructions": [
          {
            "id": "console-step-5-item-1",
            "text": "Open your API Gateway clickstream-ingress-api from Task 2."
          },
          {
            "id": "console-step-5-item-2",
            "text": "Click Authorizers and choose Create authorizer."
          },
          {
            "id": "console-step-5-item-3",
            "text": "Select Cognito as type, link it to your newly created user pool, and click Create."
          }
        ],
        "note": null,
        "warning": null,
        "expectedResult": "Step 5 completed successfully."
      },
      {
        "id": "console-step-6",
        "number": 6,
        "title": "Clean up Cognito",
        "instructions": [
          {
            "id": "console-step-6-item-1",
            "text": "Delete the Cognito authorizer in API Gateway."
          },
          {
            "id": "console-step-6-item-2",
            "text": "Delete the Cognito user pool app-student-directory."
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
        "title": "Create Cognito User Pool directory",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-2-cmd-1",
            "language": "bash",
            "text": "aws cognito-idp create-user-pool --pool-name app-student-directory"
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
        "text": "Amazon API Gateway configuration verified in Amazon API Gateway."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Delete test app clients and domain prefixes."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the Amazon Cognito Identity Pool and User Pool."
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
    "memoryHook": "Remember that Amazon Cognito is a core serverless component.",
    "flashcardSetId": null
  }
];
