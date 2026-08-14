import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-4",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "CloudFormation Infrastructure as Code",
  "status": "ready",
  "plainEnglish": "AWS CloudFormation is an Infrastructure as Code (IaC) service that allows you to define your entire AWS infrastructure—such as virtual servers, network subnets, and database instances—in code files called templates. Instead of manually clicking buttons in the AWS Management Console or running command-line scripts step by step, you write down the desired end state of your infrastructure. CloudFormation then reads this file and automatically creates, configures, and connects all specified resources in the correct order.",
  "whyItMatters": "Cloud engineers and AWS architects rely on Infrastructure as Code to make infrastructure deployments repeatable, documented, and version-controlled. If a region fails or a dev environment is needed, CloudFormation can recreate identical environments in minutes without human error or missing steps.",
  "workplaceExample": "A fintech startup needs identical staging and production environments. Instead of manually re-creating 20 VPC subnets, security groups, and RDS databases in each account, engineers write one CloudFormation template and deploy it to both environments with environment-specific parameters.",
  "examFocus": "For SAA-C03, remember that CloudFormation provides automated provisioning, state management, and rollback on failure at no extra charge (you pay only for the AWS resources created). Understand that IaC prevents configuration drift and manual human error during disaster recovery or multi-environment rollouts.",
  "keyPoints": [
    "Infrastructure as Code (IaC) models AWS resources as code files that can be stored in version control systems like Git.",
    "CloudFormation is a declarative service: you describe the desired end state, and AWS determines the exact API steps required.",
    "Declarative provisioning eliminates manual configuration steps and reduces human configuration errors across environments.",
    "There is no additional fee for using CloudFormation itself; you pay standard rates for the underlying AWS resources created.",
    "Infrastructure changes can be peer-reviewed, audited, and rolled back safely if an error occurs during deployment."
  ],
  "commonMistake": "Building production infrastructure manually using the AWS Console instead of template files, making it impossible to audit changes, track history in Git, or reliably recreate the environment during a disaster recovery event. Use CloudFormation templates stored in version control for all production infrastructure.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Basic CloudFormation template defining a single S3 bucket for IaC deployment.\nResources:\n  AppStorageBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: my-company-app-storage-bucket-2026\n      VersioningConfiguration:\n        Status: Enabled",
  "sources": [
    {
      "title": "What is AWS CloudFormation?",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html"
    },
    {
      "title": "Infrastructure as Code with AWS CloudFormation",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html"
    }
  ]
});
