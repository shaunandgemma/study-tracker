import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-7",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "CloudFormation Stacks",
  "status": "ready",
  "plainEnglish": "A CloudFormation Stack is a single logical unit of management created when AWS processes your template. All the AWS resources defined in a template—such as EC2 instances, S3 buckets, and IAM roles—are created, updated, or deleted together as a single stack. When you delete a stack, CloudFormation automatically cleans up and deletes all the AWS resources that belong to that stack, preventing orphaned infrastructure and lingering charges.",
  "whyItMatters": "Stacks manage the lifecycle of connected resources as a single entity. Instead of deleting 50 individual security rules, subnets, and servers by hand when decommissioning a test environment, you simply delete the stack and AWS handles the rest cleanly.",
  "workplaceExample": "An e-commerce developer launches a stack named dev-payment-service-stack to test a new feature. After testing is complete, deleting the stack removes the S3 bucket, DynamoDB table, and Lambda functions in one atomic step.",
  "examFocus": "For SAA-C03, compare single CloudFormation Stacks with StackSets. A Stack manages resources in a single AWS account and region, whereas a StackSet deploys and manages stacks across multiple AWS accounts and multiple Regions simultaneously. Also understand termination protection, which prevents accidental deletion of critical production stacks.",
  "keyPoints": [
    "A stack is a collection of AWS resources managed together as a single unit defined by a template.",
    "Deleting a stack deletes all AWS resources created by that stack in dependency order.",
    "Termination protection can be enabled on critical production stacks to prevent accidental stack deletion.",
    "Stack status messages (e.g., CREATE_COMPLETE, ROLLBACK_IN_PROGRESS) provide real-time deployment visibility.",
    "A stack exists within a specific single AWS account and a single AWS Region."
  ],
  "commonMistake": "Attempting to delete a single resource directly from the AWS Console while it belongs to an active CloudFormation stack, which causes drift and can lead to stack update failures. Always update or delete resources by updating or deleting the stack itself.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Production application stack with core database resource.\nResources:\n  ApplicationDatabase:\n    Type: AWS::DynamoDB::Table\n    Properties:\n      TableName: ProductionOrders\n      AttributeDefinitions:\n        - AttributeName: OrderId\n          AttributeType: S\n      KeySchema:\n        - AttributeName: OrderId\n          KeyType: HASH\n      BillingMode: PAY_PER_REQUEST",
  "sources": [
    {
      "title": "Working with Stacks",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html"
    },
    {
      "title": "Protecting a Stack From Being Deleted",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-protect-stacks.html"
    }
  ]
});
