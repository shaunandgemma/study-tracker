import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecs-10', topicId: 'topic-ecs', topicTitle: 'ECS (Elastic Container Service)', objectiveCode: 'Containers',
  title: 'ECS Services', status: 'ready',
  plainEnglish: 'An ECS service keeps a requested number of copies of a task running and can replace unhealthy tasks or deploy a new task-definition revision.',
  whyItMatters: 'Services provide the long-running, self-healing deployment model used for APIs, websites and workers.',
  workplaceExample: 'An API service maintains four tasks behind an Application Load Balancer and replaces any task that fails its health check.',
  examFocus: 'Services support rolling or blue/green deployment options, load balancing, auto scaling and service discovery.',
  keyPoints: ['Desired count defines how many tasks should run.', 'The scheduler replaces stopped service tasks.', 'A service can spread tasks across Availability Zones.', 'Updating a task definition can start a deployment.', 'Deployment configuration controls healthy task percentages.'],
  commonMistake: 'Changing a task definition but forgetting to update the service to use the new revision.',
  example: 'Update an ECS service from app:4 to app:5 and let the rolling deployment replace tasks gradually.',
  sources: [{ title: 'Amazon ECS services', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html' }]
});
