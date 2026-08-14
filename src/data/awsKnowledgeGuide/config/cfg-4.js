import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-4',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'AWS Config Resource Configuration Recording',
  status: 'ready',
  plainEnglish: 'AWS Config Resource Configuration Recording is the continuous process where AWS Config tracks, records, and logs detailed inventory and configuration state changes for AWS resources (such as EC2 instances, S3 buckets, security groups, and IAM roles) in your AWS account. When a resource is created, modified, or deleted, AWS Config captures its updated configuration item (CI) and streams or saves the state change to an S3 bucket and SNS topic.',
  whyItMatters: 'Without resource recording, cloud administrators cannot answer critical compliance and security questions like "Who changed this security group to open port 22 to the world?" or "What was the exact configuration of our S3 bucket before the data breach?" Recording provides an audit trail of configuration changes over time.',
  workplaceExample: 'A DevOps engineer enables AWS Config recording across all AWS regions. When a developer modifies an EC2 security group to allow inbound HTTP access from any IP, AWS Config records the exact configuration snapshot, timestamp, and resource relationship, making the change visible in the compliance timeline.',
  examFocus: 'For SAA-C03, know that AWS Config recording can be enabled for all supported resource types in a region or customized for specific resource types. Enabling recording in every region is required for full multi-region governance. Config items are delivered to an S3 bucket (Configuration History) and can stream notifications via Amazon SNS.',
  keyPoints: [
    'Continuous recording of resource configuration items (CIs) and relationships.',
    'Tracks changes over time (creates, updates, deletes).',
    'Delivers configuration history files to an Amazon S3 bucket.',
    'Streams real-time configuration change notifications to Amazon SNS.',
    'Can record all resources in a region or selected resource types.'
  ],
  commonMistake: 'Confusing AWS Config with CloudTrail. CloudTrail records API calls ("Who made the call and when?"), whereas AWS Config records resource configuration states ("What did the resource look like before and after the change?").',
  example: 'Config Recording Setup:\nResource Types: All supported resources including global resources (IAM).\nDelivery Channel: S3 Bucket (`awsconfig-bucket-123`), SNS Topic (`arn:aws:sns:us-east-1:123456789012:config-updates`).',
  sources: [
    { title: 'Setting Up AWS Config with the Console', url: 'https://docs.aws.amazon.com/config/latest/developerguide/gs-console.html' },
    { title: 'AWS Config Concepts', url: 'https://docs.aws.amazon.com/config/latest/developerguide/config-concepts.html' }
  ]
});
