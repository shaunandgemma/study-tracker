import { createAwsKnowledgeGuide } from '../createAwsKnowledgeGuide.js';

export default createAwsKnowledgeGuide({
  id: 'ecs-7', topicId: 'topic-ecs', topicTitle: 'ECS (Elastic Container Service)', objectiveCode: 'Containers',
  title: 'ECS Clusters', status: 'ready',
  plainEnglish: 'An ECS cluster is a logical home for tasks, services and capacity providers. It does not automatically mean a group of EC2 instances.',
  whyItMatters: 'Clusters separate workloads and define the capacity options on which tasks may run.',
  workplaceExample: 'A company keeps production and development services in separate clusters and attaches different capacity-provider strategies.',
  examFocus: 'A Fargate-only cluster can have no customer-managed servers; an EC2 cluster needs registered container instances or an EC2 capacity provider.',
  keyPoints: ['Clusters are Region-specific.', 'A cluster can support Fargate and EC2 capacity.', 'Services and standalone tasks belong to a cluster.', 'Capacity providers can be associated with a cluster.', 'Clusters provide a logical isolation boundary, not network isolation by themselves.'],
  commonMistake: 'Creating a cluster and expecting EC2 capacity to appear without an Auto Scaling group or container instances.',
  example: 'Create prod-cluster and associate FARGATE and FARGATE_SPOT capacity providers.',
  sources: [{ title: 'Amazon ECS clusters', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html' }]
});
