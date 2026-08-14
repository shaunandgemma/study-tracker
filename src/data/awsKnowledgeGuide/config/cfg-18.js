import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-18',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'AWS Config vs CloudWatch',
  status: 'ready',
  plainEnglish: 'AWS Config and Amazon CloudWatch both monitor your AWS environment, but they measure completely different operational dimensions:\n- AWS Config monitors RESOURCE CONFIGURATION AND COMPLIANCE (e.g. Is S3 encrypted? Are security group rules compliant? What is the resource timeline?).\n- Amazon CloudWatch monitors OPERATIONAL PERFORMANCE AND METRICS (e.g. What is EC2 CPU utilization? How many HTTP 5xx errors occurred? What are the application logs?).',
  whyItMatters: 'Understanding when to use CloudWatch versus AWS Config ensures proper monitoring architecture. You use CloudWatch to auto-scale servers based on traffic load, and AWS Config to audit whether those servers adhere to corporate security compliance rules.',
  workplaceExample: 'An e-commerce website uses both services:\n- CloudWatch monitors EC2 CPU utilization (85%) and triggers an Auto Scaling policy to add capacity.\n- AWS Config evaluates whether those new EC2 instances have EBS volume encryption enabled and belong to authorized VPC subnets.',
  examFocus: 'SAA-C03 distinction:\n- Numerical metrics, performance thresholds, CPU/memory stats, application log streams, alarms -> Amazon CloudWatch.\n- Configuration state, resource property auditing, security compliance rules, baseline compliance -> AWS Config.',
  keyPoints: [
    'AWS Config: Evaluates resource configuration state and rule compliance.',
    'CloudWatch: Collects numerical metrics, performance logs, and triggers operational alarms.',
    'CloudWatch metrics answer "How much / How fast?"; AWS Config answers "How is it configured / Is it compliant?".',
    'CloudWatch Alarms trigger Auto Scaling or EC2 actions; AWS Config triggers SSM Automation remediation.',
    'Both services integrate with Amazon EventBridge for event-driven automation.'
  ],
  commonMistake: 'Trying to create a CloudWatch Alarm to evaluate whether S3 buckets have public access blocked. Public access block is a configuration setting checked by AWS Config, not a performance metric.',
  example: 'Monitoring Use Cases:\nUse Case A: "Alarm if ALB 5xx error rate exceeds 5%" -> Amazon CloudWatch.\nUse Case B: "Flag if ALB is missing an attached AWS WAF Web ACL" -> AWS Config.',
  sources: [
    { title: 'What is AWS Config?', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' }
  ]
});
