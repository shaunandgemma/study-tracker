import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-8",
  "title": "Lambda Execution Role",
  "plainEnglish": "A Lambda Execution Role is an AWS Identity and Access Management (IAM) role that you attach to a Lambda function to grant it permissions to access AWS services and resources. When your function's code runs, it assumes this execution role to obtain temporary security credentials to write logs to CloudWatch, read items from DynamoDB, download files from S3, or connect to VPC subnets.",
  "whyItMatters": "Hardcoding static AWS credentials inside function code creates severe security vulnerabilities. An execution role follows the principle of least privilege, providing temporary, auto-rotated security credentials to your function code without embedding access keys or secrets in source files or environment variables.",
  "workplaceExample": "A Lambda function processes customer feedback submitted from a web form. The security team creates an IAM execution role attached to the function with permissions strictly limited to: (1) AWSLambdaBasicExecutionRole (for CloudWatch Logs), (2) dynamodb:PutItem on the feedback table, and (3) comprehend:DetectSentiment. The function cannot access any other AWS service or database.",
  "examFocus": "Critically distinguish the Execution Role from a Resource-Based Policy: The Execution Role (`Role` ARN) is assumed BY THE FUNCTION to interact WITH AWS services (e.g., writing logs, accessing DynamoDB/S3/KMS, creating VPC ENIs). The Resource-Based Policy defines WHO OR WHAT IS ALLOWED TO INVOKE the function (e.g., S3 bucket or API Gateway).",
  "keyPoints": [
    "An IAM role assumed by Lambda to grant function code permissions to access AWS resources.",
    "Must include a Trust Policy allowing the 'lambda.amazonaws.com' service principal to assume the role.",
    "The AWS managed policy 'AWSLambdaBasicExecutionRole' provides minimal permissions to write logs to Amazon CloudWatch.",
    "VPC-enabled functions require the 'AWSLambdaVPCAccessExecutionRole' managed policy (ec2:CreateNetworkInterface, etc.).",
    "Stream event-source functions (Kinesis/DynamoDB) require read permissions (kinesis:GetRecords, dynamodb:GetRecords).",
    "Temporary credentials are provided automatically to the AWS SDK via environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)."
  ],
  "commonMistake": "Attaching the AdministratorAccess policy to a Lambda function execution role. Always adhere to least privilege, scoping policies down to the exact actions (e.g., s3:GetObject) and specific resource ARNs required.",
  "example": "Define a trust policy for a Lambda execution role: {\"Version\": \"2012-10-17\", \"Statement\": [{\"Effect\": \"Allow\", \"Principal\": {\"Service\": \"lambda.amazonaws.com\"}, \"Action\": \"sts:AssumeRole\"}]}.",
  "sources": [
    {
      "title": "AWS Lambda Execution Role",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html"
    },
    {
      "title": "Identity-Based IAM Policies for Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/access-control-identity-based.html"
    }
  ]
});
