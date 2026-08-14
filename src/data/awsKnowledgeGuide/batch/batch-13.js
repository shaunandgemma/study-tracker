import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-13', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch with AWS Fargate', status: 'ready',
  plainEnglish: 'Fargate runs each Batch container without exposing or requiring management of EC2 hosts. You provide supported CPU and memory values, networking, security groups, IAM roles, and the image; AWS supplies isolated compute for the job.',
  whyItMatters: 'Fargate reduces operational work and is effective for many ordinary container jobs when host customization and specialised hardware are unnecessary.',
  workplaceExample: 'A team runs hundreds of short document-conversion jobs each day on Fargate. It pays for job resources without patching an EC2 worker fleet.',
  examFocus: 'Choose Fargate for serverless container execution and faster setup. Choose EC2 for GPUs, custom AMIs, some very large resource shapes, privileged host access, or multi-node parallel jobs. Fargate is only available with managed ECS Batch environments.',
  keyPoints: ['No EC2 instance management is required.', 'Each Fargate job has its own isolation boundary.', 'CPU and memory must use supported combinations.', 'Jobs still need network access and IAM permissions.', 'Fargate Spot is cheaper but interruptible.'],
  commonMistake: 'Assuming serverless means no networking or permissions configuration. A private Fargate task still needs routes or endpoints to pull images and reach required services.',
  example: 'Run a short conversion container in private subnets, use an execution role for ECR and logs, and a separate job role for its S3 input and output.',
  sources: [{ title: 'Fargate compute environments', url: 'https://docs.aws.amazon.com/batch/latest/userguide/fargate.html' }, { title: 'When to use Fargate with AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/when-to-use-fargate.html' }]
});
