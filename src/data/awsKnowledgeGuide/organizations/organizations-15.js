import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'organizations-15',
  topicId: 'topic-organizations',
  topicTitle: 'AWS Organizations',
  objectiveCode: 'Management',
  title: 'Volume Pricing Benefits',
  status: 'ready',
  plainEnglish: 'Volume Pricing Benefits allow an organization to pool data transfer and storage usage across all member accounts to reach higher usage thresholds, automatically unlocking cheaper per-unit volume pricing tiers (such as Amazon S3 tiering and EC2 data transfer out discounts) that an individual account could not achieve on its own.',
  whyItMatters: 'AWS pricing decreases per GB as consumption increases (e.g. S3 storage costs drop after the first 50 TB). Pooling usage across 50 member accounts reaches lower per-GB pricing tiers much faster, reducing total cloud spend across the enterprise.',
  workplaceExample: 'An enterprise has 10 member accounts storing 10 TB in S3 each (100 TB total). Individually, each account would pay top-tier rates for all 10 TB. Under Consolidated Billing, AWS treats the usage as 100 TB, unlocking the cheaper >50 TB volume rate for the organization.',
  examFocus: 'SAA-C03 Volume Discount Sharing Mechanics:\n- Usage Aggregation: S3 storage and Data Transfer Out usage are aggregated across all member accounts.\n- Reserved Instance (RI) Sharing: Unused RIs purchased in one account automatically apply discounts to matching instance usage in other member accounts.\n- Savings Plans Sharing: Unused Savings Plans commitments apply across all member accounts under Consolidated Billing.\n- Discount Sharing Toggle: Organization admins can disable RI/Savings Plan discount sharing for specific accounts if needed.',
  keyPoints: [
    'Aggregates usage across accounts to reach lower volume pricing tiers faster.',
    'Applies to Amazon S3 storage, Data Transfer Out, and API call volumes.',
    'Automatically shares Reserved Instance (RI) and Savings Plans discounts across accounts.',
    'Reduces overall cloud spend without modifying application architecture.',
    'Discount sharing settings can be customized or disabled per account in billing console.'
  ],
  commonMistake: 'Assuming that Reserved Instance discounts purchased in Account A cannot be applied to workloads running in Account B. RI discounts are shared across the organization by default.',
  example: 'Reserved Instance Sharing Example:\n- Account-A purchases 5 EC2 r6g.large Reserved Instances but only runs 2.\n- Account-B runs 3 r6g.large instances.\n- Result: AWS automatically applies Account-A\'s 3 unused RI discounts to Account-B\'s instances under Consolidated Billing.',
  sources: [
    { title: 'Volume discounts and AWS Organizations', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_financial-benefits.html' }
  ]
});
