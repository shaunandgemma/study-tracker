import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-21', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch with Amazon ECR', status: 'ready',
  plainEnglish: 'Amazon ECR stores the container images referenced by Batch job definitions. When a job starts, its execution platform authenticates to ECR, downloads the selected image manifest and layers, and launches the configured command.',
  whyItMatters: 'A versioned private registry gives teams a controlled, repeatable source for the exact application and dependencies used by a batch job.',
  workplaceExample: 'A deployment pipeline scans an image, pushes it to ECR with an immutable release tag, and registers a new job-definition revision that references the image digest.',
  examFocus: 'The job definition references the image URI. Pull permissions belong to the appropriate execution or instance role, and the compute environment needs network reachability to ECR plus S3 for image layers when applicable. Prefer immutable tags or digests for reproducibility.',
  keyPoints: ['ECR stores private container images.', 'A job definition identifies the image to run.', 'The execution platform needs ECR pull permissions.', 'Private networking requires NAT or suitable VPC endpoints.', 'Image scanning and immutable references improve supply-chain control.'],
  commonMistake: 'Giving ECR permissions to the application job role when the failure occurs before the container starts. Image pulling is a platform responsibility.',
  example: 'If a job remains in STARTING and reports a pull error, check the image URI, repository policy, execution or instance role, and ECR network path.',
  sources: [{ title: 'AWS Batch job definitions', url: 'https://docs.aws.amazon.com/batch/latest/userguide/job_definitions.html' }, { title: 'ECR permissions for IAM policies', url: 'https://docs.aws.amazon.com/AmazonECR/latest/userguide/security_iam_id-based-policy-examples.html' }]
});
