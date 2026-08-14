import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ec2-21',
  topicId: 'topic-ec2',
  topicTitle: 'EC2 (Elastic Compute Cloud)',
  objectiveCode: 'Compute',
  title: 'EC2 Spot Fleet',
  status: 'ready',
  plainEnglish: 'An EC2 Spot Fleet is a collection of Spot Instances (and optionally On-Demand Instances) launched to meet a target compute capacity that you define. Spot Fleet attempts to fulfill your target capacity by selecting from multiple instance types (e.g. c5.large, c6g.large, m5.large) across multiple Availability Zones based on your chosen allocation strategy (lowest price, capacity optimized, or price capacity optimized).',
  whyItMatters: 'Relying on a single Spot instance type in a single AZ exposes you to frequent interruptions. Spot Fleet diversifies your instances across multiple families and AZs, drastically reducing interruption risk while maximizing cost savings.',
  workplaceExample: 'A big data team configures a Spot Fleet with a target capacity of 100 vCPUs. They specify 5 different instance types (c5.xlarge, c6g.xlarge, m5.xlarge, m6g.xlarge, r5.xlarge) across 3 AZs using the `capacity-optimized` allocation strategy. AWS launches instances in pools with the highest spare capacity.',
  examFocus: 'SAA-C03 Spot Fleet Allocation Strategies:\n- lowestPrice: Launches instances from the pool with the lowest price. (Higher interruption risk).\n- capacityOptimized: Launches instances from pools with the optimal spare capacity for the requested size. (Lowest interruption risk, recommended for production).\n- priceCapacityOptimized: Balances lowest price with optimal capacity.\n- Diversification: Mixed instance types across multiple AZs maximizes availability.',
  keyPoints: [
    'Manages a fleet of Spot (and optional On-Demand) instances to meet target capacity.',
    'Diversifies across multiple instance types and Availability Zones.',
    'Allocation strategies: lowestPrice, capacityOptimized, priceCapacityOptimized, diversified.',
    'Replaces interrupted instances automatically from alternative available pools.',
    'Can be managed via EC2 Auto Scaling groups using Attribute-Based Instance Selection.'
  ],
  commonMistake: 'Configuring Spot Fleet with only 1 instance type in 1 AZ. If that specific pool runs out of spare capacity, the fleet cannot launch replacement instances.',
  example: 'Spot Fleet Allocation Strategy Config:\nTarget Capacity: 50 vCPUs\nAllocation Strategy: `capacityOptimized`\nAllowed Families: `c5.xlarge`, `c6g.xlarge`, `m5.xlarge`, `m6g.xlarge` in 3 AZs.',
  sources: [
    { title: 'Spot Fleet Concepts', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-fleet.html' }
  ]
});
