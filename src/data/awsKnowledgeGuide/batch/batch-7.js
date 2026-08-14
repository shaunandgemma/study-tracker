import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-7', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Job Queues', status: 'ready',
  plainEnglish: 'A job queue holds submitted jobs until the Batch scheduler can place them. A queue has a priority and connects to one or more compatible compute environments in a defined order. Higher-priority queues are considered before lower-priority queues when they share capacity.',
  whyItMatters: 'Queues let an organization separate urgent, routine, and low-cost work while using common compute capacity.',
  workplaceExample: 'Production reconciliation uses a high-priority queue, while optional historical reports use a lower-priority queue linked to the same compute environment.',
  examFocus: 'Queue priority applies between queues associated with the same compute resources. Compute-environment order provides placement preference within a queue. A queue and its job definition must be compatible with the target platform capability.',
  keyPoints: ['Jobs are submitted to a specific queue.', 'A queue can reference multiple compute environments.', 'Queue priority influences access to shared capacity.', 'Queues can use FIFO or fair-share scheduling.', 'Disabling a queue prevents scheduling while preserving configuration.'],
  commonMistake: 'Creating a high-priority queue but attaching it to completely separate capacity, then expecting it to pre-empt jobs in another environment. Queue priority matters when queues compete for shared compute resources.',
  example: 'Attach urgent and standard queues to the same environment with priorities 100 and 10. Eligible urgent work is considered first when capacity becomes available.',
  sources: [{ title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }, { title: 'Job queues', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_queues.html' }]
});
