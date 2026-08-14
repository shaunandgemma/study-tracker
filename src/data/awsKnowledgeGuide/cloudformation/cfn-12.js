import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-12",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Outputs",
  "status": "ready",
  "plainEnglish": "The Outputs section declares custom return values that CloudFormation displays after a stack is successfully created or updated. Outputs can display information such as an EC2 instance's public IP address, a Load Balancer DNS name, or an S3 bucket ARN in the AWS Console and CLI. In addition, outputs can be exported using an Export block, allowing other independent CloudFormation stacks in the same Region to import and reuse those values.",
  "whyItMatters": "Outputs make important stack details easily accessible to administrators and downstream systems. Instead of forcing engineers to search through the AWS Management Console to find a newly created database endpoint or VPC subnet ID, the stack outputs present those exact values immediately upon deployment.",
  "workplaceExample": "A infrastructure team provisions a shared VPC stack. In the Outputs section, they expose VpcId and PublicSubnet1Id with export names (SharedVpcId and SharedPublicSubnet1). Later, application teams import these subnet IDs into their own application stacks.",
  "examFocus": "For SAA-C03, compare local Outputs with Cross-Stack Exports. Local outputs simply print values to the console/CLI for human viewing. Exported outputs (using Export: Name: ...) make values available across stacks in the same account and Region via !ImportValue. Remember that an exported output cannot be modified or deleted while another stack is actively importing it.",
  "keyPoints": [
    "Outputs declare useful return values displayed after stack completion in the Console, CLI, or APIs.",
    "Output values can reference resource attributes using !Ref or !GetAtt.",
    "Exporting an output value using Export: Name: enables cross-stack referencing via !ImportValue.",
    "Export names must be unique within a given AWS account and Region.",
    "A stack exporting a value cannot be deleted or updated to remove the export while imported by another stack."
  ],
  "commonMistake": "Attempting to delete or modify an exported output value in a base network stack while an application stack is currently importing that value, causing stack update rejection. Remove the importing stack's reference first before altering or deleting exports.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Template demonstrating stack outputs with export configuration.\nResources:\n  AppQueue:\n    Type: AWS::SQS::Queue\n    Properties:\n      QueueName: OrderProcessingQueue\nOutputs:\n  QueueURL:\n    Description: URL of the created SQS queue\n    Value: !Ref AppQueue\n    Export:\n      Name: AppOrderQueueUrl",
  "sources": [
    {
      "title": "Outputs Section Structure",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html"
    },
    {
      "title": "Exporting Stack Output Values",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-exports.html"
    }
  ]
});
