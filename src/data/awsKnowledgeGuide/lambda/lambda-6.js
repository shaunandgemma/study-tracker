import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-6",
  "title": "Lambda Serverless Functions",
  "plainEnglish": "AWS Lambda is a serverless, event-driven compute service that lets you run application code without provisioning, managing, or maintaining servers. You package your business logic into a function, configure the runtime and memory requirements, and AWS automatically provisions the underlying infrastructure, executes your code on demand, scales from zero to thousands of parallel instances, and charges only for the exact milliseconds your code runs.",
  "whyItMatters": "Traditional server-based hosting requires paying for 24/7 idle compute, configuring operating systems, applying security patches, and configuring Auto Scaling groups. AWS Lambda eliminates all server management overhead, allowing developers to focus entirely on building core application features with automatic high availability built across multiple Availability Zones.",
  "workplaceExample": "A media company runs a thumbnail generator. Instead of maintaining a dedicated EC2 instance running continuously, they deploy a 50-line Node.js Lambda function. When a user uploads a photo to an S3 bucket, S3 triggers the Lambda function, which resizes the image in 300 milliseconds and writes the thumbnail back to S3, incurring costs only for the fractions of a cent consumed during execution.",
  "examFocus": "Understand core Lambda capabilities: (1) Stateless by design: application state must be stored in external services like DynamoDB or S3. (2) Supported deployment packages: ZIP archive (up to 50 MB compressed, 250 MB uncompressed) and Container Images (up to 10 GB stored in Amazon ECR). (3) Maximum execution duration is 15 minutes (900 seconds). (4) Billing is based on request count and execution duration in 1-millisecond increments.",
  "keyPoints": [
    "Executes code serverlessly with zero server provisioning, operating system patching, or capacity management.",
    "Billed strictly on consumption: total invocation count and duration measured in 1-millisecond increments.",
    "Supports multiple native managed runtimes including Node.js, Python, Java, Go, Ruby, .NET, and Custom Runtimes (provided.al2023).",
    "Deployment packages supported: ZIP file archives (up to 250 MB uncompressed) and Container Images (up to 10 GB via ECR).",
    "Execution duration can be configured from 1 second up to a hard ceiling of 15 minutes (900 seconds).",
    "Built-in high availability across multiple Availability Zones in the Region automatically."
  ],
  "commonMistake": "Attempting to run long-running batch jobs (e.g., a 2-hour video rendering process) on AWS Lambda. Lambda has a strict 15-minute maximum execution timeout; for workloads exceeding 15 minutes, use AWS Fargate, Amazon ECS, or AWS Batch.",
  "example": "Create a Python 3.12 Lambda function using the AWS CLI: aws lambda create-function --function-name process-image --runtime python3.12 --role arn:aws:iam::123456789012:role/lambda-basic-execution --handler index.handler --zip-file fileb://function.zip.",
  "sources": [
    {
      "title": "What is AWS Lambda?",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"
    },
    {
      "title": "Getting Started with AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html"
    }
  ]
});
