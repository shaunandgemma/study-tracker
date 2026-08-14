import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecs-11', topicId: 'topic-ecs', topicTitle: 'ECS (Elastic Container Service)', objectiveCode: 'Containers',
  title: 'ECS on EC2', status: 'ready',
  plainEnglish: 'With the EC2 launch type, your ECS tasks run on EC2 container instances that you provision and manage.',
  whyItMatters: 'EC2 offers instance choice, host-level control and potential savings, but you manage capacity, patching and the ECS agent.',
  workplaceExample: 'A graphics workload uses GPU-enabled EC2 instances in an ECS cluster because its hardware is not available through Fargate.',
  examFocus: 'Choose ECS on EC2 when host control or special instance features matter; remember that the customer manages the instances.',
  keyPoints: ['Container instances register with an ECS cluster.', 'The ECS agent connects instances to ECS.', 'Tasks consume available instance CPU, memory and ports.', 'Auto Scaling groups can supply capacity.', 'The EC2 instance role is different from the task role.'],
  commonMistake: 'Scaling the service desired count without ensuring the cluster has enough EC2 capacity.',
  example: 'An Auto Scaling group supplies three Graviton instances through an ECS capacity provider.',
  sources: [{ title: 'Amazon ECS EC2 launch type', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch-type-ec2.html' }]
});
