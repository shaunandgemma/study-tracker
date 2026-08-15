import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-34",
  "title": "Lambda with Amazon EFS",
  "plainEnglish": "AWS Lambda with Amazon Elastic File System (Amazon EFS) allows serverless functions to mount a shared, fully managed Network File System (NFS) directory with unlimited storage capacity. Unlike ephemeral `/tmp` storage (which is isolated per execution environment and capped at 10 GB), Amazon EFS provides persistent, durable, shared file storage that can be read and written concurrently by thousands of Lambda execution environments, EC2 instances, and ECS containers.",
  "whyItMatters": "Serverless architectures often require sharing massive datasets, machine learning model artifacts (such as 20 GB PyTorch or HuggingFace models), shared analytics caches, or legacy file-based data structures across concurrent function instances. EFS integration enables serverless functions to access terabytes of persistent, POSIX-compliant file storage with local file system semantics.",
  "workplaceExample": "A computer vision inference service loads a 15 GB deep learning model. Rather than downloading the 15 GB file from S3 during every cold start (which causes 30-second cold start delays), the team stores the model weights on an Amazon EFS volume. The Lambda function mounts the EFS volume at `/mnt/models`, allowing all concurrent function instances to read the model directly from local memory-mapped files in milliseconds.",
  "examFocus": "Understand requirements for attaching Amazon EFS to AWS Lambda: (1) VPC Configuration: Both the Lambda function and the EFS mount targets MUST reside in the same Amazon VPC. (2) EFS Access Point: Lambda requires an EFS Access Point to enforce POSIX user identity (UID/GID) and restrict access to a specific directory path. (3) Permissions: The Lambda execution role requires permissions to connect to the VPC (`AWSLambdaVPCAccessExecutionRole`) and manage client mounts (`elasticfilesystem:ClientMount`, `elasticfilesystem:ClientWrite`).",
  "keyPoints": [
    "Provides persistent, shared, POSIX-compliant file system storage across thousands of concurrent Lambda instances.",
    "Eliminates storage size limits; scales automatically to petabytes without provisioning storage in advance.",
    "Requires Lambda function to be configured with VPC integration in the same VPC as EFS mount targets.",
    "Uses an Amazon EFS Access Point to manage directory permissions and enforce POSIX user/group IDs.",
    "Ideal for large machine learning model inference, shared data caching, and processing large file archives.",
    "Provides concurrent read and write operations with strong consistency across distributed serverless functions."
  ],
  "commonMistake": "Attempting to mount Amazon EFS without configuring the Lambda function inside a VPC. Amazon EFS relies on NFS network protocols over private IP addresses and cannot be mounted by Lambda functions that are not VPC-enabled.",
  "example": "Configure a Lambda function to mount an EFS Access Point using the AWS CLI: aws lambda update-function-configuration --function-name ml-inference --file-system-configs 'Arn=arn:aws:elasticfilesystem:us-east-1:123456789012:access-point/fsap-0123456789abcdef0,LocalMountPath=/mnt/models'.",
  "sources": [
    {
      "title": "Configuring a File System for a Lambda Function (Amazon EFS)",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-filesystem.html"
    },
    {
      "title": "Using Amazon EFS with AWS Lambda",
      "url": "https://docs.aws.amazon.com/efs/latest/ug/efs-lambda.html"
    }
  ]
});
