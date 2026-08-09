// Preserved from the Generator V2 reviewed new-topic definition for Follow Along ownership.
export const SYNTHAPP_TASKS = [
  {
    "id": "task-synthapp-architecture-001",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Plan the SynthApp serverless architecture",
    "slug": "plan-synthapp-serverless-architecture",
    "service": "AWS Serverless",
    "feature": "Application Architecture",
    "difficulty": "Easy",
    "estimatedMinutes": 25,
    "region": "eu-west-2",
    "goal": "Design the regional architecture, naming convention, data model, and request flow for a small serverless SynthApp application.",
    "status": "published",
    "tags": [
      "SynthApp",
      "Serverless",
      "Architecture"
    ],
    "whyItMatters": "A written resource map prevents naming collisions, clarifies security boundaries, and gives later tasks a consistent deployment target.",
    "costWarning": "This planning task creates no AWS resources and should not incur charges.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Confirm the working account and Region",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Sign in to the AWS Management Console with a lab role or IAM Identity Center permission set approved for the workshop."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Select eu-west-2 and record the AWS account ID shown in the account menu."
          }
        ],
        "warning": "Use a sandbox or learning account, not a production account.",
        "expectedResult": "The target account and eu-west-2 Region are recorded."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Write the resource and request-flow plan",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Plan a browser client hosted in Amazon S3, an Amazon API Gateway HTTP API, an AWS Lambda function, and an Amazon DynamoDB table."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Use the prefix synthapp-lab for workshop resources and plan a partition key named synthId."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Document the request flow Browser to API Gateway to Lambda to DynamoDB and the authentication boundary provided by Amazon Cognito."
          }
        ],
        "expectedResult": "A complete resource map and request flow are available for the remaining tasks."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Verify the AWS CLI identity and Region",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws sts get-caller-identity"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws configure get region"
          }
        ],
        "warning": "Stop if the returned account is not the approved workshop account.",
        "expectedResult": "The CLI identity is valid and the intended Region is known."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "The architecture identifies S3, API Gateway, Lambda, DynamoDB, Cognito, and CloudWatch responsibilities."
      },
      {
        "id": "verify-2",
        "text": "The account, Region, resource prefix, and DynamoDB partition key are recorded."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "No AWS cleanup is required because this task creates no resources."
      }
    ],
    "createdResourceKeys": []
  },
  {
    "id": "task-synthapp-dynamodb-002",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Create the SynthApp DynamoDB table",
    "slug": "create-synthapp-dynamodb-table",
    "service": "Amazon DynamoDB",
    "feature": "NoSQL Data Store",
    "difficulty": "Easy",
    "estimatedMinutes": 30,
    "region": "eu-west-2",
    "goal": "Create an on-demand DynamoDB table for SynthApp items and add a sample item for later API tests.",
    "status": "published",
    "tags": [
      "SynthApp",
      "DynamoDB",
      "Data"
    ],
    "whyItMatters": "DynamoDB provides a managed, low-operations persistence layer that fits a request-driven serverless application.",
    "costWarning": "DynamoDB on-demand capacity and stored data can incur charges. Use a small workshop table and delete it during final cleanup.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Create the table",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Open DynamoDB in eu-west-2 and choose Create table."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Name the table synthapp-lab-items and set the string partition key to synthId."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Keep the default on-demand capacity settings and create the table."
          }
        ],
        "expectedResult": "The synthapp-lab-items table becomes Active."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Add a sample item",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open Explore table items and create an item with synthId sample-001, name First Synth, and status READY."
          }
        ],
        "expectedResult": "The sample-001 item is visible in the table."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Create and seed the table",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws dynamodb create-table --table-name synthapp-lab-items --attribute-definitions AttributeName=synthId,AttributeType=S --key-schema AttributeName=synthId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws dynamodb wait table-exists --table-name synthapp-lab-items --region eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-3",
            "language": "bash",
            "text": "aws dynamodb put-item --table-name synthapp-lab-items --item '{\"synthId\":{\"S\":\"sample-001\"},\"name\":{\"S\":\"First Synth\"},\"status\":{\"S\":\"READY\"}}' --region eu-west-2"
          }
        ],
        "expectedResult": "The table exists and contains sample-001."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "The table status is Active and its partition key is synthId of type String."
      },
      {
        "id": "verify-2",
        "text": "A consistent read returns the sample-001 item."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Retain the table for subsequent SynthApp tasks."
      },
      {
        "id": "cleanup-2",
        "text": "If ending the workshop early, manually delete synthapp-lab-items after confirming it is not shared."
      }
    ],
    "createdResourceKeys": [
      "dynamodbTableName"
    ]
  },
  {
    "id": "task-synthapp-frontend-003",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Host the SynthApp frontend in Amazon S3",
    "slug": "host-synthapp-frontend-s3",
    "service": "Amazon S3",
    "feature": "Static Website Hosting",
    "difficulty": "Medium",
    "estimatedMinutes": 35,
    "region": "eu-west-2",
    "goal": "Create a uniquely named S3 bucket and publish a minimal static frontend for the SynthApp workshop.",
    "status": "published",
    "tags": [
      "SynthApp",
      "S3",
      "Frontend"
    ],
    "whyItMatters": "A static frontend separates browser delivery from the serverless API and can be replaced by a production CloudFront deployment later.",
    "costWarning": "S3 storage and requests can incur small charges. Static website endpoints are HTTP-only and are for this sandbox workshop, not production delivery.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Create the frontend bucket",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Open Amazon S3 and create a globally unique bucket beginning with synthapp-lab-web-."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Keep Block Public Access enabled while uploading an index.html file that identifies the SynthApp workshop."
          }
        ],
        "warning": "Do not disable Block Public Access until the workshop access decision is explicit and limited to this bucket.",
        "expectedResult": "The private bucket contains index.html."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Record the frontend origin",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Record the bucket name and the regional S3 origin for later frontend configuration."
          }
        ],
        "expectedResult": "The frontend bucket identity is recorded without exposing unrelated buckets."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Create a private frontend bucket and upload the page",
        "instructions": [
          {
            "id": "cli-step-1-item-1",
            "text": "Replace the example bucket suffix with your account ID or another globally unique value."
          }
        ],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws s3api create-bucket --bucket synthapp-lab-web-123456789012 --region eu-west-2 --create-bucket-configuration LocationConstraint=eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws s3 cp index.html s3://synthapp-lab-web-123456789012/index.html --content-type text/html --region eu-west-2"
          }
        ],
        "warning": "The literal example bucket name must be replaced before running the commands.",
        "expectedResult": "The private bucket contains index.html."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "The bucket is in eu-west-2 and Block Public Access remains enabled."
      },
      {
        "id": "verify-2",
        "text": "The index.html object has content type text/html."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Retain the frontend bucket for the integration task."
      },
      {
        "id": "cleanup-2",
        "text": "If ending early, manually empty and delete only the recorded SynthApp bucket."
      }
    ],
    "createdResourceKeys": [
      "frontendBucketName"
    ]
  },
  {
    "id": "task-synthapp-lambda-role-004",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Create a least-privilege Lambda execution role",
    "slug": "create-synthapp-lambda-role",
    "service": "AWS Identity and Access Management",
    "feature": "Execution Roles",
    "difficulty": "Medium",
    "estimatedMinutes": 35,
    "region": "eu-west-2",
    "goal": "Create a Lambda execution role that can write logs and access only the SynthApp DynamoDB table.",
    "status": "published",
    "tags": [
      "SynthApp",
      "IAM",
      "Least Privilege"
    ],
    "whyItMatters": "The Lambda function should receive only the permissions needed for its logging and table operations.",
    "costWarning": "IAM roles do not incur charges, but permissions granted by the role can allow chargeable service operations.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Create the execution role",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Open IAM, create a role for the Lambda service, and name it synthapp-lab-lambda-role."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Attach AWSLambdaBasicExecutionRole for CloudWatch Logs delivery."
          }
        ],
        "expectedResult": "Lambda can assume synthapp-lab-lambda-role."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Add table-scoped permissions",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Add an inline policy allowing dynamodb:GetItem, PutItem, UpdateItem, DeleteItem, and Scan only on the synthapp-lab-items table ARN."
          }
        ],
        "warning": "Do not use a wildcard resource or DynamoDB full access for the workshop function.",
        "expectedResult": "The role policy is scoped to the single SynthApp table."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Inspect the role after creating it",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws iam get-role --role-name synthapp-lab-lambda-role"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws iam list-role-policies --role-name synthapp-lab-lambda-role"
          }
        ],
        "expectedResult": "The trust policy names Lambda and the inline table policy is present."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "The trust relationship allows lambda.amazonaws.com to assume the role."
      },
      {
        "id": "verify-2",
        "text": "The DynamoDB permissions reference only the recorded SynthApp table ARN."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Retain the role while the SynthApp Lambda function exists."
      },
      {
        "id": "cleanup-2",
        "text": "During final cleanup, delete the inline policy and role only after deleting the function."
      }
    ],
    "createdResourceKeys": [
      "lambdaRoleName"
    ]
  },
  {
    "id": "task-synthapp-lambda-api-005",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Build the SynthApp Lambda API handler",
    "slug": "build-synthapp-lambda-handler",
    "service": "AWS Lambda",
    "feature": "Serverless Compute",
    "difficulty": "Medium",
    "estimatedMinutes": 50,
    "region": "eu-west-2",
    "goal": "Create and test a Lambda function that reads and writes SynthApp items in DynamoDB.",
    "status": "published",
    "tags": [
      "SynthApp",
      "Lambda",
      "API"
    ],
    "whyItMatters": "A small handler demonstrates event processing, environment configuration, managed-service integration, and structured API responses.",
    "costWarning": "Lambda requests, duration, and CloudWatch Logs can incur charges beyond free-tier allowances.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Create and configure the function",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Create a Node.js Lambda function named synthapp-lab-api using the existing synthapp-lab-lambda-role."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Add the environment variable TABLE_NAME with value synthapp-lab-items."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Implement GET and POST handling with the AWS SDK, JSON responses, and input validation."
          }
        ],
        "expectedResult": "The function is deployed with the table name configured."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Run direct function tests",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Invoke a GET test event and confirm sample-001 is returned."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Invoke a POST test event with a new synthId and confirm a 201 response."
          }
        ],
        "warning": "Reject requests without a non-empty synthId instead of writing malformed items.",
        "expectedResult": "Direct test events return structured success responses."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Inspect and invoke the function",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws lambda get-function-configuration --function-name synthapp-lab-api --region eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws lambda invoke --function-name synthapp-lab-api --payload '{\"requestContext\":{\"http\":{\"method\":\"GET\"}},\"pathParameters\":{\"synthId\":\"sample-001\"}}' --cli-binary-format raw-in-base64-out --region eu-west-2 synthapp-response.json"
          }
        ],
        "expectedResult": "The invocation succeeds and synthapp-response.json contains a successful response."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "The function uses TABLE_NAME rather than embedding the table name in handler logic."
      },
      {
        "id": "verify-2",
        "text": "GET and POST tests return valid JSON and the expected HTTP-style status codes."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Retain the Lambda function for API Gateway integration."
      },
      {
        "id": "cleanup-2",
        "text": "Delete the local synthapp-response.json test artifact when it is no longer needed."
      }
    ],
    "createdResourceKeys": [
      "lambdaFunctionName"
    ]
  },
  {
    "id": "task-synthapp-http-api-006",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Expose SynthApp through API Gateway",
    "slug": "expose-synthapp-api-gateway",
    "service": "Amazon API Gateway",
    "feature": "HTTP APIs",
    "difficulty": "Medium",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Create an HTTP API with Lambda integration, item routes, a deployed stage, and restricted CORS settings.",
    "status": "published",
    "tags": [
      "SynthApp",
      "API Gateway",
      "HTTP API"
    ],
    "whyItMatters": "API Gateway supplies a managed HTTPS entry point, routing, CORS configuration, and an authorization integration point.",
    "costWarning": "API Gateway requests and data transfer can incur charges. Remove the workshop API during final cleanup.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Create the HTTP API and routes",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Create an HTTP API named synthapp-lab-http-api with the synthapp-lab-api Lambda integration."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Add GET /synths/{synthId} and POST /synths routes."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Use an auto-deploy stage named lab."
          }
        ],
        "expectedResult": "Both routes target the Lambda integration in the lab stage."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Configure and test CORS",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Allow GET and POST, the Content-Type header, and only the recorded frontend origin."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Invoke the GET route for sample-001 and record the stage invoke URL."
          }
        ],
        "warning": "Do not use a wildcard origin when credentials or Cognito authorization will be enabled.",
        "expectedResult": "The HTTPS endpoint returns the sample item and the invoke URL is recorded."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Inspect and call the deployed API",
        "instructions": [
          {
            "id": "cli-step-1-item-1",
            "text": "Use the API identifier returned by the console or create-api response."
          }
        ],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws apigatewayv2 get-apis --region eu-west-2 --query \"Items[?Name=='synthapp-lab-http-api'].{ApiId:ApiId,Endpoint:ApiEndpoint}\" --output table"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "curl -i https://API_ID.execute-api.eu-west-2.amazonaws.com/lab/synths/sample-001"
          }
        ],
        "warning": "Replace API_ID with the recorded identifier before running curl.",
        "expectedResult": "The endpoint returns HTTP 200 and the sample item."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "GET and POST routes use the intended Lambda integration and lab stage."
      },
      {
        "id": "verify-2",
        "text": "CORS permits only the intended methods, header, and recorded frontend origin."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Retain the HTTP API through authentication and end-to-end testing."
      },
      {
        "id": "cleanup-2",
        "text": "If ending early, manually delete only the recorded SynthApp API after confirming its API ID."
      }
    ],
    "createdResourceKeys": [
      "httpApiId",
      "httpApiEndpoint"
    ]
  },
  {
    "id": "task-synthapp-cognito-007",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Protect SynthApp with Amazon Cognito",
    "slug": "protect-synthapp-cognito",
    "service": "Amazon Cognito",
    "feature": "User Pools and JWT Authorization",
    "difficulty": "Hard",
    "estimatedMinutes": 55,
    "region": "eu-west-2",
    "goal": "Create a Cognito user pool and application client, then require valid access tokens on the SynthApp API routes.",
    "status": "published",
    "tags": [
      "SynthApp",
      "Cognito",
      "Security"
    ],
    "whyItMatters": "JWT authorization moves identity validation to managed services and prevents anonymous writes to the application API.",
    "costWarning": "Cognito pricing depends on monthly active users and optional features. Delete workshop users and the pool during final cleanup.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Create the user pool and app client",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Create a user pool named synthapp-lab-users with email sign-in and a password policy suitable for the sandbox."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Create a public application client named synthapp-lab-web-client without a client secret."
          },
          {
            "id": "console-step-1-item-3",
            "text": "Create and confirm one workshop test user."
          }
        ],
        "warning": "A browser application must not be given a client secret it cannot protect.",
        "expectedResult": "The user pool, public client, and confirmed test user exist."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Attach a JWT authorizer",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Create an API Gateway JWT authorizer using the Cognito issuer URL and app client ID as the audience."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Attach the authorizer to both SynthApp routes and redeploy if auto-deploy is not active."
          }
        ],
        "expectedResult": "Anonymous requests are rejected and valid access tokens reach Lambda."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Inspect the Cognito and authorizer configuration",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws cognito-idp list-user-pools --max-results 20 --region eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws apigatewayv2 get-authorizers --api-id API_ID --region eu-west-2"
          }
        ],
        "warning": "Replace API_ID with the recorded SynthApp HTTP API identifier.",
        "expectedResult": "The Cognito pool and API Gateway JWT authorizer identifiers match the workshop records."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "An unauthenticated request receives HTTP 401 or 403 rather than application data."
      },
      {
        "id": "verify-2",
        "text": "A valid test-user access token can invoke the protected route."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Retain the user pool and authorizer through end-to-end testing."
      },
      {
        "id": "cleanup-2",
        "text": "During final cleanup, delete workshop users and the user pool only after removing the API authorizer dependency."
      }
    ],
    "createdResourceKeys": [
      "cognitoUserPoolId",
      "cognitoAppClientId",
      "apiAuthorizerId"
    ]
  },
  {
    "id": "task-synthapp-observability-008",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Validate and monitor SynthApp end to end",
    "slug": "validate-monitor-synthapp",
    "service": "Amazon CloudWatch",
    "feature": "Logs, Metrics, and Alarms",
    "difficulty": "Medium",
    "estimatedMinutes": 45,
    "region": "eu-west-2",
    "goal": "Connect the frontend to the protected API, exercise the complete request path, inspect logs, and add a Lambda error alarm.",
    "status": "published",
    "tags": [
      "SynthApp",
      "CloudWatch",
      "Observability"
    ],
    "whyItMatters": "An application is not complete until its real request path is verified and operators can detect failed invocations.",
    "costWarning": "CloudWatch logs, custom retention, and alarms can incur charges. Keep test traffic small and delete the workshop alarm during cleanup.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Run an end-to-end request",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Configure the SynthApp frontend with the recorded API endpoint, Cognito user pool ID, and app client ID."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Sign in as the workshop test user, create a new item, and retrieve it through the browser."
          }
        ],
        "expectedResult": "The browser completes an authenticated write and read through all application services."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Inspect logs and create an alarm",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Open the /aws/lambda/synthapp-lab-api log group and locate the end-to-end invocation without exposing tokens in logs."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Create an alarm named synthapp-lab-lambda-errors for one or more Lambda Errors in a five-minute period."
          }
        ],
        "warning": "Never log Cognito access tokens, authorization headers, passwords, or other secrets.",
        "expectedResult": "The successful invocation is traceable and the error alarm is configured."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Review Lambda metrics and the alarm",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name Errors --dimensions Name=FunctionName,Value=synthapp-lab-api --start-time 2026-01-01T00:00:00Z --end-time 2026-01-01T01:00:00Z --period 300 --statistics Sum --region eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws cloudwatch describe-alarms --alarm-names synthapp-lab-lambda-errors --region eu-west-2"
          }
        ],
        "note": "Use a current UTC time window when querying metrics.",
        "expectedResult": "Lambda error metrics are queryable and the workshop alarm exists."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "An authenticated user can create and retrieve an item from the frontend."
      },
      {
        "id": "verify-2",
        "text": "CloudWatch contains the Lambda invocation and the error alarm has an evaluable state."
      },
      {
        "id": "verify-3",
        "text": "Logs contain no passwords, access tokens, authorization headers, or client secrets."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Retain the alarm until the final cleanup task so its deletion can be verified."
      }
    ],
    "createdResourceKeys": [
      "cloudWatchAlarmName"
    ]
  },
  {
    "id": "task-synthapp-cleanup-009",
    "examCode": "aws-dva-c02",
    "topicId": "topic-synthapp",
    "title": "Clean up the SynthApp workshop safely",
    "slug": "cleanup-synthapp-workshop",
    "service": "AWS Serverless",
    "feature": "Safe Resource Teardown",
    "difficulty": "Medium",
    "estimatedMinutes": 35,
    "region": "eu-west-2",
    "goal": "Manually remove only the recorded SynthApp workshop resources in dependency-safe order and verify that cleanup is complete.",
    "status": "published",
    "tags": [
      "SynthApp",
      "Cleanup",
      "Cost Control"
    ],
    "whyItMatters": "Dependency-aware cleanup prevents ongoing charges and reduces the risk of deleting unrelated resources with similar names.",
    "costWarning": "Charges may continue until the API, Lambda logs, DynamoDB table, S3 objects, alarms, and other workshop resources are deleted.",
    "consoleSteps": [
      {
        "id": "console-step-1",
        "number": 1,
        "title": "Confirm the cleanup scope",
        "instructions": [
          {
            "id": "console-step-1-item-1",
            "text": "Compare every resource ID and name with the values recorded during the workshop."
          },
          {
            "id": "console-step-1-item-2",
            "text": "Stop if a resource is shared, production-tagged, or does not exactly match the SynthApp records."
          }
        ],
        "warning": "Cleanup is manual and destructive. Never select resources based only on a partial name match.",
        "expectedResult": "Only confirmed workshop resources are selected for deletion."
      },
      {
        "id": "console-step-2",
        "number": 2,
        "title": "Delete resources in dependency order",
        "instructions": [
          {
            "id": "console-step-2-item-1",
            "text": "Delete the CloudWatch alarm, detach and delete the API Gateway authorizer, then delete the HTTP API."
          },
          {
            "id": "console-step-2-item-2",
            "text": "Delete the Cognito workshop users and user pool, then delete the Lambda function and its CloudWatch log group."
          },
          {
            "id": "console-step-2-item-3",
            "text": "Empty and delete the recorded S3 bucket, delete the DynamoDB table, and finally delete the Lambda inline policy and role."
          }
        ],
        "expectedResult": "All recorded SynthApp resources are removed without touching unrelated resources."
      }
    ],
    "cliSteps": [
      {
        "id": "cli-step-1",
        "number": 1,
        "title": "Perform read-only post-cleanup checks",
        "instructions": [],
        "commands": [
          {
            "id": "cli-step-1-cmd-1",
            "language": "bash",
            "text": "aws lambda get-function --function-name synthapp-lab-api --region eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-2",
            "language": "bash",
            "text": "aws dynamodb describe-table --table-name synthapp-lab-items --region eu-west-2"
          },
          {
            "id": "cli-step-1-cmd-3",
            "language": "bash",
            "text": "aws cloudwatch describe-alarms --alarm-names synthapp-lab-lambda-errors --region eu-west-2"
          }
        ],
        "note": "ResourceNotFound-style responses are expected after successful cleanup.",
        "expectedResult": "Read-only checks confirm that the named workshop resources no longer exist."
      }
    ],
    "verification": [
      {
        "id": "verify-1",
        "text": "The recorded API, authorizer, user pool, function, alarm, bucket, table, log group, and role are absent."
      },
      {
        "id": "verify-2",
        "text": "No unrelated resources were changed during cleanup."
      }
    ],
    "cleanup": [
      {
        "id": "cleanup-1",
        "text": "Review the AWS Billing and Cost Management console later to confirm that no unexpected workshop usage remains."
      },
      {
        "id": "cleanup-2",
        "text": "Retain only the local learning notes; do not retain credentials, tokens, or copied secrets."
      }
    ],
    "createdResourceKeys": []
  }
];
