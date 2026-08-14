import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-15', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Job Dependencies', status: 'ready',
  plainEnglish: 'A dependency tells Batch not to run a job until specified earlier jobs succeed. The dependent job waits in PENDING. After all dependencies succeed it becomes RUNNABLE; if a dependency fails, the dependent job also transitions to FAILED.',
  whyItMatters: 'Dependencies create safe processing chains and stop downstream work from consuming missing, partial, or invalid output.',
  workplaceExample: 'A data pipeline runs extraction, validation, transformation, and reporting. Each stage references the preceding job ID so a failed validation prevents transformation and reporting.',
  examFocus: 'A job can depend on up to 20 other jobs. Array jobs support SEQUENTIAL execution or N_TO_N relationships between corresponding child indexes. Use a broader orchestrator when the workflow needs complex branching, compensation, or service coordination.',
  keyPoints: ['Dependencies are supplied when submitting a job.', 'Successful parents release a dependent job from PENDING.', 'A failed parent causes the dependent job to fail.', 'SEQUENTIAL orders children in an array job.', 'N_TO_N maps corresponding child indexes between array jobs.'],
  commonMistake: 'Referencing job names instead of preserving the exact submitted job IDs required by dependsOn.',
  example: 'Submit validate, record its job ID, and submit transform with that ID as a dependency. Transform cannot run against unvalidated input.',
  sources: [{ title: 'AWS Batch job dependencies', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_dependencies.html' }, { title: 'Submit an AWS Batch job', url: 'https://docs.aws.amazon.com/batch/latest/userguide/submit_job.html' }]
});
