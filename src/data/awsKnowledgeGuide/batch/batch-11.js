import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'batch-11', topicId: 'topic-batch', topicTitle: 'AWS Batch', objectiveCode: 'Compute', title: 'AWS Batch with Amazon EC2', status: 'ready',
  plainEnglish: 'An EC2-backed Batch environment runs container jobs on ECS container instances. You can select instance families, On-Demand or Spot purchasing, allocation strategy, AMI configuration, launch templates, networking, vCPU limits, and optional accelerators.',
  whyItMatters: 'EC2 offers host-level flexibility for jobs that need GPUs, high memory, local storage, custom AMIs, privileged behaviour, or multi-node parallel execution.',
  workplaceExample: 'A machine-learning preprocessing workload uses GPU-capable EC2 families in a managed environment, while Batch scales the fleet according to queued GPU requirements.',
  examFocus: 'Choose EC2 rather than Fargate when the workload needs unsupported Fargate features, custom instance selection, GPU scheduling, or multi-node parallel jobs. Workers require an ECS instance profile and network access to required endpoints.',
  keyPoints: ['Batch registers EC2 workers into an ECS cluster.', 'Instance choices must satisfy job vCPU, memory, architecture, and accelerator needs.', 'A launch template can apply supported host configuration.', 'Private-subnet workers need NAT or suitable VPC endpoints.', 'The instanceRole setting expects an instance-profile ARN.'],
  commonMistake: 'Supplying an IAM role ARN where the EC2 compute environment expects an instance profile ARN.',
  example: 'Use a managed On-Demand environment with BEST_FIT_PROGRESSIVE for predictable jobs, compatible instance families, minimum zero vCPUs, and private subnets with endpoint access.',
  sources: [{ title: 'Create a managed EC2 compute environment', url: 'https://docs.aws.amazon.com/batch/latest/userguide/create-compute-environment-managed-ec2.html' }, { title: 'Compute environment template', url: 'https://docs.aws.amazon.com/batch/latest/userguide/compute-environment-template.html' }]
});
