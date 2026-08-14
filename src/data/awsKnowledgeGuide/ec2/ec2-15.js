import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-15',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Savings Plans',
  status: 'ready',
  plainEnglish: 'AWS Savings Plans is a flexible pricing model that offers up to 72% savings off On-Demand rates in exchange for a commitment to spend a specific dollar amount per hour (e.g. $10/hour) on compute services for a 1-year or 3-year term. Unlike Reserved Instances (which require choosing specific instance types or regions), Savings Plans automatically apply discounts across compute usage regardless of instance family, size, OS, region, or even compute service (EC2, Fargate, Lambda).',
  whyItMatters: 'Savings Plans provide the discount benefits of Reserved Instances with far greater flexibility. As your application architecture evolves (e.g. switching from C5 to C6g Graviton, or moving EC2 tasks to AWS Fargate), Savings Plans continue to apply discounts automatically without administrative overhead.',
  workplaceExample: 'A fintech firm commits to $50/hour of compute spend under a 3-Year Compute Savings Plan. As they migrate workloads from EC2 instances in us-east-1 to AWS Fargate containers in eu-west-1, the Savings Plan automatically applies the discount to Fargate usage without requiring contract modifications.',
  examFocus: 'SAA-C03 Savings Plan Types:\n- Compute Savings Plans: Up to 66% discount. Most flexible. Applies across EC2 instance families, sizes, OS, tenancy, regions, and services (EC2, Fargate, Lambda).\n- EC2 Instance Savings Plans: Up to 72% discount. Applies to specific instance families within a selected region (e.g. M6g in us-east-1), but allows changing size, OS, and tenancy.',
  keyPoints: [
    'Flexible commitment based on hourly spend ($/hour) for 1 or 3 years.',
    'Saves up to 72% over On-Demand rates.',
    'Compute Savings Plans cover EC2, AWS Fargate, and AWS Lambda automatically.',
    'EC2 Instance Savings Plans offer higher discounts for specific family/region commitments.',
    'Modern AWS best practice recommendation replacing legacy Reserved Instances.'
  ],
  commonMistake: 'Buying rigid Reserved Instances when Compute Savings Plans provide the same discount with seamless cross-region and cross-service (Fargate/Lambda) flexibility.',
  example: 'Compute Savings Plan Setup:\nCommitment: $20.00 / hour for 3 Years (No Upfront).\nApplicability: Automatically covers EC2 instances, Fargate tasks, and Lambda invocations globally up to $20/hr equivalent On-Demand value.',
  sources: [
    { title: 'Savings Plans Developer Guide', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html' }
  ]
});
