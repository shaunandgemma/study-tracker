import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-9', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Managed Compute Environments', status: 'ready',
  plainEnglish: 'In a managed compute environment, AWS Batch creates and controls the supporting capacity according to your settings. For EC2 this can include launch templates, Auto Scaling groups, Spot Fleets, ECS clusters, and instances. For Fargate, AWS supplies serverless task capacity.',
  whyItMatters: 'Managed environments remove much of the scaling and placement work while still letting you set cost, networking, capacity, and instance constraints.',
  workplaceExample: 'A genomics team sets minimum vCPUs to zero and maximum vCPUs to 1,000. Batch adds EC2 Spot capacity for queued analyses and scales it back when the queue empties.',
  examFocus: 'Do not manually modify Batch-managed supporting resources unless AWS documentation explicitly permits it. Such changes can make environments INVALID or disrupt scaling. Custom AMIs remain the customer responsibility for patching and lifecycle management.',
  keyPoints: ['Batch creates and scales supported managed resources.', 'EC2 environments can use On-Demand or Spot.', 'Fargate environments avoid instance management.', 'The customer still controls VPC, subnets, security, limits, and job configuration.', 'Managed capacity can scale down when no jobs require it.'],
  commonMistake: 'Running unrelated ECS tasks on the ECS cluster created for a managed Batch environment. Batch assumes control and can interrupt or replace supporting resources.',
  example: 'Change instance choices or capacity settings through the Batch compute-environment update operation rather than editing its Auto Scaling group directly.',
  sources: [{ title: 'Managed compute environments', url: 'https://docs.aws.amazon.com/batch/latest/userguide/managed_compute_environments.html' }, { title: 'Create a managed EC2 compute environment', url: 'https://docs.aws.amazon.com/batch/latest/userguide/create-compute-environment-managed-ec2.html' }]
});
