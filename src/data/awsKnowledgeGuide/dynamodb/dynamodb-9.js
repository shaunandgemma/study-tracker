import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'dynamodb-9', topicId: 'topic-dynamodb', topicTitle: 'Amazon DynamoDB', objectiveCode: 'Databases', title: 'DynamoDB On-Demand Capacity Mode', status: 'ready',
  plainEnglish: 'On-demand mode charges for the read and write request units the application consumes and automatically accommodates traffic without configuring read or write capacity units in advance.',
  whyItMatters: 'It reduces capacity planning for new, unpredictable, intermittent, or rapidly changing workloads.',
  workplaceExample: 'A newly launched application has unknown adoption. The team begins with on-demand mode, observes request patterns, and avoids guessing an initial provisioned capacity.',
  examFocus: 'Choose on-demand for unpredictable or spiky usage and provisioned mode for predictable workloads where capacity can be planned and optimized. On-demand still has account and partition limits and can throttle extreme traffic that rises much faster than the established peak.',
  keyPoints: ['No RCU or WCU values are configured.', 'Billing is based on request units consumed.', 'The mode automatically adapts capacity.', 'It suits unpredictable and intermittent workloads.', 'Good partition-key design remains essential.'],
  commonMistake: 'Believing on-demand eliminates every throughput limit or protects a single hot partition from poor key design.',
  example: 'Use on-demand for an irregular event-registration table, then review cost and traffic before deciding whether predictable usage justifies provisioned mode.',
  sources: [{ title: 'DynamoDB read/write capacity modes', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html' }, { title: 'On-demand capacity mode', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/on-demand-capacity-mode.html' }]
});
