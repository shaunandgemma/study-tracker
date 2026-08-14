import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-18', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Retry Strategies', status: 'ready',
  plainEnglish: 'A retry strategy tells Batch how many total attempts a failed job may receive and can use evaluateOnExit rules to retry or exit according to an exit code, status reason, or reason pattern. The default is one attempt, and container jobs support between one and ten attempts.',
  whyItMatters: 'Selective retries recover from temporary host or service failures without repeatedly running a job that has a permanent input or application error.',
  workplaceExample: 'A processor retries infrastructure failures up to three total attempts but exits immediately for an application exit code that means the input file is invalid.',
  examFocus: 'Attempts includes the first run, not just repeats. With three attempts, the job can run once and retry twice. Use evaluateOnExit to distinguish retryable conditions from permanent failures, and design repeated jobs to be idempotent.',
  keyPoints: ['The default retry strategy permits one attempt.', 'Attempts can be configured on a definition or submission.', 'evaluateOnExit can choose RETRY or EXIT.', 'Non-zero container exit codes normally indicate failure.', 'Each retry is a new attempt and must tolerate repeated side effects.'],
  commonMistake: 'Retrying every error. Bad input or invalid configuration will consume time and money repeatedly unless a matching rule exits.',
  example: 'Configure three attempts, retry transient host failures, and exit on the application code used for invalid input. Store outputs with idempotent keys to prevent duplicates.',
  sources: [{ title: 'Automated job retries', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_retries.html' }, { title: 'Submit an AWS Batch job', url: 'https://docs.aws.amazon.com/batch/latest/userguide/submit_job.html' }]
});
