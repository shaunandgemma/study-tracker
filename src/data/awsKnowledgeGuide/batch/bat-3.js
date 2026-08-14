import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'bat-3', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute',
  title: 'Automated Job Scheduling & Dependency Workflow Pipelines', status: 'ready',
  plainEnglish: 'AWS Batch schedules submitted jobs when their dependencies are satisfied and suitable compute capacity is available. A dependent job remains PENDING until its parent jobs succeed. Queues use FIFO by default or can use fair-share scheduling, while explicit dependsOn relationships define workflow order.',
  whyItMatters: 'Data and scientific workloads often have stages such as extract, transform, analyse, and publish. Dependencies let Batch enforce that order without a worker repeatedly checking whether earlier work has finished.',
  workplaceExample: 'A nightly pipeline submits ten array jobs to transform source files, an aggregate job that depends on them, and a reporting job that depends on the aggregate job. Failed transforms prevent incomplete reports from being produced.',
  examFocus: 'Use job dependencies for execution order and fair-share scheduling for equitable capacity allocation between users or workloads. Dependencies require successful completion; if a required job fails, the dependent job fails rather than running with incomplete input.',
  keyPoints: ['A job can depend on job IDs supplied at submission.', 'A dependent job moves from PENDING only after its dependencies succeed.', 'A failed dependency causes the dependent job to fail.', 'Array jobs support SEQUENTIAL and N_TO_N dependency types.', 'EventBridge or Step Functions can add scheduling and broader workflow orchestration around Batch.'],
  commonMistake: 'Using queue priority as a substitute for dependencies. Priority influences which eligible job runs first, but it does not prove that an upstream data-producing job succeeded.',
  example: 'Submit preprocess first, capture its job ID, then submit analyse with dependsOn referencing that ID. Submit publish with a dependency on analyse so each stage consumes only successful output.',
  sources: [{ title: 'Job dependencies', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_dependencies.html' }, { title: 'Fair-share scheduling policies', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_scheduling.html' }, { title: 'Submit an AWS Batch job', url: 'https://docs.aws.amazon.com/batch/latest/userguide/submit_job.html' }]
});
