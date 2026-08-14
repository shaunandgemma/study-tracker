import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-5',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Configuration History',
  status: 'ready',
  plainEnglish: 'Configuration History is a collection of Configuration Items (CIs) recorded by AWS Config for a specific resource over a given time period. It represents a timeline or historical ledger showing every state modification, parameter update, and relationship change that occurred to that AWS resource throughout its lifecycle.',
  whyItMatters: 'Configuration History is essential for security forensics, compliance auditing, and root-cause analysis. If an outage occurs or a security vulnerability is discovered, engineers can inspect the historical timeline to pinpoint the exact configuration state change that triggered the issue.',
  workplaceExample: 'During an internal security audit, an enterprise needs to prove that an S3 bucket containing financial records remained encrypted for the past 12 months. The compliance officer pulls the Configuration History timeline from AWS Config for that bucket, verifying continuous SSE encryption compliance month by month.',
  examFocus: 'In SAA-C03 scenarios, Configuration History files are automatically delivered to an S3 bucket in JSON format periodically (every 6 hours by default). You can query this historical data directly using Amazon Athena or view the timeline in the AWS Config Console.',
  keyPoints: [
    'Timeline view of all historical configuration changes for a specific AWS resource.',
    'Stored in JSON format and delivered to an Amazon S3 bucket.',
    'Updated automatically when resource configuration changes occur.',
    'Enables point-in-time compliance checking and forensic analysis.',
    'Can be queried using Amazon Athena for custom compliance reports.'
  ],
  commonMistake: 'Expecting Configuration History to store application log files or metric data. Configuration History strictly records resource configuration attributes (e.g. tags, security group rules, bucket policies), not application logs.',
  example: 'Timeline View for Security Group `sg-0123456`:\n- 2026-08-01 10:00 UTC: Created (Inbound Port 443 open)\n- 2026-08-05 14:30 UTC: Modified (Inbound Port 22 added from 0.0.0.0/0)\n- 2026-08-05 14:35 UTC: Remediated (Inbound Port 22 removed).',
  sources: [
    { title: 'Viewing Configuration History', url: 'https://docs.aws.amazon.com/config/latest/developerguide/view-history.html' }
  ]
});
