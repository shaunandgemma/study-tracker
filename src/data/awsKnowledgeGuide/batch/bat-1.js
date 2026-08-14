import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'bat-1', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute',
  title: 'AWS Batch Architecture: Compute Environments (Managed vs Unmanaged, Fargate vs Spot EC2)', status: 'ready',
  plainEnglish: 'AWS Batch accepts containerized jobs, holds them in job queues, and schedules them onto compute environments. A managed environment lets Batch provision and scale EC2 On-Demand, EC2 Spot, Fargate, or Fargate Spot capacity. An unmanaged environment keeps scheduling in Batch but makes you provision and scale the ECS or EKS workers yourself; Fargate is not available for unmanaged environments.',
  whyItMatters: 'The compute-environment decision controls operational effort, cost, isolation, capacity choices, and which job features are available.',
  workplaceExample: 'A rendering pipeline uses a managed Spot EC2 environment for interruption-tolerant work and a higher-priority On-Demand environment for urgent jobs. A small container job with no special host needs uses Fargate to avoid managing instances.',
  examFocus: 'Choose managed environments for automatic capacity management. Choose unmanaged only when the organization must control its existing ECS or EKS workers. Fargate removes server management; EC2 supports broader instance, GPU, AMI, and multi-node requirements; Spot reduces cost but jobs must tolerate interruption.',
  keyPoints: ['Queues connect jobs to one or more compute environments.', 'Managed environments scale supported compute resources for queued jobs.', 'Unmanaged environments require you to provision and scale workers.', 'Fargate is supported only in managed ECS compute environments.', 'Spot suits fault-tolerant jobs; On-Demand suits interruption-sensitive work.'],
  commonMistake: 'Treating a compute environment as the queue itself. The queue stores and prioritizes jobs; the compute environment supplies the capacity on which they run.',
  example: 'For nightly image processing, associate a queue with managed Spot EC2 first and an On-Demand environment second. Batch attempts to place jobs according to queue and environment order while retaining a more reliable capacity option.',
  sources: [{ title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }, { title: 'Managed compute environments', url: 'https://docs.aws.amazon.com/batch/latest/userguide/managed_compute_environments.html' }, { title: 'Unmanaged compute environments', url: 'https://docs.aws.amazon.com/batch/latest/userguide/unmanaged_compute_environments.html' }, { title: 'Fargate compute environments', url: 'https://docs.aws.amazon.com/batch/latest/userguide/fargate.html' }]
});
