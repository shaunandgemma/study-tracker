import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-4', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch Managed Batch Processing', status: 'ready',
  plainEnglish: 'AWS Batch is a managed scheduler for containerized, non-interactive work. You provide a container image, resource requirements, job definition, queue, and compute environment. Batch evaluates queued demand, places eligible jobs, and can scale managed capacity without requiring you to build a scheduler.',
  whyItMatters: 'It separates work submission from compute capacity. Teams can process bursts of thousands of jobs without keeping a permanent fleet sized for the busiest hour.',
  workplaceExample: 'A media company submits one transcoding job per uploaded video. Jobs wait safely in a queue, Batch adds compute when needed, and capacity scales down after the backlog clears.',
  examFocus: 'Recognize Batch for asynchronous, containerized batch workloads needing queues, dependencies, retries, priorities, or large-scale compute. Batch is not a persistent web service and does not replace the application code inside the container.',
  keyPoints: ['Batch manages scheduling rather than the business logic.', 'Jobs are containerized units of work.', 'Job definitions describe execution requirements.', 'Queues hold jobs until eligible capacity is available.', 'Managed compute environments can scale capacity with demand.'],
  commonMistake: 'Expecting Batch to package the application automatically. The application and its dependencies must already be available through a suitable container image.',
  example: 'Package a report generator in ECR, register a job definition, submit report jobs to a queue, and let a managed Fargate or EC2 environment provide capacity.',
  sources: [{ title: 'What is AWS Batch?', url: 'https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html' }, { title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }]
});
