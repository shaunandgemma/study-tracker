import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-17",
  "title": "Lambda Ephemeral Storage",
  "plainEnglish": "Lambda Ephemeral Storage is temporary, local disk space mounted at the `/tmp` directory inside your function's execution environment. Every Lambda function receives 512 MB of free ephemeral storage by default, which can be scaled up to 10,240 MB (10 GB) to handle intensive disk-based workloads such as large file downloads, video transcoding, PDF generation, or unpacking massive machine learning models.",
  "whyItMatters": "Serverless functions frequently process large media files, archive extracts, or data exports that exceed available RAM memory limits. Instead of provisioning an Amazon EC2 instance or mounting network storage, configuring ephemeral storage up to 10 GB allows functions to perform high-speed local disk operations directly inside the execution environment at a fraction of the cost.",
  "workplaceExample": "A geospatial analysis service downloads 4 GB satellite GeoTIFF images from Amazon S3, uncompresses them, performs raster analysis, and generates 500 MB summary maps. The engineering team configures the Lambda function with 6 GB of ephemeral storage (`/tmp`), allowing the function to process large files locally without exhausting memory.",
  "examFocus": "Understand ephemeral storage characteristics: (1) Default allocation is 512 MB, configurable up to 10,240 MB (10 GB) in 1 MB increments. (2) Always mounted at the local directory `/tmp`. (3) Encrypted at rest using an AWS owned KMS key (or Customer Managed Key). (4) Ephemeral: data in `/tmp` is temporary and may be reused across warm invocations within the same container, but is NOT durable shared storage.",
  "keyPoints": [
    "Provides local temporary scratch disk storage mounted at the `/tmp` directory path.",
    "Default storage allocation is 512 MB, configurable from 512 MB up to 10,240 MB (10 GB).",
    "Data in `/tmp` is encrypted at rest automatically using AES-256 with AWS KMS keys.",
    "Data written to `/tmp` remains available across subsequent warm invocations within the same execution environment.",
    "Not durable or shared across concurrent execution environments; durable state must be stored in S3, DynamoDB, or EFS.",
    "Ideal for unpacking large ZIP archives, temporary PDF/video rendering, and local caching of machine learning models."
  ],
  "commonMistake": "Treating `/tmp` as a durable database or assuming data written in one invocation will always be present in the next. Execution environments are ephemeral and can be recycled at any time; never rely on `/tmp` for critical state persistence.",
  "example": "Configure a Lambda function with 5,120 MB (5 GB) of ephemeral storage using the AWS CLI: aws lambda update-function-configuration --function-name satellite-raster-analyzer --ephemeral-storage '{\"Size\": 5120}'.",
  "sources": [
    {
      "title": "Configuring Ephemeral Storage in AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-ephemeral-storage.html"
    },
    {
      "title": "Working with the /tmp Directory in Lambda Execution Environments",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/runtimes-context.html"
    }
  ]
});
