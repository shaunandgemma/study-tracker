import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ctrail-19', topicId: 'topic-cloudtrail', topicTitle: 'AWS CloudTrail', objectiveCode: 'Management', title: 'CloudTrail vs AWS Config', status: 'ready',
  plainEnglish: 'CloudTrail records actions and API activity. AWS Config records supported resource configurations, relationships, and how those configurations change over time, and can evaluate them against compliance rules. CloudTrail explains the action; Config explains resource state and compliance.',
  whyItMatters: 'Together they connect an unauthorized or accidental API call with the configuration state it produced and whether that state violates policy.',
  workplaceExample: 'Config reports that a security group became noncompliant because it allows unrestricted SSH. Its timeline shows the configuration change, while CloudTrail identifies the role and AuthorizeSecurityGroupIngress request that caused it.',
  examFocus: 'Choose CloudTrail for who called an API and from where. Choose Config for historical resource configuration, relationships, change timelines, and compliance evaluation. Use both when a scenario needs cause, resulting state, and governance.',
  keyPoints: ['CloudTrail is an activity record.', 'Config is a resource configuration and relationship record.', 'Config rules evaluate desired compliance.', 'CloudTrail captures successful and failed supported calls.', 'Combining timelines improves investigations.'],
  commonMistake: 'Expecting Config to be a complete record of every API request or expecting CloudTrail alone to evaluate whether current resources comply with a rule.',
  example: 'Use Config to find when bucket public access settings changed and CloudTrail to identify the principal and exact API request responsible.',
  sources: [{ title: 'What is AWS Config?', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' }, { title: 'CloudTrail concepts', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html' }, { title: 'AWS CloudTrail or Amazon CloudWatch?', url: 'https://docs.aws.amazon.com/decision-guides/latest/cloudtrail-or-cloudwatch/cloudtrail-or-cloudwatch.html' }]
});
