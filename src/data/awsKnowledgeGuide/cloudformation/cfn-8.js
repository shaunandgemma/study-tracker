import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-8",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Stack Creation, Update and Deletion",
  "status": "ready",
  "plainEnglish": "Stack creation, update, and deletion represent the three core lifecycle operations in CloudFormation. Creating a stack provisions new resources from a template. Updating a stack modifies an existing stack by comparing the current deployed state against a modified template and applying only the necessary changes. Deleting a stack safely tears down all resources managed by that stack. During updates, CloudFormation determines whether resources can be updated in-place or if they require replacement (destroy and recreate).",
  "whyItMatters": "Understanding stack update behaviors prevents unintended application downtime. For example, updating an EC2 instance's tag happens in-place without downtime, but changing an EC2 instance's Availability Zone forces CloudFormation to replace the instance, causing downtime if not planned properly.",
  "workplaceExample": "A sysadmin updates an existing web application stack to attach a new IAM role. CloudFormation analyzes the update, modifies the IAM role policy in-place without disrupting running web traffic, and moves the stack status to UPDATE_COMPLETE.",
  "examFocus": "For SAA-C03, compare direct stack updates with Change Sets. Direct updates execute immediately without previewing changes, whereas Change Sets allow you to preview exact resource additions, modifications, and replacements before committing the update. Also know that if an update fails, CloudFormation automatically rolls back to the last known stable state (UPDATE_ROLLBACK_COMPLETE).",
  "keyPoints": [
    "Stack lifecycle consists of Create, Update, and Delete operations managed declaratively by AWS.",
    "Updates compare the running stack against the new template and apply only necessary delta changes.",
    "Resource updates fall into three categories: No Interruption (in-place), Some Interruption, and Replacement.",
    "Replacement updates delete the old resource and provision a new one, which can change resource IDs and IP addresses.",
    "Stack rollback restores the stack to its last stable operational state if any resource creation or update fails."
  ],
  "commonMistake": "Performing direct updates on production stacks without reviewing resource replacement behaviors, accidentally triggering database or server replacements that cause data loss or downtime. Use Change Sets to inspect replacement risks before applying updates.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Template demonstrating an updateable SQS queue resource.\nResources:\n  OrderProcessingQueue:\n    Type: AWS::SQS::Queue\n    Properties:\n      QueueName: production-order-queue\n      VisibilityTimeout: 300\n      MessageRetentionPeriod: 86400",
  "sources": [
    {
      "title": "AWS CloudFormation Stacks Updates",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks.html"
    },
    {
      "title": "AWS CloudFormation Resource Update Behaviors",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html"
    }
  ]
});
