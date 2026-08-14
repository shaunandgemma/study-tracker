import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-12', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch with EC2 Spot Instances', status: 'ready',
  plainEnglish: 'EC2 Spot lets Batch use spare EC2 capacity at a reduced price, but AWS can interrupt that capacity. Batch can select from multiple instance pools and reschedule eligible failed work according to the job retry strategy.',
  whyItMatters: 'Large fault-tolerant batch workloads can achieve substantial savings when applications checkpoint progress and safely retry interrupted units of work.',
  workplaceExample: 'A rendering farm divides a film into small independent frames, stores outputs in S3, uses diversified Spot instance families, and retries any frame interrupted before completion.',
  examFocus: 'Use Spot for flexible, interruption-tolerant workloads. Diversify instance types and prefer SPOT_PRICE_CAPACITY_OPTIMIZED in most cases. Retain On-Demand capacity for work that cannot tolerate interruption or deadline risk.',
  keyPoints: ['Spot capacity can be interrupted.', 'Diversifying instance families gives Batch more capacity pools.', 'Allocation strategy balances capacity availability and price.', 'Jobs should be idempotent and checkpoint durable progress.', 'Retries do not replace correct application recovery design.'],
  commonMistake: 'Using Spot for a long, stateful job that cannot resume, then expecting Batch to preserve in-memory progress after interruption.',
  example: 'Split a six-hour calculation into independent chunks, write checkpoints to S3, choose several compatible instance families, and configure selective retries.',
  sources: [{ title: 'AWS Batch Spot best practices', url: 'https://docs.aws.amazon.com/batch/latest/userguide/bestpractice6.html' }, { title: 'Instance allocation strategies', url: 'https://docs.aws.amazon.com/batch/latest/userguide/allocation-strategies.html' }]
});
