import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-14',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Reserved Instances',
  status: 'ready',
  plainEnglish: 'EC2 Reserved Instances (RIs) provide a significant discount (up to 72%) compared to On-Demand pricing in exchange for committing to use a specific instance configuration for a 1-year or 3-year term. RIs are not physical instances; they are a billing discount applied automatically to matching running EC2 instances in your account. Standard RIs provide fixed instance attributes, while Convertible RIs allow modifying instance families, OS, or tenancy during the term.',
  whyItMatters: 'For production workloads that run continuously 24/7 (such as primary database servers or backend services), purchasing Reserved Instances dramatically reduces annual AWS compute expenditure.',
  workplaceExample: 'A logistics firm runs a production MySQL database on an r6i.2xlarge instance 24/7/365. By purchasing a 3-year All Upfront Reserved Instance contract, their hourly cost drops by 60%, saving over $4,000 per year on that single server.',
  examFocus: 'SAA-C03 RI Types and Features:\n- Standard RIs: Up to 72% discount. Cannot change instance family. Can sell on RI Marketplace.\n- Convertible RIs: Up to 54% discount. Allows changing instance family, OS, and tenancy.\n- Zonal RIs: Provides capacity reservation in a specific AZ in addition to billing discount.\n- Payment Options: No Upfront, Partial Upfront, All Upfront (higher upfront = higher discount).',
  keyPoints: [
    'Provides up to 72% discount for 1-year or 3-year term commitments.',
    'Billing discount mechanism applied automatically to matching EC2 instances.',
    'Standard RIs offer maximum discount; Convertible RIs offer family/OS flexibility.',
    'Payment tiers: No Upfront, Partial Upfront, All Upfront.',
    'Best for steady-state, predictable, continuous 24/7 production workloads.'
  ],
  commonMistake: 'Purchasing a 3-year Standard RI for an experimental application that might be re-architected or decommissioned in 6 months. Standard RIs cannot be converted to a different instance family.',
  example: 'Reserved Instance Purchasing Option:\nContract: 3-Year Standard RI, All Upfront\nInstance Type: `c6g.xlarge` in `us-east-1`\nResult: 62% cost savings compared to On-Demand rate.',
  sources: [
    { title: 'Reserved Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html' }
  ]
});
