import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-9",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Parameters",
  "status": "ready",
  "plainEnglish": "Parameters are custom input values that you pass into a CloudFormation template when creating or updating a stack. Instead of hardcoding values like database passwords, instance types, or environment names directly inside your template code, you define parameters. This allows a single template blueprint to be reused across different environments (such as dev, test, and production) simply by providing different parameter values at deployment time.",
  "whyItMatters": "Parameters make templates reusable and dynamic. Without parameters, you would have to maintain separate template files for development, staging, and production environments, leading to file duplication and drift across codebases.",
  "workplaceExample": "A DevOps team deploys a web application template across environments. For development, they pass the parameter InstanceType=t3.micro and EnvironmentName=dev. For production, they pass InstanceType=m5.large and EnvironmentName=prod using the exact same template file.",
  "examFocus": "For SAA-C03, compare Parameters with Mappings. Parameters receive external input at stack creation/update time (e.g., environment names, subnet IDs, SSM parameter keys). Mappings are static lookup tables hardcoded directly inside the template (e.g., mapping Region names to specific AMI IDs). Also know AWS-specific parameter types like AWS::EC2::KeyPair::KeyName and SSM Parameter Store types.",
  "keyPoints": [
    "Parameters pass custom values into a template at stack creation or update time.",
    "Parameter types include String, Number, List<Number>, CommaDelimitedList, and AWS-specific types (e.g., AWS::EC2::Subnet::Id).",
    "NoEcho: true masks sensitive input values (like passwords) in the AWS Console, CLI logs, and event history.",
    "SSM Parameter Store parameter types (AWS::SSM::Parameter::Value<String>) fetch configuration values dynamically from SSM.",
    "Up to 200 parameters can be defined in a single CloudFormation template."
  ],
  "commonMistake": "Hardcoding sensitive passwords or private configuration strings directly in template resource properties without setting NoEcho: true on parameters or using SSM Parameter Store references. Always use secure parameters or Systems Manager Parameter Store integration for secret data.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Template with input parameters for reusable environment deployment.\nParameters:\n  EnvironmentType:\n    Type: String\n    Default: dev\n    AllowedValues:\n      - dev\n      - test\n      - prod\n    Description: Target deployment environment type.\nResources:\n  AppBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: !Sub 'my-company-app-${EnvironmentType}-storage'",
  "sources": [
    {
      "title": "Parameters Section Structure",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html"
    },
    {
      "title": "Get SSM Parameters in CloudFormation Templates",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references-ssm.html"
    }
  ]
});
