import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-6', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Job Definitions', status: 'ready',
  plainEnglish: 'A job definition is the reusable blueprint for a Batch job. It can specify the container image, command, vCPU and memory, environment variables, volumes, logging, retry and timeout settings, platform capabilities, and IAM roles. Registering a change creates a new revision.',
  whyItMatters: 'Definitions make execution repeatable while still allowing approved values to be overridden for an individual submission.',
  workplaceExample: 'A team maintains one invoice-processing definition using an ECR image and a least-privilege job role. Each submitted job overrides only the input S3 object key.',
  examFocus: 'The job definition describes how to run; the job queue controls where work waits; the compute environment supplies capacity. Use parameters and command substitution for reusable definitions, and never place plaintext secrets in environment variables.',
  keyPoints: ['Job definitions are revisioned.', 'Container properties include image, command, vCPU, memory, roles, and logging.', 'Selected properties can be overridden when a job is submitted.', 'The job role grants application access to AWS services.', 'Execution roles support platform actions such as pulling images and sending logs.'],
  commonMistake: 'Putting credentials or secrets directly in environment variables. Reference supported secret stores and grant only the job role the required read permission.',
  example: 'Revision 3 can change the image tag and memory while existing submissions that reference revision 2 retain their original definition.',
  sources: [{ title: 'AWS Batch job definitions', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_definitions.html' }, { title: 'Job definition API object', url: 'https://docs.aws.amazon.com/batch/latest/APIReference/API_JobDefinition.html' }]
});
