import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-5', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Batch Jobs', status: 'ready',
  plainEnglish: 'A Batch job is one submitted unit of work. It has a name, references a job definition and queue, and progresses through states including SUBMITTED, PENDING, RUNNABLE, STARTING, RUNNING, and finally SUCCEEDED or FAILED. Submission-time parameters can override selected job-definition values.',
  whyItMatters: 'Job state tells an operator whether work is waiting on dependencies, waiting for capacity, starting its container, running, or finished.',
  workplaceExample: 'A finance team submits one end-of-day calculation per portfolio. Operators use job IDs and states to find failed portfolios, inspect logs, and retry only the affected work.',
  examFocus: 'PENDING normally indicates an unresolved dependency. RUNNABLE means dependencies are satisfied but suitable capacity has not yet started the job. STARTING includes image pull and container startup. Exit code zero normally produces SUCCEEDED; a non-zero exit produces FAILED.',
  keyPoints: ['Every job references a queue and job definition.', 'Job IDs uniquely identify submissions.', 'RUNNABLE jobs are eligible but may still wait for resources.', 'Array jobs repeat related work by index.', 'Multi-node parallel jobs coordinate work across nodes on supported EC2 environments.'],
  commonMistake: 'Assuming RUNNABLE means the container is running. Check compute capacity, quotas, networking, image access, and resource requirements when jobs remain RUNNABLE.',
  example: 'A job stuck in PENDING should be checked for dependencies; a job stuck in RUNNABLE should be checked for compatible vCPU, memory, instance, and capacity availability.',
  sources: [{ title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }, { title: 'AWS Batch job states', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_states.html' }]
});
