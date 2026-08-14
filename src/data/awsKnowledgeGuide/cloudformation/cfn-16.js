import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  "id": "cfn-16",
  "topicId": "topic-cloudformation",
  "topicTitle": "AWS CloudFormation",
  "objectiveCode": "Management",
  "title": "Change Sets",
  "status": "ready",
  "plainEnglish": "A Change Set is a preview feature in CloudFormation that lets you see the exact modifications CloudFormation will perform on your stack before applying an update. When you submit a modified template, instead of updating the live stack immediately, you generate a Change Set. AWS evaluates the template against the running stack and returns a detailed summary showing which resources will be added, modified, or deleted, and whether any existing resources will undergo replacement (recreation with downtime).",
  "whyItMatters": "Change Sets act as a safety buffer for infrastructure updates. Executing direct stack updates blindly can accidentally cause database instances or core network interfaces to be replaced, causing unexpected downtime or data loss. Change Sets give engineers the opportunity to review and approve changes safely.",
  "workplaceExample": "A database engineer updates a CloudFormation template to change RDS storage settings. Before executing the update on the production stack, they generate a Change Set and verify that the change type is Modify with Evaluation: Static and no replacement, ensuring zero downtime.",
  "examFocus": "On the SAA-C03 exam, compare Direct Stack Updates with Change Sets. Direct updates execute immediately without previewing. Change Sets provide a two-step update process (Create Change Set -> Review -> Execute Change Set) that explicitly highlights resource replacements, making it the required best practice for critical production stack updates.",
  "keyPoints": [
    "Change Sets allow you to preview proposed stack changes before applying them to live infrastructure.",
    "Highlights whether resource updates will occur in-place or require resource replacement.",
    "Displays action summaries: Add, Modify, or Remove for every affected resource.",
    "Follows a two-step process: Create/View Change Set, then Execute or Delete the Change Set.",
    "Helps prevent accidental outages caused by unexpected resource replacements during stack updates."
  ],
  "commonMistake": "Executing direct stack updates on production databases without creating a Change Set first, leading to unplanned database replacements and service downtime. Always generate and inspect a Change Set before updating production stacks.",
  "example": "AWSTemplateFormatVersion: '2010-09-09'\nDescription: Template updated via Change Set to modify S3 lifecycle configuration.\nResources:\n  LogStorageBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: my-company-audit-logs-2026\n      LifecycleConfiguration:\n        Rules:\n          - Id: TransitionToGlacier\n            Status: Enabled\n            Transitions:\n              - StorageClass: GLACIER\n                TransitionInDays: 90",
  "sources": [
    {
      "title": "Updating Stacks Using Change Sets",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html"
    },
    {
      "title": "Viewing a Change Set",
      "url": "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets-view.html"
    }
  ]
});
