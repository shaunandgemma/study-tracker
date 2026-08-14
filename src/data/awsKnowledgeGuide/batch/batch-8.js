import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-8', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'Compute Environments', status: 'ready',
  plainEnglish: 'A compute environment is the capacity pool on which Batch jobs run. Its configuration defines orchestration, managed or unmanaged control, compute type, vCPU limits, networking, security groups, instance choices, allocation strategy, and roles.',
  whyItMatters: 'A correct job can remain RUNNABLE when its environment lacks compatible capacity, network access, quota, or permissions.',
  workplaceExample: 'A private EC2 environment launches workers into private subnets. NAT or VPC endpoints provide access to ECS, ECR, and Logs so instances can register, pull images, and publish output.',
  examFocus: 'Match platform capability between the job definition, queue, and environment. EC2 environments allow instance and AMI control; Fargate abstracts hosts. Minimum, desired, and maximum vCPUs shape scaling for managed EC2 capacity.',
  keyPoints: ['Compute environments supply execution capacity.', 'Networking must allow required service and image-registry access.', 'Managed EC2 resources should be changed through Batch-supported controls.', 'Job resource requirements must fit available compute types.', 'Environment state and status help diagnose placement failures.'],
  commonMistake: 'Placing EC2 workers in private subnets without NAT or the necessary VPC endpoints. The instances may launch but fail to register or pull the container image.',
  example: 'If jobs stay RUNNABLE, verify the environment is ENABLED and VALID, max vCPUs is above zero, required instance types are available, and the subnets can reach required endpoints.',
  sources: [{ title: 'Components of AWS Batch', url: 'https://docs.aws.amazon.com/batch/latest/userguide/batch_components.html' }, { title: 'Compute environment template', url: 'https://docs.aws.amazon.com/batch/latest/userguide/compute-environment-template.html' }]
});
