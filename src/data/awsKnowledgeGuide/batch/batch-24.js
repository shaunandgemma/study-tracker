import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-24', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch vs Amazon ECS', status: 'ready',
  plainEnglish: 'Amazon ECS is a general container orchestrator for long-running services and standalone tasks. AWS Batch is a managed batch scheduler that uses ECS or EKS orchestration underneath supported compute environments and adds job queues, priorities, dependencies, retries, array jobs, and batch-aware capacity management.',
  whyItMatters: 'ECS gives direct control over services and tasks, while Batch removes scheduler-building work for finite jobs that can wait in a queue.',
  workplaceExample: 'A customer-facing API runs continuously as an ECS service behind a load balancer. Its nightly data compaction runs as Batch jobs because the work is finite, queueable, retryable, and can scale down to zero afterward.',
  examFocus: 'Choose ECS services for continuously running container applications with desired task counts and service load balancing. Choose Batch for asynchronous jobs needing queueing, scheduling, dependencies, retries, or large fleets. A Batch managed ECS cluster is controlled by Batch and should not host unrelated ECS services.',
  keyPoints: ['ECS orchestrates containers and services.', 'Batch adds job-oriented scheduling on supported orchestrators.', 'ECS services maintain a desired number of running tasks.', 'Batch jobs finish and enter SUCCEEDED or FAILED.', 'Batch-managed ECS resources should not be modified or reused for unrelated workloads.'],
  commonMistake: 'Treating Batch as a replacement for a continuously available ECS web service. Batch jobs are finite units of queued work, not service replicas maintained behind a load balancer.',
  example: 'Run the web application on ECS, publish heavy export requests to a workflow that submits Batch jobs, and store completed exports in S3.',
  sources: [{ title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }, { title: 'Managed compute environments', url: 'https://docs.aws.amazon.com/batch/latest/userguide/managed_compute_environments.html' }, { title: 'Choosing an AWS container service', url: 'https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html' }]
});
