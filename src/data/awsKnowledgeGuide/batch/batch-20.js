import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-20', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'IAM Roles for AWS Batch', status: 'ready',
  plainEnglish: 'AWS Batch uses different IAM roles for different actors. The service-linked role lets Batch manage supporting AWS resources. An EC2 instance role lets container instances interact with ECS. An execution role supports platform operations such as pulling a private image and writing logs. A job role supplies temporary credentials to the application inside the container.',
  whyItMatters: 'Separating roles follows least privilege and makes it clear whether a permissions failure belongs to Batch, the host or task platform, or the application code.',
  workplaceExample: 'The execution role reads an ECR image and writes CloudWatch logs, while the job role can read only one input S3 prefix and write only one output prefix.',
  examFocus: 'Use the job role for application calls to services such as S3 or DynamoDB. iam:PassRole is required by the submitting identity when it passes an approved role. Managed EC2 environments normally use AWSServiceRoleForBatch and an ECS instance profile.',
  keyPoints: ['Service-linked role: Batch manages infrastructure.', 'Instance role: EC2 container instances communicate with ECS.', 'Execution role: the container platform pulls images and sends logs.', 'Job role: application code accesses AWS APIs.', 'The submitter may need iam:PassRole for the specified roles.'],
  commonMistake: 'Granting S3 data access to the Batch service-linked role instead of the job role used by the container application.',
  example: 'When an image pulls successfully but the application gets AccessDenied from S3, inspect the job role rather than expanding the service-linked role.',
  sources: [{ title: 'How AWS Batch works with IAM', url: 'https://docs.aws.amazon.com/batch/latest/userguide/security_iam_service-with-iam.html' }, { title: 'Using service-linked roles for AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/using-service-linked-roles-batch-general.html' }, { title: 'Troubleshoot AWS Batch IAM', url: 'https://docs.aws.amazon.com/batch/latest/userguide/security_iam_troubleshoot.html' }]
});
