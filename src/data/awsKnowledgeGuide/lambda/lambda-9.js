import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "topicId": "topic-lambda",
  "topicTitle": "AWS Lambda",
  "objectiveCode": "Compute",
  "status": "ready",
  "id": "lambda-9",
  "title": "Lambda Resource-Based Policies",
  "plainEnglish": "A Lambda Resource-Based Policy is an access control policy attached directly to a Lambda function (or alias/version) that dictates which AWS services, accounts, or IAM principals have permission to invoke that function. While an Execution Role controls what the function can DO, a Resource-Based Policy controls who can TRIGGER the function.",
  "whyItMatters": "Services like Amazon S3, Amazon SNS, Amazon EventBridge, and Amazon API Gateway do not assume your function's execution role to invoke it; instead, Lambda's service checks the function's resource-based policy to verify that the calling service or account has explicit permission to call `lambda:InvokeFunction`.",
  "workplaceExample": "A developer configures an S3 bucket in Account A to invoke a Lambda function in Account B whenever a new file is uploaded. In Account B, the developer adds a statement to the Lambda function's resource-based policy granting `lambda:InvokeFunction` to the `s3.amazonaws.com` service principal with a condition that the `aws:SourceArn` matches the specific S3 bucket ARN.",
  "examFocus": "Understand resource-based policies: (1) Used by push-based event sources (S3, SNS, EventBridge, API Gateway, CloudWatch Alarms, Alexa Skills) and cross-account callers to invoke the function. (2) Always enforce condition keys like `aws:SourceArn` or `aws:SourceAccount` to prevent the 'confused deputy' security problem. (3) Added using the `aws lambda add-permission` CLI command.",
  "keyPoints": [
    "Attached directly to the Lambda function resource to grant invocation permissions (lambda:InvokeFunction).",
    "Controls which AWS service principals (e.g., s3.amazonaws.com, apigateway.amazonaws.com) or external AWS accounts can invoke the function.",
    "Essential for cross-account Lambda invocations without requiring the caller to assume an IAM role.",
    "Supports fine-grained scoping to specific versions or aliases (e.g., granting API Gateway access only to the 'prod' alias).",
    "Must include `aws:SourceArn` or `aws:SourceAccount` condition keys to mitigate confused deputy vulnerabilities.",
    "Configured via the AWS Console triggers UI or using the `aws lambda add-permission` CLI command."
  ],
  "commonMistake": "Confusing the Lambda Execution Role with a Resource-Based Policy. The Execution Role grants the function permissions to call external AWS APIs (like DynamoDB or S3); the Resource-Based Policy grants external services permission to invoke the Lambda function.",
  "example": "Grant Amazon S3 permission to invoke a Lambda function using the AWS CLI: aws lambda add-permission --function-name resize-image --statement-id s3-trigger --action lambda:InvokeFunction --principal s3.amazonaws.com --source-arn arn:aws:s3:::my-upload-bucket --source-account 123456789012.",
  "sources": [
    {
      "title": "Using Resource-Based Policies for AWS Lambda",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html"
    },
    {
      "title": "Granting Function Access to AWS Services",
      "url": "https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html#permissions-resource-serviceinvoke"
    }
  ]
});
