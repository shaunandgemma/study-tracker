import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecs-6', topicId: 'topic-ecs', topicTitle: 'ECS (Elastic Container Service)', objectiveCode: 'Containers',
  title: 'Amazon ECS Container Orchestration', status: 'ready',
  plainEnglish: 'Amazon ECS runs and coordinates containers. You describe the container in a task definition, then run it once as a task or keep copies running through a service.',
  whyItMatters: 'ECS handles placement, replacement, scaling and integration with AWS networking, IAM, logging and load balancing.',
  workplaceExample: 'A team stores an image in ECR and uses an ECS service to keep six API tasks available across multiple Availability Zones.',
  examFocus: 'Separate the control concepts: cluster is the boundary, task definition is the blueprint, task is a running copy and service maintains the desired count.',
  keyPoints: ['ECS is a managed container orchestrator.', 'Tasks can run on Fargate or ECS container instances.', 'Services replace failed tasks.', 'Task definitions are revisioned.', 'ECS integrates with load balancers and service discovery.'],
  commonMistake: 'Treating a container image as a complete deployment without a task definition and runtime capacity.',
  example: 'Register a task definition for an nginx image and create a service with desired count two.',
  sources: [{ title: 'What is Amazon ECS?', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html' }]
});
