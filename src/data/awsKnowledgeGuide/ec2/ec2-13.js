import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-13',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 On-Demand Instances',
  status: 'ready',
  plainEnglish: 'On-Demand Instances allow you to pay for compute capacity by the second or hour with no long-term commitments or upfront payments. You can launch, stop, restart, or terminate instances at any time, paying only for the exact duration the instance is running.',
  whyItMatters: 'On-Demand provides absolute flexibility. It is perfect for short-term, unpredictable, or newly launched workloads where you cannot predict usage patterns or commit to 1-year or 3-year contracts.',
  workplaceExample: 'A software team launches 10 On-Demand instances for a 2-week performance load test. Once the load test finishes, they terminate all 10 instances immediately, paying only for the exact hours consumed.',
  examFocus: 'SAA-C03 purchasing option rules for On-Demand:\n- Highest cost per hour compared to Reserved/Spot/Savings Plans.\n- No upfront cost, no long-term commitment.\n- Best for short-term, spikey, or unpredictable workloads that CANNOT be interrupted.\n- Best when testing new applications before committing to long-term plans.',
  keyPoints: [
    'Pay-as-you-go pricing per second (Linux) or per hour (Windows).',
    'No upfront payment or long-term contract commitment.',
    'Cannot be interrupted by AWS (unlike Spot Instances).',
    'Highest hourly rate among EC2 pricing models.',
    'Ideal for short-term, unpredictable, or newly deployed workloads.'
  ],
  commonMistake: 'Leaving production workloads running on On-Demand pricing continuously for 3 years without purchasing Savings Plans or Reserved Instances, resulting in 40-72% higher compute costs.',
  example: 'On-Demand Lifecycle:\nLaunch Instance -> Runs for 3 hours 15 minutes -> Terminated.\nBilling: Billed for exact 3 hours 15 minutes at standard rate.',
  sources: [
    { title: 'On-Demand Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html' }
  ]
});
