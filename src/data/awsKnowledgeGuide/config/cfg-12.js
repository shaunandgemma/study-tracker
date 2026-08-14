import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'cfg-12',
  topicId: 'topic-config',
  topicTitle: 'AWS Config',
  objectiveCode: 'Management',
  title: 'Multi-Account and Multi-Region Aggregators',
  status: 'ready',
  plainEnglish: 'An AWS Config Aggregator is a capability that collects and aggregates AWS Config configuration data and compliance status from multiple AWS accounts and multiple AWS regions into a single centralized account and region dashboard. Aggregators can aggregate data across an entire AWS Organization or across a custom list of individual AWS accounts.',
  whyItMatters: 'Enterprise cloud environments span dozens or hundreds of AWS accounts and multiple regions. Without an aggregator, security officers would have to log into every region of every account individually to check compliance.',
  workplaceExample: 'A global enterprise operates 100 AWS accounts across 10 regions worldwide. The central security team creates an AWS Config Aggregator in their Audit account integrated with AWS Organizations. The security dashboard displays a unified real-time compliance score and resource inventory across all 1,000 account-region combinations.',
  examFocus: 'SAA-C03 multi-account governance pattern: Use an AWS Config Aggregator deployed in a central Security/Audit account to aggregate compliance data across all accounts in AWS Organizations across all enabled regions. Centralized aggregators do NOT require member accounts to manually authorize if integrated with AWS Organizations.',
  keyPoints: [
    'Aggregates resource inventory and rule compliance data across multiple accounts and regions.',
    'Integrates seamlessly with AWS Organizations to cover all accounts automatically.',
    'Individual accounts can also authorize aggregation using Config Authorization requests.',
    'Provides a single centralized dashboard for enterprise-wide compliance monitoring.',
    'Supports querying aggregated compliance data across accounts using Advanced Query.'
  ],
  commonMistake: 'Configuring separate aggregators in every member account instead of setting up one central aggregator in the Organizations delegated administrator or Audit account.',
  example: 'Aggregator Configuration:\nAggregator Name: `OrganizationCentralAggregator`\nSource: AWS Organizations (All current and future accounts in Organization)\nRegions: All AWS Regions.',
  sources: [
    { title: 'Multi-Account Multi-Region Data Aggregation', url: 'https://docs.aws.amazon.com/config/latest/developerguide/aggregate-data.html' }
  ]
});
