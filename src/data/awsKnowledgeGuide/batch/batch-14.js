import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-14', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Job Scheduling', status: 'ready',
  plainEnglish: 'The Batch scheduler decides when, where, and in what order eligible jobs run. Without a scheduling policy a queue uses FIFO. A fair-share policy allocates capacity among share identifiers, while scheduling priority can order jobs within a share. Dependencies determine whether a job is eligible at all.',
  whyItMatters: 'Scheduling prevents one user or large workload from consuming all shared capacity and lets urgent business work receive appropriate preference.',
  workplaceExample: 'Research and reporting teams share one fleet. A fair-share policy stops a large research submission from starving the reporting workload, while urgent jobs receive higher scheduling priority within their share.',
  examFocus: 'Use queue priority between queues, fair-share policy between users or workloads in a queue, and dependencies for required execution order. FIFO is the default but does not guarantee start time when resource requirements differ.',
  keyPoints: ['FIFO is the default queue scheduling strategy.', 'Fair-share uses share identifiers to distribute capacity.', 'Scheduling priority orders jobs within a share.', 'Dependencies control eligibility rather than fairness.', 'Capacity and resource compatibility still affect placement.'],
  commonMistake: 'Assuming FIFO guarantees that the oldest job always starts first. An older job that cannot fit available resources may remain RUNNABLE while another eligible job can be placed.',
  example: 'Assign finance and engineering different share identifiers, configure decay and weights, then use scheduling priority for the most urgent finance run.',
  sources: [{ title: 'Fair-share scheduling policies', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_scheduling.html' }, { title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }]
});
