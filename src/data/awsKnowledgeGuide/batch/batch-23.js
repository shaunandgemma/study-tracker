import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-23', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch vs AWS Lambda', status: 'ready',
  plainEnglish: 'AWS Lambda runs short-lived functions in response to events without managing servers. AWS Batch schedules containerized jobs through queues onto Fargate or EC2 capacity. Both can process asynchronous work, but their execution model, limits, packaging, and orchestration features differ.',
  whyItMatters: 'Selecting the right service avoids forcing long, resource-heavy processing into a function model or building unnecessary container infrastructure for a small event handler.',
  workplaceExample: 'An S3 upload invokes Lambda to validate metadata in seconds. It then submits a multi-hour video rendering job to Batch, where the container requests substantial CPU and memory and uses retries and job dependencies.',
  examFocus: 'Choose Lambda for event-driven functions that fit Lambda duration, runtime, storage, and resource limits. Choose Batch for queued container jobs, long-running work, custom images, GPUs, high compute, arrays, dependencies, or multi-node processing. Batch jobs can still run serverlessly on Fargate.',
  keyPoints: ['Lambda is function-oriented and event-driven.', 'Batch is queue-and-scheduler oriented for container jobs.', 'Batch supports EC2 instance selection and specialised compute.', 'Lambda scales function invocations without a job queue definition.', 'EventBridge, S3, Step Functions, or application code can initiate either service.'],
  commonMistake: 'Choosing Lambda only because the workload is asynchronous. Duration, compute shape, container needs, retry model, and workflow requirements determine the better fit.',
  example: 'Use Lambda to inspect an uploaded object and submit a Batch job when the file requires a large conversion, keeping the fast event handler separate from heavy processing.',
  sources: [{ title: 'Choosing an AWS container service', url: 'https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html' }, { title: 'AWS Fargate or AWS Lambda decision guide', url: 'https://docs.aws.amazon.com/pdfs/decision-guides/latest/fargate-or-lambda/fargate-or-lambda.pdf' }, { title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }]
});
