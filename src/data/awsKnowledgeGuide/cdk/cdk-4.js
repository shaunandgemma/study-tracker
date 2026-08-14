import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cdk-4",
  "topicId": "topic-cdk",
  "topicTitle": "AWS CDK (Cloud Development Kit)",
  "objectiveCode": "Management",
  "title": "AWS CDK Infrastructure as Code",
  "status": "ready",
  "plainEnglish": "AWS Cloud Development Kit (AWS CDK) is an open-source software development framework that lets you define and provision cloud infrastructure using familiar modern programming languages (such as TypeScript, Python, Java, C#, and Go) instead of writing raw JSON or YAML configuration files. Behind the scenes, the AWS CDK synthesizes your high-level code into standard AWS CloudFormation templates and deploys them reliably using CloudFormation's deployment engine.",
  "whyItMatters": "Raw JSON/YAML templates can span thousands of lines and lack programming features like loops, conditionals, type-safety, code completion, unit testing, and inheritance. With AWS CDK, developers and architects can create reusable, object-oriented cloud components (Constructs), share company-wide security standards as libraries (npm/pip packages), and test infrastructure using standard software testing frameworks (Jest, pytest).",
  "workplaceExample": "A platform engineering team builds a custom internal TypeScript library named `@corp/secure-microservice` that bundles an ECS Fargate cluster, Application Load Balancer, VPC subnets, and IAM least-privilege roles adhering to corporate security guardrails. Product teams consume this construct in just 5 lines of TypeScript CDK code to launch compliant microservices across AWS accounts.",
  "examFocus": "For SAA-C03, understand CDK fundamentals: (1) CDK code is written in general-purpose languages (TypeScript, Python, Java, C#, Go). (2) CDK does NOT deploy infrastructure directly; it compiles (synthesizes) down to AWS CloudFormation templates. (3) Key hierarchy: App -> Stacks (map 1:1 with CloudFormation stacks) -> Constructs (reusable cloud components). (4) Requires `cdk bootstrap` before deploying assets to provision S3 buckets and IAM roles used by CDK.",
  "keyPoints": [
    "Open-source IaC framework supporting TypeScript, Python, Java, C# (.NET), and Go.",
    "Synthesizes high-level programming constructs into standard AWS CloudFormation templates.",
    "Hierarchy: App (root) contains one or more Stacks, which contain reusable Constructs.",
    "Construct levels: L1 (raw Cfn resources), L2 (AWS curated with defaults), L3 (solution patterns).",
    "Enables object-oriented design, loops, conditions, code completion, and unit testing for IaC.",
    "Requires `cdk bootstrap` in an AWS account/Region to store deployment assets and templates."
  ],
  "commonMistake": "Thinking AWS CDK replaces CloudFormation. CDK is built ON TOP OF CloudFormation; CloudFormation remains the underlying deployment, rollback, and state management engine that actually provisions the AWS resources.",
  "example": "// Example TypeScript CDK Stack defining an encrypted S3 bucket and DynamoDB table:\nimport * as cdk from 'aws-cdk-lib';\nimport * as s3 from 'aws-cdk-lib/aws-s3';\nimport * as dynamodb from 'aws-cdk-lib/aws-dynamodb';\nimport { Construct } from 'constructs';\n\nexport class WebAppStack extends cdk.Stack {\n  constructor(scope: Construct, id: string, props?: cdk.StackProps) {\n    super(scope, id, props);\n\n    const bucket = new s3.Bucket(this, 'DataBucket', {\n      encryption: s3.BucketEncryption.S3_MANAGED,\n      removalPolicy: cdk.RemovalPolicy.RETAIN,\n      versioned: true,\n    });\n  }\n}",
  "sources": [
    {
      "title": "What is the AWS Cloud Development Kit (AWS CDK)?",
      "url": "https://docs.aws.amazon.com/cdk/v2/guide/home.html"
    },
    {
      "title": "AWS CDK Core Concepts",
      "url": "https://docs.aws.amazon.com/cdk/v2/guide/core-concepts.html"
    },
    {
      "title": "Best Practices for Developing Cloud Applications with AWS CDK",
      "url": "https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html"
    }
  ]
});
