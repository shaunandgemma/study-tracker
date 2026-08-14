import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-24",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "CloudFormation Exports and Imports",
  "status": "ready",
  "plainEnglish": "CloudFormation Exports and Imports (Cross-Stack References) provide a pattern for sharing values—such as VPC IDs, Subnet IDs, or Security Group IDs—between separate, independently managed CloudFormation stacks in the same AWS account and Region. One stack produces a value in its Outputs section and assigns an Export: Name. Another stack can then import that value in its resource properties using the !ImportValue intrinsic function.",
  "whyItMatters": "Decoupling infrastructure into separate stacks prevents single monolithic templates that are risky to update. A core networking team can manage a baseline VPC-Stack that exports subnet IDs, while independent application teams import those subnet IDs into their own application stacks without needing edit access to the network template.",
  "workplaceExample": "An organization maintains a baseline networking stack (networking-base.yaml). It exports ProductionPublicSubnet1. A separate microservices team writes an ECS service template that uses SubnetId: !ImportValue ProductionPublicSubnet1 to place containers into the network.",
  "examFocus": "For SAA-C03, compare Cross-Stack References (Exports/Imports) with Nested Stacks: Cross-Stack References are used when stacks have separate lifecycles and are managed independently (e.g., a shared VPC stack managed by NetOps vs app stacks managed by developers). Nested Stacks are used when modules share the exact same lifecycle and are deployed/deleted together as a single hierarchy under one root parent template. Remember: Export names must be unique within an account and Region, and an exported stack cannot be deleted while imported by active stacks.",
  "keyPoints": [
    "Enables sharing of resource attributes across independent stacks within the same account and Region.",
    "Stacks export values using Export: Name: ExportName inside the Outputs template section.",
    "Consuming stacks import exported values using the !ImportValue ExportName intrinsic function.",
    "Export names must be unique within a given AWS account and Region.",
    "An exporting stack cannot be deleted or updated to remove exports while consuming stacks actively import them."
  ],
  "commonMistake": "Trying to use !ImportValue across different AWS Regions or different AWS accounts, which is not supported natively. Cross-Stack Exports work only within the same account and same Region. Use SSM Parameter Store dynamic references for cross-region or cross-account configuration sharing.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Consuming stack template importing shared subnet ID from base network stack.\nResources:\n  ApplicationServer:\n    Type: AWS::EC2::Instance\n    Properties:\n      InstanceType: t3.micro\n      SubnetId: !ImportValue CentralVpcPublicSubnet1\n      ImageId: ami-0c55b159cbfafe1f0",
  "sources": [
    {
      "title": "Referencing Outputs in Another CloudFormation Stack",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-exports.html"
    },
    {
      "title": "!ImportValue Intrinsic Function Reference",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html"
    }
  ]
});
