import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-19', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Job Timeouts', status: 'ready',
  plainEnglish: 'A job timeout limits how long one running attempt may continue. attemptDurationSeconds starts from the attempt startedAt time and must be at least 60 seconds. Without a timeout, a job can continue until its container exits.',
  whyItMatters: 'Timeouts contain cost and capacity damage from deadlocks, infinite loops, stalled network calls, or unexpectedly slow input.',
  workplaceExample: 'A report normally finishes in 15 minutes, so the team sets a 30-minute timeout. A stuck attempt receives SIGTERM and, if it does not stop, SIGKILL after the grace period.',
  examFocus: 'A timeout is per attempt. A self-failed attempt that is retried receives a fresh timeout countdown, but a job terminated because it exceeded its timeout is not retried. Timeout termination is best effort rather than exact to the second.',
  keyPoints: ['No timeout is applied by default.', 'The minimum configured timeout is 60 seconds.', 'The container receives SIGTERM before forced termination.', 'Timeout is measured separately for each attempt.', 'Fargate jobs should not be expected to run longer than 14 days.'],
  commonMistake: 'Assuming a retry strategy will restart a job that Batch terminated for exceeding its timeout.',
  example: 'Set a timeout comfortably above normal duration, handle SIGTERM to save a checkpoint, and alert when timeout failures appear.',
  sources: [{ title: 'AWS Batch job timeouts', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_timeouts.html' }]
});
