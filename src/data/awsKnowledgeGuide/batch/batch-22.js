import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-22', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch with CloudWatch Logs', status: 'ready',
  plainEnglish: 'The awslogs log driver sends container standard output and standard error to CloudWatch Logs. AWS Batch enables this driver by default, commonly using the /aws/batch/job log group and a stream associated with the job definition and task.',
  whyItMatters: 'Central logs let operators investigate jobs after containers or temporary compute instances have stopped, and support searches, metric filters, retention, alarms, and incident evidence.',
  workplaceExample: 'A failed invoice job prints its input identifier and validation error to standard error. An operator opens the job, follows its log-stream link, and diagnoses the bad record without accessing a worker host.',
  examFocus: 'Container output must be written to stdout or stderr for awslogs to capture it. The relevant execution or instance role needs Logs permissions, and private workloads need connectivity to CloudWatch Logs. Configure retention to control storage cost.',
  keyPoints: ['awslogs centralizes stdout and stderr.', 'Log configuration belongs in the job definition.', 'A job log stream provides per-execution evidence.', 'Permissions and network access are required to deliver logs.', 'Retention and encryption should match organizational requirements.'],
  commonMistake: 'Writing application logs only to a file inside the ephemeral container and expecting them to appear automatically in CloudWatch Logs.',
  example: 'Print structured JSON to stdout, locate the stream from the Batch job details, and use CloudWatch Logs Insights to filter by job or correlation ID.',
  sources: [{ title: 'Use the awslogs log driver', url: 'https://docs.aws.amazon.com/batch/latest/userguide/using_awslogs.html' }, { title: 'AWS Batch job states and logs', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_states.html' }]
});
