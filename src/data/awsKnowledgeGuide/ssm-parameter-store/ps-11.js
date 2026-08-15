import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ps-11',
  topicId: 'topic-ssm-parameter-store',
  topicTitle: 'AWS Systems Manager (Parameter Store)',
  objectiveCode: 'Security',
  title: 'Standard Parameters',
  status: 'ready',
  plainEnglish: 'Standard Parameters are the default, free parameter tier in AWS Systems Manager Parameter Store. Standard parameters allow storing up to 10,000 parameters per AWS account and Region, with a maximum value payload size of 4 KB per parameter, zero parameter storage charges, and a default throughput limit of 40 transactions per second (TPS).',
  whyItMatters: 'Standard Parameters provide a cost-effective solution for storing typical application configurations, environment URLs, and basic secrets without incurring additional monthly storage fees or managing dedicated server infrastructure.',
  workplaceExample: 'A startup uses Standard Parameters to store all development and testing environment settings (database hostnames, feature flags, API endpoints). Because they store under 10,000 parameters with sizes under 4 KB, their Parameter Store storage cost is $0/month.',
  examFocus: 'SAA-C03 Standard Parameter Tier Limits:\n- Storage Limit: Up to 10,000 parameters per account/region.\n- Maximum Payload Size: 4 KB per parameter.\n- Storage Cost: Free ($0/month for parameter storage).\n- Default Throughput: 40 TPS (can be increased by enabling higher throughput for a fee).\n- Parameter Policies: Parameter policies (expiration TTL, notification policies) are NOT supported in the Standard tier.',
  keyPoints: [
    'Default free parameter tier in AWS Systems Manager Parameter Store.',
    'Supports up to 10,000 parameters per AWS account and Region.',
    'Maximum parameter value payload size limit is 4 KB.',
    'Parameter storage is free of charge ($0/month).',
    'Does not support parameter policies (expiration TTL or notification rules).'
  ],
  commonMistake: 'Attempting to store large RSA private keys or SSL certificates exceeding 4 KB in a Standard parameter, causing a payload size validation error.',
  example: 'Creating a Standard Tier Parameter via AWS CLI:\naws ssm put-parameter --name "/app/dev/log-level" --value "INFO" --type "String" --tier "Standard"',
  sources: [
    { title: 'Managing parameter tiers in Systems Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html' }
  ]
});
