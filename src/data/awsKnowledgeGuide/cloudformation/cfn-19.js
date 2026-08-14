import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-19",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Nested Stacks",
  "status": "ready",
  "plainEnglish": "A Nested Stack is a CloudFormation stack that is created inside another 'parent' CloudFormation stack using the AWS::CloudFormation::Stack resource type. Instead of declaring thousands of lines of raw resources in a single monolithic template file, you break your infrastructure down into smaller, modular child templates (such as a VPC template, a Database template, and an App Server template). The parent template calls these child templates via their Amazon S3 URLs, passing parameters and receiving output attributes between them.",
  "whyItMatters": "Nested Stacks allow cloud engineers to build modular, reusable infrastructure components. Large templates easily become unmaintainable and hit CloudFormation file size limits (512 KB) or resource limits (500 resources). Modularizing templates into nested stacks promotes reuse across multiple application teams.",
  "workplaceExample": "An enterprise devops team maintains a standard VPC child template stored in S3 (s3://company-templates/vpc.yaml). Ten different application teams deploy their own parent templates, each declaring a nested stack resource referencing the shared vpc.yaml template.",
  "examFocus": "For SAA-C03, compare Nested Stacks with Cross-Stack References (Exports/Imports): Nested Stacks are used when templates are authored by the same team, share the exact same lifecycle, and form a single parent-child stack hierarchy (updated and deleted together via the root stack). Cross-Stack References are used when infrastructure components (like a shared core VPC) are managed independently by different teams with separate lifecycles.",
  "keyPoints": [
    "Nested stacks are declared inside a parent template using the AWS::CloudFormation::Stack resource.",
    "Child templates must be hosted in an Amazon S3 bucket accessible to CloudFormation.",
    "Parent templates pass values to child templates using the Parameters property block.",
    "Attributes from child stacks are accessed in the parent template using !GetAtt ChildStack.Outputs.OutputName.",
    "Updating or deleting the root parent stack updates or deletes all nested child stacks in proper order."
  ],
  "commonMistake": "Using Nested Stacks for core network infrastructure that needs to outlive application deployments. Because deleting the parent stack deletes all nested child stacks, application teams can accidentally destroy shared network subnets. Use Cross-Stack References (Export/ImportValue) for independent core networks instead.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Parent template declaring a modular VPC child stack.\nResources:\n  NetworkStack:\n    Type: AWS::CloudFormation::Stack\n    Properties:\n      TemplateURL: https://s3.amazonaws.com/my-templates-bucket/vpc-child-template.yaml\n      Parameters:\n        VpcCidr: 10.50.0.0/16\nOutputs:\n  VpcIdFromChild:\n    Value: !GetAtt NetworkStack.Outputs.VpcId",
  "sources": [
    {
      "title": "Working with Nested Stacks",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html"
    },
    {
      "title": "AWS::CloudFormation::Stack Resource Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stack.html"
    }
  ]
});
